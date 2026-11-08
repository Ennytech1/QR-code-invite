const Guest = require('../models/Guest');
const Ticket = require('../models/Ticket');
const Event = require('../models/Event');
const asyncHandler = require('../middleware/asyncHandler');

/**
 * @desc    Verify Meta WhatsApp Webhook Challenge
 * @route   GET /api/whatsapp/webhook
 * @access  Public
 */
exports.verifyWebhook = (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  const expectedToken = process.env.WHATSAPP_VERIFY_TOKEN || 'qrinvite_webhook_secret';

  if (mode && token) {
    if (mode === 'subscribe' && token === expectedToken) {
      console.log('[WHATSAPP:WEBHOOK] Verified webhook challenge successfully');
      return res.status(200).send(challenge);
    } else {
      console.warn('[WHATSAPP:WEBHOOK] Verification token mismatch');
      return res.sendStatus(403);
    }
  }

  return res.sendStatus(400);
};

/**
 * @desc    Handle WhatsApp Inbound Events & Interactive RSVP Button Clicks
 * @route   POST /api/whatsapp/webhook
 * @access  Public
 */
exports.handleWebhook = asyncHandler(async (req, res) => {
  const body = req.body;

  // Validate that event is from a WhatsApp business account
  if (body.object) {
    if (
      body.entry &&
      body.entry[0].changes &&
      body.entry[0].changes[0].value.messages &&
      body.entry[0].changes[0].value.messages[0]
    ) {
      const msg = body.entry[0].changes[0].value.messages[0];
      const fromPhone = msg.from; // Phone number e.g. "2348012345678"
      const messageId = msg.id;

      let rsvpAction = null;
      let guestIdHint = null;

      // 1. Check for Interactive Button Reply
      if (msg.type === 'interactive' && msg.interactive?.button_reply) {
        const buttonId = msg.interactive.button_reply.id || '';
        if (buttonId.startsWith('RSVP_YES')) {
          rsvpAction = 'ATTENDING';
          guestIdHint = buttonId.replace('RSVP_YES_', '');
        } else if (buttonId.startsWith('RSVP_NO')) {
          rsvpAction = 'DECLINED';
          guestIdHint = buttonId.replace('RSVP_NO_', '');
        }
      } 
      // 2. Check for Text Reply keywords: YES, CONFIRM, NO, CANCEL
      else if (msg.type === 'text' && msg.text?.body) {
        const text = msg.text.body.trim().toUpperCase();
        if (['YES', 'RSVP YES', 'ATTENDING', 'I WILL ATTEND', 'CONFIRM', '1'].includes(text)) {
          rsvpAction = 'ATTENDING';
        } else if (['NO', 'RSVP NO', 'DECLINE', 'CANNOT ATTEND', 'CANCEL', '2'].includes(text)) {
          rsvpAction = 'DECLINED';
        }
      }

      // If an RSVP decision was parsed
      if (rsvpAction) {
        console.log(`[WHATSAPP:RSVP] Action: ${rsvpAction} from Phone: ${fromPhone} (hint: ${guestIdHint || 'none'})`);

        // Find guest by ID or phone number
        let targetGuest = null;
        if (guestIdHint && /^[0-9a-fA-F]{24}$/.test(guestIdHint)) {
          try {
            targetGuest = await Guest.findById(guestIdHint).populate('event');
          } catch (e) {}
        }

        if (!targetGuest) {
          // Normalize phone lookup
          const cleanPhone = fromPhone.replace(/[^0-9]/g, '');
          const lastNine = cleanPhone.slice(-9);

          try {
            targetGuest = await Guest.findOne({
              phone: { $regex: lastNine }
            }).sort({ updatedAt: -1 }).populate('event');
          } catch (e) {}
        }

        // Also check memory guests if in demo/fallback mode
        if (!targetGuest) {
          const guestController = require('./guestController');
          const memGuests = guestController._getMemoryGuests ? guestController._getMemoryGuests() : [];
          targetGuest = memGuests.find(g => {
            const gPhone = (g.phone || '').replace(/[^0-9]/g, '');
            return gPhone && gPhone.includes(fromPhone.slice(-8));
          });
        }

        if (targetGuest) {
          targetGuest.rsvpStatus = rsvpAction;
          if (typeof targetGuest.save === 'function') {
            await targetGuest.save();
          }

          // Also update linked Ticket if present
          try {
            await Ticket.findOneAndUpdate(
              { qrToken: targetGuest.qrToken },
              { $set: { rsvpStatus: rsvpAction } }
            );
          } catch (e) {}

          // Send WhatsApp automated confirmation message
          const eventName = targetGuest.event?.name || 'the event';
          const passUrl = `${process.env.APP_URL || 'http://localhost:5173'}/pass/${targetGuest.qrToken}`;
          
          let confirmationText = '';
          if (rsvpAction === 'ATTENDING') {
            confirmationText = `🎉 *Attendance Confirmed!*\n\nThank you, *${targetGuest.name}*. We look forward to hosting you at *${eventName}*.\n\n📍 Table Assignment: *${targetGuest.table || 'Reserved Seating'}*\n🎟️ View Gate Pass: ${passUrl}\n\nPlease present your pass at the entrance on event day.`;
          } else {
            confirmationText = `ℹ️ *RSVP Updated: Declined*\n\nThank you for letting us know, *${targetGuest.name}*. We are sorry you won't be able to join us at *${eventName}*. Your seat allocation has been released.`;
          }

          // Dispatch confirmation via Cloud API if credentials exist
          const whatsappApiToken = process.env.WHATSAPP_API_TOKEN;
          const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

          if (whatsappApiToken && phoneNumberId) {
            try {
              await fetch(`https://graph.facebook.com/v19.0/${phoneNumberId}/messages`, {
                method: 'POST',
                headers: {
                  Authorization: `Bearer ${whatsappApiToken}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  messaging_product: 'whatsapp',
                  to: fromPhone,
                  type: 'text',
                  text: { body: confirmationText },
                }),
              });
            } catch (err) {
              console.warn('[WHATSAPP:AUTO_REPLY] Error replying to WhatsApp webhook:', err.message);
            }
          }
        }
      }
    }

    // Always acknowledge 200 OK to Meta
    return res.status(200).send('EVENT_RECEIVED');
  }

  return res.sendStatus(404);
});
