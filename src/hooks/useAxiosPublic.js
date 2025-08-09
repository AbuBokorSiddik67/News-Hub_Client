// src/hooks/useAxiosPublic.js
import axios from "axios";

// Create an Axios instance for public (non-authenticated) requests
// The baseURL should point to your backend server
const axiosPublic = axios.create({
    baseURL: import.meta.env.VITE_SERVER_BASE_URL, // Get base URL from environment variable
});

const useAxiosPublic = () => {
    return axiosPublic; // Return the configured public axios instance
};

export default useAxiosPublic;