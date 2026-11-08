const Ticket = require('../models/Ticket');
const Guest = require('../models/Guest');
const Event = require('../models/Event');
const CheckInLog = require('../models/CheckInLog');
const cryptoService = require('../services/cryptoService');
const lockService = require('../services/lockService');
const websocketService = require('../services/websocketService');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

let memoryCheckInLogs = [];

/**
 * @desc    Verify QR token, check Ed25519 signature, acquire atomic lock, prevent double spend & check in attendee
 * @route   POST /api/scan/verify
 * @access  Public
 */
exports.verifyAndCheckIn = asyncHandler(async (req, res, next) => {
  const qrPayload = req.body.qrPayload !== undefined ? req.body.qrPayload : (req.body.payload !== undefined ? req.body.payload : req.body.token);
  const gateName = req.body.gateName || req.body.gate || 'Main Entrance';
  const scannerId = req.body.scannerId || req.body.scannerDeviceId || 'scanner_terminal_1';

  if (!qrPayload) {
    return res.status(400).json({
      success: false,
      status: 'INVALID',
      message: 'Scan payload or QR token is required',
    });
  }

  let parsedPayload = null;
  let tid = '';
  let eid = '';
  let sig = '';

  // 1. Decode & parse payload
  if (typeof qrPayload === 'object' && qrPayload !== null) {
    parsedPayload = qrPayload;
    tid = String(qrPayload.tid || qrPayload.qrToken || qrPayload.token || qrPayload._id || qrPayload.id || '');
    eid = String(qrPayload.eid || qrPayload.eventId || '');
    sig = String(qrPayload.sig || qrPayload.signature || '');
  } else if (typeof qrPayload === 'string') {
    const trimmed = qrPayload.trim();
    if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
      try {
        parsedPayload = JSON.parse(trimmed);
        tid = String(parsedPayload.tid || parsedPayload.qrToken || parsedPayload.token || parsedPayload._id || '');
        eid = String(parsedPayload.eid || parsedPayload.eventId || '');
        sig = String(parsedPayload.sig || parsedPayload.signature || '');
      } catch {
        tid = trimmed;
      }
    } else {
      // Try decoding Base64URL
      try {
        const decoded = Buffer.from(trimmed, 'base64url').toString('utf8');
        if (decoded.startsWith('{') && decoded.endsWith('}')) {
          parsedPayload = JSON.parse(decoded);
          tid = String(parsedPayload.tid || parsedPayload.qrToken || parsedPayload.token || '');
          eid = String(parsedPayload.eid || parsedPayload.eventId || '');
          sig = String(parsedPayload.sig || parsedPayload.signature || '');
        } else {
          tid = trimmed;
        }
      } catch {
        tid = trimmed;
      }
    }
  }

  if (!tid) {
    return res.status(400).json({
      success: false,
      status: 'INVALID',
      message: 'Unrecognized Token or Malformed QR Structure',
      guest: null,
    });
  }

  // 2. Early Cryptographic Signature Verification (Counterfeit / Tamper Protection)
  // If payload contains event ID, verify it exists. If signature is present, verify against event public key before database access
  if (eid) {
    let earlyEvent = null;
    try {
      earlyEvent = await Event.findById(eid);
    } catch (e) {}

    if (!earlyEvent) {
      const eventController = require('./eventController');
      const memEvents = eventController._getMemoryEvents ? eventController._getMemoryEvents() : [];
      earlyEvent = memEvents.find((e) => String(e._id) === String(eid) || String(e.id) === String(eid));
    }

    if (!earlyEvent) {
      return res.status(400).json({
        success: false,
        status: 'INVALID',
        message: 'Event ID in scan payload is unrecognized or invalid',
      });
    }

    if (sig && earlyEvent.publicKey) {
      const verifyResult = cryptoService.verifyQRPayload(parsedPayload || { tid, eid, sig }, earlyEvent.publicKey);
      if (!verifyResult.valid) {
        const logEntry = {
          ticketToken: tid,
          event: earlyEvent._id,
          result: 'FORGED',
          gateName,
          scannerDeviceId: scannerId,
          scannedAt: new Date(),
        };
        try {
          await CheckInLog.create(logEntry);
        } catch (e) {
          memoryCheckInLogs.unshift(logEntry);
        }

        return res.status(400).json({
          success: false,
          status: 'FORGED',
          message: 'CRITICAL: Cryptographic signature mismatch! Ticket is counterfeit or tampered.',
          guest: null,
        });
      }
    }
  }

  // 3. Lookup Ticket
  let ticket = null;
  const isObjectId = /^[0-9a-fA-F]{24}$/.test(tid);

  try {
    ticket = await Ticket.findOne({
      $or: [{ _id: isObjectId ? tid : null }, { qrToken: tid }],
    }).populate('event');
  } catch (err) {
    // Memory
  }

  if (!ticket) {
    const guestController = require('./guestController');
    const memTickets = guestController._getMemoryTickets ? guestController._getMemoryTickets() : [];
    ticket = memTickets.find((t) => String(t._id) === String(tid) || String(t.id) === String(tid) || t.qrToken === tid);
  }

  if (!ticket) {
    return res.status(404).json({
      success: false,
      status: 'INVALID',
      message: 'Ticket not found in event roster. Unrecognized token.',
      guest: null,
    });
  }

  // 4. Strict Event-Binding Validation
  if (eid) {
    const ticketEventId = String(ticket.eventId || ticket.event?._id || ticket.event || '');
    if (ticketEventId !== String(eid)) {
      return res.status(400).json({
        success: false,
        status: 'FORGED',
        message: 'CRITICAL: Ticket does not belong to the event specified in the cryptographic payload.',
      });
    }
  }

  let event = typeof ticket.event === 'object' && ticket.event !== null ? ticket.event : null;
  const eventIdToFind = event?._id || ticket.eventId || (typeof ticket.event === 'string' ? ticket.event : null) || eid;

  if (!event && eventIdToFind) {
    try {
      event = await Event.findById(eventIdToFind);
    } catch (e) {}
  }
  if (!event && eventIdToFind) {
    const eventController = require('./eventController');
    const memEvents = eventController._getMemoryEvents ? eventController._getMemoryEvents() : [];
    event = memEvents.find((e) => String(e._id) === String(eventIdToFind) || String(e.id) === String(eventIdToFind));
  }

  // Fallback signature verification: If sig is provided, ALWAYS verify against ticket's actual event publicKey
  if (sig && event && event.publicKey) {
    const sigPayload = parsedPayload || {
      tid,
      eid: event._id,
      n: ticket.guestName,
      t: ticket.tier,
      sig,
    };
    const verifyResult = cryptoService.verifyQRPayload(sigPayload, event.publicKey);
    if (!verifyResult.valid) {
      return res.status(400).json({
        success: false,
        status: 'FORGED',
        message: 'CRITICAL: Cryptographic signature mismatch! Ticket is counterfeit or tampered.',
        guest: null,
      });
    }
  }

  // 5. Concurrency Mutex Lock
  const lockKey = `ticket:lock:${ticket._id}`;
  const lockAcquired = await lockService.acquireLock(lockKey, scannerId, 5);

  if (!lockAcquired) {
    return res.status(429).json({
      success: false,
      status: 'CONCURRENCY_LOCKED',
      message: 'Concurrent scan underway at another gate. Please wait a moment.',
    });
  }

  try {
    // 6. Atomic State Transition: Ticket.findOneAndUpdate({ _id: tid, status: 'VALID' })
    let updatedTicket = null;
    const initialAdmitPlusOnes = typeof req.body.admitPlusOnes === 'number' 
      ? Math.min(req.body.admitPlusOnes, ticket.plusOnes || 0)
      : (ticket.plusOnes || 0);

    try {
      updatedTicket = await Ticket.findOneAndUpdate(
        { _id: ticket._id, status: 'VALID' },
        {
          $set: {
            status: 'CHECKED_IN',
            checkInTime: new Date(),
            gateScanned: gateName,
            scannedByDevice: scannerId,
            plusOnesCheckedIn: initialAdmitPlusOnes,
          },
          $inc: { scanCount: 1 },
        },
        { new: true }
      );
    } catch (err) {
      // Memory atomic logic
      if (ticket.status === 'VALID') {
        ticket.status = 'CHECKED_IN';
        ticket.checkInTime = new Date();
        ticket.gateScanned = gateName;
        ticket.scannedByDevice = scannerId;
        ticket.plusOnesCheckedIn = initialAdmitPlusOnes;
        ticket.scanCount = (ticket.scanCount || 0) + 1;
        updatedTicket = ticket;
      } else {
        updatedTicket = null;
      }
    }

    // 7. Check if not updated (Already CHECKED_IN or REVOKED)
    if (!updatedTicket) {
      let currentTicket = null;
      try {
        currentTicket = await Ticket.findById(ticket._id);
      } catch (e) {}

      if (!currentTicket) {
        currentTicket = ticket;
      }

      if (currentTicket.status === 'CHECKED_IN') {
        const allowedPlus = currentTicket.plusOnes || 0;
        const alreadyIn = currentTicket.plusOnesCheckedIn || 0;
        const remainingPlusOnes = Math.max(0, allowedPlus - alreadyIn);

        // If guest has remaining plus-one credits and usher is admitting remaining
        if (remainingPlusOnes > 0 && req.body.admitRemaining) {
          const admitCount = Math.min(Number(req.body.admitPlusOnes) || 1, remainingPlusOnes);
          const newCheckedInCount = alreadyIn + admitCount;

          try {
            currentTicket = await Ticket.findByIdAndUpdate(
              currentTicket._id,
              { $set: { plusOnesCheckedIn: newCheckedInCount } },
              { new: true }
            );
            await Guest.findOneAndUpdate(
              { $or: [{ ticket: currentTicket._id }, { qrToken: currentTicket.qrToken }] },
              { $set: { plusOnesCheckedIn: newCheckedInCount } }
            );
          } catch (e) {
            currentTicket.plusOnesCheckedIn = newCheckedInCount;
          }

          return res.status(200).json({
            success: true,
            status: 'SUCCESS',
            partialPlusOne: true,
            message: `Admitted ${admitCount} plus-one(s). ${Math.max(0, allowedPlus - newCheckedInCount)} credit(s) remaining.`,
            guest: {
              id: currentTicket.guestId || currentTicket._id,
              name: currentTicket.guestName,
              tier: currentTicket.tier,
              table: currentTicket.table,
              seatNumber: currentTicket.seatNumber,
              plusOnes: allowedPlus,
              plusOnesCheckedIn: newCheckedInCount,
              remainingPlusOnes: Math.max(0, allowedPlus - newCheckedInCount),
              status: 'CHECKED_IN',
              checkInTime: currentTicket.checkInTime,
              gate: gateName,
            },
          });
        }

        const priorTime = currentTicket.checkInTime || new Date();
        const formattedTime = new Date(priorTime).toLocaleTimeString();

        const duplicateLog = {
          ticket: currentTicket._id,
          ticketToken: currentTicket.qrToken || tid,
          event: event?._id,
          scannerDeviceId: scannerId,
          result: 'DUPLICATE',
          gateName,
          scannedAt: new Date(),
        };

        try {
          await CheckInLog.create(duplicateLog);
        } catch (e) {
          memoryCheckInLogs.unshift(duplicateLog);
        }

        try {
          websocketService.broadcastScanEvent(event?._id || 'general', {
            outcome: 'DUPLICATE',
            guestName: currentTicket.guestName,
            guestId: currentTicket.guestId || currentTicket._id,
            tier: currentTicket.tier,
            gate: gateName,
            scannerId,
            timestamp: new Date().toISOString(),
            message: `Duplicate scan attempt at ${gateName}`,
          });
        } catch (e) {}

        return res.status(409).json({
          success: false,
          status: 'DUPLICATE',
          message: `Ticket already checked in at ${formattedTime} at ${currentTicket.gateScanned || 'another gate'}`,
          firstUsed: `${formattedTime} at ${currentTicket.gateScanned || 'another gate'}`,
          checkInTime: currentTicket.checkInTime,
          gateScanned: currentTicket.gateScanned,
          scanCount: currentTicket.scanCount,
          guestName: currentTicket.guestName,
          tier: currentTicket.tier,
          plusOnes: allowedPlus,
          plusOnesCheckedIn: alreadyIn,
          remainingPlusOnes,
          guest: {
            name: currentTicket.guestName,
            tier: currentTicket.tier,
            table: currentTicket.table,
            seatNumber: currentTicket.seatNumber,
            plusOnes: allowedPlus,
            plusOnesCheckedIn: alreadyIn,
            remainingPlusOnes,
            status: 'CHECKED_IN',
            checkInTime: currentTicket.checkInTime,
            gate: currentTicket.gateScanned,
          },
        });
      }

      if (currentTicket.status === 'REVOKED') {
        const revokedLog = {
          ticket: currentTicket._id,
          ticketToken: currentTicket.qrToken || tid,
          event: event?._id,
          scannerDeviceId: scannerId,
          result: 'REVOKED',
          gateName,
          scannedAt: new Date(),
        };

        try {
          await CheckInLog.create(revokedLog);
        } catch (e) {
          memoryCheckInLogs.unshift(revokedLog);
        }

        return res.status(403).json({
          success: false,
          status: 'REVOKED',
          message: 'This pass has been formally REVOKED by security',
          guest: {
            name: currentTicket.guestName,
            tier: currentTicket.tier,
            status: 'REVOKED',
          },
        });
      }
    }

    // 8. Successful Check-in
    // Update Event checkedIn count
    const targetEventId = event?._id || eventIdToFind;
    if (targetEventId) {
      try {
        await Event.findByIdAndUpdate(targetEventId, { $inc: { checkedIn: 1 } });
      } catch (e) {}
      const eventController = require('./eventController');
      const memEvents = eventController._getMemoryEvents ? eventController._getMemoryEvents() : [];
      const memEv = memEvents.find((e) => String(e._id) === String(targetEventId) || String(e.id) === String(targetEventId));
      if (memEv) {
        memEv.checkedIn = (memEv.checkedIn || 0) + 1;
      }
      if (event && typeof event === 'object') {
        event.checkedIn = (event.checkedIn || 0) + 1;
      }
    }

    // Update Guest record if present
    try {
      await Guest.findOneAndUpdate(
        { $or: [{ ticket: updatedTicket._id }, { qrToken: updatedTicket.qrToken }] },
        {
          $set: {
            status: 'CHECKED_IN',
            checkInTime: updatedTicket.checkInTime,
            gate: gateName,
          },
        }
      );
    } catch (e) {
      const guestController = require('./guestController');
      const memGuests = guestController._getMemoryGuests ? guestController._getMemoryGuests() : [];
      const memGuest = memGuests.find((g) => g.qrToken === updatedTicket.qrToken || String(g.ticket) === String(updatedTicket._id));
      if (memGuest) {
        memGuest.status = 'CHECKED_IN';
        memGuest.checkInTime = updatedTicket.checkInTime;
        memGuest.gate = gateName;
      }
    }

    // Record CheckInLog
    const successLog = {
      ticket: updatedTicket._id,
      ticketToken: updatedTicket.qrToken || tid,
      event: event?._id,
      scannerDeviceId: scannerId,
      result: 'SUCCESS',
      gateName,
      scannedAt: updatedTicket.checkInTime,
    };

    try {
      await CheckInLog.create(successLog);
    } catch (e) {
      memoryCheckInLogs.unshift(successLog);
    }

    // Broadcast instant scan telemetry via native WebSocket
    try {
      websocketService.broadcastScanEvent(targetEventId || 'general', {
        outcome: 'SUCCESS',
        guestName: updatedTicket.guestName,
        guestId: updatedTicket.guestId || updatedTicket._id,
        tier: updatedTicket.tier,
        table: updatedTicket.table,
        gate: gateName,
        scannerId,
        timestamp: updatedTicket.checkInTime || new Date().toISOString(),
      });
    } catch (e) {}

    return res.status(200).json({
      success: true,
      status: 'SUCCESS',
      message: 'Access Granted! Checked in successfully.',
      ticket: updatedTicket,
      guest: {
        id: updatedTicket.guestId || updatedTicket._id,
        name: updatedTicket.guestName,
        tier: updatedTicket.tier,
        table: updatedTicket.table,
        plusOnes: updatedTicket.plusOnes,
        status: 'CHECKED_IN',
        checkInTime: updatedTicket.checkInTime,
        gate: gateName,
      },
    });
  } finally {
    await lockService.releaseLock(lockKey);
  }
});

