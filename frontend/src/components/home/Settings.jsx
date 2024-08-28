import React, { useContext, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { AuthContext } from "../../lib/AuthProvider";
import { Cog6ToothIcon } from "@heroicons/react/20/solid";
import createApiInstance from "../../interceptors/interceptor";

const api = createApiInstance();

function Settings() {
  const { handleImageChange, user, updateInfos, changePass, isAuthenticated } =
    useContext(AuthContext);
  const [formData, setFormData] = useState({
    firstName: isAuthenticated ? user.firstName : "",
    lastName: isAuthenticated ? user.lastName : "",
  });
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
  });
  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.id]: e.target.value });
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  return (
    <section className="flex flex-col items-start justify-start pl-60 bg-[#f9f9f9] w-svw minh-svh">
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
      <span className="text-2xl font-bold text-gray-800 m-4 font-poppins">
        <Cog6ToothIcon className="h-8 w-8 fill-current text-blue-500 inline-block mr-4" />
        Settings
      </span>
      <span className="m-4 text-xl font-bold">Change Avatar</span>
      <label
        htmlFor="upload"
        className="flex flex-col items-center justify-center gap-2 cursor-pointer max-w-56 h-56 aspect-square m-5 relative p-5 border-2 border-dashed border-gray-300 rounded-md"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 fill-white stroke-blue-500"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <span className="text-gray-600 font-medium">Upload New Avatar</span>
      </label>
      <input
        id="upload"
        name="images"
        type="file"
        accept="image/png, image/jpeg, image/jpg"
        className="hidden"
        onChange={(e) => handleImageChange(e, toast)}
      />
      <span className="m-4 text-xl font-bold">Change User Infos</span>
      <form
        className="w-1/2 h-fit flex flex-col justify-between items-center p-4"
        onSubmit={(e) => updateInfos(e, toast, formData)}
      >
        <input
          type="text"
          id="firstName"
          value={formData.firstName}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent m-1"
          placeholder="First Name"
          required
        />
        <input
          type="text"
          id="lastName"
          value={formData.lastName}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent m-1"
          placeholder="Last Name"
          required
        />
        <button
          className="w-full p-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 m-1"
          type="submit"
        >
          Submit
        </button>
      </form>
      <span className="m-4 text-xl font-bold">Change Password</span>
      <form
        className="w-1/2 h-fit flex flex-col justify-between items-center p-4"
        onSubmit={async (e) => {
          await changePass(e, toast, passwordData);
          setPasswordData({ oldPassword: "", newPassword: "" });
        }}
      >
        <input
          type="password"
          id="oldPassword"
          value={passwordData.oldPassword}
          onChange={handlePasswordChange}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent m-1"
          placeholder="Old Password"
          required
        />
        <input
          type="password"
          id="newPassword"
          value={passwordData.newPassword}
          onChange={handlePasswordChange}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent m-1"
          placeholder="New Password"
          required
        />
        <button
          className="w-full p-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 m-1"
          type="submit"
        >
          Submit
        </button>
      </form>
    </section>
  );
}

export default Settings;
