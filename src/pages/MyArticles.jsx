import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import useAuth from "../hooks/useAuth";
import useAxiosSecure from "../hooks/useAxiosSecure";
import LoadingSpinner from "../components/shared/LoadingSpinner";
import { Helmet } from "react-helmet";

const MyArticles = () => {
	const { user, loading: authLoading } = useAuth();
	const axiosSecure = useAxiosSecure();

	const {
		data: myArticles = [],
		isLoading: articlesLoading,
		isError: articlesError,
		refetch,
	} = useQuery({
		queryKey: ["myArticles", user?.email],
		queryFn: async () => {
			if (!user?.email) {
				return [];
			}
			const res = await axiosSecure.get(`/articles/my-articles/${user.email}`);
			return res.data;
		},
		enabled: !!user?.email && !authLoading,
		staleTime: 1000 * 60 * 5,
	});

	if (authLoading) {
		return <LoadingSpinner />;
	}

	if (!user) {
		return (
			<div className="flex justify-center items-center h-[calc(100vh-80px)] text-xl text-red-500">
				Please log in to view your articles.
			</div>
		);
	}

	const handleDeleteArticle = async (id) => {
		Swal.fire({
			title: "Are you sure?",
			text: "You won't be able to revert this!",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Yes, delete it!",
		}).then(async (result) => {
			if (result.isConfirmed) {
				try {
					const res = await axiosSecure.delete(`/articles/${id}`);
					if (res.data.deletedCount > 0) {
						Swal.fire("Deleted!", "Your article has been deleted.", "success");
						refetch();
					} else {
						Swal.fire("Failed!", "Could not delete the article.", "error");
					}
				} catch (error) {
					console.error("Error deleting article:", error);
					Swal.fire(
						"Error!",
						"An error occurred while deleting the article.",
						"error"
					);
				}
			}
		});
	};

	return (
		<div className="p-4 sm:p-6 lg:p-8 bg-gray-100 min-h-screen">
			<Helmet>
				<title>My-Articles</title>
			</Helmet>
			<h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
				My Articles
			</h2>

			{articlesLoading ? (
				<LoadingSpinner />
			) : articlesError ? (
				<div className="text-center text-red-500 py-10">
					Error loading your articles.
				</div>
			) : myArticles.length === 0 ? (
				<div className="text-center text-gray-600 py-10 text-xl">
					You haven't posted any articles yet.
				</div>
			) : (
				<div className="grid grid-cols-1 gap-6 max-w-4xl mx-auto">
					{myArticles.map((article) => (
						<div
							key={article._id}
							className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 hover:shadow-md transition-shadow duration-200"
						>
							<img
								src={article.image}
								alt={article.title}
								className="w-full md:w-32 h-32 object-cover rounded-md flex-shrink-0"
							/>
							<div className="flex-grow text-center md:text-left">
								<h4 className="text-lg font-bold text-gray-800 line-clamp-1">
									{article.title}
								</h4>
								<p className="text-sm text-gray-600">
									Publisher:{" "}
									<span className="font-semibold">
										{article.publisher || "N/A"}
									</span>
								</p>
								<p className="text-sm text-gray-600">
									Posted On: {new Date(article.postedDate).toLocaleDateString()}
								</p>
								<p className="text-sm text-gray-600 flex items-center justify-center md:justify-start">
									<FaEye className="mr-1" /> Views: {article.viewCount || 0}
								</p>
								<p className="text-sm text-gray-700">
									Status:{" "}
									<span
										className={`font-semibold ${
											article.status === "approved"
												? "text-green-600"
												: article.status === "pending"
												? "text-yellow-600"
												: "text-red-600"
										}`}
									>
										{article.status}
									</span>
								</p>
							</div>
							<div className="flex space-x-3 mt-4 md:mt-0">
								<Link
									to={`/articles/${article._id}`}
									className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors duration-200 tooltip"
									data-tip="View Details"
								>
									<FaEye />
								</Link>
								<Link
									to={`/dashboard/update-article/${article._id}`}
									className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors duration-200 tooltip"
									data-tip="Edit Article"
								>
									<FaEdit />
								</Link>
								<button
									onClick={() => handleDeleteArticle(article._id)}
									className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-200 tooltip"
									data-tip="Delete Article"
								>
									<FaTrash />
								</button>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default MyArticles;
