import React, { useEffect, Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./routes/PrivateRoute";
import Loader from "./shared/Loader";
import "./App.css";

import { fetchProjects, fetchVillages } from "./utils/listSlice";
import GovernmentPlot from "./pages/government/plot/GovernmentPlot";
import GovernmentKhata from "./pages/government/khata/GovernmentKhata";
const LandingPage = lazy(() => import("./components/features/LoginScreen"));
const ForgotPassword = lazy(() =>import("./components/features/ForgotPassword"));
const ResetPassword = lazy(() =>import("./components/features/ResetPassword"));
const ChangePassword = lazy(() =>import("./components/features/ChangePassword"));
const Unauthorized = lazy(() => import("./pages/Unathorize"));
const Layout = lazy(() => import("./components/layout/Layout"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Projects = lazy(() => import("./pages/project/Projects"));
const ProjectTable = lazy(() => import("./pages/project/ProjectTable"));
const Villages = lazy(() => import("./pages/private/village/Villages"));
const Khata = lazy(() => import("./pages/private/khata/Khata"));
const Plots = lazy(() => import("./pages/private/plot/Plots"));
const PlotForm = lazy(() => import("./pages/private/plot/PlotForm"));
const UploadPlots = lazy(() => import("./pages/UploadPlots"));
const Compensation = lazy(() =>import("./pages/private/compensation/Compensation"));
const SocialSurvey = lazy(() => import("./pages/SocialSurvey"));
const GovtVillages = lazy(() => import("./pages/government/village/Villages"));

const UserManagement = lazy(() => import("./pages/UserManagement"));
const Profile = lazy(() => import("./pages/Profile"));
const Logs = lazy(() => import("./pages/Logs"));
const DeletedRecords = lazy(() => import("./pages/trash/DeletedRecords"));
const ReadyToPayment = lazy(() =>import("./pages/payment/ReadyToPayment"));

const KhataSummary = lazy(() =>import("./pages/reports/KhataSummary"));
const KhataDocumentRegister = lazy(() =>import("./pages/reports/KhataDocumentRegister"));
const VillageLandRegister = lazy(() =>import("./pages/reports/VillageLandRegister"));
const VillageDocumentReport = lazy(() =>import("./pages/reports/VillageDocumentReport"));

const PlotDetails = lazy(() =>import("./pages/reports/PlotDetails"));
const PlotOwnershipHistory = lazy(() =>import("./pages/reports/PlotOwnershipHistory"));

const ProjectSummary = lazy(() =>import("./pages/reports/ProjectSummary"));
const ProjectDocumentRegister = lazy(() =>import("./pages/reports/ProjectDocumentRegister"));
const TotalTentants = lazy(() =>import("./pages/reports/TotalTentants"));

const KMZAvailability = lazy(() =>import("./pages/reports/KMZAvailability"));
const MapSummaryReport = lazy(() =>import("./pages/reports/MapSummaryReport"));

const UserActivity = lazy(() =>import("./pages/reports/UserActivity"));
const AuditTrail = lazy(() =>import("./pages/reports/AuditTrail"));

const DocumentUploadReport = lazy(() =>import("./pages/reports/DocumentUploadReport"));
const MissingDocument = lazy(() =>import("./pages/reports/MissingDocument"));

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
            {/* Authentication */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Private */}
            <Route element={<PrivateRoute />}>
              <Route element={<Layout />}>
                <Route path="/dashboard" element={<Dashboard />} />

                <Route path="/projects" element={<Projects />} />
                <Route path="/project-table" element={<ProjectTable />} />

                <Route path="/:landType/villages" element={<Villages />} />
                <Route path="/:landType/khatas" element={<Khata />} />
                <Route path="/:landType/plots" element={<Plots />} />
                <Route path="/:landType/plot-form" element={<PlotForm />} />
                <Route path="/:landType/government/villages" element={<GovtVillages />} />
                <Route path="/:landType/government/plots" element={<GovernmentPlot />} />
                <Route path="/:landType/government/khatas" element={<GovernmentKhata />} />

                <Route path="/import" element={<UploadPlots />} />

                <Route
                  path="/:landType/land-cost"
                  element={<Compensation />}
                />
                <Route
                  path="/:landType/social-survey"
                  element={<SocialSurvey />}
                />

                <Route path="/usersmanagement" element={<UserManagement />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/changepassword" element={<ChangePassword />} />
                 {/*Reports */}
                <Route
                  path="/reports/khata-reports/khata-summary"
                  element={<KhataSummary />}
                />
                <Route
                  path="/reports/khata-reports/khata-document"
                  element={<KhataDocumentRegister />}
                />
                <Route
                  path="/reports/village-reports/village-land-register"
                  element={<VillageLandRegister />}
                />
                <Route
                  path="/reports/village-reports/village-document-report"
                  element={<VillageDocumentReport />}
                />
                <Route
                  path="/reports/plot-reports/plot-details"
                  element={<PlotDetails />}
                />
                <Route
                  path="/reports/plot-reports/plot-owner-history"
                  element={<PlotOwnershipHistory />}
                />
                <Route
                  path="/reports/project-reports/project-summary"
                  element={<ProjectSummary />}
                />
                <Route
                  path="/reports/project-reports/project-document-register"
                  element={<ProjectDocumentRegister />}
                />
                <Route
                  path="/reports/project-reports/total-tenants"
                  element={<TotalTentants />}
                />
                <Route
                  path="/reports/maps-reports/kmz-availability"
                  element={<KMZAvailability />}
                />
                <Route
                  path="/reports/maps-reports/map-summary-report"
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

                <Route path="/logs" element={<Logs />} />
                <Route path="/deletedrecords" element={<DeletedRecords />} />
                <Route
                  path="/payment/ready-to-payment"
                  element={<ReadyToPayment />}
                />
              </Route>
            </Route>

            <Route path="*" element={<Unauthorized />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </Router>
  );
}
