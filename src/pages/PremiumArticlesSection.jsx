import React from "react";
import { FaCrown, FaLock, FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query"; // Import useQuery
import useAxiosPublic from "../hooks/useAxiosPublic"; // Import your custom hook
import LoadingSpinner from "../components/shared/LoadingSpinner";
import { Helmet } from "react-helmet";
// Import LoadingSpinner

const PremiumArticlesSection = () => {
	const axiosPublic = useAxiosPublic();

	// Fetch premium articles from the database
	const {
		data: premiumArticles = [],
		isLoading,
		isError,
		error,
	} = useQuery({
		queryKey: ["premiumArticles"],
		queryFn: async () => {
			// Fetch articles where isPremium is true
			const res = await axiosPublic.get("/premium-articles");
			return res.data;
		},
		staleTime: 1000 * 60 * 5, // Data considered fresh for 5 minutes
	});

	if (isLoading) {
		return <LoadingSpinner />;
	}

	if (isError) {
		return (
			<div className="text-center text-red-600 dark:text-red-400 text-lg py-10">
				Error loading premium articles: {error.message}
			</div>
		);
	}

	return (
		<div className="py-8 px-[5%]">
			<Helmet>
				<title>Premium-Articles</title>
			</Helmet>
			{premiumArticles.length > 0 ? (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					{premiumArticles.map((article) => (
						<div
							key={article._id}
							className="bg-white dark:bg-gray-800 rounded-xl shadow-xl hover:shadow-2xl overflow-hidden
                                       transform hover:-translate-y-2 transition-all duration-300 relative group
                                       border border-gray-100 dark:border-gray-700"
						>
							{/* Premium Badge */}
							<div className="absolute top-4 left-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center shadow-md z-10">
								<FaCrown className="mr-2 text-xs" /> Premium
							</div>

							{/* Article Image */}
							<div className="relative overflow-hidden h-52 md:h-60">
								<img
									src={article.image}
									alt={article.title}
									className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-30"></div>
							</div>

							<div className="p-6">
								{/* Category and Read Time - You might need to add readTime and category to your article data */}
								<div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
									<span className="font-medium">
										{article.category || "General"}
									</span>{" "}
									{/* Fallback if category not present */}
									<span className="flex items-center">
										<svg
											className="w-4 h-4 mr-1"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth="2"
												d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
											></path>
										</svg>
										{article.readTime || "5 min"}{" "}
										{/* Fallback if readTime not present */}
									</span>
								</div>

								{/* Article Title */}
								<h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 leading-tight line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
									{article.title}
								</h3>

								{/* Article Excerpt (using description field) */}
								<p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
									{article.description} {/* Using description as excerpt */}
								</p>

								{/* Read More Button */}
								<Link
									to={`/premium-articles/${article._id}`}
									className="inline-flex items-center text-blue-600 dark:text-blue-400 font-semibold hover:underline transition-colors duration-200"
								>
									Read More{" "}
									<FaArrowRight className="ml-2 text-sm transform group-hover:translate-x-1 transition-transform duration-300" />
								</Link>
							</div>
						</div>
					))}
				</div>
			) : (
				<div className="text-center text-gray-600 dark:text-gray-400 text-2xl py-10">
					<p className="mb-4">No premium articles available at the moment.</p>
					<p className="text-lg">Stay tuned for exclusive content!</p>
					<Link
						to="/subscription"
						className="mt-6 inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-colors duration-300"
					>
						Explore Subscription Plans
					</Link>
				</div>
			)}
		</div>
	);
};

export default PremiumArticlesSection;
