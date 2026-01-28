import React, { useState, useEffect } from "react";
import ProjectMasterTable from "./ProjectMasterTable";
import ProjectMasterForm from "./ProjectMasterForm";
import LevelTab from "../level/LevelTab";
import { apiClient } from "../../../utils/apiClient";
import { useSelector } from "react-redux";
import Pagination from "../../../shared/Pagination";

const ProjectDetails = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editRow, setEditRow] = useState(null);

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const selectedProject = useSelector((s) => s.selectedProject.project);

  const fetchProjects = async () => {
    if (!selectedProject?.id) return;

    try {
      setLoading(true);

      const res = await apiClient(
        `/forestland/forestProjectList?project_id=${selectedProject.id}&page=${page}&limit=${limit}`
      );

      setProjects(res?.data || []);
      setTotalPages(res?.totalPages || 1);
    } catch (err) {
      console.error(err);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [selectedProject?.id]);

  useEffect(() => {
    fetchProjects();
  }, [selectedProject?.id, page]);

  const handleEdit = (row) => {
    setEditRow(row);     
    setIsModalOpen(true); 
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between">
        <h2 className="text-xl font-semibold">Project Master Data Details</h2>

        <button
          className="btn btn-primary btn-sm"
          onClick={() => {
            setEditRow(null);  
            setIsModalOpen(true);
          }}
        >
          + Add Master Data
        </button>
      </div>

      <ProjectMasterTable
        projects={projects}
        loading={loading}
        onEdit={handleEdit} 
      />

      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      {isModalOpen && (
        <ProjectMasterForm
          editData={editRow}   
          onClose={() => {
            setIsModalOpen(false);
            setEditRow(null);
          }}
          fetchProjects={fetchProjects}
        />
      )}

      <LevelTab />
    </div>
  );
};

export default ProjectDetails;
