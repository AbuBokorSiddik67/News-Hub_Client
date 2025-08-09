import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center p-4">
      <h1 className="text-9xl font-bold text-gray-800 mb-4 animate-bounce">404</h1>
      <p className="text-3xl font-semibold text-gray-600 mb-4">Page Not Found</p>
      <p className="text-lg text-gray-500 mb-8 max-w-lg">
        Page Not Found 404
      </p>
      <Link
        to="/"
        className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105"
      >
        Back To Home
      </Link>
    </div>
  );
};

export default NotFoundPage;