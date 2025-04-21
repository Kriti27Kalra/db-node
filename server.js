const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
require('dotenv').config();  // To load environment variables from .env file

const app = express();
const port = 5000;

// Middleware
app.use(express.json());  // To parse JSON bodies from POST requests
app.use(cors());  // Enable Cross-Origin Request Sharing (CORS)

// MySQL database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('MySQL connection error:', err);  // More detailed error logging
    return;
  }
  console.log('MySQL connected successfully!');
});

// POST route to handle user registration
app.post('/api/register', (req, res) => {
  console.log('Received registration request:', req.body);  // Log the incoming request data for debugging
  
  const { name, phone, email, password, confirmPassword, referCode } = req.body;

  // Basic field presence validation
  if (!name || !phone || !email || !password || !confirmPassword) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  // Password confirmation check
  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  // Check if email already exists
  const checkEmailQuery = 'SELECT * FROM consumers WHERE email = ?';
  db.query(checkEmailQuery, [email], (err, results) => {
    if (err) {
      console.error('Email check error:', err);
      return res.status(500).json({ message: 'Server error while checking email' });
    }

    if (results.length > 0) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Insert new user if email doesn't exist
    const insertQuery = 'INSERT INTO consumers (name, phone, email, password, refer_code) VALUES (?, ?, ?, ?, ?)';
    db.query(insertQuery, [name, phone, email, password, referCode], (err, result) => {
      if (err) {
        console.error('Registration error:', err);
        return res.status(500).json({ message: 'Registration failed', error: err });
      }
      console.log('User registered successfully:', result);  // Log successful registration
      res.status(201).json({ message: 'Registration successful' });
    });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
