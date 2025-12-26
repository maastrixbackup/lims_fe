import React, { useState, useMemo, useCallback } from "react";
import { useSelector } from "react-redux";
import useProjects from "../../hooks/useProjects";
import ProjectTable from "./ProjectTable";
import ProjectFormModal from "./ProjectFormModal";
import ConfirmDelete from "../../shared/ConfirmDelete";

const Projects = () => {
  const { userToken: token, user } = useSelector((state) => state.auth);
  const userRole = user?.role_name || "";

  const canModify = !(userRole === "Data Entry User" || userRole === "Viewer");

  const {
    projects,
    loading,
    handleSaveProject,
    handleDeleteProject,
  } = useProjects(token);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [sortOrder, setSortOrder] = useState("");

  /* ------------------ SORT PROJECTS ------------------ */
  const sortedProjects = useMemo(() => {
    if (!sortOrder) return projects;

    return [...projects].sort((a, b) =>
      sortOrder === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    );
  }, [projects, sortOrder]);

  /* ------------------ HANDLERS ------------------ */
  const openModal = useCallback(
    (project = null) => {
      if (!canModify) return;
      setEditingProject(project);
      setIsModalOpen(true);
    },
    [canModify]
  );

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingProject(null);
  }, []);

  const handleSave = useCallback(
    async (formData) => {
      await handleSaveProject(formData, editingProject);
      closeModal();
    },
    [handleSaveProject, editingProject, closeModal]
  );

  const handleConfirmDelete = useCallback(async () => {
    await handleDeleteProject(deleteConfirm);
    setDeleteConfirm(null);
  }, [handleDeleteProject, deleteConfirm]);

  return (
    <main>
      <div className="flex justify-between items-center flex-wrap gap-4 mb-4">
        <h2 className="text-lg font-semibold">Projects List</h2>

        <div className="flex items-center gap-3">
          <select
            className="select bg-white rounded-box border border-gray-400 focus:border-blue-500 focus:outline-none"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="">All Projects</option>
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>

          <button
            className={`btn btn-primary text-white ${
              !canModify &&
              "!bg-gray-300 !text-gray-400 !border-gray-300 !cursor-not-allowed"
            }`}
            onClick={() => openModal()}
            disabled={!canModify}
          >
            + Add Project
          </button>
        </div>
      </div>

      <ProjectTable
        projects={sortedProjects}
        loading={loading}
        onEdit={openModal}
        onDelete={setDeleteConfirm}
      />

      {isModalOpen && (
        <ProjectFormModal
          project={editingProject}
          onClose={closeModal}
          onSave={handleSave}
          loading={loading}
        />
      )}

      <ConfirmDelete
        isOpen={Boolean(deleteConfirm)}
        title="Confirm Delete"
        message={
          deleteConfirm
            ? `Are you sure you want to delete "${deleteConfirm.name}"?`
            : ""
        }
        confirmText="Yes, Delete"
        cancelText="Cancel"
        confirmButtonClass="btn btn-error"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteConfirm(null)}
      />
    </main>
  );
};

export default Projects;
