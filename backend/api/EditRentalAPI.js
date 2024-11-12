/**
 * EdiRental.js
 * Description: API to edit rental information
 * Author: Tiana Bautista
 * Date: 2024-10-18
 */

const express = require('express');
const router = express.Router();

router.patch('/', (req, res) => {
  const { rental_id, property_id, renter_ID, start_date, end_date, status, rent_base_price, tax_amount, transaction_fee } = req.body;

  // Check if rental_id is provided
  if (!rental_id) {
    return res.status(400).send('Rental id is required');
  }

  // SQL query to update the rental information with the given fields
  const query = `
    UPDATE Rental 
    SET property_id = ?, renter_ID = ?, start_date = ?, end_date = ?, status = ?, rent_base_price = ?, tax_amount = ?, transaction_fee = ?
    WHERE rental_id = ?
  `;

  const values = [
    property_id, renter_ID, start_date, end_date, status, rent_base_price, tax_amount, transaction_fee, rental_id
  ];

  // Execute the SQL query
  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).send('Error updating Rental information.');
    }

    // If no rows were affected, the rental_id was not found
    if (result.affectedRows === 0) {
      return res.status(404).send('Rental_id not found.');
    }

    // Successful DB update
    return res.status(200).send('Rental information is updated.');
  });
});

module.exports = router;
