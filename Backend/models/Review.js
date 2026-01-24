// Mongoose schema for service reviews
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true, maxlength: 1000 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Review', reviewSchema);
