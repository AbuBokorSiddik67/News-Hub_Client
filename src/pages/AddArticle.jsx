// src/pages/AddArticle.jsx
import { useForm } from "react-hook-form"; // React Hook Form for form handling
import Swal from "sweetalert2"; // SweetAlert2 for notifications
import useAuth from "../hooks/useAuth"; // Your custom useAuth hook for current user info
import useAxiosSecure from "../hooks/useAxiosSecure"; // Your axiosSecure instance for authenticated requests
import useAxiosPublic from "../hooks/useAxiosPublic"; // Your axiosPublic instance to fetch publishers (might be public)
import { useQuery } from "@tanstack/react-query"; // Tanstack Query for fetching publishers
import LoadingSpinner from "../components/shared/LoadingSpinner"; // Your Loading Spinner
import ReactDatePicker from "react-datepicker"; // For date picker
import "react-datepicker/dist/react-datepicker.css"; // Datepicker styles
import { useState } from "react";
import Select from "react-select"; // For a more user-friendly select dropdown
import Resizer from "react-image-file-resizer"; // For image resizing (optional but good practice)
import { Helmet } from "react-helmet";

const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY; // Your image hosting API key
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`; // Image hosting API endpoint

const AddArticle = () => {
	const { user } = useAuth(); // Get current logged-in user
	const axiosSecure = useAxiosSecure(); // Axios instance for authenticated requests
	const axiosPublic = useAxiosPublic(); // Axios instance for public requests (e.g., fetching publishers)

	const [selectedDate, setSelectedDate] = useState(new Date()); // State for the selected date
	const [selectedPublisher, setSelectedPublisher] = useState(null); // State for selected publisher

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm();

	// Fetch publishers for the dropdown using Tanstack Query
	const {
		data: publishers = [],
		isLoading: publishersLoading,
		isError: publishersError,
	} = useQuery({
		queryKey: ["publishers"],
		queryFn: async () => {
			const res = await axiosPublic.get("/publishers"); // Assuming /publishers is a public endpoint
			return res.data;
		},
		staleTime: 1000 * 60 * 60, // Cache for 1 hour
	});

	if (publishersLoading) {
		return <LoadingSpinner />;
	}

	if (publishersError) {
		return (
			<div className="text-center text-red-500">
				Error loading publishers. Please try again later.
			</div>
		);
	}

	// Format publishers for react-select
	const publisherOptions = publishers.map((publisher) => ({
		value: publisher.publisher,
		label: publisher.publisher,
	}));

	// Function to resize and upload image to image hosting service (e.g., imgbb)
	const uploadImage = async (imageFile) => {
		return new Promise((resolve, reject) => {
			Resizer.imageFileResizer(
				imageFile,
				1200, // Max width
				800, // Max height
				"JPEG", // Compress format
				80, // Quality (0-100)
				0, // Rotation
				async (uri) => {
					try {
						const imageFormData = new FormData();
						imageFormData.append("image", uri); // Append resized image

						const res = await axiosPublic.post(
							image_hosting_api,
							imageFormData,
							{
								headers: {
									"Content-Type": "multipart/form-data",
								},
							}
						);
						resolve(res.data.data.display_url); // Return the hosted image URL
					} catch (error) {
						console.error("Image upload error:", error);
						reject("Failed to upload image. Please try again.");
					}
				},
				"blob" // Output type: blob
			);
		});
	};

	// Handle article submission
	const onSubmit = async (data) => {
		if (!selectedPublisher) {
			Swal.fire({
				icon: "error",
				title: "Validation Error",
				text: "Please select a publisher.",
				position: "top-end",
				showConfirmButton: false,
				timer: 1500,
			});
			return;
		}

		// Check if an image file is selected
		const imageFile = data.image[0];
		if (!imageFile) {
			Swal.fire({
				icon: "error",
				title: "Validation Error",
				text: "Please select an image for the article.",
				position: "top-end",
				showConfirmButton: false,
				timer: 1500,
			});
			return;
		}

		Swal.fire({
			title: "Submitting Article...",
			text: "Please wait, your article is being added.",
			allowOutsideClick: false,
			showConfirmButton: false,
			didOpen: () => {
				Swal.showLoading();
			},
		});

		try {
			// Upload image to image hosting service
			const imageUrl = await uploadImage(imageFile);

			// Prepare article data for the backend
			const articleData = {
				title: data.title,
				image: imageUrl,
				publisher: selectedPublisher.value, // Get value from react-select
				tags: data.tags.split(",").map((tag) => tag.trim()), // Split tags by comma and trim whitespace
				description: data.description,
				isPremium: data.isPremium, // Checkbox value
				postedDate: selectedDate.toISOString(), // Convert date to ISO string
				authorEmail: user?.email, // Author's email from authenticated user
				authorName: user?.displayName, // Author's name
				viewCount: 0, // Initial view count
				status: "pending", // Default status for new articles
			};

			// Send article data to your backend
			const res = await axiosSecure.post("/articles", articleData);

			if (res.data.insertedId) {
				Swal.fire({
					icon: "success",
					title: "Article Submitted!",
					text: "Your article has been submitted successfully and is awaiting review.",
					position: "top-end",
					showConfirmButton: false,
					timer: 2000,
				});
				reset(); // Clear form fields
				setSelectedDate(new Date()); // Reset date
				setSelectedPublisher(null); // Reset publisher
			} else {
				Swal.fire({
					icon: "error",
					title: "Submission Failed!",
					text:
						res.data.message || "There was an error submitting your article.",
					position: "top-end",
					showConfirmButton: false,
					timer: 3000,
				});
			}
		} catch (error) {
			console.error("Error adding article:", error);
			Swal.fire({
				icon: "error",
				title: "Submission Failed!",
				text:
					error.message || "An unexpected error occurred. Please try again.",
				position: "top-end",
				showConfirmButton: false,
				timer: 3000,
			});
		}
	};

	return (
		<div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
			<Helmet>
				<title>Add-Article</title>
			</Helmet>
			<div className="bg-white p-6 sm:p-8 rounded-lg shadow-xl w-full max-w-2xl">
				<h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
					Submit a New Article
				</h2>

				<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
					{/* Article Title */}
					<div>
						<label
							htmlFor="title"
							className="block text-gray-700 text-sm font-semibold mb-2"
						>
							Article Title
						</label>
						<input
							type="text"
							id="title"
							{...register("title", { required: "Article title is required" })}
							className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="Enter article title"
						/>
						{errors.title && (
							<p className="text-red-500 text-sm mt-1">
								{errors.title.message}
							</p>
						)}
					</div>

					{/* Article Image */}
					<div>
						<label
							htmlFor="image"
							className="block text-gray-700 text-sm font-semibold mb-2"
						>
							Article Image
						</label>
						<input
							type="file"
							id="image"
							{...register("image", { required: "Article image is required" })}
							accept="image/*" // Only allow image files
							className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
						/>
						{errors.image && (
							<p className="text-red-500 text-sm mt-1">
								{errors.image.message}
							</p>
						)}
					</div>

					{/* Publisher Select */}
					<div>
						<label
							htmlFor="publisher"
							className="block text-gray-700 text-sm font-semibold mb-2"
						>
							Select Publisher
						</label>
						<Select
							id="publisher"
							options={publisherOptions}
							value={selectedPublisher}
							onChange={setSelectedPublisher}
							placeholder="Select a publisher"
							isClearable
							classNamePrefix="react-select"
						/>
						{/* React-Select doesn't integrate directly with React Hook Form's register.
                We handle its validation manually by checking selectedPublisher state. */}
						{!selectedPublisher &&
							errors.publisher && ( // Additional check for display error
								<p className="text-red-500 text-sm mt-1">
									{errors.publisher.message}
								</p>
							)}
					</div>

					{/* Tags */}
					<div>
						<label
							htmlFor="tags"
							className="block text-gray-700 text-sm font-semibold mb-2"
						>
							Tags (comma-separated)
						</label>
						<input
							type="text"
							id="tags"
							{...register("tags", { required: "Tags are required" })}
							className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="e.g., technology, science, health"
						/>
						{errors.tags && (
							<p className="text-red-500 text-sm mt-1">{errors.tags.message}</p>
						)}
					</div>

					{/* Description */}
					<div>
						<label
							htmlFor="description"
							className="block text-gray-700 text-sm font-semibold mb-2"
						>
							Article Description
						</label>
						<textarea
							id="description"
							{...register("description", {
								required: "Article description is required",
							})}
							rows="6"
							className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
							placeholder="Write the full article content here..."
						></textarea>
						{errors.description && (
							<p className="text-red-500 text-sm mt-1">
								{errors.description.message}
							</p>
						)}
					</div>

					{/* Posted Date (using react-datepicker) */}
					<div>
						<label
							htmlFor="postedDate"
							className="block text-gray-700 text-sm font-semibold mb-2"
						>
							Posted Date
						</label>
						<ReactDatePicker
							selected={selectedDate}
							onChange={(date) => setSelectedDate(date)}
							dateFormat="MMMM d, yyyy"
							className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							wrapperClassName="w-full" // Ensure full width for the wrapper
						/>
					</div>

					{/* Premium Article Checkbox */}
					<div className="flex items-center">
						<input
							type="checkbox"
							id="isPremium"
							{...register("isPremium")}
							className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
						/>
						<label
							htmlFor="isPremium"
							className="ml-2 block text-sm text-gray-900"
						>
							Mark as Premium Article
						</label>
					</div>

					<button
						type="submit"
						className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-300 font-semibold"
					>
						Submit Article
					</button>
				</form>
			</div>
		</div>
	);
};

export default AddArticle;
