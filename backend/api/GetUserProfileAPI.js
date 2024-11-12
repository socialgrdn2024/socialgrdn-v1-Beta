/**
 * GetUserProfileAPI.js
 * Description: API to retrieve a user profile based on userID
 * Author: Donald Jans Uy
 * Date: 2024-09-15
 */


const express = require('express');
const router = express.Router();

// Handle GET request to retrieve user profile based on userI
router.get('/', (req, res) => {
  const { userID } = req.query;

  if (!userID) {
    return res.status(400).send('userID is required');
  }

  // SQL query to retrieve user profile using userID
  const query = 'SELECT * FROM UserProfile WHERE userID = ?';
  db.query(query, [userID], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).send(err);
    }

    if (results.length === 0) {
      return res.status(404).send('User not found');
    } else {
      return res.status(200).json(results[0]);
    }
  });
});

module.exports = router;
