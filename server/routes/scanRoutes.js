const express = require('express');
const router = express.Router();
const {
  verifyAndCheckIn,
  syncOfflineScans,
} = require('../controllers/scanController');

router.post('/verify', verifyAndCheckIn);
router.post('/sync', syncOfflineScans);

module.exports = router;
