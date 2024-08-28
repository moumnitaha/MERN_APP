import React, { useState, useEffect, useContext } from "react";
import createApiInstance from "../../interceptors/interceptor.js";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../lib/AuthProvider.jsx";
import {
  HomeIcon,
  BuildingStorefrontIcon,
  PlusCircleIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";

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
      console.log("User is authenticated from NavBar");
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
    <nav className="flex flex-col items-center justify-start w-60 bg-slate-100 p-4 h-svh fixed z-40 text-gray-900 top-0 left-0">
      <div className="w-full h-24 flex flex-row justify-between items-center">
        <img
          src={user.avatar}
          alt="avatar"
          className="w-12 h-12 rounded-full"
        />
        {/* <div className="flex flex-col items-start font-poppins"> */}
        <h2 className="text-xl font-bold text-center text-gray-800">
          Welcome {user.firstName}
        </h2>
        {/* <span className="text-sm font-medium text-center text-gray-400">
            {user.email}
          </span>
        </div> */}
      </div>
      {/* <div className="flex flex-col items-center justify-start mb-20 font-poppins"> */}
      {/* <p className="text-lg font-medium mb-1  text-center">
          Email: {user.email}
        </p>
        <p className="text-lg font-medium mb-1  text-center">
          Created At: {new Date(user.createdAt).toLocaleString("en-US")}
        </p> */}
      {/* </div> */}
      <hr className="w-full border-t-2 border-gray-300 my-2" />
      <div className="flex flex-col items-center justify-start h-full font-poppins">
        <Link
          className={`w-48 p-3 ${
            location.pathname === "/home"
              ? "bg-blue-100 text-blue-500"
              : "bg-transparent text-gray-800"
          }   rounded-md font-medium hover:bg-blue-100 m-1`}
          to="/home"
        >
          <HomeIcon className="h-5 w-5 inline-block mr-2" />
          Home
        </Link>
        <Link
          className={`w-48 p-3 ${
            location.pathname.includes("/product")
              ? "bg-blue-100 text-blue-500"
              : "bg-transparent text-gray-800"
          } rounded-md font-medium hover:bg-blue-100 m-1`}
          to="/products"
        >
          <BuildingStorefrontIcon className="h-5 w-5 inline-block mr-2" />
          Products
        </Link>
        <Link
          className={`w-48 p-3 ${
            location.pathname === "/addProduct"
              ? "bg-blue-100 text-blue-500"
              : "bg-transparent text-gray-800"
          } rounded-md font-medium hover:bg-blue-100 m-1`}
          to="/addProduct"
        >
          <PlusCircleIcon className="h-5 w-5 inline-block mr-2" />
          Add Product
        </Link>
        <Link
          className={`w-48 p-3 ${
            location.pathname === "/settings"
              ? "bg-blue-100 text-blue-500"
              : "bg-transparent text-gray-800"
          } rounded-md font-medium hover:bg-blue-100 m-1`}
          to="/settings"
        >
          <Cog6ToothIcon className="h-5 w-5 inline-block mr-2" />
          Settings
        </Link>
        {/* <Link
          className="w-48 p-3 bg-blue-500 text-white rounded-md font-medium hover:bg-blue-600 m-1"
          to="/signup"
        >
          Signup
        </Link> */}
        {/* <button
          className="w-48 p-3 bg-blue-500 text-white rounded-md font-medium hover:bg-blue-600 m-1"
          onClick={refreshToken}
        >
          Refresh Token
        </button> */}
      </div>
      <button
        onClick={handleLogout}
        className="w-48 p-3 bg-transparent text-red-500 border border-red-500 rounded-md font-medium hover:bg-red-500 hover:text-white font-poppins"
      >
        LOGOUT
      </button>
    </nav>
  ) : null;
}

export default NavBar;
