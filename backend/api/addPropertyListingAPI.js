/**
 * addPropertyListingAPI.js
 * Description: API to add Property listings
 * Author: Donald Jans Uy
 * Date: 2024-10-20
 */

// Import the express module and create a router to define API routes
const express = require('express');
const router = express.Router();

// Define a POST route to handle property listing submissions
router.post('/', (req, res) => {
  const {
    userId,
    propertyId,
    propertyName,
    addressLine1,
    city,
    province,
    postalCode,
    country,
    growthzone,
    description,
    length,
    width,
    height,
    soilType,
    amenities,
    possibleCrops,
    restrictions,
    price,
    primaryImageUrl,
    otherImageUrls,
    latitude,
    longitude
  } = req.body;

// Start a database transaction to ensure all database operations succeed together
  db.beginTransaction((err) => {
    if (err) {
      console.error('Transaction error:', err);
      return res.status(500).json({ message: 'Transaction failed', error: err.message });
    }

    // Insert into PropertyLocation table
    const locationQuery = `
      INSERT INTO PropertyLocation (address_line1, city, province, postal_code,country, latitude, longitude)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    db.query(locationQuery, [addressLine1, city, province, postalCode,country, latitude, longitude], (err, locationResult) => {
      if (err) {
        return db.rollback(() => {
          console.error('Location insert error:', err);
          res.status(500).json({ message: 'Failed to insert location', error: err.message });
        });
      }

      const locationId = locationResult.insertId;

      // Insert into PropertyListing table
      const listingQuery = `
        INSERT INTO PropertyListing (
          property_id, userID, property_name, location_id, growth_zone, description,
          dimensions_length, dimensions_width, dimensions_height,
          soil_type, amenities, restrictions, rent_base_price
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      db.query(listingQuery, [
        propertyId, userId, propertyName, locationId, growthzone, description,
        length, width, height, soilType, amenities, restrictions, price
      ], (err) => {
        if (err) {
          return db.rollback(() => {
            console.error('Listing insert error:', err);
            res.status(500).json({ message: 'Failed to insert property listing', error: err.message });
          });
        }

        // Insert into PropertyCrops table
        const cropsQuery = `
          INSERT INTO PropertyCrops (property_id, crop_name)
          VALUES ?
        `;
        const cropValues = possibleCrops.map(crop => [propertyId, crop]);
        db.query(cropsQuery, [cropValues], (err) => {
          if (err) {
            return db.rollback(() => {
              console.error('Crops insert error:', err);
              res.status(500).json({ message: 'Failed to insert crops', error: err.message });
            });
          }

          // Insert primary image into PropertyPrimaryImages table
          const primaryImageQuery = `
            INSERT INTO PropertyPrimaryImages (property_id, image_url)
            VALUES (?, ?)
          `;
          db.query(primaryImageQuery, [propertyId, primaryImageUrl], (err) => {
            if (err) {
              return db.rollback(() => {
                console.error('Primary image insert error:', err);
                res.status(500).json({ message: 'Failed to insert primary image', error: err.message });
              });
            }

            // Insert other images into PropertyOtherImages table
            if (otherImageUrls && otherImageUrls.length > 0) {
              const otherImagesQuery = `
                INSERT INTO PropertyOtherImages (property_id, image_url)
                VALUES ?
              `;
              const otherImageValues = otherImageUrls.map(url => [propertyId, url]);
              db.query(otherImagesQuery, [otherImageValues], (err) => {
                if (err) {
                  return db.rollback(() => {
                    console.error('Other images insert error:', err);
                    res.status(500).json({ message: 'Failed to insert other images', error: err.message });
                  });
                }

                // Commit the transaction
                db.commit((err) => {
                  if (err) {
                    return db.rollback(() => {
                      console.error('Commit error:', err);
                      res.status(500).json({ message: 'Failed to commit transaction', error: err.message });
                    });
                  }

                  res.status(201).json({ message: 'Property added successfully', propertyId });
                });
              });
            } else {
              // Commit if no other images
              db.commit((err) => {
                if (err) {
                  return db.rollback(() => {
                    console.error('Commit error:', err);
                    res.status(500).json({ message: 'Failed to commit transaction', error: err.message });
                  });
                }

                res.status(201).json({ message: 'Property added successfully', propertyId });
              });
            }
          });
        });
      });
    });
  });
});

module.exports = router;
