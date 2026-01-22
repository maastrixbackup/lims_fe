// import React, { useState } from "react";
// import ForestTable from "./ForestTable";
// import NonForestTable from "./NonForestTable";
// import CATable from "./CATable";
// import AbstractTable from "../forest/AbstarctTable";
// import ForestLandForm from "./ForestLandForm";
// import NonForestLandForm from "./NonForestLandForm";
// import CALandForm from "./CALandForm";

// const LandSchedule = () => {
//   const [activeTab, setActiveTab] = useState("forest");
//   const [openForestModal, setOpenForestModal] = useState(false);
//   const TABS = [
//     { key: "forest", label: "Forest Area Land Schedule" },
//     { key: "nonForest", label: "Non-Forest Area Land Schedule" },
//     { key: "ca", label: "CA / ACA Land Schedule" },
//   ];

//   const renderTable = () => {
//     switch (activeTab) {
//       case "forest":
//         return <ForestTable />;
//       case "nonForest":
//         return <NonForestTable />;
//       case "ca":
//         return <CATable />;
//       default:
//         return null;
//     }
//   };

//   const getAddButtonText = () => {
//     if (activeTab === "forest") return "Add Forest Land";
//     if (activeTab === "nonForest") return "Add Non-Forest Land";
//     if (activeTab === "ca") return "Add CA / ACA Land";
//   };

//   return (
//     <>
//       <div className="flex items-center justify-between mb-4">
//         <h2 className="text-xl font-semibold">
//           Land Area Schedule / Land Details
//         </h2>

//         <button
//           className="btn btn-primary"
//           onClick={() => setOpenForestModal(true)}
//         >
//           {getAddButtonText()}
//         </button>
//       </div>

//       <div className="bg-white p-4 rounded shadow mb-4">
//         <div className="flex gap-4 mb-4">
//           {TABS.map((tab) => (
//             <button
//               key={tab.key}
//               onClick={() => setActiveTab(tab.key)}
//               className={`pb-2 text-sm font-medium ${
//                 activeTab === tab.key
//                   ? "border-b-2 border-primary text-primary"
//                   : "text-gray-500"
//               }`}
//             >
//               {tab.label}
//             </button>
//           ))}
//         </div>

//         {renderTable()}
//       </div>

//       <div className="bg-white p-4 rounded shadow">
//         <AbstractTable />
//       </div>

//       {/* Forms */}
//       {activeTab === "forest" && (
//         <ForestLandForm
//           open={openForestModal}
//           onClose={() => setOpenForestModal(false)}
//         />
//       )}

//       {activeTab === "nonForest" && (
//         <NonForestLandForm
//           open={openForestModal}
//           onClose={() => setOpenForestModal(false)}
//         />
//       )}

//       {activeTab === "ca" && (
//         <CALandForm
//           open={openForestModal}
//           onClose={() => setOpenForestModal(false)}
//         />
//       )}
//     </>
//   );
// };

// export default LandSchedule;

import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";

import ForestTable from "./ForestTable";
import NonForestTable from "./NonForestTable";
import CATable from "./CATable";
import AbstractTable from "../forest/AbstarctTable";

import ForestLandForm from "./ForestLandForm";
import NonForestLandForm from "./NonForestLandForm";
import CALandForm from "./CALandForm";

import { getLandScheduleList } from "../../utils/LandAreaSchedule";

const SCHEDULE_TYPE_MAP = {
  forest: "FOREST_AREA",
  nonForest: "NON_FOREST_AREA",
  ca: "CA_LAND", 
};

const LandSchedule = () => {
  const token = useSelector((state) => state.auth.userToken);

  const [activeTab, setActiveTab] = useState("forest");
  const [openModal, setOpenModal] = useState(false);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const TABS = [
    { key: "forest", label: "Forest Area Land Schedule" },
    { key: "nonForest", label: "Non-Forest Area Land Schedule" },
    { key: "ca", label: "CA / ACA Land Schedule" },
  ];

  // 🔹 SINGLE FETCH HANDLER
  const fetchData = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    try {
      const scheduleType = SCHEDULE_TYPE_MAP[activeTab];

      const res = await getLandScheduleList(token, scheduleType);

      setData(res?.data || []);
    } catch (err) {
      console.error(err);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [activeTab, token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const renderTable = () => {
    if (loading) {
      return <p className="text-center py-10">Loading...</p>;
    }

    switch (activeTab) {
      case "forest":
        return <ForestTable data={data} />;
      case "nonForest":
        return <NonForestTable data={data} />;
      case "ca":
        return <CATable data={data} />;
      default:
        return null;
    }
  };

  const getAddButtonText = () => {
    if (activeTab === "forest") return "Add Forest Land";
    if (activeTab === "nonForest") return "Add Non-Forest Land";
    if (activeTab === "ca") return "Add CA / ACA Land";
  };

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">
          Land Area Schedule / Land Details
        </h2>

        <button
          className="btn btn-primary"
          onClick={() => setOpenModal(true)}
        >
          {getAddButtonText()}
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white p-4 rounded shadow mb-4">
        <div className="flex gap-4 mb-4">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`pb-2 text-sm font-medium ${
                activeTab === tab.key
                  ? "border-b-2 border-primary text-primary"
                  : "text-gray-500"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {renderTable()}
      </div>

      {/* Abstract */}
      <div className="bg-white p-4 rounded shadow">
        <AbstractTable />
      </div>

      {/* Forms */}
      {activeTab === "forest" && (
        <ForestLandForm
          open={openModal}
          onClose={() => setOpenModal(false)}
          onSuccess={fetchData}
        />
      )}

      {activeTab === "nonForest" && (
        <NonForestLandForm
          open={openModal}
          onClose={() => setOpenModal(false)}
          onSuccess={fetchData}
        />
      )}

      {activeTab === "ca" && (
        <CALandForm
          open={openModal}
          onClose={() => setOpenModal(false)}
          onSuccess={fetchData}
        />
      )}
    </>
  );
};

export default LandSchedule;
