/**
 * ReservationList.js
 * Description: Page for displaying a list of rentals for the user
 * Frontend Author: Tiana Bautista
 * Backend Author: Tiana Bautista, Shelyn del Mundo
 * Date: 2024-10-23
 */

// Importing necessary libraries
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import InAppLogo from "../../components/Logo/inAppLogo";
import NavBar from "../../components/Navbar/navbar";
import GreenSprout from "../../assets/navbarAssets/sproutGreen.png";
import SearchBar from "../../components/SearchComponents/search";
import { useUser } from "../../UserContext";
import Rental from "../../components/rentalComponent/rental";
// Component to reuse search components
import usePropertyResult from "../../components/SearchComponents/propertyResult";

// This is the Listing page of the application where users can view other users' listings
export default function RentalList() {
    const navigate = useNavigate();
    const { userId } = useUser();

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
        setSearchQuery(query); // Set the clicked username as the search query
        setSuggestions([]); // Clear suggestions
        navigate(`/Search?query=${encodeURIComponent(query)}`);
    };

    // Handle search icon click
    const handleSearchIconClick = () => {
        const query = searchQuery.trim();
        navigate(`/Search?query=${encodeURIComponent(query)}`);
    };


    // ------------------- End of Imported Function to handle search query ------------------- //

    //This function passes the rental id to the RentalDetails page
    const handleViewRental = (id) => {
        navigate(`/RentalDetails/${id}`)
    };
    // State to hold all rentals
    const [rentals, setRentals] = useState([]);


    useEffect(() => {
        // Fetching rentals from API
        const fetchRentals = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/getRentalList?userID=${userId}`);
                if (!response.ok) {
                    console.log("Network response was not ok");
                    return;
                }
                //stores the response in rentalData in json format
                const rentalData = await response.json();

                // Check if rentalData is an empty array
                if (rentalData.length === 0) {
                    console.log("No reservations found for the user.");
                    setRentals([]); // Set rentals to empty array
                    return;
                }

                //stores rentals in the rental list
                setRentals(rentalData);
            } catch (error) {
                console.error('Error fetching reservations:', error);
            }
        };
        fetchRentals();
    }, [userId]);



    return (
        <div className='bg-main-background relative'>
            <div className="flex flex-col items-center justify-center gap-2 min-h-screen mx-2 pb-20 bg-main-background">
                <div className='p-2 fixed top-0  w-full bg-main-background'>
                    <InAppLogo />
                </div>
                {/* Search Bar Section */}
                <div className='fixed top-12 flex w-full justify-between bg-main-background'>
                    <SearchBar value={searchQuery} onChange={handleSearchQueryChange} onKeyDown={handleKeyDown} onClickSearchIcon={handleSearchIconClick} />
                </div>
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
                {/* Updates the page title based on the number of reservations */}
                <div className="pb-2 mt-24">
                    {rentals.length === 0 ? (
                        <h2 className="text-xl">No upcoming reservations</h2>
                    ) : (
                        <h2 className="text-xl">Upcoming Reservations</h2>
                    )}

                </div>
                {/* Displays the rentals */}
                <div >
                    <ul>
                        {rentals.map((rental) => (
                            <li key={rental.rental_id} onClick={() => handleViewRental(rental.rental_id)}>
                                <Rental
                                    name={rental.property_name}
                                    landowner={rental.property_owner}
                                    start={rental.start_date}
                                    end={rental.end_date}
                                    address={rental.address_line1 + ', ' + rental.city + ', ' + rental.province}
                                    growthZone={rental.growth_zone}
                                    image={rental.image_url}
                                />
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <NavBar SproutPath={GreenSprout} />
        </div>
    );
}