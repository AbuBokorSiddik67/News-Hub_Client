// src/routes/AdminRoute.jsx (অথবা src/Private/AdminRoute.jsx)
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth"; // Your custom authentication hook
import useAxiosSecure from "../hooks/useAxiosSecure"; // Your custom hook for secure axios instance
import { useQuery } from "@tanstack/react-query"; // For fetching admin status
import LoadingSpinner from "../components/shared/LoadingSpinner"; // Your loading spinner component

const AdminRoute = ({ children }) => {
	const { user, loading: authLoading } = useAuth();
	const axiosSecure = useAxiosSecure();
	const location = useLocation(); // To save current location for redirect after login

	// Fetch admin status using TanStack Query
	const {
		data: isAdmin,
		isLoading: isAdminLoading,
		isError: isAdminError,
	} = useQuery({
		queryKey: [user?.email, "isAdmin"], // Query key depends on user email
		queryFn: async () => {
			// If there's no user email, return false immediately (not an admin)
			if (!user?.email) {
				return false;
			}
			try {
				// Call your backend API to check admin status
				const res = await axiosSecure.get(`/users/admin/${user.email}`);
				return res.data?.admin; // Assuming API returns { admin: true/false }
			} catch (error) {
				// Log error and return false if API call fails (e.g., forbidden access, server error)
				console.error("Error checking admin status:", error);
				return false;
			}
		},
		// Only run this query if authLoading is false and user email exists
		enabled: !authLoading && !!user?.email,
		staleTime: 1000 * 60 * 5, // Admin status is fresh for 5 minutes
		cacheTime: 1000 * 60 * 10, // Stays in cache for 10 minutes
	});

	// Show loading spinner while authentication or admin status is being checked
	if (authLoading || isAdminLoading) {
		return <LoadingSpinner />;
	}

	// If user is not logged in, redirect to login page
	if (!user) {
		return <Navigate to="/login" state={{ from: location }} replace />;
	}

	// If there was an error checking admin status or user is not an admin,
	// redirect to home or an unauthorized page.
	if (isAdminError || !isAdmin) {
		// You might want to show a more specific "Unauthorized" page
		// instead of just redirecting to home. For simplicity, redirecting to home.
		return <Navigate to="/" replace />;
	}

	// If user is logged in AND is an admin, render the children components
	return children;
};

export default AdminRoute;
