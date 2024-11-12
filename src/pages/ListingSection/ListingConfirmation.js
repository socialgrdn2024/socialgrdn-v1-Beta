/**
 * ListingConfirmation.js
 * Description: Page displays a confirmation message for a property listing and fetches the listing status from the API.
 * Front End Author: Lilian Huh
 * Back End Author: Lilian Huh
 * Date: 2024-10-23
 */

// Import statements
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; // Import useParams
import InAppLogo from '../../components/Logo/inAppLogo';
import NavBar from '../../components/Navbar/navbar';
import Sprout from '../../assets/navbarAssets/sprout.png';

// Function to display the ListingConfirmation page
export default function ListingConfirmation() {
	// Use the useNavigate hook to navigate to a different page
	const navigate = useNavigate();
	// Use the useParams hook to get the property ID from the URL
	const { propertyId } = useParams();
	// Use the useState hook to set the message and property name
	const [message, setMessage] = useState(null);
	const [property_name, setPropertyName] = useState(null);

	// Function to navigate to the ViewMyListings page
	const handleViewMyListings = () => {
		navigate('/ViewMyListings');
	};

	// Fetch the property status once the component mounts
	useEffect(() => {
		// Function to fetch the property status from the API
		const fetchStatus = async () => {
			try {
				console.log('Fetching property status for property ID:', propertyId); // Log the request initiation
				const response = await fetch(
					`/api/getPropStatus?property_id=${propertyId}`
				);
				// Log the API response
				const data = await response.json();
				console.log('Response data:', data); // Log the API response data
				// Check if the response is OK
				if (response.ok) {
					// Check the property status and set the message accordingly
					if (data.status === '1') {
						console.log('Property is active');
						setMessage('Thank you for listing your property!');
						setPropertyName(data.property_name);
					} else {
						console.log('Property is not active');
						setMessage('Your property listing is not active.');
					}
				} else {
					console.error('Error response from API:', response.status); // Log the error response code
					setMessage('Error fetching property details.');
				}
			} catch (error) {
				console.error('Fetch error:', error); // Log the error if fetch fails
				setMessage('An error occurred while fetching property details.');
			}
		};

		// Call the fetchStatus function
		fetchStatus();
	}, [propertyId]);

	return (
		<div className="bg-main-background min-h-screen flex flex-col justify-between">
			<InAppLogo />

			<div className="flex flex-col items-center justify-center gap-4 flex-grow pb-20">
				<div className="px-4 w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/3 mb-28">
					<div className="mb-6 text-center">
						<h1 className="text-2xl font-semibold">{message}</h1>
					</div>

					<div className="bg-white rounded-lg shadow-md p-6 text-center">
						<h2 className="text-lg font-medium">
							{property_name} is under your listings page.
						</h2>
					</div>

					<div
						className="flex justify-center mt-8"
						onClick={handleViewMyListings}
					>
						<button
							className="text-green-600 font-bold hover:font-extrabold"
							aria-label="Back to my listings"
						>
							Back to my listings
						</button>
					</div>
				</div>
			</div>
			<NavBar ProfileColor={'#00B761'} SproutPath={Sprout} />
		</div>
	);
}
