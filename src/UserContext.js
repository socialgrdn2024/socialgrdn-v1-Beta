/**
 * MonthYearPicker.js
 * Description: A React component for selecting a range of months for rentals or bookings.
 * Author: Donald Jans Uy
 * Date: 2024-09-26
 */

import React, { createContext, useState, useContext, useEffect } from 'react';
//context for user state manage
const UserContext = createContext();


//component for user state logic
export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    //checking if the user ID is in localStorage
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      //set userID if existing to the local storage
      setUserId(storedUserId);
    }
  }, []);

  const updateUserId = (id) => {
    setUserId(id);
    localStorage.setItem('userId', id);
  };

  useEffect(() => {
    //check if the user role is in localStorage
    const storedRole = localStorage.getItem('role');
    if (storedRole) {
      //set role
      setRole(storedRole);
    }
  }, []);


  const updateRole = (userRole) => {
    //update the state of role
    setRole(userRole);
    //set role
    localStorage.setItem('role', userRole);
  };

    // Provide the user state and updater functions to the context consumers
  return (
    <UserContext.Provider value={{ userId, setUserId: updateUserId, role, setRole: updateRole }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
