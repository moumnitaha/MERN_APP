import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

async function refreshToken() {
  try {
    const response = await fetch("http://localhost:3000/refresh", {
      method: "POST",
      credentials: "include",
    });
    if (response.ok) {
      console.log("Token refreshed successfully");
    } else {
      console.error("Error refreshing token");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

async function handleLogout(navigate) {
  try {
    const response = await fetch("http://localhost:3000/logout", {
      method: "GET",
      credentials: "include",
    });
    if (response.ok) {
      console.log("User logged out successfully");
      navigate("/login");
    } else {
      console.error("Error logging out user");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

const getData = async (navigate, setUser) => {
  try {
    const response = await fetch("http://localhost:3000/me", {
      method: "GET",
      credentials: "include",
    });
    if (response.ok) {
      console.log("User is authenticated from Home");
      const data = await response.json();
      console.log(data);
      setUser(data);
    } else {
      console.error("User is not authenticated");
      navigate("/login");
      return;
    }
  } catch (error) {
    console.error("Error:", error);
    navigate("/login");
  }
};

function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    email: "",
    createdAt: "",
  });
  useEffect(() => {
    getData(navigate, setUser);
  }, []);
  return (
    <section className="bg-gray-100 flex flex-row items-start justify-around min-h-screen">
      <nav className="flex flex-row items-center justify-around w-svw bg-blue-200 p-4">
        <div className="flex flex-col items-start justify-start">
          <h2 className="text-2xl font-bold mb-1 text-gray-900 text-center">
            Welcome {user.name}
          </h2>
          <p className="text-lg font-medium mb-1 text-gray-900 text-center">
            Email: {user.email}
          </p>
          <p className="text-lg font-medium mb-1 text-gray-900 text-center">
            Created At: {new Date(user.createdAt).toLocaleString("en-US")}
          </p>
        </div>
        <Link
          className="w-48 p-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 text-center"
          to="/login"
        >
          Login
        </Link>
        <Link
          className="w-48 p-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 text-center"
          to="/signup"
        >
          Signup
        </Link>
        <button
          className="w-48 p-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600"
          onClick={refreshToken}
        >
          Refresh Token
        </button>
        <button
          onClick={() => handleLogout(navigate)}
          className="w-48 p-3 bg-red-500 text-white rounded-lg font-medium hover:bg-blue-600"
        >
          Logout
        </button>
      </nav>
    </section>
  );
}

export default Home;
