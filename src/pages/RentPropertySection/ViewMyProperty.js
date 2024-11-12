/**
 * ViewMyProperty.js
 * Description: Page for viewing my property
 * FrontEnd: Lilian Huh
 *BackEnd: Donald Uy
 * Date: 2024-10-23
 */

// Necessary imports
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import InAppLogo from '../../components/Logo/inAppLogo';
import NavBar from '../../components/Navbar/navbar';
import Sprout from '../../assets/navbarAssets/sprout.png';
import { FaLocationDot } from 'react-icons/fa6';
import { IoArrowBackSharp } from "react-icons/io5";

// Component to reuse search components
import usePropertyResult from "../../components/SearchComponents/propertyResult";
import SearchBar from "../../components/SearchComponents/search";

export default function ViewMyProperty() {
	// State variables
	const [property, setProperty] = useState(null);
	const [currentImageIndex, setCurrentImageIndex] = useState(0);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
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

	useEffect(() => {
		const fetchProperty = async () => {
			setIsLoading(true);
			setError(null);
			try {
				const response = await fetch(
					`/api/getPropertyDetails?property_id=${id}`
				);
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				const data = await response.json();
				setProperty(data);
			} catch (error) {
				console.error('Error fetching property details:', error);
				setError('Failed to load property details. Please try again later.');
			} finally {
				setIsLoading(false);
			}
		};

		if (id) {
			fetchProperty();
		}
	}, [id]);

	const getAllImages = () => {
		if (!property) return [];
		return [property.primaryImage, ...(property.otherImages || [])].filter(
			Boolean
		);
	};

	const handlePrevImage = () => {
		const allImages = getAllImages();
		setCurrentImageIndex((prevIndex) =>
			prevIndex === 0 ? allImages.length - 1 : prevIndex - 1
		);
	};

	const handleNextImage = () => {
		const allImages = getAllImages();
		setCurrentImageIndex((prevIndex) =>
			prevIndex === allImages.length - 1 ? 0 : prevIndex + 1
		);
	};

	const handleEditClick = () => {
		navigate(`/EditProperty/${id}`);
	};

	const ImageCarousel = ({ images }) => {
		if (images.length === 0) {
			return (
				<div className="w-full h-60 bg-gray-200 rounded-md flex items-center justify-center">
					<span className="text-gray-500">No images available</span>
				</div>
			);
		}

		return (
			<div className="relative mb-4">
				<img
					src={images[currentImageIndex]}
					alt={`Property ${currentImageIndex + 1}`}
					className="w-full h-60 object-cover rounded-md"
					onError={(e) => {
						e.target.src = 'https://via.placeholder.com/400x200';
						e.target.alt = 'Image failed to load';
					}}
				/>
				{images.length > 1 && (
					<>
						<button
							onClick={handlePrevImage}
							className="absolute left-2 top-1/2 -translate-y-1/2 px-3 py-1 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition-all"
							aria-label="Previous image"
						>
							←
						</button>
						<button
							onClick={handleNextImage}
							className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition-all"
							aria-label="Next image"
						>
							→
						</button>
						<div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-sm">
							{currentImageIndex + 1} / {images.length}
						</div>
					</>
				)}
			</div>
		);
	};

	const PropertyDetails = ({ property }) => (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<h2 className="text-xl font-semibold">{property.property_name}</h2>
				<div className="flex gap-2">
					<button
						onClick={handleEditClick}
						className="text-green-600 hover:text-green-700 font-bold py-2 px-4 rounded transition-colors"
					>
						Edit
					</button>
				</div>
			</div>

			<div className="flex items-center">
				<FaLocationDot className="text-xl text-gray-500 flex-shrink-0" />
				<p className="text-sm text-gray-700 ml-2">
					{`${property.address_line1}, ${property.city}, ${property.province}, ${property.postal_code}`}
				</p>
			</div>

			<ImageCarousel images={getAllImages()} />

			<div className="space-y-4">
				<section>
					<h3 className="font-semibold text-gray-900 mb-2">About Property</h3>
					<p className="text-sm text-gray-700">
						{property.description || 'No description available'}
					</p>
				</section>

				<section className="space-y-2">
					<div className="grid grid-cols-2 gap-4">
						<div>
							<p className="text-sm font-semibold">Dimensions</p>
							<p className="text-sm text-gray-700">
								{property.dimension || 'N/A'}
							</p>
						</div>
						<div>
							<p className="text-sm font-semibold">Soil Type</p>
							<p className="text-sm text-gray-700">
								{property.soil_type || 'N/A'}
							</p>
						</div>
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
						<p className="text-sm font-semibold">Crops</p>
						<p className="text-sm text-gray-700">
							{property.crops?.join(', ') || 'None listed'}
						</p>
					</div>
				</section>

				<p className="text-2xl font-bold text-green-600">
					CAD ${property.rent_base_price}/month
				</p>
			</div>
		</div>
	);

	if (isLoading) {
		return (
			<div className="min-h-screen bg-main-background flex items-center justify-center">
				<div className="animate-pulse text-gray-600">
					Loading property details...
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen bg-main-background flex items-center justify-center">
				<div className="text-red-600 text-center p-4">
					<p>{error}</p>
					<button
						onClick={() => window.location.reload()}
						className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
					>
						Retry
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="bg-main-background min-h-screen relative">
			<InAppLogo />
			<div className="flex flex-col items-center justify-center min-h-screen pb-20">
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

			<div className="px-4 w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/3 mt-10">
				<div className="bg-white rounded-lg shadow-md p-6 mt-6">
					{property && <PropertyDetails property={property} />}
				</div>
			</div>
			</div>
			<NavBar ProfileColor={'#00B761'} SproutPath={Sprout} />
		</div>
	);
}
