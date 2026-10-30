const crypto = require('crypto');

const MASTER_SECRET = process.env.ED25519_MASTER_SECRET || 'aes_master_secret_qrinvite_pass_tokens_32char!';

/**
 * Derives a 32-byte key from the master secret for AES-256-GCM
 */
const getEncryptionKey = () => {
  return crypto.createHash('sha256').update(MASTER_SECRET).digest();
};

/**
 * Encrypts private key text using AES-256-GCM
 * Format: iv_hex:auth_tag_hex:encrypted_hex
 */
const encryptPrivateKey = (privateKeyPem) => {
  if (!privateKeyPem) return '';
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', getEncryptionKey(), iv);
  let encrypted = cipher.update(privateKeyPem, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag().toString('hex');
  return `${iv.toString('hex')}:${authTag}:${encrypted}`;
};

/**
 * Decrypts private key text from AES-256-GCM
 */
const decryptPrivateKey = (encryptedPayload) => {
  if (!encryptedPayload) return null;
  // If not encrypted in iv:tag:data format, return directly (unencrypted PEM fallback)
  if (!encryptedPayload.includes(':')) return encryptedPayload;

  const parts = encryptedPayload.split(':');
  if (parts.length !== 3) return encryptedPayload;

  try {
    const [ivHex, tagHex, encryptedHex] = parts;
    const decipher = crypto.createDecipheriv('aes-256-gcm', getEncryptionKey(), Buffer.from(ivHex, 'hex'));
    decipher.setAuthTag(Buffer.from(tagHex, 'hex'));
    let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (err) {
    console.error('Failed to decrypt private key:', err.message);
    return null;
  }
};

/**
 * Generates an RFC 8032 Ed25519 keypair for an event
 */
const generateEd25519KeyPair = () => {
  const { publicKey, privateKey } = crypto.generateKeyPairSync('ed25519', {
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
  });

  return {
    publicKeyPem: publicKey,
    privateKeyPem: privateKey,
    encryptedPrivateKey: encryptPrivateKey(privateKey),
  };
};

/**
 * Constructs the canonical string representation for RFC 8032 signing:
 * canonicalData = `${tid}|${eid}|${n}|${t}|${iat}`
 */
const getCanonicalData = (payload) => {
  const tid = String(payload.tid || payload.token || '');
  const eid = String(payload.eid || payload.eventId || '');
  const n = String(payload.n || payload.guestName || payload.name || '');
  const t = String(payload.t || payload.tier || 'REGULAR');
  const iat = String(payload.iat !== undefined ? payload.iat : Math.floor(Date.now() / 1000));

  return `${tid}|${eid}|${n}|${t}|${iat}`;
};

/**
 * Signs canonical payload using Ed25519 private key
 */
const signPayload = (payload, privateKeyPemOrEncrypted) => {
  const privateKeyPem = decryptPrivateKey(privateKeyPemOrEncrypted);
  if (!privateKeyPem) {
    throw new Error('Valid Ed25519 private key is required for signing');
  }

  const canonical = getCanonicalData(payload);
  const signature = crypto.sign(null, Buffer.from(canonical, 'utf8'), privateKeyPem);
  return signature.toString('base64url');
};

/**
 * Creates compact payload object, Base64URL string, and signature
 * compact payload object: { tid, eid, n, t, iat, sig }
 */
const createSignedQRPayload = (ticketOrPayload, privateKeyPemOrEncrypted) => {
  const iat = ticketOrPayload.iat !== undefined ? Number(ticketOrPayload.iat) : Math.floor(Date.now() / 1000);
  const normalized = {
    tid: String(ticketOrPayload.tid || ticketOrPayload.qrToken || ticketOrPayload._id || ticketOrPayload.id || ''),
    eid: String(ticketOrPayload.eid || ticketOrPayload.eventId || ticketOrPayload.event?._id || ticketOrPayload.event || ''),
    n: String(ticketOrPayload.n || ticketOrPayload.guestName || ticketOrPayload.name || 'Guest'),
    t: String(ticketOrPayload.t || ticketOrPayload.tier || 'REGULAR'),
    iat,
  };

  const sig = signPayload(normalized, privateKeyPemOrEncrypted);
  const payloadObj = {
    ...normalized,
    sig,
  };

  const compactBase64Url = Buffer.from(JSON.stringify(payloadObj), 'utf8').toString('base64url');

  return {
    payloadObj,
    compactBase64Url,
    compactQrPayload: compactBase64Url,
    signature: sig,
    canonicalData: getCanonicalData(normalized),
  };
};

/**
 * Verifies Ed25519 signature against event public key
 * Accepts compact Base64URL string, JSON string, or payload object with sig
 */
const verifyQRPayload = (payloadInput, publicKeyPem) => {
  try {
    if (!payloadInput || !publicKeyPem) {
      return { valid: false, reason: 'MISSING_PARAMETERS' };
    }

    let payload = payloadInput;
    if (typeof payloadInput === 'string') {
      const trimmed = payloadInput.trim();
      if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
        try {
          payload = JSON.parse(trimmed);
        } catch {
          return { valid: false, reason: 'INVALID_JSON_PAYLOAD' };
        }
      } else {
        try {
          const decoded = Buffer.from(trimmed, 'base64url').toString('utf8');
          payload = JSON.parse(decoded);
        } catch {
          return { valid: false, reason: 'INVALID_BASE64URL_PAYLOAD' };
        }
      }
    }

    const { tid, eid, n, t, iat, sig } = payload;
    if (!tid || !sig) {
      return { valid: false, reason: 'MISSING_SIGNATURE_OR_TOKEN' };
    }

    const canonical = getCanonicalData({ tid, eid, n, t, iat });
    const signatureBuffer = Buffer.from(sig, 'base64url');

    const valid = crypto.verify(
      null,
      Buffer.from(canonical, 'utf8'),
      publicKeyPem,
      signatureBuffer
    );

    return { valid, payload, reason: valid ? null : 'SIGNATURE_MISMATCH' };
  } catch (err) {
    return { valid: false, reason: err.message };
  }
};

/**
 * Verifies payload and signature directly
 */
const verifyPayload = (payload, signatureBase64Url, publicKeyPem) => {
  if (!payload || !signatureBase64Url || !publicKeyPem) return false;
  return verifyQRPayload({ ...payload, sig: signatureBase64Url }, publicKeyPem).valid;
};

/**
 * Helper to generate signed pass token object from Ticket and Event models
 */
const createSignedPassToken = (ticket, event) => {
  const privateKey = event.privateKey || event.privateKeyEncrypted;
  const result = createSignedQRPayload(
    {
      tid: String(ticket.qrToken || ticket._id || ticket.id),
      eid: String(event._id || event.id),
      n: ticket.guestName || ticket.name || 'Guest',
      t: ticket.tier || 'REGULAR',
    },
    privateKey
  );

  return result;
};

module.exports = {
  generateEd25519KeyPair,
  encryptPrivateKey,
  decryptPrivateKey,
  getCanonicalData,
  signPayload,
  createSignedQRPayload,
  createSignedPassToken,
  verifyQRPayload,
  verifyPayload,
};
