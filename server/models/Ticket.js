const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
    },
    guestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Guest',
    },
    guestName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    tier: {
      type: String,
      enum: ['REGULAR', 'VIP', 'VVIP', 'VENDOR', 'MEDIA'],
      default: 'REGULAR',
    },
    table: {
      type: String,
      default: 'General Seating',
    },
    plusOnes: {
      type: Number,
      default: 0,
    },
    qrToken: {
      type: String,
      required: true,
      unique: true,
    },
    signature: {
      type: String,
    },
    cardTheme: {
      type: String,
      default: 'luxury-gold',
    },
    dispatched: {
      type: Boolean,
      default: false,
    },
    dispatchedVia: {
      type: String,
      enum: ['WHATSAPP', 'EMAIL', 'SMS', 'MANUAL_DOWNLOAD', 'NONE'],
      default: 'NONE',
    },
    status: {
      type: String,
      enum: ['VALID', 'CHECKED_IN', 'REVOKED'],
      default: 'VALID',
    },
    checkInTime: {
      type: Date,
      default: null,
    },
    gateScanned: {
      type: String,
      default: null,
    },
    scannedByDevice: {
      type: String,
      default: null,
    },
    scanCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for fast gate token lookup
ticketSchema.index({ qrToken: 1, event: 1 });

module.exports = mongoose.model('Ticket', ticketSchema);
