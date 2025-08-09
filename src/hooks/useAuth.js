// src/hooks/useAuth.js
import { useContext } from "react"; // React hook for context
import { AuthContext } from "../contexts/AuthProvider"; // Your AuthContext

const useAuth = () => {
	// useContext hook to access the value provided by AuthContext.Provider
	// AuthContext holds user, loading state, and auth functions (createUser, signIn, etc.)
	const auth = useContext(AuthContext);
	return auth; // Returns the entire authInfo object
};

export default useAuth;
