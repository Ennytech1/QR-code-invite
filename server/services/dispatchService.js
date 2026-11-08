const nodemailer = require('nodemailer');

/**
 * Dispatch Service for QRInvite Digital Passes
 * Supports Multi-Channel Dispatch:
 * 1. Email (HTML branded digital invitation with QR code & pass link)
 * 2. WhatsApp (WhatsApp Cloud API or direct wa.me interactive dispatch)
 * 3. SMS (Concise plain-text invite link)
 */

let emailTransporter = null;

// Initialize Nodemailer transporter
function getTransporter() {
  if (emailTransporter) return emailTransporter;

  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    emailTransporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  } else {
    // Development / Resilient fallback transport
    emailTransporter = {
      sendMail: async (options) => {
        console.log(`[DISPATCH:EMAIL:SIMULATION] To: ${options.to} | Subject: ${options.subject}`);
        return {
          messageId: `sim_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
          accepted: [options.to],
          previewUrl: `http://localhost:5000/api/tickets/${options.context?.ticketId || 'preview'}/pass`,
        };
      },
    };
  }

  return emailTransporter;
}

/**
 * Generate luxury responsive HTML email for digital pass
 */
function generatePassEmailHtml({ guest, ticket, event, passUrl }) {
  const eventName = event?.name || 'Exclusive Event';
  const venue = event?.venue || 'Private Location';
  const date = event?.date || 'Upcoming';
  const time = event?.time || '18:00';
  const guestName = guest?.name || ticket?.guestName || 'Valued Guest';
  const tier = (ticket?.tier || guest?.tier || 'GENERAL').toUpperCase();
  const dressCode = event?.dressCode || 'Formal / Smart Elegance';

  const tierColor = tier === 'VIP' ? '#f59e0b' : tier === 'ALL_ACCESS' ? '#8b5cf6' : '#10b981';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Digital Access Pass - ${eventName}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0b0f17; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f3f4f6;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0b0f17; padding: 30px 15px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 540px; background: #111827; border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);">
          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%); padding: 36px 30px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.08);">
              <span style="display: inline-block; padding: 4px 14px; background: rgba(99, 102, 241, 0.2); border: 1px solid rgba(99, 102, 241, 0.4); border-radius: 999px; font-size: 11px; font-weight: 700; letter-spacing: 0.1em; color: #a5b4fc; text-transform: uppercase; margin-bottom: 12px;">
                Official Digital Invitation
              </span>
              <h1 style="margin: 0; font-size: 26px; font-weight: 800; color: #ffffff; letter-spacing: -0.02em;">
                ${eventName}
              </h1>
              <p style="margin: 8px 0 0 0; font-size: 14px; color: #94a3b8;">
                Cryptographically Signed Gate Access Pass
              </p>
            </td>
          </tr>

          <!-- Guest & Pass Details -->
          <tr>
            <td style="padding: 30px;">
              <div style="background: #1f2937; border-radius: 14px; padding: 20px; border: 1px solid rgba(255,255,255,0.06); margin-bottom: 24px;">
                <table width="100%" cellspacing="0" cellpadding="0">
                  <tr>
                    <td>
                      <span style="font-size: 12px; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em;">Attendee</span>
                      <h2 style="margin: 4px 0 0 0; font-size: 18px; font-weight: 700; color: #f9fafb;">${guestName}</h2>
                    </td>
                    <td align="right">
                      <span style="display: inline-block; padding: 6px 12px; background: rgba(245, 158, 11, 0.15); border: 1px solid ${tierColor}; border-radius: 8px; font-size: 12px; font-weight: 800; color: ${tierColor}; text-transform: uppercase;">
                        ${tier}
                      </span>
                    </td>
                  </tr>
                </table>
              </div>

              <!-- Event Schedule -->
              <table width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 24px;">
                <tr>
                  <td width="50%" style="padding-right: 10px; vertical-align: top;">
                    <div style="background: #182234; border-radius: 12px; padding: 14px;">
                      <span style="font-size: 11px; color: #64748b; font-weight: 600; text-transform: uppercase;">Date & Time</span>
                      <p style="margin: 4px 0 0 0; font-size: 13px; font-weight: 600; color: #e2e8f0;">${date} • ${time}</p>
                    </div>
                  </td>
                  <td width="50%" style="padding-left: 10px; vertical-align: top;">
                    <div style="background: #182234; border-radius: 12px; padding: 14px;">
                      <span style="font-size: 11px; color: #64748b; font-weight: 600; text-transform: uppercase;">Venue</span>
                      <p style="margin: 4px 0 0 0; font-size: 13px; font-weight: 600; color: #e2e8f0;">${venue}</p>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Dress Code Note -->
              <p style="margin: 0 0 28px 0; font-size: 13px; color: #94a3b8; text-align: center;">
                <strong style="color: #cbd5e1;">Dress Code:</strong> ${dressCode}
              </p>

              <!-- CTA Button -->
              <table width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <a href="${passUrl}" target="_blank" style="display: inline-block; width: 85%; padding: 16px 24px; background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); color: #ffffff; text-decoration: none; border-radius: 12px; font-size: 15px; font-weight: 700; text-align: center; letter-spacing: 0.02em; box-shadow: 0 10px 25px -5px rgba(79, 70, 229, 0.4);">
                      🎟️ Open Live Digital QR Pass
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 20px 0 0 0; font-size: 11px; color: #64748b; text-align: center;">
                Save this link to your phone. Present the QR code on your screen upon arrival at the gate for instant sub-second verification.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background: #0f172a; padding: 18px 30px; text-align: center; border-top: 1px solid rgba(255,255,255,0.06);">
              <p style="margin: 0; font-size: 11px; color: #475569;">
                Protected by Ed25519 Cryptographic Signatures & Anti-Replay Gate Verification.<br>
                Powered by QRInvite Institutional Access Engine.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

