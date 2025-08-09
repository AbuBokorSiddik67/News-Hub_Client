// src/pages/ReadDetails.jsx (বা src/components/ReadDetails.jsx)
import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { FaEye, FaCalendarAlt, FaUser, FaStar } from "react-icons/fa"; // Icons for views, date, author
import LoadingSpinner from "../components/shared/LoadingSpinner"; // Your Loading Spinner component
import useAxiosPublic from "../hooks/useAxiosPublic"; // For public article fetching
import useAxiosSecure from "../hooks/useAxiosSecure"; // For secure operations if needed (e.g., premium content check)
import useAuth from "../hooks/useAuth"; // To check user's premium status
import Swal from "sweetalert2"; // For alerts
import { Helmet } from "react-helmet";

const ReadDetails = () => {
	const { id } = useParams(); // Get the article ID from the URL parameters
	const axiosPublic = useAxiosPublic();
	const axiosSecure = useAxiosSecure(); // Use if you need to fetch premium content or update views securely
	const { user, loading: authLoading } = useAuth(); // Get current user info

	// Fetch the single article details
	const {
		data: article,
		isLoading: articleLoading,
		isError: articleError,
		error,
		refetch: refetchArticle, // To refetch after view count update
	} = useQuery({
		queryKey: ["articleDetails", id], // Unique key for this query
		queryFn: async () => {
			const res = await axiosPublic.get(`/articles/${id}`); // Fetch article by ID
			return res.data;
		},
		enabled: !!id, // Only run the query if ID exists
		staleTime: 1000 * 60 * 5, // Data considered fresh for 5 minutes
		cacheTime: 1000 * 60 * 10, // Data stays in cache for 10 minutes
	});

	// Effect to increment view count
	useEffect(() => {
		const incrementView = async () => {
			if (article && !articleLoading && !articleError) {
				try {
					await axiosPublic.patch(`/articles/increment-view/${id}`);
				} catch (err) {
					console.error("Failed to increment view count:", err);
				}
			}
		};

		const timer = setTimeout(() => {
			incrementView();
		}, 1500); // Increment after 1.5 seconds

		return () => clearTimeout(timer); // Cleanup timer
	}, [article, articleLoading, articleError, id, axiosPublic]); // Dependencies

	if (articleLoading || authLoading) {
		return <LoadingSpinner />;
	}

	if (articleError) {
		return (
			<div className="flex justify-center items-center h-screen text-red-600 text-xl px-4 text-center">
				Error loading article: {error.message}. Please try again later.
			</div>
		);
	}

	if (!article) {
		return (
			<div className="flex justify-center items-center h-screen text-gray-600 text-xl px-4 text-center">
				Article not found. It might have been removed or the link is incorrect.
			</div>
		);
	}

	// Check if article is premium and user is NOT premium
	const isPremiumArticle = article.isPremium; // Assuming your article object has an 'isPremium' field
	const userIsPremium = user?.isPremium; // Assuming user object from useAuth has 'isPremium'

	// If it's a premium article and the user is not premium
	if (isPremiumArticle && !userIsPremium) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] bg-gray-100 p-6 text-center">
				<Helmet>
					<title>Read-Details</title>
				</Helmet>
				<FaStar className="text-yellow-500 text-6xl md:text-8xl mb-6" />
				<h2 className="text-2xl md:text-4xl font-bold text-gray-800 mb-4">
					Premium Content
				</h2>
				<p className="text-md md:text-lg text-gray-700 mb-6 max-w-lg mx-auto">
					This article is exclusive to our premium subscribers. Unlock full
					access to all premium content!
				</p>
				<Link
					to="/subscription"
					className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-300 text-base md:text-lg"
				>
					Upgrade to Premium
				</Link>
				<p className="mt-4 text-sm md:text-base text-gray-500">
					Already a premium member? Make sure you are logged in.
				</p>
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-white shadow-lg rounded-lg my-8 max-w-4xl">
			<h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight mb-6 text-center px-2">
				{article.title}
			</h1>

			{article.image && (
				<div className="mb-8 overflow-hidden rounded-lg">
					<img
						src={article.image}
						alt={article.title}
						className="w-full h-64 sm:h-80 md:h-96 object-cover object-center transform transition-transform duration-500 hover:scale-105"
					/>
				</div>
			)}

			<div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 text-gray-600 text-sm md:text-base mb-8 border-b pb-4 px-2">
				<p className="flex items-center text-center sm:text-left">
					<FaUser className="mr-2 text-blue-500" />
					<span className="font-semibold text-sm sm:text-base">
						{article.authorName || "Unknown Author"}
					</span>
				</p>
				<p className="flex items-center text-center sm:text-left">
					<FaCalendarAlt className="mr-2 text-green-500" />
					{article.postedDate
						? new Date(article.postedDate).toLocaleDateString()
						: "N/A"}
				</p>
				<p className="flex items-center text-center sm:text-left">
					<FaEye className="mr-2 text-purple-500" />
					{article.viewCount || 0} Views
				</p>
				{article.publisher && (
					<p className="flex items-center text-center sm:text-left">
						Publisher:{" "}
						<span className="font-semibold ml-1">{article.publisher}</span>
					</p>
				)}
			</div>

			{article.tags && article.tags.length > 0 && (
				<div className="flex flex-wrap justify-center gap-2 mt-2 mb-8 px-2">
					{article.tags.map((tag, index) => (
						<span
							key={index}
							className="bg-gray-200 text-gray-700 text-xs sm:text-sm px-3 py-1 rounded-full hover:bg-gray-300 transition-colors"
						>
							{tag}
						</span>
					))}
				</div>
			)}

			<div className="prose prose-lg max-w-none text-gray-800 leading-relaxed mb-8 text-justify px-2">
				{/* Assuming article.description contains the main content */}
				<p className="text-base sm:text-lg">{article.description}</p>
				{/* If your content is rich text/HTML, use dangerouslySetInnerHTML: */}
				{/* <div dangerouslySetInnerHTML={{ __html: article.fullContent }} /> */}
			</div>

			{/* Optional: Related Articles Section (You'd fetch these based on tags or category) */}

			{/* <div className="mt-12 border-t pt-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 px-2">Related Articles</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-2">
                    // Map through related articles here
                    // <div key={relatedArticle.id} className="bg-gray-50 p-4 rounded-lg shadow-sm">
                    //    <h3 className="text-lg font-semibold">{relatedArticle.title}</h3>
                    //    <p className="text-sm text-gray-600 line-clamp-2">{relatedArticle.description}</p>
                    //    <Link to={`/articles/${relatedArticle.id}`} className="text-blue-600 hover:underline mt-2 inline-block">Read More</Link>
                    // </div>
                </div>
            </div> */}

			<div className="text-center mt-12 px-2">
				<Link
					to="/all-articles" // Changed to /all-articles as per your common routing pattern
					className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-300 text-base md:text-lg"
				>
					Back to All Articles
				</Link>
			</div>
		</div>
	);
};

export default ReadDetails;
