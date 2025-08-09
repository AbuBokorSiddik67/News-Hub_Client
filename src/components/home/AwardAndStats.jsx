// src/components/home/AwardAndStats.jsx
import CountUp from "react-countup"; // react-countup for animated numbers
import { useInView } from "react-intersection-observer"; // To trigger animation when component is in view

const AwardAndStats = () => {
	// useInView hook to detect when the component enters the viewport
	// `ref` to attach to the element you want to observe
	// `inView` will be true when the element is visible
	const { ref, inView } = useInView({
		triggerOnce: true, // Only trigger the animation once
		threshold: 0.1, // Trigger when 10% of the component is visible
	});

	// Define your statistics data
	const stats = [
		{ label: "Total Articles Published", value: 1200, prefix: "" },
		{ label: "Registered Users", value: 5000, prefix: "" },
		{ label: "Daily Visitors", value: 15000, prefix: "" },
		{ label: "Awards Won", value: 10, prefix: "" },
	];

	return (
		<div className="container mx-auto py-8" ref={ref}>
			{" "}
			{/* Attach ref to the container */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
				{stats.map((stat, index) => (
					<div
						key={index}
						className="bg-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300"
					>
						<h3 className="text-5xl font-extrabold text-blue-600 mb-2">
							{inView ? ( // Only animate if component is in view
								<CountUp
									start={0}
									end={stat.value}
									duration={2.75} // Animation duration in seconds
									separator="," // Thousand separator
									prefix={stat.prefix} // Prefix if any (e.g., "$")
									enableScrollSpy={true} // Enable scroll spy to start counting on scroll
									scrollSpyOnce={true} // Only count up once
								/>
							) : (
								// Show static value if not in view yet (optional, for initial render)
								<span>
									{stat.prefix}
									{stat.value.toLocaleString()}
								</span>
							)}
							+
						</h3>
						<p className="text-xl font-semibold text-gray-700">{stat.label}</p>
					</div>
				))}
			</div>
		</div>
	);
};

export default AwardAndStats;
