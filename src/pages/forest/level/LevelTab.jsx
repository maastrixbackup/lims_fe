import React, { useState } from "react";
import Level0 from "./LevelZero";
import Level1 from "./LevelOne";
import Level2 from "./LevelTwo";
import LevelThree from "./LevelThree";
import LevelFour from "./LevelFour";

const LevelTab = () => {
  const [activeTab, setActiveTab] = useState("level0");

  const tabs = [
    { id: "level0", label: "Level 0" },
    { id: "level1", label: "Level 1" },
    { id: "level2", label: "Level 2" },
     { id: "level3", label: "Level 3" },
      { id: "level4", label: "Level 4" },
  ];

  return (
 <div className="w-full mt-4">
      <div className="flex mb-2 overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
          className={`px-6 py-3 whitespace-nowrap font-medium text-md
              border-b-2 transition
              ${
                activeTab === tab.id
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent font-semibold text-gray-700 hover:text-gray-700 hover:border-gray-300"
              }`}
          >
            {tab.label}
          </div>
        ))}
      </div>


      <div className="font-semibold ">

        {activeTab === "level0" && <Level0 />}

        {activeTab === "level1" && <Level1 />}

        {activeTab === "level2" && <Level2 />}
         {activeTab === "level3" && <LevelThree />}
          {activeTab === "level4" && <LevelFour />}

      </div>
    </div>
  );
};

export default LevelTab;
