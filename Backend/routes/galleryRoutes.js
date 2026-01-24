// Gallery routes
// POST /api/gallery - admin only image upload
// GET /api/gallery - public, fetch all images
const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
const galleryController = require('../controllers/galleryController');
const authMiddleware = require('../middleware/authMiddleware');
// Route to upload a gallery image (admin only)
router.post('/gallery', authMiddleware, upload.single('image'), galleryController.uploadGalleryImage);
// Route to fetch all gallery images (public)
router.get('/gallery', galleryController.getGalleryImages);
// Route to fetch images for a specific service/collection (public)
router.get('/gallery/service/:key', galleryController.getServiceGallery);
// Route to delete a gallery image (admin only)
router.delete('/gallery/:id', authMiddleware, galleryController.deleteGalleryImage);

module.exports = router;