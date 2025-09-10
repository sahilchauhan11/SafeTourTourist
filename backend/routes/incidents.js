const express = require('express');
const Incident = require('../models/Incident');
const authMiddleware = require('./user').authMiddleware; // Reuse

const router = express.Router();

// POST /api/incident - Report incident
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { description } = req.body;
    const location = { lat: 20.5937, lng: 78.9629 }; // From frontend geolocation
    const incident = new Incident({
      userId: req.user.userId,
      description,
      location
    });
    await incident.save();
    res.json({ message: 'Incident reported successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/incident - Fetch user incidents
router.get('/', authMiddleware, async (req, res) => {
  try {
    const incidents = await Incident.find({ userId: req.user.userId })
      .sort({ timestamp: -1 });
    res.json(incidents);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;