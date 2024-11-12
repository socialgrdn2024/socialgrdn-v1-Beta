/**
 * RegisterAPI.js
 * Description: API to handle user registration and check user existence by email
 * Author: Donald Jans Uy
 * Date: 2024-10-20
 */

const express = require('express');
const router = express.Router();

// Handle POST request to register a new user
router.post('/register', (req, res) => {
  const { email, firstname, lastname, username, profession, phoneNumber, userAddress, userCity, userProvince, userPostalCode } = req.body;

  // Check if required fields are provided
  if (!firstname || !lastname || !username || !email) {
    return res.status(400).send('First name, last name, username, and email are required');
  }

// SQL query to insert a new user profile into the database
  const query = `
    INSERT INTO UserProfile (
      email, first_name, last_name, username, profession, phone_number, 
      address_line1, city, province, postal_code, role, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, '1', '1')
  `;
  const values = [
    email, firstname, lastname, username, profession, phoneNumber, 
    userAddress, userCity, userProvince, userPostalCode
  ];
 
  // Execute the query to register the user
  db.query(query, values, (err, results) => {
    if (err) {
      console.error('Error registering user:', err);
      res.status(500).send('Error registering user');
    } else {
      res.status(200).send('User registered successfully');
    }
  });
});

// Handle POST request to check if a user exists by email

router.post('/check-user', async (req, res) => {
  const { email } = req.body;
  console.log('Checking for user with email:', email);
  try {
    const result = await db.query('SELECT * FROM UserProfile WHERE email = ?', [email]);
    console.log('Query result:', result);
    if (result.length > 0) {
      return res.status(200).json({ exists: true });
    }
    return res.status(200).json({ exists: false });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;