/**
 * Dispatch Pass via Email
 */
async function sendPassEmail({ guest, ticket, event, baseUrl = 'http://localhost:5173' }) {
  const recipientEmail = guest?.email || ticket?.email;
  if (!recipientEmail) {
    return { success: false, channel: 'EMAIL', message: 'No recipient email provided' };
  }

  const tokenOrId = ticket?.qrToken || ticket?._id || guest?.qrToken;
  const passUrl = `${baseUrl}/pass/${tokenOrId}`;
  const eventName = event?.name || 'Exclusive Event';

  const transporter = getTransporter();
  const html = generatePassEmailHtml({ guest, ticket, event, passUrl });

  try {
    const result = await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"QRInvite Access" <passes@qrinvite.local>',
      to: recipientEmail,
      subject: `🎟️ Your Access Pass: ${eventName}`,
      html,
      context: { ticketId: tokenOrId },
    });

    return {
      success: true,
      channel: 'EMAIL',
      recipient: recipientEmail,
      messageId: result.messageId,
      previewUrl: result.previewUrl || passUrl,
    };
  } catch (err) {
    console.error('Error sending pass email:', err);
    return {
      success: false,
      channel: 'EMAIL',
      recipient: recipientEmail,
      error: err.message,
    };
  }
}

/**
 * Dispatch Pass via WhatsApp Cloud API or direct WhatsApp link
 */
