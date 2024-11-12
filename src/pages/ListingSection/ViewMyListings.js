/**
 * ViewMyListings.js
 * Description: Page for users to add a property listing
 * FrontEnd: Lilian Huh
 * BackEnd: Donald Uy
 * Date: 2024-10-23
 */

// Import necessary libraries
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import InAppLogo from '../../components/Logo/inAppLogo';
import NavBar from '../../components/Navbar/navbar';
import Sprout from '../../assets/navbarAssets/sprout.png';
import LongButton from '../../components/Buttons/longButton';
import { useUser } from '../../UserContext';
import BackMoreButton from '../../components/Buttons/backMoreButton';

export default function ViewMyListings() {
	// Initialize state variables
	const [listings, setListings] = useState([]);
	const { userId } = useUser(); // Get user ID from UserContext
	const navigate = useNavigate();

	// Format address for display
	const formatAddress = (listing) => {
		const { address_line1, city, province, postal_code } = listing;
		return `${address_line1}, ${city}, ${province}, ${postal_code}`;
	};

	// Navigate to ViewMyProperty page
	const handleViewClick = (propertyId) => {
		navigate(`/ViewMyProperty/${propertyId}`);
	};

	// Fetch user's property listings
	useEffect(() => {
		const fetchListings = async () => {
			try {
				// Fetch user's property listings
				const response = await fetch(`/api/getUserProperties?userID=${userId}`);
				if (!response.ok) {
					throw new Error('Failed to fetch property listings');
				}
				// Set listings state variable
				const data = await response.json();
				setListings(data);
			} catch (error) {
				console.error('Error fetching property listings:', error);
			}
		};
		// Fetch listings if user ID is available
		if (userId) {
			fetchListings();
		}
	}, [userId]);

	return (
		<div className="bg-main-background relative">
			<div className="flex flex-col items-center justify-center gap-2 min-h-screen mx-4 pb-6 bg-main-background ">
				<div className="px-2 fixed top-0 left-0 w-auto sm:w-2/4 md:w-2/3 lg:w-1/2 xl:w-1/3 bg-main-background z-10">
					<InAppLogo />
				</div>
				<div className="fixed top-10 flex w-full justify-between bg-main-background z-10">
					<div className="flex-grow w-full">
						<BackMoreButton />
					</div>
				</div>
				<div className="px-4 w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/3 mb-32 mt-24">
					<LongButton
						buttonName="+ Add New Listing"
						className="w-full rounded shadow-lg bg-green-500 text-black font-semibold mb-6 mt-4"
						pagePath="/AddProperty"
					/>
					<div className="text-center mb-6">
						<h1 className="text-xl font-normal">
							You have {listings.length} listings
						</h1>
					</div>

					<div className="w-full space-y-4 ">
						{listings.length > 0
							? listings.map((listing) => (
									<div
										key={listing.property_id}
										onClick={() => handleViewClick(listing.property_id)}
										className="flex items-center bg-white rounded-lg shadow-md p-4  "
									>
										<div className="w-full aspect-[3/2] mr-4">
											<div className="w-full h-0 pb-[66.67%] relative">
												<img
													src={
														listing.image_url ||
														'https://via.placeholder.com/150'
													}
													alt={listing.property_name}
													className="absolute top-0 left-0 w-full h-full object-cover rounded-lg"
												/>
											</div>
										</div>

										<div className="flex flex-col w-full">
											<div className="flex-grow">
												<h2 className="text-lg font-semibold">
													{listing.property_name}
												</h2>
												<p className="text-sm text-gray-600">
													{formatAddress(listing) || 'No address available'}
												</p>
											</div>
											<div className="flex justify-end mt-4">
												<h2 className="text-green-600 text-sm font-extrabold">
													View
												</h2>
											</div>
										</div>
									</div>
							  ))
							: null}
					</div>
				</div>
			</div>

			<NavBar ProfileColor={'#00B761'} SproutPath={Sprout} />
		</div>
	);
}
