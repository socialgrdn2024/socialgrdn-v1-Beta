/**
 * EditProfileAPI.js
 * Description: API to Edit User Profile
 * Author: Donald Jans Uy
 * Date: 2024-10-20
 */

const express = require('express');
const router = express.Router();

// Update user profile based on userID
router.patch('/', (req, res) => {
  const { userID } = req.query;
  const { first_name, last_name, username, address_line1, city, province, postal_code, phone_number, profession } = req.body;

  // Check if userID is provided
  if (!userID) {
    return res.status(400).send('UserID is required');
  }

  // SQL query to update the user profile with the given fields
  const query = `
    UPDATE UserProfile 
    SET first_name = ?, last_name = ?, username = ?, address_line1 = ?, city = ?, province = ?, postal_code = ?,  phone_number = ?, profession = ?
    WHERE userID = ?
  `;

  const values = [first_name, last_name, username, address_line1, city, province, postal_code, phone_number, profession, userID];

  // Execute the SQL query
  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).send('Error updating profile');
    }

    // If no rows were affected, the user was not found
    if (result.affectedRows === 0) {
      return res.status(404).send('User not found');
    }

    // Successfully updated the profile
    return res.status(200).send('Profile updated successfully');
  });
});

module.exports = router;
