/**
 * InAppLogo.js
 * Description: Component that displays the logo in the application
 * Frontend Author: Shelyn Del Mundo
 * Date: 2024-10-23
 */

import React from "react";
import AppLogo from "../../assets/logo/SocialGrdnInAppLogo.png";

// This is the logo component that is displayed in the left corner of the application
export default function InAppLogo() {
    return (
        <header className='py-3 block fixed w-full top-0 left-0 bg-main-background'>
            <img src={AppLogo} alt="Social Grdn Logo" className="w-auto h-auto bg-main-background"/>
        </header>
    );
}