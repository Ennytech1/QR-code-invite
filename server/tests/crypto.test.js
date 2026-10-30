const assert = require('assert');
const cryptoService = require('../services/cryptoService');

async function testCrypto() {
  console.log('🧪 Testing RFC 8032 Ed25519 Cryptographic Service & AES-256-GCM Envelope Encryption...\n');
  let passed = 0;
  let failed = 0;

  try {
    // 1. Keypair generation
    console.log('  1. Generating Ed25519 keypair...');
    const keys = cryptoService.generateEd25519KeyPair();
    assert.ok(keys.publicKeyPem, 'Public key must be present');
    assert.ok(keys.privateKeyPem, 'Private key must be present');
    assert.ok(keys.encryptedPrivateKey, 'Encrypted private key must be present');
    assert.ok(keys.publicKeyPem.includes('BEGIN PUBLIC KEY'), 'Public key must be SPKI PEM');
    assert.ok(keys.privateKeyPem.includes('BEGIN PRIVATE KEY'), 'Private key must be PKCS#8 PEM');
    console.log('  ✅ Keypair generated successfully.');
    passed++;

    // 2. AES-256-GCM envelope encryption round-trip
    console.log('  2. Testing AES-256-GCM encryption & decryption round-trip...');
    const encrypted = cryptoService.encryptPrivateKey(keys.privateKeyPem);
    assert.ok(encrypted.includes(':'), 'Encrypted string must contain iv:tag:data');
    const decrypted = cryptoService.decryptPrivateKey(encrypted);
    assert.strictEqual(decrypted, keys.privateKeyPem, 'Decrypted private key must match original');
    console.log('  ✅ AES-256-GCM round-trip verified.');
    passed++;

    // 3. Canonical string formatting
    console.log('  3. Testing canonical data string formatting...');
    const payload = {
      tid: 'TKT_12345',
      eid: 'EVT_67890',
      n: 'John Doe',
      t: 'VIP',
      iat: 1700000000,
    };
    const canonical = cryptoService.getCanonicalData(payload);
    assert.strictEqual(canonical, 'TKT_12345|EVT_67890|John Doe|VIP|1700000000');
    console.log('  ✅ Canonical data string: ' + canonical);
    passed++;

    // 4. Ed25519 signature creation & verification
    console.log('  4. Testing Ed25519 QR payload signing and verification...');
    const signedData = cryptoService.createSignedQRPayload(payload, keys.encryptedPrivateKey);
    assert.ok(signedData.signature, 'Signature must be generated');
    assert.ok(signedData.compactBase64Url, 'Base64URL payload must be generated');
    assert.strictEqual(signedData.payloadObj.tid, 'TKT_12345');

    // Verify valid signature
    const verifyValid = cryptoService.verifyQRPayload(signedData.compactBase64Url, keys.publicKeyPem);
    assert.strictEqual(verifyValid.valid, true, 'Valid signature must verify as true');
    console.log('  ✅ Valid QR payload signature verified.');
    passed++;

    // 5. Tampered payload rejection
    console.log('  5. Testing tampered payload rejection...');
    const tamperedPayload = {
      ...signedData.payloadObj,
      n: 'Malicious Attacker', // Changed name
    };
    const verifyTampered = cryptoService.verifyQRPayload(tamperedPayload, keys.publicKeyPem);
    assert.strictEqual(verifyTampered.valid, false, 'Tampered payload must fail verification');
    console.log('  ✅ Tampered payload successfully rejected.');
    passed++;

    // 6. Bad signature rejection
    console.log('  6. Testing invalid signature rejection...');
    const badSigPayload = {
      ...signedData.payloadObj,
      sig: 'invalid_forged_sig_base64url',
    };
    const verifyBadSig = cryptoService.verifyQRPayload(badSigPayload, keys.publicKeyPem);
    assert.strictEqual(verifyBadSig.valid, false, 'Bad signature must fail verification');
    console.log('  ✅ Bad signature successfully rejected.');
    passed++;

  } catch (err) {
    console.error('  ❌ Crypto Test Failure:', err);
    failed++;
  }

  console.log(`\nCrypto Tests: ${passed} Passed, ${failed} Failed\n`);
  if (failed > 0) process.exit(1);
}

if (require.main === module) {
  testCrypto();
}

module.exports = testCrypto;
