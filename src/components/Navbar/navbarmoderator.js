/**
 * navbarmoderator.js
 * Description: Navigation bar for moderator view
 * Author: Lilian Huh
 * Date: 2024-10-23
 */

import React from 'react';
//import { IoSearchSharp } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa6";
import { Link } from 'react-router-dom';
import { TbReportSearch } from "react-icons/tb";
import { PiUsersThree } from "react-icons/pi";

// This is the navigation bar that will be displayed at the bottom of the screen
export default function NavBarModerator({ReportColor, UsersColor, ProfileColor}) {
    return (
        <nav className='fixed bottom-0 w-full border border-t-2 py-4 px-6 pb-5 bg-main-background'>
            <ul className='flex flex-row justify-between'>
                {/* <li>
                    <Link to="/Search">
                        <IoSearchSharp className="w-8 h-8 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14" style={{ color: SearchColor }} />
                    </Link>
                </li> */}
                <li>
                    <Link to="/ModeratorViewReport">
                        <TbReportSearch className="w-8 h-8 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14" style={{ color: ReportColor }} />
                    </Link>
                </li>
                <li>
                    <Link to="/ModeratorViewAllUsers">
                        <PiUsersThree className="w-8 h-8 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14" style={{ color: UsersColor }} />
                    </Link>
                </li>
                <li>
                    <Link to="/ModeratorViewProfile">
                        <FaRegUser className="w-8 h-8 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14" style={{ color: ProfileColor }} />
                    </Link>
                </li>
            </ul>
        </nav>


    );
};
