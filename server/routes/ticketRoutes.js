const express = require('express');
const router = express.Router();
const {
  getTickets,
  getTicket,
  getPublicPass,
  dispatchTickets,
} = require('../controllers/ticketController');
const {
  initializeCheckout,
  handlePaystackWebhook,
  handleFlutterwaveWebhook,
} = require('../controllers/paymentWebhookController');

router.route('/')
  .get(getTickets);

router.route('/dispatch')
  .post(dispatchTickets);

router.route('/initialize-checkout')
  .post(initializeCheckout);

router.route('/paystack-webhook')
  .post(handlePaystackWebhook);

router.route('/flutterwave-webhook')
  .post(handleFlutterwaveWebhook);

router.route('/:id')
  .get(getTicket);

router.route('/:id/pass')
  .get(getPublicPass);

module.exports = router;
