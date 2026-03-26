import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAuth } from "../context/AuthContext";

export default function PrivateRoute({ allowedRoles }) {
  const { user, userToken } = useSelector((state) => state.auth);
  const { isSessionActive } = useAuth();

  const storedToken =
    localStorage.getItem("userToken") || localStorage.getItem("authToken");

  let storedUser = null;
  const storedUserRaw = localStorage.getItem("user");
  if (storedUserRaw) {
    try {
      storedUser = JSON.parse(storedUserRaw);
    } catch (err) {
      console.error("Invalid stored user data:", err);
    }
  }

  const currentUser = user || storedUser;
  const currentToken = userToken || storedToken;

  // console.log(" PrivateRoute check:", { currentUser, allowedRoles });

  if (!isSessionActive || !currentToken || !currentUser) {
    // console.warn("No user/token found - redirecting to login");
    return <Navigate to="/" replace />;
  }

  // const userRole =
  //   currentUser.role_name ||
  //   currentUser.role?.name ||
  //   currentUser.role ||
  //   "Unknown";

  // if (!allowedRoles.includes(userRole)) {
  //   return <Navigate to="/unauthorized" replace />;
  // }

  return <Outlet />;
}
