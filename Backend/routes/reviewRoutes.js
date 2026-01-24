// Review routes
const express = require('express');
const router = express.Router();
const { createReview, getReviews, deleteReview } = require('../controllers/reviewController');
const auth = require('../middleware/authMiddleware');

// Public endpoints
router.post('/reviews', createReview);
router.get('/reviews', getReviews);

// Admin-only delete
router.delete('/reviews/:id', auth, deleteReview);

module.exports = router;
