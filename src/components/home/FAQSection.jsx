import React, { useState } from "react";
import { FaPlus, FaMinus, FaQuestionCircle } from "react-icons/fa"; // Icons for expand/collapse and title

const faqData = [
	{
		question: "How can I submit an article to NewsHub?",
		answer:
			"To submit an article, you need to first register and log in to your account. Once logged in, navigate to the 'Dashboard' and then select 'Add Article'. Fill in the required details and submit your article for review by our editorial team.",
	},
	{
		question: "What is the process for article approval?",
		answer:
			"Once you submit an article, it goes into a 'Pending' status. Our administrators will review your article for quality, relevance, and adherence to our guidelines. If approved, its status will change to 'Approved' and it will be published. If declined, you will be notified.",
	},
	{
		question: "Can I edit my article after submission?",
		answer:
			"Yes, you can edit your articles. Go to your 'Dashboard', then 'My Articles'. From there, you can find the option to edit your submitted articles. Please note that major edits might trigger another review process.",
	},
	{
		question: "How do I subscribe to premium content?",
		answer:
			"NewsHub offers premium content for subscribers. You can find subscription options on our 'Subscription' page. Choose a plan that suits you, complete the payment, and enjoy exclusive articles and features.",
	},
	{
		question: "Is there a way to contact support?",
		answer:
			"Yes, if you have any questions, issues, or feedback, you can contact our support team via the 'Contact Us' page. We strive to respond to all inquiries as quickly as possible.",
	},
	{
		question: "How often is new content published?",
		answer:
			"We strive to publish new and engaging content daily across various categories. Keep an eye on our 'Latest Articles' section for the newest updates.",
	},
];

const FAQSection = () => {
	const [activeIndex, setActiveIndex] = useState(null); // State to manage which FAQ item is open

	const toggleAccordion = (index) => {
		setActiveIndex(activeIndex === index ? null : index);
	};

	return (
		// The background and padding of this section are now handled by the parent Home.jsx,
		// making this component more reusable and focused on its content.
		<div>
			{" "}
			{/* Removed section tag specific bg here */}
			<div className="container mx-auto px-6">
				{" "}
				{/* Increased horizontal padding */}
				<h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 dark:text-white text-center mb-16 relative">
					<FaQuestionCircle className="text-blue-600 dark:text-blue-400 text-5xl md:text-6xl mb-4 mx-auto animate-pulse-slow" />{" "}
					{/* Larger icon, pulse animation */}
					<span className="relative z-10 tracking-tight pb-3 border-b-4 border-blue-500 dark:border-blue-400">
						{" "}
						{/* Line under heading */}
						Frequently Asked Questions
					</span>
					<p className="text-lg font-normal text-gray-600 dark:text-gray-400 mt-4 max-w-2xl mx-auto">
						Find quick answers to the most common questions about NewsHub.
					</p>
				</h2>
				<div className="max-w-4xl mx-auto space-y-6">
					{" "}
					{/* Increased max-width and space-y */}
					{faqData.map((item, index) => (
						<div
							key={index}
							className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700
                                       group" // Added group for hover effects on children
						>
							<button
								className="flex justify-between items-center w-full p-6 md:p-7 text-xl font-bold text-left text-gray-800 dark:text-white bg-white dark:bg-gray-800
                                           hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600 rounded-t-2xl"
								onClick={() => toggleAccordion(index)}
							>
								<span>{item.question}</span>
								{activeIndex === index ? (
									<FaMinus className="text-blue-600 dark:text-blue-400 text-2xl transform rotate-180 transition-transform duration-300" /> // Rotate effect
								) : (
									<FaPlus className="text-blue-600 dark:text-blue-400 text-2xl transition-transform duration-300" />
								)}
							</button>
							<div
								className={`transition-all duration-300 ease-in-out overflow-hidden ${
									activeIndex === index
										? "max-h-screen opacity-100 border-t border-gray-200 dark:border-gray-700" // Added border-t for visual separation
										: "max-h-0 opacity-0"
								}`}
								style={{
									transitionProperty: "max-height, opacity",
								}}
							>
								<div className="p-6 md:p-7 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-900 leading-relaxed">
									{" "}
									{/* Enhanced text styles */}
									{item.answer}
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default FAQSection;
