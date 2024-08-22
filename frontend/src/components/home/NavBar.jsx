import React, { useState, useEffect } from "react";

import createApiInstance from "../../interceptors/interceptor.js";

import { Link, useLocation, useNavigate } from "react-router-dom";

const api = createApiInstance();

async function refreshToken() {
  try {
    const response = await api.post("/refresh");
    if (response.status === 200) {
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
    const response = await api.post("/logout");
    if (response.status === 200) {
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
    const response = await api.get("/me");
    if (response.status === 200) {
      console.log("User is authenticated from Home");
      setUser(response.data);
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

function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    getData(navigate, setUser);
    console.log("Location: ", location.pathname);
  }, [location.pathname]);
  const [user, setUser] = useState({
    name: "",
    email: "",
    createdAt: "",
    avatar: "",
  });
  return location.pathname != "/login" && location.pathname != "/signup" ? (
    <nav className="flex flex-row items-center justify-around w-full bg-slate-100 p-4 h-32 fixed z-50 text-gray-900 top-0 left-0">
      <div className="w-24 h-24 rounded-full">
        <img
          src={user.avatar}
          alt="avatar"
          className="w-24 h-24 rounded-full"
        />
      </div>
      <div className="flex flex-col items-start justify-start">
        <h2 className="text-2xl font-bold mb-1  text-center">
          Welcome {user.name}
        </h2>
        <p className="text-lg font-medium mb-1  text-center">
          Email: {user.email}
        </p>
        <p className="text-lg font-medium mb-1  text-center">
          Created At: {new Date(user.createdAt).toLocaleString("en-US")}
        </p>
      </div>
      <Link
        className="w-48 p-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 text-center"
        to="/products"
      >
        Products
      </Link>
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
        className="w-48 p-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600"
      >
        Logout
      </button>
    </nav>
  ) : null;
}

export default NavBar;
