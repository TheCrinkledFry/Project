const express = require('express');
const router = express.Router();
const { read, write } = require('../fileDb');

// GET all codes
router.get('/', async (req, res) => {
  const codes = await read('discounts');
  res.json(codes);
});

// POST create code
router.post('/', async (req, res) => {
  const { code, amount } = req.body;
  const list = await read('discounts');
  const nextId = list.length ? Math.max(...list.map(c => c.id)) + 1 : 1;
  const newCode = { id: nextId, code, amount };
  list.push(newCode);
  await write('discounts', list);
  res.status(201).json(newCode);
});

module.exports = router;

