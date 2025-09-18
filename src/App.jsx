import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./routes/PrivateRoute";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import Unauthorized from "./pages/Unathorize";
import Projects from "./pages/Projects";
import Villages from "./pages/Villages";
import Layout from "./components/layout/Layout";
import "./App.css";
import Plots from "./pages/Plots";
import UploadPlots from "./pages/UploadPlots";
import Khata from "./pages/Khata";

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* All protected routes share the same layout */}
          <Route
            element={
              <PrivateRoute allowedRoles={["Super Admin", "Admin", "Client"]} />
            }
          >
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/villages" element={<Villages />} />
              <Route path="/khatas" element={<Khata />} />
              <Route path="/plots" element={<Plots />} />
              <Route path="/import" element={<UploadPlots />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}
