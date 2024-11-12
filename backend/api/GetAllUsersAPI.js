/**
 * GetAllUserAPI.js
 * Description: This is an API that gets all the users in the database
 * Backend Author: Shelyn Del Mundo
 * Date: 2024-10-23
 */

const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  const query = `
    SELECT
        u.userID AS userID, 
        u.username AS username,
        u.status AS status,
        u.email AS email,
        u.phone_number AS phone_number,
        u.profession AS profession,
        CONCAT(u.address_line1, ' ', u.city, ' ', u.province, ' ',u.postal_code ) AS full_address,
        CONCAT(u.first_name, ' ', u.last_name) AS name,
        DATE_FORMAT(u.created_at, '%M %Y') AS createdAt,
        CONCAT(COUNT(DISTINCT p.property_id), ' active properties') AS active_properties,
        CONCAT(u.city, ', ', u.province) AS location,
        CASE 
            WHEN u.role = '1' AND EXISTS (
                SELECT 1 
                FROM propertylisting pl 
                WHERE pl.userID = u.userID
            ) THEN 'Renter & Owner'
            WHEN u.role = '1' THEN 'Renter'
            ELSE 'Unknown'
        END AS renterOrOwner
    FROM 
        userprofile u
    LEFT JOIN 
        propertylisting p ON u.userID = p.userID AND p.status = '1'
    WHERE 
        u.role IN ('1', '2')
    GROUP BY 
        u.userID;
  `;


  db.query(query, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).send(err);
    }

    if (results.length === 0) {
      // Return an empty array if no users are found
      return res.status(200).json([]);
    } else {
      return res.status(200).json(results);
    }
  });
});

module.exports = router;
