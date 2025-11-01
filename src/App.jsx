import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./routes/PrivateRoute";
import LandingPage from "./components/features/LoginScreen";
import Unauthorized from "./pages/Unathorize";

import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Villages from "./pages/Villages";
import Khata from "./pages/Khata";
import Plots from "./pages/Plots";
import UploadPlots from "./pages/UploadPlots";
import UserManagement from "./pages/UserManagement";
import Profile from "./pages/Profile";

import "./App.css";
import ChangePassword from "./components/features/ChangePassword";
import ForgotPassword from "./components/features/ForgotPassword";
import ResetPassword from "./components/features/ResetPassword";
import Reports from "./pages/Reports";
import PlotForm from "./pages/PlotForm";
import Logs from "./pages/logs/Logs";

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          <Route path="/unauthorized" element={<Unauthorized />} />

          <Route
            element={
              <PrivateRoute allowedRoles={["Super Admin", "Admin", "Client"]} />
            }
          >
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/villages" element={<Villages />} />
              <Route path="/plots" element={<Plots />} />
              <Route path="/khatas" element={<Khata />} />
              <Route path="/usersmanagement" element={<UserManagement />} />
              <Route path="/import" element={<UploadPlots />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/changepassword" element={<ChangePassword />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/plot-form" element={<PlotForm />} />
              <Route path="/logs" element={<Logs />} />

              <Route
                path="/reset-password/:token"
                element={<ResetPassword />}
              />
            </Route>
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Unauthorized />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}
