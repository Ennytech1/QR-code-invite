const express = require('express');
const router = express.Router();
const {
  verifyAndCheckIn,
  syncOfflineScans,
  usherLogin,
} = require('../controllers/scanController');

router.post('/verify', verifyAndCheckIn);
router.post('/sync', syncOfflineScans);
router.post('/usher-login', usherLogin);

module.exports = router;
