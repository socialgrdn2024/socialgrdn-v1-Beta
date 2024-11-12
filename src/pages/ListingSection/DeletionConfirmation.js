/**
 * DeletionConfirmation.js
 * Description: Page to confirm the deletion of a listing and navigate back to the user's listings page.
 * Author: Lilian Huh
 * Date: 2024-10-23
 */

import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for programmatic navigation
import NavBar from '../../components/Navbar/navbar';
import Sprout from '../../assets/navbarAssets/sprout.png';
import InAppLogo from '../../components/Logo/inAppLogo';

export default function DeletionConfirmation() {
	const navigate = useNavigate();

	const handleBackToMyListings = () => {
		navigate('/ViewMyListings');
	};

	return (
		<div className="bg-main-background">
			{/* Main Content */}
			<div className="flex flex-col items-center justify-center min-h-screen mx-4 pb-20 bg-main-background">
				{/* Logo */}
				<div className="p-2 fixed top-0 left-0 w-auto sm:w-2/4 md:w-2/3 lg:w-1/2 xl:w-1/3 bg-main-background">
					<InAppLogo />
				</div>

				{/* Deletion Confirmation Section */}
				<div className="flex flex-col items-center justify-center w-full mt-24">
					<p className="font-bold text-2xl">Your Listing has been deleted.</p>
					<button
						onClick={handleBackToMyListings}
						className="w-1/2 mt-4 p-2 text-green-600 font-bold "
					>
						Back to my Listings
					</button>
				</div>
			</div>
			<NavBar ProfileColor="#00B761" SproutPath={Sprout} />
		</div>
	);
}
