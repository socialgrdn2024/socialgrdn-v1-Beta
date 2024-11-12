const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  const { userID } = req.query;

  if (!userID) {
    return res.status(400).send('userID is required');
  }

  const query = `
    SELECT 
      YEAR(p.payout_date) AS year,
      MONTHNAME(p.payout_date) AS month,
      DAY(p.payout_date) AS day,
      p.rent_base_price AS amount
    FROM 
      payment p
    JOIN 
      rental r ON p.rental_id = r.rental_id
    JOIN 
      propertylisting pl ON r.property_id = pl.property_id
    WHERE 
      pl.userID = ?
      AND p.payout_date IS NOT NULL
    ORDER BY 
      year ASC, MONTH(p.payout_date) ASC, day ASC;
  `;

  db.query(query, [userID], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'An error occurred while fetching payouts' });
    }

    if (results.length === 0) {
      // Return an empty array if no payouts are found
      return res.status(200).json([]);
    }

    // Group payouts by month and year
    const payoutsByMonth = results.reduce((acc, row) => {
      const key = `${row.year}-${row.month}`;

      if (!acc[key]) {
        acc[key] = {
          year: row.year,
          month: row.month,
          total: 0,
          details: [],
        };
      }

      // Add individual day details
      acc[key].details.push({
        day: row.day,
        amount: parseFloat(row.amount).toFixed(2), // Ensure amount is numeric and formatted
      });

      // Accumulate the total correctly as a number
      acc[key].total += parseFloat(row.amount);

      return acc;
    }, {});

    // Format the result into an array
    const formattedResults = Object.values(payoutsByMonth).map((monthData) => ({
      year: monthData.year,
      month: monthData.month,
      total: monthData.total.toFixed(2), // Format the total as a string with 2 decimal places
      details: monthData.details,
    }));

    return res.status(200).json(formattedResults);
  });
});

module.exports = router;
