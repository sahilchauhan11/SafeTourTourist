const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  did: { type: String, required: true, unique: true }, // Blockchain DID
  walletAddress: { type: String, required: true, unique: true },
  role: { type: String, enum: ['tourist', 'authority'], default: 'tourist' },
  permits: [{ type: String }], // e.g., ['ILP', 'PAP']
  avatar: { type: String },
  locationHistory: [{
    lat: Number,
    lng: Number,
    timestamp: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);