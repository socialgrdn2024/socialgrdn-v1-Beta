/**
 * ForgotPassword.js
 * Description: Page for users to reset their password
 * Author: Lilian Huh
 * Date: 2024-10-23
 */

import React, { useState } from 'react';
import LongButton from '../../components/Buttons/longButton';
import BackButton from '../../components/Buttons/backButton';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../_utils/firebase';
import { useNavigate } from 'react-router-dom';

// This is the ForgotPassword page of the application where users can reset their password
export default function ForgotPassword() {
	const navigate = useNavigate();
	const [message, setMessage] = useState('');
	const [messageType, setMessageType] = useState(''); // success or error

	// This function will handle the password reset process
	const handleSubmit = async (e) => {
		e.preventDefault();

		// Get the email value from the form
		const emailVal = e.target.email.value;

		// Send the password reset email using the email value from the form and Firebase Auth
		sendPasswordResetEmail(auth, emailVal)
			.then((data) => {
				setMessageType('success');
				setMessage(
					<div className="m-2">
						<p>
							If you are registered with us, you will receive an email to reset
							your password.
						</p>
						<p>Not redirected to the sign-in page?</p>
					</div>
				);
				setTimeout(() => navigate('/SignIn'), 3000); // Navigate after 3 seconds
			})
			.catch((error) => {
				setMessageType('error');
				setMessage('Invalid email. Please try again.');
			});
	};

	return (
		<div className="flex flex-col pt-11 h-screen bg-main-background relative">
			<BackButton />
			<div className="flex flex-col items-center justify-center gap-4 pb-6 w-full mt-40">
				<h1 className="text-3xl font-semibold mb-6 text-center">
					Forgot Password?
				</h1>
				<p className="mx-auto w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/3 text-gray-600 mb-6 px-2 text-center">
					Enter your account's email to receive instructions to reset your
					password
				</p>
				<form
					className="mb-4 px-4 mx-auto w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/3"
					onSubmit={(e) => handleSubmit(e)}
				>
					<input
						name="email"
						type="text"
						placeholder="Email"
						className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-green-500 mb-3"
					/>
					<LongButton
						buttonName="Send Email"
						type="submit"
						className="w-full rounded shadow-lg bg-green-600 text-white font-bold"
					/>
				</form>
				{message && (
					<div
						className={`mt-3 text-center ${
							messageType === 'success'
								? 'font-bold '
								: 'text-red-600 font-bold'
						}`}
					>
						{message}

						<button
							onClick={() => navigate('/SignIn')}
							className="text-green-600 text-sm font-extrabold"
						>
							Click here to sign in
						</button>
					</div>
				)}
			</div>
		</div>
	);
}
