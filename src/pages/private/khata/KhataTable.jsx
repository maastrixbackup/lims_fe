import React, { useState } from "react";
import {
  Pencil,
  Trash2,
  Upload,
  Map as MapIcon,
  LandPlot,
  DockIcon,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import PlotListModal from "./PlotListModal";
import { setSelectedKhataId } from "../../../utils/khataSlice";
import Pagination from "../../../shared/Pagination";

const KhataTable = ({
  khatas,
  page,
  limit,
  setLimit,
  totalPages,
  setPage,
  onEdit,
  onDelete,
  onUpload,
  onMap,
}) => {
  const dispatch = useDispatch();
  const userRole = useSelector((state) => state.auth.user?.role_name);
  const selectedProject = useSelector((state) => state.selectedProject.project);

  const [isPlotModalOpen, setIsPlotModalOpen] = useState(false);

  const isRestricted = userRole === "Data Entry User" || userRole === "Viewer";

  const displayKhatas = selectedProject
    ? khatas.filter((k) => k.project_id === selectedProject.id)
    : khatas;

  const stickyActionHeader =
    "p-3 text-right bg-gray-200 text-gray-700 sticky right-0 z-[30] shadow-md";

  const stickyActionCell =
    "p-3 text-right bg-white sticky right-0 border-l border-gray-100 shadow-sm";
  const formatThreeItems = (value) => {
    let items = [];

    if (typeof value === "string") {
      items = value.split(",").map((v) => v.trim());
    } else if (Array.isArray(value)) {
      items = value;
    }

    if (items.length === 0) return "No data";

    const firstThree = items.slice(0, 3).join(", ");

    return items.length > 3 ? `${firstThree} … (${items.length})` : firstThree;
  };

  return (
    <>
      <div className="card bg-white shadow-lg">
        <div className="max-h-[400px] overflow-x-auto">
          <table className="table w-full">
            <thead className="bg-gray-200 text-gray-700 sticky top-0 z-10 whitespace-nowrap">
              <tr>
                <th>Sl/No</th>
                <th>Name of Village</th>
                <th>Village Code</th>
                <th>Khata No.</th>
                <th>Plot No.</th>
                <th>Kissam of the Land</th>
                <th>Category of Land</th>
                <th>Total Area (Ac)</th>
                <th>Total Area (Ha)</th>
                <th>Acquired Area (Ac)</th>
                <th>Acquired Area (Ha)</th>
                <th>Remarks</th>
                <th>Tahasil</th>
                <th>R.I. Circle</th>
                <th>Thana No.</th>
                <th>Date of Award</th>
                <th>RT Name</th>
                <th>PT Name</th>
                <th>Present Address</th>
                <th>Affected Person</th>
                <th>Unique ID</th>
                <th>Plot Count</th>
                <th>Created</th>
                <th>Reference Document</th>
                <th className={stickyActionHeader}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {displayKhatas.length > 0 ? (
                displayKhatas.map((khata, idx) => (
                  <tr key={khata.id} className="whitespace-nowrap">
                    <td>{(page - 1) * limit + idx + 1}</td>

                    <td>{khata.village_name || "No data"}</td>
                    <td>{khata.village_code || "No data"}</td>
                    <td>{khata.khata_no || "No data"}</td>
                    <td>{formatThreeItems(khata.plot_no)}</td>
                    <td>{formatThreeItems(khata.kissam_of_land)}</td>
                    <td>{formatThreeItems(khata.land_category)}</td>
                    <td>{khata.land_area_total_acres || "No data"}</td>
                    <td>{khata.land_area_total_hectares || "No data"}</td>
                    <td>{khata.land_area_acquired_acres || "No data"}</td>
                    <td>{khata.land_area_acquired_hectares || "No data"}</td>

                    <td>{khata.lo13_remarks || "No data"}</td>
                    <td>{khata.tahasil_name || "No data"}</td>
                    <td>{formatThreeItems(khata.ri_circle_name)}</td>
                    <td>{khata.thana_no || "No data"}</td>
                    <td>{khata.date_of_award?.split("T")[0] || "No data"}</td>
                    <td>{khata.name_of_recorded_tenant || "No data"}</td>
                    <td>{khata.name_of_present_tenant || "No data"}</td>
                    <td>{khata.present_address || "No data"}</td>
                    <td>{khata.displaced_affected_person || "No data"}</td>

                    <td>{khata.unique_id || "No data"}</td>
                    <td>{khata.plot_count || "No data"}</td>

                    <td>{moment(khata.created_at).format("DD-MM-YYYY")}</td>

                    <td>
                      <button
                        className={`btn btn-xs text-white ${
                          userRole === "Viewer"
                            ? "!bg-gray-300 !text-gray-400"
                            : "bg-blue-500"
                        }`}
                        onClick={() => onEdit(khata)}
                        disabled={userRole === "Viewer"}
                      >
                        <DockIcon size={14} /> Reference
                      </button>
                    </td>

                    <td className={stickyActionCell}>
                      <div className="flex space-x-2 justify-end">
                        <button
                          className="btn btn-xs btn-accent text-white"
                          onClick={() => {
                            dispatch(setSelectedKhataId(khata.id));
                            setIsPlotModalOpen(true);
                          }}
                        >
                          <LandPlot size={14} /> View Plots
                        </button>

                        <button
                          className={`btn btn-xs btn-warning text-white ${
                            userRole === "Viewer"
                              ? "!bg-gray-300 !text-gray-400"
                              : ""
                          }`}
                          onClick={() => onEdit(khata)}
                          disabled={userRole === "Viewer"}
                        >
                          <Pencil size={14} /> Edit
                        </button>

                        <button
                          className={`btn btn-xs btn-info text-white ${
                            userRole === "Viewer"
                              ? "!bg-gray-300 !text-gray-400"
                              : ""
                          }`}
                          onClick={() => onUpload(khata)}
                          disabled={userRole === "Viewer"}
                        >
                          <Upload size={14} /> Upload
                        </button>

                        <button
                          className="btn btn-xs btn-success text-white"
                          onClick={() => onMap(khata)}
                        >
                          <MapIcon size={14} /> Maps
                        </button>

                        <button
                          className={`btn btn-xs btn-error text-white ${
                            isRestricted ? "!bg-gray-300 !text-gray-400" : ""
                          }`}
                          onClick={() => onDelete(khata)}
                          disabled={isRestricted}
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center py-6 text-gray-500">
                    {selectedProject ? (
                      <>
                        <p className="text-md font-medium text-red-500">
                          No Khata found for the{" "}
                          <span className="text-primary font-semibold">
                            Selected Project.
                          </span>
                          
                        </p>
                        <p className="text-md text-gray-500 mt-1">
                          Try selecting a different project or add a new Khata.
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-lg font-medium text-gray-500">
                          Please{" "}
                          <span className="text-primary font-semibold">
                            select a project
                          </span>{" "}
                          first.
                        </p>
                        <p className="text-lg text-gray-500 mt-1">
                          A project is required to view Khata list.
                        </p>
                      </>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <Pagination
          page={page}
          totalPages={totalPages}
          setPage={setPage}
          limit={limit}
          setLimit={setLimit}
        />
      </div>

      {isPlotModalOpen && (
        <PlotListModal onClose={() => setIsPlotModalOpen(false)} />
      )}
    </>
  );
};

export default KhataTable;
