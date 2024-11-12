/**
 * getPropertyDetailsAPI.js
 * Description: API to retrieve details of a property listing
 * Author: Donald Jans Uy
 * Date: 2024-10-26
 */

const express = require('express');
const router = express.Router();

// Handle GET request to retrieve property details based on property_id
router.get('/', (req, res) => {
  const { property_id } = req.query;

    // Check for Property_id
  if (!property_id) {
    return res.status(400).send('property_id is required');
  }

  //sql query for getting the property details
  const query = `
  SELECT 
      p.property_id, p.property_name, p.description, p.growth_zone, p.userID,
      CONCAT(p.dimensions_length, ' L x ', p.dimensions_width, ' W x ', p.dimensions_height, ' H') AS dimension, 
      p.soil_type, p.amenities, p.restrictions, p.rent_base_price,
      l.address_line1, l.city, l.province, l.postal_code, l.country,
      l.latitude, l.longitude,
      GROUP_CONCAT(DISTINCT c.crop_name) AS crops,
      ppi.image_url AS primary_image_url,
      GROUP_CONCAT(DISTINCT poi.image_url) AS other_image_urls,
      u.first_name, u.last_name
  FROM 
      PropertyListing p
  JOIN 
      PropertyLocation l ON p.location_id = l.location_id
  LEFT JOIN 
      PropertyCrops c ON p.property_id = c.property_id
  LEFT JOIN
      PropertyPrimaryImages ppi ON p.property_id = ppi.property_id
  LEFT JOIN
      PropertyOtherImages poi ON p.property_id = poi.property_id
  LEFT JOIN
      UserProfile u ON p.userid = u.userid
  WHERE 
      p.property_id = ?
  GROUP BY 
      p.property_id
  `;


  //query execution

  db.query(query, [property_id], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).send('An error occurred while fetching property details');
    }

    if (results.length === 0) {
      return res.status(404).send('Property not found');
    }

    const property = results[0];

    // Process amenities and restrictions as arrays
    property.amenities = property.amenities ? property.amenities.split(',').map(item => item.trim()) : [];
    property.restrictions = property.restrictions ? property.restrictions.split(',').map(item => item.trim()) : [];

    // Process crops as an array, handling possible null values
    property.crops = property.crops ? property.crops.split(',').map(item => item.trim()) : [];

    // Process primary image
    property.primaryImage = property.primary_image_url || null;
    delete property.primary_image_url;

    // Process other images
    property.otherImages = property.other_image_urls ? property.other_image_urls.split(',') : [];
    delete property.other_image_urls;

    // Convert latitude and longitude to numbers
    property.latitude = property.latitude !== null ? parseFloat(property.latitude) : null;
    property.longitude = property.longitude !== null ? parseFloat(property.longitude) : null;

    // Create a user object with the name information
    property.owner = {
      firstName: property.first_name || null,
      lastName: property.last_name || null
    };
    
    // Remove the raw first_name and last_name fields
    delete property.first_name;
    delete property.last_name;

    // Return the property data as JSON
    return res.status(200).json(property);
  });
});

module.exports = router;