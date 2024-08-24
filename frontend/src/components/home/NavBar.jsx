import React, { useState, useEffect, useContext } from "react";

import createApiInstance from "../../interceptors/interceptor.js";

import { Link, useLocation, useNavigate } from "react-router-dom";

import { AuthContext } from "../../lib/AuthProvider.jsx";

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

function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    user: me,
    loading,
    isAuthenticated,
    handleLogout,
  } = useContext(AuthContext);
  useEffect(() => {
    if (isAuthenticated) {
      if (["/login", "/signup"].includes(location.pathname)) {
        navigate("/home");
      }
      setUser({ user, ...me });
    } else {
      if (!["/login", "/signup", "/"].includes(location.pathname)) {
        navigate("/login");
      }
    }
  }, [isAuthenticated, location.pathname, me]);
  const [user, setUser] = useState({
    name: "",
    email: "",
    createdAt: "",
    avatar: "",
    ...me,
  });
  return isAuthenticated && location.pathname !== "/" ? (
    <nav className="flex flex-col items-center justify-around w-60 bg-slate-100 p-4 h-svh fixed z-40 text-gray-900 top-0 left-0">
      <div className="w-24 h-24 rounded-full">
        <img
          src={user.avatar}
          alt="avatar"
          className="w-24 h-24 rounded-full"
        />
      </div>
      <div className="flex flex-col items-center justify-start">
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
        to="/"
      >
        Home
      </Link>
      <Link
        className="w-48 p-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 text-center"
        to="/products"
      >
        Products
      </Link>
      <Link
        className="w-48 p-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 text-center"
        to="/addProduct"
      >
        Add Product
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
        onClick={handleLogout}
        className="w-48 p-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600"
      >
        Logout
      </button>
    </nav>
  ) : null;
}

export default NavBar;
