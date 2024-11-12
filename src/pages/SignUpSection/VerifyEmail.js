import React, { useState, useEffect } from 'react';
import { auth } from '../../_utils/firebase';
import { sendEmailVerification } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo/SocialGrdnLogo.png';

export default function VerifyEmail() {
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const resendVerificationEmail = async () => {
        if (auth.currentUser) {
            try {
                await sendEmailVerification(auth.currentUser);
                setMessage('Verification email sent! Please check your inbox.');
            } catch (error) {
                setError(error.message);
                console.log(error);
            }
        }
    };

    useEffect(() => {
        const intervalId = setInterval(async () => {
            if (auth.currentUser) {
                await auth.currentUser.reload();
                //console.log('Reloaded user:', auth.currentUser);
                if (auth.currentUser.emailVerified) {
                    clearInterval(intervalId);
                    navigate('/SignIn');
                }
            }
        }, 3000); // Check every 3 seconds

        return () => clearInterval(intervalId);
    }, [navigate]);

    return (
        <div className='bg-main-background relative'>
            <div className="flex flex-col items-center justify-center min-h-screen m-2 pb-20">
                <img src={logo} alt="Social Grdn Logo" className="w-auto h-auto m-4" /> 
                <div className='text-center m-4 border-2 border-green-500 p-4'>
                    <div className='m-1'>
                        <strong className='text-3xl'>Verify Your Email</strong>
                    </div>
                    <div className='my-2 text-left'>
                        <p>Please check your email for a verification link.</p>
                        <p>If you did not receive an email, please click the button below to resend the verification email.</p>
                    </div>
                    <div className='my-2'>
                        <button onClick={resendVerificationEmail} className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded'>
                            Resend Verification Email
                        </button>
                    </div>
                    <div>
                        {message && <p>{message}</p>}
                        {error && <p>{error}</p>}
                    </div> 
                </div> 
            </div>
        </div>
    );
}
