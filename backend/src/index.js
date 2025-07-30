// backend/src/index.js

require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const path    = require('path');

const authRoutes     = require('./routes/auth');
const productRoutes  = require('./routes/products');
const orderRoutes    = require('./routes/orders');
const discountRoutes = require('./routes/discounts');

const app = express();

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Serve product images from data/images
app.use(
  '/images',
  express.static(path.join(__dirname, '../data/images'))
);

// Health check
app.get('/', (req, res) => res.send('👋 JSON‑DB backend alive!'));

// Mount your API routes
app.use('/api/auth',      authRoutes);
app.use('/api/products',  productRoutes);
app.use('/api/orders',    orderRoutes);
app.use('/api/discounts', discountRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

