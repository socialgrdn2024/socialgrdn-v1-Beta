/**
 * ModeratorEarningsAPI.js
 * Description: API for moderators to fetch user earnings summary and details by month
 * Author: [Doniyor Rakhmanov]
 * Date: [2024-10-30]
 */

const express = require('express');
const router = express.Router();

// Route for fetching user earnings summary by month
router.get('/summary', (req, res) => {
    const { userID } = req.query;

    // Check if userID is provided
    if (!userID) {
        return res.status(400).send('userID is required');
    }

    const query = `
        SELECT 
            YEAR(p.payout_date) AS year, 
            MONTH(p.payout_date) AS month, 
            SUM(r.rent_base_price) AS total_rent
        FROM rental r
        JOIN payment p ON r.rental_id = p.rental_id
        WHERE p.status = 'P'
        AND r.rental_id IN (
            SELECT rental_id
            FROM rental
            WHERE property_id IN (
                SELECT property_id
                FROM propertylisting
                WHERE userId = ?
            )
        )
        GROUP BY YEAR(p.payout_date), MONTH(p.payout_date)
        ORDER BY year, month;
    `;

    db.query(query, [userID], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send(err);
        }
        return res.status(200).json(results);
    });
});

// Route for fetching detailed earnings by day for a specific month
router.get('/details', (req, res) => {
    const { userID, year, month } = req.query;

    if (!userID || !year || !month) {
        return res.status(400).send('userID, year, and month are required');
    }

    const query = `
        SELECT 
            DAY(p.payout_date) AS day,
            SUM(r.rent_base_price) AS daily_total_rent
        FROM rental r
        JOIN payment p ON r.rental_id = p.rental_id
        WHERE p.status = 'P'
        AND r.rental_id IN (
            SELECT rental_id
            FROM rental
            WHERE property_id IN (
                SELECT property_id
                FROM propertylisting
                WHERE userId = ?
            )
        )
        AND YEAR(p.payout_date) = ?
        AND MONTH(p.payout_date) = ?
        GROUP BY DAY(p.payout_date)
        ORDER BY day;
    `;

    db.query(query, [userID, year, month], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send(err);
        }
        return res.status(200).json(results);
    });
});

module.exports = router;
