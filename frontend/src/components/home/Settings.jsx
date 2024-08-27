import React, { useContext, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { AuthContext } from "../../lib/AuthProvider";
import { Cog6ToothIcon } from "@heroicons/react/20/solid";

function Settings() {
  const { handleImageChange } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: "",
  });
  return (
    <section className="flex flex-row flex-wrap justify-start pl-60 bg-[#f9f9f9]">
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
      <div className="m-4">
        <span className="text-2xl font-bold text-gray-800">
          <Cog6ToothIcon className="h-8 w-8 fill-current text-blue-500 inline-block mr-4" />
          Settings
        </span>
        <label
          htmlFor="upload"
          className="flex flex-col items-center justify-center gap-2 cursor-pointer min-w-56 h-56 aspect-square m-5 relative p-5 border-2 border-dashed border-gray-300 rounded-md"
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
      </div>
    </section>
  );
}

export default Settings;
