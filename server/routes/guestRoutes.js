const express = require('express');
const router = express.Router();
const {
  getGuests,
  getGuest,
  createGuest,
  bulkAddGuests,
  updateGuest,
  deleteGuest,
} = require('../controllers/guestController');

router.route('/')
  .get(getGuests)
  .post(createGuest);

router.route('/bulk')
  .post(bulkAddGuests);

router.route('/:id')
  .get(getGuest)
  .put(updateGuest)
  .delete(deleteGuest);

module.exports = router;
