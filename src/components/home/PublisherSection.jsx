import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import LoadingSpinner from "../shared/LoadingSpinner";

const PublisherSection = () => {
	const axiosPublic = useAxiosPublic();

	const {
		data: publishers = [],
		isLoading,
		isError,
		error,
	} = useQuery({
		queryKey: ["publishers"],
		queryFn: async () => {
			const res = await axiosPublic.get("/publishers");
			return res.data;
		},
		staleTime: 1000 * 60 * 60, // Data will be considered fresh for 1 hour
	});

	if (isLoading) return <LoadingSpinner />;

	if (isError) {
		return (
			<div className="text-center text-red-600 dark:text-red-400 text-lg py-10">
				Error loading publishers: {error.message}
			</div>
		);
	}

	return (
		// The background of this section is now handled by the parent Home.jsx,
		// making this component more reusable and focused on its content.
		// We remove the outer background here to avoid conflicts.
		<div className="py-8">
			{" "}
			{/* Added some internal padding */}
			{publishers.length > 0 ? (
				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8">
					{publishers.map((publisher) => (
						<div
							key={publisher._id}
							className="group relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-700 dark:to-gray-800 rounded-2xl shadow-xl p-5 flex flex-col items-center text-center overflow-hidden
                                       transform hover:scale-105 hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
						>
							{/* Subtle light effect on hover */}
							<div className="absolute inset-0 bg-blue-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl"></div>

							<div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-blue-200 dark:border-blue-600 shadow-lg mb-4 bg-white dark:bg-gray-900 flex items-center justify-center p-2">
								<img
									src={publisher.logo}
									alt={publisher.name}
									className="w-full h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-500" // Grayscale on default, color on hover
								/>
							</div>
							<h3 className="text-xl font-bold text-gray-800 dark:text-white line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
								{publisher.name}
							</h3>
							{/* Optional: Add a subtle overlay on hover for a pop effect */}
							<div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-gray-900 to-transparent opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
						</div>
					))}
				</div>
			) : (
				<div className="text-center text-gray-600 dark:text-gray-400 text-2xl py-10">
					<p className="mb-4">No publishers found at the moment.</p>
					<p className="text-lg">Please check back later or contact support.</p>
				</div>
			)}
		</div>
	);
};

export default PublisherSection;
