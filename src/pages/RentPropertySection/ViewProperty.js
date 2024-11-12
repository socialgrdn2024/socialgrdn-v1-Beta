/**
 * ViewProperty.js
 * Description: Page for viewing other users property
 * FrontEnd: Lilian Huh
 * BackEnd: Donald Uy
 * Date: 2024-10-23
 */

// Import necessary libraries
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import InAppLogo from '../../components/Logo/inAppLogo';
import NavBar from '../../components/Navbar/navbar';
import { FaLocationDot } from 'react-icons/fa6';
import Sprout from '../../assets/navbarAssets/sprout.png';
import MonthRangePicker from '../../components/Calendar/MonthYearPicker';
import LongButton from '../../components/Buttons/longButton';
import { IoArrowBackSharp } from 'react-icons/io5';
import logo from '../../assets/logo/SocialGrdnLogo.png';

// Component to reuse search components
import usePropertyResult from "../../components/SearchComponents/propertyResult";
import SearchBar from "../../components/SearchComponents/search";

const ViewProperty = () => {
	// Initialize states
	const [property, setProperty] = useState(null);
	const [currentImageIndex, setCurrentImageIndex] = useState(0);
	const [isLoading, setIsLoading] = useState(true);
	const [rentDuration, setRentDuration] = useState(null); // New state for rent duration
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

	// Fetch property details
	useEffect(() => {
		const fetchProperty = async () => {
			if (!id) {
				setIsLoading(false);
				return;
			}
			// Fetch property details from the backend
			setIsLoading(true);
			// API URL
			const apiUrl = `/api/getPropertyDetails?property_id=${id}`;
			console.log('Fetching property details from:', apiUrl);
			console.log('Property ID:', id);
			try {
				const response = await fetch(apiUrl);
				if (!response.ok) {
					throw new Error(`Failed to fetch property details`);
				}
				const data = await response.json();
				setProperty(data);
			} catch (error) {
				console.error('Error fetching property details:', error);
			} finally {
				setIsLoading(false);
			}
		};
		fetchProperty();
	}, [id]);

	// Handle Other User Profile Click
	const handleOtherUserProfileClick = (otherUserId) => {
		navigate(`/ViewProfile/${otherUserId}`);
	};

	// Handle date range selection
	const handleDateRangeSelect = ({ startDate, endDate, monthsDiff }) => {
		setRentDuration({
			startDate,
			endDate,
			monthsDiff,
		});
	};
	// Handle rent property
	const handleRentProperty = () => {
		if (rentDuration) {
			const navigationData = {
				propertyId: id,
				from: rentDuration.startDate.formatted,
				to: rentDuration.endDate.formatted,
				months: rentDuration.monthsDiff + 1,
			};

			// Log the full rentDuration object
			console.log('Current rentDuration state:', rentDuration);

			// Log the data being sent to navigation
			console.log('Navigation data being sent:', navigationData);

			// Log individual values for verification
			console.log('Property ID:', id);
			console.log('Start Date:', rentDuration.startDate.formatted);
			console.log('End Date:', rentDuration.endDate.formatted);
			console.log('Months Duration:', rentDuration.monthsDiff + 1);

			// Navigate to RentProperty page with the rent duration data
			navigate('/RentProperty', {
				state: navigationData,
			});
		} else {
			console.log('rentDuration is null - button should be disabled');
		}
	};

	// Image carousel component
	const ImageCarousel = ({ images = [] }) => {
		if (!images.length) {
			return (
				<div className="w-full h-60 bg-gray-100 rounded-lg flex items-center justify-center">
					<span className="text-gray-500">No images available</span>
				</div>
			);
		}

		// Return the image carousel
		return (
			<div className="relative mb-4">
				<img
					src={images[currentImageIndex]}
					alt={`Property view ${currentImageIndex + 1}`}
					className="w-full h-60 object-cover rounded-lg"
					onError={(e) => {
						e.target.src = '/api/placeholder/400/200';
						e.target.alt = 'Image failed to load';
					}}
				/>
				{images.length > 1 && (
					<>
						<button
							onClick={() =>
								setCurrentImageIndex((prev) =>
									prev === 0 ? images.length - 1 : prev - 1
								)
							}
							className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/75 transition"
							aria-label="Previous image"
						>
							←
						</button>
						<button
							onClick={() =>
								setCurrentImageIndex((prev) =>
									prev === images.length - 1 ? 0 : prev + 1
								)
							}
							className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/75 transition"
							aria-label="Next image"
						>
							→
						</button>
						<div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
							{currentImageIndex + 1} / {images.length}
						</div>
					</>
				)}
			</div>
		);
	};

	// Return the view property page
	if (isLoading) {
		return (
			<div className='bg-main-background'>
				<div className="flex flex-col items-center justify-center min-h-screen m-2 pb-20">
					<img src={logo} alt="Social Grdn Logo" className="w-auto h-auto m-4 opacity-15" />
				</div>
			</div>
		);
	}

	// If no property is found, return a message
	if (!property) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-gray-600">No property details found</div>
			</div>
		);
	}

	return (
		<div className="relative bg-main-background">
			<div className="flex flex-col items-center justify-center gap-2 min-h-screen mx-4 pb-6">
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
				<div className="p-6 mt-24 mb-20 rounded-lg shadow-md">
					<div className="space-y-6">
						<div className="flex justify-between items-center">
							<h1 className="text-2xl font-semibold text-gray-900">
								{property.property_name}
							</h1>
						</div>

						<div className="flex items-center text-gray-600">
							<FaLocationDot className="text-xl flex-shrink-0" />
							<p className="ml-2">
								{[
									property.address_line1,
									property.city,
									property.province,
									property.postal_code,
									property.country,
								]
									.filter(Boolean)
									.join(', ')}
							</p>
						</div>

						<ImageCarousel
							images={[
								property.primaryImage,
								...(property.otherImages || []),
							].filter(Boolean)}
						/>

						<div className="grid gap-6">
							<section>
								<h2 className="font-semibold text-gray-900 mb-2">
									About Property
								</h2>
								<p className="text-gray-600">
									{property.description || 'No description available'}
								</p>
							</section>

							<section className="grid grid-cols-2 gap-4">
								<div>
									<h3 className="font-medium text-gray-900">Dimensions</h3>
									<p className="text-gray-600">{property.dimension || 'N/A'}</p>
								</div>
								<div>
									<h3 className="font-medium text-gray-900">Soil Type</h3>
									<p className="text-gray-600">{property.soil_type || 'N/A'}</p>
								</div>
								<div>
									<p className="text-sm font-semibold">Amenities</p>
									<p className="text-sm text-gray-700">
										{property.amenities?.join(', ') || 'None listed'}
									</p>
								</div>
								<div>
									<p className="text-sm font-semibold">Restrictions</p>
									<p className="text-sm text-gray-700">
										{property.restrictions?.join(', ') || 'None listed'}
									</p>
								</div>

								<div>
									<p className="text-sm font-semibold">Growth Zone</p>
									<p className="text-sm text-gray-700">
										{property.growth_zone || 'N/A'}
									</p>
								</div>
								<div>
									<p className="text-sm font-semibold">Recommended Crops</p>
									<p className="text-sm text-gray-700">
										{property.crops?.join(', ') || 'None listed'}
									</p>
								</div>

								<div>
									<h3 className="font-medium text-gray-900">Owner</h3>
									<div className='flex'>
										<button className="text-green-600" 
										onClick={() => handleOtherUserProfileClick(property.userID)}>
										{property.owner?.firstName && property.owner?.lastName
											? `${property.owner.firstName} ${property.owner.lastName}`
											: 'Not specified'}
										</button>
									</div>
								</div>
							</section>

							{!rentDuration && (
								<p className="text-sm text-gray-500 mt-2 text-center">
									Please select months in Calendar to proceed to Rent
								</p>
							)}

							<div className="flex justify-between items-center">
								<div>
									<p className="text-xl font-bold text-green-600">
										CAD {property.rent_base_price}/Mth
									</p>

									<div className="col-span-2">
										{rentDuration ? (
											<div>
												<p className="text-sm text-gray-700 font-medium">
													{rentDuration.startDate.formatted} -{' '}
													{rentDuration.endDate.formatted}
												</p>

												<p className="font-extrabold text-gray-700  text-base">
													Total: CAD{' '}
													{property.rent_base_price *
														(rentDuration.monthsDiff + 1)}
												</p>
												<p className="text-sm text-gray-700  font-extrabold">
													For {rentDuration.monthsDiff + 1} Mths
												</p>
											</div>
										) : (
											<p className="text-sm text-gray-700"></p>
										)}
									</div>
								</div>
									<div>
									<MonthRangePicker
										onSelect={handleDateRangeSelect}
										triggerText="Check Calendar"
									/>

									<div className="mt-4">
										<LongButton
											buttonName="Rent"
											className={`w-full ${
												rentDuration
													? 'bg-green-600 text-white hover:bg-green-700'
													: 'bg-gray-300 text-gray-500 cursor-not-allowed'
											} transition-colors`}
											onClick={rentDuration ? handleRentProperty : undefined}
										/>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<NavBar SearchColor={"#00B761"} SproutPath={Sprout} />
		</div>
	);
};

export default ViewProperty;
