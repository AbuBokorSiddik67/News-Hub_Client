// src/components/shared/Navbar.jsx
import { Link, NavLink } from "react-router-dom";
import useAuth from "../../hooks/useAuth"; // Your useAuth hook
import { useState } from "react";
import { RxHamburgerMenu } from "react-icons/rx"; // Hamburger menu icon
import { CgClose } from "react-icons/cg"; // Close icon
import { AiOutlineLogout } from "react-icons/ai"; // Logout icon
import Swal from "sweetalert2"; // SweetAlert2 for notifications
import useIsPremium from "../../hooks/useIsPremium";

const Navbar = () => {
	const { user, logOut } = useAuth(); // User and logout function from AuthContext
	// const [isAdmin] = useAdmin(); // isAdmin status from useAdmin hook
	const [isOpen, setIsOpen] = useState(false); // State for mobile menu toggle
	const { isPremium } = useIsPremium();

	// Function to handle user logout
	const handleLogout = () => {
		logOut()
			.then(() => {
				// SweetAlert notification for successful logout
				Swal.fire({
					icon: "success",
					title: "Logout Successful!",
					text: "You have been successfully logged out.",
					position: "top-end",
					showConfirmButton: false,
					timer: 1500,
				});
				setIsOpen(false); // Close mobile menu after logout
			})
			.catch((error) => {
				console.error(error);
				Swal.fire({
					icon: "error",
					title: "Logout Failed!",
					text: "There was an issue logging out. Please try again.",
					position: "top-end",
					showConfirmButton: false,
					timer: 1500,
				});
			});
	};

	// Navigation links (conditionally rendered)
	const navLinks = (
		<>
			<li>
				<NavLink
					to="/"
					className={({ isActive }) =>
						isActive
							? "text-blue-600 font-bold border-b-2 border-blue-600 pb-1"
							: "text-gray-700 hover:text-blue-600 transition-colors duration-200"
					}
				>
					Home
				</NavLink>
			</li>
			{user && ( // Show "Add Articles" if user is logged in
				<li>
					<NavLink
						to="/add-article"
						className={({ isActive }) =>
							isActive
								? "text-blue-600 font-bold border-b-2 border-blue-600 pb-1"
								: "text-gray-700 hover:text-blue-600 transition-colors duration-200"
						}
					>
						Add Articles
					</NavLink>
				</li>
			)}
			{isPremium && ( // Show "Add Articles" if user is logged in
				<li>
					<NavLink
						to="/premium-article"
						className={({ isActive }) =>
							isActive
								? "text-blue-600 font-bold border-b-2 border-blue-600 pb-1"
								: "text-gray-700 hover:text-blue-600 transition-colors duration-200"
						}
					>
						Premium Articles
					</NavLink>
				</li>
			)}
			<li>
				<NavLink
					to="/all-articles"
					className={({ isActive }) =>
						isActive
							? "text-blue-600 font-bold border-b-2 border-blue-600 pb-1"
							: "text-gray-700 hover:text-blue-600 transition-colors duration-200"
					}
				>
					All Articles
				</NavLink>
			</li>
			{user && ( // Show "Subscription" if user is logged in
				<li>
					<NavLink
						to="/subscription"
						className={({ isActive }) =>
							isActive
								? "text-blue-600 font-bold border-b-2 border-blue-600 pb-1"
								: "text-gray-700 hover:text-blue-600 transition-colors duration-200"
						}
					>
						Subscription
					</NavLink>
				</li>
			)}
			{user && ( // Show "Dashboard" if user is logged in AND is Admin
				<li>
					<NavLink
						to="/dashboard" // Default dashboard page
						className={({ isActive }) =>
							isActive
								? "text-blue-600 font-bold border-b-2 border-blue-600 pb-1"
								: "text-gray-700 hover:text-blue-600 transition-colors duration-200"
						}
					>
						Dashboard
					</NavLink>
				</li>
			)}
			{user && ( // Show "My Articles" if user is logged in
				<li>
					<NavLink
						to="/my-articles"
						className={({ isActive }) =>
							isActive
								? "text-blue-600 font-bold border-b-2 border-blue-600 pb-1"
								: "text-gray-700 hover:text-blue-600 transition-colors duration-200"
						}
					>
						My Articles
					</NavLink>
				</li>
			)}
			<li>
				<NavLink
					to="/about-us" // Optional About Us page
					className={({ isActive }) =>
						isActive
							? "text-blue-600 font-bold border-b-2 border-blue-600 pb-1"
							: "text-gray-700 hover:text-blue-600 transition-colors duration-200"
					}
				>
					About Us
				</NavLink>
			</li>
		</>
	);

	return (
		<nav className="bg-white shadow-md py-4 sticky top-0 z-50">
			{" "}
			{/* Sticky top-0 and z-50 for fixed navbar */}
			<div className="container mx-auto flex justify-between items-center px-4">
				{/* Logo and Website Name */}
				<Link
					to="/"
					className="flex items-center gap-2 text-2xl font-bold text-gray-800 hover:text-blue-600 transition-colors"
				>
					{/* Provide the path to your logo */}
					<img
						src="https://i.ibb.co/4n5wbh5b/logo.png"
						alt="NewsHub Logo"
						className="h-9 w-9 object-contain"
					/>{" "}
					{/* Placeholder logo */}
					NewsHub
				</Link>

				{/* Desktop Menu */}
				<ul className="hidden md:flex gap-6 items-center text-lg">
					{navLinks}
					{user ? (
						// If user is logged in, show profile picture and logout option
						<>
							<div className="relative group">
								<div className="w-10 h-10 rounded-full overflow-hidden border-2 border-blue-400 cursor-pointer">
									<img
										src={user.photoURL || "https://i.ibb.co/L67k5fN/user.png"} // Placeholder image if no photo
										alt="User Avatar"
										className="w-full h-full object-cover"
									/>
								</div>
								{/* Profile Dropdown */}
								<ul className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
									<li>
										<Link
											to="/profile"
											className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
										>
											My Profile
										</Link>
									</li>
									<li>
										<button
											onClick={handleLogout}
											className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 flex items-center gap-2"
										>
											<AiOutlineLogout /> Logout
										</button>
									</li>
								</ul>
							</div>
						</>
					) : (
						// If user is not logged in, show Login and Register buttons
						<>
							<li>
								<Link
									to="/login"
									className="px-5 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-600 hover:text-white transition-colors duration-300"
								>
									Login
								</Link>
							</li>
							<li>
								<Link
									to="/register"
									className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300"
								>
									Register
								</Link>
							</li>
						</>
					)}
				</ul>

				{/* Mobile Menu Toggle Button */}
				<div className="md:hidden flex items-center gap-3">
					{user ? (
						<div className="w-9 h-9 rounded-full overflow-hidden border-2 border-blue-400 cursor-pointer">
							<img
								src={user.photoURL || "https://i.ibb.co/L67k5fN/user.png"}
								alt="User Avatar"
								className="w-full h-full object-cover"
							/>
						</div>
					) : (
						<Link
							to="/login"
							className="px-4 py-1.5 border border-blue-600 text-blue-600 text-sm rounded-md hover:bg-blue-600 hover:text-white transition-colors duration-300"
						>
							Login
						</Link>
					)}
					<button
						onClick={() => setIsOpen(!isOpen)}
						className="text-3xl text-gray-700 hover:text-blue-600 transition-colors"
					>
						{isOpen ? <CgClose /> : <RxHamburgerMenu />}
					</button>
				</div>

				{/* Mobile Menu Dropdown (conditionally displayed) */}
				{isOpen && (
					<ul className="absolute top-[72px] left-0 w-full bg-white shadow-lg py-4 px-4 md:hidden z-40 flex flex-col gap-2">
						{navLinks}
						{/* Logout button in mobile menu if user is logged in */}
						{user && (
							<li>
								<button
									onClick={handleLogout}
									className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 flex items-center gap-2"
								>
									<AiOutlineLogout /> Logout
								</button>
							</li>
						)}
						{/* Register button in mobile menu if user is not logged in */}
						{!user && (
							<li>
								<Link
									to="/register"
									className="w-full text-center px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300 mt-2 block"
								>
									Register
								</Link>
							</li>
						)}
					</ul>
				)}
			</div>
		</nav>
	);
};

export default Navbar;
