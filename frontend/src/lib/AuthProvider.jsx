import React, { createContext, useEffect, useState } from "react";
import createApiInstance from "../interceptors/interceptor";
import Loading from "../components/Loading";
import { useLocation, useNavigate } from "react-router-dom";

const api = createApiInstance();

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState({
    name: "",
    email: "",
    createdAt: "",
    avatar: "",
  });
  const [loading, setLoding] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const authMount = async () => {
      try {
        const response = await api("/me");
        setLoding(true);
        if (response.status === 200) {
          console.log("User Auth successfully!");
          setUser(response.data);
          setIsAuthenticated(true);
          setLoding(false);
        } else {
          setLoding(false);
          console.log("User Auth failed!");
          setIsAuthenticated(false);
        }
      } catch (error) {
        setLoding(false);
        console.log("User Auth failed!");
        setIsAuthenticated(false);
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

  const handleImageChange = async (e, toast) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      const response = await api.post("/upload_avatar", {
        avatar: reader.result,
      });
      if (response.status === 200) {
        toast.success("Avatar uploaded successfully");
        setUser({ ...user, avatar: response.data.newAvatar });
      } else {
        toast.error("Error uploading avatar");
      }
    };
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
      }}
    >
      {loading ? <Loading /> : children}
    </AuthContext.Provider>
  );
}
