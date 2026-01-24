// Quick seed script to create a sample review
const mongoose = require('mongoose');
require('dotenv').config();
const connectDB = require('../config/db');
const Review = require('../models/Review');

(async () => {
  try {
    await connectDB();
    const sample = new Review({
      name: 'First Customer',
      rating: 5,
      comment: 'Excellent service and on-time delivery.'
    });
    await sample.save();
    console.log('✅ Seeded one review:', sample._id.toString());
  } catch (err) {
    console.error('❌ Seed error:', err.message);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
})();
