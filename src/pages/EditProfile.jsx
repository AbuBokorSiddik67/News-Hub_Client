// src/pages/EditProfile.jsx
import React from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import useAuth from "../hooks/useAuth"; // Your custom authentication hook
import LoadingSpinner from "../components/shared/LoadingSpinner"; // Your loading spinner component
// Import useAxiosPublic specifically for image upload to ImageBB
import useAxiosPublic from "../hooks/useAxiosPublic"; // For public API calls like ImageBB
import useAxiosSecure from "../hooks/useAxiosSecure"; // For updating user data in your DB if needed
import { FaUserEdit } from "react-icons/fa"; // Icon for the form title

// Your ImageBB API Key (replace with your actual key from .env or config)
const imageHostingKey = import.meta.env.VITE_IMAGE_HOSTING_KEY;
// console.log("Image Hosting Key:", imageHostingKey); // For debugging: check if key is loaded correctly
const imageHostingApi = `https://api.imgbb.com/1/upload?key=${imageHostingKey}`;

const EditProfile = () => {
	const { user, loading, updateUserProfile, setUser } = useAuth();
	// Use axiosPublic for ImageBB upload
	const axiosPublic = useAxiosPublic();
	// Use axiosSecure for database updates (if any)
	const axiosSecure = useAxiosSecure();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: {
			name: user?.displayName || "",
		},
	});

	if (loading) {
		return <LoadingSpinner />;
	}

	if (!user) {
		return (
			<div className="flex justify-center items-center h-[calc(100vh-80px)] text-xl text-red-500">
				Please log in to edit your profile.
			</div>
		);
	}

	const onSubmit = async (data) => {
		let photoURL = user.photoURL; // Start with current photoURL

		// Check if a new image file is provided
		if (data.image && data.image.length > 0) {
			const formData = new FormData(); // Explicitly create FormData
			formData.append("image", data.image[0]);

			try {
				// Use axiosPublic for ImageBB upload
				const res = await axiosPublic.post(imageHostingApi, formData, {
					headers: {
						"content-type": "multipart/form-data",
					},
				});

				if (res.data.success) {
					photoURL = res.data.data.display_url;
				} else {
					Swal.fire({
						icon: "error",
						title: "Image Upload Failed!",
						text:
							res.data.error?.message || "Could not upload new profile image.",
					});
					return;
				}
			} catch (imageUploadError) {
				console.error(
					"Image upload error:",
					imageUploadError.response?.data || imageUploadError.message
				);
				Swal.fire({
					icon: "error",
					title: "Image Upload Error!",
					text:
						imageUploadError.response?.data?.error?.message ||
						"Failed to upload new profile image. Please try again.",
				});
				return;
			}
		}

		try {
			// Update user profile in Firebase Auth
			await updateUserProfile(data.name, photoURL);

			// OPTIONAL: If you store user data (like name, photoURL) in your MongoDB backend,
			// you should also update it there. This is important to keep backend and frontend in sync.
			// Use axiosSecure for this, as it's a user-specific data update.
			const updateDoc = {
				displayName: data.name, // Ensure your backend expects 'displayName' or 'name' consistently
				photoURL: photoURL,
			};
			const updateRes = await axiosSecure.patch(
				`/users/${user.email}`, // Assuming your backend updates by email
				updateDoc
			);

			if (updateRes.data.modifiedCount > 0) {
				// Update user state in AuthContext after successful update in Firebase and DB
				setUser({ ...user, displayName: data.name, photoURL: photoURL });

				Swal.fire({
					position: "center",
					icon: "success",
					title: "Profile Updated Successfully!",
					showConfirmButton: false,
					timer: 1500,
				});
			} else {
				// If Firebase update was successful but DB update wasn't, still show success for Firebase
				// but log/alert if DB update failed.
				console.warn(
					"User profile updated in Firebase, but no change detected in DB or DB update failed."
				);
				Swal.fire({
					position: "center",
					icon: "success",
					title: "Profile Updated Successfully!",
					text: "Some changes might not be reflected in our records if backend update failed.",
					showConfirmButton: false,
					timer: 2500,
				});
			}
		} catch (updateError) {
			console.error("Error updating profile (Firebase/DB):", updateError);
			Swal.fire({
				icon: "error",
				title: "Update Failed!",
				text:
					updateError.message ||
					"An error occurred while updating your profile.",
			});
		}
	};

	return (
		<div className="min-h-[calc(100vh-80px)] bg-gray-100 p-4 sm:p-6 lg:p-8 flex justify-center items-center">
			<div className="max-w-xl w-full bg-white rounded-lg shadow-xl overflow-hidden p-6 sm:p-8">
				<h2 className="text-3xl font-bold text-gray-800 mb-6 text-center flex items-center justify-center">
					<FaUserEdit className="mr-3 text-blue-600" /> Edit Your Profile
				</h2>

				<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
					{/* Current Profile Picture */}
					<div className="text-center mb-4">
						<label className="block text-gray-700 text-sm font-bold mb-2">
							Current Profile Picture
						</label>
						{user.photoURL ? (
							<img
								src={user.photoURL}
								alt="Current User Avatar"
								className="w-24 h-24 rounded-full mx-auto object-cover border-2 border-blue-300 shadow-sm"
							/>
						) : (
							<div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-3xl font-bold mx-auto border-2 border-gray-300">
								{user.displayName ? user.displayName[0].toUpperCase() : "U"}
							</div>
						)}
						<p className="text-sm text-gray-500 mt-2">Current Image</p>
					</div>

					{/* Name Field */}
					<div>
						<label
							htmlFor="name"
							className="block text-gray-700 text-sm font-bold mb-2"
						>
							Your Name
						</label>
						<input
							type="text"
							id="name"
							{...register("name", { required: "Name is required" })}
							className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="Enter your name"
						/>
						{errors.name && (
							<p className="text-red-500 text-xs italic mt-1">
								{errors.name.message}
							</p>
						)}
					</div>

					{/* Email Field (Non-editable) */}
					<div>
						<label
							htmlFor="email"
							className="block text-gray-700 text-sm font-bold mb-2"
						>
							Email
						</label>
						<input
							type="email"
							id="email"
							value={user.email || ""} // Display current email
							readOnly // Make it non-editable
							className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-500 bg-gray-100 leading-tight focus:outline-none cursor-not-allowed"
						/>
						<p className="text-xs text-gray-500 mt-1">
							Email cannot be changed directly.
						</p>
					</div>

					{/* New Profile Picture Upload */}
					<div>
						<label
							htmlFor="image"
							className="block text-gray-700 text-sm font-bold mb-2"
						>
							New Profile Picture (Optional)
						</label>
						<input
							type="file"
							id="image"
							{...register("image")} // No required validation as it's optional
							accept="image/*"
							className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 block w-full text-gray-700"
						/>
						<p className="text-xs text-gray-500 mt-1">
							Upload a new image to change your profile picture.
						</p>
					</div>

					{/* Submit Button */}
					<div className="flex justify-center">
						<button
							type="submit"
							className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg focus:outline-none focus:shadow-outline transition-colors duration-300 text-lg inline-flex items-center"
						>
							<FaUserEdit className="mr-2" /> Save Changes
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default EditProfile;
