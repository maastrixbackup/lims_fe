import React, { useState } from "react";
import ForestTable from "./ForestTable";
import NonForestTable from "./NonForestTable";
import CATable from "./CATable";
import AbstractTable from "./AbstarctTable";
import ForestLandForm from "./ForestLandForm";

const LandSchedule = () => {
  const [activeTab, setActiveTab] = useState("forest");
  const [openForestModal, setOpenForestModal] = useState(false);

  const TABS = [
    { key: "forest", label: "Forest Area Land Schedule" },
    { key: "nonForest", label: "Non-Forest Area Land Schedule" },
    { key: "ca", label: "CA / ACA Land Schedule" },
  ];

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

  const getAddButtonText = () => {
    if (activeTab === "forest") return "Add Forest Land";
    if (activeTab === "nonForest") return "Add Non-Forest Land";
    if (activeTab === "ca") return "Add CA / ACA Land";
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Land Area Schedule / Land Details
        </h2>

        <button
          className="btn btn-primary btn-md"
          onClick={() => setOpenForestModal(true)}
        >
          {getAddButtonText()}
        </button>
      </div>
      <div className="p-4 bg-base-100 rounded-xl shadow mb-4">
        <div className="flex gap-4 mb-4">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`pb-2 text-sm font-medium ${
                activeTab === tab.key
                  ? "border-b-2 border-primary text-primary"
                  : "text-gray-500 hover:text-primary"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">{renderTable()}</div>
      </div>

      {/* Abstract */}
      <div className="p-4 bg-base-100 rounded-xl shadow">
        <AbstractTable />
      </div>

      {/* Forest Modal */}
      <ForestLandForm
        open={openForestModal}
        onClose={() => setOpenForestModal(false)}
      />
    </>
  );
};

export default LandSchedule;
