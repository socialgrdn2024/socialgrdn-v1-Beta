/**
 * GrossEarnings.js
 * Description: Page for landowner to view gross earnings
 * Frontend Author: Tiana Bautista
 * Backend Author: Lilian Huh
 * Date: 2024-10-23
 */

// Import statements
import React, { useState, useEffect } from 'react';
import { useUser } from '../../UserContext';
import InAppLogo from '../../components/Logo/inAppLogo';
import NavBar from '../../components/Navbar/navbar';
import Sprout from '../../assets/navbarAssets/sprout.png';
import BackMoreButton from '../../components/Buttons/backMoreButton';
import { SlArrowRight } from 'react-icons/sl';
import { IoCloseOutline } from 'react-icons/io5';

// Array of month names
const monthNames = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December',
];

export default function GrossEarnings() {
	// States
	const [earnings, setEarnings] = useState([]); // State for earnings
	//const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [selectedMonth, setSelectedMonth] = useState(null); // For modal
	const [detailedEarnings, setDetailedEarnings] = useState([]); // State for detailed earnings
	const [modalLoading, setModalLoading] = useState(false); // State for modal loading
	const { userId } = useUser();

	useEffect(() => {
		// Function to fetch gross earnings
		const fetchGrossEarnings = async () => {
			//setLoading(true);
			setError(null);
			try {
				// Fetch gross earnings API route
				const response = await fetch(`/api/getEarnings?userID=${userId}`);
				// Check if the response is not OK
				if (!response.ok) {
					throw new Error('Error fetching gross earnings:', error);
				}

				const data = await response.json();
				// Check if data is an object and has a message property
				if (data.message) {
					setEarnings([]); // Clear any existing earnings
					setError(data.message); // Set the error message from the response
				} else if (Array.isArray(data)) {
					setEarnings(data);
				} else {
					setEarnings([]);
				}
			} catch (error) {
				setError(error.message);
				console.error('Error fetching gross earnings:', error);
			}
		};
		// Call the fetchGrossEarnings function
		if (userId) {
			fetchGrossEarnings();
		}
	}, [userId, error]);

	// Group earnings by year
	const groupedEarnings = earnings.reduce((acc, earning) => {
		// Extract year, month, and amount from the earning object
		const year = earning.YEAR;
		const month = monthNames[earning.MONTH - 1]; // Convert month number to month name
		const amount = Number(earning.total_rent).toFixed(2); // Convert amount to 2 decimal places

		// Check if the year exists in the accumulator
		if (!acc[year]) {
			// If year does not exist, create an empty object
			acc[year] = {};
		}
		acc[year][month] = { amount, monthNumber: earning.MONTH }; // Add monthNumber for later use
		return acc;
	}, {});

	// Function to open the modal and fetch detailed earnings
	const openModal = async (year, month, monthNumber) => {
		setSelectedMonth({ year, month }); // Set the selected month for the modal
		setModalLoading(true);
		try {
			// Fetch detailed earnings API route
			const response = await fetch(
				`/api/GetEarnings/details?userID=${userId}&year=${year}&month=${monthNumber}`
			);
			// Check if the response is not OK
			if (!response.ok) {
				throw new Error('Failed to fetch detailed earnings');
			}
			// Parse the response data
			const data = await response.json();
			// Set the detailed earnings
			setDetailedEarnings(data);
		} catch (error) {
			console.error('Error fetching detailed earnings:', error);
		} finally {
			setModalLoading(false); // Set modal loading to false
		}
	};

	// Function to close the modal
	const closeModal = () => {
		setSelectedMonth(null); // Clear the selected month
		setDetailedEarnings([]); // Clear the detailed earnings
	};

	return (
		<div className="bg-main-background flex flex-col min-h-screen">
			<header className="p-4 flex items-center justify-between">
				<div className="p-2 fixed top-0 left-0 w-auto sm:w-2/4 md:w-2/3 lg:w-1/2 xl:w-1/3 bg-main-background">
					<InAppLogo />
				</div>
			</header>
			<div className="pt-2">
				<BackMoreButton />
			</div>
			<div className="flex flex-col items-center justify-start px-4">
				<div className=" block w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/3">
					<div className="pb-6">
						<p className="text-2xl font-bold text-center">Past Earnings</p>
					</div>
					{!earnings.length && !error ? (
						<p className="italic text-lg text-center text-gray-400">No earnings to display</p>
					) : (
						null
					)}
					{error ? (
						<p className="text-xl text-center">{error}</p>
					) : (
						<div className="overflow-x-auto">
							{Object.keys(groupedEarnings).map((year) => (
								<div key={year} className="mb-4">
									<h3 className="text-xl font-bold mb-4">{year}</h3>
									<table className="min-w-full bg-white">
										<thead>
											<tr>
												<th className="text-lg text-left pl-6">Month</th>
												<th className=" text-lg text-right">Total (CAD)</th>
											</tr>
										</thead>
										<tbody>
											{Object.keys(groupedEarnings[year]).map((month) => (
												<tr key={month}>
													<td className="pl-6">{month}</td>
													<td className="text-right font-bold">
														${groupedEarnings[year][month].amount}
													</td>
													<td>
														<SlArrowRight
															className=" ml-2 mr-1 cursor-pointer"
															onClick={() =>
																openModal(
																	year,
																	month,
																	groupedEarnings[year][month].monthNumber
																)
															}
														/>
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							))}
						</div>
					)}
				</div>
			</div>

			<NavBar ProfileColor={'#00B761'} SproutPath={Sprout} />

			{/* Modal for detailed earnings */}
			{selectedMonth && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
					<div className="bg-white p-6 rounded-lg w-3/4 md:w-1/2">
						<div className="flex justify-between items-center mb-4">
							<h3 className="text-xl font-bold">
								{selectedMonth.month} {selectedMonth.year}
							</h3>
							<button
								onClick={closeModal}
								className="text-gray-600 hover:text-gray-900 p-2 rounded"
							>
								<IoCloseOutline />
							</button>
						</div>
						{modalLoading ? (
							<p className="text-lg text-center"></p>
						) : (
							<table className="min-w-full bg-gray-100">
								<thead>
									<tr>
										<th className="py-2 px-4 border-b text-left">Day</th>
										<th className="py-2 px-4 border-b text-right">Amount</th>
									</tr>
								</thead>
								<tbody>
									{detailedEarnings.map((earning) => (
										<tr key={earning.day}>
											<td className="py-2 px-4">{earning.day}</td>
											<td className="py-2 px-4 text-right font-bold">
												CAD {Number(earning.daily_total_rent).toFixed(2)}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						)}
					</div>
				</div>
			)}
		</div>
	);
}
