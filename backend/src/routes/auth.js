// backend/src/routes/auth.js
const express = require('express');
const router  = express.Router();

// Example: always “logs in” and returns a dummy token
router.post('/login', (req, res) => {
  // you could validate req.body here
  return res.json({ token: 'fake-jwt-token' });
});

module.exports = router;

