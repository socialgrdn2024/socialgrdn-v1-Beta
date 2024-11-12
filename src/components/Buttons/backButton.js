/**
 * BackButton.js
 * Description: Component that displays and handles the back button
 * Frontend Author: Shelyn Del Mundo
 * Backend Author: Shelyn Del Mundo
 * Date: 2024-10-23
 */

import React from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBackSharp } from "react-icons/io5";


// This is a back button component that can be used throughout the application
export default function BackButton() {
    const navigate = useNavigate();

    return (
        <div className='px-6 mx-auto w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/3'>
            <button 
                onClick={() => navigate(-1)} 
                className="flex text-gray-500 hover:text-black focus:outline-none text-xl"
            >
                <IoArrowBackSharp /> 
                
            </button>
        </div>
    );
}