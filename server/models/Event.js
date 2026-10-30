const mongoose = require('mongoose');

const ticketTierSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, default: 0 },
  capacity: { type: Number, default: 100 },
  sold: { type: Number, default: 0 },
  perks: { type: String },
});

const eventSchema = new mongoose.Schema(
  {
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    type: {
      type: String,
      enum: ['PUBLIC', 'PRIVATE'],
      default: 'PUBLIC',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
    },
    category: {
      type: String,
      default: 'Celebration',
    },
    venue: {
      type: String,
      required: [true, 'Venue location is required'],
    },
    date: {
      type: String,
      required: [true, 'Event date is required'],
    },
    time: {
      type: String,
      default: '18:00',
    },
    banner: {
      type: String,
      default: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80',
    },
    description: {
      type: String,
    },
    capacity: {
      type: Number,
      required: true,
      default: 500,
    },
    issued: {
      type: Number,
      default: 0,
    },
    checkedIn: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'UPCOMING', 'COMPLETED', 'ARCHIVED'],
      default: 'ACTIVE',
    },
    // For Private Invitation Cards
    dressCode: {
      type: String,
      default: 'Formal Elegance',
    },
    cardTheme: {
      type: String,
      enum: ['luxury-gold', 'midnight-vip', 'emerald-prestige', 'cyber-neon', 'minimal-ivory'],
      default: 'luxury-gold',
    },
    customMessage: {
      type: String,
      default: 'We request the honor of your presence to celebrate with us.',
    },
    hostName: {
      type: String,
      default: 'Event Host',
    },
    // For Public Ticket Tiers
    ticketTiers: [ticketTierSchema],
    scannerPin: {
      type: String,
      default: '1234',
    },
    // Cryptography
    publicKey: {
      type: String,
      required: true,
    },
    privateKey: {
      type: String,
      select: false,
    },
    privateKeyEncrypted: {
      type: String,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Event', eventSchema);
