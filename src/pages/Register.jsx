// src/pages/Register.jsx
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form"; // React Hook Form for form handling
import useAuth from "../hooks/useAuth"; // Your custom useAuth hook
import Swal from "sweetalert2"; // SweetAlert2 for notifications
import { FcGoogle } from "react-icons/fc"; // Google icon from react-icons
import useAxiosPublic from "../hooks/useAxiosPublic"; // Your axiosPublic instance for backend calls
import { Helmet } from "react-helmet";

const Register = () => {
	const { createUser, googleSignIn, updateUserProfile } = useAuth(); // Get auth functions
	const navigate = useNavigate(); // For programmatic navigation
	const axiosPublic = useAxiosPublic(); // Get axiosPublic instance

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
		watch, // To watch password field for confirmation
	} = useForm();

	// Watch the password field for validation
	const password = watch("password", "");

	// Handle email/password registration form submission
	const handleRegister = async (data) => {
		try {
			// 1. Create user in Firebase
			const result = await createUser(data.email, data.password);
			const user = result.user;
			console.log("User created in Firebase:", user);

			// 2. Update user profile with name and photo URL
			await updateUserProfile(data.name, data.photoURL);

			// 3. Save user info to your backend database
			const userInfo = {
				email: user.email,
				name: data.name,
				photoURL: data.photoURL,
				role: "user", // Default role for new users
				premiumTaken: false, // Default premium status for new users
			};
			const res = await axiosPublic.post("/users", userInfo); // Send to backend for saving user data
			console.log("User saved to DB:", res.data);

			reset(); // Clear form fields
			Swal.fire({
				icon: "success",
				title: "Registration Successful!",
				text: `Welcome, ${data.name}! Your account has been created.`,
				position: "top-end",
				showConfirmButton: false,
				timer: 1500,
			});

			// After successful registration and DB save, sign in the user
			// Note: createUser usually auto-signs in, but an explicit signIn or a refresh might be needed
			// If `createUser` immediately signs in, you might not need `signIn` here.
			// However, it's good to ensure a clean state by navigating.
			navigate("/"); // Redirect to home page or a dashboard for new users
		} catch (error) {
			console.error("Registration Error:", error.message);
			let errorMessage = "An unknown error occurred. Please try again.";
			if (error.code === "auth/email-already-in-use") {
				errorMessage =
					"This email is already registered. Please login or use a different email.";
			} else if (error.code === "auth/weak-password") {
				errorMessage = "Password should be at least 6 characters long.";
			} else if (error.code === "auth/invalid-email") {
				errorMessage = "Invalid email address.";
			}
			Swal.fire({
				icon: "error",
				title: "Registration Failed!",
				text: errorMessage,
				position: "top-end",
				showConfirmButton: false,
				timer: 3000,
			});
		}
	};

	// Handle Google Sign-In/Registration
	const handleGoogleSignIn = async () => {
		try {
			const result = await googleSignIn();
			const user = result.user;
			console.log("Google user:", user);

			// Save Google user info to your backend database (if they don't exist)
			const userInfo = {
				email: user.email,
				name: user.displayName,
				photoURL: user.photoURL,
				role: "user", // Default role
				premiumTaken: false, // Default premium status
			};

			// Axios Public to send user info to backend
			// Backend should handle checking if user already exists
			axiosPublic.post("/users", userInfo);
			// console.log("Google user added/updated in DB:", res.data);

			Swal.fire({
				icon: "success",
				title: "Google Sign-in Successful!",
				text: `Welcome, ${user.displayName || user.email}!`,
				position: "top-end",
				showConfirmButton: false,
				timer: 1500,
			});
			navigate("/"); // Redirect to home page
		} catch (error) {
			console.error("Google Sign-in Error:", error.message);
			Swal.fire({
				icon: "error",
				title: "Google Sign-in Failed!",
				text: "There was an issue with Google sign-in. Please try again.",
				position: "top-end",
				showConfirmButton: false,
				timer: 3000,
			});
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
			<Helmet>
				<title>Register</title>
			</Helmet>
			<div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
				<h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
					Register Your Account
				</h2>

				{/* Registration Form */}
				<form onSubmit={handleSubmit(handleRegister)} className="space-y-4">
					<div>
						<label
							htmlFor="name"
							className="block text-gray-700 text-sm font-semibold mb-2"
						>
							Full Name
						</label>
						<input
							type="text"
							id="name"
							{...register("name", { required: "Name is required" })}
							className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="John Doe"
						/>
						{errors.name && (
							<p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
						)}
					</div>

					<div>
						<label
							htmlFor="photoURL"
							className="block text-gray-700 text-sm font-semibold mb-2"
						>
							Photo URL (Optional)
						</label>
						<input
							type="url"
							id="photoURL"
							{...register("photoURL")} // Not required
							className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="https://example.com/your-photo.jpg"
						/>
						{errors.photoURL && (
							<p className="text-red-500 text-sm mt-1">
								{errors.photoURL.message}
							</p>
						)}
					</div>

					<div>
						<label
							htmlFor="email"
							className="block text-gray-700 text-sm font-semibold mb-2"
						>
							Email
						</label>
						<input
							type="email"
							id="email"
							{...register("email", { required: "Email is required" })}
							className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="your.email@example.com"
						/>
						{errors.email && (
							<p className="text-red-500 text-sm mt-1">
								{errors.email.message}
							</p>
						)}
					</div>

					<div>
						<label
							htmlFor="password"
							className="block text-gray-700 text-sm font-semibold mb-2"
						>
							Password
						</label>
						<input
							type="password"
							id="password"
							{...register("password", {
								required: "Password is required",
								minLength: {
									value: 6,
									message: "Password must be at least 6 characters",
								},
								pattern: {
									value: /(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z])/,
									message:
										"Password must have one uppercase, one lowercase, one number and one special character.",
								},
							})}
							className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="••••••••"
						/>
						{errors.password && (
							<p className="text-red-500 text-sm mt-1">
								{errors.password.message}
							</p>
						)}
					</div>

					<div>
						<label
							htmlFor="confirmPassword"
							className="block text-gray-700 text-sm font-semibold mb-2"
						>
							Confirm Password
						</label>
						<input
							type="password"
							id="confirmPassword"
							{...register("confirmPassword", {
								required: "Please confirm your password",
								validate: (value) =>
									value === password || "The passwords do not match", // Validate against 'password' field
							})}
							className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="••••••••"
						/>
						{errors.confirmPassword && (
							<p className="text-red-500 text-sm mt-1">
								{errors.confirmPassword.message}
							</p>
						)}
					</div>

					<button
						type="submit"
						className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-300 font-semibold"
					>
						Register
					</button>
				</form>

				<div className="flex items-center my-6">
					<div className="flex-grow border-t border-gray-300"></div>
					<span className="flex-shrink mx-4 text-gray-500">OR</span>
					<div className="flex-grow border-t border-gray-300"></div>
				</div>

				{/* Social Login/Register Buttons */}
				<div className="space-y-4">
					<button
						onClick={handleGoogleSignIn}
						className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 transition-colors duration-300 font-semibold text-gray-700"
					>
						<FcGoogle className="text-2xl" /> Register with Google
					</button>
					{/* Add other social login/register buttons if needed */}
				</div>

				<p className="text-center text-gray-600 text-sm mt-6">
					Already have an account?{" "}
					<Link
						to="/login"
						className="text-blue-600 hover:underline font-semibold"
					>
						Login Here
					</Link>
				</p>
			</div>
		</div>
	);
};

export default Register;
