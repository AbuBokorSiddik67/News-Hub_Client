import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form"; // React Hook Form for form handling
import useAuth from "../hooks/useAuth"; // Your custom useAuth hook
import Swal from "sweetalert2"; // SweetAlert2 for notifications
import { FcGoogle } from "react-icons/fc"; // Google icon from react-icons
import useAxiosPublic from "../hooks/useAxiosPublic";
import { Helmet } from "react-helmet";

const Login = () => {
	const { signIn, googleSignIn } = useAuth(); // Get signIn and googleSignIn functions from AuthContext
	const navigate = useNavigate(); // For programmatic navigation after login
	const location = useLocation(); // To redirect user back to their previous page
	const axiosPublic = useAxiosPublic();

	// useForm hook from React Hook Form for form validation and submission
	const {
		register, // Function to register form inputs
		handleSubmit, // Function to handle form submission
		formState: { errors }, // Object containing form errors
		reset, // Function to reset form fields
	} = useForm();

	// Redirect path after successful login
	// Defaults to home page, but can be previous location
	const from = location.state?.from?.pathname || "/";

	// Handle email/password login form submission
	const handleLogin = (data) => {
		signIn(data.email, data.password)
			.then((result) => {
				const user = result.user;
				console.log("User logged in:", user);
				reset(); // Clear form fields

				Swal.fire({
					icon: "success",
					title: "Login Successful!",
					text: `Welcome back, ${user.displayName || user.email}!`,
					position: "top-end",
					showConfirmButton: false,
					timer: 1500,
				});

				navigate(from, { replace: true }); // Navigate user to previous page or home
			})
			.catch((error) => {
				console.error("Login Error:", error.message);
				let errorMessage = "An unknown error occurred. Please try again.";
				if (error.code === "auth/invalid-credential") {
					errorMessage =
						"Invalid email or password. Please check your credentials.";
				} else if (error.code === "auth/user-disabled") {
					errorMessage =
						"Your account has been disabled. Please contact support.";
				}
				Swal.fire({
					icon: "error",
					title: "Login Failed!",
					text: errorMessage,
					position: "top-end",
					showConfirmButton: false,
					timer: 3000,
				});
			});
	};

	// Handle Google Sign-In
	const handleGoogleSignIn = () => {
		googleSignIn()
			.then((result) => {
				const user = result.user;

				// Backend-এ user info 
				const userInfo = {
					email: user.email,
					name: user.displayName,
					photoURL: user.photoURL,
					role: "user",
					premiumTaken: false,
				};

				axiosPublic.post("/users", userInfo).then(() => {
					Swal.fire({
						icon: "success",
						title: "Google Login Successful!",
						text: `Welcome, ${user.displayName || user.email}!`,
						position: "top-end",
						showConfirmButton: false,
						timer: 1500,
					});
					navigate(from, { replace: true });
				});
			})
			.catch((error) => {
				console.error("Google Login Error:", error.message);
				Swal.fire({
					icon: "error",
					title: "Google Login Failed!",
					text: "There was an issue with Google login. Please try again.",
					position: "top-end",
					showConfirmButton: false,
					timer: 3000,
				});
			});
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
			<Helmet>
				<title>Login</title>
			</Helmet>
			<div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
				<h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
					Login to NewsHub
				</h2>

				{/* Email/Password Login Form */}
				<form onSubmit={handleSubmit(handleLogin)} className="space-y-4">
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
							{...register("email", { required: "Email is required" })} // Register input with validation
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
							{...register("password", { required: "Password is required" })} // Register input with validation
							className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="••••••••"
						/>
						{errors.password && (
							<p className="text-red-500 text-sm mt-1">
								{errors.password.message}
							</p>
						)}
					</div>

					<button
						type="submit"
						className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-300 font-semibold"
					>
						Login
					</button>
				</form>

				<div className="flex items-center my-6">
					<div className="flex-grow border-t border-gray-300"></div>
					<span className="flex-shrink mx-4 text-gray-500">OR</span>
					<div className="flex-grow border-t border-gray-300"></div>
				</div>

				{/* Social Login Buttons */}
				<div className="space-y-4">
					<button
						onClick={handleGoogleSignIn}
						className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 transition-colors duration-300 font-semibold text-gray-700"
					>
						<FcGoogle className="text-2xl" /> Login with Google
					</button>
					{/* Add other social login buttons if needed, e.g., GitHub, Facebook */}
				</div>

				<p className="text-center text-gray-600 text-sm mt-6">
					Don't have an account?{" "}
					<Link
						to="/register"
						className="text-blue-600 hover:underline font-semibold"
					>
						Register Here
					</Link>
				</p>
			</div>
		</div>
	);
};

export default Login;
