/**
 * AddressAutocomplete.js
 * Description: A React component for address autocompletion using the Geoapify API.
 * Author: Donald Jans Uy
 * Date: 2024-10-20
 */

import React, { useState, useEffect, useRef } from 'react';

const AddressAutocomplete = ({ 
    onAddressSelect, 
    resultLimit = 20,  
    countryCodes = ['us', 'ca']  // Default to US and Canada only
}) => {

    // declaring the states
    const [searchText, setSearchText] = useState(''); 
    const [suggestions, setSuggestions] = useState([]); 
    const [isLoading, setIsLoading] = useState(false); 
    const [showSuggestions, setShowSuggestions] = useState(false); 
    const suggestionRef = useRef(null); 

    //using Geoapify apy 
    const geoapifyAPIKEY = process.env.REACT_APP_GEOAPIFY_API_KEY;

    useEffect(() => {
        // Handle click outside of the suggestions box
        const handleClickOutside = (event) => {
            if (suggestionRef.current && !suggestionRef.current.contains(event.target)) {
                setShowSuggestions(false); // Hide suggestions if clicked outside
            }
        };

        // Add event listener for mouse clicks
        document.addEventListener('mousedown', handleClickOutside); 

        // Cleanup on unmount
        return () => document.removeEventListener('mousedown', handleClickOutside); 
    }, []);

    const searchAddress = async (text) => {
        // Return if text length is less than 3 characters
        if (text.length < 3) {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }

        // Set loading state to true
        setIsLoading(true); 
        try {
            // Create the filter string from countryCodes array
            const filterString = countryCodes.map(code => `countrycode:${code}`).join(',');
            
            const response = await fetch(
                `https://api.geoapify.com/v1/geocode/autocomplete?` + 
                `text=${encodeURIComponent(text)}` +
                `&limit=${resultLimit}` +
                `&filter=${filterString}` +
                `&format=json` +
                `&apiKey=${geoapifyAPIKEY}`
            );
            const data = await response.json(); 
            
            if (data.results) {

                // Set the suggestions state
                setSuggestions(data.results); 

                // Show the suggestions dropdown
                setShowSuggestions(true); 
            }
        } catch (error) {
            console.error('Error fetching address suggestions:', error); 
        }
        setIsLoading(false); // Reset loading state
    };

    const handleInputChange = (e) => {
        const value = e.target.value; // Get input value
        setSearchText(value); // Update search text state
        searchAddress(value); // Trigger address search
    };

    const handleSuggestionClick = (suggestion) => {
        // Prepare address data from the selected suggestion
        const addressData = {
            addressLine1: suggestion.street || '',
            city: suggestion.city || '',
            province: suggestion.state || '',
            postalCode: suggestion.postcode || '',
            country: suggestion.country || '',
            latitude: suggestion.lat || '',
            longitude: suggestion.lon || '',
            formatted: suggestion.formatted || ''
        };

        // Set search text to the formatted address
        setSearchText(addressData.formatted); 

        // Hide suggestions
        setShowSuggestions(false); 

        // Pass selected address data to the parent component
        onAddressSelect(addressData); 
    };

    return (
        <div className="relative" ref={suggestionRef}>
            <input
                type="text"
                value={searchText}
                onChange={handleInputChange}
                placeholder="Full Address"
                className="w-full p-2 border border-gray-400 rounded-lg shadow-lg focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
            
            {isLoading && (
                <div className="absolute right-3 top-3">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-500"></div>
                </div>
            )}

            {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {suggestions.map((suggestion, index) => (
                        <div
                            key={index}
                            className="p-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleSuggestionClick(suggestion)}
                        >
                            <p className="text-sm">{suggestion.formatted}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AddressAutocomplete;
