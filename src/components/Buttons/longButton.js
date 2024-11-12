/**
 * LongButton.js
 * Description: Component that displays a button with a long width
 * Frontend Author: Shelyn Del Mundo
 * Backend Author: Shelyn Del Mundo
 * Date: 2024-10-23
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';

// This is a button component that can be used throughout the application
const LongButton = ({
	buttonName,
	onClick,
	className,
	type = 'button',
	pagePath,
}) => {
	const commonClasses = `py-2 px-4 rounded shadow-lg ${className}`;
	const navigate = useNavigate();

	const handleClick = (event) => {
		// Call the onClick handler if provided
		if (onClick) {
			onClick(event);
		}
		// If there's a pagePath, navigate after the click
		if (pagePath) {
			navigate(pagePath);
		}
	};

	return (
		<button onClick={handleClick} className={commonClasses} type={type}>
			{buttonName}
		</button>
	);
};

export default LongButton;
