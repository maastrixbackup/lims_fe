import React from "react";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import StatsCard from "../components/dashboard/StatsCard";
import PieChartCard from "../components/dashboard/PieChartCard";
import BarChartCard from "../components/dashboard/BarChartCard";
import RecentProjects from "../components/dashboard/RecentProjects";
import RecentActivity from "../components/dashboard/RecentActivity";
import ProgressOverview from "../components/dashboard/ProgressOverview";
import Loader from "../shared/Loader";
import useFetchDashboard from "../hooks/useFetchDashboard";
import { useNavigate} from "react-router-dom";

export default function Dashboard() {
  const { data, loading, error } = useFetchDashboard();
  const navigate= useNavigate()

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-600 font-medium">
        Error: {error.message}
      </div>
    );
  }

  return (
    <main className="flex-1 p-6 overflow-y-auto space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Projects"
          value={data ? data.projects : "N/A"}
          gradient="bg-gradient-to-r from-indigo-500 to-purple-600"
            onClick={() => navigate("/projects")}
        />
        <StatsCard
          title="Villages"
          value={data ? data.villages : "N/A"}
          gradient="bg-gradient-to-r from-green-400 to-emerald-600"
        />
        <StatsCard
          title="Khata"
          value={data ? data.khata : "N/A"}
          gradient="bg-gradient-to-r from-teal-400 to-cyan-500"
        />
        <StatsCard
          title="Plots"
          value={data ? data.plots : "N/A"}
          gradient="bg-gradient-to-r from-orange-400 to-red-500"
        />

        <StatsCard
          title="Survey Status"
          value={data ? data.survey_status : "N/A"}
          gradient="bg-gradient-to-r from-pink-500 to-fuchsia-600"
        />
        <StatsCard
          title="Payment Status"
          value={data ? data.payment_status : "N/A"}
          gradient="bg-gradient-to-r from-yellow-400 to-amber-500"
        />
        <StatsCard
          title="LA Status"
          value={data ? data.la_status : "N/A"}
          gradient="bg-gradient-to-r from-lime-400 to-green-600"
        />
        <StatsCard
          title="RR Status"
          value={data ? data.rr_status : "N/A"}
          gradient="bg-gradient-to-r from-sky-400 to-blue-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BarChartCard />
        <PieChartCard />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentProjects />
        <RecentActivity />
      </div>

      <ProgressOverview />
    </main>
  );
}
