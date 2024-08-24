import { useContext, useEffect } from "react";
import { AuthContext } from "./AuthProvider";
import { Route, Navigate } from "react-router-dom";
const ProtectedRoute = ({ element }) => {
  const { isAuthenticated } = useContext(AuthContext);
  useEffect(() => {
    console.log("ProtectedRoute isAuthenticated: ", isAuthenticated);
  }, []);

  return isAuthenticated ? element : <Navigate to="/login" />;
};

export default ProtectedRoute;
