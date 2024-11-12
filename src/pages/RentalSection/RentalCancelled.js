/**
 * ReservationDetails.js
 * Description: Page for displaying the message that a rental has been cancelled
 * Author: Tiana Bautista
 * Date: 2024-10-23
 */

// Importing necessary libraries
import { useNavigate } from "react-router-dom";

import InAppLogo from "../../components/Logo/inAppLogo";
import NavBar from "../../components/Navbar/navbar";
import GreenSprout from "../../assets/navbarAssets/sproutGreen.png";

export default function RentalCancelled() {
    const navigate = useNavigate();

    // Function to navigate back to My Reservations
    const handleBackToRentals = () => {
        navigate('/RentalList');
    };

    return (
        <div className='bg-main-background relative'>
            <InAppLogo />

            <div className="flex flex-col justify-center gap-2 min-h-screen pb-20 pt-10">
                <div className="text-center">
                    {/* Reservation Cancelled Message */}
                    <p className="text-2xl font-bold">Your cancellation</p>
                    <p className="text-2xl font-bold">confirmation</p>

                    <p className="pt-5">Your reservation</p>
                    <p>has been cancelled</p>

                    {/* Button to go back to My Rentals
                     */}
                    <button
                        className="mt-5 text-teal-600 text-xl font-bold block mx-auto"
                        onClick={handleBackToRentals}
                    >
                        Back to My Reservation
                    </button>
                </div>
            </div>
            <NavBar SproutPath={GreenSprout} />
        </div>
    );
}
