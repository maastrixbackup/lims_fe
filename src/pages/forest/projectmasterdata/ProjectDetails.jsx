import React, { useState } from "react";
import ProjectMasterTable from "./ProjectMasterTable";
import ProjectMasterForm from "./ProjectMasterForm";
import LevelTab from "../level/LevelTab";

const ProjectDetails = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);


  return (
    <div className="p-4 space-y-4">
    
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          Project Master Data Details
        </h2>

        <button className="btn btn-primary btn-sm" onClick={() => setIsModalOpen(true)}>
          + Add Master Data
        </button>
      </div>
      <ProjectMasterTable />

      {isModalOpen && (
        <ProjectMasterForm onClose={() => setIsModalOpen(false)}/>
      )}
      <LevelTab />
    </div>
  );
};

export default ProjectDetails;
