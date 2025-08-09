import useAuth from "./useAuth"; // Assuming you have a useAuth hook that provides user and loading state
import useAxiosSecure from "./useAxiosSecure"; // Assuming you have a useAxiosSecure hook for authenticated requests
import { useQuery } from "@tanstack/react-query";

const useIsPremium = () => {
	const { user, loading } = useAuth(); // Get user and loading state from your auth context/hook
	const axiosSecure = useAxiosSecure(); // Get your axiosSecure instance

	const {
		data: isPremium = false, // Default to false if data is not available
		isLoading: isPremiumLoading,
		isError: isPremiumError,
		error: premiumError,
	} = useQuery({
		queryKey: [user?.email, "isPremium"], // Unique query key for this user's premium status
		// Query is enabled only if user is not loading and user's email is available
		enabled: !loading && !!user?.email,
		queryFn: async () => {
			if (!user?.email) {
				// If for some reason email is null despite enabled: true, prevent API call
				return false;
			}
			try {
				// Send a GET request to your backend to check premium status
				// You'll need a new backend endpoint, e.g., /users/premium/:email
				const res = await axiosSecure.get(`/users/premium/${user.email}`);
				// Assuming your backend returns { isPremium: true/false }
				return res.data?.isPremium;
			} catch (err) {
				console.error("Error fetching premium status:", err);
				// Handle 403 or other errors specifically if needed
				return false; // Default to false on error
			}
		},
		// Optional: Keep data fresh for a certain time to avoid excessive API calls
		// staleTime: 1000 * 60 * 10, // Data considered fresh for 10 minutes
		// cacheTime: 1000 * 60 * 30, // Cached data kept for 30 minutes
	});

	return { isPremium, isPremiumLoading, isPremiumError, premiumError };
};

export default useIsPremium;