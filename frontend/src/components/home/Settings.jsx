import React, { useContext, useState } from "react";
import { ToastContainer } from "react-toastify";
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
  const [img, setImg] = useState("");
  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.id]: e.target.value });
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const [isPasswordVisible1, setIsPasswordVisible1] = useState(false);
  const [isPasswordVisible2, setIsPasswordVisible2] = useState(false);

  function togglePasswordVisibility(e, i) {
    e.preventDefault();
    if (i === 1) setIsPasswordVisible1((prevState) => !prevState);
    if (i === 2) setIsPasswordVisible2((prevState) => !prevState);
  }

  return (
    <section className="flex flex-col items-start justify-start pl-60 bg-[#f9f9f9] w-auto minh-svh">
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
      <form
        className="flex flex-col ml-3"
        onSubmit={(e) => {
          handleImageChange(e, img, setImg);
          setImg("");
        }}
      >
        <label
          htmlFor="upload"
          className="flex flex-col items-center justify-center gap-2 cursor-pointer max-w-48 h-48 aspect-square mb-5 relative p-1 border-2 border-dashed border-gray-300 rounded-md"
        >
          {img ? (
            <div className="w-44 h-44 bg-red-200 flex justify-center items-center relative">
              <div
                className="absolute bg-red-600 rounded-full -top-2 -left-2 w-8 h-8 flex justify-center items-center text-white font-bold cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  setImg("");
                }}
              >
                <span className="m-auto text-2xl">×</span>
              </div>
              <img src={img} className="w-44 h-44 rounded-md" alt="avatar" />
            </div>
          ) : (
            <>
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
              <span className="text-gray-600 font-medium">
                Upload New Avatar
              </span>
            </>
          )}
        </label>
        <input
          id="upload"
          name="images"
          type="file"
          accept="image/png, image/jpeg, image/jpg"
          className="hidden"
          onChange={(e) => {
            let file = e.target.files[0];
            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
              setImg(reader.result);
            };
          }}
        />
        <button
          disabled={!img}
          className="w-48 p-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 disabled:bg-gray-400"
          type="submit"
        >
          Change Avatar
        </button>
      </form>
      <span className="m-4 text-xl font-bold">Change User Infos</span>
      <form
        className="w-1/4 h-fit flex flex-col justify-between items-center p-3"
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
        className="w-1/4 h-fit flex flex-col justify-between items-center p-3"
        onSubmit={async (e) => {
          await changePass(e, toast, passwordData);
          setPasswordData({ oldPassword: "", newPassword: "" });
        }}
      >
        <div className="flex flex-row w-full justify-between relative">
          <input
            type={isPasswordVisible1 ? "text" : "password"}
            id="oldPassword"
            value={passwordData.oldPassword}
            onChange={handlePasswordChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent m-1 pr-8"
            placeholder="Old Password"
            required
          />
          <button
            className="flex items-center px-3 text-gray-600 absolute inset-y-0 right-0"
            onClick={(e) => togglePasswordVisibility(e, 1)}
          >
            {isPasswordVisible1 ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            )}
          </button>
        </div>
        <div className="flex flex-row w-full justify-between relative">
          <input
            type={isPasswordVisible2 ? "text" : "password"}
            id="newPassword"
            value={passwordData.newPassword}
            onChange={handlePasswordChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent m-1 pr-8"
            placeholder="New Password"
            required
          />
          <button
            className="flex items-center px-3 text-gray-600 absolute inset-y-0 right-0"
            onClick={(e) => togglePasswordVisibility(e, 2)}
          >
            {isPasswordVisible2 ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            )}
          </button>
        </div>
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
