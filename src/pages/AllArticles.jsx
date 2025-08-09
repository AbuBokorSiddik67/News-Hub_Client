import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import LoadingSpinner from "../components/shared/LoadingSpinner";
import { Link } from "react-router-dom";
import { FaCrown, FaEye } from "react-icons/fa";
import useIsPremium from "../hooks/useIsPremium";
import { Helmet } from "react-helmet";

const AllArticles = () => {
	const { isPremium } = useIsPremium();

	// Pagination state
	const [page, setPage] = useState(1);
	const limit = 6; // Number of articles per page

	const {
		data = {},
		isLoading,
		isError,
		error,
	} = useQuery({
		queryKey: ["allArticles", page],
		queryFn: async () => {
			const res = await axios.get(
				"https://server-one-nu-23.vercel.app/articles",
				{
					params: {
						status: "approved",
						page,
						limit,
					},
				}
			);
			return res.data;
		},
		staleTime: 1000 * 60 * 5,
	});

	const articles = data.articles || [];
	const totalArticles = data.totalArticles || 0;
	const totalPages = Math.ceil(totalArticles / limit);

	if (isLoading) {
		return <LoadingSpinner />;
	}

	if (isError) {
		console.error("Error fetching articles:", error);
		return (
			<div className="text-center text-red-500 py-10">
				Failed to load articles. Please try again later.
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<Helmet>
				<title>All-Article</title>
			</Helmet>
			<h1 className="text-4xl font-bold text-center mb-10 text-gray-800">
				All Latest Articles
			</h1>
			{articles.length === 0 ? (
				<div className="text-center text-gray-600 py-10 text-xl">
					No approved articles found.
				</div>
			) : (
				<>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
						{articles.map((article) => (
							<div
								key={article._id}
								className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105 duration-300 relative"
							>
								<img
									src={article.image}
									alt={article.title}
									className="w-full h-48 object-cover"
								/>
								{article.isPremium && (
									<div className="absolute top-4 left-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center shadow-md z-10">
										<FaCrown className="mr-2 text-xs" /> Premium
									</div>
								)}
								<div className="p-6">
									<h2 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
										{article.title}
									</h2>
									<p className="text-sm text-gray-600 mb-3">
										<span className="font-semibold">
											{article.publisher || "N/A"}
										</span>{" "}
										- {new Date(article.postedDate).toLocaleDateString()}
									</p>
									<div className="flex items-center text-gray-500 text-sm mb-4">
										<FaEye className="mr-1" />
										<span>{article.viewCount || 0} Views</span>
									</div>
									<p className="text-gray-700 mb-4 line-clamp-3">
										{article.description}
									</p>
									<Link
										to={`${
											article.isPremium
												? isPremium
													? `/premium-articles/${article._id}`
													: `/subscription`
												: `/articles/${article._id}`
										}`}
										disabled={article.isPremium && !isPremium}
										className={`block w-full text-center py-2 px-4 rounded-md font-semibold transition-colors duration-300 
											${
												article.isPremium
													? isPremium
														? "bg-blue-600 hover:bg-blue-700 text-white"
														: "bg-blue-400 cursor-not-allowed text-white"
													: "bg-blue-600 hover:bg-blue-700 text-white"
											}`}
									>
										Read More
									</Link>
								</div>
							</div>
						))}
					</div>

					{/* Pagination Controls */}
					<div className="flex justify-center mt-10 gap-4">
						<button
							onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
							disabled={page === 1}
							className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded disabled:opacity-50 disabled:cursor-not-allowed"
						>
							Previous
						</button>
						<span className="text-lg font-medium">
							Page {page} of {totalPages}
						</span>
						<button
							onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
							disabled={page === totalPages}
							className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded disabled:opacity-50 disabled:cursor-not-allowed"
						>
							Next
						</button>
					</div>
				</>
			)}
		</div>
	);
};

export default AllArticles;
