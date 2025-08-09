// src/hooks/useAxiosSecure.js
import axios from "axios";
import { useNavigate } from "react-router-dom"; // For programmatic navigation
import useAuth from "./useAuth"; // Your custom useAuth hook for logout

// Create an Axios instance for secured requests
// The baseURL should point to your backend server
const axiosSecure = axios.create({
    baseURL: import.meta.env.VITE_SERVER_BASE_URL, // Get base URL from environment variable
});

const useAxiosSecure = () => {
    const { logOut } = useAuth(); // Get the logOut function from AuthContext
    const navigate = useNavigate(); // Get the navigate function from React Router DOM

    // Request Interceptor: Intercepts outgoing requests to add the JWT token
    axiosSecure.interceptors.request.use(
        function (config) {
            const token = localStorage.getItem('access-token'); // Retrieve token from local storage
            if (token) {
                config.headers.authorization = `Bearer ${token}`; // Add token to Authorization header
            }
            return config; // Return the modified config
        },
        function (error) {
            // Do something with request error
            return Promise.reject(error); // Pass the error along
        }
    );

    // Response Interceptor: Intercepts responses to handle 401/403 errors (unauthorized/forbidden)
    axiosSecure.interceptors.response.use(
        function (response) {
            return response; // If response is successful, just return it
        },
        async function (error) {
            const status = error.response?.status; // Get the HTTP status code from the error response

            // If status is 401 (Unauthorized) or 403 (Forbidden)
            // This usually means the JWT token is expired, invalid, or the user doesn't have permission
            if (status === 401 || status === 403) {
                await logOut(); // Log out the user (clears Firebase session and local storage token)
                navigate('/login'); // Redirect to the login page
            }
            return Promise.reject(error); // Re-throw the error for further handling in the component
        }
    );

    return axiosSecure; // Return the configured axios instance
};

export default useAxiosSecure;