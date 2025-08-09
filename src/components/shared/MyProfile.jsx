// src/pages/MyProfile.jsx
import React from "react"; // React import is necessary
import useAuth from "../../hooks/useAuth";
import { FaEdit } from "react-icons/fa"; // Importing FaEdit for the Edit Profile button icon
import LoadingSpinner from "./LoadingSpinner";
import { Link } from "react-router";
import { Helmet } from "react-helmet";

const MyProfile = () => {
	const { user, loading } = useAuth();

	// Show loading spinner while authentication is in progress
	if (loading) {
		return <LoadingSpinner />;
	}

	// If user is not logged in, prompt them to log in
	if (!user) {
		return (
			<div className="flex justify-center items-center h-[calc(100vh-80px)] text-xl text-red-500">
				Please log in to view your profile.
			</div>
		);
	}

	return (
		<div className="min-h-[calc(100vh-80px)] bg-gray-100 p-4 sm:p-6 lg:p-8 flex justify-center items-center">
			<Helmet>
				<title>My-Profile</title>
			</Helmet>
			<div className="max-w-xl w-full bg-white rounded-lg shadow-xl overflow-hidden">
				<div className="p-6 sm:p-8 text-center">
					<h2 className="text-3xl font-bold text-gray-800 mb-6">My Profile</h2>
					<div className="mb-6">
						{user.photoURL ? (
							<img
								src={user.photoURL}
								alt={user.displayName || "User Avatar"}
								className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-blue-400 shadow-md transform transition-transform duration-300 hover:scale-105"
							/>
						) : (
							<div className="w-32 h-32 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-5xl font-bold mx-auto border-4 border-blue-400 shadow-md">
								{user.displayName ? user.displayName[0].toUpperCase() : "U"}
							</div>
						)}
					</div>

					<div className="space-y-3 mb-8">
						<p className="text-xl font-semibold text-gray-700">
							Name:{" "}
							<span className="text-gray-900">
								{user.displayName || "Not Available"}
							</span>
						</p>
						<p className="text-lg text-gray-600">
							Email:{" "}
							<span className="text-gray-800">
								{user.email || "Not Available"}
							</span>
						</p>
						{/* Optionally display premium status */}
						{user.isPremium && (
							<p className="text-lg font-bold text-blue-600 flex items-center justify-center">
								<span className="mr-2 text-yellow-500">🌟</span> Premium Member
							</p>
						)}
					</div>

					<div className="mt-8">
						{/* You can make this button redirect to an "Edit Profile" page */}
						<button className="bg-blue-600 text-white py-2.5 px-7 rounded-md hover:bg-blue-700 transition-colors duration-300 font-semibold shadow-lg inline-flex items-center">
							<Link to="/dashboard/edit-profile">
								<FaEdit className="mr-2" /> Edit Profile
							</Link>
						</button>
					</div>
				</div>
				{/* My Articles section removed */}
			</div>
		</div>
	);
};

export default MyProfile;
