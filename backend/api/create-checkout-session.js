/**
 * create-checkout-session.js
 * Description: API to create a Stripe Checkout session
 * Author: Tiana Bautista
 * Date: 2024-10-16
 */
const express = require('express');
const router = express.Router();
const stripe = require('stripe')('sk_test_51Q2bKFLm0aJYZy9zsMBApv62ayj6Bc3s1WlbJqTgOgKDPDfYZIEISvZDhwK4cFgAAM05ykkfEi94tAh3OSqcQT7a00ZvG9qjIq');

// TEST DETAILS:
// Payment succeeds
// 4242 4242 4242 4242

// Payment requires authentication
// 4000 0025 0000 3155

// Define the route using the router
router.post('/', async (req, res) => {
    // Get the amount and rental_id from the request body
    const { amount, rental_id } = req.body;
    const amountInCents = amount * 100;
    const details = `Reservation ID: ${rental_id}`;

    console.log("Creating Stripe session for:", rental_id, "Amount:", amountInCents);

    try {
        // Create a new Stripe Checkout session
        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price_data: {
                        currency: 'cad',
                        product_data: { name: details },
                        unit_amount: amountInCents, // amount in cents
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `http://localhost:3001/RentConfirmation?rental_id=${rental_id}`,
            cancel_url: `http://localhost:3001/RentFailed?rental_id=${rental_id}`,
        });
        // Log the session URL to the console for testing purposes
        console.log("Stripe session created, redirecting to:", session.url);

        // Redirect to the URL of the Stripe Checkout session
        res.status(200).json({ url: session.url });
        //res.redirect(303, session.url);

    } catch (error) {
        // Log the error for debugging purposes
        console.error('Stripe Checkout Session Error:', error);
        res.status(500).send({ error: error.message });
    }
});

// Export the router
module.exports = router;