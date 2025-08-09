// src/pages/admin/ManageArticles.jsx (সাধারণত admin ফোল্ডারের ভেতরে থাকে)
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
	FaEye,
	FaCheckCircle,
	FaTimesCircle,
	FaTrashAlt,
	FaPen,
} from "react-icons/fa"; // Icons
import Swal from "sweetalert2"; // For alerts and confirmations
import useAxiosSecure from "../../hooks/useAxiosSecure"; // Custom hook for secure axios instance
import LoadingSpinner from "../../components/shared/LoadingSpinner"; // Your loading spinner component
import { Link } from "react-router-dom"; // For viewing/editing article details

const ManageArticles = () => {
	const axiosSecure = useAxiosSecure();
	const [searchQuery, setSearchQuery] = useState(""); // For search functionality
	const [filterPublisher, setFilterPublisher] = useState(""); // For filtering by publisher

	// Fetch all articles from the database using TanStack Query
	// This query will refetch when search query or publisher filter changes
	const {
		data: articles = [],
		isLoading,
		isError,
		error,
		refetch,
	} = useQuery({
		queryKey: ["allArticlesAdmin", searchQuery, filterPublisher], // Unique key for this query
		queryFn: async () => {
			let url = "/articles/all-articles-admin"; // Your backend endpoint to get all articles for admin
			// Add search query if available
			if (searchQuery) {
				url += `?search=${searchQuery}`;
			}
			// Add publisher filter if available
			if (filterPublisher) {
				url += `${searchQuery ? "&" : "?"}publisher=${filterPublisher}`;
			}
			const res = await axiosSecure.get(url);
			return res.data;
		},
	});

	// Fetch publishers for the filter dropdown
	const { data: publishers = [], isLoading: publishersLoading } = useQuery({
		queryKey: ["publishersList"],
		queryFn: async () => {
			const res = await axiosSecure.get("/publishers"); // Your API to get all publishers
			return res.data;
		},
		staleTime: 1000 * 60 * 60, // Publishers list doesn't change often, cache for an hour
	});

	// Handle updating article status (approve/decline)
	const handleUpdateStatus = async (article, newStatus) => {
		Swal.fire({
			title: `Are you sure to ${newStatus}?`,
			text: `You are about to change the status of "${article.title}" to "${newStatus}".`,
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: `Yes, ${newStatus} it!`,
		}).then(async (result) => {
			if (result.isConfirmed) {
				try {
					const res = await axiosSecure.patch(
						`/articles/status/${article._id}`,
						{ status: newStatus }
					);
					if (res.data.modifiedCount > 0) {
						refetch(); // Refetch articles data to update the UI
						Swal.fire({
							position: "center",
							icon: "success",
							title: `Article status updated to ${newStatus}!`,
							showConfirmButton: false,
							timer: 1500,
						});
					} else {
						Swal.fire({
							position: "center",
							icon: "info",
							title: "Status not changed or no modification needed.",
							showConfirmButton: false,
							timer: 1500,
						});
					}
				} catch (err) {
					console.error("Error updating article status:", err);
					Swal.fire({
						icon: "error",
						title: "Oops...",
						text:
							err.response?.data?.message ||
							`Failed to update status to ${newStatus}!`,
					});
				}
			}
		});
	};

	// Handle deleting an article
	const handleDeleteArticle = async (id) => {
		Swal.fire({
			title: "Are you sure?",
			text: "You are about to delete this article. This cannot be undone!",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Yes, delete it!",
		}).then(async (result) => {
			if (result.isConfirmed) {
				try {
					const res = await axiosSecure.delete(`/articles/${id}`); // Use the same delete endpoint as MyArticles
					if (res.data.deletedCount > 0) {
						refetch(); // Refetch articles data to update the UI
						Swal.fire({
							position: "center",
							icon: "success",
							title: "Article has been deleted!",
							showConfirmButton: false,
							timer: 1500,
						});
					} else {
						Swal.fire({
							position: "center",
							icon: "info",
							title: "Article not found or already deleted.",
							showConfirmButton: false,
							timer: 1500,
						});
					}
				} catch (err) {
					console.error("Error deleting article:", err);
					Swal.fire({
						icon: "error",
						title: "Oops...",
						text: err.response?.data?.message || "Failed to delete article!",
					});
				}
			}
		});
	};

	if (isLoading || publishersLoading) {
		return <LoadingSpinner />;
	}

	if (isError) {
		return (
			<div className="flex justify-center items-center h-screen text-red-600 text-xl">
				Error loading articles: {error.message}
			</div>
		);
	}

	return (
		<div className="p-4 sm:p-6 lg:p-8 bg-white rounded-lg shadow-md min-h-[calc(100vh-80px)]">
			<h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
				Manage All Articles ({articles.length})
			</h2>

			{/* Filter and Search Section */}
			<div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0 md:space-x-4">
				{/* Search Input */}
				<input
					type="text"
					placeholder="Search by title..."
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					className="w-full md:w-1/2 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
				/>
				{/* Publisher Filter Dropdown */}
				<select
					value={filterPublisher}
					onChange={(e) => setFilterPublisher(e.target.value)}
					className="w-full md:w-1/2 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
				>
					<option value="">Filter by Publisher (All)</option>
					{publishers.map((publisher) => (
						<option key={publisher._id} value={publisher.name}>
							{publisher.publisher}
						</option>
					))}
				</select>
			</div>

			<div className="overflow-x-auto relative shadow-md sm:rounded-lg">
				<table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
					<thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
						<tr>
							<th scope="col" className="py-3 px-6">
								#
							</th>
							<th scope="col" className="py-3 px-6">
								Title
							</th>
							<th scope="col" className="py-3 px-6">
								Author
							</th>
							<th scope="col" className="py-3 px-6">
								Publisher
							</th>
							<th scope="col" className="py-3 px-6">
								Status
							</th>
							<th scope="col" className="py-3 px-6 text-center">
								Actions
							</th>
						</tr>
					</thead>
					<tbody>
						{articles.map((article, index) => (
							<tr
								key={article._id}
								className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
							>
								<th
									scope="row"
									className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
								>
									{index + 1}
								</th>
								<td className="py-4 px-6 font-medium text-gray-900">
									{article.title}
								</td>
								<td className="py-4 px-6">
									{article.authorName || article.authorEmail}
								</td>
								<td className="py-4 px-6">{article.publisher}</td>
								<td className="py-4 px-6">
									<span
										className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
											article.status === "approved"
												? "bg-green-100 text-green-800"
												: article.status === "pending"
												? "bg-yellow-100 text-yellow-800"
												: "bg-red-100 text-red-800"
										}`}
									>
										{article.status}
									</span>
								</td>
								<td className="py-4 px-6">
									<div className="flex justify-center items-center space-x-2">
										{/* View Article */}
										<Link
											to={`/articles/${article._id}`} // Link to public article view page
											className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors duration-200"
											title="View Article"
										>
											<FaEye className="text-lg" />
										</Link>

										{/* Approve Button */}
										{article.status !== "approved" && (
											<button
												onClick={() => handleUpdateStatus(article, "approved")}
												className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors duration-200"
												title="Approve Article"
											>
												<FaCheckCircle className="text-lg" />
											</button>
										)}

										{/* Decline Button */}
										{article.status !== "declined" && (
											<button
												onClick={() => handleUpdateStatus(article, "declined")}
												className="p-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 transition-colors duration-200"
												title="Decline Article"
											>
												<FaTimesCircle className="text-lg" />
											</button>
										)}

										{/* Edit Button (Link to an admin-specific edit page if needed) */}
										<Link
											to={`/dashboard/update-article/${article._id}`}
											className="p-2 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition-colors duration-200"
											title="Edit Article"
										>
											<FaPen className="text-lg" />
										</Link>

										{/* Delete Button */}
										<button
											onClick={() => handleDeleteArticle(article._id)}
											className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-200"
											title="Delete Article"
										>
											<FaTrashAlt className="text-lg" />
										</button>
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{articles.length === 0 && !isLoading && (
				<p className="text-center text-gray-500 mt-8 text-lg">
					No articles found matching your criteria.
				</p>
			)}
		</div>
	);
};

export default ManageArticles;
