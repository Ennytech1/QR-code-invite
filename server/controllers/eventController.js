const Event = require('../models/Event');
const Ticket = require('../models/Ticket');
const Guest = require('../models/Guest');
const CheckInLog = require('../models/CheckInLog');
const cryptoService = require('../services/cryptoService');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// In-memory fallback repository when MongoDB is in offline dev mode
let memoryEvents = [];

/**
 * @desc    Get all events
 * @route   GET /api/events
 * @access  Public
 */
exports.getEvents = asyncHandler(async (req, res, next) => {
  try {
    const { type, status, search } = req.query;
    const query = {};

    if (type) query.type = type.toUpperCase();
    if (status) query.status = status.toUpperCase();
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const events = await Event.find(query).sort({ createdAt: -1 });

    if (events && events.length > 0) {
      return res.status(200).json({ success: true, count: events.length, data: events, events });
    }
  } catch (err) {
    // Fallback to memory
  }

  return res.status(200).json({ success: true, count: memoryEvents.length, data: memoryEvents, events: memoryEvents });
});

/**
 * @desc    Get single event by ID
 * @route   GET /api/events/:id
 * @access  Public
 */
exports.getEvent = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  try {
    const event = await Event.findById(id);
    if (event) {
      return res.status(200).json({ success: true, data: event, event });
    }
  } catch (err) {
    // Check in-memory
  }

  const memEvent = memoryEvents.find((e) => String(e._id) === String(id) || String(e.id) === String(id));
  if (!memEvent) {
    return next(new ErrorResponse(`Event not found with ID ${id}`, 404));
  }

  return res.status(200).json({ success: true, data: memEvent, event: memEvent });
});

/**
 * @desc    Create new event (auto-generates Ed25519 keypair)
 * @route   POST /api/events
 * @access  Public
 */
exports.createEvent = asyncHandler(async (req, res, next) => {
  const {
    name,
    venue,
    date,
    time = '18:00',
    type = 'PUBLIC',
    category = 'Celebration',
    banner,
    description,
    capacity = 500,
    dressCode,
    cardTheme = 'luxury-gold',
    customMessage,
    hostName,
    scannerPin = '1234',
    ticketTiers,
  } = req.body;

  if (!name || !venue || !date) {
    return next(new ErrorResponse('Please provide event name, venue, and date', 400));
  }

  // Generate asymmetric Ed25519 keypair for tamper-proof pass signing
  const { publicKeyPem, privateKeyPem, encryptedPrivateKey } = cryptoService.generateEd25519KeyPair();

  const eventPayload = {
    name,
    venue,
    date,
    time,
    type,
    category,
    banner: banner || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80',
    description: description || `Experience the official ${name}`,
    capacity: Number(capacity) || 500,
    issued: 0,
    checkedIn: 0,
    status: 'ACTIVE',
    dressCode: dressCode || 'Formal Elegance',
    cardTheme,
    customMessage: customMessage || 'We request the honor of your presence.',
    hostName: hostName || 'Event Host',
    scannerPin,
    ticketTiers: ticketTiers || [
      { name: 'General Admission', price: 0, capacity: Number(capacity) || 500, perks: 'Standard access' },
    ],
    publicKey: publicKeyPem,
    privateKey: privateKeyPem,
    privateKeyEncrypted: encryptedPrivateKey,
  };

  try {
    const event = await Event.create(eventPayload);
    memoryEvents.unshift(event);
    return res.status(201).json({ success: true, event, data: event });
  } catch (err) {
    const mockId = 'evt_' + Date.now();
    const event = { _id: mockId, id: mockId, ...eventPayload, createdAt: new Date() };
    memoryEvents.unshift(event);
    return res.status(201).json({ success: true, event, data: event });
  }
});

/**
 * @desc    Update event
 * @route   PUT /api/events/:id
 * @access  Public
 */
exports.updateEvent = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  try {
    const event = await Event.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (event) {
      return res.status(200).json({ success: true, data: event, event });
    }
  } catch (err) {
    // Try memory
  }

  const idx = memoryEvents.findIndex((e) => String(e._id) === String(id) || String(e.id) === String(id));
  if (idx !== -1) {
    memoryEvents[idx] = { ...memoryEvents[idx], ...req.body, updatedAt: new Date() };
    return res.status(200).json({ success: true, data: memoryEvents[idx], event: memoryEvents[idx] });
  }

  return next(new ErrorResponse(`Event not found with ID ${id}`, 404));
});

/**
 * @desc    Delete event
 * @route   DELETE /api/events/:id
 * @access  Public
 */
exports.deleteEvent = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  try {
    await Event.findByIdAndDelete(id);
    await Guest.deleteMany({ $or: [{ event: id }, { eventId: id }] });
    await Ticket.deleteMany({ $or: [{ event: id }, { eventId: id }] });
  } catch (err) {
    // Memory
  }

  memoryEvents = memoryEvents.filter((e) => String(e._id) !== String(id) && String(e.id) !== String(id));
  return res.status(200).json({ success: true, message: 'Event removed successfully' });
});

/**
 * @desc    Get live event statistics & gate velocity
 * @route   GET /api/events/:id/stats
 * @access  Public
 */
exports.getEventStats = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  let event = null;
  try {
    event = await Event.findById(id);
  } catch (err) {
    // Fallback
  }

  if (!event) {
    event = memoryEvents.find((e) => String(e._id) === String(id) || String(e.id) === String(id));
  }

  const capacity = event ? event.capacity || 500 : 500;
  const issued = event ? event.issued || 0 : 0;
  const checkedIn = event ? event.checkedIn || 0 : 0;
  const attendanceRate = issued > 0 ? Math.round((checkedIn / issued) * 100) : 0;
  const capacityUtilization = Math.round((checkedIn / capacity) * 100);

  // Recent scans
  let recentLogs = [];
  try {
    recentLogs = await CheckInLog.find({ event: id }).sort({ scannedAt: -1 }).limit(10);
  } catch (err) {
    // Ignore
  }

  res.status(200).json({
    success: true,
    data: {
      eventId: id,
      capacity,
      issued,
      checkedIn,
      attendanceRate,
      capacityUtilization,
      gateVelocity: Math.max(12, Math.round(checkedIn / 15)),
      recentLogs,
    },
  });
});

// Helper for test reset
exports._resetMemoryStore = () => {
  memoryEvents = [];
};
exports._getMemoryEvents = () => memoryEvents;
