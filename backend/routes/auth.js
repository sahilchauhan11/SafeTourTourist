const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// POST /api/auth/register - Blockchain login
router.post('/register', async (req, res) => {
  try {
    const { walletAddress } = req.body;
    if (!walletAddress) {
      return res.status(400).json({ error: 'Wallet address required' });
    }

    // Check if user exists
    let user = await User.findOne({ walletAddress });
    if (!user) {
      // Create new user (in production, verify signature on blockchain)
      user = new User({
        walletAddress,
        did: `did:eth:${walletAddress}`, // Simplified DID
        role: 'tourist',
        permits: [], // Default no permits
      });
      await user.save();
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, did: user.did, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      did: user.did,
      role: user.role,
      token,
      avatar: user.avatar || 'https://i.pravatar.cc/150?img=12'
    });
  } catch (err) {
    console.error('Auth error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;