// src/pages/admin/AddPublisher.jsx (সাধারণত admin ফোল্ডারের ভেতরে থাকে)
import React from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure"; // Your custom axios instance for secure API calls
import { FaPlusSquare } from "react-icons/fa"; // Icon for the form title

const AddPublisher = () => {
	const axiosSecure = useAxiosSecure();
	const {
		register,
		handleSubmit,
		reset, // To clear the form after successful submission
		formState: { errors },
	} = useForm();

	const onSubmit = async (data) => {
		const publisherData = {
			publisher: data.publisherName, // Field from the form
			// You can add other fields if your publisher schema has them, e.g.,
			// website: data.website,
			logo: data.logoUrl,
		};

		try {
			// Send a POST request to your backend to add the new publisher
			const res = await axiosSecure.post("/publishers", publisherData); // Assuming your publisher endpoint is /publishers

			if (res.data.insertedId) {
				// Check for insertedId from MongoDB result
				Swal.fire({
					icon: "success",
					title: "Publisher Added!",
					text: `${data.publisherName} has been added successfully.`,
					showConfirmButton: false,
					timer: 1500,
				});
				reset(); // Clear the form fields
			} else {
				Swal.fire({
					icon: "error",
					title: "Failed to Add Publisher!",
					text: res.data.message || "Something went wrong. Please try again.",
				});
			}
		} catch (err) {
			console.error("Error adding publisher:", err);
			// Check for duplicate key error (e.g., if publisher name must be unique)
			if (err.response && err.response.status === 409) {
				// Assuming 409 Conflict for duplicates
				Swal.fire({
					icon: "warning",
					title: "Publisher Already Exists!",
					text: "A publisher with this name already exists. Please use a different name.",
				});
			} else {
				Swal.fire({
					icon: "error",
					title: "Error!",
					text:
						err.response?.data?.message ||
						"An error occurred while adding the publisher.",
				});
			}
		}
	};

	return (
		<div className="container mx-auto p-4 sm:p-6 lg:p-8 bg-white rounded-lg shadow-md min-h-[calc(100vh-80px)]">
			<h2 className="text-3xl font-bold text-gray-800 mb-6 text-center flex items-center justify-center">
				<FaPlusSquare className="mr-3 text-green-600" /> Add New Publisher
			</h2>

			<form
				onSubmit={handleSubmit(onSubmit)}
				className="space-y-6 max-w-xl mx-auto"
			>
				{/* Publisher Name Field */}
				<div>
					<label
						htmlFor="publisherName"
						className="block text-sm font-medium text-gray-700 mb-1"
					>
						Publisher Name
					</label>
					<input
						type="text"
						id="publisherName"
						{...register("publisherName", {
							required: "Publisher name is required",
						})}
						className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
						placeholder="Enter publisher name"
					/>
					{errors.publisherName && (
						<p className="text-red-500 text-xs mt-1">
							{errors.publisherName.message}
						</p>
					)}
				</div>

				{/* Optional: Add other fields for publisher if your schema supports it */}
				{/*
                <div>
                    <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">Website URL (Optional)</label>
                    <input
                        type="url"
                        id="website"
                        {...register('website')}
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                        placeholder="e.g., https://example.com"
                    />
                </div>
                    */}
				<div>
					<label
						htmlFor="logoUrl"
						className="block text-sm font-medium text-gray-700 mb-1"
					>
						Logo URL (Optional)
					</label>
					<input
						type="url"
						id="logoUrl"
						{...register("logoUrl")}
						className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
						placeholder="e.g., https://example.com/logo.png"
					/>
				</div>

				{/* Submit Button */}
				<div className="flex justify-center">
					<button
						type="submit"
						className="w-full sm:w-auto px-6 py-3 bg-green-600 text-white font-medium rounded-md shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
					>
						Add Publisher
					</button>
				</div>
			</form>
		</div>
	);
};

export default AddPublisher;
