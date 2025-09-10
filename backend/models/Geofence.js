const mongoose = require('mongoose');

const geofenceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  coordinates: { type: [[[Number]]], required: true }, // Turf.js polygon format
  restricted: { type: Boolean, default: true },
  permitRequired: { type: String }, // e.g., 'ILP'
  description: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Geofence', geofenceSchema);