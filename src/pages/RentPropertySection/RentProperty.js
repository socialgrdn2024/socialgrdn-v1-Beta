/**
 * RentProperty.js
 * Description: Page for displaying the summary of
 * rental information and payment details before payment
 * Frontend Author: Shelyn del Mundo
 * Backend Author: Tiana Bautista
 * Date: 2024-10-23
 */

// Importing necessary libraries
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { format, parse, endOfMonth } from 'date-fns';

import InAppLogo from '../../components/Logo/inAppLogo';
import NavBar from '../../components/Navbar/navbar';
import GreenSprout from '../../assets/navbarAssets/sproutGreen.png';
import { IoArrowBackSharp } from 'react-icons/io5';
import SearchBar from '../../components/SearchComponents/search';
import AgreeAndPay from '../../components/Buttons/longButton';
import { LuMapPin } from 'react-icons/lu';
import zoneColor from '../../components/ZoneColor/zoneColor';

import { useUser } from '../../UserContext';

export default function RentProperty() {
	const { userId } = useUser();

	// Destructure navigationData from the location state
	const location = useLocation();
	const { propertyId, from, to, months } = location.state || {}; // Matching the key names exactly

	const [startDate, setStartDate] = useState('');
	const [endDate, setEndDate] = useState('');
	const [durationMonths, setDurationMonths] = useState('');

	useEffect(() => {
		setStartDate(from);
		setEndDate(to);
		setDurationMonths(months);
	}, [from, to, months]);

	//Stores Property Object Information
	const [property, setProperty] = useState('');

	// Rental Information
	const [rentalID, setRentalID] = useState('null');

	//Price Information
	const [base_price, setBase_price] = useState(0.0);
	const [tax_amount, setTax_amount] = useState(0.0);
	const [transaction_fee, setTransaction_fee] = useState(0.0);
	const [total_price, setTotal_price] = useState(0.0);

	useEffect(() => {
		const fetchPropertyDetails = async () => {
			try {
				//Fetching Property Details from API
				const response = await fetch(
					`http://localhost:3000/api/getPropertyDetails?property_id=${propertyId}`
				);
				if (!response.ok) {
					console.log('Network response was not ok');
				}
				//stores the response in propertyData in json format
				const propertyData = await response.json();
				setProperty(propertyData);
			} catch (error) {
				console.error('Error fetching property details:', error);
			}
		};
		fetchPropertyDetails();
		//eslint - disable - next - line
	}, [propertyId]);

	// Get the current location of the user
	const computePrice = () => {
		// Ensure property and duration are valid before proceeding
		if (property && durationMonths !== null) {
			// Calculate base price
			const computedBasePrice = property.rent_base_price * durationMonths;

			// Calculate tax and fees based on the computed base price
			const computedTaxAmount = computedBasePrice * 0.13; // 13% tax
			const computedTransactionFee = computedBasePrice * 0.03; // 3% transaction fee

			// Calculate total price
			const computedTotalPrice =
				computedBasePrice + computedTaxAmount + computedTransactionFee;

			// Update state with computed values
			setBase_price(computedBasePrice);
			setTax_amount(computedTaxAmount);
			setTransaction_fee(computedTransactionFee);
			setTotal_price(computedTotalPrice);
		}
	};

	useEffect(() => {
		computePrice();
		//eslint-disable-next-line
	}, [property]);

	const handlePaymentPage = async () => {
		try {
			// Register rental details to the database and get the rentalID
			const generatedRentalID = await handleRentalRegistration();

			if (rentalID === null) {
				console.error('Failed to register rental details');
				return;
			}
			// Proceed to Stripe payment
			await handleStripePayment(generatedRentalID);
		} catch (error) {
			console.error('Error in handling payment page:', error);
		}
	};

	//Stripe API Call
	const handleStripePayment = async (rentalID) => {
		if (!rentalID) {
			console.error('Rental ID is null. Cannot proceed with payment');
			return;
		}
		//Preparing paymentData object for DB registration
		const paymentData = {
			amount: total_price,
			rental_id: rentalID,
		};

		console.log('API start paymentData:', paymentData);

		try {
			//API call to register rental details
			const response = await fetch(
				'http://localhost:3001/api/create-checkout-session',
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(paymentData),
				}
			);

			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			const result = await response.json();
			console.log('Payment session created successfully:', result);

			// Redirect to Stripe Checkout page
			window.location.href = result.url;
		} catch (error) {
			console.error('Error occurred while creating payment session:', error);
		}
	};

	// Register rental details to the database
	const handleRentalRegistration = async () => {
		// Parse the start and end dates to the correct format
		const parsedStartDate = parse(startDate, 'MMMM yyyy', new Date());
		const formattedStartDate = format(parsedStartDate, 'yyyy-MM-01');

		const parsedEndDate = parse(endDate, 'MMMM yyyy', new Date());
		const endMonth = endOfMonth(parsedEndDate);
		const formattedEndDate = format(endMonth, 'yyyy-MM-dd');

		//Preparing rental object for DB registration
		const rentalData = {
			property_id: propertyId,
			renter_ID: userId,
			start_date: formattedStartDate,
			end_date: formattedEndDate,
			status: 0, // pending state, unpaid
			rent_base_price: base_price,
			tax_amount: tax_amount,
			transaction_fee: transaction_fee,
		};
		console.log('API start rentalData:', rentalData);

		try {
			//API call to register rental details
			const response = await fetch(
				'http://localhost:3000/api/registerRentalDetails',
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(rentalData), // Convert data to JSON format
				}
			);
			console.log('Rental registration response:', response);

			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			// Parse the JSON response
			const result = await response.json();
			console.log('Rental registration successful, result:', result);

			// Update the rentalID state with the last inserted ID
			setRentalID(result.rent_id);
			return result.rent_id;
		} catch (error) {
			console.error('Error occurred during rental registration:', error);
			return null;
		}
	};

	return (
		<div className="bg-main-background">
			{/* Main Content */}
			<div className="flex flex-col items-center justify-center min-h-screen mx-4 pb-20 bg-main-background">
				{/* Logo */}
				<div className="p-2 fixed top-0 left-0 w-auto sm:w-2/4 md:w-2/3 lg:w-1/2 xl:w-1/3 bg-main-background">
					<InAppLogo />
				</div>

				{/* Top Bar Section (Back Button, Search, Filter) */}
				<div className="flex items-center justify-between fixed top-0 left-0 right-0 mt-10 px-4 bg-main-background">
					<button>
						<IoArrowBackSharp size={25} />
					</button>
					<div className="flex-grow w-full">
						<SearchBar className="w-full" />
					</div>
				</div>

				{/* Rent Information */}
				<div className="w-96 rounded-lg border-2 py-1 border-gray-200 bg-main-background">
					<div className="px-6 pt-2">
						{/* Listing Title */}
						<div className="flex flex-row justify-between mb-2">
							<div>
								<h1 className="font-bold text-lg ">{property.property_name}</h1>
							</div>
						</div>
						{/* Listing Description */}
						<div className="flex flex-row justify-between">
							{/* Listing Address */}
							<div className="flex">
								<LuMapPin />
								<p className="text-xs">
									{property.address_line1 +
										', ' +
										property.city +
										', ' +
										property.province}
								</p>
							</div>
							{/* Farming Zone */}
							<div className="flex flex-row gap-1">
								<div
									className="w-4 h-4 border-1 border-gray-400"
									style={{ backgroundColor: zoneColor(property.growth_zone) }}
								></div>
								<p className="text-xs text-gray-500">
									Zone {property.growth_zone}
								</p>
							</div>
						</div>
					</div>

					{/* Listing Image */}
					<div className="w-auto h-52 flex justify-center items-center mx-4 p-1">
						<img
							className="w-full h-full rounded-lg border-2 border-gray-200"
							src={property.primaryImage}
							alt="Garden"
						/>
					</div>

					{/* Listing Duration */}
					<div className="flex flex-col">
						<div className="mx-4 flex">
							<p className="text-sm w-20">Date:</p>
							<p className="text-sm">{startDate}</p>
							<p className="mx-1 text-sm"> - </p>
							<p className="text-sm">{endDate}</p>
						</div>
						<div className="mx-4 flex">
							<p className="text-sm w-20">Duration:</p>
							<p className="text-sm">{durationMonths} Months</p>
						</div>
					</div>

					{/* Price Description */}
					<div className="mx-4">
						<h2 className="font-semibold">Price Breakdown (CAD)</h2>
						<div className="flex flex-col">
							<div className="mx-4 flex justify-between">
								<div className="flex">
									<p className="text-sm">{property.property_name}</p>
									<p className="text-sm mx-1"> x </p>
									<p className="text-sm">{durationMonths} months</p>
								</div>
								<p className="text-sm">
									{base_price.toLocaleString(undefined, {
										minimumFractionDigits: 2,
										maximumFractionDigits: 2,
									})}
								</p>
							</div>
							<div className="mx-4 flex justify-between">
								<p className="text-sm">SocialGrdn Fee (3%)</p>
								<p className="text-sm">
									{transaction_fee.toLocaleString(undefined, {
										minimumFractionDigits: 2,
										maximumFractionDigits: 2,
									})}
								</p>
							</div>
							<div className="mx-4 flex justify-between">
								<p className="text-sm">Tax</p>
								<p className="text-sm">
									{tax_amount.toLocaleString(undefined, {
										minimumFractionDigits: 2,
										maximumFractionDigits: 2,
									})}
								</p>
							</div>
						</div>
						<div className="mx-4 flex justify-between border-t border-t-black">
							<h2 className="font-semibold">Total</h2>
							<h2 className="font-semibold">
								{total_price.toLocaleString(undefined, {
									minimumFractionDigits: 2,
									maximumFractionDigits: 2,
								})}
							</h2>
						</div>

						<div className="my-2">
							<h2 className="font-semibold text-sm">Cancellation Policy</h2>
							<p className="text-xs">
								Cancellation permitted 30 days from the start of reservation
								date.
							</p>
						</div>
					</div>
				</div>
				<div className="mx-4 my-2 text-center text-xs">
					<p>
						By continuing with this booking, I agree to SocialGrdn's Terms of
						use and Privacy Policy
					</p>
				</div>
				{/* Payment Button */}
				<AgreeAndPay
					buttonName="Agree and Pay"
					type="submit"
					className="p-2 w-full rounded-lg bg-emerald-200"
					onClick={handlePaymentPage}
				/>
			</div>
			<NavBar SproutPath={GreenSprout} />
		</div>
	);
}
