// src/pages/admin/Statistics.jsx (or similar path under admin dashboard)
import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure"; // For secure API calls
import LoadingSpinner from "../../components/shared/LoadingSpinner"; // Your loading spinner
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
	PieChart,
	Pie,
	Cell,
} from "recharts"; // For charting
import {
	FaUsers,
	FaNewspaper,
	FaCheckCircle,
	FaHourglassHalf,
	FaTimesCircle,
	FaEye,
} from "react-icons/fa"; // Icons

const Statistics = () => {
	const axiosSecure = useAxiosSecure();

	// Fetch all necessary statistics data from your backend
	const {
		data: stats = {},
		isLoading,
		isError,
		error,
	} = useQuery({
		queryKey: ["adminStats"], // Unique key for this query
		queryFn: async () => {
			const res = await axiosSecure.get("/admin-stats"); // Endpoint for admin statistics
			return res.data;
		},
	});

	if (isLoading) {
		return <LoadingSpinner />;
	}

	if (isError) {
		return (
			<div className="flex justify-center items-center h-screen text-red-600 text-xl">
				Error loading statistics: {error.message}
			</div>
		);
	}

	// Prepare data for the Pie Chart (Article distribution by publisher)
	const publisherData = Object.keys(stats.articleCountByPublisher || {}).map(
		(publisher) => ({
			name: publisher,
			value: stats.articleCountByPublisher[publisher],
		})
	);

	const PIE_COLORS = [
		"#0088FE",
		"#00C49F",
		"#FFBB28",
		"#FF8042",
		"#8884d8",
		"#82ca9d",
		"#ffc658",
		"#d0ed57",
	];

	// Prepare data for Bar Chart (Top 5 Articles by ViewCount)
	const topArticlesData = stats.topArticles?.map((article) => ({
		title: article.title,
		views: article.viewCount,
	}));

	return (
		<div className="p-4 sm:p-6 lg:p-8 bg-gray-100 rounded-lg shadow-md min-h-[calc(100vh-80px)]">
			<h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
				Admin Dashboard Statistics
			</h2>

			{/* General Statistics Cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
				<div className="bg-blue-500 text-white p-6 rounded-lg shadow-lg flex items-center justify-between">
					<div>
						<h3 className="text-xl font-semibold">Total Users</h3>
						<p className="text-4xl font-bold mt-2">{stats.totalUsers || 0}</p>
					</div>
					<FaUsers className="text-5xl opacity-75" />
				</div>
				<div className="bg-green-500 text-white p-6 rounded-lg shadow-lg flex items-center justify-between">
					<div>
						<h3 className="text-xl font-semibold">Total Articles</h3>
						<p className="text-4xl font-bold mt-2">
							{stats.totalArticles || 0}
						</p>
					</div>
					<FaNewspaper className="text-5xl opacity-75" />
				</div>
				<div className="bg-purple-500 text-white p-6 rounded-lg shadow-lg flex items-center justify-between">
					<div>
						<h3 className="text-xl font-semibold">Total Views</h3>
						<p className="text-4xl font-bold mt-2">{stats.totalViews || 0}</p>
					</div>
					<FaEye className="text-5xl opacity-75" />
				</div>
				<div className="bg-lime-500 text-white p-6 rounded-lg shadow-lg flex items-center justify-between">
					<div>
						<h3 className="text-xl font-semibold">Approved Articles</h3>
						<p className="text-4xl font-bold mt-2">
							{stats.approvedArticles || 0}
						</p>
					</div>
					<FaCheckCircle className="text-5xl opacity-75" />
				</div>
				<div className="bg-yellow-500 text-white p-6 rounded-lg shadow-lg flex items-center justify-between">
					<div>
						<h3 className="text-xl font-semibold">Pending Articles</h3>
						<p className="text-4xl font-bold mt-2">
							{stats.pendingArticles || 0}
						</p>
					</div>
					<FaHourglassHalf className="text-5xl opacity-75" />
				</div>
				<div className="bg-red-500 text-white p-6 rounded-lg shadow-lg flex items-center justify-between">
					<div>
						<h3 className="text-xl font-semibold">Declined Articles</h3>
						<p className="text-4xl font-bold mt-2">
							{stats.declinedArticles || 0}
						</p>
					</div>
					<FaTimesCircle className="text-5xl opacity-75" />
				</div>
			</div>

			{/* Charts Section */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Top 5 Most Viewed Articles Bar Chart */}
				<div className="bg-white p-6 rounded-lg shadow-lg">
					<h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
						Top 5 Most Viewed Articles
					</h3>
					{topArticlesData && topArticlesData.length > 0 ? (
						<ResponsiveContainer width="100%" height={300}>
							<BarChart
								data={topArticlesData}
								margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
							>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis
									dataKey="title"
									angle={-15}
									textAnchor="end"
									height={60}
									interval={0}
									style={{ fontSize: "10px" }}
								/>
								<YAxis />
								<Tooltip />
								<Legend />
								<Bar dataKey="views" fill="#8884d8" name="Views" />
							</BarChart>
						</ResponsiveContainer>
					) : (
						<p className="text-center text-gray-500">
							No data for top articles yet.
						</p>
					)}
				</div>

				{/* Article Distribution by Publisher Pie Chart */}
				<div className="bg-white p-6 rounded-lg shadow-lg">
					<h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
						Articles by Publisher
					</h3>
					{publisherData && publisherData.length > 0 ? (
						<ResponsiveContainer width="100%" height={300}>
							<PieChart>
								<Pie
									data={publisherData}
									cx="50%"
									cy="50%"
									labelLine={false}
									outerRadius={80}
									fill="#8884d8"
									dataKey="value"
									label={({ name, percent }) =>
										`${name} (${(percent * 100).toFixed(0)}%)`
									}
								>
									{publisherData.map((entry, index) => (
										<Cell
											key={`cell-${index}`}
											fill={PIE_COLORS[index % PIE_COLORS.length]}
										/>
									))}
								</Pie>
								<Tooltip />
								<Legend />
							</PieChart>
						</ResponsiveContainer>
					) : (
						<p className="text-center text-gray-500">
							No publisher data available.
						</p>
					)}
				</div>
			</div>
		</div>
	);
};

export default Statistics;
