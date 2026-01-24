// Controllers for reviews
const Review = require('../models/Review');

exports.createReview = async (req, res) => {
  try {
    const { name, rating, comment } = req.body;
    if (!name || !rating || !comment) {
      return res.status(400).json({ message: 'Name, rating, and comment are required' });
    }
    const r = Number(rating);
    if (Number.isNaN(r) || r < 1 || r > 5) {
      return res.status(400).json({ message: 'Rating must be a number between 1 and 5' });
    }
    const review = new Review({ name, rating: r, comment });
    await review.save();
    return res.status(201).json({ message: 'Thank you for your review!', review });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to submit review', error: err.message });
  }
};

exports.getReviews = async (_req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    return res.json({ reviews });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch reviews', error: err.message });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Review.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Review not found' });
    return res.json({ message: 'Review deleted' });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to delete review', error: err.message });
  }
};
