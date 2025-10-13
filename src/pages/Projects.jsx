import React, { useState } from "react";
import { useSelector } from "react-redux";
import useProjects from "../hooks/useProjects";
import ProjectTable from "../shared/ProjectTable";
import ProjectFormModal from "../shared/ProjectFormModal";
import ConfirmModal from "../shared/ConfirmModal";

const Projects = () => {
  const token = useSelector((state) => state.auth.userToken);
  const user = useSelector((state) => state.auth.user);
  const userRole = user?.role_name || "";

  const canModify = userRole !== "Admin" && userRole !== "Client";

  const {
    projects,
    loading,
    fetchProjects,
    handleSaveProject,
    handleDeleteProject,
  } = useProjects(token);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [sortOrder, setSortOrder] = useState("");

  const sortedProjects = [...projects].sort((a, b) => {
    if (!sortOrder) return 0;
    return sortOrder === "asc"
      ? a.name.localeCompare(b.name)
      : b.name.localeCompare(a.name);
  });

  const openModal = (project = null) => {
    if (!canModify) return;
    setEditingProject(project);
    setIsModalOpen(true);
  };

  return (
    <main className="flex-1 p-6 overflow-y-auto space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
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
            className={`btn btn-primary ${
              userRole === "Admin" || userRole === "Client"
                ? "btn-disabled opacity-50 cursor-not-allowed"
                : ""
            }`}
            onClick={() => {
              if (userRole !== "Admin" && userRole !== "Client") openModal();
            }}
            disabled={userRole === "Admin" || userRole === "Client"}
          >
            + Add User
          </button>
        </div>
      </div>
      <ProjectTable
        projects={sortedProjects}
        canModify={canModify}
        onEdit={openModal}
        onDelete={setDeleteConfirm}
        loading={loading}
      />
      {isModalOpen && (
        <ProjectFormModal
          project={editingProject}
          onClose={() => {
            setIsModalOpen(false);
            setEditingProject(null);
          }}
          onSave={async (formData) => {
            await handleSaveProject(formData, editingProject);
            setIsModalOpen(false);
            setEditingProject(null);
          }}
          loading={loading}
        />
      )}

      <ConfirmModal
        isOpen={!!deleteConfirm}
        title="Confirm Delete"
        message={
          deleteConfirm
            ? `Are you sure you want to delete "${deleteConfirm.name}"?`
            : ""
        }
        confirmText="Yes, Delete"
        cancelText="Cancel"
        confirmButtonClass="btn btn-error"
        onConfirm={async () => {
          await handleDeleteProject(deleteConfirm);
          setDeleteConfirm(null);
        }}
        onCancel={() => setDeleteConfirm(null)}
      />
    </main>
  );
};

export default Projects;
