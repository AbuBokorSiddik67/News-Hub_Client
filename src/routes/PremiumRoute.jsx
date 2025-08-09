import React from "react";
import { useLocation } from "react-router";
import useIsPremium from "../hooks/useIsPremium";
import LoadingSpinner from "../components/shared/LoadingSpinner";

const PremiumRoute = ({ children }) => {
	const { isPremium, isPremiumLoading } = useIsPremium();
	const location = useLocation();

	if (isPremiumLoading) {
		return <LoadingSpinner />;
	}

	if (isPremium) {
		return children;
	}

	return <Navigate to="/subscription" state={{ from: location }} replace />;
};

export default PremiumRoute;
