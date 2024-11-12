// SavePropertyImageAPI.js

const express = require('express');
const router = express.Router();

// Route to save property image
router.post('/', (req, res) => {
  const { imageUrl, propertyId } = req.body;

  // Validate request data
  if (!propertyId || !imageUrl) {
    return res.status(400).json({ success: false, message: 'Property ID and Image URL are required' });
  }

  const query = 'INSERT INTO PropertyImages (property_id, image_path) VALUES (?, ?)';
  const values = [propertyId, imageUrl];

  // Execute the SQL query
  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ success: false, message: 'Failed to save image URL', error: err });
    }

    // Successfully saved the image URL
    return res.status(200).json({ success: true, message: 'Image URL saved successfully' });
  });
});

module.exports = router;
