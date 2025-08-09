// src/pages/dashboard/EditArticle.jsx (অথবা src/pages/user/EditArticle.jsx)
import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure"; // Your custom axios instance with interceptors
import LoadingSpinner from "../../components/shared/LoadingSpinner"; // Your loading spinner component
import useAuth from "../../hooks/useAuth"; // To get current user info for authorization if needed

const EditArticle = () => {
	const { id } = useParams(); // Get article ID from URL parameters
	const navigate = useNavigate();
	const axiosSecure = useAxiosSecure();
	const { user } = useAuth(); // Get logged-in user info

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm();

	// Fetch the specific article data to pre-fill the form
	const {
		data: article,
		isLoading,
		isError,
		error,
		// refetch, // We might want to refetch after update, but not strictly necessary for a form
	} = useQuery({
		queryKey: ["articleDetails", id], // Unique key for this specific article
		queryFn: async () => {
			const res = await axiosSecure.get(`/articles/${id}`);
			return res.data;
		},
		enabled: !!id, // Only run this query if ID is available
	});

	// Fetch publishers list for the dropdown
	const { data: publishers = [], isLoading: publishersLoading } = useQuery({
		queryKey: ["publishersList"],
		queryFn: async () => {
			const res = await axiosSecure.get("/publishers"); // Your API to get all publishers
			return res.data;
		},
		staleTime: 1000 * 60 * 60, // Cache for an hour as publishers don't change often
	});

	// Use useEffect to reset form with fetched article data once it's available
	useEffect(() => {
		if (article) {
			reset({
				title: article.title,
				image: article.image,
				publisher: article.publisher,
				tags: article.tags ? article.tags.join(", ") : "", // Join array back to comma-separated string
				description: article.description,
				postedDate: article.postedDate
					? new Date(article.postedDate).toISOString().split("T")[0]
					: "", // Format date for input type="date"
				// Do not pre-fill status here, as status is managed by admin/backend
			});
		}
	}, [article, reset]);

	// Handle form submission
	const onSubmit = async (data) => {
		// Prepare data for submission
		const updatedArticleData = {
			title: data.title,
			image: data.image,
			publisher: data.publisher,
			tags: data.tags
				.split(",")
				.map((tag) => tag.trim())
				.filter((tag) => tag.length > 0), // Convert string back to array of trimmed tags
			description: data.description,
			postedDate: data.postedDate ? new Date(data.postedDate) : new Date(), // Ensure it's a Date object
			// Do NOT allow status to be changed from client-side edit form,
			// as this is usually an admin-only operation via ManageArticles.jsx
			// article.status will remain as it was fetched.
		};

		try {
			const res = await axiosSecure.patch(
				`/articles/${id}`,
				updatedArticleData
			);
			if (res.data.matchedCount > 0) {
				Swal.fire({
					icon: "success",
					title: "Article Updated!",
					text: "Your article has been successfully updated.",
					showConfirmButton: false,
					timer: 1500,
				});
				navigate("/dashboard/my-articles"); // Redirect to my articles page
			} else {
				Swal.fire({
					icon: "info",
					title: "No Changes Made",
					text: "The article data was the same or no modifications were needed.",
				});
			}
		} catch (err) {
			console.error("Error updating article:", err);
			Swal.fire({
				icon: "error",
				title: "Update Failed",
				text:
					err.response?.data?.message ||
					"There was an error updating your article. Please try again.",
			});
		}
	};

	if (isLoading || publishersLoading) {
		return <LoadingSpinner />;
	}

	if (isError) {
		return (
			<div className="flex justify-center items-center h-screen text-red-600 text-xl">
				Error loading article: {error.message}
			</div>
		);
	}

	// Optional: Check if the logged-in user is the author of the article
	// This is a client-side check, backend should also enforce this.
	if (user && article && user.email !== article.authorEmail) {
		Swal.fire({
			icon: "error",
			title: "Unauthorized Access",
			text: "You are not authorized to edit this article.",
			showConfirmButton: true,
		}).then(() => {
			navigate("/dashboard/my-articles"); // Redirect if not authorized
		});
		return <LoadingSpinner />; // Or a custom unauthorized message
	}

	return (
		<div className="container mx-auto p-4 sm:p-6 lg:p-8 bg-white rounded-lg shadow-md min-h-[calc(100vh-80px)]">
			<h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
				Edit Article: {article?.title}
			</h2>

			<form
				onSubmit={handleSubmit(onSubmit)}
				className="space-y-6 max-w-2xl mx-auto"
			>
				{/* Article Title */}
				<div>
					<label
						htmlFor="title"
						className="block text-sm font-medium text-gray-700 mb-1"
					>
						Article Title
					</label>
					<input
						type="text"
						id="title"
						{...register("title", { required: "Article title is required" })}
						className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
					/>
					{errors.title && (
						<p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
					)}
				</div>

				{/* Image URL */}
				<div>
					<label
						htmlFor="image"
						className="block text-sm font-medium text-gray-700 mb-1"
					>
						Image URL
					</label>
					<input
						type="url" // Use type "url" for image URLs
						id="image"
						{...register("image", { required: "Image URL is required" })}
						className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
					/>
					{errors.image && (
						<p className="text-red-500 text-xs mt-1">{errors.image.message}</p>
					)}
				</div>

				{/* Publisher Dropdown */}
				<div>
					<label
						htmlFor="publisher"
						className="block text-sm font-medium text-gray-700 mb-1"
					>
						Publisher
					</label>
					<select
						id="publisher"
						{...register("publisher", { required: "Publisher is required" })}
						className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
					>
						<option value="">Select a Publisher</option>
						{publishers.map((pub) => (
							<option key={pub._id} value={pub.name}>
								{pub.publisher}
							</option>
						))}
					</select>
					{errors.publisher && (
						<p className="text-red-500 text-xs mt-1">
							{errors.publisher.message}
						</p>
					)}
				</div>

				{/* Tags (comma separated) */}
				<div>
					<label
						htmlFor="tags"
						className="block text-sm font-medium text-gray-700 mb-1"
					>
						Tags (comma separated)
					</label>
					<input
						type="text"
						id="tags"
						{...register("tags")} // Not strictly required, so no 'required' validation
						placeholder="e.g., technology, science, AI"
						className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
					/>
					{errors.tags && (
						<p className="text-red-500 text-xs mt-1">{errors.tags.message}</p>
					)}
				</div>

				{/* Description (Textarea) */}
				<div>
					<label
						htmlFor="description"
						className="block text-sm font-medium text-gray-700 mb-1"
					>
						Description
					</label>
					<textarea
						id="description"
						rows="6"
						{...register("description", {
							required: "Description is required",
						})}
						className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
					></textarea>
					{errors.description && (
						<p className="text-red-500 text-xs mt-1">
							{errors.description.message}
						</p>
					)}
				</div>

				{/* Posted Date (Read-only for existing article, or allow edit if desired) */}
				<div>
					<label
						htmlFor="postedDate"
						className="block text-sm font-medium text-gray-700 mb-1"
					>
						Posted Date
					</label>
					<input
						type="date"
						id="postedDate"
						{...register("postedDate")}
						readOnly // Make it read-only if you don't want users to change this.
						// Or remove readOnly if you want users to be able to modify the date.
						className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 cursor-not-allowed"
					/>
					{errors.postedDate && (
						<p className="text-red-500 text-xs mt-1">
							{errors.postedDate.message}
						</p>
					)}
				</div>

				{/* Submit Button */}
				<div className="flex justify-center">
					<button
						type="submit"
						className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white font-medium rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
					>
						Update Article
					</button>
				</div>
			</form>
		</div>
	);
};

export default EditArticle;