/**
 * @desc    Batch sync offline check-ins upon gate network reconnection
 * @route   POST /api/scan/sync
 * @access  Public
 */
exports.syncOfflineScans = asyncHandler(async (req, res, next) => {
  const { queue = [] } = req.body;

  if (!Array.isArray(queue) || queue.length === 0) {
    return res.status(200).json({ success: true, processed: 0, conflicts: 0 });
  }

  let processed = 0;
  let conflicts = 0;

  for (const item of queue) {
    const token = item.token || item.tid || item.guestId;
    if (!token) continue;

    try {
      const isObjectId = /^[0-9a-fA-F]{24}$/.test(token);
      let ticket = await Ticket.findOne({
        $or: [{ _id: isObjectId ? token : null }, { qrToken: token }],
      });

      if (!ticket) {
        const guestController = require('./guestController');
        const memTickets = guestController._getMemoryTickets ? guestController._getMemoryTickets() : [];
        ticket = memTickets.find((t) => String(t._id) === String(token) || t.qrToken === token);
      }

      if (!ticket) {
        conflicts++;
        continue;
      }

      if (ticket.status === 'CHECKED_IN') {
        conflicts++;
      } else {
        ticket.status = 'CHECKED_IN';
        ticket.checkInTime = new Date(item.timestamp || Date.now());
        ticket.gateScanned = item.gate || 'Offline Gate';
        ticket.scannedByDevice = item.scannerId || 'offline_pwa';
        ticket.scanCount = (ticket.scanCount || 0) + 1;
        if (typeof ticket.save === 'function') {
          await ticket.save();
        }
        processed++;
      }
    } catch (e) {
      conflicts++;
    }
  }

  return res.status(200).json({
    success: true,
    processed,
    conflicts,
    message: `Batch sync complete: ${processed} scans reconciled, ${conflicts} duplicate/unknown entries.`,
  });
});

