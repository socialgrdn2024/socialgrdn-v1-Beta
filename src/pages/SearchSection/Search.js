/**
 * Search.js
 * Description: Page for displaying the list of property and search results
 * Frontend Author: Shelyn Del Mundo
 * Backend Author: Shelyn Del Mundo
 * Date: 2024-10-23
 */

import React, { useEffect, useState, useCallback } from "react";
import NavBar from "../../components/Navbar/navbar";
import InAppLogo from "../../components/Logo/inAppLogo";
import Sprout from "../../assets/navbarAssets/sprout.png";
import SearchResult from "../../components/SearchComponents/searchResult";
import SearchFilter from "../../components/SearchComponents/popupSearchFilter";
import FilterButton from "../../components/SearchComponents/filterButton";
import SearchBar from "../../components/SearchComponents/search";
import {ref, onValue} from "firebase/database";
import {realtimeDb} from "../../_utils/firebase";
import {useUser} from "../../UserContext";

// Import the following components to reuse search components
import usePropertyResult from "../../components/SearchComponents/propertyResult";
import { useLocation, useNavigate } from "react-router-dom";

export default function Search() {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [userLocation, setUserLocation] = useState();
    const [filteredResults, setFilteredResults] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [locationFetched, setLocationFetched] = useState(false);
    const [cropData, setCropData] = useState([]);
    const { userId } = useUser();

    // Filter variables
    const [popupFilters, setPopupFilters] = useState({});    
    // const [filterRemoved, setFilterRemoved] = useState(false);

    // Get property results from the database
    const propertyResult = usePropertyResult();
    const location = useLocation();
    const navigate = useNavigate();

    // ------------------- Location-based Filtering ------------------- //

    // Helper function to convert degrees to radians
    const deg2rad = (deg) => {
        return deg * (Math.PI / 180);
    };

    // Haversine formula to calculate the distance between two points (latitude and longitude)
    const haversineDistance = useCallback((userLocation, propertyResult) => {
        const R = 6371; // Radius of the Earth in km
        const dLat = deg2rad(propertyResult.latitude - userLocation.latitude);
        const dLon = deg2rad(propertyResult.longitude - userLocation.longitude);

        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(userLocation.latitude)) *
            Math.cos(deg2rad(propertyResult.latitude)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c; // Distance in km

        return distance;
    }, []); 

    // Get the nearest properties to the user's location
    const getNearestResults = useCallback((userLocation, propertyResult) => {
        // If the propertyResult is not an array, return an empty array this will prevent the app from crashing
        if (!Array.isArray(propertyResult)) return [];
        return propertyResult
            .map((result) => ({
                ...result,
                distance: haversineDistance(userLocation, result),
            }))
            .filter((result) => result.distance <= 20)
            .sort((a, b) => a.distance - b.distance)
            .slice(0, 10);
    }, [haversineDistance]);

    
    // Get the current location of the user
    const getUserLocation = useCallback(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const location = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    };
                    setUserLocation(location);
                    setLocationFetched(true);
                },
                (error) => console.error("Error getting location", error)
            );
        } else {
            console.error("Geolocation is not supported by this browser.");
        }
    }, []);

    // Fetch user's location on page load
    useEffect(() => {
        if (!locationFetched) {
            getUserLocation();
        }
    }, [getUserLocation, locationFetched]);

    // ------------------- End of Location-based Filtering ------------------- //



    // ------------------- Filter Button and Popup ------------------- //

    // Handle filter button click
    const filterClicked = () => {
        openPopup();
        console.log("Search Filter Clicked");
    };

    // Open the popup
    const openPopup = () => {
        setIsPopupOpen(true);
    };

    // Close the popup
    const closePopup = () => {
        setIsPopupOpen(false);
    };

    // Get crop types from the database
    const handleCropTypes = (e) => {
        const dataRef = ref(realtimeDb, 'crops');
        const unsubscribe = onValue(dataRef, (snapshot) => {
            try {
                const fetchedData = snapshot.val();
                setCropData(fetchedData);
            } catch (err) {
                console.error('Error processing data:', err);
            }
        }, (error) => {
            console.error('Error fetching data:', error);
        });
        return () => unsubscribe();
    }

    // Fetch crop types on page load
    useEffect(() => {
        handleCropTypes();
        // eslint-disable-next-line
    }, []);


    // Handle the filters made by the modal/popup filter
    const handlePopupSearchFilter = (filters) => {
        const { priceRange, cropType, gardenSize, soilType } = filters;
        console.log("Filters:");
        console.log(filters.priceRange);
        console.log(filters.cropType);
        console.log(filters.gardenSize);
        console.log(filters.soilType);

        setPopupFilters(filters);

        console.log("Popup Filters:", popupFilters);


        // Define the custom matchesCropType function to check if the crop belongs to the selected category
        const matchesCropType = (result) => {
            // If no crop type is selected or "All" is selected, return all results.
            if (!cropType || cropType === "All") return true;
        
            // Utility function to normalize crop names (remove plural "s" if present)
            const normalizeCropName = (crop) => {
                if (!crop) return "";
                return crop.toLowerCase().endsWith('s') ? crop.toLowerCase().slice(0, -1) : crop.toLowerCase();
            };
        
            // Normalizing the result.crop and comparing to normalized category crop names
            const normalizedCrop = normalizeCropName(result.crop);
        
            // Ensure the cropType matches a category and check if the normalized result.crop exists in the selected category
            switch (cropType) {
                case "Fruit":
                    return cropData.fruits && cropData.fruits.map(c => normalizeCropName(c)).includes(normalizedCrop);
                case "Vegetable":
                    return cropData.vegetables && cropData.vegetables.map(c => normalizeCropName(c)).includes(normalizedCrop);
                case "Cereal":
                    return cropData.cereals && cropData.cereals.map(c => normalizeCropName(c)).includes(normalizedCrop);
                case "Spices":
                    return cropData.spices && cropData.spices.map(c => normalizeCropName(c)).includes(normalizedCrop);
                default:
                    return true;
            }
        };

        const filtered = propertyResult.filter((result) => {
            // Price Range Filter
            const isWithinPriceRange = priceRange ? result.rent_base_price >= priceRange.min && result.rent_base_price <= priceRange.max : true;
    
            // Garden Size Filter
            const isWithinGardenSize = gardenSize ? result.area >= gardenSize.min && result.area <= gardenSize.max : true;
    
            // Soil Type Filter
            const matchesSoilType = soilType ? result.soil_type === soilType : true;
    
        return isWithinPriceRange && matchesCropType(result) && isWithinGardenSize && matchesSoilType;
    });

        setFilteredResults(filtered);
        console.log("Modal Results:", filtered);


    };

    const handleFilterDelete = (filterType) => {
        const updatedFilters = { ...popupFilters };
        delete updatedFilters[filterType];
        setPopupFilters(updatedFilters);
    
        // Reapply the filtering logic with the updated filters
        handlePopupSearchFilter(updatedFilters);
    };

    // ------------------- End of Filter Button and Popup ------------------- //



    // ------------------- Display Property Results Based on Randomly and Based on user Location ------------------- //

    // Filter results based on user's location or display random properties if location is not available
    const displayDefaultResults = useCallback(() => {
        if (userLocation && propertyResult.length > 0) {
            const nearestResults = getNearestResults(userLocation, propertyResult);
            setFilteredResults(nearestResults);
        } else if (propertyResult.length > 0) {
            const randomResults = propertyResult
                .sort(() => Math.random() - 0.5)
                .slice(0, 10);
            setFilteredResults(randomResults);
        }
    }, [userLocation, propertyResult, getNearestResults]);


    // Fetch default results on page load
    useEffect(() => {
        displayDefaultResults();
        // eslint-disable-next-line
    }, [propertyResult, userLocation]);

    // ------------------- End of Display Property Results Based on Randomly and Based on user Location ------------------- //


    // ------------------- Search Bar and Search Suggestions ------------------- //


    // Get query from URL and initialize search query state
    useEffect(() => {
        const sanitizeQuery = (query) => {
            // Remove any character that is not a letter or number
            return query.replace(/[^a-zA-Z0-9\s]/g, '').trim();
        };
        
        const query = new URLSearchParams(location.search).get("query") || "";
        
        if (query) {
            const sanitizedQuery = sanitizeQuery(query);
        
            if (sanitizedQuery) {
                setSearchQuery(sanitizedQuery); // Update state with sanitized query
                performSearch(sanitizedQuery);  // Perform search with sanitized input
            } else {
                displayDefaultResults(); // Show default results if query is empty after sanitization
            }
        } else {
            displayDefaultResults(); // Show default results if no query
        }
        // eslint-disable-next-line
    }, [location.search, displayDefaultResults]);
    
    // Main search query handler with fallback to default results logic
    const handleSearchQueryChange = (event) => {
        const query = event.target.value.toLowerCase();
        
        setSearchQuery(query);

        if (query.trim() === "") {
            displayDefaultResults(); // Show default results
            setSuggestions([]);
            navigate("/Search");
        } else {
            const wordSet = new Set();

            propertyResult.forEach((result) => {
                Object.values(result).forEach((value) => {
                    if (typeof value === "string") {
                        value.split(/\s+/).forEach((word) => {
                            if (word.toLowerCase().startsWith(query)) {
                                wordSet.add(word);
                            }
                        });
                    }
                });
            });

            setSuggestions(Array.from(wordSet).slice(0, 10));
        }
    };    
    
    // Trigger search or fallback results on Enter key press
    const handleKeyDown = (event) => {
        if (event.key === "Enter" && searchQuery.trim()) {
            setSuggestions([]);
            navigate(`/Search?query=${encodeURIComponent(searchQuery.trim())}`);
        }
    };   

    // Handle click on a suggestion and navigate
    const handleSuggestionClick = (suggestion) => {
        setSearchQuery(suggestion);
        setSuggestions([]);
        navigate(`/Search?query=${encodeURIComponent(suggestion)}`);
    };
    
    // Perform the search logic when Enter is pressed or suggestion is clicked
    function performSearch(query) {
        const filtered = propertyResult.filter((result) =>
            Object.values(result).some((value) =>
                String(value).toLowerCase().includes(query.toLowerCase())
            )
        );
    
        setFilteredResults(filtered.slice(0, 10));
        console.log("Search Results:", filtered);
        navigate(`/Search?query=${encodeURIComponent(query)}`);
    }
    
    const handleSearchIconClick = () => {
        performSearch(searchQuery);
        setSuggestions([]);
    };
    

    // ------------------- End of Search Bar and Search Suggestions ------------------- //





    // ------------------- Property Click ------------------- //

    // Handle property click to view property details
    const handlePropertyClick = (propertyId, userID,) => {
        console.log("Property ID:", propertyId);
        // Navigate to the property details page
        // If the current user login id is the same as the property owner id, navigate to the View own property page
        if (String(userId) === String(userID)) {
            navigate(`/ViewMyProperty/${propertyId}`);
        } else {
            navigate(`/ViewProperty/${propertyId}`);
        }
        
    };


    return (
        <div className='bg-main-background'>
            <div className="flex flex-col items-center justify-center gap-2 min-h-screen mx-4 pb-20 bg-main-background">
                {/* Logo Section */}                
                <div className='p-2 fixed top-0 left-0 w-auto sm:w-2/4 md:w-2/3 lg:w-1/2 xl:w-1/3 bg-main-background'>
                    <InAppLogo />
                </div>
                {/* Search Bar Section */}
                <div className='mx-2 px-2 fixed top-12 flex w-full justify-between bg-main-background z-10'>
                    <div className="flex-grow w-full">
                        <SearchBar value={searchQuery} onChange={handleSearchQueryChange} onKeyDown={handleKeyDown} onClickSearchIcon={handleSearchIconClick}/>
                    </div>
                    <div className="mx-2">
                        <FilterButton onclick={filterClicked}/>
                    </div>
                </div>
                {suggestions.length > 0 && (
                    <div className="fixed top-20 w-full z-50">
                        <div className=" shadow-lg">
                            {suggestions.map((suggestion, index) => (
                                <div
                                    key={index}
                                    className="w-full px-2 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => handleSuggestionClick(suggestion)}
                                >
                                    <p className="bg-white text-base border-b mx-2 px-2">{suggestion}</p>
                                </div>
                            ))}
                        </div>

                    </div>
                )}

                <div className="w-auto">
                    <SearchFilter isOpen={isPopupOpen} onClose={closePopup} onApplyFilters={handlePopupSearchFilter} className="flex items-start"/>
                </div>
                <div className="mt-16 w-full flex">
                    <div className="flex gap-1 fixed w-full bg-main-background pt-4 pb-2 text-xs">
                        {/* Display the filter value under search bar with close */}
                        {popupFilters.priceRange && (
                            <div className="flex gap-1 px-2 rounded-2xl bg-green-200 border-0 border-green-900 ">
                                <div className="flex items-center gap-1">
                                    <p>{popupFilters.priceRange.min} - {popupFilters.priceRange.max} CAD</p>
                                    {/* On click the x will remove the filter */}
                                    <button onClick={() => handleFilterDelete('priceRange')}>X</button>
                                </div>
                            </div>
                        )}
                        {popupFilters.cropType && (
                            <div className="flex gap-1 px-2 rounded-2xl bg-green-200 border-0 border-green-900 ">
                                <div className="flex items-center gap-1">
                                    <p>{popupFilters.cropType}</p>
                                    <button onClick={() => handleFilterDelete('cropType')}>X</button>
                                </div>
                            </div>
                        )}
                        {popupFilters.gardenSize && (
                            <div className="flex gap-1 px-2 rounded-2xl bg-green-200 border-0 border-green-900 ">
                                <div className="flex items-center gap-1">
                                    <p>{popupFilters.gardenSize.min} - {popupFilters.gardenSize.max} sqft</p>
                                    <button onClick={() => handleFilterDelete('gardenSize')}>X</button>
                                </div>
                            </div>
                        )}
                        {popupFilters.soilType && (
                            <div className="flex gap-1 px-2 rounded-2xl bg-green-200 border-0 border-green-900 ">
                                <div className="flex items-center gap-1">
                                    <p>{popupFilters.soilType}</p>
                                    <button onClick={() => handleFilterDelete('soilType')}>X</button>
                                </div>
                            </div>
                        )}                
                    </div>
                </div>

                {/* Search Results Section */}
                <div className="flex flex-col w-full justify-start items-center gap-8">
                    <div className="flex w-full justify-start pt-3 items-start">
                        {searchQuery ? <p className="text-start"></p> : <p className="text-start">Recommendations</p>}
                    </div>

                    {filteredResults.length > 0 ? (
                        filteredResults.map((result, index) => (
                            <SearchResult
                                key={index}
                                propertyName={result.property_name}
                                addressLine1={result.address_line1}
                                city={result.city}
                                province={result.province}
                                rentBasePrice={result.rent_base_price}
                                first_name={result.first_name}
                                last_name={result.last_name}
                                growthZone={result.growth_zone}
                                propertyImage={result.propertyImage}
                                propertyCrop={result.crop}
                                dimensionLength={result.dimensions_length}
                                dimensionWidth={result.dimensions_width}
                                dimensionHeight={result.dimensions_height}
                                soilType={result.soil_type}

                                onClick={() => handlePropertyClick(result.property_id, result.userID)}
                            />
                        ))
                    ) : (
                        <p>No property found.</p>
                    )}
                </div>
                {/* Navigation Bar */}
                <NavBar SearchColor={"#00B761"} SproutPath={Sprout}/>
            </div>
        </div>
    );
}

