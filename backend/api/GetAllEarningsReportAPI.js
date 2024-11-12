const express = require('express');
const router = express.Router();

// Route for fetching all users' earnings by month and year
router.get('/', (req, res) => {
  const query = `
    SELECT 
      YEAR(p.payout_date) AS YEAR, 
      MONTH(p.payout_date) AS MONTH, 
      SUM(r.rent_base_price) AS total_rent
    FROM rental r
    JOIN payment p ON r.rental_id = p.rental_id
    JOIN propertylisting pl ON r.property_id = pl.property_id
    GROUP BY YEAR(p.payout_date), MONTH(p.payout_date)
    ORDER BY YEAR, MONTH;
  `;

  // Execute the query
  db.query(query, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).send(err);
    }

    if (results.length === 0) {
      return res.status(404).send('No earnings found');
    }

    return res.status(200).json(results);
  });
});

module.exports = router;
