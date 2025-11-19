import React, { useMemo, useState } from "react";
import { useKhata } from "../../../hooks/useKhata";
import KhataTable from "./KhataTable";
import KhataFormModal from "./KhataFormModal";
import DeleteConfirmModal from "../../../shared/DeleteConfirmModal";
import UploadModal from "./UploadModal";
import MapModal from "../../../shared/MapModal";
import { useSelector } from "react-redux";
import Loader from "../../../shared/Loader";
import { useParams } from "react-router";

const Khata = () => {
  const { landType } = useParams();
  const { khatas, modals, handlers, loading } = useKhata();

  const user = useSelector((state) => state.auth.user);
  const userRole = user?.role_name || "";

  const [filterVillage, setFilterVillage] = useState("");

  const villages = useMemo(() => {
    const set = new Set();
    khatas.forEach((k) => {
      if (k.village_name) set.add(k.village_name);
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [khatas]);

  const filteredKhatas = useMemo(() => {
    return khatas.filter((k) => {
      const matchVillage = !filterVillage || k.village_name === filterVillage;
      return matchVillage;
    });
  }, [khatas, filterVillage]);

  return (
    <div className="p-6 space-y-6">
      {loading ? (
        <div className="flex justify-center py-10">
          <Loader />
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold capitalize">
              {landType?.replace("-", " ") || "Private"} Khata
            </h2>

            <button
              className={`btn btn-primary text-white ${
                userRole === "Data Entry User" || userRole === "Viewer"
                  ? "!bg-gray-300 !text-gray-400 !border !border-gray-300 !cursor-not-allowed"
                  : ""
              }`}
              onClick={handlers.openAddModal}
              disabled={userRole === "Data Entry User" || userRole === "Viewer"}
            >
              + Add Khata
            </button>
          </div>

          <div className="flex flex-wrap gap-4">
            <select
              value={filterVillage}
              onChange={(e) => setFilterVillage(e.target.value)}
              className="select select-bordered w-48"
            >
              <option value="">All Villages</option>
              {villages.map((v) => (
                <option key={v} value={v}>
                  {v}
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
        </>
      )}

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
