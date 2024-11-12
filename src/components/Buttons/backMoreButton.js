/**
 * ViewMyListings.js
 * Description: Back and More button component
 * FrontEnd: Lilian Huh
 * BackEnd: Lilian Huh
 * Date: 2024-10-23
 */

// Import necessary libraries
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CgDetailsMore } from 'react-icons/cg';
import { IoArrowBackSharp } from 'react-icons/io5';

export default function BackMoreButton() {
	const navigate = useNavigate();
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

	// Toggle sidebar visibility
	const toggleSidebar = () => {
		setIsSidebarOpen(!isSidebarOpen);
	};

	return (
		<div className="mx-auto w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/3 p-6">
			<div className="flex justify-between items-center">
				{/* Back Button */}
				<button
					onClick={() => navigate(-1)}
					className="text-gray-500 hover:text-black focus:outline-none text-xl"
				>
					<IoArrowBackSharp />
				</button>

				{/* More Options Button */}
				<button
					onClick={toggleSidebar}
					className="text-gray-500 hover:text-black focus:outline-none text-xl"
				>
					<CgDetailsMore />
				</button>
			</div>

			{/* Sidebar */}
			<div
				className={`fixed top-0 right-0 h-full bg-white shadow-lg z-50 transition-transform duration-300 ${
					isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
				} w-44`}
			>
				<div className="p-4">
					<h2 className="text-xl font-bold mb-4">Reports</h2>
					{/* Gross earnings */}
					<button
						onClick={() => navigate('/grossEarnings')}
						className="block w-full text-left py-2 px-4 mb-2 text-gray-700 hover:bg-gray-200"
					>
						Past Earnings
					</button>
					{/* Payouts */}
					<button
						onClick={() => navigate('/payouts')}
						className="block w-full text-left py-2 px-4 text-gray-700 hover:bg-gray-200"
					>
						Future Payouts
					</button>
				</div>
			</div>

			{/* Overlay */}
			{isSidebarOpen && (
				<div
					className="fixed inset-0 bg-black opacity-50 z-40"
					onClick={toggleSidebar}
				/>
			)}
		</div>
	);
}
