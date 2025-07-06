const express = require('express');
const router = express.Router();
const PhoneNumber = require('../models/PhoneNumber');
const rateLimiter = require('../middleware/rateLimiter');

router.post('/', rateLimiter, async (req, res) => {
  const { number } = req.body;

  if (!number) return res.status(400).json({ error: "Number is required" });

  try {
    const existing = await PhoneNumber.findOne({ number });
    if (existing) {
      return res.status(409).json({ message: "Already protected" });
    }

    const newNumber = new PhoneNumber({ number });
    await newNumber.save();

    res.status(201).json({ message: "Number protected successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
