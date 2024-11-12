/**
 * GetUserPropertiesAPI.js
 * Description: API to retrieve active properties associated with a user based on userID
 * Author: Donald Jans Uy
 * Date: 2024-10-02
 */

const express = require('express');
const router = express.Router();

// Handle GET request to retrieve active properties based on userID
router.get('/', (req, res) => {
	const { userID } = req.query;

	if (!userID) {
		return res.status(400).send('userID is required');
	}

	// SQL query to retrieve properties with location and primary image based on userID, filtering for active status (status = 1)
	const query = `
    SELECT p.property_id, p.property_name, 
           l.address_line1, l.city, l.province, l.postal_code,
           ppi.image_url
    FROM PropertyListing p
    JOIN PropertyLocation l ON p.location_id = l.location_id
    LEFT JOIN PropertyPrimaryImages ppi ON p.property_id = ppi.property_id
    WHERE p.userID = ? AND p.status = 1`; // Only retrieve active properties

	// Execute the SQL query to fetch properties for the given userID
	db.query(query, [userID], (err, results) => {
		if (err) {
			console.error('Database error:', err);
			return res
				.status(500)
				.send('An error occurred while fetching properties');
		}

		// Return an empty array if no listings are found
		if (results.length === 0) {
			return res.status(200).json([]);
		}

		return res.status(200).json(results);
	});
});

module.exports = router;
