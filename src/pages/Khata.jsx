// src/pages/Khata.jsx
import React, { useMemo } from "react";
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
    khatas, // 👈 include raw khata list (not just filteredKhatas)
    filteredKhatas,
    filterProject,
    setFilterProject,
    filterVillage,
    setFilterVillage,
    modals,
    handlers,
  } = useKhata();

  const user = useSelector((state) => state.auth.user);
  const userRole = user?.role_name || "";

  // ✅ Dynamically build village list from khata data
  const villages = useMemo(() => {
    if (!khatas || khatas.length === 0) return [];

    // if project selected → filter first by project
    const filtered = filterProject
      ? khatas.filter(
          (k) => String(k.project_id) === String(filterProject)
        )
      : khatas;

    // extract unique villages
    const unique = [];
    const seen = new Set();

    for (const k of filtered) {
      if (!seen.has(k.village_id)) {
        seen.add(k.village_id);
        unique.push({
          id: k.village_id,
          name: k.village_name,
          project_id: k.project_id,
        });
      }
    }
    return unique;
  }, [khatas, filterProject]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Khata List</h2>
        <button
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

      {/* ✅ Project + Village Filters */}
      <div className="flex space-x-4">
        {/* Project Dropdown */}
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
            <option key={p.id} value={p.id}>
              {p.project_name || p.name}
            </option>
          ))}
        </select>

        {/* Village Dropdown */}
        <select
          value={filterVillage}
          onChange={(e) => setFilterVillage(e.target.value)}
          className="select select-bordered w-48"
          disabled={!filterProject}
        >
          <option value="">All Villages</option>
          {villages.map((v) => (
            <option key={v.id} value={v.id}>
              {v.name}
            </option>
          ))}
        </select>
      </div>

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
