const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  type: { type: String, enum: ['geofenceBreach', 'sos', 'crowdDensity'], required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  message: String,
  location: {
    lat: Number,
    lng: Number
  },
  timestamp: { type: Date, default: Date.now },
  acknowledged: { type: Boolean, default: false }
});

module.exports = mongoose.model('Alert', alertSchema);