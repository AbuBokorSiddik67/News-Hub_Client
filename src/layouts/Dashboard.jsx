// src/layouts/Dashboard.jsx
import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth"; // Your custom authentication hook
import useAxiosSecure from "../hooks/useAxiosSecure"; // Your custom hook for secure axios instance
import { useQuery } from "@tanstack/react-query"; // For fetching admin status
import LoadingSpinner from "../components/shared/LoadingSpinner"; // Your loading spinner component

// Icons for navigation (make sure you have react-icons installed: npm install react-icons)
import {
	FaHome,
	FaUser,
	FaEdit,
	FaListAlt,
	FaPlusSquare,
	FaUsers,
	FaNewspaper,
	FaWallet,
	FaSignOutAlt,
	FaChartLine,
	// FaBookmark, // For user's saved articles/bookmarks
} from "react-icons/fa";
import { Helmet } from "react-helmet";

const Dashboard = () => {
	const { user, logOut, loading: authLoading } = useAuth();
	const axiosSecure = useAxiosSecure();

	// Fetch admin status using TanStack Query
	const { data: isAdmin, isLoading: isAdminLoading } = useQuery({
		queryKey: [user?.email, "isAdmin"],
		queryFn: async () => {
			if (!user?.email) return false; // If no user email, definitely not admin
			const res = await axiosSecure.get(`/users/admin/${user.email}`);
			return res.data?.admin; // Assuming your API returns { admin: true/false }
		},
		enabled: !authLoading && !!user?.email, // Only fetch if user is loaded and email exists
		staleTime: 1000 * 60 * 5, // Admin status is fresh for 5 mins
		cacheTime: 1000 * 60 * 10, // Stays in cache for 10 mins
	});

	if (authLoading || isAdminLoading) {
		return <LoadingSpinner />;
	}

	return (
		<div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
			<Helmet>
				<title>Dashboard</title>
			</Helmet>
			{/* Sidebar */}
			<div className="w-full md:w-64 bg-gradient-to-br from-blue-600 to-blue-800 text-white p-4 space-y-4 shadow-lg md:min-h-screen">
				<h2 className="text-3xl font-bold text-center mb-6 border-b border-blue-400 pb-4">
					NewsHub Dashboard
				</h2>
				<ul className="space-y-3">
					{/* Common Links for all users */}
					<li>
						<NavLink
							to="/"
							className="flex items-center p-3 rounded-lg transition-colors duration-200 hover:bg-blue-700 hover:text-white"
						>
							<FaHome className="mr-3 text-lg" />
							Home
						</NavLink>
					</li>
					<li>
						<NavLink
							to="/dashboard/my-profile"
							className={({ isActive }) =>
								`flex items-center p-3 rounded-lg transition-colors duration-200 ${
									isActive
										? "bg-blue-700 text-white"
										: "hover:bg-blue-700 hover:text-white"
								}`
							}
						>
							<FaUser className="mr-3 text-lg" />
							My Profile
						</NavLink>
					</li>
					<li>
						<NavLink
							to="/dashboard/my-articles"
							className={({ isActive }) =>
								`flex items-center p-3 rounded-lg transition-colors duration-200 ${
									isActive
										? "bg-blue-700 text-white"
										: "hover:bg-blue-700 hover:text-white"
								}`
							}
						>
							<FaListAlt className="mr-3 text-lg" />
							My Articles
						</NavLink>
					</li>
					<li>
						<NavLink
							to="/dashboard/add-article"
							className={({ isActive }) =>
								`flex items-center p-3 rounded-lg transition-colors duration-200 ${
									isActive
										? "bg-blue-700 text-white"
										: "hover:bg-blue-700 hover:text-white"
								}`
							}
						>
							<FaPlusSquare className="mr-3 text-lg" />
							Add Article
						</NavLink>
					</li>

					{/* Admin Links (Conditional Rendering) */}
					{isAdmin && (
						<>
							<div className="border-t border-blue-500 pt-4 mt-4">
								<h3 className="text-xl font-semibold mb-3">Admin Panel</h3>
							</div>
							<li>
								<NavLink
									to="/dashboard/all-users"
									className={({ isActive }) =>
										`flex items-center p-3 rounded-lg transition-colors duration-200 ${
											isActive
												? "bg-blue-700 text-white"
												: "hover:bg-blue-700 hover:text-white"
										}`
									}
								>
									<FaUsers className="mr-3 text-lg" />
									All Users
								</NavLink>
							</li>
							<li>
								<NavLink
									to="/dashboard/all-articles-admin"
									className={({ isActive }) =>
										`flex items-center p-3 rounded-lg transition-colors duration-200 ${
											isActive
												? "bg-blue-700 text-white"
												: "hover:bg-blue-700 hover:text-white"
										}`
									}
								>
									<FaNewspaper className="mr-3 text-lg" />
									All Articles(Manage)
								</NavLink>
							</li>
							<li>
								<NavLink
									to="/dashboard/add-publisher"
									className={({ isActive }) =>
										`flex items-center p-3 rounded-lg transition-colors duration-200 ${
											isActive
												? "bg-blue-700 text-white"
												: "hover:bg-blue-700 hover:text-white"
										}`
									}
								>
									<FaPlusSquare className="mr-3 text-lg" />
									Add Publisher
								</NavLink>
							</li>
							<li>
								<NavLink
									to="/dashboard/statistics"
									className={({ isActive }) =>
										`flex items-center p-3 rounded-lg transition-colors duration-200 ${
											isActive
												? "bg-blue-700 text-white"
												: "hover:bg-blue-700 hover:text-white"
										}`
									}
								>
									<FaChartLine className="mr-3 text-lg" />
									Statistics
								</NavLink>
							</li>
							{/* Optionally, if you have a page for user's payment history or saved articles */}
							<li>
								<NavLink
									to="/dashboard/payment-history"
									className={({ isActive }) =>
										`flex items-center p-3 rounded-lg transition-colors duration-200 ${
											isActive
												? "bg-blue-700 text-white"
												: "hover:bg-blue-700 hover:text-white"
										}`
									}
								>
									<FaWallet className="mr-3 text-lg" />
									Payment History
								</NavLink>
							</li>
						</>
					)}

					{/* Divider */}
					<div className="border-t border-blue-500 pt-4 mt-4"></div>

					{/* Other Website Navigation */}

					<li>
						<NavLink
							to="/subscription"
							className="flex items-center p-3 rounded-lg transition-colors duration-200 hover:bg-blue-700 hover:text-white"
						>
							<FaWallet className="mr-3 text-lg" />
							Subscription
						</NavLink>
					</li>
					{/* Optionally, if you have a page for user's payment history or saved articles */}
					<li>
						<NavLink
							to="/dashboard/payment-history"
							className={({ isActive }) =>
								`flex items-center p-3 rounded-lg transition-colors duration-200 ${
									isActive
										? "bg-blue-700 text-white"
										: "hover:bg-blue-700 hover:text-white"
								}`
							}
						>
							<FaWallet className="mr-3 text-lg" />
							Payment History
						</NavLink>
					</li>
					<li>
						<button
							onClick={logOut}
							className="flex items-center w-full text-left p-3 rounded-lg transition-colors duration-200 hover:bg-blue-700 hover:text-white"
						>
							<FaSignOutAlt className="mr-3 text-lg" />
							Logout
						</button>
					</li>
				</ul>
			</div>

			{/* Dashboard Content */}
			<div className="flex-1 p-6 md:p-8 overflow-y-auto">
				<Outlet /> {/* This is where nested route components will render */}
			</div>
		</div>
	);
};

export default Dashboard;
