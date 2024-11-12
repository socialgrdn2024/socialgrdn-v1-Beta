/**
 * GetRentalDetailsAPI.js
 * Description: API to get rental details
 * Author: Tiana Bautista
 * Date: 2024-10-18
 */
const express = require('express');
const router = express.Router();

// GET request to fetch rental details
router.get('/', (req, res) => {
  const { rentalID } = req.query;

  if (!rentalID) {
    return res.status(400).send('rentalID is required');
  }
  // SQL query to fetch rental details
  const query = `
    SELECT
    r.rental_id, r.start_date, r.end_date, r.status, r.rent_base_price, r.tax_amount, r.transaction_fee, r.renter_ID,
    pl.property_id, pl.property_name, pl.growth_zone, pl.dimensions_length, pl.dimensions_width, pl.dimensions_height, pl.description,
    pl.soil_type, pl.amenities, pl.restrictions,
    CONCAT(up.first_name, ' ', up.last_name) AS property_owner,
    loc.address_line1, loc.city, loc.province, 
    p.image_url,
    pc.crop_name
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
LEFT JOIN
    PropertyCrops pc ON pl.property_id = pc.property_id
WHERE
    r.rental_ID = ?
`;
  // Execute the SQL query
  db.query(query, [rentalID], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).send('An error occurred while fetching reservation');
    }

    if (results.length === 0) {
      return res.status(404).send('Reservation not found');
    }

    return res.status(200).json(results[0]);
  });
});

module.exports = router;