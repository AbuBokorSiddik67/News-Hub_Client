import React from "react";
import TrendingArticlesSlider from "../components/home/TrendingArticlesSlider";
import PublisherSection from "../components/home/PublisherSection";
import AwardAndStats from "../components/home/AwardAndStats";
import Subscription from "./Subscription";
import JoinUsSection from "../components/home/JoinUsSection";
import FAQSection from "../components/home/FAQSection";
import HeroSection from "../components/home/HeroSection";
import { Helmet } from "react-helmet";

const Home = () => {
	return (
		<div className="font-sans antialiased text-gray-900 dark:bg-gray-950 dark:text-gray-100">
			<Helmet>
				<title>Home</title>
			</Helmet>
			{/* Hero Banner */}
			<HeroSection></HeroSection>

			{/* Trending Articles */}
			<section className="py-20 bg-gray-50 dark:bg-gray-900 relative overflow-hidden">
				<div className="absolute inset-0 z-0 opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/light-honeycomb.png')] dark:bg-[url('https://www.transparenttextures.com/patterns/black-linen.png')]"></div>
				<div className="container mx-auto px-6 relative z-10">
					<h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 dark:text-white text-center mb-16">
						<span className="pb-3 border-b-4 border-red-500 dark:border-red-400">
							Trending Now
						</span>
						<p className="text-lg font-normal text-gray-600 dark:text-gray-400 mt-4">
							Discover what's hot and engaging this week.
						</p>
					</h2>
					<TrendingArticlesSlider />
				</div>
			</section>

			{/* Publishers */}
			<section className="py-20 bg-white dark:bg-gray-800 relative overflow-hidden">
				<div className="container mx-auto px-6">
					<h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 dark:text-white text-center mb-16">
						<span className="pb-3 border-b-4 border-indigo-500 dark:border-indigo-400">
							Our Esteemed Publishers
						</span>
						<p className="text-lg font-normal text-gray-600 dark:text-gray-400 mt-4">
							Bringing you diverse perspectives and reliable sources.
						</p>
					</h2>
					<PublisherSection />
				</div>
			</section>

			{/* Subscription */}
			<section className="py-24 bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 relative overflow-hidden">
				<div className="container mx-auto px-6">
					<Subscription />
				</div>
			</section>

			{/* Awards */}
			<section className="py-24 bg-gray-900 dark:bg-black text-white relative overflow-hidden">
				<div className="absolute inset-0 z-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/criss-cross.png')]"></div>
				<div className="container mx-auto px-6 relative z-10">
					<h2 className="text-4xl md:text-5xl font-extrabold text-center mb-16">
						<span className="pb-3 border-b-4 border-green-400">
							NewsHub Achievements
						</span>
						<p className="text-lg font-normal text-gray-300 mt-4">
							Recognized for excellence in journalism and community growth.
						</p>
					</h2>
					<AwardAndStats />
				</div>
			</section>

			{/* FAQ */}
			<section className="py-20 bg-white dark:bg-gray-800 relative overflow-hidden">
				<div className="absolute inset-0 z-0 opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/axiom-pattern.png')] dark:bg-[url('https://www.transparenttextures.com/patterns/dark-fish-skin.png')]"></div>
				<div className="container mx-auto px-6 relative z-10">
					<FAQSection />
				</div>
			</section>

			{/* Join Us */}
			<section className="py-20 bg-gradient-to-tr from-green-500 to-blue-600 text-white shadow-xl relative overflow-hidden">
				<div className="absolute inset-0 z-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
				<div className="container mx-auto px-6 relative z-10">
					<JoinUsSection />
				</div>
			</section>
		</div>
	);
};

export default Home;
