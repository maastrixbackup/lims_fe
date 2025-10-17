// src/pages/Khata.jsx
import React from "react";
import { useKhata } from "../hooks/useKhata";
import KhataTable from "../shared/KhataTable";
import KhataFormModal from "../shared/KhataFormModal";
import DeleteConfirmModal from "../shared/DeleteConfirmModal";
import UploadModal from "../shared/UploadModal";
import MapModal from "../shared/MapModal";
import { useSelector } from "react-redux";

const Khata = () => {
  const {
    projects,
    villages,
    filteredKhatas,
    openAddModal,
    filterProject,
    setFilterProject,
    filterVillage,
    setFilterVillage,
    modals,
    handlers,
  } = useKhata();
const user = useSelector((state) => state.auth.user);
  const userRole = user?.role_name || "";


  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Khata List</h2>
        <button 
        // className="btn btn-primary"
         className={`btn btn-primary text-white ${
            userRole === "Admin" || userRole === "Client"
              ? "!bg-gray-300 !text-gray-400 !border !border-gray-300 !cursor-not-allowed"
              : ""
          }`} 
        onClick={handlers.openAddModal}
        disabled={userRole === "Admin" || userRole === "Client"}
        >
          + Add Khata
        </button>
      </div>

      <div className="flex space-x-4">
        {/* Project Filter */}
        <select
          value={filterProject}
          onChange={(e) => {
            setFilterProject(e.target.value);
            setFilterVillage(""); // reset village when project changes
          }}
          className="select select-bordered w-48"
        >
          <option value="">All Projects</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.project_name || p.name}
            </option>
          ))}
        </select>

        {/* Village Filter */}
        <select
          value={filterVillage}
          onChange={(e) => setFilterVillage(e.target.value)}
          className="select select-bordered w-48"
          disabled={!filterProject} // disable until project is selected
        >
          <option value="">All Villages</option>
          {villages
            .filter((v) =>
              filterProject ? v.project_id === parseInt(filterProject) : true
            )
            .map((v) => (
              <option key={v.id} value={v.id}>
                {v.village_name || v.name}
              </option>
            ))}
        </select>
      </div>
      <KhataTable
        khatas={filteredKhatas} // use filteredKhatas from the hook
        onEdit={handlers.openEditModal}
        onDelete={handlers.openDeleteModal}
        onUpload={handlers.openUploadModal}
        onMap={handlers.openMapModal}
      />

      {/* Modals */}
      {modals.isFormOpen && (
        <KhataFormModal {...modals.formProps} onClose={handlers.closeForm} />
      )}

      {modals.isDeleteOpen && (
        <DeleteConfirmModal
          {...modals.deleteProps}
          onCancel={handlers.closeDeleteModal}
        />
      )}

      {modals.isUploadOpen && (
        <UploadModal
          {...modals.uploadProps}
          onClose={handlers.closeUploadModal}
        />
      )}

      {modals.isMapOpen && (
        <MapModal {...modals.mapProps} onClose={handlers.closeMapModal} />
      )}
    </div>
  );
};

export default Khata;
