import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import createApiInstance from "../../interceptors/interceptor.js";
import { AuthContext } from "../../lib/AuthProvider.jsx";
import { ToastContainer, toast } from "react-toastify";

const api = createApiInstance();

const toggleDarkMode = () => {
  document.documentElement.classList.toggle("dark");
};

const getUsers = async (setUsers) => {
  try {
    const response = await api.get("/users");
    if (response.status === 200) {
      console.log("Users retrieved successfully");
      console.log(response.data);
      setUsers(response.data);
      console.log(response.data);
    } else {
      console.error("Error retrieving users");
      //   navigate("/login");
    }
  } catch (error) {
    // navigate("/login");
    console.error("Error:", error);
  }
};

const sendFriendRequest = async (userId, setUsers) => {
  try {
    const response = await api.post("/addFriend", { userId });
    if (response.status === 200) {
      console.log("Friend request sent successfully");
      getUsers(setUsers);
    } else {
      console.error("Error sending friend request");
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

function Home() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);

  const { handleImageChange } = useContext(AuthContext);

  useEffect(() => {
    getUsers(setUsers);
  }, []);
  return (
    <section className="w-svw h-svh flex flex-col items-start justify-start bg-[#f9f9f9] text-white font-extrabold pl-60">
      <div className="flex flex-row items-center justify-around p-2 m-2 rounded-lg">
        {users?.map((user) => (
          <div
            key={user._id}
            className="flex flex-row items-center justify-between p-2 bg-blue-300 m-2 rounded-lg"
          >
            <div className="w-24 h-24 rounded-full m-2">
              <img
                src={user.avatar}
                alt="avatar"
                className="w-24 h-24 rounded-full"
              />
            </div>
            <div className="flex flex-col items-start justify-start">
              <h2 className="text-2xl font-bold mb-1 text-white text-center">
                {user.name}
              </h2>
              <p className="text-lg font-medium mb-1 text-white text-center">
                Email: {user.email}
              </p>
              <p className="text-lg font-medium mb-1 text-white text-center">
                Created At: {new Date(user.createdAt).toLocaleString("en-US")}
              </p>
              {!user.isFriend ? (
                <button
                  className="w-48 p-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 text-center"
                  onClick={() => sendFriendRequest(user._id, setUsers)}
                >
                  ADD FRIEND
                </button>
              ) : (
                <button
                  className="w-48 p-3 bg-gray-500 text-white rounded-lg font-medium hover:bg-gray-600 text-center"
                  disabled
                >
                  ALREADY FRIEND
                </button>
              )}
            </div>
          </div>
        ))}
        <button
          className="w-48 p-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 text-center"
          onClick={toggleDarkMode}
        >
          Toggle Dark Mode
        </button>
      </div>
    </section>
  );
}

export default Home;
