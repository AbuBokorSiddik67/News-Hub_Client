// src/pages/SubscriptionPage.jsx
import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const SubscriptionPage = () => {
	const navigate = useNavigate();
	const [selectedPeriod, setSelectedPeriod] = useState("");

	const subscriptionPlans = [
		{ id: "1m", name: "1 Month", price: 0.5 },
		{ id: "5d", name: "5 Days", price: 5.0 },
		{ id: "10d", name: "10 Days", price: 10.0 },
	];

	const handlePeriodChange = (e) => {
		setSelectedPeriod(e.target.value);
	};

	const handleProceedToPayment = () => {
		const plan = subscriptionPlans.find((p) => p.id === selectedPeriod);

		if (plan) {
			navigate(
				`/payment-process?amount=${plan.price}&paymentFor=subscription&itemId=${plan.id}`
			);
		} else {
			Swal.fire({
				icon: "warning",
				title: "No Period Selected",
				text: "Please select a subscription period to proceed.",
				confirmButtonText: "OK",
			});
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
			<Helmet>
				<title>Subscription-Page</title>
			</Helmet>
			<div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md">
				<h2 className="text-2xl font-semibold text-center text-gray-800 dark:text-white mb-6">
					Unlock a World of Premium Content
				</h2>
				<p className="text-center text-lg text-gray-600 dark:text-gray-300 mb-10">
					Subscribe to Premium Articles for Deeper Analysis, In Depth Stories,
					and Unfiltered Perspectives. Elevate Your News Experience Today
				</p>

				<div className="space-y-6">
					<h3 className="text-xl font-medium text-gray-700 dark:text-gray-200">
						Select Your Subscription Period
					</h3>
					<div className="mb-4">
						<label
							htmlFor="period-select"
							className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
						>
							Choose a Period:
						</label>
						<select
							id="period-select"
							value={selectedPeriod}
							onChange={handlePeriodChange}
							className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-white dark:border-gray-600"
						>
							<option value="">-- Select Period --</option>
							{subscriptionPlans.map((plan) => (
								<option key={plan.id} value={plan.id}>
									{plan.name} - ${plan.price.toFixed(2)}
								</option>
							))}
						</select>
					</div>
					<button
						onClick={handleProceedToPayment}
						disabled={!selectedPeriod}
						className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						Proceed to Payment
					</button>
				</div>
			</div>
		</div>
	);
};

export default SubscriptionPage;
