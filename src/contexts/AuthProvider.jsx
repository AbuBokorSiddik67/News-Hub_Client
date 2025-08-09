// src/contexts/AuthProvider.jsx
import { createContext, useEffect, useState } from "react";
import {
	GoogleAuthProvider,
	createUserWithEmailAndPassword,
	onAuthStateChanged,
	signInWithEmailAndPassword,
	signInWithPopup,
	signOut,
	updateProfile,
} from "firebase/auth";
import auth from "../utils/firebase"; // Your Firebase app initialization
import useAxiosPublic from "../hooks/useAxiosPublic"; // Your axiosPublic instance

// Create a context for authentication information
export const AuthContext = createContext(null);
const googleProvider = new GoogleAuthProvider(); // Google Auth Provider for Firebase

const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null); // State to hold the current authenticated user
	const [loading, setLoading] = useState(true); // State to indicate if auth state is loading
	const axiosPublic = useAxiosPublic(); // Get the public Axios instance

	// 1. Function to create a new user with email and password
	const createUser = (email, password) => {
		setLoading(true); // Set loading to true before auth operation
		return createUserWithEmailAndPassword(auth, email, password);
	};

	// 2. Function to sign in a user with email and password
	const signIn = (email, password) => {
		setLoading(true); // Set loading to true
		return signInWithEmailAndPassword(auth, email, password);
	};

	// 3. Function to sign in with Google
	const googleSignIn = () => {
		setLoading(true); // Set loading to true
		return signInWithPopup(auth, googleProvider);
	};

	// 4. Function to update user profile (displayName and photoURL)
	const updateUserProfile = (name, photo) => {
		return updateProfile(auth.currentUser, {
			displayName: name,
			photoURL: photo,
		});
	};

	// 5. Function to log out the current user
	const logOut = () => {
		setLoading(true); // Set loading to true
		return signOut(auth);
	};

	// 6. Observe user authentication state changes (Firebase's onAuthStateChanged)
	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
			setUser(currentUser); // Update user state with the current user
			if (currentUser) {
				// If user is logged in, get JWT token from your backend
				const userInfo = { email: currentUser.email };
				axiosPublic
					.post("/jwt", userInfo) // Send user email to backend to get JWT
					.then((res) => {
						if (res.data.token) {
							localStorage.setItem("access-token", res.data.token); // Store token in local storage
						}
					})
					.catch((error) => {
						console.error("Error getting JWT:", error);
						localStorage.removeItem("access-token"); // Clear token on error
					});
			} else {
				// If user logs out or is not logged in, remove token from local storage
				localStorage.removeItem("access-token");
			}
			setLoading(false); // Set loading to false once auth state is determined
		});

		// Cleanup function to unsubscribe from the listener when component unmounts
		return () => {
			unsubscribe();
		};
	}, [axiosPublic]); // Dependency array: re-run effect if axiosPublic changes (unlikely for a static baseURL)

	// Object containing all authentication information and functions
	const authInfo = {
		user,
		setUser,
		loading,
		createUser,
		signIn,
		googleSignIn,
		updateUserProfile,
		logOut,
	};

	// Provide the authInfo object to all children components
	return (
		<AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
	);
};

export default AuthProvider;
