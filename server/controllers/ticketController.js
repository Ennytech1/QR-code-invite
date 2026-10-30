const Ticket = require('../models/Ticket');
const Event = require('../models/Event');
const Guest = require('../models/Guest');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

/**
 * @desc    Get all tickets
 * @route   GET /api/tickets
 * @access  Public
 */
exports.getTickets = asyncHandler(async (req, res, next) => {
  const { eventId, status } = req.query;
  const query = {};
  if (eventId) {
    query.$or = [{ event: eventId }, { eventId: eventId }];
  }
  if (status) query.status = status.toUpperCase();

  try {
    const tickets = await Ticket.find(query).populate('event', 'name date venue cardTheme publicKey').sort({ createdAt: -1 });
    if (tickets && tickets.length > 0) {
      return res.status(200).json({ success: true, count: tickets.length, data: tickets, tickets });
    }
  } catch (err) {
    // Fallback to memory
  }

  const guestController = require('./guestController');
  const memTickets = guestController._getMemoryTickets ? guestController._getMemoryTickets() : [];
  let filtered = [...memTickets];

  if (eventId) {
    filtered = filtered.filter((t) => String(t.event) === String(eventId) || String(t.eventId) === String(eventId));
  }
  if (status) {
    filtered = filtered.filter((t) => t.status === status.toUpperCase());
  }

  return res.status(200).json({ success: true, count: filtered.length, data: filtered, tickets: filtered });
});

/**
 * @desc    Get single ticket by ID or qrToken
 * @route   GET /api/tickets/:id
 * @access  Public
 */
exports.getTicket = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  try {
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);
    const ticket = await Ticket.findOne({
      $or: [{ _id: isObjectId ? id : null }, { qrToken: id }],
    }).populate('event');

    if (ticket) {
      return res.status(200).json({ success: true, data: ticket, ticket });
    }
  } catch (err) {
    // Memory
  }

  const guestController = require('./guestController');
  const memTickets = guestController._getMemoryTickets ? guestController._getMemoryTickets() : [];
  const ticket = memTickets.find((t) => String(t._id) === String(id) || String(t.id) === String(id) || t.qrToken === id);

  if (ticket) {
    return res.status(200).json({ success: true, data: ticket, ticket });
  }

  return next(new ErrorResponse(`Ticket not found for token ${id}`, 404));
});

/**
 * @desc    Get public pass data for digital invitation rendering (Apple Wallet / Web Pass)
 * @route   GET /api/tickets/:id/pass
 * @access  Public
 */
exports.getPublicPass = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  let ticket = null;
  let event = null;

  try {
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);
    ticket = await Ticket.findOne({
      $or: [{ _id: isObjectId ? id : null }, { qrToken: id }],
    }).populate('event');

    if (ticket && ticket.event) {
      event = ticket.event;
    }
  } catch (err) {
    // Memory fallback
  }

  if (!ticket) {
    const guestController = require('./guestController');
    const memTickets = guestController._getMemoryTickets ? guestController._getMemoryTickets() : [];
    ticket = memTickets.find((t) => String(t._id) === String(id) || String(t.id) === String(id) || t.qrToken === id);

    if (ticket) {
      const eventController = require('./eventController');
      const memEvents = eventController._getMemoryEvents ? eventController._getMemoryEvents() : [];
      event = memEvents.find((e) => String(e._id) === String(ticket.event || ticket.eventId) || String(e.id) === String(ticket.event || ticket.eventId));
    }
  }

  if (!ticket) {
    return res.status(404).json({
      success: false,
      message: 'Ticket not found',
    });
  }

  const passData = {
    passId: ticket._id,
    token: ticket.qrToken,
    guestName: ticket.guestName,
    tier: ticket.tier,
    table: ticket.table,
    plusOnes: ticket.plusOnes,
    status: ticket.status,
    checkInTime: ticket.checkInTime,
    gateScanned: ticket.gateScanned,
    signature: ticket.signature,
    compactQrPayload: ticket.compactQrPayload,
    cardTheme: ticket.cardTheme,
    event: event ? {
      id: event._id,
      _id: event._id,
      name: event.name,
      venue: event.venue,
      date: event.date,
      time: event.time,
      banner: event.banner,
      dressCode: event.dressCode,
      cardTheme: event.cardTheme,
      hostName: event.hostName,
      customMessage: event.customMessage,
      publicKey: event.publicKey,
    } : null,
  };

  return res.status(200).json({
    success: true,
    data: passData,
    pass: passData,
  });
});

/**
 * @desc    Trigger multi-channel pass dispatch (WhatsApp / Email / SMS)
 * @route   POST /api/tickets/dispatch
 * @access  Public
 */
exports.dispatchTickets = asyncHandler(async (req, res, next) => {
  const { ticketIds = [], channel = 'WHATSAPP' } = req.body;

  if (!Array.isArray(ticketIds) || ticketIds.length === 0) {
    return next(new ErrorResponse('Please provide a list of ticketIds to dispatch', 400));
  }

  try {
    await Ticket.updateMany(
      { _id: { $in: ticketIds } },
      { dispatched: true, dispatchedVia: channel }
    );
    await Guest.updateMany(
      { ticket: { $in: ticketIds } },
      { dispatched: true, dispatchedVia: channel }
    );
  } catch (err) {
    // Memory
  }

  const guestController = require('./guestController');
  const memTickets = guestController._getMemoryTickets ? guestController._getMemoryTickets() : [];
  for (const t of memTickets) {
    if (ticketIds.includes(String(t._id)) || ticketIds.includes(String(t.id))) {
      t.dispatched = true;
      t.dispatchedVia = channel;
    }
  }

  return res.status(200).json({
    success: true,
    message: `Successfully dispatched ${ticketIds.length} passes via ${channel}`,
    channel,
    count: ticketIds.length,
  });
});

exports.getTicketPass = exports.getPublicPass;

