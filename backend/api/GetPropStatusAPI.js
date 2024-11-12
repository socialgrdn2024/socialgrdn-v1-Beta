/**
 * GetPropStatusAPI.js
 * Description: API to retrieve the status and property name of a property listing based on its property ID.
 * Author: Lilian Huh
 * Date: 2024-10-23
 */

const express = require('express');
const router = express.Router();

// GET request to fetch the status and name of a property listing based on its property ID
router.get('/', (req, res) => {
	const { property_id } = req.query;

	// Check if property_id is provided, else return a 400 Bad Request response
	if (!property_id) {
		return res.status(400).send('property_id is required');
	}

	// SQL query to select the status and property name from the PropertyListing table
	const query = `
        SELECT status, property_name FROM PropertyListing WHERE property_id = ?`;

	db.query(query, [property_id], (err, results) => {
		// If there is an error during the database operation, log it and return a 500 Internal Server Error response
		if (err) {
			console.error('Database error:', err);
			return res
				.status(500)
				.send('An error occurred while fetching property status');
		}

		// If no property is found with the given ID, return a 404 Not Found response
		if (results.length === 0) {
			return res.status(404).send('No property found with the given ID');
		}

		// If the property is found, return a 200 OK response with the status and property name
		return res.status(200).json(results[0]);
	});
});

module.exports = router; // Export the router for use in the main app file
