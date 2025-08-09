import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../contexts/AuthProvider";

const PaymentHistory = () => {
	const { user, loading } = useContext(AuthContext);
	const [payments, setPayments] = useState([]);
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(true);

	const backendBaseUrl = "https://server-one-nu-23.vercel.app";

	useEffect(() => {
		const fetchPaymentHistory = async () => {
			if (!user || loading) {
				// If user is not logged in or still loading, do nothing
				setIsLoading(false);
				return;
			}

			try {
				// Get the user's email
				const userEmail = user.email;

				// Assume you have a way to get the JWT token (e.g., from local storage or context)
				// This is a placeholder, replace with your actual token retrieval logic
				const token = localStorage.getItem("access-token");

				if (!token) {
					setError("Authentication token not found. Please log in.");
					setIsLoading(false);
					return;
				}

				setIsLoading(true);
				const response = await axios.get(
					`${backendBaseUrl}/payments/${userEmail}`,
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);
				setPayments(response.data);
				setError("");
			} catch (err) {
				console.error("Error fetching payment history:", err);
				if (err.response) {
					// The request was made and the server responded with a status code
					// that falls out of the range of 2xx
					setError(
						err.response.data.message ||
							"Failed to fetch payment history from server."
					);
				} else if (err.request) {
					// The request was made but no response was received
					setError(
						"No response from server. Please check your network connection."
					);
				} else {
					// Something happened in setting up the request that triggered an Error
					setError(
						"An unexpected error occurred while fetching payment history."
					);
				}
				setPayments([]); // Clear previous payments on error
			} finally {
				setIsLoading(false);
			}
		};

		fetchPaymentHistory();
	}, [user, loading, backendBaseUrl]);
	if (isLoading) {
		return <div className="text-center py-8">Loading payment history...</div>;
	}

	if (error) {
		return <div className="text-center text-red-500 py-8">Error: {error}</div>;
	}

	if (!user) {
		return (
			<div className="text-center py-8">
				Please log in to view your payment history.
			</div>
		);
	}

	return (
		<div className="container mx-auto p-4">
			<h2 className="text-2xl font-bold mb-4 text-center">
				My Payment History
			</h2>
			{payments.length === 0 ? (
				<p className="text-center text-gray-600">No payment history found.</p>
			) : (
				<div className="overflow-x-auto">
					<table className="min-w-full bg-white border border-gray-200">
						<thead>
							<tr>
								<th className="py-2 px-4 border-b">Transaction ID</th>
								<th className="py-2 px-4 border-b">Amount (USD)</th>
								<th className="py-2 px-4 border-b">Payment Purpose</th>
								<th className="py-2 px-4 border-b">Payment Date</th>
							</tr>
						</thead>
						<tbody>
							{payments.map((payment, index) => (
								<tr key={payment._id || index} className="hover:bg-gray-50">
									<td className="py-2 px-4 border-b text-center">
										{payment.transactionId}
									</td>
									<td className="py-2 px-4 border-b text-center">
										${(payment.amount / 100).toFixed(2)}
									</td>{" "}
									{/* Amount in cents to dollars */}
									<td className="py-2 px-4 border-b text-center">
										{payment.paymentPurpose}
									</td>
									<td className="py-2 px-4 border-b text-center">
										{new Date(payment.paymentDate).toLocaleDateString()}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
};

export default PaymentHistory;
