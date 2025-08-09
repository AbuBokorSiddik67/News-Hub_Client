// PaymentPage.jsx
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import { Helmet } from "react-helmet";

const PaymentPage = () => {
	const location = useLocation();
	const navigate = useNavigate();

	const searchParams = new URLSearchParams(location.search);
	const period = searchParams.get("period");

	useEffect(() => {
		const updateSubscription = async () => {
			const now = new Date();

			let expiryDate = new Date(now);

			if (period === "1m") expiryDate.setMinutes(now.getMinutes() + 1);
			else if (period === "5d") expiryDate.setDate(now.getDate() + 5);
			else if (period === "10d") expiryDate.setDate(now.getDate() + 10);

			try {
				await axios.patch("https://server-one-nu-23.vercel.app/users/premium", {
					premiumTaken: expiryDate,
				});

				alert("Subscription Successful!");
				navigate("/");
			} catch (err) {
				console.error("Error updating subscription", err);
			}
		};

		updateSubscription();
	}, [period, navigate]);

	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-100">
			<Helmet>
				<title>Payment-Page</title>
			</Helmet>
			<div className="text-center">
				<h1 className="text-3xl font-bold text-gray-800">
					Processing Payment...
				</h1>
				<p className="text-gray-600 mt-2">
					Please wait while we confirm your subscription.
				</p>
			</div>
		</div>
	);
};

export default PaymentPage;
