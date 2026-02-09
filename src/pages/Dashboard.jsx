// import React from "react";
// import Sidebar from "../components/layout/Sidebar";
// import Header from "../components/layout/Header";
// import StatsCard from "../components/dashboard/StatsCard";
// import PieChartCard from "../components/dashboard/PieChartCard";
// import BarChartCard from "../components/dashboard/BarChartCard";
// import RecentProjects from "../components/dashboard/RecentProjects";
// import RecentActivity from "../components/dashboard/RecentActivity";
// import ProgressOverview from "../components/dashboard/ProgressOverview";
// import Loader from "../shared/Loader";
// import useFetchDashboard from "../hooks/useFetchDashboard";
// import { useNavigate} from "react-router-dom";
// import { useSelector } from "react-redux";

// export default function Dashboard() {
//   const { data, loading, error } = useFetchDashboard();
//   const navigate= useNavigate()
// // console.log("DASHBOARDDDDD",data)
// // const user = useSelector((state)=>state.auth.user)
// // console.log("dashbord users", user)
//   if (loading) {
//     return <Loader />;
//   }

//   if (error) {
//     return (
//       <div className="flex justify-center items-center h-screen text-red-600 font-medium">
//         Error: {error.message}
//       </div>
//     );
//   }

//   return (
//     <main className="flex-1  overflow-y-auto">
//       {/* <h2 className="text-xl font-semibold capitalize">Overview</h2> */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         <StatsCard
//           title="Projects"
//           value={data ? data.projects : "N/A"}
//           gradient="bg-gradient-to-r from-indigo-500 to-purple-600"
//             onClick={() => navigate("/projects")}
//         />
//         <StatsCard
//           title="Villages"
//           value={data ? data.villages : "N/A"}
//           gradient="bg-gradient-to-r from-green-400 to-emerald-600"
//           onClick={() => navigate("/private-land/villages")}
//         />
//         <StatsCard
//           title="Khata"
//           value={data ? data.khata : "N/A"}
//           gradient="bg-gradient-to-r from-teal-400 to-cyan-500"
//           onClick={() => navigate("/private-land/khatas")}
//         />
//         <StatsCard
//           title="Plots"
//           value={data ? data.plots : "N/A"}
//           gradient="bg-gradient-to-r from-orange-400 to-red-500"
//           onClick={() => navigate("/private-land/plots")}
//         />

//         <StatsCard
//           title="Survey Status"
//           value={data ? data.survey_status : "N/A"}
//           gradient="bg-gradient-to-r from-pink-500 to-fuchsia-600"
//         />
//         <StatsCard
//           title="Payment Status"
//           value={data ? data.payment_status : "N/A"}
//           gradient="bg-gradient-to-r from-yellow-400 to-amber-500"
//         />
//         <StatsCard
//           title="LA Status"
//           value={data ? data.la_status : "N/A"}
//           gradient="bg-gradient-to-r from-lime-400 to-green-600"
//         />
//         <StatsCard
//           title="RR Status"
//           value={data ? data.rr_status : "N/A"}
//           gradient="bg-gradient-to-r from-sky-400 to-blue-600"
//         />
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <BarChartCard />
//         <PieChartCard />
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <RecentProjects />
//         <RecentActivity />
//       </div>

//       <ProgressOverview />
//     </main>
//   );
// }



// import React, { useState, useMemo } from "react";
// import StatsCard from "../components/dashboard/StatsCard";
// import PieChartCard from "../components/dashboard/PieChartCard";
// import BarChartCard from "../components/dashboard/BarChartCard";
// import RecentProjects from "../components/dashboard/RecentProjects";
// import RecentActivity from "../components/dashboard/RecentActivity";
// import ProgressOverview from "../components/dashboard/ProgressOverview";
// import Loader from "../shared/Loader";
// import useFetchDashboard from "../hooks/useFetchDashboard";
// import { useNavigate } from "react-router-dom";

// const LAND_TYPES = [
//   { key: "private", label: "Private Land" },
//   { key: "govt", label: "Government Land" },
//   { key: "forest", label: "Forest Land" },
// ];

// export default function Dashboard() {
//   const { data, loading, error } = useFetchDashboard();
//   const navigate = useNavigate();

//   const [landType, setLandType] = useState("private");

//   const landData = useMemo(() => {
//     return data?.[landType] || {};
//   }, [data, landType]);

//   if (loading) return <Loader />;

//   if (error) {
//     return (
//       <div className="flex justify-center items-center h-screen text-red-600 font-medium">
//         Error: {error.message}
//       </div>
//     );
//   }

//   return (
//     <main className="flex-1 overflow-y-auto space-y-6">

//       {/* 🔹 Land Type Selector */}
//       <div className="flex gap-3">
//         {LAND_TYPES.map((type) => (
//           <button
//             key={type.key}
//             onClick={() => setLandType(type.key)}
//             className={`px-4 py-2 rounded-lg text-sm font-medium transition
//               ${
//                 landType === type.key
//                   ? "bg-indigo-600 text-white"
//                   : "bg-gray-100 hover:bg-gray-200"
//               }`}
//           >
//             {type.label}
//           </button>
//         ))}
//       </div>

