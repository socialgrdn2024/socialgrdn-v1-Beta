/**
 * GetPayoutAPI.js
 * Description: This is the API for fetching the payouts of a user
 * Backend Author: Shelyn Del Mundo
 * Date: 2024-10-23
 */

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
      SUM(p.rent_base_price) AS total_earnings
    FROM
      payment p
    JOIN
      rental r ON p.rental_id = r.rental_id
    JOIN
      propertylisting pl ON r.property_id = pl.property_id
    WHERE
      pl.userID = ?
      AND p.payout_date IS NOT NULL
    GROUP BY
      year, month
    ORDER BY
      year ASC, MIN(p.payout_date) ASC;
  `;

	db.query(query, [userID], (err, results) => {
		if (err) {
			console.error('Database error:', err);
			return res
				.status(500)
				.json({ error: 'An error occurred while fetching payouts' });
		}

		if (results.length === 0) {
			// Return an empty array if no payouts are found
			return res.status(200).json([]);
		}

		const formattedResults = results.map((row, index) => ({
			id: index + 1,
			year: row.year,
			month: row.month,
			amount: `$${Number(row.total_earnings || 0).toFixed(2)}`, // Ensure total_earnings is a number
		}));

		return res.status(200).json(formattedResults);
	});

});

module.exports = router;
