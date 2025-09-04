import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import StatsCard from "../components/dashboard/StatsCard";
import PieChartCard from "../components/dashboard/PieChartCard";

export default function Dashboard() {
  return (
    <div className="flex h-screen bg-gray-50 text-gray-800">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />

        <main className="flex-1 p-6 overflow-y-auto">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <StatsCard
              title="Projects"
              value="120"
              subtitle="Jan - Mar 2025"
              gradient="bg-gradient-to-r from-indigo-500 to-purple-500"
            />
            <StatsCard
              title="Villages"
              value="85"
              subtitle="Jan - Mar 2025"
              gradient="bg-gradient-to-r from-pink-500 to-red-500"
            />
            <StatsCard
              title="Plots"
              value="560"
              subtitle="Jan - Mar 2025"
              gradient="bg-gradient-to-r from-orange-400 to-yellow-500"
            />
            <StatsCard
              title="Sub-Plots"
              value="320"
              subtitle="Jan - Mar 2025"
              gradient="bg-gradient-to-r from-blue-500 to-indigo-600"
            />
          </div>

          {/* Pie Chart */}
          <PieChartCard />
        </main>
      </div>
    </div>
  );
}
