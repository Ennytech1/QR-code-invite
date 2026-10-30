const http = require('http');
const assert = require('assert');
const express = require('express');
const cryptoService = require('../services/cryptoService');

/**
 * Challenger 2 Empirical Stress & Concurrency Test Suite
 * Milestone M1 Verification:
 * 1. Race condition scans across simultaneous gates (only 1 succeeds, all others rejected)
 * 2. Boundary conditions: missing payloads, invalid Base64URL, empty tokens, non-existent tickets, tampered signatures
 * 3. High concurrency burst stress verification
 */
async function testConcurrencyAndStress() {
  console.log('🧪 Starting Challenger 2 Concurrency, Boundary & Stress Test Suite...\n');
  let passed = 0;
  let failed = 0;

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
    // Setup: Create an Event for testing
    // -------------------------------------------------------------------------
    console.log('--- Setup: Creating Test Event ---');
    const evRes = await request('POST', '/api/events', {
      name: 'Challenger Stress Arena 2026',
      venue: 'National Security Center',
      date: '2026-12-01',
      capacity: 5000,
    });
    assert.strictEqual(evRes.status, 201, 'Setup event creation must return 201');
    const event = evRes.data.event || evRes.data.data;
    const eventId = event._id || event.id;
    assert.ok(eventId, 'Event must have an ID');
    console.log(`  Event created with ID: ${eventId}\n`);

    // =========================================================================
    // SECTION 1: CONCURRENT SCAN REQUESTS & RACE CONDITION VERIFICATION
    // =========================================================================
    console.log('--- Section 1: Concurrency & Race-Condition Verification ---');

    // Create a guest with valid signed pass
    const guest1Res = await request('POST', '/api/guests', {
      eventId,
      name: 'Concurrent Test Attendee #1',
      email: 'concurrent1@example.com',
      tier: 'VIP',
    });
    assert.strictEqual(guest1Res.status, 201);
    const guest1 = guest1Res.data.guest || guest1Res.data.data?.guest;
    const ticket1 = guest1Res.data.ticket || guest1Res.data.data?.ticket;
    const qrPayload1 = ticket1.compactQrPayload || guest1.qrToken;
    assert.ok(qrPayload1, 'Must have QR payload');

    // Test 1.1: Simultaneous scan across 10 gates at the EXACT SAME TIME
    console.log('  Testing 10 simultaneous gate scans on ticket #1...');
    const gateNames = [
      'North VIP Turnstile #1',
      'North VIP Turnstile #2',
      'South Gate Scanner #1',
      'South Gate Scanner #2',
      'East Gate FastTrack',
      'West Gate Access Terminal',
      'Underground VIP Entry',
      'Skybox Terminal 1',
      'Skybox Terminal 2',
      'Main Plaza Turnstile #3',
    ];

    const concurrentScanPromises = gateNames.map((gateName, index) =>
      request('POST', '/api/scan/verify', {
        qrPayload: qrPayload1,
        gateName,
        scannerId: `scanner_device_${index + 1}`,
      })
    );

    const scanResults = await Promise.all(concurrentScanPromises);

    const successResponses = scanResults.filter((r) => r.status === 200);
    const lockedOrDuplicateResponses = scanResults.filter(
      (r) => r.status === 429 || r.status === 409
    );

    console.log(`  -> 200 SUCCESS count: ${successResponses.length}`);
    console.log(`  -> 429 / 409 Rejected count: ${lockedOrDuplicateResponses.length}`);
    console.log(`  -> Total responses: ${scanResults.length}`);

    // Critical assertion: EXACTLY ONE scan must succeed with 200
    assert.strictEqual(
      successResponses.length,
      1,
      `RACE CONDITION FAILURE: Exactly 1 scan must succeed with 200, but got ${successResponses.length}`
    );
    assert.strictEqual(
      lockedOrDuplicateResponses.length,
      9,
      `All other 9 simultaneous scans must be rejected (429 or 409), got ${lockedOrDuplicateResponses.length}`
    );
    assert.strictEqual(
      successResponses[0].data.status,
      'SUCCESS',
      'Winning scan status must be SUCCESS'
    );
    console.log('  ✅ Test 1.1: Concurrency lock ensured EXACTLY ONE gate succeeded among 10 simultaneous scans.');
    passed++;

    // Test 1.2: Subsequent scan on the same ticket MUST return HTTP 409 DUPLICATE
    console.log('  Testing subsequent scan after lock release (must be 409 DUPLICATE)...');
    const subsequentRes = await request('POST', '/api/scan/verify', {
      qrPayload: qrPayload1,
      gateName: 'Delayed Scanner Gate',
      scannerId: 'scanner_device_delayed',
    });
    assert.strictEqual(
      subsequentRes.status,
      409,
      `Subsequent scan must return HTTP 409 DUPLICATE, but got ${subsequentRes.status}`
    );
    assert.strictEqual(
      subsequentRes.data.status,
      'DUPLICATE',
      'Status must be DUPLICATE'
    );
    assert.ok(
      subsequentRes.data.checkInTime || subsequentRes.data.firstUsed,
      'Duplicate response must contain prior checkInTime or firstUsed'
    );
    assert.strictEqual(
      subsequentRes.data.scanCount,
      1,
      'scanCount must be exactly 1'
    );
    console.log('  ✅ Test 1.2: Subsequent scan returned 409 DUPLICATE with prior timestamp and scanCount=1.');
    passed++;

    // Test 1.3: Two rapid simultaneous scans on a second fresh ticket
    const guest2Res = await request('POST', '/api/guests', {
      eventId,
      name: 'Concurrent Test Attendee #2',
      email: 'concurrent2@example.com',
      tier: 'REGULAR',
    });
    assert.strictEqual(guest2Res.status, 201);
    const guest2 = guest2Res.data.guest || guest2Res.data.data?.guest;
    const ticket2 = guest2Res.data.ticket || guest2Res.data.data?.ticket;
    const qrPayload2 = ticket2.compactQrPayload || guest2.qrToken;

    const dualScanResults = await Promise.all([
      request('POST', '/api/scan/verify', {
        qrPayload: qrPayload2,
        gateName: 'Gate Alpha',
        scannerId: 'device_A',
      }),
      request('POST', '/api/scan/verify', {
        qrPayload: qrPayload2,
        gateName: 'Gate Beta',
        scannerId: 'device_B',
      }),
    ]);

    const dualSuccess = dualScanResults.filter((r) => r.status === 200);
    const dualRejected = dualScanResults.filter((r) => r.status === 429 || r.status === 409);
    assert.strictEqual(dualSuccess.length, 1, 'Dual scan: exactly 1 must succeed');
    assert.strictEqual(dualRejected.length, 1, 'Dual scan: exactly 1 must be rejected');
    console.log('  ✅ Test 1.3: Dual simultaneous scan across 2 gates verified: 1 SUCCESS, 1 REJECTED.');
    passed++;

    // =========================================================================
    // SECTION 2: BOUNDARY CONDITIONS & ANOMALOUS PAYLOAD TESTS
    // =========================================================================
    console.log('\n--- Section 2: Boundary Conditions & Anomalous Payloads ---');

    // Test 2.1: Completely empty request body
    {
      const res = await request('POST', '/api/scan/verify', {});
      assert.strictEqual(res.status, 400, 'Empty body must return 400');
      assert.strictEqual(res.data.status, 'INVALID');
      console.log('  ✅ Test 2.1: Empty body {} returns 400 INVALID');
      passed++;
    }

    // Test 2.2: Empty string token / payload
    {
      const res = await request('POST', '/api/scan/verify', { qrPayload: '' });
      assert.strictEqual(res.status, 400, 'Empty qrPayload string must return 400');
      assert.strictEqual(res.data.status, 'INVALID');
      console.log('  ✅ Test 2.2: Empty string qrPayload returns 400 INVALID');
      passed++;
    }

    // Test 2.3: Whitespace-only token
    {
      const res = await request('POST', '/api/scan/verify', { qrPayload: '   ' });
      assert.strictEqual(res.status, 400, 'Whitespace token must return 400');
      assert.strictEqual(res.data.status, 'INVALID');
      console.log('  ✅ Test 2.3: Whitespace token returns 400 INVALID');
      passed++;
    }

    // Test 2.4: Non-existent ticket ID
    {
      const res = await request('POST', '/api/scan/verify', {
        qrPayload: 'QRI_NONEXISTENT_TICKET_99999999',
        gateName: 'Main Entrance',
      });
      assert.strictEqual(res.status, 404, 'Non-existent ticket must return 404');
      assert.strictEqual(res.data.status, 'INVALID');
      console.log('  ✅ Test 2.4: Non-existent ticket returns 404 INVALID');
      passed++;
    }

    // Test 2.5: Invalid Base64URL string (garbage characters)
    {
      const res = await request('POST', '/api/scan/verify', {
        qrPayload: '$$$INVALID_BASE64_GARBAGE!@#$%^&*()',
        gateName: 'Main Entrance',
      });
      assert.strictEqual(res.status, 404, 'Invalid Base64URL string not found in DB must return 404');
      assert.strictEqual(res.data.status, 'INVALID');
      console.log('  ✅ Test 2.5: Invalid Base64URL string returns 404 INVALID');
      passed++;
    }

    // Test 2.6: Malformed Base64URL containing invalid JSON
    {
      const badJsonBase64 = Buffer.from('{ bad json: true, ', 'utf8').toString('base64url');
      const res = await request('POST', '/api/scan/verify', {
        qrPayload: badJsonBase64,
        gateName: 'Main Entrance',
      });
      assert.strictEqual(res.status, 404, 'Malformed JSON in Base64URL must return 404');
      assert.strictEqual(res.data.status, 'INVALID');
      console.log('  ✅ Test 2.6: Malformed JSON inside Base64URL returns 404 INVALID');
      passed++;
    }

    // Test 2.7: Forged Ed25519 signature on an otherwise valid structure
    {
      const forgedPayload = {
        tid: 'tkt_forged_attempt_' + Date.now(),
        eid: eventId,
        n: 'Imposter Hacker',
        t: 'VIP',
        sig: 'bad_forged_signature_xyz_1234567890',
      };
      const forgedBase64 = Buffer.from(JSON.stringify(forgedPayload), 'utf8').toString('base64url');

      const res = await request('POST', '/api/scan/verify', {
        qrPayload: forgedBase64,
        gateName: 'VIP Security Gate',
      });
      assert.strictEqual(res.status, 400, 'Forged signature must return 400');
      assert.strictEqual(res.data.status, 'FORGED', 'Status must be FORGED');
      assert.ok(res.data.message.includes('signature mismatch') || res.data.message.includes('counterfeit'));
      console.log('  ✅ Test 2.7: Cryptographically forged signature is rejected with 400 FORGED');
      passed++;
    }

    // Test 2.8: Tampered payload content (valid signature of original content, but name changed)
    {
      // Create guest
      const gRes = await request('POST', '/api/guests', {
        eventId,
        name: 'Original Legit Guest',
        email: 'legit@example.com',
        tier: 'REGULAR',
      });
      const tkt = gRes.data.ticket || gRes.data.data?.ticket;

      // Tamper tier from REGULAR to VIP
      const tamperedObj = {
        tid: tkt.qrToken,
        eid: eventId,
        n: 'Original Legit Guest',
        t: 'VVIP', // TAMPERED!
        sig: tkt.signature,
      };
      const tamperedBase64 = Buffer.from(JSON.stringify(tamperedObj), 'utf8').toString('base64url');

      const res = await request('POST', '/api/scan/verify', {
        qrPayload: tamperedBase64,
        gateName: 'VVIP Gate',
      });
      assert.strictEqual(res.status, 400, 'Tampered payload attribute must return 400');
      assert.strictEqual(res.data.status, 'FORGED');
      console.log('  ✅ Test 2.8: Tampered tier in payload detected by Ed25519; rejected with 400 FORGED');
      passed++;
    }

    // =========================================================================
    // SECTION 3: STRESS VERIFICATION & BURST CAPACITY
    // =========================================================================
    console.log('\n--- Section 3: Burst Stress Verification ---');

    // Test 3.1: Bulk ingest 20 guests and scan all 20 in a rapid burst
    console.log('  Bulk ingesting 20 attendees...');
    const bulkGuests = Array.from({ length: 20 }, (_, i) => ({
      name: `Burst Attendee #${i + 1}`,
      email: `burst_${i + 1}@example.com`,
      tier: i % 2 === 0 ? 'VIP' : 'REGULAR',
    }));

    const bulkRes = await request('POST', '/api/guests/bulk', {
      eventId,
      guests: bulkGuests,
    });
    assert.strictEqual(bulkRes.status, 201, 'Bulk guest creation must return 201');
    const createdList = bulkRes.data.guests || bulkRes.data.data;
    assert.strictEqual(createdList.length, 20, 'Must create 20 guests');

    // Fetch the 20 tickets
    const ticketsRes = await request('GET', `/api/tickets?eventId=${eventId}`);
    assert.strictEqual(ticketsRes.status, 200);
    const allTickets = ticketsRes.data.tickets || ticketsRes.data.data;

    // Filter to our burst tickets
    const burstTickets = allTickets.filter((t) => t.guestName && t.guestName.startsWith('Burst Attendee'));
    assert.strictEqual(burstTickets.length, 20, 'Must retrieve all 20 burst tickets');

    console.log('  Firing concurrent burst scan of 20 distinct tickets...');
    const burstScanPromises = burstTickets.map((t, idx) =>
      request('POST', '/api/scan/verify', {
        qrPayload: t.qrToken,
        gateName: `Gate Cluster #${(idx % 4) + 1}`,
        scannerId: `burst_scanner_${idx + 1}`,
      })
    );

    const burstResults = await Promise.all(burstScanPromises);
    const burstSuccesses = burstResults.filter((r) => r.status === 200);
    console.log(`  -> Burst successes: ${burstSuccesses.length} / 20`);
    assert.strictEqual(burstSuccesses.length, 20, 'All 20 distinct tickets must check in successfully');
    console.log('  ✅ Test 3.1: 20 distinct tickets checked in concurrently with 100% success rate.');
    passed++;

    // Test 3.2: Immediate re-scan burst on all 20 tickets (all must be 409 DUPLICATE)
    console.log('  Firing immediate re-scan burst on all 20 already-checked-in tickets...');
    const duplicateBurstPromises = burstTickets.map((t, idx) =>
      request('POST', '/api/scan/verify', {
        qrPayload: t.qrToken,
        gateName: `Gate Cluster #${(idx % 4) + 1}`,
        scannerId: `burst_scanner_${idx + 1}`,
      })
    );
    const dupResults = await Promise.all(duplicateBurstPromises);
    const dup409s = dupResults.filter((r) => r.status === 409);
    console.log(`  -> Duplicate rejections (409): ${dup409s.length} / 20`);
    assert.strictEqual(dup409s.length, 20, 'All 20 re-scanned tickets must be rejected with 409 DUPLICATE');
    console.log('  ✅ Test 3.2: 20/20 re-scans rejected as DUPLICATE with prior timestamp.');
    passed++;

    // Test 3.3: Verify event telemetry statistics
    const statsRes = await request('GET', `/api/events/${eventId}/stats`);
    assert.strictEqual(statsRes.status, 200);
    const stats = statsRes.data.data || statsRes.data.stats;
    console.log(`  Telemetry stats: Capacity=${stats.capacity}, Issued=${stats.issued}, CheckedIn=${stats.checkedIn}`);
    // 1 (test 1) + 1 (test 1.3) + 20 (burst) = 22 check-ins
    assert.ok(stats.checkedIn >= 22, `CheckedIn must be at least 22, got ${stats.checkedIn}`);
    console.log('  ✅ Test 3.3: Event check-in telemetry accurately reflects all admissions.');
    passed++;

  } catch (err) {
    console.error('  ❌ Stress Test Suite Failure:', err);
    failed++;
  } finally {
    server.close();
  }

  console.log(`\n======================================================`);
  console.log(`Challenger Stress & Concurrency Suite: ${passed} Passed, ${failed} Failed`);
  console.log(`======================================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

if (require.main === module) {
  testConcurrencyAndStress();
}

module.exports = testConcurrencyAndStress;
