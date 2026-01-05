import React, { useState, useMemo } from "react";
import { useParams } from "react-router";

const ALL_TABS = [
  "Basic Details",
  "Bank & Personal Details",
  "Land Area Valuation Details",
  "Grievance & Tribunal Details",
  "Family Details",
  "Legal Issues",
];

const PlotTabs = ({ children }) => {
  const { landType } = useParams();
  const [activeTab, setActiveTab] = useState(0);

  // ✅ Filter tabs based on landType
  const tabs = useMemo(() => {
    return landType === "govt-land"
      ? ALL_TABS
      : ALL_TABS.filter((tab) => tab !== "Legal Issues");
  }, [landType]);

  return (
    <div className="w-full">
      <div className="flex mb-2 overflow-x-auto scrollbar-hide">
        {tabs.map((tab, idx) => (
          <button
            key={idx}
            onClick={() => setActiveTab(idx)}
            className={`px-6 py-3 whitespace-nowrap font-medium text-sm 
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
      </div>

      {/* ✅ Match children with filtered tabs */}
      <div className="mt-2">{children[activeTab]}</div>
    </div>
  );
};

export default PlotTabs;
