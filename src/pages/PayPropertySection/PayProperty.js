import React from "react";
import InAppLogo from "../../components/Logo/inAppLogo";
import NavBar from "../../components/Navbar/navbar";
import GreenSprout from "../../assets/navbarAssets/sproutGreen.png";
import { IoArrowBackSharp } from "react-icons/io5";
import SearchBar from "../../components/SearchComponents/search";
import Pay from "../../components/Buttons/longButton";





export default function PayProperty() {
    // const [cardNumber, setCardNumber] = useState('');
    // const [expiryDate, setExpiryDate] = useState('');
    // const [cvv, setCVV] = useState('');



    return (
        <div className='bg-main-background'>
            {/* Main Content */}
            <div className="flex flex-col items-center justify-center min-h-screen mx-4 pb-20 bg-main-background">
                {/* Logo */}
                <div className='p-2 fixed top-0 left-0 w-auto sm:w-2/4 md:w-2/3 lg:w-1/2 xl:w-1/3 bg-main-background'>
                    <InAppLogo/>
                </div>

                {/* Top Bar Section (Back Button, Search) */}
                <div className="flex items-center justify-between fixed top-0 left-0 right-0 mt-10 px-4 bg-main-background">
                    <button>
                        <IoArrowBackSharp size={25} />
                    </button>
                    <div className="flex-grow w-full">
                        <SearchBar className="w-full" />
                    </div>
                </div>

                {/* Adding Payment Section */}
                <form className="w-full rounded-lg mt-24 border-2 p-2 border-gray-200 bg-main-background">
                    <div>
                        <p>Credit Card Number</p>
                        <input 
                            type="integer" 
                            placeholder="Card Number"
                            // value={cardNumber} 
                            className="w-full rounded-md p-2 border border-gray-200 focus:outline-none focus:ring-green-400 focus:border-green-400"  />
                    </div>
                    <div className="flex flex-row w-full justify-between">
                        <div className="w-auto">
                            <p>Expiry (MM/YY)</p>
                                <input
                                    type="text"
                                    placeholder="MM / YY"
                                    // value={expiryDate}
                                    maxLength="5" // To limit input to MM/YY format
                                    className="w-28 py-2 text-center border border-gray-200 rounded-md focus:outline-none focus:ring-green-400 focus:border-green-400 sm:text-sm"
                                    onKeyDown={(e) => {
                                    // Prevent entering non-numeric characters except for "/"
                                    if (!/[0-9/]/.test(e.key) && e.key !== 'Backspace') {
                                        e.preventDefault();
                                    }
                                    }}
                                />
                        </div>
                        <div className="w-auto">
                            <p>CVV</p>
                            <input 
                                type="integer"
                                placeholder="CVV"
                                // value={cvv}
                                maxLength="3" 
                                className="w-28 py-2 text-center border border-gray-200 rounded-md focus:outline-none focus:ring-green-400 focus:border-green-400 sm:text-sm"  />
                        </div>
                    </div>

                    <div>
                        <p>Card Holder's Name</p>
                        <input 
                            type="text" 
                            placeholder="Card Holder's Name"
                            className="w-full rounded-md p-2 border border-gray-200 focus:outline-none focus:ring-green-400 focus:border-green-400"  />
                    </div>

                    <h2 className="font-semibold py-2">Billing Address</h2>

                    <div>
                        <p>First Name</p>
                        <input 
                            type="text" 
                            placeholder="First Name"
                            className="w-full rounded-md p-2 border border-gray-200 focus:outline-none focus:ring-green-400 focus:border-green-400"  />
                    </div>
                    <div>
                        <p>Last Name</p>
                        <input 
                            type="text" 
                            placeholder="Last Name"
                            className="w-full rounded-md p-2 border border-gray-200 focus:outline-none focus:ring-green-400 focus:border-green-400"  />
                    </div>
                    <div>
                        <p>Address Line 1</p>
                        <input 
                            type="text" 
                            placeholder="Address Line 1"
                            className="w-full rounded-md p-2 border border-gray-200 focus:outline-none focus:ring-green-400 focus:border-green-400"  />
                    </div>
                    <div>
                        <p>Address Line 2</p>
                        <input 
                            type="text" 
                            placeholder="Address Line 2"
                            className="w-full rounded-md p-2 border border-gray-200 focus:outline-none focus:ring-green-400 focus:border-green-400"  />
                    </div>
                    <div>
                        <p>City</p>
                        <input 
                            type="text" 
                            placeholder="City"
                            className="w-full rounded-md p-2 border border-gray-200 focus:outline-none focus:ring-green-400 focus:border-green-400"  />
                    </div>
                    <div>
                        <p>Province</p>
                        <input 
                            type="text" 
                            placeholder="Province"
                            className="w-full rounded-md p-2 border border-gray-200 focus:outline-none focus:ring-green-400 focus:border-green-400"  />
                    </div>
                    <div>
                        <p>Postal Code</p>
                        <input 
                            type="text" 
                            placeholder="Postal Code"
                            maxLength={6}
                            className="w-full rounded-md p-2 border border-gray-200 focus:outline-none focus:ring-green-400 focus:border-green-400"  />
                    </div>
                    <Pay 
                        buttonName='Pay'
                        type="submit"
                        className="my-4 py-2 w-full rounded-full border border-black font-semibold"/>
                </form>
            </div>
            <NavBar SproutPath={GreenSprout} />

        </div>
    );
}