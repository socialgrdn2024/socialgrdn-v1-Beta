/**
 * HandleUserStatusAPI.js
 * Description: This is the API for handling user status (block/unblock) using PATCH request.
 * Backend Author: Shelyn Del Mundo
 * Date: 2024-10-23
 */

const express = require('express');
const router = express.Router();

// Update user status (block/unblock) based on userID
router.patch('/', (req, res) => {
    const { userID } = req.query; // Get userID from query parameters
    const { status } = req.body;  // Get new status from request body
  
    // Validate input
    if (!userID) {
      return res.status(400).send('UserID is required');
    }
    if (status === undefined) {
      return res.status(400).send('Status is required');
    }
  
    // SQL query to update the user status
    const query = `UPDATE UserProfile SET status = ? WHERE userID = ?`;
  
    // Execute the SQL query with callback
    db.query(query, [status, userID], (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).send('Error updating user status');
      }
  
      // If no rows were affected, the user was not found
      if (result.affectedRows === 0) {
        return res.status(404).send('User not found');
      }
  
      // Successfully updated the user status
      res.status(200).send(`User status updated to ${status === '1' ? 'active' : 'blocked'}.`);
    });
  });
  
  module.exports = router;