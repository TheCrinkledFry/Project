// backend/src/routes/orders.js

const express = require('express');
const router  = express.Router();
const { read, write } = require('../fileDb');

// GET /api/orders → read orders.json, expand each item with product details, compute total and include date
router.get('/', async (req, res) => {
  try {
    const orders   = await read('orders');
    const products = await read('products');

    const withDetails = orders.map(o => {
      // Expand items with product data
      const items = o.items.map(i => {
        const product = products.find(p => p.id === i.productId) || {};
        return {
          productId: i.productId,
          quantity: i.quantity,
          product: product
        };
      });
      // Compute total
      const total = items.reduce(
        (sum, item) => sum + (item.product.price || 0) * item.quantity,
        0
      );
      return {
        ...o,
        items,
        total: parseFloat(total.toFixed(2)) // round to 2 decimals
      };
    });

    res.json(withDetails);
  } catch (err) {
    res.status(500).json({ error: 'Failed to read orders' });
  }
});

// POST /api/orders/:id/execute → mark order executed, decrement stock, then return expanded order with total
router.post('/:id/execute', async (req, res) => {
  try {
    const orders   = await read('orders');
    const products = await read('products');
    const order = orders.find(o => o.id === +req.params.id);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    if (order.status !== 'Processing') {
      return res.status(400).json({ error: 'Order already executed' });
    }

    // Decrement stock for each line item
    order.items.forEach(i => {
      const prod = products.find(p => p.id === i.productId);
      if (prod) {
        prod.quantity  -= i.quantity;
        prod.available = prod.quantity > 0;
      }
    });

    // Update order status and date
    order.status = 'Executed';
    order.date   = new Date().toISOString();

    // Persist changes
    await write('products', products);
    await write('orders', orders);

    // Rebuild expanded order with total
    const items = order.items.map(i => {
      const product = products.find(p => p.id === i.productId) || {};
      return { productId: i.productId, quantity: i.quantity, product };
    });
    const total = items.reduce(
      (sum, item) => sum + (item.product.price || 0) * item.quantity,
      0
    );
    const detailedOrder = { ...order, items, total: parseFloat(total.toFixed(2)) };

    res.json(detailedOrder);
  } catch (err) {
    res.status(500).json({ error: 'Failed to execute order' });
  }
});

module.exports = router;

