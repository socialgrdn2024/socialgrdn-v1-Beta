/**
 * Profile.js
 * Description: Page for viewing your own profile page
 * FrontEnd: Lilian Huh
 *BackEnd: Donald Uy
 * Date: 2024-10-23
 */

import React, { useState, useEffect } from "react";
import InAppLogo from "../../components/Logo/inAppLogo";
import NavBar from "../../components/Navbar/navbar";
import Sprout from "../../assets/navbarAssets/sprout.png";
import { SlArrowRight } from "react-icons/sl";
import { FaRegUser, FaRegUserCircle, FaPhone, FaUserTie, FaUserCircle } from "react-icons/fa";
import { FaLocationDot, FaRegEnvelope } from "react-icons/fa6";
import { IoRibbonOutline } from "react-icons/io5";
import { GrMapLocation } from "react-icons/gr";
import LongButton from "../../components/Buttons/longButton";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../../_utils/firebase";
import { useUser } from "../../UserContext";

export default function Profile() {
    const [firstname, setFirstName] = useState('');
    const [lastname, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [userAddress, setUserAddress] = useState('');
    const [userCity, setUserCity] = useState('');
    const [userProvince, setUserProvince] = useState('');
    const [userPostalCode, setUserPostalCode] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [profession, setProfession] = useState('');
    const [createdAt, setCreatedAt] = useState('');
    const { userId } = useUser(); 
    const email = auth.currentUser.email;

    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                // Fetch user profile based on userID
                const response = await fetch(`/api/getProfile?userID=${userId}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const userData = await response.json();
    
                // Log the data being received from the database
                console.log('Data received from the database:', userData);
    
                setFirstName(userData.first_name);
                setLastName(userData.last_name);
                setUsername(userData.username);
                setUserAddress(userData.address_line1);
                setUserCity(userData.city);
                setUserProvince(userData.province);
                setUserPostalCode(userData.postal_code);
                setPhoneNumber(userData.phone_number);
                setProfession(userData.profession);
    
                const date = new Date(userData.created_at);
                const options = { year: 'numeric', month: 'long', day: 'numeric' };
                setCreatedAt(date.toLocaleDateString('en-US', options));
            } catch (error) {
                console.error('Error fetching user profile:', error);
            }
        };
    
        if (userId) {
            fetchUserProfile();
        }
    }, [userId]);

    const handleLogOut = async () => {
        try {
            await signOut(auth);
            navigate("/SignIn");
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    const handleLandownerPage = () => {
        navigate("../ViewMyListings");
    };

    const handleEditProfile = () => {
        navigate("/EditProfile");
    };

    return (
        <div className='bg-main-background relative'>
            <InAppLogo />
            <div className="flex flex-col items-center justify-center gap-2 min-h-screen pb-20">

                <FaUserCircle className="text-green-500 text-9xl w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/3 mb-2" />
                <div className="flex flex-col items-start justify-start">
                    <div className="flex items-center space-x-4 p-3 ">
                        <FaRegUser className="text-2" />
                        <h1 className="text-lg ">{firstname} {lastname}</h1>
                    </div>
                    <div className="flex items-center space-x-4 p-3">
                        <FaRegUserCircle className="text-1" />

                        <h1 className="text-lg">{username}</h1>
                    </div>
                    <div className="flex items-center space-x-4 p-3">
                        <FaLocationDot className="text-1" />
                        {userAddress ?
                            <h1 className="text-lg">{userAddress}, {userCity}, {userProvince} <p className="hidden">{userPostalCode}</p></h1> :
                            <h1 className="text-lg text-slate-600">Address</h1>
                        }
                    </div>
                    <div className="flex items-center space-x-4 p-3 ">
                        <FaPhone className="text-1" />
                        {phoneNumber ?
                            <h1 className="text-lg">{phoneNumber}</h1> :
                            <h1 className="text-lg text-slate-600">Phone Number</h1>
                        }
                    </div>
                    <div className="flex items-center space-x-4 p-3">
                        <FaUserTie className="text-1" />
                        {profession ?
                            <h1 className="text-lg">{profession}</h1> :
                            <h1 className="text-lg text-slate-600">Profession</h1>
                        }
                    </div>
                    <div className="flex items-center space-x-4 p-3">
                        <FaRegEnvelope className="text-1" />
                        <h1 className="text-lg">{email}</h1>
                    </div>
                    <div className="flex items-center space-x-4 p-3 mb-4">
                        <IoRibbonOutline className="text-1" />
                        <h1 className="text-lg">{createdAt}</h1>
                    </div>
                    <div className='flex flex-col items-center justify-center gap-4 pb-6 w-full'>
                        <LongButton buttonName='Edit Profile'
                            onClick={handleEditProfile}
                            className='p-2 w-full rounded shadow-lg bg-green-600 text-white font-bold' />
                    </div>
                </div>

                <div className="flex items-center space-x-4 p-2 mb-2">
                    <GrMapLocation className="text-1" />
                    <button className="text-xl font-semibold" onClick={handleLandownerPage}>I am a landowner</button>
                    <SlArrowRight className="ml-auto text-xl" />
                </div>
                <div className="flex justify-center ">
                    <button className="text-red-500 text-lg font-extrabold" onClick={handleLogOut}>Log Out</button>
                </div>
            </div>
            <NavBar ProfileColor={"#00B761"} SproutPath={Sprout} />
        </div>
    );
}
