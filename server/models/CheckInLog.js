const mongoose = require('mongoose');

const checkInLogSchema = new mongoose.Schema(
  {
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ticket',
      required: false,
    },
    ticketToken: {
      type: String,
      required: false,
      index: true,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: false,
      index: true,
    },
    result: {
      type: String,
      enum: ['SUCCESS', 'DUPLICATE', 'INVALID', 'FORGED', 'REVOKED'],
      required: true,
    },
    gateName: {
      type: String,
      default: 'Main Entrance',
    },
    scannerDeviceId: {
      type: String,
      default: 'scanner_terminal_1',
    },
    guestName: {
      type: String,
    },
    tier: {
      type: String,
    },
    reason: {
      type: String,
    },
    scannedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('CheckInLog', checkInLogSchema);
