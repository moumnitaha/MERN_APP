import React, { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../lib/AuthProvider";

function Landing() {
  const { isAuthenticated, user } = useContext(AuthContext);
  const navigate = useNavigate();
  useEffect(() => {
    console.log("isAuthenticated: ", isAuthenticated);
    if (isAuthenticated) {
      console.log("User is authenticated from Landing");
      //   navigate("/home");
    }
  }, []);
  return (
    <section className="bg-gray-100 flex items-center justify-around min-h-screen flex-col w-svw h-svh">
      <h1 className="text-4xl font-bold text-gray-900">
        Welcome to the Landing Page
      </h1>
      <p className="text-2xl font-medium text-gray-900">
        This is a landing page for the application.
      </p>
      {isAuthenticated ? (
        <>
          <img
            src={user.avatar}
            alt="avatar"
            className="w-24 h-24 rounded-full"
          />
          <h2 className="text-2xl font-bold text-gray-900">
            Welcome {user.name}
          </h2>
          <Link
            to="/home"
            className="w-48 p-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 text-center"
          >
            Home
          </Link>
        </>
      ) : (
        <>
          <Link
            to="/login"
            className="w-48 p-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 text-center"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="w-48 p-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 text-center"
          >
            Signup
          </Link>
        </>
      )}
    </section>
  );
}

export default Landing;
