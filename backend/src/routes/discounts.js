// backend/src/routes/discounts.js

const express = require('express');
const router  = express.Router();
const { read, write } = require('../fileDb');

// GET /api/discounts → read all discounts from discounts.json
router.get('/', async (req, res) => {
  try {
    const discounts = await read('discounts');
    res.json(discounts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to read discounts' });
  }
});

// POST /api/discounts → add a new discount to discounts.json
router.post('/', async (req, res) => {
  try {
    const discounts = await read('discounts');
    const nextId = discounts.length
      ? Math.max(...discounts.map(d => d.id)) + 1
      : 1;

    const newDiscount = { id: nextId, ...req.body };
    discounts.push(newDiscount);
    await write('discounts', discounts);

    res.status(201).json(newDiscount);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save discount' });
  }
});

module.exports = router;

