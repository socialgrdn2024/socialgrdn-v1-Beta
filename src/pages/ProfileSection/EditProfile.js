/**
 * EditProfile.js
 * Description: Page for users to add a property listing
 * FrontEnd: Lilian Huh
 *BackEnd: Donald Uy
 * Date: 2024-10-23
 */

import React, { useState, useEffect } from "react";
import InAppLogo from "../../components/Logo/inAppLogo";
import NavBar from "../../components/Navbar/navbar";
import Sprout from "../../assets/navbarAssets/sprout.png";
import { FaUserCircle } from "react-icons/fa";
import LongButton from "../../components/Buttons/longButton";
import BackButton from "../../components/Buttons/backButton";
import InputWithClearButton from "../../components/InputComponents/inputWithClearButton";
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../UserContext'; // Import the useUser to get userID
import AddressAutocomplete from '../../components/AutoComplete/AddressAutoComplete';


// SweetAlert2 imports
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export default function EditProfile() {
    const [firstname, setFirstName] = useState('');
    const [lastname, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [userAddress, setUserAddress] = useState('');
    const [city, setCity] = useState('');
    const [province, setProvince] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [profession, setProfession] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState({});

    const { userId } = useUser(); // Get the UserID from UserContext
    const navigate = useNavigate(); // Initialize useNavigate for redirection

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                // Log the userId to check if it's being retrieved correctly
                console.log("UserID being used for API:", userId);

                if (!userId) {
                    console.error("No UserID found");
                    return;
                }

                // Fetch user data from the API using the userID
                const response = await fetch(`http://localhost:3000/api/getProfile?userID=${userId}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const userData = await response.json();

                // Populate form fields with fetched user data
                setFirstName(userData.first_name || '');
                setLastName(userData.last_name || '');
                setUsername(userData.username || '');
                setUserAddress(userData.address_line1 || '');
                setCity(userData.city || '');
                setProvince(userData.province || '');
                setPostalCode(userData.postal_code || '');
                setPhoneNumber(userData.phone_number || '');
                setProfession(userData.profession || '');
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching user profile:', error);
                setIsLoading(false);
            }
        };

        fetchUserProfile();
    }, [userId]);

    // Function to validate the form fields inputs
    const validateForm = () => {
        const errors = {};


        // Check if the first name and last name only contain letters and spaces
        if (!firstname.match(/^[a-zA-Z\s]+$/)) {
            errors.firstname = 'First name is required and should only contain letters.';
        }
        // Check if the last name only contain letters and spaces
        if (!lastname.match(/^[a-zA-Z\s]+$/)) {
            errors.lastname = 'Last name is required should only contain letters.';
        }

        // Check if the phone number is valid.
        if (
            phoneNumber &&
            (!/^[\d+\-()\s]+$/.test(phoneNumber) || 
            phoneNumber.replace(/\D/g, '').length !== 10) 
        ) {
            errors.phoneNumber = 'Invalid phone number.';
        }

        // This checks if the phone number is valid and formats it to (123) 456-7890
        if (phoneNumber) {
            const cleanedPhoneNumber = phoneNumber.replace(/\D/g, '');
        
            // Check if the cleaned phone number has exactly 10 digits
            if (cleanedPhoneNumber.length === 10) {
                formatPhoneNumber(phoneNumber);
            } else {
                errors.phoneNumber = 'Invalid phone number. Must contain exactly 10 digits.';
            }
        }


        // Check if the profession only contains letters, numbers, and spaces
        if (profession && !profession.match(/^[a-zA-Z0-9\s]+$/)) {
            errors.profession = 'Profession should only contain letters, numbers, and spaces.';
        }

        setError(errors);
        return Object.keys(errors).length === 0;
    };

    // Helper function that formats the phone number to (123) 456-7890
    const formatPhoneNumber = (number) => {
        const cleaned = number.replace(/\D/g, '');

        // Format as (123) 456-7890 if it's 10 digits
        if (cleaned.length === 10) {
            return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
        }

        // Return the original number if it can't be formatted
        return number;
    };

    // Handle address selection from the autocomplete component
    const handleAddressSelect = (addressData) => {
        // Extract the address line 1 from the selected address
        setUserAddress(addressData.addressLine1);
        setCity(addressData.city);
        setProvince(addressData.province);
        setPostalCode(addressData.postalCode);
    };

    const handleSaveChanges = async () => {

        // Validate the form fields
        if (!validateForm()) {
            return;
        }

        // Construct the user profile object
        const userProfile = {
            first_name: firstname,
            last_name: lastname,
            username,
            address_line1: userAddress,
            city: city,
            province: province,
            postal_code: postalCode,
            phone_number: formatPhoneNumber(phoneNumber),
            profession
        };

        // Ensure the userId is available before making the request
        if (!userId) {
            console.error("No UserID found");
            return;
        }

        try {
            // Make the PATCH request, passing the userId as a query parameter
            const response = await fetch(`/api/editProfile?userID=${userId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userProfile),
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                console.error(`Failed to update profile. Status: ${response.status}, Message: ${errorMessage}`);
                throw new Error('Failed to update profile');
            }

            console.log('Profile updated successfully');

            // Show success modal and redirect to profile page
            MySwal.fire({
                title: 'Update Successful',
                text: 'Your profile has been updated.',
                icon: 'success',
                confirmButtonText: 'OK',
                confirmButtonColor: '#00B761'
            }).then(() => {
                // Redirect to profile page after confirmation
                navigate('/profile');
            });

        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    // Loading state to show while user data is being fetched
    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className='bg-main-background'>
            <div className="flex flex-col items-center justify-center gap-2 min-h-screen mx-4 pb-20 bg-main-background">
                <div className='p-2 fixed top-0 left-0 w-auto sm:w-2/4 md:w-2/3 lg:w-1/2 xl:w-1/3 bg-main-background'>
                    <InAppLogo />
                </div>
                <div className='fixed top-12 flex w-full items-center justify-between bg-main-background'>
                    <div className="flex-grow w-full">
                        <BackButton />
                    </div>
                </div>
                <FaUserCircle className="text-green-500 text-9xl w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/3 mb-2 mt-20" />
                <div className="px-4 block w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/3">

                    <form className="flex flex-col flex-grow w-full gap-4 mb-8">
                        {/* First Name field */}
                        <InputWithClearButton
                            type="text"
                            id="firstName"
                            value={firstname}
                            onChange={(e) => setFirstName(e.target.value)}
                            placeholder="Enter First Name"
                        />
                        {error.firstname && <p className="text-red-500 text-sm">{error.firstname}</p>}

                        {/* Last Name field */}
                        <InputWithClearButton
                            type="text"
                            id="lastName"
                            value={lastname}
                            onChange={(e) => setLastName(e.target.value)}
                            placeholder="Enter Last Name"
                        />
                        {error.lastname && <p className="text-red-500 text-sm">{error.lastname}</p>}

                        {/* Username field */}
                        <input
                            type="text"
                            value={username}
                            readOnly
                            placeholder="Username"
                            className="p-2 border border-gray-400 rounded-lg shadow-lg bg-gray-100"
                        />

                        {/* Profession field */}
                        <InputWithClearButton
                            type="text"
                            id="profession"
                            value={profession}
                            onChange={(e) => setProfession(e.target.value)}
                            placeholder="Enter Profession"
                        />
                        {error.profession && <p className="text-red-500 text-sm">{error.profession}</p>}

                        {/* Phone Number field */}
                        <InputWithClearButton
                            type="tel"
                            id="phoneNumber"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            placeholder="Enter Phone Number"
                        />
                        {error.phoneNumber && <p className="text-red-500 text-sm">{error.phoneNumber}</p>}

                        {/* Address field */}
                        <AddressAutocomplete onAddressSelect={handleAddressSelect} countryCodes={['ca']} />
                        <input
                            type="text"
                            value={userAddress || ''}
                            readOnly
                            placeholder="Address Line 1"
                            className="p-2 border border-gray-400 rounded-lg shadow-lg bg-gray-100"
                        />
                        <input
                            type="text"
                            value={city || ''}
                            readOnly
                            placeholder="City"
                            className="p-2 border border-gray-400 rounded-lg shadow-lg bg-gray-100"
                        />
                        <input
                            type="text"
                            value={province || ''}
                            readOnly
                            placeholder="Province"
                            className="p-2 border border-gray-400 rounded-lg shadow-lg bg-gray-100"
                        />
                        <input
                            type="text"
                            value={postalCode || ''}
                            readOnly
                            placeholder="Postal Code"
                            className="p-2 border border-gray-400 rounded-lg shadow-lg bg-gray-100"
                        />

                        {/* Save Changes Button */}
                        <LongButton
                            buttonName="Save Changes"
                            className="w-full rounded shadow-lg bg-green-500 text-black font-semibold"
                            onClick={handleSaveChanges}
                        />
                    </form>
                </div>
            </div>
            <NavBar ProfileColor="#00B761" SproutPath={Sprout} />
        </div>
    );
}
