// src/components/home/TrendingArticlesSlider.jsx
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Autoplay } from "swiper/modules"; // Swiper modules
import "swiper/css"; // Core Swiper styles
import "swiper/css/pagination"; // Pagination styles
import "swiper/css/navigation"; // Navigation styles

import { useQuery } from "@tanstack/react-query"; // Tanstack Query hook
import useAxiosPublic from "../../hooks/useAxiosPublic"; // Your axiosPublic instance
import LoadingSpinner from "../shared/LoadingSpinner"; // Your Loading Spinner component
import { Link } from "react-router-dom"; // React Router Link

const TrendingArticlesSlider = () => {
	const axiosPublic = useAxiosPublic(); // Using axiosPublic to fetch data

	// Fetch trending articles using Tanstack Query
	// queryKey: 'trendingArticles' - This key is used for caching the data
	// queryFn: This function will fetch the data
	const {
		data: trendingArticles = [],
		isLoading,
		isError,
		error,
	} = useQuery({
		queryKey: ["trendingArticles"],
		queryFn: async () => {
			// Send a GET request to the /articles/trending route from the server
			// This route is expected to return articles sorted by viewCount
			const res = await axiosPublic.get("/articles/trending");
			return res.data; // Return the fetched data
		},
		// Optional: How long the data remains "stale" (i.e., when to refetch again)
		staleTime: 1000 * 60 * 5, // 5 minutes
	});

	// Show a loading spinner while data is loading
	if (isLoading) {
		return <LoadingSpinner />;
	}

	// Handle error if data fetching fails
	if (isError) {
		return (
			<div className="text-center text-red-500">
				Error loading trending articles: {error.message}
			</div>
		);
	}

	return (
		<div className="my-10">
			<Swiper
				slidesPerView={1}
				spaceBetween={20}
				loop={true}
				pagination={{ clickable: true }}
				navigation={true}
				autoplay={{ delay: 3000, disableOnInteraction: false }}
				modules={[Pagination, Navigation, Autoplay]}
				breakpoints={{
					640: {
						slidesPerView: 2,
						spaceBetween: 24,
					},
					1024: {
						slidesPerView: 3,
						spaceBetween: 32,
					},
				}}
				className="rounded-lg"
			>
				{trendingArticles.map((article) => (
					<SwiperSlide key={article._id}>
						<div className="relative h-[300px] md:h-[350px] lg:h-[400px] rounded-xl overflow-hidden shadow-lg group">
							<img
								src={article.image}
								alt={article.title}
								className="w-full h-full object-cover transform duration-300 group-hover:scale-105"
							/>

							{/* Overlay */}
							<div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent p-6 flex flex-col justify-end">
								<h2 className="text-white text-xl md:text-2xl font-bold line-clamp-2">
									{article.title}
								</h2>
								<p className="text-sm text-gray-300 mt-1">
									Publisher:{" "}
									<span className="font-medium">{article.publisher}</span>
								</p>
								<p className="text-sm text-gray-300">
									Views:{" "}
									<span className="font-medium">{article.viewCount}</span>
								</p>
								<Link
									to={`/articles/${article._id}`}
									className="inline-block mt-4 bg-blue-600 text-white text-sm px-4 py-2 rounded-md hover:bg-blue-700 transition-colors font-semibold"
								>
									Read Details
								</Link>
							</div>
						</div>
					</SwiperSlide>
				))}
			</Swiper>
		</div>
	);
};

export default TrendingArticlesSlider;
