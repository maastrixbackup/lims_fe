import React, { useState, useEffect } from "react";
import ProjectMasterTable from "./ProjectMasterTable";
import ProjectMasterForm from "./ProjectMasterForm";
import LevelTab from "../level/LevelTab";
import { apiClient } from "../../../utils/apiClient"; // make sure path is correct
import { useSelector } from "react-redux";

const ProjectDetails = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);

  const selectedProject = useSelector((s) => s.selectedProject.project);

  // Fetch projects function
  const fetchProjects = async () => {
    if (!selectedProject?.id) return;
    try {
      setLoading(true);
      const res = await apiClient(
        `/forestland/forestProjectList?project_id=${selectedProject.id}`,
        { method: "GET" }
      );

      const apiData = res?.data?.data || res?.data || [];
      setProjects(Array.isArray(apiData) ? apiData : []);
    } catch (err) {
      console.error(err);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [selectedProject?.id]);

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Project Master Data Details</h2>

        <button
          className="btn btn-primary btn-sm"
          onClick={() => setIsModalOpen(true)}
        >
          + Add Master Data
        </button>
      </div>

      <ProjectMasterTable
        projects={projects}
        loading={loading}
        fetchProjects={fetchProjects}
      />

      {isModalOpen && (
        <ProjectMasterForm
          onClose={() => setIsModalOpen(false)}
          fetchProjects={fetchProjects} // <-- now this works
        />
      )}

      <LevelTab />
    </div>
  );
};

export default ProjectDetails;
