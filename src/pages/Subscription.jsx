import React from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
// import Swal from 'sweetalert2'; // sweetalert2 আর দরকার নেই, তাই এটি কমেন্ট আউট বা ডিলিট করা যেতে পারে

const Subscription = () => {
	const navigate = useNavigate();

	// Define subscription plans with details
	const subscriptionPlans = [
		{
			id: "1m",
			name: "Basic Plan (1 Minute)",
			price: 1, // $1 for 1 minute testing
			features: [
				"Access to limited premium articles",
				"Perfect for testing features",
				"No long-term commitment",
			],
			durationLabel: "1 Minute",
			buttonLabel: "Get Started (Test)",
			bgColor: "bg-blue-100 dark:bg-blue-900",
			textColor: "text-blue-800 dark:text-blue-200",
			buttonColor: "bg-blue-600 hover:bg-blue-700",
		},
		{
			id: "5d",
			name: "Standard Plan (5 Days)",
			price: 50, // $50 for 5 days
			features: [
				"Full access to all premium articles",
				"In-depth analysis & exclusive content",
				"Email support",
				"Early access to new features",
			],
			durationLabel: "5 Days",
			buttonLabel: "Subscribe Now",
			bgColor: "bg-green-100 dark:bg-green-900",
			textColor: "text-green-800 dark:text-green-200",
			buttonColor: "bg-green-600 hover:bg-green-700",
		},
		{
			id: "10d",
			name: "Pro Plan (10 Days)",
			price: 80, // $80 for 10 days
			features: [
				"Everything in Standard Plan",
				"Priority support",
				"Exclusive webinars & events",
				"Offline reading access (future)",
				"Personalized content recommendations",
			],
			durationLabel: "10 Days",
			buttonLabel: "Go Pro",
			bgColor: "bg-purple-100 dark:bg-purple-900",
			textColor: "text-purple-800 dark:text-purple-200",
			buttonColor: "bg-purple-600 hover:bg-purple-700",
		},
	];

	const handleChoosePlan = (planId, price) => {
		// সরাসরি /subscription পেজে নেভিগেট করা হবে, কোনো SweetAlert ছাড়াই।
		// period এবং price কোয়েরি প্যারামিটার হিসাবে পাস করা হবে।
		navigate(`/subscription?period=${planId}&price=${price}`);
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-500 to-teal-400 dark:from-gray-800 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
			<Helmet>
				<title>Subscription</title>
			</Helmet>
			{/* Banner Section */}
			<div className="text-center mb-16">
				<h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 animate-fade-in-down">
					Choose Your Premium Experience
				</h1>
				<p className="text-xl text-white max-w-3xl mx-auto leading-relaxed animate-fade-in-up">
					Unlock exclusive content, in-depth analysis, and an ad-free reading
					experience. Select the plan that's right for you!
				</p>
			</div>

			{/* Subscription Plans Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
				{subscriptionPlans.map((plan) => (
					<div
						key={plan.id}
						className={`flex flex-col ${plan.bgColor} rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border border-gray-200 dark:border-gray-700`}
					>
						<div className="p-8 text-center flex-grow">
							<h2 className={`text-3xl font-bold mb-4 ${plan.textColor}`}>
								{plan.name}
							</h2>
							<p className="text-5xl font-extrabold mb-2 text-gray-900 dark:text-white">
								${plan.price}
								<span className="text-xl font-normal text-gray-600 dark:text-gray-400">
									/{plan.durationLabel}
								</span>
							</p>
							<p className="text-gray-700 dark:text-gray-300 mb-6">
								Billed{" "}
								{plan.durationLabel === "1 Minute"
									? "once"
									: "every " + plan.durationLabel.toLowerCase()}
							</p>
							<ul className="text-left space-y-3 text-gray-700 dark:text-gray-300 mb-8">
								{plan.features.map((feature, index) => (
									<li key={index} className="flex items-center">
										<svg
											className="w-5 h-5 text-green-500 mr-2"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth="2"
												d="M5 13l4 4L19 7"
											></path>
										</svg>
										{feature}
									</li>
								))}
							</ul>
						</div>
						<div className="p-6 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
							<button
								onClick={() => handleChoosePlan(plan.id, plan.price)} // plan.id এবং plan.price সরাসরি পাস করা হচ্ছে
								className={`w-full ${plan.buttonColor} text-white py-3 px-6 rounded-lg font-semibold text-lg shadow-md transition-transform duration-300 transform hover:scale-105`}
							>
								{plan.buttonLabel}
							</button>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default Subscription;
