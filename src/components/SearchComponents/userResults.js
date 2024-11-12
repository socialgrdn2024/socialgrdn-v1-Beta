/**
 * UserResults.js
 * Description: This component fetches the user data from the API
 * Backend Author: Shelyn Del Mundo
 * Date: 2024-10-24
 */

import { useState, useEffect } from "react";

export default function UserResult() {
    const [usersResult, setUsersResult] = useState([]);
    // Fetch user data from the API
    const fetchUserResults = async () => {
        try {
            const response = await fetch(`/api/getAllUsers`);
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const users = await response.json();
            if (users.length === 0) {
                console.log("No users found");
                setUsersResult([]);
            } else {
                setUsersResult(users);
            }
        } catch (error) {
            console.error("Error fetching search results:", error);
        }
    };


    useEffect(() => {
        fetchUserResults();
    }, []);

    return usersResult;
}


