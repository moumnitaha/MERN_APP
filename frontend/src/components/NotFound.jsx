import React from "react";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <section className="w-svw h-svh flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 text-center">
          404 Not Found
        </h2>
        <p className="text-gray-700 text-center">
          The page you are looking for does not exist.
        </p>
        <Link to="/home" className="text-blue-500 hover:underline mt-6">
          Go Home
        </Link>
      </div>
    </section>
  );
}

export default NotFound;
