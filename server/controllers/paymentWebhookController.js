const crypto = require('crypto');
const Event = require('../models/Event');
const Ticket = require('../models/Ticket');
const Guest = require('../models/Guest');
const cryptoService = require('../services/cryptoService');
const dispatchService = require('../services/dispatchService');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

/**
 * Helper: Issue cryptographically signed ticket & guest upon confirmed payment
 */
async function issuePurchasedTicket({ eventId, buyerName, buyerEmail, buyerPhone, tierName = 'REGULAR', price = 0, quantity = 1, metadata = {} }) {
  let event = null;
  try {
    event = await Event.findById(eventId);
  } catch (e) {}

  if (!event) {
    const eventController = require('./eventController');
    const memEvents = eventController._getMemoryEvents ? eventController._getMemoryEvents() : [];
    event = memEvents.find(e => String(e._id) === String(eventId) || String(e.id) === String(eventId)) || memEvents[0];
  }

  const issuedTickets = [];

  for (let i = 0; i < quantity; i++) {
    const qrToken = `tkt_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    
    // Sign ticket payload using event keys
    const signResult = cryptoService.signQRPayload(
      {
        tid: qrToken,
        eid: event ? String(event._id || event.id) : eventId,
        tier: tierName,
        name: buyerName,
        iat: Math.floor(Date.now() / 1000),
      },
      event?.privateKey
    );

    const ticketDoc = {
      event: event ? event._id : null,
      eventId: event ? event._id : eventId,
      guestName: quantity > 1 ? `${buyerName} (Pass ${i + 1}/${quantity})` : buyerName,
      email: buyerEmail,
      phone: buyerPhone,
      tier: tierName.toUpperCase(),
      table: metadata.table || 'General Admission',
      plusOnes: Number(metadata.plusOnes) || 0,
      plusOnesCheckedIn: 0,
      qrToken,
      signature: signResult.signature,
      status: 'VALID',
      cardTheme: event?.cardTheme || 'luxury-gold',
      dispatched: false,
      dispatchedVia: 'NONE',
    };

    let savedTicket = null;
    try {
      savedTicket = await Ticket.create(ticketDoc);
    } catch (e) {
      savedTicket = { ...ticketDoc, _id: 'tkt_' + Date.now() + '_' + i };
      const guestController = require('./guestController');
      const memTickets = guestController._getMemoryTickets ? guestController._getMemoryTickets() : [];
      memTickets.unshift(savedTicket);
    }

    // Also mirror to Guest roster for unified gate check-in
    try {
      await Guest.create({
        event: event ? event._id : null,
        eventId: event ? event._id : eventId,
        ticket: savedTicket._id,
        name: savedTicket.guestName,
        email: buyerEmail,
        phone: buyerPhone,
        tier: savedTicket.tier,
        table: savedTicket.table,
        plusOnes: savedTicket.plusOnes,
        plusOnesCheckedIn: 0,
        qrToken,
        status: 'VALID',
        cardTheme: savedTicket.cardTheme,
      });
    } catch (e) {
      const guestController = require('./guestController');
      const memGuests = guestController._getMemoryGuests ? guestController._getMemoryGuests() : [];
      memGuests.unshift({
        id: 'g_' + Date.now() + '_' + i,
        eventId: event ? String(event._id || event.id) : eventId,
        ticket: savedTicket._id,
        name: savedTicket.guestName,
        email: buyerEmail,
        phone: buyerPhone,
        tier: savedTicket.tier,
        table: savedTicket.table,
        plusOnes: savedTicket.plusOnes,
        plusOnesCheckedIn: 0,
        qrToken,
        status: 'VALID',
      });
    }

    issuedTickets.push(savedTicket);

    // Fire instant multi-channel dispatch in background
    if (dispatchService) {
      if (buyerEmail && typeof dispatchService.sendPassEmail === 'function') {
        dispatchService.sendPassEmail({
          guest: savedTicket,
          ticket: savedTicket,
          event,
          baseUrl: process.env.APP_URL || 'http://localhost:5173',
        }).catch(() => {});
      }
      if (buyerPhone && typeof dispatchService.sendPassWhatsApp === 'function') {
        dispatchService.sendPassWhatsApp({
          guest: savedTicket,
          ticket: savedTicket,
          event,
          baseUrl: process.env.APP_URL || 'http://localhost:5173',
        }).catch(() => {});
      }
    }
  }

  // Update Event sold count and revenue
  if (event) {
    try {
      await Event.findByIdAndUpdate(event._id, {
        $inc: { issued: quantity, revenue: price * quantity }
      });
    } catch (e) {}
    event.issued = (event.issued || 0) + quantity;
    event.revenue = (event.revenue || 0) + (price * quantity);
  }

  return issuedTickets;
}

/**
 * @desc    Initialize checkout transaction (Paystack / Direct)
 * @route   POST /api/tickets/initialize-checkout
 * @access  Public
 */
exports.initializeCheckout = asyncHandler(async (req, res, next) => {
  const { eventId, tierId, tierName, price, quantity = 1, buyerName, buyerEmail, buyerPhone } = req.body;

  if (!eventId || !buyerEmail || !buyerName) {
    return next(new ErrorResponse('Please provide eventId, buyerName, and buyerEmail', 400));
  }

  const paystackSecret = process.env.PAYSTACK_SECRET_KEY;
  const totalAmountKobo = Math.round((Number(price) || 0) * Number(quantity) * 100);

  // If live Paystack credentials exist and amount > 0, initialize official Paystack session
  if (paystackSecret && totalAmountKobo > 0) {
    try {
      const paystackRes = await fetch('https://api.paystack.co/transaction/initialize', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${paystackSecret}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: buyerEmail,
          amount: totalAmountKobo,
          callback_url: `${process.env.APP_URL || 'http://localhost:5173'}/explore?payment_success=true`,
          metadata: {
            eventId,
            tierId,
            tierName,
            buyerName,
            buyerPhone,
            quantity,
          },
        }),
      });

      const paystackData = await paystackRes.json();
      if (paystackData.status && paystackData.data) {
        return res.status(200).json({
          success: true,
          provider: 'PAYSTACK',
          authorizationUrl: paystackData.data.authorization_url,
          accessCode: paystackData.data.access_code,
          reference: paystackData.data.reference,
        });
      }
    } catch (err) {
      console.warn('[CHECKOUT:PAYSTACK] Direct gateway connection failed, falling back to instant issuance:', err.message);
    }
  }

  // Instant Sandboxed / Demo Issuance (Sub-50ms instant ticket generation)
  const issuedTickets = await issuePurchasedTicket({
    eventId,
    buyerName,
    buyerEmail,
    buyerPhone,
    tierName: tierName || 'REGULAR',
    price: price || 0,
    quantity,
    metadata: { plusOnes: req.body.plusOnes || 0 },
  });

  return res.status(200).json({
    success: true,
    provider: 'DIRECT_INSTANT',
    message: 'Passes generated and cryptographically signed successfully.',
    tickets: issuedTickets,
    primaryPassUrl: `/pass/${issuedTickets[0]?.qrToken}`,
  });
});

/**
 * @desc    Paystack Webhook Verification & Ticket Issuance
 * @route   POST /api/tickets/paystack-webhook
 * @access  Public
 */
exports.handlePaystackWebhook = asyncHandler(async (req, res, next) => {
  const secret = process.env.PAYSTACK_SECRET_KEY || 'sk_test_qrinvite_demo_secret';
  const paystackSignature = req.headers['x-paystack-signature'];

  // Verify HMAC-SHA512 Signature
  if (paystackSignature) {
    const hash = crypto
      .createHmac('sha512', secret)
      .update(JSON.stringify(req.body))
      .digest('hex');

    if (hash !== paystackSignature) {
      console.warn('[PAYSTACK:WEBHOOK] Invalid HMAC-SHA512 signature mismatch');
      return res.status(400).send('Invalid signature');
    }
  }

  const eventPayload = req.body;

  if (eventPayload.event === 'charge.success') {
    const data = eventPayload.data || {};
    const meta = data.metadata || {};

    console.log(`[PAYSTACK:WEBHOOK] Charge succeeded for Ref: ${data.reference} | Amount: ${data.amount / 100} NGN`);

    const issuedTickets = await issuePurchasedTicket({
      eventId: meta.eventId,
      buyerName: meta.buyerName || data.customer?.first_name || 'Guest',
      buyerEmail: meta.buyerEmail || data.customer?.email,
      buyerPhone: meta.buyerPhone || data.customer?.phone,
      tierName: meta.tierName || 'REGULAR',
      price: (data.amount || 0) / 100,
      quantity: Number(meta.quantity) || 1,
      metadata: meta,
    });

    console.log(`[PAYSTACK:WEBHOOK] Issued ${issuedTickets.length} cryptographic ticket passes`);
  }

  // Always return 200 OK to Paystack
  return res.status(200).json({ status: 'success' });
});

/**
 * @desc    Flutterwave Webhook Verification
 * @route   POST /api/tickets/flutterwave-webhook
 * @access  Public
 */
exports.handleFlutterwaveWebhook = asyncHandler(async (req, res, next) => {
  const secretHash = process.env.FLUTTERWAVE_SECRET_HASH;
  const signature = req.headers['verif-hash'];

  if (secretHash && signature !== secretHash) {
    return res.status(401).send('Unauthorized webhook signature');
  }

  const { event, data } = req.body;

  if (event === 'charge.completed' && data?.status === 'successful') {
    const meta = data.meta || {};
    console.log(`[FLUTTERWAVE:WEBHOOK] Payment successful for TxID: ${data.id}`);

    await issuePurchasedTicket({
      eventId: meta.eventId,
      buyerName: meta.buyerName || data.customer?.name || 'Guest',
      buyerEmail: meta.buyerEmail || data.customer?.email,
      buyerPhone: meta.buyerPhone || data.customer?.phone_number,
      tierName: meta.tierName || 'REGULAR',
      price: data.amount || 0,
      quantity: Number(meta.quantity) || 1,
      metadata: meta,
    });
  }

  return res.status(200).json({ status: 'success' });
});
