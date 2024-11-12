/**
 * UpdatePropStatusAPI.js
 * Description: API to update the status of a property listing based on its property ID.
 * Author: Lilian Huh
 * Date: 2024-10-23
 */

const express = require('express');
const router = express.Router();

// POST request to update the status of a property listing
router.post('/', (req, res) => {
	const { property_id, status } = req.body;
	// Check if both property_id and status are provided, else return a 400 Bad Request response
	if (!property_id || !status) {
		return res.status(400).json({
			success: false,
			message: 'Property ID and status are required',
		});
	}

	// SQL query to update the status of the property based on its property ID
	const query = 'UPDATE PropertyListing SET status = ? WHERE property_id = ?';
	const values = [status, property_id];

	// Execute the SQL query
	db.query(query, values, (err, result) => {
		// If there is an error during the database operation, log it and return a 500 Internal Server Error response
		if (err) {
			console.error('Database error:', err);
			return res.status(500).json({
				success: false,
				message: 'Failed to update property status',
				error: err,
			});
		}

		// If the update is successful, return a 200 OK response
		return res.status(200).json({
			success: true,
			message: 'Property status updated successfully',
		});
	});
});

module.exports = router;
