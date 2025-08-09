// src/pages/admin/AllUsers.jsx (সাধারণত admin ফোল্ডারের ভেতরে থাকে)
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { FaTrashAlt, FaUserShield } from "react-icons/fa"; // Icons for delete and make admin
import Swal from "sweetalert2"; // For alerts and confirmations
import useAxiosSecure from "../../hooks/useAxiosSecure"; // Custom hook for secure axios instance
import LoadingSpinner from "../../components/shared/LoadingSpinner"; // Your loading spinner component

const AllUsers = () => {
	const axiosSecure = useAxiosSecure();

	// Fetch all users from the database using TanStack Query
	// The queryKey 'allUsers' ensures efficient caching and refetching
	const {
		data: users = [],
		isLoading,
		isError,
		error,
		refetch,
	} = useQuery({
		queryKey: ["allUsers"], // Unique key for this query
		queryFn: async () => {
			// Make a GET request to your backend endpoint for all users
			// This endpoint should be protected by verifyToken and verifyAdmin middlewares
			const res = await axiosSecure.get("/users");
			return res.data;
		},
	});

	// Handle making a user an admin
	const handleMakeAdmin = (user) => {
		Swal.fire({
			title: "Are you sure?",
			text: `Do you want to make ${user.name || user.email} an admin?`,
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Yes, make admin!",
		}).then(async (result) => {
			if (result.isConfirmed) {
				try {
					// Send a PATCH request to update user's role to 'admin'
					const res = await axiosSecure.patch(`/users/admin/${user._id}`);
					if (res.data.modifiedCount > 0) {
						refetch(); // Refetch users data to update the UI
						Swal.fire({
							position: "center",
							icon: "success",
							title: `${user.name || user.email} is now an Admin!`,
							showConfirmButton: false,
							timer: 1500,
						});
					} else {
						Swal.fire({
							position: "center",
							icon: "info",
							title: "User is already an admin or no change made.",
							showConfirmButton: false,
							timer: 1500,
						});
					}
				} catch (err) {
					console.error("Error making user admin:", err);
					Swal.fire({
						icon: "error",
						title: "Oops...",
						text: err.response?.data?.message || "Failed to make user admin!",
					});
				}
			}
		});
	};

	// Handle deleting a user
	const handleDeleteUser = (user) => {
		Swal.fire({
			title: "Are you sure?",
			text: `You are about to delete ${
				user.name || user.email
			}. This cannot be undone!`,
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Yes, delete it!",
		}).then(async (result) => {
			if (result.isConfirmed) {
				try {
					// Send a DELETE request to remove the user
					const res = await axiosSecure.delete(`/users/${user._id}`);
					if (res.data.deletedCount > 0) {
						refetch(); // Refetch users data to update the UI
						Swal.fire({
							position: "center",
							icon: "success",
							title: `${user.name || user.email} has been deleted!`,
							showConfirmButton: false,
							timer: 1500,
						});
					} else {
						Swal.fire({
							position: "center",
							icon: "info",
							title: "User not found or already deleted.",
							showConfirmButton: false,
							timer: 1500,
						});
					}
				} catch (err) {
					console.error("Error deleting user:", err);
					Swal.fire({
						icon: "error",
						title: "Oops...",
						text: err.response?.data?.message || "Failed to delete user!",
					});
				}
			}
		});
	};

	if (isLoading) {
		return <LoadingSpinner />;
	}

	if (isError) {
		return (
			<div className="flex justify-center items-center h-screen text-red-600 text-xl">
				Error loading users: {error.message}
			</div>
		);
	}

	return (
		<div className="p-4 sm:p-6 lg:p-8 bg-white rounded-lg shadow-md min-h-[calc(100vh-80px)]">
			<h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
				All Users: {users.length}
			</h2>

			<div className="overflow-x-auto relative shadow-md sm:rounded-lg">
				<table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
					<thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
						<tr>
							<th scope="col" className="py-3 px-6">
								#
							</th>
							<th scope="col" className="py-3 px-6">
								Name
							</th>
							<th scope="col" className="py-3 px-6">
								Email
							</th>
							<th scope="col" className="py-3 px-6">
								Role
							</th>
							<th scope="col" className="py-3 px-6">
								Action (Make Admin)
							</th>
							<th scope="col" className="py-3 px-6">
								Action (Delete)
							</th>
						</tr>
					</thead>
					<tbody>
						{users.map((user, index) => (
							<tr
								key={user._id}
								className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
							>
								<th
									scope="row"
									className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
								>
									{index + 1}
								</th>
								<td className="py-4 px-6">{user.name || "N/A"}</td>
								<td className="py-4 px-6">{user.email}</td>
								<td className="py-4 px-6">
									{user.role === "admin" ? (
										<span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">
											Admin
										</span>
									) : (
										<span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">
											User
										</span>
									)}
								</td>
								<td className="py-4 px-6">
									{user.role === "admin" ? (
										<button
											disabled
											className="bg-gray-300 text-gray-600 p-2 rounded-full cursor-not-allowed"
										>
											<FaUserShield className="text-lg" />
										</button>
									) : (
										<button
											onClick={() => handleMakeAdmin(user)}
											className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full transition-colors duration-200"
											title="Make Admin"
										>
											<FaUserShield className="text-lg" />
										</button>
									)}
								</td>
								<td className="py-4 px-6">
									<button
										onClick={() => handleDeleteUser(user)}
										className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors duration-200"
										title="Delete User"
									>
										<FaTrashAlt className="text-lg" />
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{users.length === 0 && !isLoading && (
				<p className="text-center text-gray-500 mt-8 text-lg">
					No users found.
				</p>
			)}
		</div>
	);
};

export default AllUsers;
