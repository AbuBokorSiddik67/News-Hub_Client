import React from "react";
import { Helmet } from "react-helmet";

const AboutUs = () => {
	return (
		<div className="container mx-auto px-4 py-12 bg-gray-50">
			<Helmet>
				<title>About Us</title>
			</Helmet>
			{/* Our Story Section */}
			<section className="mb-12 text-center">
				<h2 className="text-4xl font-extrabold text-gray-800 mb-6">About Us</h2>
				<p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
					Welcome to NewsHub, your go-to source for insightful articles and
					engaging content. We started NewsHub with a simple yet powerful idea:
					to create a platform where knowledge is shared, ideas are explored,
					and diverse perspectives are celebrated. In a world brimming with
					information, our goal is to deliver well-researched,
					thought-provoking, and accessible articles that truly resonate with
					our readers.
				</p>
				<p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed mt-4">
					We believe that every story has value, and every piece of information
					can spark curiosity and inspire growth. From humble beginnings, we've
					grown into a vibrant community thanks to our dedicated writers and
					engaged audience, all contributing to a richer understanding of the
					world around us.
				</p>
			</section>

			<hr className="my-10 border-gray-300" />

			{/* Mission and Vision Section */}
			<section className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
				<div className="bg-white p-8 rounded-lg shadow-lg">
					<h3 className="text-3xl font-bold text-gray-800 mb-4">Our Mission</h3>
					<p className="text-gray-700 leading-relaxed mb-4">
						Our mission at NewsHub is to empower and inform our readers through
						high-quality, diverse, and accessible content. We strive to:
					</p>
					<ul className="list-disc list-inside text-gray-700 space-y-2">
						<li>
							**Inspire Curiosity:** Encourage continuous learning and
							exploration across a wide range of topics.
						</li>
						<li>
							**Foster Understanding:** Provide clear, concise, and accurate
							information that helps readers make sense of complex subjects.
						</li>
						<li>
							**Amplify Voices:** Offer a platform for talented writers to share
							their expertise and unique insights.
						</li>
						<li>
							**Build Community:** Create a space where readers can engage with
							content, share their thoughts, and connect with like-minded
							individuals.
						</li>
					</ul>
				</div>

				<div className="bg-white p-8 rounded-lg shadow-lg">
					<h3 className="text-3xl font-bold text-gray-800 mb-4">Our Vision</h3>
					<p className="text-gray-700 leading-relaxed">
						We envision NewsHub as a leading digital publication, recognized for
						its commitment to journalistic integrity, diverse content, and
						community engagement. We aim to be the first choice for anyone
						seeking reliable, stimulating, and relevant articles that enrich
						their daily lives and expand their horizons.
					</p>
				</div>
			</section>

			<hr className="my-10 border-gray-300" />

			{/* What We Offer Section */}
			<section className="mb-12 text-center">
				<h3 className="text-3xl font-bold text-gray-800 mb-6">What We Offer</h3>
				<p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed mb-6">
					At NewsHub, you'll find a wide array of articles covering various
					categories, including but not limited to:
				</p>
				<div className="flex flex-wrap justify-center gap-4">
					<span className="bg-blue-100 text-blue-800 text-sm font-medium px-4 py-2 rounded-full shadow-md">
						Technology & Innovation
					</span>
					<span className="bg-green-100 text-green-800 text-sm font-medium px-4 py-2 rounded-full shadow-md">
						Science & Discovery
					</span>
					<span className="bg-purple-100 text-purple-800 text-sm font-medium px-4 py-2 rounded-full shadow-md">
						Culture & Lifestyle
					</span>
					<span className="bg-yellow-100 text-yellow-800 text-sm font-medium px-4 py-2 rounded-full shadow-md">
						Business & Finance
					</span>
					{/* Add more categories as needed */}
					<span className="bg-red-100 text-red-800 text-sm font-medium px-4 py-2 rounded-full shadow-md">
						[Your Custom Category]
					</span>
				</div>
				<p className="text-gray-700 leading-relaxed mt-6">
					We are committed to delivering fresh content regularly, ensuring
					there's always something new and exciting to discover.
				</p>
			</section>

			<hr className="my-10 border-gray-300" />

			{/* Meet the Team Section */}
			<section className="mb-12 text-center">
				<h3 className="text-3xl font-bold text-gray-800 mb-6">Meet the Team</h3>
				<p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed mb-8">
					Behind NewsHub is a passionate team of writers, editors, and
					developers dedicated to bringing you the best content experience. Our
					diverse backgrounds and shared commitment to excellence drive us to
					produce articles that are not only informative but also enjoyable to
					read.
				</p>
				{/* Optional: Add team member cards here */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
					{/* Example Team Member Card */}
					{/*
                    <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
                        <img src="https://via.placeholder.com/100" alt="Team Member Name" className="w-24 h-24 rounded-full object-cover mb-4 border-2 border-blue-400" />
                        <h4 className="text-xl font-semibold text-gray-800">John Doe</h4>
                        <p className="text-blue-600 mb-2">Founder & Editor-in-Chief</p>
                        <p className="text-gray-600 text-sm">John is passionate about technology and aims to make complex topics easy to understand for everyone.</p>
                    </div>
                    */}
					{/* Repeat for other team members */}
				</div>
			</section>

			<hr className="my-10 border-gray-300" />

			{/* Call to Action Section */}
			<section className="text-center bg-blue-600 text-white p-8 rounded-lg shadow-xl">
				<h3 className="text-3xl font-bold mb-4">Join Our Journey</h3>
				<p className="text-lg mb-6 max-w-2xl mx-auto">
					We invite you to explore our articles, share your feedback, and become
					a part of the NewsHub community. Your engagement fuels our passion,
					and we're always eager to hear from you.
				</p>
				<button className="bg-white text-blue-600 font-bold py-3 px-8 rounded-full shadow-lg hover:bg-gray-100 transition-colors duration-300">
					Explore Articles
				</button>
			</section>
		</div>
	);
};

export default AboutUs;
