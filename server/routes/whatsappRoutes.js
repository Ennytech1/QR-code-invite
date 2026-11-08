const express = require('express');
const router = express.Router();
const {
  verifyWebhook,
  handleWebhook,
} = require('../controllers/whatsappWebhookController');

// Meta WhatsApp Cloud API Webhook routes
router.get('/webhook', verifyWebhook);
router.post('/webhook', handleWebhook);

module.exports = router;
