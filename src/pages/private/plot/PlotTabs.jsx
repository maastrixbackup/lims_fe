
// import React, { useState } from "react";

// const tabs = [
//   "Basic Details",
//   "Tenant Information",
//   "Bank & Personal Details",
//   "Legal Issues",
//   "Land Area Valuation Details",
//   // "RR Details",
//   "Grievance & Tribunal Details",
//   "Family Details",
// ];

// const PlotTabs = ({ children }) => {
//   const [activeTab, setActiveTab] = useState(0);

//   return (
//     <div className="w-full">
//       {/* Tabs header */}
//       <div className="flex gap-2 border-b border-gray-100 mb-3 overflow-x-auto scrollbar-hide sm:overflow-visible">
//         {tabs.map((tab, idx) => (
//           <button
//             key={idx}
//             onClick={() => setActiveTab(idx)}
//             className={`
//               flex-shrink-0
//               px-4 py-3
//               text-sm font-medium whitespace-nowrap
//               border-b-1 transition-colors duration-200
//               ${
//                 activeTab === idx
//                   ? "border-blue-600 text-blue-600"
//                   : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
//               }
//             `}
//           >
//             {tab}
//           </button>
//         ))}
//       </div>

//       {/* Active tab content */}
//       <div className="mt-2">
//         {Array.isArray(children) ? children[activeTab] : children}
//       </div>
//     </div>
//   );
// };

// export default PlotTabs;



// import React, { useState, useMemo } from "react";
// import { useParams } from "react-router";

// const ALL_TABS = [
//   "Basic Details",
//   "Bank & Personal Details",
//   "Land Area Valuation Details",
//   "Grievance & Tribunal Details",
//   "Family Details",
//   "Legal Issues",
// ];

// const PlotTabs = ({ children }) => {
//   const { landType } = useParams();
//   const [activeTab, setActiveTab] = useState(0);

//   // ✅ Filter tabs based on landType
//   const tabs = useMemo(() => {
//     return landType === "govt-land"
//       ? ALL_TABS
//       : ALL_TABS.filter((tab) => tab !== "Legal Issues");
//   }, [landType]);

//   return (
//     <div className="w-full">
//       <div className="flex mb-2 overflow-x-auto scrollbar-hide">
//         {tabs.map((tab, idx) => (
//           <button
//             key={idx}
//             onClick={() => setActiveTab(idx)}
//             className={`px-6 py-3 whitespace-nowrap font-medium text-sm 
//               border-b-2 transition
//               ${
//                 activeTab === idx
//                   ? "border-blue-600 text-blue-600"
//                   : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
//               }
//             `}
//           >
//             {tab}
//           </button>
//         ))}
//       </div>

//       {/* ✅ Match children with filtered tabs */}
//       <div className="mt-2">{children[activeTab]}</div>
//     </div>
//   );
// };

// export default PlotTabs;


import React, { useState } from "react";

const tabs = [
  "Basic Details",
  "Tenant Information",
  "Bank & Personal Details",
  "Legal Issues",
  "Land Area Valuation Details",
  // "RR Details",
  "Grievance & Tribunal Details",
  "Family Details"
];

const PlotTabs = ({ children }) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="w-full">

      {/* <div className="flex border-b mb-4 overflow-x-auto scrollbar-hide"> */}
        {tabs.map((tab, idx) => (
          <button
            key={idx}
            onClick={() => setActiveTab(idx)}
            className={`px-3 py-3 whitespace-nowrap font-medium text-sm 
              border-b-2 transition
              ${
                activeTab === idx
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }
            `}
          >
            {tab}
          </button>
        ))}
      {/* </div> */}

      <div className="mt-2">{children[activeTab]}</div>
    </div>
  );
};

export default PlotTabs;

