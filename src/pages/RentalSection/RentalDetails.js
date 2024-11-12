/**
 * ReservationDetails.js
 * Description: Page for displaying the details of a rental
 * Frontend Author: Tiana Bautista
 * Backend Author: Tiana Bautista
 * Date: 2024-10-23
 */

// Importing necessary libraries
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from 'react-router-dom';

import InAppLogo from "../../components/Logo/inAppLogo";
import NavBar from "../../components/Navbar/navbar";
import GreenSprout from "../../assets/navbarAssets/sproutGreen.png";
import { FaLocationDot } from "react-icons/fa6";
import zoneColor from "../../components/ZoneColor/zoneColor";
import { differenceInMonths, differenceInDays, parseISO } from 'date-fns';
import { IoArrowBackSharp } from "react-icons/io5";

// Component to reuse search components
import usePropertyResult from "../../components/SearchComponents/propertyResult";
import SearchBar from "../../components/SearchComponents/search";


export default function RentalDetails() {
    //internal state variables
    const [showCancelModal, setShowCancelModal] = useState(false);
    const navigate = useNavigate();
    const rentalID = useParams().id;            //parameter
    const [rental, setRental] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [durationMonths, setDurationMonths] = useState(null);   // need to finalize issues with duration rules and pricing
    const [durationDays, setDurationDays] = useState(null);       //need to finalize issues with duration rules and pricing

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
        const fetchRentals = async () => {
            try {
                //fetching rental details from the API
                const response = await fetch(`http://localhost:3000/api/GetRentalDetails?rentalID=${rentalID}`);
                if (!response.ok) {
                    console.log("Network response was not ok");
                    return;
                }
                //Assigning response to reservationData to store the data in json format
                const rentalData = await response.json();

                //Convert timestamps to 'Month Day, Year' format
                const formattedStartDate = new Date(rentalData.start_date).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                });
                const formattedEndDate = new Date(rentalData.end_date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                });
                setStartDate(formattedStartDate);
                setEndDate(formattedEndDate);

                //stores rentals in the rental list
                setRental(rentalData);
            } catch (error) {
                console.error('Error fetching reservations:', error);
            }
        };
        fetchRentals();
    }, [rentalID]);

    // Function to calculate the duration of the rental
    const computeDuration = () => {
        if (rental.start_date && rental.end_date) {
            // Parse ISO strings to Date objects
            const start = parseISO(rental.start_date);
            const end = parseISO(rental.end_date);

            // Calculate the number of complete months between the dates
            const months = differenceInMonths(end, start);

            // Calculate the number of days remaining after accounting for complete months
            const days = differenceInDays(end, new Date(start.getFullYear(), start.getMonth() + months, start.getDate()));

            setDurationMonths(months);
            setDurationDays(days);
        }
    };
    // Function to handle the cancel button click
    const handleCancelClick = () => {
        setShowCancelModal(true);
    };

    // Function to close the cancel modal
    const handleCloseCancelModal = () => {
        setShowCancelModal(false);
    };
    // Function to handle the confirmation of the cancellation
    const handleConfirmCancellation = async () => {
        await handleRentalCancellation();
        navigate('/RentalCancelled');
    };



    useEffect(() => {
        computeDuration();
        //eslint-disable-next-line
    }, [rental]);

    // Register rental details to the database
    const handleRentalCancellation = async () => {
        // If rental is not set, return
        if (!rental) {
            return;
        }
        //preparing updated rental object for patch request
        const updatedRental = rental;
        //setting status to 0 to indicate that the rental is cancelled
        updatedRental.status = 0;
        //formatting the dates to be stored in the database
        updatedRental.start_date = new Date(rental.start_date).toLocaleDateString('en-CA');
        updatedRental.end_date = new Date(rental.end_date).toLocaleDateString('en-CA');

        const patchRental = async () => {
            try {
                //Patch Request to update rental details
                const response = await fetch(`http://localhost:3000/api/editRentalDetails`,
                    {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(updatedRental),
                    }
                );
                if (!response.ok) {
                    throw new Error('Failed to update rental data.');
                }
            } catch (error) {
                console.error('Error updating rental details:', error);
            }
        };
        patchRental();
    };

    return (
        <div className='bg-main-background relative'>

            <div className="flex flex-col items-center justify-center gap-2 min-h-screen pb-20 pt-10 ">
                {/* Logo Section */}
                <div className='p-2 fixed top-0 left-0 w-auto sm:w-2/4 md:w-2/3 lg:w-1/2 xl:w-1/3 bg-main-background'>
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

                {/* Reservation Details */}
                <section className="mb-3 mt-12 rounded-lg border-2 py-1 border-gray-200 bg-main-background">
                    <img src={rental.image_url} alt="Listing" className="w-full h-auto max-w-full max-h-full" />
                    <div className="p-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <FaLocationDot className="text-1" />
                                <h2 className="text-xl font-bold ml-2">{rental.property_name}</h2>
                            </div>
                            {/* Farming Zone */}
                            <div className="flex items-center flex-row gap-1">
                                <div className="w-4 h-4 border border-gray-400" style={{ backgroundColor: zoneColor(rental.growth_zone) }}></div>
                                <p>Zone {rental.growth_zone}</p>
                            </div>
                        </div>
                        <div>
                            <p className="px-6">{rental.address_line1 + ', ' + rental.city + ', ' + rental.province}</p>
                        </div>
                    </div>

                    <div className="p-3 text-sm">
                        <h2 className="font-bold">Reservation details</h2>
                        <div className="flex text-sm">
                            <p>{rental.description}</p>
                        </div>
                        <div className="p-3 flex">
                            <div className="w-1/3">
                                <p>Date</p>
                                <p>Duration</p>
                            </div>
                            <div className="w-2/3">

                                <p>{startDate} - {endDate}</p>
                                <p className="text-sm">{durationMonths} Months {durationDays} Days</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-3 text-sm">
                        <h2 className="font-bold">Payment details</h2>
                        <div className="flex text-sm">
                            <table className=" w-full"><tbody>
                                <tr>
                                    <td className="w-2/3"><p>{rental.property_name} x {durationMonths} month/s</p></td>
                                    <td className="w-1/3"><p>CAD {rental.rent_base_price}</p></td>
                                </tr>
                                <tr>
                                    <td className="w-2/3"><p>SocialGrdn fee (3%)</p></td>
                                    <td className="w-1/3"><p>CAD {rental.transaction_fee}</p></td>
                                </tr>
                                <tr>
                                    <td className="w-1/3"><p>Taxes</p></td>
                                    <td className="w-1/3"><p>CAD {rental.tax_amount}</p></td>
                                </tr>
                            </tbody></table>
                        </div>
                        <div className="p-3 flex border-b-2 border-slate-600">
                        </div>
                        <div className="p-3 flex text-sm font-bold">
                            <table className=" w-full"><tbody>
                                <tr>
                                    <td className="w-2/3"><p>Total</p></td>
                                    <td className="w-1/3"><p>CAD {(parseFloat(rental.rent_base_price) +
                                        parseFloat(rental.transaction_fee) +
                                        parseFloat(rental.tax_amount)).toLocaleString(undefined, {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        })}
                                    </p></td>
                                </tr>
                            </tbody></table>
                        </div>
                    </div>

                    <div className="p-3 text-sm">
                        <h2 className="font-bold">Property Details</h2>
                        <div className="flex text-sm">
                            <table className=" w-full"><tbody>
                                <tr>
                                    <td className="w-2/3"><p>Dimensions</p></td>
                                    <td className="w-1/3"><p>
                                        {rental.dimensions_height} x {rental.dimensions_length} x {rental.dimensions_width}
                                    </p></td>
                                </tr>
                                <tr>
                                    <td className="w-2/3"><p>Soil type</p></td>
                                    <td className="w-1/3"><p>{rental.soil_type}</p></td>
                                </tr>
                                <tr>
                                    <td className="w-1/3"><p>Amenities</p></td>
                                    <td className="w-1/3"><p>{rental.amenities}</p></td>
                                </tr>
                                <tr>
                                    <td className="w-1/3"><p>Restrictions</p></td>
                                    <td className="w-1/3"><p>{rental.restrictions}</p></td>
                                </tr>
                                <tr>
                                    <td className="w-1/3"><p>Possible Crops</p></td>
                                    <td className="w-1/3"><p>{rental.crop_name}</p></td>
                                </tr>
                            </tbody></table>
                        </div>

                    </div>
                    <div className="p-3 text-sm">
                        <h2 className="font-bold">Cancellation Policy</h2>
                        <p className="p-3">No refund / Cancel without charge within 20 days</p>
                    </div>
                    <div className="self-center p-5">
                        <p className="text-red-600 text-base font-bold text-center cursor-pointer" onClick={handleCancelClick}>Cancel Reservation</p>
                    </div>
                </section>

                {/* Cancel Confirmation Modal */}
                {
                    showCancelModal && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                            <div className="bg-white p-5 rounded-md shadow-lg">
                                <h2 className="text-xl font-bold mb-4">Confirm Cancellation</h2>
                                <p>Are you sure you want to cancel the reservation?</p>
                                <p>Cancellation cannot be reversed.</p>
                                <div className="mt-4 flex justify-center">
                                    <button className="bg-gray-300 px-4 py-2 mr-2 rounded" onClick={handleCloseCancelModal}>Not Now</button>
                                    <button className="bg-red-600 text-white px-4 py-2 rounded" onClick={handleConfirmCancellation}>Yes, Cancel</button>
                                </div>
                            </div>
                        </div>
                    )
                }


            </div >
            <NavBar SproutPath={GreenSprout} />
        </div >
    );
}