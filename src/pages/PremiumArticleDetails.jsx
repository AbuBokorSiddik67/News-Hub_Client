import React from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../hooks/useAxiosPublic";
import LoadingSpinner from "../components/shared/LoadingSpinner";
import {
	FaCalendarAlt,
	FaUser,
	FaBuilding,
	FaTag,
	FaEye,
} from "react-icons/fa"; // Import icons
import { Helmet } from "react-helmet";

const PremiumArticleDetails = () => {
	const { id } = useParams();
	const axiosPublic = useAxiosPublic();

	const {
		data: article,
		isLoading,
		isError,
		error,
	} = useQuery({
		queryKey: ["premiumArticle", id],
		queryFn: async () => {
			// It's good practice to fetch from /articles/:id
			// and handle isPremium check in frontend or backend middleware
			const res = await axiosPublic.get(`/articles/${id}`);
			return res.data;
		},
		staleTime: 1000 * 60 * 5, // Data considered fresh for 5 minutes
	});

	if (isLoading) {
		return (
			<div className="min-h-[calc(100vh-200px)] flex items-center justify-center bg-gray-50 dark:bg-gray-900">
				<LoadingSpinner />
			</div>
		);
	}

	if (isError) {
		return (
			<div className="min-h-[calc(100vh-200px)] flex items-center justify-center bg-gray-50 dark:bg-gray-900">
				<p className="text-center text-red-600 dark:text-red-400 text-xl font-semibold">
					Error: {error.message || "Failed to load article details."}
				</p>
			</div>
		);
	}

	// Format the date for better readability
	const formattedDate = article.postedDate
		? new Date(article.postedDate).toLocaleDateString("en-US", {
				year: "numeric",
				month: "long",
				day: "numeric",
		  })
		: "N/A";

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 md:py-16">
			<Helmet>
				<title>Premium-Article-Details</title>
			</Helmet>
			<div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Article Card Container */}
				<div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl">
					{/* Article Image */}
					<div className="relative h-64 sm:h-80 md:h-96 w-full overflow-hidden">
						<img
							src={article.image}
							alt={article.title}
							className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-105"
						/>
						<div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-40"></div>
						{article.isPremium && (
							<div className="absolute top-4 right-4 bg-yellow-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-md flex items-center">
								<FaTag className="mr-2" /> Premium Content
							</div>
						)}
					</div>

					{/* Article Content */}
					<div className="p-6 sm:p-8 md:p-10">
						{/* Title */}
						<h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 leading-tight text-gray-900 dark:text-white">
							{article.title}
						</h1>

						{/* Meta Info */}
						<div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
							<p className="flex items-center">
								<FaBuilding className="mr-2 text-blue-500 dark:text-blue-400" />
								<span className="font-semibold">Publisher:</span>{" "}
								{article.publisher || "N/A"}
							</p>
							<p className="flex items-center">
								<FaUser className="mr-2 text-green-500 dark:text-green-400" />
								<span className="font-semibold">Author:</span>{" "}
								{article.authorName || "N/A"}
							</p>
							<p className="flex items-center">
								<FaCalendarAlt className="mr-2 text-purple-500 dark:text-purple-400" />
								<span className="font-semibold">Posted:</span> {formattedDate}
							</p>
							{article.viewCount !== undefined && (
								<p className="flex items-center">
									<FaEye className="mr-2 text-red-500 dark:text-red-400" />
									<span className="font-semibold">Views:</span>{" "}
									{article.viewCount}
								</p>
							)}
							{article.tags && article.tags.length > 0 && (
								<p className="flex items-center">
									<FaTag className="mr-2 text-yellow-500 dark:text-yellow-400" />
									<span className="font-semibold">Tags:</span>{" "}
									{article.tags.join(", ")}
								</p>
							)}
						</div>

						{/* Description/Content */}
						<div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed text-lg sm:text-xl">
							{/* You might want to parse description as HTML if it contains rich text */}
							<p className="mb-4">{article.description}</p>
							{/* Example of additional content from a 'content' field if you have one */}
							{article.content && (
								<div dangerouslySetInnerHTML={{ __html: article.content }} />
							)}
						</div>

						{/* Optional: Call to Action for Premium (if applicable) */}
						{/* This part depends on if you're checking premium status here */}
						{/* {article.isPremium && !userIsPremium && (
                            <div className="mt-10 text-center bg-blue-50 dark:bg-blue-950 p-6 rounded-lg border border-blue-200 dark:border-blue-700 shadow-inner">
                                <h3 className="text-xl font-bold text-blue-800 dark:text-blue-300 mb-3">
                                    This is Premium Content!
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300 mb-5">
                                    Become a premium subscriber to read the full article and get unlimited access.
                                </p>
                                <Link
                                    to="/subscription"
                                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-colors duration-300 transform hover:scale-105"
                                >
                                    Subscribe Now!
                                </Link>
                            </div>
                        )} */}
					</div>
				</div>
				<div className="text-center mt-12 px-2">
					<Link
						to="/premium-article" // Changed to /all-articles as per your common routing pattern
						className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-300 text-base md:text-lg"
					>
						Back to Premium Articles
					</Link>
				</div>
			</div>
		</div>
	);
};

export default PremiumArticleDetails;
