/**
 * ModeratorViewProfile.js
 * Description: Profile page for moderator view
 * Frontend Author: Lilian Huh
 * Backend Author: Lilian Huh
 * Date: 2024-10-23
 */

// Importing necessary libraries
import React, { useState, useEffect } from 'react';
import InAppLogo from '../../components/Logo/inAppLogo';
import NavBarModerator from '../../components/Navbar/navbarmoderator';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../_utils/firebase';
import { useUser } from '../../UserContext'; // Import useUser to get the userID
import { FaUser, FaUserCircle, FaRegEnvelope, FaPhone } from 'react-icons/fa';
import { FaLocationDot } from 'react-icons/fa6';

export default function ModeratorViewProfile() {
	// Initialize state variables
	const [firstname, setFirstName] = useState('');
	const [lastname, setLastName] = useState('');
	const [userAddress, setUserAddress] = useState('');
	const [phoneNumber, setPhoneNumber] = useState('');
	// Get the userID from UserContext
	const { userId } = useUser();
	// Get the email from Firebase Auth
	const email = auth.currentUser.email;
	// Initialize navigate function
	const navigate = useNavigate();

	// Fetch user profile data
	useEffect(() => {
		// Fetch user profile data
		const fetchUserProfile = async () => {
			try {
				// Fetch user profile based on userID
				const response = await fetch(`/api/getProfile?userID=${userId}`);
				if (!response.ok) {
					throw new Error('Network response was not ok');
				}
				// Parse the JSON response
				const userData = await response.json();
				// Set the user profile data
				setFirstName(userData.first_name);
				setLastName(userData.last_name);
				setUserAddress(userData.address_line1);
				setPhoneNumber(userData.phone_number);
			} catch (error) {
				console.error('Error fetching user profile:', error);
			}
		};

		// Only fetch profile if userId exists
		if (userId) {
			fetchUserProfile();
		}
	}, [userId]);

	// Handle log out
	const handleLogOut = async () => {
		try {
			// Sign out from Firebase Auth
			await signOut(auth);
			navigate('/SignIn');
		} catch (error) {
			console.error('Sign out failed:', error);
		}
	};

	return (
		<div className="bg-main-background relative">
			<InAppLogo />
			<div className="flex flex-col items-center justify-center gap-2 min-h-screen pb-20 pt-10">
				<FaUserCircle className="text-green-500 text-9xl mb-4" />

				<div className="flex flex-col items-center justify-center w-full ">
					<div>
						<div className="flex items-center justify-center space-x-4 p-2 mb-2 w-full">
							<h1 className="text-xl font-semibold">Welcome Admin !</h1>
						</div>
						<div className="flex items-center space-x-4 p-3 w-full">
							<FaUser className="text-2xl" />
							<h1 className="text-lg">
								{firstname} {lastname}
							</h1>
						</div>
						<div className="flex items-center space-x-4 p-3 ">
							<FaRegEnvelope className="text-1" />
							<h1 className="text-lg">{email}</h1>
						</div>
						<div className="flex items-center space-x-4 p-3">
							<FaLocationDot className="text-1" />
							{userAddress ? (
								<h1 className="text-lg">{userAddress}</h1>
							) : (
								<h1 className="text-lg text-slate-600">Address</h1>
							)}
						</div>
						<div className="flex items-center space-x-4 p-3">
							<FaPhone className="text-1" />
							{phoneNumber ? (
								<h1 className="text-lg">{phoneNumber}</h1>
							) : (
								<h1 className="text-lg text-slate-600">Phone Number</h1>
							)}
						</div>
					</div>

					{/*Log Out Button*/}
					<div className="flex flex-col items-center justify-center w-full mt-40">
						<div>
							<div className="flex justify-center ">
								<button
									className="text-red-500 text-lg font-extrabold"
									onClick={handleLogOut}
								>
									Log Out
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
			{/* NavBar for moderator*/}
			<NavBarModerator ProfileColor={'#00B761'} />
		</div>
	);
}
