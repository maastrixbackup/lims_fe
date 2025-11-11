import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { useDispatch, useSelector } from "react-redux";

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
import ChangePassword from "./components/features/ChangePassword";
import ForgotPassword from "./components/features/ForgotPassword";
import ResetPassword from "./components/features/ResetPassword";
import Reports from "./pages/Reports";
import PlotForm from "./pages/PlotForm";
import Logs from "./pages/Logs";
import Compensation from "./pages/compensation/Compensation";
import DeletedRecords from "./pages/trash/DeletedRecords";
import SocialServey from "./pages/SocialServey";
import ProjectTable from "./shared/ProjectTable";

import { fetchProjects, fetchVillages } from "./utils/listSlice";
import "./App.css";

export default function App() {
  const dispatch = useDispatch();
  const { userToken } = useSelector((s) => s.auth);

  useEffect(() => {
    if (userToken) {
      dispatch(fetchProjects());
      dispatch(fetchVillages());
    }
  }, [userToken, dispatch]);

  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route element={<PrivateRoute />}>
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
              <Route path="/compensation" element={<Compensation />} />
              <Route path="/social-survey" element={<SocialServey />} />
              <Route path="/project-table" element={<ProjectTable />} />
              <Route path="/deletedrecords" element={<DeletedRecords />} />
            </Route>
          </Route>

          <Route path="*" element={<Unauthorized />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}
