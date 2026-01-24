// Admin authentication routes
// POST /api/admin/login
const express = require('express');
const { adminLogin } = require('../controllers/adminController');
const router = express.Router();

router.post('/login', adminLogin);

module.exports = router;