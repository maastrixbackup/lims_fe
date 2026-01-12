import React, { useState } from "react";

const tabs = [
  "Basic Details",
  "Legal Issues",
  "Land Area Valuation Details",
];

const PlotTab = ({ children }) => {
  const [activeTab, setActiveTab] = useState(0);

  // ✅ Normalize children safely
  const tabChildren = React.Children.toArray(children);

  return (
    <div className="w-full">
      <div className="flex mb-4 overflow-x-auto scrollbar-hide">
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
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="mt-2">
        {tabChildren[activeTab]}
      </div>
    </div>
  );
};

export default PlotTab;
