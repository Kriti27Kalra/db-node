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
  const { name, phone, email, password, referCode } = req.body;
  
  // Basic data validation
  if (!name || !phone || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Log incoming data (for debugging)
  console.log('Received data:', req.body);

  // MySQL query to insert data into the `consumers` table
  const query = 'INSERT INTO consumers (name, phone, email, password, refer_code) VALUES (?, ?, ?, ?, ?)';
  console.log('Executing query:', query, [name, phone, email, password, referCode]);

  db.query(query, [name, phone, email, password, referCode], (err, result) => {
    if (err) {
        console.error('Registration error:', err.sqlMessage || err.message || err);
        return res.status(500).json({ message: 'Registration failed', error: err.sqlMessage || err.message });
        
    }
    console.log('Registration successful:', result);  // Log the result for debugging
    res.status(201).json({ message: 'Registration successful', result });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
