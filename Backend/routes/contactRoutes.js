// backend/routes/contactRoutes.js
const express = require('express');
const Contact = require('../models/Contact');
const sendContactEmail = require('../utils/sendEmail');

const router = express.Router();

router.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    // Basic validation (Mongoose will handle schema-level, but this gives better control)
    if (!name || !email || !phone || !message) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    // Save to DB
    const contact = new Contact({ name, email, phone, message });
    await contact.save();

    // Send email (non-blocking – don’t await if you prefer fire-and-forget)
    sendContactEmail({ name, email, phone, message });

    res.status(201).json({
      success: true,
      message: 'Enquiry submitted successfully!',
    });
  } catch (error) {
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ error: messages.join(', ') });
    }

    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error. Please try again later.' });
  }
});

module.exports = router;