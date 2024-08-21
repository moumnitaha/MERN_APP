import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import createApiInstance from "../../interceptors/interceptor.js";

const api = createApiInstance();

const handleImageChange = async (e, setUser, user) => {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onloadend = async () => {
    const response = await api.post("http://localhost:3000/upload_avatar", {
      avatar: reader.result,
    });
    if (response.status === 200) {
      console.log("Avatar uploaded successfully");
      let data = response.data;
      setUser({ ...user, avatar: data.newAvatar });
    }
  };
};

const getUsers = async (setUsers) => {
  try {
    const response = await api.get("/users");
    if (response.status === 200) {
      console.log("Users retrieved successfully");
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

  useEffect(() => {
    getUsers(setUsers);
  }, []);
  return (
    <section className="bg-stone-950 flex flex-col items-center h-[calc(100svh-8rem)] w-svw">
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
      </div>
      <div className="flex flex-row items-center justify-around p-2 m-2 rounded-lg w-svw">
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
      </div>
    </section>
  );
}

export default Home;
