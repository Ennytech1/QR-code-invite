const express = require('express');
const router = express.Router();
const {
  getTickets,
  getTicket,
  getPublicPass,
  dispatchTickets,
} = require('../controllers/ticketController');

router.route('/')
  .get(getTickets);

router.route('/dispatch')
  .post(dispatchTickets);

router.route('/:id')
  .get(getTicket);

router.route('/:id/pass')
  .get(getPublicPass);

module.exports = router;
