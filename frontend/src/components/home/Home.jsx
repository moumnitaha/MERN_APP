import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import createApiInstance from "../../interceptors/interceptor.js";

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

const handleImageChange = async (e, setUser, user) => {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onloadend = async () => {
    const response = await fetch("http://localhost:3000/upload_avatar", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ avatar: reader.result }),
    });
    if (response.ok) {
      console.log("Avatar uploaded successfully");
      let data = await response.json();
      setUser({ ...user, avatar: data.newAvatar });
    }
  };
};

function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    email: "",
    createdAt: "",
    avatar: "",
  });
  useEffect(() => {
    getData(navigate, setUser);
  }, []);
  return (
    <section className="bg-stone-950 flex flex-col items-center min-h-screen">
      <nav className="flex flex-row items-center justify-around w-svw bg-stone-600 p-4">
        <div className="w-24 h-24 rounded-full">
          <img
            src={user.avatar}
            alt="avatar"
            className="w-24 h-24 rounded-full"
          />
        </div>
        <div className="flex flex-col items-start justify-start">
          <h2 className="text-2xl font-bold mb-1 text-white text-center">
            Welcome {user.name}
          </h2>
          <p className="text-lg font-medium mb-1 text-white text-center">
            Email: {user.email}
          </p>
          <p className="text-lg font-medium mb-1 text-white text-center">
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
          className="w-48 p-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600"
        >
          Logout
        </button>
      </nav>
      <div className="m-4 bg-blue-200 p-5 rounded-sm">
        <label
          htmlFor="avatar"
          className="block text-gray-700 font-medium mb-2"
        >
          Avatar
        </label>
        <input
          required
          type="file"
          id="avatar"
          name="avatar"
          accept="image/png, image/jpeg, image/jpg"
          onChange={(e) => handleImageChange(e, setUser, user)}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />

        {/* {formData?.avatar ? (
          <div className="modal" id="modal">
            <div className="modal-box w-32 aspect-square">
              <img src={formData.avatar} alt="avatar" />
            </div>
          </div>
        ) : null} */}
      </div>
    </section>
  );
}

export default Home;
