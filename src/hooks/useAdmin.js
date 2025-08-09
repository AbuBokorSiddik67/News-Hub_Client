// src/hooks/useAdmin.js
import { useQuery } from "@tanstack/react-query"; // Tanstack Query for data fetching
import useAuth from "./useAuth"; // Your custom useAuth hook
import useAxiosSecure from "./useAxiosSecure"; // Your custom useAxiosSecure hook for authenticated requests

const useAdmin = () => {
	const { user, loading } = useAuth(); // Get current user and loading status from AuthContext
	const axiosSecure = useAxiosSecure(); // Get axios instance for secure requests

	// Use Tanstack Query to fetch admin status
	// queryKey: Unique key for caching this query data
	// enabled: This query will only run if 'loading' is false AND 'user?.email' exists
	//          This prevents the query from running before authentication status is known
	// queryFn: The function that performs the data fetching
	const { data: isAdmin, isPending: isAdminLoading } = useQuery({
		queryKey: [user?.email, "isAdmin"], // Query key includes user email for specificity
		enabled: !loading && !!user?.email, // Only enabled if user is loaded and has an email
		queryFn: async () => {
			// Send a GET request to your backend to check admin status
			// The backend route will typically look up the user's role by email
			const res = await axiosSecure.get(`/users/admin/${user.email}`); // Backend route: /users/admin/:email
			return res.data?.admin; // Assuming your backend returns { admin: true/false }
		},
		// Optional: Keep data fresh, refetch after a certain time if needed
		// staleTime: 1000 * 60 * 5, // e.g., 5 minutes
		// cacheTime: 1000 * 60 * 10, // e.g., 10 minutes
	});

	// Return isAdmin (boolean: true/false) and isAdminLoading (boolean: true/false)
	return [isAdmin, isAdminLoading];
};

export default useAdmin;
