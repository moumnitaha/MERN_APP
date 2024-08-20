import React, { useEffect } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import createApiInstance from "../../../interceptors/interceptor.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const api = createApiInstance();

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    api.get("/me").then((response) => {
      if (response.status === 200) {
        console.log("User is authenticated from Login");
        navigate("/");
      } else {
        console.error("User is not authenticated");
      }
    });
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e, toast) => {
    e.preventDefault();
    try {
      const response = await api.post("/login", formData);
      if (response.status === 200) {
        console.log("User logged in successfully");
        let data = await response.data;
        console.log("DATA=> ", data);
        navigate("/");
      } else {
        console.error("Error logging in user", response.statusText);
        toast.error("Error logging in user");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.response.data);
    }
  };

  return (
    <section className="bg-gray-100 flex items-center justify-center min-h-screen">
      <ToastContainer
        theme="dark"
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
      />
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 text-center">
          Login
        </h2>

        <form onSubmit={(e) => handleSubmit(e, toast)}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 font-medium mb-2"
            >
              Email
            </label>
            <input
              value={formData.email}
              onChange={handleChange}
              type="email"
              id="email"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Your Email"
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-gray-700 font-medium mb-2"
            >
              Password
            </label>
            <input
              value={formData.password}
              onChange={handleChange}
              type="password"
              id="password"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Your Password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
          >
            Login
          </button>
        </form>
        <div className="text-center mt-4">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-500 hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}

export default Login;