//       {/* 🔹 Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         <StatsCard
//           title="Projects"
//           value={landData.projects ?? "0"}
//           gradient="bg-gradient-to-r from-indigo-500 to-purple-600"
//           onClick={() => navigate("/projects")}
//         />

//         <StatsCard
//           title="Villages"
//           value={landData.villages ?? "0"}
//           gradient="bg-gradient-to-r from-green-400 to-emerald-600"
//         />

//         <StatsCard
//           title="Khata"
//           value={landData.khata ?? "0"}
//           gradient="bg-gradient-to-r from-teal-400 to-cyan-500"
//         />

//         <StatsCard
//           title="Plots"
//           value={landData.plots ?? "0"}
//           gradient="bg-gradient-to-r from-orange-400 to-red-500"
//         />

//         <StatsCard
//           title="Survey Status"
//           value={landData.survey_status ?? "0"}
//           gradient="bg-gradient-to-r from-pink-500 to-fuchsia-600"
//         />

//         <StatsCard
//           title="Payment Status"
//           value={landData.payment_status ?? "0"}
//           gradient="bg-gradient-to-r from-yellow-400 to-amber-500"
//         />

//         <StatsCard
//           title="LA Status"
//           value={landData.la_status ?? "0"}
//           gradient="bg-gradient-to-r from-lime-400 to-green-600"
//         />

//         <StatsCard
//           title="RR Status"
//           value={landData.rr_status ?? "0"}
//           gradient="bg-gradient-to-r from-sky-400 to-blue-600"
//         />
//       </div>

//       {/* 🔹 Charts */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <BarChartCard data={landData} />
//         <PieChartCard data={landData} />
//       </div>

//       {/* 🔹 Activity */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <RecentProjects landType={landType} />
//         <RecentActivity landType={landType} />
//       </div>

//       <ProgressOverview landType={landType} />
//     </main>
//   );
// }

import React, { useState, useMemo } from "react";
import StatsCard from "../components/dashboard/StatsCard";
import PieChartCard from "../components/dashboard/PieChartCard";
import BarChartCard from "../components/dashboard/BarChartCard";
import RecentProjects from "../components/dashboard/RecentProjects";
import RecentActivity from "../components/dashboard/RecentActivity";
import ProgressOverview from "../components/dashboard/ProgressOverview";
import { useNavigate } from "react-router-dom";

const LAND_TYPES = [
  { key: "private", label: "Private Land" },
  { key: "govt", label: "Government Land" },
  { key: "forest", label: "Forest Land" },
];

const DUMMY_DASHBOARD_DATA = {
  private: {
    projects: 12,
    villages: 85,
    khata: 420,
    plots: 980,
    survey_status: 620,
    payment_status: 410,
    la_status: 280,
    rr_status: 190,
  },
  govt: {
    projects: 6,
    villages: 34,
    khata: 110,
    plots: 320,
    survey_status: 210,
    payment_status: 130,
    la_status: 95,
    rr_status: 60,
  },
  forest: {
    projects: 3,
    villages: 18,
    khata: 675,
    plots: 140,
    survey_status: 90,
    payment_status: 45,
    la_status: 30,
    rr_status: 20,
  },
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [landType, setLandType] = useState("private");

  const landData = useMemo(() => {
    return DUMMY_DASHBOARD_DATA[landType];
  }, [landType]);

  return (
    <main className="flex-1 overflow-y-auto space-y-6">
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Projects"
          value={landData.projects}
          gradient="bg-gradient-to-r from-indigo-500 to-purple-600"
          onClick={() => navigate("/projects")}
        />

        <StatsCard
          title="Villages"
          value={landData.villages}
          gradient="bg-gradient-to-r from-green-400 to-emerald-600"
        />

        <StatsCard
          title="Khata"
          value={landData.khata}
          gradient="bg-gradient-to-r from-teal-400 to-cyan-500"
        />

        <StatsCard
          title="Plots"
          value={landData.plots}
          gradient="bg-gradient-to-r from-orange-400 to-red-500"
        />

        <StatsCard
          title="Survey Status"
          value={landData.survey_status}
          gradient="bg-gradient-to-r from-pink-500 to-fuchsia-600"
        />

        <StatsCard
          title="Payment Status"
          value={landData.payment_status}
          gradient="bg-gradient-to-r from-yellow-400 to-amber-500"
        />

        <StatsCard
          title="LA Status"
          value={landData.la_status}
          gradient="bg-gradient-to-r from-lime-400 to-green-600"
        />

        <StatsCard
          title="RR Status"
          value={landData.rr_status}
          gradient="bg-gradient-to-r from-sky-400 to-blue-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BarChartCard data={landData} />
        <PieChartCard data={landData} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentProjects landType={landType} />
        <RecentActivity landType={landType} />
      </div>

      <ProgressOverview landType={landType} />
    </main>
  );
}