import React, { createContext, useEffect, useState } from "react";
import createApiInstance from "../interceptors/interceptor";
import Loading from "../components/Loading";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const api = createApiInstance();

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    createdAt: "",
    avatar: "",
    _id: "",
  });
  const [loading, setLoding] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const authMount = async () => {
      setLoding(true);
      try {
        const response = await api("/me");
        if (response.status === 200) {
          console.log("User Auth successfully!");
          setUser(response.data);
          setIsAuthenticated(true);
          setLoding(false);
          //   if (["/login", "/signup"].includes(location.pathname)) {
          //     navigate("/home");
          //   }
        } else {
          setLoding(false);
          console.log("User Auth failed!");
          setIsAuthenticated(false);
          //   if (!["/login", "/signup", "/"].includes(location.pathname)) {
          //     navigate("/login");
          //   }
        }
      } catch (error) {
        setLoding(false);
        console.log("User Auth failed!");
        setIsAuthenticated(false);
        // if (!["/login", "/signup", "/"].includes(location.pathname)) {
        //   navigate("/login");
        // }
      }
    };
    authMount();
  }, [navigate]);

  async function handleLogin(e, formData, toast) {
    e.preventDefault();
    try {
      const response = await api.post("/login", formData);
      if (response.status === 200) {
        console.log("User logged in successfully");
        setUser(response.data);
        setIsAuthenticated(true);
      } else {
        console.error("Error logging in user", response.statusText);
        toast.error(response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.response.data);
    }
  }

  async function handleLogout() {
    try {
      const response = await api.post("/logout");
      if (response.status === 200) {
        console.log("User logged out successfully");
        setUser(null);
        setIsAuthenticated(false);
      } else {
        console.error("Error logging out user");
      }
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }

  const handleImageChange = async (e, img) => {
    e.preventDefault();
    const response = await api.post("/upload_avatar", {
      avatar: img,
    });
    if (response.status === 200) {
      toast.success("Avatar uploaded successfully");
      setUser({ ...user, avatar: response.data.newAvatar });
    } else {
      toast.error("Error uploading avatar");
    }
  };

  const changePass = async (e, toast, passData) => {
    e.preventDefault();
    try {
      const response = await api.put("/changePass", passData);
      if (response.status === 201) {
        toast.success("Password changed successfully");
      } else {
        let data = response.data;
        console.error(
          "Error changing password: ",
          response.status,
          data.message
        );
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.response.data.error);
    }
  };

  const updateInfos = async (e, toast, formData) => {
    e.preventDefault();
    try {
      const response = await api.put(
        "http://localhost:3000/updateInfos",
        formData
      );
      if (response.status === 201) {
        toast.success("User updated successfully");
        setUser(response.data);
      } else {
        let data = response.data;
        console.error("Error updating user: ", response.status, data.message);
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.response.data);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        handleLogout,
        handleLogin,
        handleImageChange,
        updateInfos,
        changePass,
      }}
    >
      {loading ? <Loading /> : children}
    </AuthContext.Provider>
  );
}
