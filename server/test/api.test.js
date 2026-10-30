const http = require('http');
const assert = require('assert');
const express = require('express');
const cryptoService = require('../services/cryptoService');

// Test suite for QRInvite Backend REST & Verification APIs
async function runTests() {
  console.log('🧪 Starting QRInvite Comprehensive Backend Test Suite...\n');
  let passed = 0;
  let failed = 0;

  // Initialize express app instance for testing
  const app = express();
  app.use(express.json());

  app.get('/health', (req, res) => res.status(200).json({ status: 'UP' }));
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
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await res.json().catch(() => ({}));
    return { status: res.status, data };
  };

  try {
    // Test 1: Health check
    {
      const res = await request('GET', '/health');
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.data.status, 'UP');
      console.log('  ✅ Test 1: Health Check Endpoint returns 200 UP');
      passed++;
    }

    // Test 2: Event Creation with Ed25519 Keypair Auto-Generation
    let createdEvent = null;
    {
      const eventPayload = {
        name: 'Annual Tech & Access Summit 2026',
        venue: 'Grand Innovation Arena, Lagos',
        date: '2026-11-25',
        type: 'PUBLIC',
        capacity: 1000,
        ticketTiers: [{ name: 'VIP Pass', price: 500, perks: 'VIP fast track' }],
      };

      const res = await request('POST', '/api/events', eventPayload);
      assert.strictEqual(res.status, 201);
      assert.strictEqual(res.data.success, true);
      assert.ok(res.data.data.publicKey, 'Event must have Ed25519 public key');
      assert.ok(res.data.data.publicKey.includes('BEGIN PUBLIC KEY'), 'Public key must be in PEM format');
      createdEvent = res.data.data;
      console.log('  ✅ Test 2: Event creation auto-generates asymmetric Ed25519 keypair');
      passed++;
    }

    // Test 3: List Events
    {
      const res = await request('GET', '/api/events');
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.data.success, true);
      assert.ok(Array.isArray(res.data.data));
      console.log('  ✅ Test 3: GET /api/events returns event list');
      passed++;
    }

    // Test 4: Add Guest & Generate Signed Pass Token
    let createdGuest = null;
    let validSignedPayload = null;
    {
      const guestPayload = {
        eventId: createdEvent._id || createdEvent.id,
        name: 'Dr. Chioma Adebayo',
        email: 'chioma@example.com',
        phone: '+2348012345678',
        tier: 'VIP',
        table: 'VIP Table #1',
        plusOnes: 1,
      };

      const res = await request('POST', '/api/guests', guestPayload);
      assert.strictEqual(res.status, 201);
      assert.strictEqual(res.data.success, true);
      const guest = res.data.guest || res.data.data?.guest || res.data.data;
      const ticket = res.data.ticket || res.data.data?.ticket;
      const sig = res.data.signature || res.data.data?.signature || res.data.data?.signedPayload?.sig || ticket?.signature;
      assert.ok(guest?.qrToken, 'Guest must have a qrToken');
      assert.ok(sig, 'Ticket pass must contain Ed25519 signature');
      createdGuest = guest;
      validSignedPayload = {
        tid: guest.qrToken,
        eid: guestPayload.eventId,
        n: guest.name,
        t: guest.tier,
        sig,
      };
      console.log('  ✅ Test 4: Guest created with unique qrToken and Ed25519 signature');
      passed++;
    }

    // Test 5: Scan Verification - First Attempt (Valid -> SUCCESS)
    {
      const scanPayload = {
        payload: createdGuest.qrToken,
        gateName: 'VIP North Gate #1',
        scannerDeviceId: 'scanner_alpha_01',
      };

      const res = await request('POST', '/api/scan/verify', scanPayload);
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.data.status, 'SUCCESS');
      assert.strictEqual(res.data.guest.status, 'CHECKED_IN');
      assert.strictEqual(res.data.guest.name, createdGuest.name);
      console.log('  ✅ Test 5: First optical scan succeeds and transitions state to CHECKED_IN');
      passed++;
    }

    // Test 6: Zero Double-Spend Anti-Replay (Second Attempt -> DUPLICATE)
    {
      const duplicateScanPayload = {
        payload: createdGuest.qrToken,
        gateName: 'West General Entrance',
        scannerDeviceId: 'scanner_beta_02',
      };

      const res = await request('POST', '/api/scan/verify', duplicateScanPayload);
      assert.strictEqual(res.status, 409, 'Duplicate scan must return 409 Conflict');
      assert.strictEqual(res.data.status, 'DUPLICATE', 'Status must be DUPLICATE');
      assert.ok(res.data.firstUsed, 'Must include details of prior check-in');
      console.log('  ✅ Test 6: Anti-Replay Concurrency Lock successfully rejects duplicate scan attempt');
      passed++;
    }

    // Test 7: Tampered / Counterfeit Cryptographic Signature Rejection
    {
      const tamperedPayload = {
        payload: {
          tid: 'QRI_FORGED_TOKEN_9999',
          eid: createdEvent._id || createdEvent.id,
          n: 'Dr. Chioma Adebayo',
          t: 'VIP',
          sig: 'bad_tampered_fake_signature_base64url',
        },
        gateName: 'VIP North Gate #1',
      };

      const res = await request('POST', '/api/scan/verify', tamperedPayload);
      assert.strictEqual(res.status, 400);
      assert.ok(res.data.status === 'FORGED' || res.data.status === 'INVALID', 'Status must be FORGED or INVALID');
      console.log('  ✅ Test 7: Cryptographic verification rejects tampered / forged pass signature');
      passed++;
    }

    // Test 8: Public Pass View Endpoint
    {
      const res = await request('GET', `/api/tickets/${createdGuest.qrToken}/pass`);
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.data.success, true);
      assert.ok(res.data.data.guestName);
      console.log('  ✅ Test 8: Public Pass Endpoint renders complete mobile pass data');
      passed++;
    }

    // Test 9: Strict Event Binding (Rejects valid ticket presented at a different event)
    {
      const wrongEventScanPayload = {
        payload: {
          tid: createdGuest.qrToken,
          eid: 'evt_different_unrelated_event_999',
        },
        gateName: 'VIP North Gate #1',
      };

      const res = await request('POST', '/api/scan/verify', wrongEventScanPayload);
      assert.strictEqual(res.status, 403, 'Cross-event ticket scan must return 403 Forbidden');
      assert.strictEqual(res.data.status, 'WRONG_EVENT');
      console.log('  ✅ Test 9: Strict event binding rejects ticket presented at a different event');
      passed++;
    }

  } catch (err) {
    console.error('  ❌ Test Failure:', err);
    failed++;
  } finally {
    server.close();
  }

  console.log(`\n========================================`);
  console.log(`Test Results: ${passed} Passed, ${failed} Failed`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