/**
 * @desc    Usher Gate Login via 4-6 digit PIN or Event Access Code
 * @route   POST /api/scan/usher-login
 * @access  Public
 */
exports.usherLogin = asyncHandler(async (req, res, next) => {
  const { pin, eventId } = req.body;
  if (!pin) {
    return res.status(400).json({ success: false, message: 'Please provide the usher access PIN' });
  }

  let event = null;
  const pinStr = String(pin).trim();

  if (eventId) {
    try {
      event = await Event.findById(eventId);
    } catch (e) {}
  }

  if (!event) {
    // Search by scannerPin
    try {
      event = await Event.findOne({ scannerPin: pinStr });
    } catch (e) {}
  }

  if (!event) {
    const eventController = require('./eventController');
    const memEvents = eventController._getMemoryEvents ? eventController._getMemoryEvents() : [];
    event = memEvents.find(e => String(e.scannerPin) === pinStr || (eventId && (String(e._id) === String(eventId) || String(e.id) === String(eventId))));
  }

  // Fallback demo match for default PIN 1234
  if (!event && pinStr === '1234') {
    const eventController = require('./eventController');
    const memEvents = eventController._getMemoryEvents ? eventController._getMemoryEvents() : [];
    event = memEvents[0];
  }

  if (!event) {
    return res.status(401).json({ success: false, message: 'Invalid Usher PIN or unauthorized gate code' });
  }

  // Pre-fetch roster for offline local cache
  let guestRoster = [];
  try {
    guestRoster = await Guest.find({ event: event._id }).select('name email phone tier table seatNumber plusOnes plusOnesCheckedIn qrToken status checkInTime');
  } catch (e) {
    const guestController = require('./guestController');
    const memGuests = guestController._getMemoryGuests ? guestController._getMemoryGuests() : [];
    guestRoster = memGuests.filter(g => String(g.eventId || g.event) === String(event._id || event.id));
  }

  return res.status(200).json({
    success: true,
    message: 'Gate Usher Authenticated',
    event: {
      id: event._id || event.id,
      name: event.name,
      venue: event.venue,
      date: event.date,
      time: event.time,
      capacity: event.capacity,
      checkedIn: event.checkedIn || 0,
      publicKey: event.publicKey,
      type: event.type,
      cardTheme: event.cardTheme,
    },
    offlineRoster: guestRoster,
  });
});

exports._resetMemoryLogs = () => {
  memoryCheckInLogs = [];
};
exports._getMemoryLogs = () => memoryCheckInLogs;
