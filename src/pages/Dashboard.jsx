import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

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
];

const PROJECT_TYPE_MAP = {
  1: "private",
  2: "govt",
};

export default function Dashboard() {
  const navigate = useNavigate();

  const selectedProject = useSelector((state) => state.selectedProject.project);

  const landType = selectedProject
    ? PROJECT_TYPE_MAP[selectedProject.type]
    : null;

  const { data, loading, error } = useFetchDashboard(landType);

  const navigateByLandType = (module) => {
    if (!landType) return;
    navigate(`/${landType}/${module}`);
  };

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
      {/* 🔹 Land Type Indicator */}
      <div className="flex gap-3 flex-wrap">
        {LAND_TYPES.map((type) => {
          const isActive = landType === type.key;

          return (
            <button
              key={type.key}
              disabled
              className={`px-4 py-2 rounded-lg text-sm font-medium transition
                ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-md"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed opacity-60"
                }`}
            >
              {type.label}
            </button>
          );
        })}
      </div>

      {/* 🔹 Stats */}
      <div className="space-y-6">
        {/* Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Projects"
            value={landData.projects ?? 0}
            gradient="bg-gradient-to-r from-indigo-500 to-purple-600"
            onClick={() => navigateByLandType("projects")}
          />
          <StatsCard
            title="Villages"
            value={landData.villages ?? 0}
            gradient="bg-gradient-to-r from-green-400 to-emerald-600"
            onClick={() => navigateByLandType("villages")}
          />
          <StatsCard
            title="Khata"
            value={landData.khata ?? 0}
            gradient="bg-gradient-to-r from-teal-400 to-cyan-500"
            onClick={() => navigateByLandType("khatas")}
          />
          <StatsCard
            title="Plots"
            value={landData.plots ?? 0}
            gradient="bg-gradient-to-r from-orange-400 to-red-500"
            onClick={() => navigateByLandType("plots")}
            
          />
           <StatsCard
            title="Payment Status"
            value={landData.payment_status ?? 0}
            gradient="bg-gradient-to-r from-yellow-400 to-amber-500"
          />
          <StatsCard
            title="LA Status"
            value={landData.la_status ?? 0}
            gradient="bg-gradient-to-r from-lime-400 to-green-600"
          />
          <StatsCard
            title="RR Status"
            value={landData.rr_status ?? 0}
            gradient="bg-gradient-to-r from-sky-400 to-blue-600"
            onClick={() => navigateByLandType("khatas")}
          />
        </div>

        {/* Row 2 */}
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard
            title="Payment Status"
            value={landData.payment_status ?? 0}
            gradient="bg-gradient-to-r from-yellow-400 to-amber-500"
          />
          <StatsCard
            title="LA Status"
            value={landData.la_status ?? 0}
            gradient="bg-gradient-to-r from-lime-400 to-green-600"
          />
          <StatsCard
            title="RR Status"
            value={landData.rr_status ?? 0}
            gradient="bg-gradient-to-r from-sky-400 to-blue-600"
          />
        </div> */}
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

      {/* 🔹 Progress */}
      <ProgressOverview landType={landData} />
    </main>
  );
}
