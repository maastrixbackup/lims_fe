import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import StatsCard from "../components/dashboard/StatsCard";
import PieChartCard from "../components/dashboard/PieChartCard";
import BarChartCard from "../components/dashboard/BarChartCard";
import RecentProjects from "../components/dashboard/RecentProjects";
import RecentActivity from "../components/dashboard/RecentActivity";
import ProgressOverview from "../components/dashboard/ProgressOverview";
import Loader from "../shared/Loader";
import useFetchDashboard from "../hooks/useFetchDashboard";

const LAND_TYPES = [
  { key: "private", label: "Private Land" },
  { key: "govt", label: "Government Land" },
  // { key: "forest", label: "Forest Land" },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [landType, setLandType] = useState("private");

  const { data, loading, error } = useFetchDashboard(landType);

  if (loading) return <Loader />;

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-600 font-medium">
        Error: {error.message}
      </div>
    );
  }

  const landData = data || {};

  return (
    <main className="flex-1 overflow-y-auto space-y-6">

      {/* 🔹 Land Type Toggle */}
      <div className="flex gap-3">
        {LAND_TYPES.map((type) => (
          <button
            key={type.key}
            onClick={() => setLandType(type.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition
              ${
                landType === type.key
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
          >
            {type.label}
          </button>
        ))}
      </div>

      {/* 🔹 Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard title="Projects" value={landData.projects ?? 0}
          gradient="bg-gradient-to-r from-indigo-500 to-purple-600"
          onClick={() => navigate("/projects")}
        />

        <StatsCard title="Villages" value={landData.villages ?? 0}
          gradient="bg-gradient-to-r from-green-400 to-emerald-600"
        />

        <StatsCard title="Khata" value={landData.khata ?? 0}
          gradient="bg-gradient-to-r from-teal-400 to-cyan-500"
        />

        <StatsCard title="Plots" value={landData.plots ?? 0}
          gradient="bg-gradient-to-r from-orange-400 to-red-500"
        />

        <StatsCard title="Survey Status" value={landData.survey_status ?? 0}
          gradient="bg-gradient-to-r from-pink-500 to-fuchsia-600"
        />

        <StatsCard title="Payment Status" value={landData.payment_status ?? 0}
          gradient="bg-gradient-to-r from-yellow-400 to-amber-500"
        />

        <StatsCard title="LA Status" value={landData.la_status ?? 0}
          gradient="bg-gradient-to-r from-lime-400 to-green-600"
        />

        <StatsCard title="RR Status" value={landData.rr_status ?? 0}
          gradient="bg-gradient-to-r from-sky-400 to-blue-600"
        />
      </div>

      {/* 🔹 Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BarChartCard data={landData} />
        <PieChartCard data={landData} />
      </div>

      {/* 🔹 Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentProjects data={landData} />
        <RecentActivity data={landData} />
      </div>

      <ProgressOverview landType={landData} />
    </main>
  );
}
