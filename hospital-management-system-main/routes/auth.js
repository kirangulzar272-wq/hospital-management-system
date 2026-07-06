const express = require('express');
const router = express.Router();
const { readDB } = require('../utils/db');

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const db = readDB();
  const user = db.users.find(u => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).json({ success: false, message: 'Incorrect email or password' });
  }

  res.json({
    success: true,
    user: { id: user.id, name: user.name, role: user.role, username: user.username }
  });
});

module.exports = router;
