const mongoose = require('mongoose');

const incidentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  description: { type: String, required: true },
  location: {
    lat: Number,
    lng: Number
  },
  timestamp: { type: Date, default: Date.now },
  status: { type: String, enum: ['open', 'in-progress', 'resolved'], default: 'open' }
});

module.exports = mongoose.model('Incident', incidentSchema);