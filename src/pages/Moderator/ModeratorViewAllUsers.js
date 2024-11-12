/**
 * ModeratorViewALLUsers.js
 * Description: This page displays all users in the system and allows the moderator to view or block a user
 * Frontend Author: Lilian Huh
 * Backend Author: Shelyn Del Mundo
 * Date: 2024-10-24
 */

import React, { useEffect, useState, useCallback } from "react";
import InAppLogo from "../../components/Logo/inAppLogo";
import SearchBar from "../../components/SearchComponents/search";
import NavBarModerator from "../../components/Navbar/navbarmoderator";
import { useNavigate, useLocation } from "react-router-dom";

export default function ModeratorViewAllUsers() {
    const [users, setUsers] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null); // State for selected user

    const navigate = useNavigate();
    const location = useLocation();

    // This code snippet retrieves the search query from the URL
    const query = new URLSearchParams(location.search).get("query") || "";

    // Update the search query state when the query changes
    useEffect(() => {
        const sanitizeQuery = (query) => {
            // Remove any character that is not a letter or number
            return query.replace(/[^a-zA-Z0-9\s]/g, '').trim();
        };

        if (query) {
            const sanitizedQuery = sanitizeQuery(query);
        
            if (sanitizedQuery) {
                setSearchQuery(sanitizedQuery); // Update state with sanitized query
            }
        }

    }, [query]);


    // Fetch all users from the database
    const fetchAllUsers = useCallback(async () => {
        try {
            const response = await fetch('/api/getAllUsers');
            const data = await response.json();
            setUsers(data);
            setFilteredUsers(data);
            if (query) filterUsers(data, query);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    }, [query]);


    // Filter users based on the search query
    const filterUsers = (allUsers, query) => {
        const filtered = allUsers.filter((user) =>
            user.username.toLowerCase().includes(query.toLowerCase()) ||
            user.email.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredUsers(filtered);
    };

    // Handle the search query change
    const handleSearchQueryChange = (event) => {
        const query = event.target.value;
        setSearchQuery(query);

        if (query.trim() === '') {
            setFilteredUsers(users);
            setSuggestions([]);
            navigate('/ModeratorViewAllUsers');
        } else {
            filterUsers(users, query);
            const newSuggestions = users
                .filter((user) =>
                    user.username.toLowerCase().startsWith(query.toLowerCase()) ||
                    user.email.toLowerCase().startsWith(query.toLowerCase())
                )
                .map((user) => ({ username: user.username, email: user.email }));
            setSuggestions(newSuggestions);
            navigate(`/ModeratorViewAllUsers?query=${encodeURIComponent(query)}`);
        }
    };

    // Handle the user status change (block/unblock)
    const handleUserStatus = async (userID, status) => {
        const newStatus = status === '1' ? '0' : '1';
        try {
            const response = await fetch(`/api/handleUserStatus?userID=${userID}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });
            if (!response.ok) {
                const errorMessage = await response.text();
                console.error(`Error updating user status: ${errorMessage}`);
                return;
            }
            console.log('User status updated successfully');
            fetchAllUsers();
        } catch (error) {
            console.error('Error updating user status:', error);
        }
    };
    
    // Handle the Enter key press
    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && suggestions.length > 0) {
            handleSuggestionClick(suggestions[0].username);
        };
    };

    // Handle the user suggestion click. It passes the username to the search bar and navigates to the search page
    const handleSuggestionClick = (username) => {
        setSearchQuery(username);
        filterUsers(users, username);
        navigate(`/ModeratorViewAllUsers?query=${encodeURIComponent(username)}`);
        setSuggestions([]);
    };


    // Handle the popup open/close (For viewing more user details)
    const handlePopup = (user = null) => {
        setSelectedUser(user); // Set the selected user data
        setIsPopupOpen(!!user); // Open the popup if a user is selected
    };

    // Fetch all users when the page loads
    useEffect(() => {
        fetchAllUsers();
    }, [fetchAllUsers]);

    return (
        <div className='bg-main-background'>
            <div className="flex flex-col items-center justify-center gap-2 min-h-screen mx-4 pb-20 bg-main-background">
                {/* Logo Section */}
                <div className='p-2 fixed top-0 left-0 w-auto sm:w-2/4 md:w-2/3 lg:w-1/2 xl:w-1/3 bg-main-background'>
                    <InAppLogo />
                </div>

                {/* Search Bar Section */}
                <div className='mx-2 px-2 fixed top-12 flex w-full bg-main-background'>
                    <SearchBar value={searchQuery} onChange={handleSearchQueryChange} onKeyDown={handleKeyDown}/>
                </div>

                {/* Display Suggestions Section */}
                {suggestions.length > 0 && (
                    <div className="fixed top-20 w-full mx-2 px-2  z-50">
                        <div className="mx-2 bg-white shadow-lg rounded-lg">
                        {suggestions.map((user, index) => (
                            <p
                                key={index}
                                className="mx-2 px-2 py-1 border-b hover:bg-gray-100 cursor-pointer"
                                onClick={() => handleSuggestionClick(user.username)}
                            >
                                <span className="font-bold">{user.username}</span> - <span className="text-gray-500">{user.email}</span>
                            </p>
                        ))}
                        </div>
                    </div>
                )}

                {/* Display Users Section */}
                <div className="flex flex-col w-full justify-start items-center mt-20 gap-4">
                    <div className="flex w-full justify-start pt-2 items-start">
                        {searchQuery ? <p className="text-start hidden"></p> : <p className="text-start font-bold text-xl">Users</p>}
                    </div>
                    {filteredUsers.length > 0 ? (
                        filteredUsers.map((user, index) => (
                            <div
                                key={index}
                                className="w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/3 rounded-lg border-2 border-gray-200 bg-slate-50"
                            >
                                <div className="flex flex-grow m-2">
                                    <div className="flex w-full justify-between">
                                        <div className="flex flex-col justify-center items-start gap-1 ml-4">
                                            <h1 className="text-base font-bold">{user.username}</h1>
                                            <p className="text-sm">{user.name}</p>
                                            <p className="text-sm">{user.email}</p>
                                            <p className="text-sm">{user.active_properties}</p>
                                            <p className="text-sm">{user.location}</p>
                                        </div>
                                        <div className="text-sm font-bold mx-4">
                                            {user.renterOrOwner}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex w-full justify-evenly m-2">
                                    <button className="font-bold text-green-500 text-base" onClick={() => handlePopup(user)}>
                                        View
                                    </button>
                                    <button
                                        className={`font-bold text-base ${user.status === '1' ? 'text-red-500' : 'text-green-500'}`}
                                        onClick={() => handleUserStatus(user.userID, user.status)}
                                    >
                                        {user.status === '1' ? 'Block' : 'Unblock'}
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex justify-center items-center w-full h-96">
                            <p className="text-gray-500">No users found</p>
                        </div>
                    )}
                </div>
                {/* Popup for Viewing User Details */}
                {isPopupOpen && selectedUser && (
                    <div className="fixed inset-0 grid place-items-center bg-black bg-opacity-50">
                        <div className="fixed w-full max-w-lg top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 rounded-lg shadow-lg z-50">
                            <div className="bg-white border-2 border-gray-400 p-6 rounded-lg">
                                {/* Header Section */}
                                <div className="grid grid-cols-2 items-center border-b border-gray-400 pb-2 mb-4">
                                    <p className="font-bold text-lg">{selectedUser.name}</p>
                                    <button 
                                        onClick={() => handlePopup(null)} 
                                        className="justify-self-end text-lg text-gray-500 hover:text-black"
                                    >
                                        Close
                                    </button>
                                </div>

                                {/* Role Section */}
                                <p className="mb-4 text-gray-600">{selectedUser.renterOrOwner}</p>

                                {/* User Details Section */}
                                <div className="grid grid-cols-2 gap-y-2 text-sm">
                                    <p className="font-bold">Username:</p>
                                    <p>{selectedUser.username}</p>

                                    <p className="font-bold">Email:</p>
                                    <p>{selectedUser.email}</p>

                                    <p className="font-bold">Phone Number:</p>
                                    <p>{selectedUser.phone_number}</p>

                                    <p className="font-bold">Profession:</p>
                                    <p>{selectedUser.profession}</p>

                                    <p className="font-bold">Active Properties:</p>
                                    <p>{selectedUser.active_properties}</p>

                                    <p className="font-bold">Location:</p>
                                    <p>{selectedUser.full_address}</p>

                                    <p className="font-bold">Member Since:</p>
                                    <p>{selectedUser.createdAt}</p>
                                </div>

                                {/* Block/Unblock Button */}
                                <button
                                    className={`mt-6 w-full py-2 rounded text-white font-bold ${
                                        selectedUser.status === '1' ? 'bg-red-500' : 'bg-green-500'
                                    }`}
                                    onClick={async () => {
                                        await handleUserStatus(selectedUser.userID, selectedUser.status);
                                        setSelectedUser((prev) => ({
                                            ...prev,
                                            status: prev.status === '1' ? '0' : '1',
                                        }));
                                    }}
                                >
                                    {selectedUser.status === '1' ? 'Block' : 'Unblock'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {/* NavBar Section */}
                <NavBarModerator UsersColor={"00B761"} />
            </div>
        </div>
    );
}