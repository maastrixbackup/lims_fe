import React, { useEffect, Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { useDispatch, useSelector } from "react-redux";
import PrivateRoute from "./routes/PrivateRoute";
import "./App.css";
import Loader from "./shared/Loader";
import { fetchProjects, fetchVillages } from "./utils/listSlice";
import KhataDocumentRegister from "./pages/reports/KhataDocumentRegister";
import VillageLandRegister from "./pages/reports/VillageLandRegister";
import VillageDocumentReport from "./pages/reports/VillageDocumentReport";
import PlotDetails from "./pages/reports/PlotDetails";
import PlotOwnershipHistory from "./pages/reports/PlotOwnershipHistory";
import DocumentUploadReport from "./pages/reports/DocumentUploadReport";
import MissingDocument from "./pages/reports/MissingDocument";

const LandingPage = lazy(() => import("./components/features/LoginScreen"));
const Unauthorized = lazy(() => import("./pages/Unathorize"));
const Layout = lazy(() => import("./components/layout/Layout"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Projects = lazy(() => import("./pages/Projects"));
const Villages = lazy(() => import("./pages/private/village/Villages"));
const Khata = lazy(() => import("./pages/private/khata/Khata"));
const Plots = lazy(() => import("./pages/private/plot/Plots"));
const UploadPlots = lazy(() => import("./pages/UploadPlots"));
const UserManagement = lazy(() => import("./pages/UserManagement"));
const Profile = lazy(() => import("./pages/Profile"));
const ChangePassword = lazy(() =>
  import("./components/features/ChangePassword")
);
const ForgotPassword = lazy(() =>
  import("./components/features/ForgotPassword")
);
const ResetPassword = lazy(() => import("./components/features/ResetPassword"));
const PlotForm = lazy(() => import("./pages/private/plot/PlotForm"));
const Logs = lazy(() => import("./pages/Logs"));
const Compensation = lazy(() =>
  import("./pages/private/compensation/Compensation")
);
const DeletedRecords = lazy(() => import("./pages/trash/DeletedRecords"));
const SocialSurvey = lazy(() => import("./pages/SocialSurvey"));
const ProjectTable = lazy(() => import("./shared/ProjectTable"));

const KhataSummary = lazy(() => import("./pages/reports/KhataSummary"));
const ProjectSummary = lazy(() => import("./pages/reports/ProjectSummary"));
const ProjectDocumentRegister = lazy(() =>
  import("./pages/reports/ProjectDocumentRegister")
);
const KMZAvailability = lazy(() => import("./pages/reports/KMZAvailability"));
const MapSummaryReport = lazy(() => import("./pages/reports/MapSummaryReport"));
const AuditTrail = lazy(() => import("./pages/reports/AuditTrail"));
const UserActivity = lazy(() => import("./pages/reports/UserActivity"));

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
                <Route path="/:landType/villages" element={<Villages />} />
                <Route path="/:landType/khatas" element={<Khata />} />
                <Route path="/:landType/plots" element={<Plots />} />
                <Route
                  path="/:landType/compensation"
                  element={<Compensation />}
                />
                <Route
                  path="/:landType/social-survey"
                  element={<SocialSurvey />}
                />

                <Route path="/usersmanagement" element={<UserManagement />} />
                <Route path="/import" element={<UploadPlots />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/changepassword" element={<ChangePassword />} />
                <Route
                  path="/reports/khata-reports/khata-summary"
                  element={<KhataSummary />}
                />
                <Route
                  path="reports/khata-reports/khata-document"
                  element={<KhataDocumentRegister />}
                />
                <Route
                  path="reports/village-reports/village-land-register"
                  element={<VillageLandRegister />}
                />
                <Route
                  path="reports/village-reports/village-document-report"
                  element={<VillageDocumentReport />}
                />
                <Route
                  path="reports/plot-reports/plot-details"
                  element={<PlotDetails />}
                />
                <Route
                  path="reports/plot-reports/plot-owner-history"
                  element={<PlotOwnershipHistory />}
                />
                <Route
                  path="reports/project-reports/project-summary"
                  element={<ProjectSummary />}
                />
                <Route
                  path="reports/project-reports/project-document-register"
                  element={<ProjectDocumentRegister />}
                />
                <Route
                  path="reports/maps-reports/kmz-availability"
                  element={<KMZAvailability />}
                />
                <Route
                  path="reports/maps-reports/map-summary-report"
                  element={<MapSummaryReport />}
                />
                <Route
                  path="/reports/user-reports/activity-log"
                  element={<UserActivity />}
                />
                <Route
                  path="/reports/user-reports/audit-trail"
                  element={<AuditTrail />}
                />
                <Route
                  path="/reports/document-reports/document-upload-report"
                  element={<DocumentUploadReport />}
                />
                <Route
                  path="/reports/document-reports/missing-documents-report"
                  element={<MissingDocument />}
                />
                <Route path="/:landType/plot-form" element={<PlotForm />} />
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
