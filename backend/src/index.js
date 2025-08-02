// backend/src/index.js

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');

// Routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const discountRoutes = require('./routes/discounts');

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000'], // Add production domain here later
}));
app.use(express.json());
app.use(morgan('dev'));

// Serve static product images
app.use('/images', express.static(path.join(__dirname, '../data/images')));

// Health check
app.get('/', (req, res) => res.send('👋 JSON‑DB backend alive!'));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/discounts', discountRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server listening on port ${PORT}`));
