// routes/index.js
const express = require('express');
const authRoutes = require('./auth');
const cloudinaryRoutes = require('./cloudinary');
const debugRoutes = require('./debug');
const proxyRoutes = require('./proxy');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Test route
router.get('/test', (req, res) => {
  res.json({ message: 'API is working' });
});

// Protected route example
router.get('/protected', verifyToken, (req, res) => {
  return res.json({ 
    message: 'This is a protected endpoint',
    user: req.user
  });
});

// Use other route files
router.use('/auth', authRoutes);
router.use('/cloudinary', cloudinaryRoutes);
router.use('/debug', debugRoutes);
router.use('/proxy', proxyRoutes);

module.exports = router;