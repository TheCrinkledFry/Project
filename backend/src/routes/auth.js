// backend/src/routes/auth.js

const express = require('express');
const jwt     = require('jsonwebtoken');
const { read, write } = require('../fileDb');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { email, password, role = 'employee' } = req.body;
  try {
    const users = await read('users');
    if (users.find(u => u.email === email)) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    const nextId = users.length ? Math.max(...users.map(u => u.id)) + 1 : 1;
    const newUser = { id: nextId, email, password, role };
    users.push(newUser);
    await write('users', users);
    res.status(201).json({ id: newUser.id, email: newUser.email, role: newUser.role });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const users = await read('users');
    const user = users.find(u => u.email === email);
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign(
      { userId: user.id, role: user.role, email: user.email },
      JWT_SECRET,
      { expiresIn: '8h' }
    );
    res.json({ token, role: user.role });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
});

module.exports = router;

