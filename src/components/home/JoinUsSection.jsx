// src/components/sections/JoinUsSection.jsx
import React from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { FaEnvelope, FaPaperPlane } from "react-icons/fa"; // Icons

const JoinUsSection = () => {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm();

	const onSubmit = async (data) => {
		console.log("Newsletter subscription attempt:", data.email);

		try {
			// --- Replace this dummy logic with your actual API call ---
			// Example:
			// const res = await axiosPublic.post('/subscribe-newsletter', { email: data.email });
			// if (res.data.success) { ... } else { ... }

			// Dummy success simulation
			await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API call delay

			Swal.fire({
				icon: "success",
				title: "Subscription Successful!",
				text: "Thank you for subscribing to our newsletter. Stay tuned for the latest updates!",
				showConfirmButton: false,
				timer: 2500,
			});
			reset(); // Clear the form
		} catch (error) {
			console.error("Newsletter subscription failed:", error);
			Swal.fire({
				icon: "error",
				title: "Subscription Failed!",
				text:
					error.response?.data?.message ||
					"Something went wrong. Please try again later.",
			});
		}
	};

	return (
		// Enhanced Section Background with Gradient and subtle pattern overlay
		<section className="relative py-20 bg-gradient-to-br from-indigo-600 to-purple-700 dark:from-gray-900 dark:to-gray-950 text-white overflow-hidden shadow-2xl">
			{/* Subtle background pattern/texture */}
			<div className="absolute inset-0 z-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] dark:bg-[url('https://www.transparenttextures.com/patterns/dark-fish-skin.png')]"></div>

			{/* Optional: Add abstract shapes for dynamism */}
			<div className="absolute top-1/4 left-1/4 w-32 h-32 bg-yellow-300 opacity-[0.05] rounded-full blur-2xl transform rotate-45 animate-pulse-slow"></div>
			<div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-blue-300 opacity-[0.05] rounded-full blur-2xl transform -rotate-45 animate-pulse-fast"></div>

			<div className="container mx-auto px-6 relative z-10 text-center">
				<h2 className="text-4xl md:text-5xl font-extrabold mb-5 drop-shadow-lg leading-tight">
					Join Our{" "}
					<span className="text-teal-300 dark:text-teal-400">Community!</span>
				</h2>
				<p className="text-xl md:text-2xl mb-10 opacity-90 max-w-2xl mx-auto font-light">
					Subscribe to our newsletter to get the latest articles, exclusive
					content, and updates directly in your inbox. Never miss a story!
				</p>

				<form
					onSubmit={handleSubmit(onSubmit)}
					className="flex flex-col md:flex-row items-center justify-center gap-6 max-w-xl mx-auto"
				>
					<div className="relative w-full md:w-3/4">
						<FaEnvelope className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-300 text-lg" />
						<input
							type="email"
							id="email"
							{...register("email", {
								required: "Email is required",
								pattern: {
									value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
									message: "Invalid email address",
								},
							})}
							className="w-full pl-14 pr-6 py-4 rounded-full border-2 border-transparent bg-white bg-opacity-20 text-white placeholder-gray-200 text-lg focus:outline-none focus:ring-4 focus:ring-teal-400 focus:border-teal-400 transition-all duration-300 shadow-lg dark:bg-gray-700 dark:bg-opacity-50 dark:placeholder-gray-400"
							placeholder="Enter your email address"
						/>
						{errors.email && (
							<p className="absolute left-0 bottom-[-30px] text-red-200 dark:text-red-300 text-sm mt-1 ml-6 text-left font-medium">
								{errors.email.message}
							</p>
						)}
					</div>
					<button
						type="submit"
						className="w-full md:w-auto flex items-center justify-center px-10 py-4 bg-teal-400 text-gray-900 font-bold text-lg rounded-full shadow-xl hover:bg-teal-300 hover:scale-105 transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-teal-300/50"
					>
						<FaPaperPlane className="mr-3 text-xl" /> Subscribe Now
					</button>
				</form>
			</div>
		</section>
	);
};

export default JoinUsSection;
