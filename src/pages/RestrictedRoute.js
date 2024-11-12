/**
 * RestrictedRoute.js
 * Description: This page is displayed when a user tries to access a restricted page
 * Frontend Author: Shelyn Del Mundo
 * Backend Author: Shelyn Del Mundo
 * Date: 2024-10-23
 */

import React from "react";
import InAppLogo from "../components/Logo/inAppLogo";
import { useNavigate } from "react-router-dom";

export default function RestrictedRoute() {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1);
    };

    return (
        <div className='bg-main-background'>
            <div className="flex flex-col items-center justify-center gap-2 min-h-screen mx-4 pb-20 bg-main-background">
                <div className='p-2 fixed top-0 left-0 w-auto sm:w-2/4 md:w-2/3 lg:w-1/2 xl:w-1/3 bg-main-background'>
                    <InAppLogo />
                </div>
                <div className='flex flex-col items-center justify-center gap-6 m-4 p-6 border-2 border-green-600'>
                    <h1 className='text-4xl font-bold '>Access Denied</h1>
                    <button
                        className="p-2 w-1/2 rounded shadow-lg bg-green-600 font-bold text-white text-center"
                        onClick={handleGoBack} // Add onClick handler
                        >
                        Go Back
                    </button>                
                </div>
            </div>
        </div>
    );
}