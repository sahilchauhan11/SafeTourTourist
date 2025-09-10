const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Middleware to verify JWT
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// GET /api/user/permits - Fetch user permits
router.get('/permits', authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ did: req.user.did }).select('permits');
    res.json({ permits: user.permits });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/user/permits - Add permit (admin or self)
router.post('/permits', authMiddleware, async (req, res) => {
  try {
    const { permit } = req.body; // e.g., 'ILP'
    const user = await User.findOneAndUpdate(
      { did: req.user.did },
      { $addToSet: { permits: permit } },
      { new: true }
    ).select('permits');
    res.json({ permits: user.permits });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/user/refresh-id - Refresh user data
router.get('/refresh-id', authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ did: req.user.did }).select('permits');
    res.json({ permits: user.permits });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;