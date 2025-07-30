const express = require('express');
const router  = express.Router();
const { read, write } = require('../fileDb');

router.get('/', async (req, res) => {
  const products = await read('products');
  res.json(products);
});

router.post('/', async (req, res) => {
  const list = await read('products');
  const nextId = list.length ? Math.max(...list.map(p => p.id)) + 1 : 1;
  const newProd = { id: nextId, ...req.body };
  list.push(newProd);
  await write('products', list);
  res.status(201).json(newProd);
});

// PUT /api/products/:id
router.put('/:id', async (req, res) => {
  try {
    const list = await read('products');
    const idx  = list.findIndex(p => p.id === +req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Product not found' });
    const upd = req.body;
    // Merge allowed fields
    ['name','price','quantity','imageUrl','description','discontinued'].forEach(key => {
      if (upd[key] !== undefined) list[idx][key] = upd[key];
    });
    // Recompute availability
    list[idx].available = !list[idx].discontinued && list[idx].quantity > 0;
    await write('products', list);
    res.json(list[idx]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update product' });
  }
});

module.exports = router;

