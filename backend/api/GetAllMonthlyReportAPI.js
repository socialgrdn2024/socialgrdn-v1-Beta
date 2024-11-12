/**
 * GetMonthlyReportAPI.js
 * Description: API to fetch monthly report data including number of bookings, total booking amount, and total revenue
 * Author: Doniyor
 * Date: 2024-10-30
 */

const express = require('express');
const router = express.Router();

// Route for fetching monthly report data
router.get('/', (req, res) => {
	const { year, month } = req.query;

	// Check if year and month are provided
	if (!year || !month) {
		return res.status(400).send('Year and month are required');
	}

	const query = `
    SELECT 
      COUNT(r.rental_id) AS number_of_bookings,
      SUM(r.rent_base_price) AS total_booking_amount,
      SUM(r.rent_base_price) * 0.03 AS total_revenue
    FROM rental r
    JOIN payment p ON r.rental_id = p.rental_id
    WHERE p.status = 'P'
      AND YEAR(p.payout_date) = ?
      AND MONTH(p.payout_date) = ?
  `;

	// Execute the query
	db.query(query, [year, month], (err, results) => {
		if (err) {
			console.error('Database error:', err);
			return res.status(500).send(err);
		}

		if (results.length === 0) {
			return res.status(404).send('No bookings found for the specified month');
		}

		const reportData = results[0];
		reportData.total_revenue = parseFloat(reportData.total_revenue).toFixed(2); // Format revenue to 2 decimal places

		return res.status(200).json(reportData);
	});
});

module.exports = router;
