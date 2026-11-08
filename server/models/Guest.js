const mongoose = require('mongoose');

const guestSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
      index: true,
    },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
    },
    name: {
      type: String,
      required: [true, 'Guest name is required'],
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
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
    cardTheme: {
      type: String,
      default: 'luxury-gold',
    },
    table: {
      type: String,
      default: 'General Seating',
    },
    seatNumber: {
      type: String,
      default: '',
    },
    plusOnes: {
      type: Number,
      default: 0,
    },
    plusOnesCheckedIn: {
      type: Number,
      default: 0,
    },
    rsvpStatus: {
      type: String,
      enum: ['PENDING', 'ATTENDING', 'DECLINED'],
      default: 'PENDING',
    },
    qrToken: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ticket',
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
    gate: {
      type: String,
      default: null,
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
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

guestSchema.index({ event: 1, qrToken: 1 });

module.exports = mongoose.model('Guest', guestSchema);
