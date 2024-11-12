/**
 * App.js
 * Description: Component that displays a search bar with a search icon.
 * Author: Donald Jans Uy
 *        Doniyor Rakhmanov
 *        Lilia Huh
 *        Shelyn Del Mundo
 *        Tiana Bautista
 *
 * Date: 2024-10-23
 */

import React from 'react';
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from 'react-router-dom';
// SignUp Section
import LandingPage from './pages/SignUpSection/LandingPage';
import SignUp from './pages/SignUpSection/SignUp';
import VerifyEmail from './pages/SignUpSection/VerifyEmail';

// SignIn Section
import SignIn from './pages/SignInSection/SignIn';
import ForgotPassword from './pages/SignInSection/ForgotPassword';

// Search Section
import Search from './pages/SearchSection/Search';
import MapSearch from './pages/SearchSection/MapSearch';

// Profile Section
import Profile from './pages/ProfileSection/Profile';
import EditProfile from './pages/ProfileSection/EditProfile';
import ViewProfile from './pages/ProfileSection/ViewProfile';

// Rent Property Section
import RentProperty from './pages/RentPropertySection/RentProperty';
import RentConfirmation from './pages/RentPropertySection/RentConfirmation';
import RentFailed from './pages/RentPropertySection/RentFailed';
import ViewProperty from './pages/RentPropertySection/ViewProperty';
import ViewMyProperty from './pages/RentPropertySection/ViewMyProperty';

// Listing Section
import Listing from './pages/RentPropertySection/Listing';
import DeletionConfirmation from './pages/ListingSection/DeletionConfirmation';
import ListingConfirmation from './pages/ListingSection/ListingConfirmation';
import ViewMyListings from './pages/ListingSection/ViewMyListings';
import AddProperty from './pages/ListingSection/AddProperty';
import EditProperty from './pages/ListingSection/EditProperty';

// Pay Property Section
import PayProperty from './pages/PayPropertySection/PayProperty';

// Reservation Pages Section
import RentalCancelled from './pages/RentalSection/RentalCancelled';
import RentalDetails from './pages/RentalSection/RentalDetails';
import RentalList from './pages/RentalSection/RentalList';

// Landowner Gross Earnings Section
import GrossEarnings from './pages/LandownerEarnings/GrossEarnings';
import Payouts from './pages/LandownerEarnings/Payouts';

//Moderator Section
import ModeratorViewMonthlyReport from './pages/Moderator/ModeratorViewMonthlyReport';
import ModeratorViewAllUsers from './pages/Moderator/ModeratorViewAllUsers';
import ModeratorViewReport from './pages/Moderator/ModeratorViewReport';
import ModeratorViewProfile from './pages/Moderator/ModeratorViewProfile';

// Utility components
import ProtectedRoute from './pages/ProtectedRoute';
import { useUserAuth } from './_utils/auth-context';
import { UserProvider } from './UserContext'; // Import the UserProvider

//Payment Page
//import { loadStripe } from '@stripe/stripe-js';
//const stripePromise = loadStripe('pk_test_51Q2bKFLm0aJYZy9zjEVCE8j46DB65CeMLdzRbsgQHjZE7yhmpnehuGyaS9PRhaEywzngrxc94rich04HvQQQixU2007gqxkrhn'); // Initialize Stripe with your publishable key

//Restricted Route
import RestrictedRoute from './pages/RestrictedRoute';

