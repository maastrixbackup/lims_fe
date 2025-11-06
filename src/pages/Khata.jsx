import React, { useMemo, useState } from "react";
import { useKhata } from "../hooks/useKhata";
import KhataTable from "../pages/khata/KhataTable";
import KhataFormModal from "../pages/khata/KhataFormModal";
import DeleteConfirmModal from "../shared/DeleteConfirmModal";
import UploadModal from "../pages/khata/UploadModal";
import MapModal from "../shared/MapModal";
import PlotListModal from "../pages/khata/PlotListModal";
import { useSelector } from "react-redux";


const Khata = () => {
  const {
    projects,
    khatas,
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
  const [isPlotModalOpen, setIsPlotModalOpen] = useState(false);

  const plots = [
    {
      id: 1,
      plot_no: "P-101",
      survey_no: "SR-5001",
      area: 2400,
      village_name: "Rampur",
      owner_name: "Ramesh Patel",
      status: "Completed",
    },
    {
      id: 2,
      plot_no: "P-102",
      survey_no: "SR-5002",
      area: 1800,
      village_name: "Rampur",
      owner_name: "Suresh Mehta",
      status: "Pending",
    },
    {
      id: 3,
      plot_no: "P-103",
      survey_no: "SR-5003",
      area: 2200,
      village_name: "Bhavnagar",
      owner_name: "Meena Shah",
      status: "In Progress",
    },
  ];

  // const villages = useMemo(() => {
  //   if (!khatas || khatas.length === 0) return [];

  //   const filtered = filterProject
  //     ? khatas.filter((k) => String(k.project_id) === String(filterProject))
  //     : khatas;

  //   const unique = [];
  //   const seen = new Set();

  //   for (const k of filtered) {
  //     if (!seen.has(k.village_id)) {
  //       seen.add(k.village_id);
  //       unique.push({
  //         id: k.village_id,
  //         name: k.village_name,
  //         project_id: k.project_id,
  //       });
  //     }
  //   }
  //   return unique;
  // }, [khatas, filterProject]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Khata List</h2>

        {/* Buttons on Right Side */}
        <div className="flex gap-3">
          <button
            className="btn btn-outline btn-primary"
            onClick={() => setIsPlotModalOpen(true)}
          >
            View Plots
          </button>

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
      </div>
      {/* <div className="flex space-x-4">
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
      </div> */}
      <KhataTable
        khatas={filteredKhatas}
        onEdit={handlers.openEditModal}
        onDelete={handlers.openDeleteModal}
        onUpload={handlers.openUploadModal}
        onMap={handlers.openMapModal}
      />
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
      {isPlotModalOpen && (
        <PlotListModal
          plots={plots}
          onClose={() => setIsPlotModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Khata;