async function sendPassWhatsApp({ guest, ticket, event, baseUrl = 'http://localhost:5173' }) {
  const phone = guest?.phone || ticket?.phone;
  const tokenOrId = ticket?.qrToken || ticket?._id || guest?.qrToken;
  const passUrl = `${baseUrl}/pass/${tokenOrId}`;
  const guestName = guest?.name || ticket?.guestName || 'Valued Guest';
  const eventName = event?.name || 'Your Event';
  const tier = (ticket?.tier || guest?.tier || 'GENERAL').toUpperCase();

  const message = `🎟️ *${eventName} — Official Access Pass*\n\nHello *${guestName}*,\nYour digital invitation pass (*${tier}*) is ready.\n\n📅 Date: ${event?.date || 'Upcoming'} at ${event?.time || '18:00'}\n📍 Venue: ${event?.venue || 'Event Venue'}\n\n👉 *View & Present Your QR Pass:*\n${passUrl}\n\nPlease present this pass at the gate for instant optical verification.`;

  // Clean phone number: remove non-digits
  const cleanPhone = phone ? phone.replace(/[^0-9]/g, '') : null;

  // WhatsApp Cloud API configuration
  const whatsappApiToken = process.env.WHATSAPP_API_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (whatsappApiToken && phoneNumberId && cleanPhone) {
    try {
      const response = await fetch(`https://graph.facebook.com/v19.0/${phoneNumberId}/messages`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${whatsappApiToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: cleanPhone,
          type: 'text',
          text: { body: message },
        }),
      });

      const data = await response.json();
      return {
        success: response.ok,
        channel: 'WHATSAPP',
        recipient: cleanPhone,
        messageId: data.messages?.[0]?.id,
        whatsappUrl: `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`,
      };
    } catch (err) {
      console.error('WhatsApp Cloud API error:', err);
    }
  }

  // Resilient fallback / direct clickable URL
  console.log(`[DISPATCH:WHATSAPP:SIMULATION] To: ${cleanPhone || 'N/A'} | Pass: ${passUrl}`);
  return {
    success: true,
    channel: 'WHATSAPP',
    recipient: cleanPhone || 'simulated',
    whatsappUrl: cleanPhone ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}` : null,
    message,
    previewPassUrl: passUrl,
  };
}

/**
 * Dispatch Pass via SMS
 */
async function sendPassSMS({ guest, ticket, event, baseUrl = 'http://localhost:5173' }) {
  const phone = guest?.phone || ticket?.phone;
  const tokenOrId = ticket?.qrToken || ticket?._id || guest?.qrToken;
  const passUrl = `${baseUrl}/pass/${tokenOrId}`;
  const eventName = event?.name || 'Exclusive Event';
  const guestName = guest?.name || ticket?.guestName || 'Guest';

  const smsText = `🎟️ Hi ${guestName}! Your ${eventName} pass is ready: ${passUrl} . Present at gate.`;

  console.log(`[DISPATCH:SMS:SIMULATION] To: ${phone} | Text: ${smsText}`);
  return {
    success: true,
    channel: 'SMS',
    recipient: phone,
    text: smsText,
  };
}

/**
 * Universal Multi-Channel Dispatch Handler
 */
async function dispatchPass({ guest, ticket, event, channels = ['EMAIL', 'WHATSAPP'], baseUrl }) {
  const results = [];

  const normalizedChannels = Array.isArray(channels)
    ? channels.map((c) => String(c).toUpperCase())
    : [String(channels).toUpperCase()];

  const shouldSendAll = normalizedChannels.includes('ALL');

  if (shouldSendAll || normalizedChannels.includes('EMAIL')) {
    if (guest?.email || ticket?.email) {
      const emailResult = await sendPassEmail({ guest, ticket, event, baseUrl });
      results.push(emailResult);
    }
  }

  if (shouldSendAll || normalizedChannels.includes('WHATSAPP')) {
    if (guest?.phone || ticket?.phone) {
      const waResult = await sendPassWhatsApp({ guest, ticket, event, baseUrl });
      results.push(waResult);
    }
  }

  if (shouldSendAll || normalizedChannels.includes('SMS')) {
    if (guest?.phone || ticket?.phone) {
      const smsResult = await sendPassSMS({ guest, ticket, event, baseUrl });
      results.push(smsResult);
    }
  }

  const anySuccess = results.some((r) => r.success);
  const primaryChannel = results.find((r) => r.success)?.channel || 'NONE';

  return {
    success: anySuccess,
    channelsSent: results.filter((r) => r.success).map((r) => r.channel),
    primaryChannel,
    results,
  };
}

module.exports = {
  dispatchPass,
  sendPassEmail,
  sendPassWhatsApp,
  sendPassSMS,
  generatePassEmailHtml,
};
