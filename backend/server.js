const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const { errorHandler } = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');
const contactRoutes = require('./routes/contact');
const adminRoutes = require('./routes/admin');

const app = express();

// --- Middleware ---
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging (skip in test environment)
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Serve static frontend files
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// --- API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'ShopSphere API is running!',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Catch-all: serve frontend for SPA routing
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
  } else {
    res.status(404).json({
      success: false,
      message: 'API endpoint not found.'
    });
  }
});

// Error handler
app.use(errorHandler);

// --- Start Server ---
const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log('');
    console.log('🛍️  ═══════════════════════════════════════════');
    console.log('   ShopSphere API Server');
    console.log('   ─────────────────────────────────────────');
    console.log(`   🚀 Server:   http://localhost:${PORT}`);
    console.log(`   📡 API:      http://localhost:${PORT}/api`);
    console.log(`   🏥 Health:   http://localhost:${PORT}/api/health`);
    console.log(`   🌐 Frontend: http://localhost:${PORT}`);
    console.log('   ─────────────────────────────────────────');
    console.log(`   📦 ENV: ${process.env.NODE_ENV || 'development'}`);
    console.log('═══════════════════════════════════════════════');
    console.log('');
  });
}

module.exports = app;
