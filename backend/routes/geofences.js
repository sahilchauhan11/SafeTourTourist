const express = require('express');
const Geofence = require('../models/Geofence');

const router = express.Router();

// GET /api/geofences - Fetch all geofences
router.get('/', async (req, res) => {
  try {
    const geofences = await Geofence.find({});
    res.json(geofences.map(g => ({
      _id: g._id,
      name: g.name,
      coordinates: g.coordinates,
      restricted: g.restricted,
      permitRequired: g.permitRequired
    })));
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/geofences - Add new geofence (admin only)
router.post('/', async (req, res) => {
  try {
    const { name, coordinates, restricted, permitRequired } = req.body;
    const geofence = new Geofence({ name, coordinates, restricted, permitRequired });
    await geofence.save();
    res.status(201).json(geofence);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;