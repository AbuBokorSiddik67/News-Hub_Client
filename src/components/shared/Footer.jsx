import { Link } from "react-router-dom"; 

const Footer = () => {
	return (
		<footer className="bg-gray-800 text-white p-10 mt-12">
			<div className="container mx-auto grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
				{/* Company Info / Logo Section */}
				<div className="flex flex-col items-center md:items-start text-center md:text-left">
					<Link
						to="/"
						className="flex items-center gap-2 text-2xl font-bold text-white hover:text-blue-400 transition-colors"
					>
						<img
							src="https://i.ibb.co/4n5wbh5b/logo.png"
							alt="NewsHub Logo"
							className="h-10 w-10 object-contain"
						/>{" "}
						{/* Your Logo */}
						NewsHub
					</Link>
					<p className="mt-4 text-gray-300 max-w-xs">
						Your daily source for comprehensive and up-to-date news from around
						the globe. Stay informed, stay ahead.
					</p>
				</div>

				{/* Quick Links Section */}
				<div>
					<h3 className="text-xl font-semibold mb-4 text-center md:text-left">
						Quick Links
					</h3>
					<ul className="space-y-2 text-center md:text-left">
						<li>
							<Link
								to="/about-us"
								className="text-gray-300 hover:text-blue-400 transition-colors"
							>
								About Us
							</Link>
						</li>
						<li>
							<Link
								to="/all-articles"
								className="text-gray-300 hover:text-blue-400 transition-colors"
							>
								All Articles
							</Link>
						</li>
						<li>
							<Link
								to="/subscription"
								className="text-gray-300 hover:text-blue-400 transition-colors"
							>
								Subscription
							</Link>
						</li>
						<li>
							<Link
								to="/my-articles"
								className="text-gray-300 hover:text-blue-400 transition-colors"
							>
								My Articles
							</Link>
						</li>
					</ul>
				</div>

				{/* Legal & Support Section */}
				<div>
					<h3 className="text-xl font-semibold mb-4 text-center md:text-left">
						Support
					</h3>
					<ul className="space-y-2 text-center md:text-left">
						<li>
							<Link
								to="/contact"
								className="text-gray-300 hover:text-blue-400 transition-colors"
							>
								Contact Us
							</Link>
						</li>
						<li>
							<Link
								to="/privacy-policy"
								className="text-gray-300 hover:text-blue-400 transition-colors"
							>
								Privacy Policy
							</Link>
						</li>
						<li>
							<Link
								to="/terms-of-service"
								className="text-gray-300 hover:text-blue-400 transition-colors"
							>
								Terms of Service
							</Link>
						</li>
						<li>
							<Link
								to="/faq"
								className="text-gray-300 hover:text-blue-400 transition-colors"
							>
								FAQ
							</Link>
						</li>
					</ul>
				</div>

				{/* Social Media Section (Optional) */}
				<div className="flex flex-col items-center md:items-start text-center md:text-left">
					<h3 className="text-xl font-semibold mb-4">Follow Us</h3>
					<div className="flex space-x-4">
						<a
							href="https://facebook.com"
							target="_blank"
							rel="noopener noreferrer"
							className="text-gray-300 hover:text-blue-400 transition-colors text-3xl"
						>
							<i className="fab fa-facebook"></i>{" "}
							{/* You'd typically use a React Icon here, e.g., <FaFacebook /> */}
						</a>
						<a
							href="https://twitter.com"
							target="_blank"
							rel="noopener noreferrer"
							className="text-gray-300 hover:text-blue-400 transition-colors text-3xl"
						>
							<i className="fab fa-twitter"></i> {/* <FaTwitter /> */}
						</a>
						<a
							href="https://instagram.com"
							target="_blank"
							rel="noopener noreferrer"
							className="text-gray-300 hover:text-blue-400 transition-colors text-3xl"
						>
							<i className="fab fa-instagram"></i> {/* <FaInstagram /> */}
						</a>
					</div>
					<p className="text-gray-400 text-sm mt-4">
						Stay connected on social media!
					</p>
				</div>
			</div>

			<div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-500">
				<p>
					Copyright © {new Date().getFullYear()} - All rights reserved by
					NewsHub.
				</p>
			</div>
		</footer>
	);
};

export default Footer;
