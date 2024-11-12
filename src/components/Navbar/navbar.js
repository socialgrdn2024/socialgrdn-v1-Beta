/**
 * Navbar.js
 * Description: Component that displays the navigation bar at the bottom of the screen for normal users
 * Frontend Author: Shelyn Del Mundo
 *                  Kristiana Bautista
 * Date: 2024-10-23
 */

import React from 'react';
import { IoSearchSharp } from "react-icons/io5";
import { FaEarthAmericas } from "react-icons/fa6";
import { FaRegUser } from "react-icons/fa6";
import { Link } from 'react-router-dom';

// This is the navigation bar that will be displayed at the bottom of the screen
export default function NavBar({ SproutPath, SearchColor, EarthColor, ProfileColor }) {
    return (
        <nav className='fixed bottom-0 w-full border border-t-2 py-4 px-6 pb-5 bg-main-background'>
            <ul className='flex flex-row justify-between'>
                <li>
                    <Link to="/Search">
                        <IoSearchSharp className="w-8 h-8 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14" style={{ color: SearchColor }} />
                    </Link>
                </li>
                <li>
                    <Link to="/RentalList">
                        <img src={SproutPath} alt="Sprout Icon" className="w-8 h-8 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14" />
                    </Link>
                </li>
                <li>
                    <Link to="/MapSearch">
                        <FaEarthAmericas className="w-8 h-8 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14" style={{ color: EarthColor }} />
                    </Link>
                </li>
                <li>
                    <Link to="/Profile">
                        <FaRegUser className="w-8 h-8 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14" style={{ color: ProfileColor }} />
                    </Link>
                </li>
            </ul>
        </nav>


    );
};
