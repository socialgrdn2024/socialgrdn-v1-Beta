/**
 * GetRentalListAPI.js
 * Description: API to get/fetch all rentals based on the user's ID
 * Author: Tiana Bautista
 * Date: 2024-10-15
 */
const express = require('express');
const router = express.Router();

// Get all rentals based on the user's ID
router.get('/', (req, res) => {
  const { userID } = req.query;

  if (!userID) {
    return res.status(400).send('userID is required');
  }

  const query = `
    SELECT
    r.rental_id,
    pl.property_id, pl.property_name, pl.growth_zone,
    CONCAT(up.first_name, ' ', up.last_name) AS property_owner,
    r.start_date, r.end_date,
    loc.address_line1, loc.city, loc.province, 
    p.image_url
FROM
    rental r
JOIN
    propertylisting pl ON r.property_id = pl.property_id
JOIN
    userprofile up ON pl.userID = up.userID
JOIN
    propertylocation loc ON pl.location_id = loc.location_id
LEFT JOIN
    PropertyPrimaryImages p ON pl.property_id = p.property_id
WHERE
    r.renter_ID = ? AND r.status = 1
`;
  // Execute the SQL query
  db.query(query, [userID], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).send('An error occurred while fetching reservations');
    }

    if (results.length === 0) {
      return res.status(200).json([]);
    }

    return res.status(200).json(results);
  });
});

module.exports = router;