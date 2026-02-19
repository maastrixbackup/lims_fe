import React, { useState, useMemo, useCallback } from "react";
import { useSelector } from "react-redux";
import useProjects from "../../hooks/useProjects";
import ProjectTable from "./ProjectTable";
import ProjectFormModal from "./ProjectFormModal";
import ConfirmDelete from "../../shared/ConfirmDelete";

/**
 * Project Type Mapping
 * Must match backend enum
 * 1 = Private
 * 2 = Government
 * 3 = Forest
 */
const PROJECT_TYPES = [
  { label: "All Types", value: "" },
  { label: "Private Land", value: 1 },
  { label: "Government Land", value: 2 },
  { label: "Forest Land", value: 3 },
];

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

  const [sortOrder, setSortOrder] = useState(""); // asc | desc
  const [typeFilter, setTypeFilter] = useState(""); // 1 | 2 | 3 | ""

  /* ================= FILTER + SORT ================= */
  const filteredAndSortedProjects = useMemo(() => {
    let data = [...projects];

    // 🔹 Filter by Project Type
    if (typeFilter) {
      data = data.filter((p) => p.type === Number(typeFilter));
    }

    // 🔹 Sort by Project Name
    if (sortOrder) {
      data.sort((a, b) =>
        sortOrder === "asc"
          ? a.project_name.localeCompare(b.project_name)
          : b.project_name.localeCompare(a.project_name)
      );
    }

    return data;
  }, [projects, sortOrder, typeFilter]);

  /* ================= MODAL HANDLERS ================= */
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

  /* ================= UI ================= */
  return (
    <main>
     <div className="flex justify-between items-center flex-wrap gap-4 mb-4">
  <h2 className="text-lg font-semibold">Projects List</h2>

  <div className="grid grid-cols-3 gap-3 items-center w-full sm:w-auto">
    <select
      className="select bg-white border border-gray-400 w-full"
      value={typeFilter}
      onChange={(e) => setTypeFilter(e.target.value)}
    >
      {PROJECT_TYPES.map((t) => (
        <option key={t.value} value={t.value}>
          {t.label}
        </option>
      ))}
    </select>

    <select
      className="select bg-white border border-gray-400 w-full"
      value={sortOrder}
      onChange={(e) => setSortOrder(e.target.value)}
    >
      <option value="">Sort by Name</option>
      <option value="asc">Ascending</option>
      <option value="desc">Descending</option>
    </select>

    <button
      className={`btn btn-primary w-full text-white ${
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
        projects={filteredAndSortedProjects}
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
            ? `Are you sure you want to delete "${deleteConfirm.project_name}"?`
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
