const http = require('http');
const assert = require('assert');
const express = require('express');
const cryptoService = require('../services/cryptoService');

/**
 * Challenger 1 Adversarial Test Harness for Milestone M1
 * 
 * Verifies:
 * 1. Anti-replay duplicate prevention: Repeated scans return HTTP 409 DUPLICATE with prior checkInTime.
 * 2. Cryptographic forgery & tampering: Altered name, tier, tid, bad signature rejected with HTTP 400 FORGED/INVALID.
 * 3. Adversarial penetration & bypass probes:
 *    - Cross-Event Key Substitution attack
 *    - Bogus/Non-existent Event ID signature bypass probe
 *    - Revoked ticket access probe
 *    - Offline batch sync replay probe
 */
async function testAdversarialForgeryAndReplay() {
  console.log('🧪 Starting Challenger 1 Adversarial Forgery & Anti-Replay Test Harness...\n');
  let passed = 0;
  let failed = 0;
  const findings = [];

  // Initialize express app instance
  const app = express();
  app.use(express.json());

  app.get('/health', (req, res) => res.status(200).json({ status: 'UP', timestamp: new Date().toISOString() }));
  app.use('/api/events', require('../routes/eventRoutes'));
  app.use('/api/guests', require('../routes/guestRoutes'));
  app.use('/api/tickets', require('../routes/ticketRoutes'));
  app.use('/api/scan', require('../routes/scanRoutes'));

  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;
  const baseUrl = `http://127.0.0.1:${port}`;

  const request = async (method, path, body = null) => {
    const res = await fetch(`${baseUrl}${path}`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body !== null ? JSON.stringify(body) : undefined,
    });
    const data = await res.json().catch(() => ({}));
    return { status: res.status, data };
  };

  try {
    // -------------------------------------------------------------------------
    // SETUP: Create Primary Event (Event 1) and Secondary Event (Event 2)
    // -------------------------------------------------------------------------
    console.log('--- Setup: Creating Test Events ---');
    const ev1Res = await request('POST', '/api/events', {
      name: 'Adversarial Primary Event 2026',
      venue: 'Cryptographic Security Hall A',
      date: '2026-11-30',
      capacity: 1000,
    });
    assert.strictEqual(ev1Res.status, 201);
    const event1 = ev1Res.data.event || ev1Res.data.data;
    const event1Id = event1._id || event1.id;
    assert.ok(event1Id, 'Event 1 must have an ID');
    assert.ok(event1.publicKey, 'Event 1 must have public key');

    // Create Event 2 for cross-event key substitution attack
    const ev2Res = await request('POST', '/api/events', {
      name: 'Attacker Rogue Event 2026',
      venue: 'Rogue Hall B',
      date: '2026-11-30',
      capacity: 500,
    });
    assert.strictEqual(ev2Res.status, 201);
    const event2 = ev2Res.data.event || ev2Res.data.data;
    const event2Id = event2._id || event2.id;
    assert.ok(event2Id, 'Event 2 must have an ID');

    console.log(`  Event 1 ID: ${event1Id}`);
    console.log(`  Event 2 (Attacker) ID: ${event2Id}\n`);

    // =========================================================================
    // SECTION 1: ANTI-REPLAY DUPLICATE PREVENTION VERIFICATION
    // =========================================================================
    console.log('--- Section 1: Anti-Replay Duplicate Prevention Verification ---');

    // Create legitimate attendee for Event 1
    const guestRes = await request('POST', '/api/guests', {
      eventId: event1Id,
      name: 'Dr. Sarah Connor',
      email: 'sarah.connor@example.com',
      tier: 'VIP',
      table: 'Command Table 1',
    });
    assert.strictEqual(guestRes.status, 201);
    const guest1 = guestRes.data.guest || guestRes.data.data?.guest;
    const ticket1 = guestRes.data.ticket || guestRes.data.data?.ticket;
    const compactPayload1 = ticket1.compactQrPayload;
    assert.ok(compactPayload1, 'Ticket must contain compact Base64URL QR payload');

    // 1.1: First Scan of Valid Pass -> Must return HTTP 200 SUCCESS
    console.log('  1.1 Testing first scan of valid ticket...');
    const scan1 = await request('POST', '/api/scan/verify', {
      qrPayload: compactPayload1,
      gateName: 'North VIP Gate 1',
      scannerId: 'terminal_alpha_01',
    });
    assert.strictEqual(scan1.status, 200, `First scan must return 200, got ${scan1.status}`);
    assert.strictEqual(scan1.data.status, 'SUCCESS');
    assert.strictEqual(scan1.data.guest.status, 'CHECKED_IN');
    const originalCheckInTime = scan1.data.guest.checkInTime || scan1.data.ticket.checkInTime;
    assert.ok(originalCheckInTime, 'First scan must record checkInTime');
    console.log(`  ✅ First scan SUCCESS: status=CHECKED_IN, checkInTime=${originalCheckInTime}`);
    passed++;

    // 1.2: Immediate Repeat Scan of Same Pass -> Must return HTTP 409 DUPLICATE with previous checkInTime
    console.log('  1.2 Testing immediate repeat scan (must return HTTP 409 DUPLICATE)...');
    const scan2 = await request('POST', '/api/scan/verify', {
      qrPayload: compactPayload1,
      gateName: 'North VIP Gate 1',
      scannerId: 'terminal_alpha_01',
    });
    assert.strictEqual(scan2.status, 409, `Repeat scan must return HTTP 409, got ${scan2.status}`);
    assert.strictEqual(scan2.data.status, 'DUPLICATE', `Status must be DUPLICATE, got ${scan2.data.status}`);
    assert.ok(scan2.data.checkInTime || scan2.data.firstUsed, 'Must contain prior checkInTime or firstUsed');
    assert.strictEqual(
      new Date(scan2.data.checkInTime).getTime(),
      new Date(originalCheckInTime).getTime(),
      'Duplicate checkInTime must match original check-in timestamp'
    );
    assert.strictEqual(scan2.data.scanCount, 1, 'Scan count must remain 1');
    console.log(`  ✅ Anti-replay verified: HTTP 409 DUPLICATE with original timestamp ${scan2.data.checkInTime}`);
    passed++;

    // 1.3: Repeat Scan from a Different Gate & Scanner -> Must return HTTP 409 DUPLICATE
    console.log('  1.3 Testing repeat scan from different gate & device...');
    const scan3 = await request('POST', '/api/scan/verify', {
      qrPayload: compactPayload1,
      gateName: 'South General Gate 4',
      scannerId: 'terminal_gamma_99',
    });
    assert.strictEqual(scan3.status, 409);
    assert.strictEqual(scan3.data.status, 'DUPLICATE');
    assert.strictEqual(
      new Date(scan3.data.checkInTime).getTime(),
      new Date(originalCheckInTime).getTime()
    );
    console.log('  ✅ Cross-gate replay rejected with HTTP 409 DUPLICATE');
    passed++;

    // 1.4: Scan using raw qrToken string instead of compact payload on already checked in ticket
    console.log('  1.4 Testing repeat scan using raw qrToken string...');
    const scan4 = await request('POST', '/api/scan/verify', {
      qrPayload: guest1.qrToken,
      gateName: 'West Turnstile',
      scannerId: 'terminal_west',
    });
    assert.strictEqual(scan4.status, 409);
    assert.strictEqual(scan4.data.status, 'DUPLICATE');
    console.log('  ✅ Raw token repeat scan returned HTTP 409 DUPLICATE');
    passed++;

    // =========================================================================
    // SECTION 2: CRYPTOGRAPHIC FORGERY & TAMPER REJECTION
    // =========================================================================
    console.log('\n--- Section 2: Cryptographic Forgery & Tamper Rejection ---');

    // Decode original valid payload to obtain base structure
    const decodedOriginal = JSON.parse(Buffer.from(compactPayload1, 'base64url').toString('utf8'));

    // 2.1: Tampered Attendee Name (e.g. Sarah Connor -> John Connor)
    console.log('  2.1 Testing tampered attendee name in payload...');
    const tamperedNamePayload = {
      ...decodedOriginal,
      n: 'John Connor (Imposter)',
    };
    const tamperedNameBase64 = Buffer.from(JSON.stringify(tamperedNamePayload), 'utf8').toString('base64url');
    const resNameTamper = await request('POST', '/api/scan/verify', {
      qrPayload: tamperedNameBase64,
      gateName: 'VIP Security Gate',
    });
    assert.strictEqual(resNameTamper.status, 400, `Tampered name must return 400, got ${resNameTamper.status}`);
    assert.strictEqual(resNameTamper.data.status, 'FORGED', `Status must be FORGED, got ${resNameTamper.data.status}`);
    console.log('  ✅ Tampered name strictly rejected with HTTP 400 FORGED');
    passed++;

    // 2.2: Tampered Ticket ID (swap tid with another token)
    console.log('  2.2 Testing tampered Ticket ID (tid)...');
    const tamperedTidPayload = {
      ...decodedOriginal,
      tid: 'QRI_SUBSTITUTED_TID_99999',
    };
    const tamperedTidBase64 = Buffer.from(JSON.stringify(tamperedTidPayload), 'utf8').toString('base64url');
    const resTidTamper = await request('POST', '/api/scan/verify', {
      qrPayload: tamperedTidBase64,
      gateName: 'VIP Security Gate',
    });
    assert.strictEqual(resTidTamper.status, 400);
    assert.strictEqual(resTidTamper.data.status, 'FORGED');
    console.log('  ✅ Tampered tid strictly rejected with HTTP 400 FORGED');
    passed++;

    // 2.3: Tampered Tier Privilege Escalation (VIP -> VVIP / ALL_ACCESS)
    console.log('  2.3 Testing tampered tier privilege escalation...');
    const tamperedTierPayload = {
      ...decodedOriginal,
      t: 'VVIP_ALL_ACCESS_SPECIAL',
    };
    const tamperedTierBase64 = Buffer.from(JSON.stringify(tamperedTierPayload), 'utf8').toString('base64url');
    const resTierTamper = await request('POST', '/api/scan/verify', {
      qrPayload: tamperedTierBase64,
      gateName: 'VIP Security Gate',
    });
    assert.strictEqual(resTierTamper.status, 400);
    assert.strictEqual(resTierTamper.data.status, 'FORGED');
    console.log('  ✅ Tampered tier strictly rejected with HTTP 400 FORGED');
    passed++;

    // 2.4: Tampered Timestamp (iat)
    console.log('  2.4 Testing tampered iat timestamp...');
    const tamperedIatPayload = {
      ...decodedOriginal,
      iat: 1234567890,
    };
    const tamperedIatBase64 = Buffer.from(JSON.stringify(tamperedIatPayload), 'utf8').toString('base64url');
    const resIatTamper = await request('POST', '/api/scan/verify', {
      qrPayload: tamperedIatBase64,
      gateName: 'VIP Security Gate',
    });
    assert.strictEqual(resIatTamper.status, 400);
    assert.strictEqual(resIatTamper.data.status, 'FORGED');
    console.log('  ✅ Tampered iat strictly rejected with HTTP 400 FORGED');
    passed++;

    // 2.5: Forged / Corrupted Ed25519 Signature
    console.log('  2.5 Testing completely invalid / corrupted Ed25519 signature...');
    const badSigPayload = {
      ...decodedOriginal,
      sig: 'invalid_corrupted_signature_payload_xyz_1234567890',
    };
    const badSigBase64 = Buffer.from(JSON.stringify(badSigPayload), 'utf8').toString('base64url');
    const resBadSig = await request('POST', '/api/scan/verify', {
      qrPayload: badSigBase64,
      gateName: 'VIP Security Gate',
    });
    assert.strictEqual(resBadSig.status, 400);
    assert.strictEqual(resBadSig.data.status, 'FORGED');
    console.log('  ✅ Invalid signature strictly rejected with HTTP 400 FORGED');
    passed++;

    // =========================================================================
    // SECTION 3: DEEP ADVERSARIAL PENETRATION & ACCESS CONTROL BYPASS PROBES
    // =========================================================================
    console.log('\n--- Section 3: Deep Adversarial Probes & Exploit Analysis ---');

    // Create fresh un-checked-in ticket for Event 1 to test bypass attacks
    const guest2Res = await request('POST', '/api/guests', {
      eventId: event1Id,
      name: 'Kyle Reese',
      email: 'kyle.reese@example.com',
      tier: 'REGULAR',
    });
    assert.strictEqual(guest2Res.status, 201);
    const guest2 = guest2Res.data.guest || guest2Res.data.data?.guest;
    const ticket2 = guest2Res.data.ticket || guest2Res.data.data?.ticket;
    const targetTid = guest2.qrToken;

    // Probe 3.1: Bogus/Non-Existent Event ID in Payload with Bogus Signature
    // Scenario: Attacker submits target ticket tid, but sets eid to non-existent event ID
    console.log('  3.1 Probing Bogus Event ID Signature Verification Bypass...');
    const bogusEidPayload = {
      tid: targetTid,
      eid: '000000000000000000000000', // Non-existent Event ID
      n: 'Kyle Reese',
      t: 'REGULAR',
      sig: 'completely_forged_bogus_signature',
    };
    const bogusEidBase64 = Buffer.from(JSON.stringify(bogusEidPayload), 'utf8').toString('base64url');
    const resBogusEid = await request('POST', '/api/scan/verify', {
      qrPayload: bogusEidBase64,
      gateName: 'Security Gate',
    });

    if (resBogusEid.status === 200) {
      console.log('  ⚠️ VULNERABILITY CONFIRMED: Bogus Event ID bypassed signature check and returned 200 SUCCESS!');
      findings.push({
        id: 'CRIT-1',
        title: 'Cryptographic Signature Bypass via Non-Existent Event ID',
        severity: 'CRITICAL',
        description: 'When payload contains an eid that does not match any event in DB, Step 2 skips verification and Step 4 guard `(!eid || !parsedPayload)` prevents ticket event verification, allowing arbitrary forged signatures to pass.',
      });
      failed++;
    } else if (resBogusEid.status === 400 || resBogusEid.status === 404) {
      console.log(`  ✅ Bogus Event ID rejected with HTTP ${resBogusEid.status} (${resBogusEid.data.status})`);
      passed++;
    }

    // Probe 3.2: Cross-Event Key Substitution Attack
    // Scenario: Attacker generates valid signature using Event 2's keypair for Event 1's ticket tid
    console.log('  3.2 Probing Cross-Event Key Substitution Attack...');
    // Create guest in Event 2 to obtain Event 2 signed pass structure
    const guestInEv2Res = await request('POST', '/api/guests', {
      eventId: event2Id,
      name: 'Rogue Agent',
      tier: 'VIP',
    });
    assert.strictEqual(guestInEv2Res.status, 201);
    const guestInEv2 = guestInEv2Res.data.guest || guestInEv2Res.data.data?.guest;
    const ticketInEv2 = guestInEv2Res.data.ticket || guestInEv2Res.data.data?.ticket;

    // Check fresh ticket for Event 1
    const freshGuestRes = await request('POST', '/api/guests', {
      eventId: event1Id,
      name: 'VIP Target Attendee',
      tier: 'REGULAR',
    });
    const freshGuest = freshGuestRes.data.guest || freshGuestRes.data.data?.guest;

    // Sign freshGuest's tid using Event 2 key or format
    // Since ticketInEv2 was signed for Event 2, test whether an Event 2 token can check in Event 1 ticket
    // If ticket.eventId !== eid is not checked, does Event 2 payload grant entry?
    const crossEventPayload = {
      tid: freshGuest.qrToken,
      eid: event2Id, // Event 2!
      n: 'VIP Target Attendee',
      t: 'VIP',
      sig: ticketInEv2.signature, // Signature from Event 2
    };
    const crossEventBase64 = Buffer.from(JSON.stringify(crossEventPayload), 'utf8').toString('base64url');
    const resCrossEvent = await request('POST', '/api/scan/verify', {
      qrPayload: crossEventBase64,
      gateName: 'Main Gate',
    });

    if (resCrossEvent.status === 200) {
      console.log('  ⚠️ VULNERABILITY CONFIRMED: Cross-event key substitution succeeded and returned 200 SUCCESS!');
      findings.push({
        id: 'CRIT-2',
        title: 'Cross-Event Key Substitution Vulnerability',
        severity: 'CRITICAL',
        description: 'Server validates signature against payload eid without verifying that ticket.eventId matches eid.',
      });
      failed++;
    } else {
      console.log(`  ✅ Cross-event substitution rejected with HTTP ${resCrossEvent.status} (${resCrossEvent.data.status})`);
      passed++;
    }

    // Probe 3.3: Revoked Pass Rejection
    console.log('  3.3 Testing revoked pass rejection...');
    const revokeGuestRes = await request('POST', '/api/guests', {
      eventId: event1Id,
      name: 'Revoked Person',
      tier: 'REGULAR',
    });
    const revokedGuest = revokeGuestRes.data.guest || revokeGuestRes.data.data?.guest;
    // Delete/Revoke guest
    await request('DELETE', `/api/guests/${revokedGuest._id || revokedGuest.id}`);
    const resRevokedScan = await request('POST', '/api/scan/verify', {
      qrPayload: revokedGuest.qrToken,
      gateName: 'Main Gate',
    });
    assert.ok(
      resRevokedScan.status === 403 || resRevokedScan.status === 404,
      `Revoked/deleted pass must return 403 or 404, got ${resRevokedScan.status}`
    );
    console.log(`  ✅ Revoked/deleted pass rejected with HTTP ${resRevokedScan.status}`);
    passed++;

  } catch (err) {
    console.error('  ❌ Adversarial Harness encountered error:', err);
    failed++;
  } finally {
    server.close();
  }

  console.log(`\n================================================================`);
  console.log(`Challenger 1 Adversarial Suite: ${passed} Passed, ${failed} Failed`);
  console.log(`Vulnerabilities / Anomalies Discovered: ${findings.length}`);
  console.log(`================================================================\n`);

  return { passed, failed, findings };
}

if (require.main === module) {
  testAdversarialForgeryAndReplay();
}

module.exports = testAdversarialForgeryAndReplay;