export default function App() {
	const { currentUser } = useUserAuth();

	return (
		<UserProvider>
			<Router>
				<Routes>
					{currentUser ? (
						<>
							{/* Search Section */}
							<Route path="/" element={<Navigate to="/Search" />} />
							<Route
								path="/Search/:query?"
								element={
									<ProtectedRoute allowedRoles={[0, 1, 2]}>
										<Search />
									</ProtectedRoute>
								}
							/>
							<Route
								path="/MapSearch"
								element={
									<ProtectedRoute allowedRoles={[0, 1, 2]}>
										<MapSearch />
									</ProtectedRoute>
								}
							/>

							{/* Sign Up Section */}
							<Route path="/LandingPage" element={<LandingPage />} />
							<Route path="/SignUp" element={<SignUp />} />
							<Route path="/VerifyEmail" element={<VerifyEmail />} />

							{/* Sign In Section */}
							<Route path="/SignIn" element={<SignIn />} />
							<Route path="/ForgotPassword" element={<ForgotPassword />} />

							{/* Profile Section */}
							<Route
								path="/Profile"
								element={
									<ProtectedRoute allowedRoles={[1, 2]}>
										<Profile />
									</ProtectedRoute>
								}
							/>
							<Route
								path="/EditProfile"
								element={
									<ProtectedRoute allowedRoles={[1, 2]}>
										<EditProfile />
									</ProtectedRoute>
								}
							/>
							<Route
								path="/ViewProfile/:id"
								element={
									<ProtectedRoute allowedRoles={[1, 2]}>
										<ViewProfile />
									</ProtectedRoute>
								}
							/>

							{/* Rent Property Section */}
							<Route
								path="/Listing"
								element={
									<ProtectedRoute allowedRoles={[0, 1, 2]}>
										<Listing />
									</ProtectedRoute>
								}
							/>
							<Route
								path="/RentProperty"
								element={
									<ProtectedRoute allowedRoles={[0, 1, 2]}>
										<RentProperty />
									</ProtectedRoute>
								}
							/>
							<Route
								path="/RentFailed"
								element={
									<ProtectedRoute allowedRoles={[0, 1, 2]}>
										<RentFailed />
									</ProtectedRoute>
								}
							/>
							<Route
								path="/RentConfirmation"
								element={
									<ProtectedRoute allowedRoles={[0, 1, 2]}>
										<RentConfirmation />
									</ProtectedRoute>
								}
							/>
							<Route
								path="/ViewProperty/:id"
								element={
									<ProtectedRoute allowedRoles={[0, 1, 2]}>
										<ViewProperty />
									</ProtectedRoute>
								}
							/>
							<Route
								path="/AddProperty"
								element={
									<ProtectedRoute allowedRoles={[0, 1, 2]}>
										<AddProperty />
									</ProtectedRoute>
								}
							/>
							<Route
								path="/EditProperty/:id"
								element={
									<ProtectedRoute allowedRoles={[0, 1, 2]}>
										<EditProperty />
									</ProtectedRoute>
								}
							/>

							{/* This route now dynamically receives the property_id as a URL param */}
							<Route
								path="/ViewMyProperty/:id"
								element={
									<ProtectedRoute allowedRoles={[0, 1, 2]}>
										<ViewMyProperty />
									</ProtectedRoute>
								}
							/>

							{/* Listing Section */}
							<Route
								path="/DeletionConfirmation"
								element={
									<ProtectedRoute allowedRoles={[0, 1, 2]}>
										<DeletionConfirmation />
									</ProtectedRoute>
								}
							/>
							<Route
								path="/ListingConfirmation"
								element={
									<ProtectedRoute allowedRoles={[0, 1, 2]}>
										<ListingConfirmation />
									</ProtectedRoute>
								}
							/>
							<Route
								path="/ListingConfirmation/:propertyId"
								element={
									<ProtectedRoute allowedRoles={[0, 1, 2]}>
										<ListingConfirmation />
									</ProtectedRoute>
								}
							/>

							<Route
								path="/ViewMyListings"
								element={
									<ProtectedRoute allowedRoles={[0, 1, 2]}>
										<ViewMyListings />
									</ProtectedRoute>
								}
							/>

							{/* Pay Property Section */}
							<Route
								path="/PayProperty"
								element={
									<ProtectedRoute allowedRoles={[0, 1, 2]}>
										<PayProperty />
									</ProtectedRoute>
								}
							/>

							{/* Rental Section */}
							<Route
								path="/RentalCancelled"
								element={
									<ProtectedRoute allowedRoles={[0, 1, 2]}>
										<RentalCancelled />
									</ProtectedRoute>
								}
							/>
							<Route
								path="/RentalDetails/:id"
								element={
									<ProtectedRoute allowedRoles={[0, 1, 2]}>
										<RentalDetails />
									</ProtectedRoute>
								}
							/>
							<Route
								path="/RentalList"
								element={
									<ProtectedRoute allowedRoles={[0, 1, 2]}>
										<RentalList />
									</ProtectedRoute>
								}
							/>

							{/* Moderator Section */}
							<Route
								path="/ModeratorViewMonthlyReport"
								element={
									<ProtectedRoute allowedRoles={[0]}>
										<ModeratorViewMonthlyReport />
									</ProtectedRoute>
								}
							/>
							<Route
								path="/ModeratorViewAllUsers/:query?"
								element={
									<ProtectedRoute allowedRoles={[0]}>
										<ModeratorViewAllUsers />
									</ProtectedRoute>
								}
							/>
							<Route
								path="/ModeratorViewReport"
								element={
									<ProtectedRoute allowedRoles={[0]}>
										<ModeratorViewReport />
									</ProtectedRoute>
								}
							/>
							<Route
								path="/ModeratorViewProfile"
								element={
									<ProtectedRoute allowedRoles={[0]}>
										<ModeratorViewProfile />
									</ProtectedRoute>
								}
							/>

							{/* Landowner Gross Earnings Section */}
							<Route
								path="/GrossEarnings"
								element={
									<ProtectedRoute allowedRoles={[0, 1, 2]}>
										<GrossEarnings />
									</ProtectedRoute>
								}
							/>
							<Route
								path="/Payouts"
								element={
									<ProtectedRoute allowedRoles={[0, 1, 2]}>
										<Payouts />
									</ProtectedRoute>
								}
							/>

							{/* Restricted Route */}
							<Route path="/RestrictedRoute" element={<RestrictedRoute />} />
						</>
					) : (
						<>
							<Route path="/" element={<Navigate to="/LandingPage" />} />
							<Route path="/LandingPage" element={<LandingPage />} />
							<Route path="/SignIn" element={<SignIn />} />
							<Route path="/SignUp" element={<SignUp />} />
							<Route path="/ForgotPassword" element={<ForgotPassword />} />
							<Route path="/VerifyEmail" element={<VerifyEmail />} />
							<Route path="/RestrictedRoute" element={<RestrictedRoute />} />
						</>
					)}
				</Routes>
			</Router>
		</UserProvider>
	);
}
