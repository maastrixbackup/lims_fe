// src/pages/Khata.jsx
import React from "react";
import { useKhata } from "../hooks/useKhata";
import KhataTable from "../shared/KhataTable";
import KhataFormModal from "../shared/KhataFormModal";
import DeleteConfirmModal from "../shared/DeleteConfirmModal";
import UploadModal from "../shared/UploadModal";
import MapModal from "../shared/MapModal";

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

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Khata List</h2>
        <button className="btn btn-primary" onClick={handlers.openAddModal}>
          + Add Khata
        </button>
      </div>

      {/* Filters */}
      <div className="flex space-x-4">
        <select
          value={filterProject}
          onChange={(e) => {
            setFilterProject(e.target.value);
            setFilterVillage("");
          }}
          className="select select-bordered w-48"
        >
          <option value="">All Projects</option>
          {projects.map((p) => (
            <option key={p.id} value={p.name}>
              {p.name}
            </option>
          ))}
        </select>

        <select
          value={filterVillage}
          onChange={(e) => setFilterVillage(e.target.value)}
          className="select select-bordered w-48"
          disabled={!filterProject}
        >
          <option value="">All Villages</option>
          {villages
            .filter((v) => (filterProject ? v.project === filterProject : true))
            .map((v) => (
              <option key={v.id} value={v.name}>
                {v.name}
              </option>
            ))}
        </select>
      </div>

      {/* Table */}
      <KhataTable
        khatas={filteredKhatas}
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
        <DeleteConfirmModal {...modals.deleteProps} onConfirm={handlers.confirmDelete} />
      )}

      {modals.isUploadOpen && (
        <UploadModal {...modals.uploadProps} onClose={handlers.closeUploadModal} />
      )}

      {modals.isMapOpen && (
        <MapModal {...modals.mapProps} onClose={handlers.closeMapModal} />
      )}
    </div>
  );
};

export default Khata;
