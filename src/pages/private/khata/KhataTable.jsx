import React, { useState } from "react";
import { Pencil, Trash2, Upload, Map as MapIcon, LandPlot } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import PlotListModal from "./PlotListModal";
import { setSelectedKhataId } from "../../../utils/khataSlice";

const KhataTable = ({ khatas, onEdit, onDelete, onUpload, onMap }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const userRole = user?.role_name || "";
  const selectedProject = useSelector((state) => state.selectedProject.project);

  const [isPlotModalOpen, setIsPlotModalOpen] = useState(false);

  // Filter khatas by project
  const displayKhatas = selectedProject
    ? khatas.filter((k) => k.project_id === selectedProject.id)
    : khatas;

  const getTypeName = (type) => {
    switch (Number(type)) {
      case 1:
        return "Pvt Land";
      case 2:
        return "Govt Land";
      case 3:
        return "Forest Land";
      default:
        return "-";
    }
  };

  const isRestricted = userRole === "Data Entry User" || userRole === "Viewer";

  return (
    <>
      <div className="card bg-white shadow-lg overflow-hidden">
        <div className="max-h-[400px] overflow-x-auto">
          <table className="table w-full">
            <thead className="bg-gray-200 text-gray-700 sticky top-0 z-10 whitespace-nowrap">
              <tr>
                <th>Sl/No</th>
                <th>Project</th>
                <th>Village</th>
                <th>Khata No.</th>
                <th>Khata Type</th>
                <th>Unique ID</th>
                 <th>Plot Count</th>
                <th>Created</th>
                <th className="text-right pr-6 no-print">Actions</th>
              </tr>
            </thead>

            <tbody>
              {displayKhatas.length > 0 ? (
                displayKhatas.map((khata, idx) => (
                  <tr key={khata.id || idx} className="hover:bg-gray-50 transition-colors whitespace-nowrap">
                    <td>{idx + 1}</td>
                    <td>{khata.project_name}</td>
                    <td>{khata.village_name}</td>
                    <td>{khata.khata_no}</td>
                    <td>{getTypeName(khata.type)}</td>
                    <td>{khata.unique_id}</td>
                    <td>{khata.plot_count || "No Plots"}</td>
                    <td className="text-gray-500">
                      {moment(khata.created_at).format("DD-MM-YYYY")}
                    </td>
                    <td className="text-right no-print">
                      <div className="flex space-x-2 justify-end">

                        {/* View Plots */}
                        <button
                          className={`btn btn-xs btn-accent text-white ${
                            isRestricted
                              ? "!bg-gray-300 !text-gray-400 !cursor-not-allowed"
                              : ""
                          }`}
                          onClick={() => {
                            dispatch(setSelectedKhataId(khata.id));
                            setIsPlotModalOpen(true);
                          }}
                          disabled={isRestricted}
                        >
                          <LandPlot size={14} /> View Plots
                        </button>

                        {/* Edit */}
                        <button
                          className={`btn btn-xs btn-warning text-white ${
                            userRole === "Viewer" ? "!bg-gray-300 !text-gray-400" : ""
                          }`}
                          onClick={() => onEdit(khata)}
                          disabled={userRole === "Viewer"}
                        >
                          <Pencil size={14} /> Edit
                        </button>

                        {/* Upload */}
                        <button
                          className={`btn btn-xs btn-info text-white ${
                            userRole === "Viewer" ? "!bg-gray-300 !text-gray-400" : ""
                          }`}
                          onClick={() => onUpload(khata)}
                          disabled={userRole === "Viewer"}
                        >
                          <Upload size={14} /> Upload
                        </button>

                        {/* Map */}
                        <button
                          className="btn btn-xs btn-success text-white"
                          onClick={() => onMap(khata)}
                        >
                          <MapIcon size={14} /> Maps
                        </button>

                        {/* Delete */}
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
                  <td colSpan="8" className="text-center py-6 text-gray-500">
                    <p className="text-md font-medium text-gray-500">
                      No Khata found for the{" "}
                      <span className="text-primary font-semibold">
                        selected project
                      </span>
                      .
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Try selecting a different project or add a new Khata.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isPlotModalOpen && (
        <PlotListModal onClose={() => setIsPlotModalOpen(false)} />
      )}
    </>
  );
};

export default KhataTable;
