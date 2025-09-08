import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import StatsCard from "../components/dashboard/StatsCard";
import PieChartCard from "../components/dashboard/PieChartCard";
import BarChartCard from "../components/dashboard/BarChartCard";
import RecentProjects from "../components/dashboard/RecentProjects";
import RecentActivity from "../components/dashboard/RecentActivity";
import ProgressOverview from "../components/dashboard/ProgressOverview";

export default function Dashboard() {
  return (
    <div className="flex h-screen bg-gray-50 text-gray-800">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />

        <main className="flex-1 p-6 overflow-y-auto space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="Projects"
              value="5"
              gradient="bg-gradient-to-r from-indigo-500 to-purple-600"
            />
            <StatsCard
              title="Villages"
              value="85"
              gradient="bg-gradient-to-r from-green-400 to-emerald-600"
            />
            <StatsCard
              title="Plots"
              value="560"
              gradient="bg-gradient-to-r from-orange-400 to-red-500"
            />
            <StatsCard
              title="Sub-Plots"
              value="320"
              gradient="bg-gradient-to-r from-teal-400 to-cyan-500"
            />
            <StatsCard
              title="Survey Status"
              value="80"
              gradient="bg-gradient-to-r from-pink-500 to-fuchsia-600"
            />
            <StatsCard
              title="Payment Status"
              value="100"
              gradient="bg-gradient-to-r from-yellow-400 to-amber-500"
            />
            <StatsCard
              title="LA Status"
              value="12"
              gradient="bg-gradient-to-r from-lime-400 to-green-600"
            />
            <StatsCard
              title="RR Status"
              value="24"
              gradient="bg-gradient-to-r from-sky-400 to-blue-600"
            />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BarChartCard />
            <PieChartCard />
          </div>

          {/* Data + Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RecentProjects />
            <RecentActivity />
          </div>

          {/* KPI Progress */}
          <ProgressOverview />
        </main>
      </div>
    </div>
  );
}
