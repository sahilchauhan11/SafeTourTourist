const express = require('express');
const Alert = require('../models/Alert');
const User = require('../models/User');
const authMiddleware = require('./user').authMiddleware; // Reuse from user.js

const router = express.Router();

// GET /api/alerts - Fetch recent alerts
router.get('/', authMiddleware, async (req, res) => {
  try {
    const alerts = await Alert.find({ acknowledged: false })
      .sort({ timestamp: -1 })
      .limit(10)
      .populate('userId', 'did');
    res.json(alerts.map(a => ({
      _id: a._id,
      type: a.type,
      message: a.message,
      location: a.location,
      timestamp: a.timestamp,
      userId: a.userId?.did || 'Anonymous'
    })));
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/alerts - Create alert (e.g., SOS)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { type, message, location } = req.body;
    const alert = new Alert({
      type,
      userId: req.user.userId,
      message,
      location
    });
    await alert.save();
    res.status(201).json(alert);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;