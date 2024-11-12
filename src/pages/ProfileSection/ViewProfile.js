/**
 * AddProperty.js
 * Description: Page for users to add a property listing
 * FrontEnd: Lilian Huh
 * BackEnd: Donald Uy
 * Date: 2024-10-23
 */

import React, { useState, useEffect, useCallback } from 'react';
import { FaUser, FaUserCircle, FaUserTie, FaRegEnvelope } from 'react-icons/fa';
import { IoRibbonOutline } from 'react-icons/io5';
import InAppLogo from '../../components/Logo/inAppLogo';
import NavBar from '../../components/Navbar/navbar';
import Sprout from '../../assets/navbarAssets/sprout.png';
import { FaLocationDot } from 'react-icons/fa6';
import usePropertyResult from '../../components/SearchComponents/propertyResult';
import SearchBar from '../../components/SearchComponents/search';
import { IoArrowBackSharp } from 'react-icons/io5';
import { useNavigate, useParams } from 'react-router-dom';

import logo from '../../assets/logo/SocialGrdnLogo.png';

export default function ViewProfile() {
	const [first_name, setFirstName] = useState("");
	const [last_name, setLastName] = useState("");
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [city, setCity] = useState("");
	const [province, setProvince] = useState("");
	const [profession, setProfession] = useState("");
	const [date_joined, setDateJoined] = useState("");
	const [propertyPerUser, setPropertyPerUser] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	const { id } = useParams();

	const navigate = useNavigate();

	// ------------------- Imported Function to handle search query ------------------- //
	// Hooks that are used to get the search functionality
	const propertyResult = usePropertyResult();
	const [searchQuery, setSearchQuery] = useState("");
	const [suggestions, setSuggestions] = useState([]);

	// Main search query handler with fallback to default results logic
	const handleSearchQueryChange = (event) => {
		const query = event.target.value.toLowerCase();
		setSearchQuery(query);

		if (query.trim() === "") {
		setSuggestions([]);
		navigate("/Search");
		} else {
		// Collect individual words from relevant fields of all properties
		const wordSet = new Set(); // Use Set to avoid duplicates

		propertyResult.forEach((result) => {
			Object.values(result).forEach((value) => {
			if (typeof value === "string") {
				// Split strings into individual words and store them in the Set
				value.split(/\s+/).forEach((word) => {
				if (word.toLowerCase().startsWith(query)) {
					wordSet.add(word);
				}
				});
			}
			});
		});

		// Convert the Set to an array and limit the suggestions to 10 words
		setSuggestions(Array.from(wordSet).slice(0, 10));
		}
	};

	const handleKeyDown = (event) => {
		if (event.key === "Enter" && searchQuery.trim()) {
		navigate(`/Search?query=${encodeURIComponent(searchQuery.trim())}`);
		}
	};

	// Handle suggestion click
	const handleSuggestionClick = (query) => {
		setSearchQuery(query); // Set the clicked suggestion as the search query
		setSuggestions([]); // Clear suggestions
		navigate(`/Search?query=${encodeURIComponent(query)}`);
	};

	// Handle Search Icon Click
	const handleSearchIconClick = () => {
		const query = searchQuery.trim();
		navigate(`/Search?query=${encodeURIComponent(query)}`);
	};


  	// ------------------- End of Imported Function to handle search query ------------------- //


	// ------------------- Fetch User Profile ------------------- //
	useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                // Fetch user profile based on userID
                const response = await fetch(`/api/getProfile?userID=${id}`);
                if (!response.ok) {
					setIsLoading(false);
                    throw new Error('Network response was not ok');
                }
				setIsLoading(false);
                const userData = await response.json();
    
                // Log the data being received from the database
                console.log('Data received from the database:', userData);
    
                setFirstName(userData.first_name);
                setLastName(userData.last_name);
                setUsername(userData.username);
                setCity(userData.city);
                setProvince(userData.province);
				setEmail(userData.email);
                setProfession(userData.profession);
    
                const date = new Date(userData.created_at);
                const options = { year: 'numeric', month: 'long', day: 'numeric' };
                setDateJoined(date.toLocaleDateString('en-US', options));
            } catch (error) {
                console.error('Error fetching user profile:', error);
            }
        };
    
        if (id) {
            fetchUserProfile();
        }
    }, [id]);
	// ------------------- End of Fetch User Profile ------------------- //


	// Group the property listing per user. If the property listing has the same userID as the id in the URL, display the property listing
	const groupPropertyPerUser = useCallback(() => {
		try {
			const propertyList = propertyResult.filter((property) => Number(id) === property.userID);
			setPropertyPerUser(propertyList);
		} catch (error) {
			console.error('Error grouping property per user:', error);
		}

    }, [propertyResult, id]);

	useEffect(() => {
		groupPropertyPerUser();
	}, [groupPropertyPerUser]);



	// ------------------- Property Click ------------------- //

    // Handle property click to view property details
    const handlePropertyClick = (propertyId) => {
        console.log("Property ID:", propertyId);
        // Navigate to the property details page
        navigate(`/ViewProperty/${propertyId}`);
    };

	// ------------------- End of Property Click ------------------- //

	if (isLoading) {
		return (
			<div className='bg-main-background'>
				<div className="flex flex-col items-center justify-center min-h-screen m-2 pb-20">
					<img src={logo} alt="Social Grdn Logo" className="w-auto h-auto m-4 opacity-15" />
				</div>
			</div>
		);
	}


	return (
		<div className="bg-main-background min-h-screen flex flex-col justify-between">
				<div className="px-2 fixed top-0 left-0 w-auto sm:w-2/4 md:w-2/3 lg:w-1/2 xl:w-1/3 bg-main-background">
					<InAppLogo />
				</div>
				{/* Search Bar Section */}
				<div className='pl-3 pr-6 fixed top-12 flex w-full justify-between bg-main-background z-50'>
					<div className='my-2 bg-main-background'>
						<IoArrowBackSharp onClick={() => navigate(-1)} className='text-lg' />
					</div>
					<div className="flex-grow w-auto">
						<SearchBar value={searchQuery} onChange={handleSearchQueryChange} onKeyDown={handleKeyDown} onClickSearchIcon={handleSearchIconClick} />
					</div>
				</div>
				{/* Drop Down Suggestions Section */}
				{suggestions.length > 0 && (
				<div className="fixed top-20 w-full z-50">
					<div className="shadow-lg">
					{suggestions.map((suggestion, index) => (
						<div
						key={index}
						className="w-full hover:bg-gray-100 cursor-pointer rounded-lg"
						onClick={() => handleSuggestionClick(suggestion)}
						>
						<p className="bg-white text-base border-b mx-2 px-2">{suggestion}</p>
						</div>
					))}
					</div>
				</div>
				)}
			<div className="flex flex-col pt-20 items-center justify-center flex-grow">
				<FaUserCircle className="text-green-500 text-8xl mb-4" />
				<div className="w-full px-4 sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/3 mb-24">
					<div className="flex justify-center">
						<div className="flex flex-col items-start justify-start">
							<div className="flex items-center space-x-4 py-2 px-3">
								<FaUser className="text-2xl" />
								<h1 className="text-lg">{first_name} {last_name}</h1>
							</div>
							<div className="flex items-center space-x-4  py-2 px-3">
								<FaUserCircle className="text-2xl" />
								<h1 className="text-lg">{username}</h1>
							</div>
							<div className="flex items-center space-x-4  py-2 px-3">
								<FaRegEnvelope className="text-2xl" />
								<h1 className="text-lg">{email}</h1>
                    		</div>
							<div className="flex items-center space-x-4  py-2 px-3">
								<FaLocationDot className="text-2xl" />
								<h1 className="text-lg">{city}, {province}</h1>
							</div>
							<div className="flex items-center space-x-4  py-2 px-3">
								<FaUserTie className="text-2xl" />
								<h1 className="text-lg">{profession}</h1>
							</div>
							<div className="flex items-center space-x-4 py-2 px-3">
								<IoRibbonOutline className="text-2xl" />
								<h1 className="text-lg">{date_joined}</h1>
							</div>
						</div>
					</div>
					<div className="mt-8">
						<h1 className="text-xl font-bold">{first_name}'s Listings</h1>
					</div>

					<div>
					<div className="flex overflow-x-scroll space-x-4 mt-4">
						{propertyPerUser.map((listing, index) => (
							<div
								key={index}
								className="w-64 flex-shrink-0 bg-white rounded-lg shadow-lg p-4 relative"
								onClick={() => handlePropertyClick(listing.property_id)}
							>
								<div className="flex justify-between items-center">
									<h2 className="text-lg font-semibold">{listing.property_name}</h2>
									<button className="text-sm font-bold text-green-600 py-1 px-2"
										onClick={() => handlePropertyClick(listing.property_id)}>
										View
									</button>
								</div>
								<p className="text-xs text-gray-500 mb-2">{listing.address_line1} {listing.city}, {listing.province}</p>
								<p className="font-bold text-sm text-gray-500 mb-2">{listing.rent_base_price}/month CAD</p>
								<img
									src={listing.propertyImage}
									alt={listing.property_name}
									className="w-full h-32 object-cover rounded-md mb-2"
								/>
								<div className="text-sm text-gray-700 flex justify-between">
									<p>
										<strong>Crop:</strong> {listing.crop}
									</p>
									<p>
										<strong>Size:</strong> {listing.dimensions_length} x {listing.dimensions_width} x {listing.dimensions_height} ft
									</p>
								</div>
							</div>
						))}
					</div>

					</div>
				</div>
			</div>
			<NavBar SearchColor={"#00B761"} SproutPath={Sprout} />
		</div>
	);
}
