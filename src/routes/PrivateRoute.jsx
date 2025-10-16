import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

export default function PrivateRoute({ allowedRoles }) {
  const { user, token } = useSelector((state) => state.auth);

  const storedToken = localStorage.getItem("authToken");
  const storedUser = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  const currentUser = user || storedUser;
  const currentToken = token || storedToken;

  // console.log(" PrivateRoute check:", { currentUser, allowedRoles });

  if (!currentToken || !currentUser) {
    // console.warn("No user/token found — redirecting to login");
    return <Navigate to="/" replace />;
  }

  const userRole =
    currentUser.role_name ||
    currentUser.role?.name ||
    currentUser.role ||
    "Unknown";

  // console.log("🔍 Detected role:", userRole);

  if (!allowedRoles.includes(userRole)) {
    // console.warn(`Role '${userRole}' not allowed`);
    return <Navigate to="/unauthorized" replace />;
  }

  // console.log("Access granted to:", userRole);
  return <Outlet />;
}
