const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.post('/register', (req, res) => {
  const { name, phone, email, password, referCode } = req.body;

  const sql = `INSERT INTO users (name, phone, email, password, refer_code) VALUES (?, ?, ?, ?, ?)`;

  db.query(sql, [name, phone, email, password, referCode], (err, result) => {
    if (err) {
      console.error('Error inserting user:', err);
      return res.status(500).json({ message: 'Registration failed' });
    }

    return res.status(200).json({ message: 'User registered successfully' });
  });
});

module.exports = router;
