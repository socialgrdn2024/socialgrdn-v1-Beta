/**
 * GetuserIDAPI.js
 * Description: API to retrieve a user profile based on email
 * Author: Donald Jans Uy
 * Date: 2024-09-15
 */

const express = require('express');
const router = express.Router();

//request to get the user ID using user's email
router.get('/', (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).send('Email is required');
  }

  //execution part
  const query = 'SELECT * FROM UserProfile WHERE email = ?';
  db.query(query, [email], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).send(err);
    }

    // Check if user profile exists
    if (results.length === 0) {
      return res.status(404).send('User not found');
    } else {
      return res.status(200).json(results[0]);
    }
  });
});

module.exports = router;
