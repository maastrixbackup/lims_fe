import React, { useState } from "react";
import ForestTable from "./ForestTable";
import NonForestTable from "./NonForestTable";
import CATable from "./CATable";
import AbstractTable from "./AbstarctTable";

const LandSchedule = () => {
  const [activeTab, setActiveTab] = useState("forest");

  const TABS = [
    { key: "forest", label: "Forest Area Land Schedule" },
    { key: "nonForest", label: "Non-Forest Area Land Schedule" },
    { key: "ca", label: "CA / ACA Land Schedule" },
  ];

  const getTitle = () => {
    switch (activeTab) {
      case "forest":
        return "Forest Area Land Schedule";
      case "nonForest":
        return "Non-Forest Area Land Schedule";
      case "ca":
        return "CA / ACA Land Schedule";
      default:
        return "";
    }
  };

  const renderTable = () => {
    switch (activeTab) {
      case "forest":
        return <ForestTable />;
      case "nonForest":
        return <NonForestTable />;
      case "ca":
        return <CATable />;
      default:
        return null;
    }
  };

  return (
    <>
      <div className="p-4 bg-base-100 rounded-xl shadow">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            {/* {getTitle()} */}
            Land Area Schedule / Land Details
          </h2>

          <button className="btn btn-primary btn-md">Add Forest Land</button>
        </div>
        <div className="flex gap-4 mb-4">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`pb-2 text-sm font-medium transition ${
                activeTab === tab.key
                  ? "border-b-2 border-primary text-primary"
                  : "text-gray-500 hover:text-primary"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        {/* <h5 className="text-gray-700 font-semibold mb-4">{getTitle()}</h5> */}
        <div className="overflow-x-auto mb-4">{renderTable()}</div>
      </div>
      <div className="p-4 bg-base-100 rounded-xl shadow">
        <AbstractTable />
      </div>
    </>
  );
};

export default LandSchedule;
