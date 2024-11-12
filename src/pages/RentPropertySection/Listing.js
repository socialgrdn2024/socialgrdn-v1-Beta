/**
 * Listing.js
 * Description: This page displays the listings on the listing page
 * Frontend Author: Shelyn Del Mundo
 * Date: 2024-10-23
 */

import React from "react";
import InAppLogo from "../../components/Logo/inAppLogo";
import NavBar from "../../components/Navbar/navbar";
import Sprout from "../../assets/navbarAssets/sproutGreen.png";
import SearchBar from "../../components/SearchComponents/search";

export default function Listing() {



    return (
        <div className='bg-main-background'>
            <div className="flex flex-col items-center justify-center gap-2 min-h-screen mx-4 pb-20 bg-main-background">
                <div className='p-2 fixed top-0 left-0 w-auto sm:w-2/4 md:w-2/3 lg:w-1/2 xl:w-1/3 bg-main-background'>
                    <InAppLogo/>
                </div>
                {/* Search Bar Section */}
                <div className='mx-2 px-2 fixed top-12 flex w-full items-center justify-between bg-main-background'>
                    <div className="flex-grow w-full">
                        <SearchBar className="w-full" />
                    </div>
                </div>
                {/* Navigation Bar */}
                <NavBar SproutPath={Sprout} />
            </div>
        </div>
    );
}