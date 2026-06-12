const express = require('express');
const { generateBlockchainHash, verifyBlockchainHash } = require('../services/blockchain');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/blockchain/verify
// @desc    Verify blockchain hash
// @access  Private
router.post('/verify', auth, async (req, res) => {
  try {
    const { hash, data } = req.body;
    const isValid = await verifyBlockchainHash(hash, data);
    res.json({ isValid, hash });
  } catch (error) {
    console.error('Blockchain Verify Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

