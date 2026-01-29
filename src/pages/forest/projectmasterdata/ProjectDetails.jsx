import React, { useState, useEffect } from "react";
import ProjectMasterTable from "./ProjectMasterTable";
import ProjectMasterForm from "./ProjectMasterForm";
import LevelTab from "../level/LevelTab";
import { apiClient } from "../../../utils/apiClient";
import { useSelector } from "react-redux";
import Pagination from "../../../shared/Pagination";
import ConfirmDelete from "../../../shared/ConfirmDelete";
import SuccessMessage from "../../../shared/SuccessMessage";
import { useSuccessMessage } from "../../../hooks/useSuccessMessage";

const ProjectDetails = () => {
  const token = useSelector((s) => s.auth.userToken);
  const selectedProject = useSelector((s) => s.selectedProject.project);
   const { modal, showSuccess, showError, closeModal } = useSuccessMessage();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editRow, setEditRow] = useState(null);

    const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteRow, setDeleteRow] = useState(null);

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
    fetchProjects();
  }, [selectedProject?.id, page]);

  const handleEdit = (row) => {
    setEditRow(row);
    setIsModalOpen(true);
  };

  const handleDelete = (row) => {
    setDeleteRow(row);
    setShowDeleteModal(true);
  };

const confirmDelete = async () => {
  if (!deleteRow?.id) return;

  try {
    await apiClient(
      `/forestland/deleteForestProject/${deleteRow.id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setShowDeleteModal(false);
    setDeleteRow(null);

    showSuccess("Project deleted successfully"); 

    fetchProjects();
  } catch (err) {
    console.error("Delete failed:", err);
    showError("Failed to delete project"); 
  }
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
        onDelete={handleDelete}  
      />
{selectedProject && (
      <Pagination
        page={page}
        totalPages={totalPages}
        setPage={setPage}
      />
)}
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

      <ConfirmDelete
        isOpen={showDeleteModal}
        title="Confirm Delete"
        message={`Are you sure you want to delete record ID "${deleteRow?.id}"?`}
        onConfirm={confirmDelete}
        onCancel={() => {
          setShowDeleteModal(false);
          setDeleteRow(null);
        }}
      />
       <SuccessMessage
        open={modal.open}
        type={modal.type}
        message={modal.message}
        onClose={closeModal}
      />

    </div>
  );
};

export default ProjectDetails;
