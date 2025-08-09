import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import NotFoundPage from "../pages/NotFoundPage";
import Login from "../pages/Login";
import Register from "../pages/Register";
import AddArticle from "../pages/AddArticle";
import AllArticles from "../pages/AllArticles";
import MyProfile from "../components/shared/MyProfile";
import Subscription from "../pages/Subscription";
import MyArticles from "../pages/MyArticles";
import AboutUs from "../pages/AboutUs";
import ReadDetails from "../pages/ReadDetails";
import Dashboard from "../layouts/Dashboard";
import AdminRoute from "./AdminRoute";
import AllUsers from "../pages/admin/AllUsers";
import EditProfile from "../pages/EditProfile";
import PrivateRoute from "./PrivateRoute";
import ManageArticles from "../pages/admin/ManageArticles";
import EditArticle from "../components/dashboard/EditArticle";
import AddPublisher from "../pages/admin/AddPublisher";
import Statistics from "../pages/admin/Statistics";
import PremiumArticlesSection from "../pages/PremiumArticlesSection";
import PremiumArticleDetails from "../pages/PremiumArticleDetails";
import SubscriptionPageRoot from "../pages/SubscriptionPage";
import PremiumRoute from "./PremiumRoute";
import PaymentPage from "../pages/PaymentPage";
import Payment from "../pages/Payment/Payment";
import SubscriptionPage from "../pages/SubscriptionPage";
import PaymentHistory from "../pages/Payment/PaymentHistory";

const router = createBrowserRouter([
	{
		path: "/",
		element: <MainLayout />,
		errorElement: <NotFoundPage />,
		children: [
			{ index: true, element: <Home></Home> },
			{
				path: "/",
				element: <Home />,
			},
			{
				path: "/profile",
				element: (
					<PrivateRoute>
						<MyProfile></MyProfile>
					</PrivateRoute>
				),
			},
			{
				path: "/login",
				element: <Login />,
			},
			{
				path: "/register",
				element: <Register />,
			},
			{
				path: "/add-article",
				element: (
					<PrivateRoute>
						<AddArticle />
					</PrivateRoute>
				),
			},
			{
				path: "/all-articles",
				element: <AllArticles />,
			},
			{
				path: "/subscription",
				element: (
					<PrivateRoute>
						<SubscriptionPage />
					</PrivateRoute>
				),
			},
			{
				path: "/payment-process",
				element: (
					<PrivateRoute>
						<Payment />
					</PrivateRoute>
				),
			},
			{
				path: "/payment",
				element: (
					<PrivateRoute>
						<PaymentPage />
					</PrivateRoute>
				),
			},
			{
				path: "/my-articles",
				element: (
					<PrivateRoute>
						<MyArticles />
					</PrivateRoute>
				),
			},
			{
				path: "/premium-article",
				element: (
					<PrivateRoute>
						<PremiumArticlesSection />
					</PrivateRoute>
				),
			},
			{
				path: "/premium-articles/:id",
				element: (
					<PrivateRoute>
						<PremiumRoute>
							<PremiumArticleDetails />
						</PremiumRoute>
					</PrivateRoute>
				),
			},
			{
				path: "/about-us",
				element: <AboutUs />,
			},
			{
				path: "/articles/:id",
				element: (
					<PrivateRoute>
						<ReadDetails />
					</PrivateRoute>
				),
			},
		],
	},
	{
		path: "/dashboard",
		element: (
			<PrivateRoute>
				<Dashboard />
			</PrivateRoute>
		),
		errorElement: <NotFoundPage />,
		children: [
			{
				index: true,
				element: (
					<PrivateRoute>
						<MyProfile />
					</PrivateRoute>
				),
			},
			{
				path: "/dashboard/all-users",
				element: (
					<PrivateRoute>
						<AdminRoute>
							<AllUsers />
						</AdminRoute>
					</PrivateRoute>
				),
			},
			{
				path: "/dashboard/statistics",
				element: (
					<PrivateRoute>
						<AdminRoute>
							<Statistics />
						</AdminRoute>
					</PrivateRoute>
				),
			},
			{
				path: "/dashboard/add-publisher",
				element: (
					<PrivateRoute>
						<AdminRoute>
							<AddPublisher />
						</AdminRoute>
					</PrivateRoute>
				),
			},
			{
				path: "/dashboard/all-articles-admin",
				element: (
					<PrivateRoute>
						<AdminRoute>
							<ManageArticles />
						</AdminRoute>
					</PrivateRoute>
				),
			},
			{
				path: "/dashboard/payment-history",
				element: (
					<PrivateRoute>
						<PaymentHistory></PaymentHistory>
					</PrivateRoute>
				),
			},
			{
				path: "/dashboard/add-article",
				element: (
					<PrivateRoute>
						<AddArticle></AddArticle>
					</PrivateRoute>
				),
			},
			{
				path: "/dashboard/my-profile",
				element: (
					<PrivateRoute>
						<MyProfile />
					</PrivateRoute>
				),
			},
			{
				path: "/dashboard/my-articles",
				element: (
					<PrivateRoute>
						<MyArticles />
					</PrivateRoute>
				),
			},
			{
				path: "/dashboard/edit-profile",
				element: (
					<PrivateRoute>
						<EditProfile />
					</PrivateRoute>
				),
			},
			{
				path: "/dashboard/update-article/:id",
				element: (
					<PrivateRoute>
						<EditArticle />
					</PrivateRoute>
				),
			},
		],
	},
]);

// This line is crucial for 'default' export
export default router;
