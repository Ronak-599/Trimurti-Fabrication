// backend/server.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config({ override: true });

const connectDB = require('./config/db');
const contactRoutes = require('./routes/contactRoutes');
const galleryRoutes = require('./routes/galleryRoutes');
const adminRoutes = require('./routes/adminRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
// Allow cross-origin image embedding from the dev server and disable restrictive CORP default
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
const allowedOrigins = process.env.NODE_ENV === 'development'
  ? ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5173', 'http://127.0.0.1:5173']
  : ['https://yourdomain.com'];
app.use(cors({ origin: allowedOrigins }));
app.use(morgan('dev')); // Log requests in dev
app.use(express.json({ limit: '10mb' })); // Parse JSON bodies
// Serve uploaded images when using local disk storage
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/', contactRoutes);
app.use('/api', galleryRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', reviewRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Handle 404 (keep last)
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
