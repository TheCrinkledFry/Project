// backend/src/routes/orders.js

const express = require('express');
const router  = express.Router();
const { read, write } = require('../fileDb');

// GET /api/orders → read orders.json and expand each item with its product details
router.get('/', async (req, res) => {
  try {
    const orders   = await read('orders');
    const products = await read('products');

    const withDetails = orders.map(o => ({
      ...o,
      items: o.items.map(i => ({
        ...i,
        product: products.find(p => p.id === i.productId) || null
      }))
    }));

    res.json(withDetails);
  } catch (err) {
    res.status(500).json({ error: 'Failed to read orders' });
  }
});

// POST /api/orders/:id/execute → mark order executed, decrement stock, then return expanded order
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

    // Update order status
    order.status = 'Executed';

    // Persist changes
    await write('products', products);
    await write('orders', orders);

    // Build the expanded order object (with product details)
    const detailedOrder = {
      ...order,
      items: order.items.map(i => ({
        ...i,
        product: products.find(p => p.id === i.productId) || null
      }))
    };

    res.json(detailedOrder);
  } catch (err) {
    res.status(500).json({ error: 'Failed to execute order' });
  }
});

module.exports = router;

