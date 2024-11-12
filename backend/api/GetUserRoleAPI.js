/**
 * GetUserRoleAPI.js
 * Description: This is the API for fetching the role of the user
 * Backend Author: Shelyn Del Mundo
 * Date: 2024-10-23
 */

const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    const { email } = req.query;
    
    if (!email) {
        return res.status(400).send('Email is required');
    }
    
    const query = `
        SELECT role FROM Userprofile WHERE email = ?`;

    db.query(query, [email], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('An error occurred while fetching user role');
        }

        if (results.length === 0) {
            return res.status(404).send('No user found with the given email');
        }

        const role = Number(results[0].role);

        return res.status(200).json({ role });
    });
});

module.exports = router;


