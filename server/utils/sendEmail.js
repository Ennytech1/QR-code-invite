const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  if (!process.env.SMTP_HOST || !process.env.SMTP_EMAIL) {
    console.log(`[Email Mock Service] Simulated email sent to ${options.email}: ${options.subject}`);
    return { success: true, simulated: true };
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT || 587,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const message = {
    from: `${process.env.FROM_NAME || 'QRInvite Security'} <${process.env.FROM_EMAIL || process.env.SMTP_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  const info = await transporter.sendMail(message);
  return { success: true, messageId: info.messageId };
};

module.exports = sendEmail;
