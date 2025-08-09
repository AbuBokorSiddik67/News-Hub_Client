import React from "react";
import { Link } from "react-router";
import { Typewriter } from "react-simple-typewriter";

const HeroSection = () => {
	return (
		<section className="relative overflow-hidden py-28 md:py-40 lg:py-56 text-white">
			<div className="container mx-auto px-6 relative z-10 text-center">
				<h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 drop-shadow-2xl">
					Discover the World with{" "}
					<span className="text-teal-300">
						<Typewriter
							words={["NewsHub"]}
							loop={true}
							cursor
							cursorStyle="_"
							typeSpeed={200}
							deleteSpeed={100}
							delaySpeed={2000}
						/>
					</span>
				</h1>
				<p className="text-lg md:text-xl max-w-3xl mx-auto mb-10 font-light opacity-90">
					Your trusted source for insightful journalism, breaking news, and
					in-depth analysis from every corner of the globe.
				</p>
				<div className="flex flex-col sm:flex-row justify-center gap-6">
					<Link to="all-articles">
						<button className="px-8 py-3 bg-teal-400 text-gray-900 font-semibold rounded-full shadow-md hover:bg-teal-300 hover:scale-105 transition-all duration-300">
							Explore Articles
						</button>
					</Link>
					<Link to="/subscription">
						<button className="px-8 py-3 border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-indigo-800 hover:scale-105 transition-all duration-300">
						Unlock Premium Access
					</button>
					</Link>
				</div>
			</div>
		</section>
	);
};

export default HeroSection;
