/**
 * GetSearchResultsAPI.js
 * Description: This is the API for fetching the property for the search results
 * Backend Author: Shelyn Del Mundo
 * Date: 2024-10-23
 */

const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  const query = `
  SELECT 
      pl.property_id,
      pl.userID,
      pl.property_name, 
      plo.address_line1, 
      plo.city, 
      plo.province,
      plo.postal_code,
      plo.longitude,
      plo.latitude, 
      up.first_name, 
      up.last_name,
      up.username, 
      pl.growth_zone,
      MIN(pc.crop_name) AS crop,  
      pl.dimensions_length, 
      pl.dimensions_width, 
      pl.dimensions_height,
      pl.dimensions_length * pl.dimensions_width AS area,
      pl.soil_type,
      pl.rent_base_price,
      MIN(ppi.image_url) AS propertyImage
  FROM 
      UserProfile up
  JOIN 
      PropertyListing pl ON up.userID = pl.userID
  JOIN 
      PropertyLocation plo ON pl.location_id = plo.location_id
  JOIN 
      PropertyCrops pc ON pl.property_id = pc.property_id
  LEFT JOIN 
      propertyprimaryimages ppi ON pl.property_id = ppi.property_id
  WHERE 
      pl.status = '1'
  GROUP BY 
      pl.property_id, 
      pl.userID,
      pl.property_name, 
      plo.address_line1, 
      plo.city, 
      plo.province,
      plo.postal_code,
      plo.longitude,
      plo.latitude, 
      up.first_name, 
      up.last_name,
      up.username, 
      pl.growth_zone,
      pl.dimensions_length, 
      pl.dimensions_width, 
      pl.dimensions_height,
      pl.soil_type,
      pl.rent_base_price;
    `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).send(err);
    }

    if (results.length === 0) {
      return res.status(200).json([]);
    } else {
      return res.status(200).json(results);
    }
  });
});

module.exports = router;