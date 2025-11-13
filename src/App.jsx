import React, { useEffect, Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { useDispatch, useSelector } from "react-redux";
import PrivateRoute from "./routes/PrivateRoute";
import "./App.css";
import Loader from "./shared/Loader";
import { fetchProjects, fetchVillages } from "./utils/listSlice";
import ForestVillage from "./pages/forest/Village";
import ForestKhata from "./pages/forest/khata";
import ForestPlot from "./pages/forest/Plot";

import GovtVillage from "./pages/govt/GovtVillage";
import GovtKhata from "./pages/govt/GovtKhata";
import GovtPlot from "./pages/govt/plot";

const LandingPage = lazy(() => import("./components/features/LoginScreen"));
const Unauthorized = lazy(() => import("./pages/Unathorize"));
const Layout = lazy(() => import("./components/layout/Layout"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Projects = lazy(() => import("./pages/Projects"));
const Villages = lazy(() => import("./pages/Villages"));
const Khata = lazy(() => import("./pages/Khata"));
const Plots = lazy(() => import("./pages/Plots"));
const UploadPlots = lazy(() => import("./pages/UploadPlots"));
const UserManagement = lazy(() => import("./pages/UserManagement"));
const Profile = lazy(() => import("./pages/Profile"));
const ChangePassword = lazy(() => import("./components/features/ChangePassword"));
const ForgotPassword = lazy(() => import("./components/features/ForgotPassword"));
const ResetPassword = lazy(() => import("./components/features/ResetPassword"));
const Reports = lazy(() => import("./pages/Reports"));
const PlotForm = lazy(() => import("./pages/PlotForm"));
const Logs = lazy(() => import("./pages/Logs"));
const Compensation = lazy(() => import("./pages/compensation/Compensation"));
const DeletedRecords = lazy(() => import("./pages/trash/DeletedRecords"));
const SocialSurvey = lazy(() => import("./pages/SocialSurvey"));
const ProjectTable = lazy(() => import("./shared/ProjectTable"));

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

        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route element={<PrivateRoute />}>
              <Route element={<Layout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/private-land/villages" element={<Villages />} />
                <Route path="/private-land/khatas" element={<Khata />} />
                <Route path="/private-land/plots" element={<Plots />} />
                <Route path="/private-land/compensation" element={<Compensation />} />
                <Route path="/private-land/social-survey" element={<SocialSurvey />} />
                <Route path="/govt-land/village" element={<GovtVillage/>} />
                <Route path="/govt-land/khata" element={<GovtKhata/>} />
                <Route path="/govt-land/plot" element={<GovtPlot />} />
                <Route path="/govt-land/compensation" element={<Compensation />} />
                 <Route path="/forest-land/villages" element={<ForestVillage/>} />
                <Route path="/forest-land/khatas" element={<ForestKhata/>} />
                <Route path="/forest-land/plots" element={<ForestPlot />} />
                <Route path="/forest-land/compensation" element={<Compensation />} />
                <Route path="/usersmanagement" element={<UserManagement />} />
                <Route path="/import" element={<UploadPlots />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/changepassword" element={<ChangePassword />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/plot-form" element={<PlotForm />} />
                <Route path="/logs" element={<Logs />} />
                <Route path="/project-table" element={<ProjectTable />} />
                <Route path="/deletedrecords" element={<DeletedRecords />} />
              </Route>
            </Route>

            <Route path="*" element={<Unauthorized />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </Router>
  );
}
