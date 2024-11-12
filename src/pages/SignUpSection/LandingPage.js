/**
 * LandingPage.js
 * Description: This page is the landing page of the application where users can sign up or log in
 * Frontend Author: Shelyn Del Mundo
 * Backend Author: Shelyn Del Mundo
 * Date: 2024-10-23
 */

import React from 'react';
import logo from '../../assets/logo/SocialGrdnLogo.png';
import LongButton from '../../components/Buttons/longButton';

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-32 bg-radial-green fixed top-0 w-full"> 
      <img src={logo} alt="Social Grdn Logo" className="w-auto h-auto" />
      <div className="flex flex-col items-center justify-center gap-4 pb-6 w-full">
        <div className='px-4 block w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/3'>
          {/* Sign up button */}
          <LongButton buttonName='Sign up' 
              className='p-2 w-full rounded shadow-lg bg-green-600 text-white font-bold'
              pagePath="/SignUp"/>
        </div>
        <div className='px-4 block w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/3'>
          {/* Log in button */}
          <LongButton buttonName='Log in' 
            className='p-2 w-full rounded shadow-lg bg-green-200 font-bold'
            pagePath="/SignIn"/>
        </div>
      </div>
      
    </div>
  );
}