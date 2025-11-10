import React, { useState } from "react";
import { Pencil, Trash2, Upload, Map as MapIcon, LandPlot } from "lucide-react";
import { useSelector } from "react-redux";
import moment from "moment";
import PlotListModal from "../../pages/Khata/PlotListModal";

const KhataTable = ({ khatas, onEdit, onDelete, onUpload, onMap }) => {
  const user = useSelector((state) => state.auth.user);
  const userRole = user?.role_name || "";
  const selectedProject = useSelector((state) => state.selectedProject.project);
  const [isPlotModalOpen, setIsPlotModalOpen] = useState(false);

  //  Filter khatas by selected project (if selected)
  const displayKhatas = selectedProject
    ? khatas.filter((k) => k.project_id === selectedProject.id)
    : khatas;

  // Helper to convert type ID → name
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

  // Check if user has restricted role
  const isRestricted = userRole === "Data Entry User" || userRole === "Viewer";

  return (
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
              <th>Created</th>
              <th className="text-right pr-6">Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayKhatas.length > 0 ? (
              displayKhatas.map((khata, idx) => (
                <tr
                  key={khata.id || idx}
                  className="hover:bg-gray-50 transition-colors whitespace-nowrap"
                >
                  <td>{idx + 1}</td>
                  <td>{khata.project_name}</td>
                  <td>{khata.village_name}</td>
                  <td>{khata.khata_no}</td>
                  <td>{getTypeName(khata.type)}</td>
                  <td>{khata.unique_id}</td>
                  <td className="text-gray-500">
                    {moment(khata.created_at).format("DD-MM-YYYY")}
                  </td>
                  <td className="text-right">
                    <div className="flex space-x-2 justify-end">
                      <button
                        className={`btn btn-xs btn-accent text-white ${
                          isRestricted
                            ? "!bg-gray-300 !text-gray-400 !border !border-gray-300 !cursor-not-allowed"
                            : ""
                        }`}
                        onClick={() => setIsPlotModalOpen(true)}
                        disabled={isRestricted}
                      >
                       <LandPlot size={14} />  View Plots
                      </button>
                      {isPlotModalOpen && (
                        <PlotListModal
                          plots={plots}
                          onClose={() => setIsPlotModalOpen(false)}
                        />
                      )}
                      <button
                        className={`btn btn-xs btn-warning text-white ${
                          isRestricted
                            ? "!bg-gray-300 !text-gray-400 !border !border-gray-300 !cursor-not-allowed"
                            : ""
                        }`}
                        onClick={() => onEdit(khata)}
                        disabled={isRestricted}
                      >
                        <Pencil size={14} /> Edit
                      </button>

                      <button
                        className={`btn btn-xs btn-error text-white ${
                          isRestricted
                            ? "!bg-gray-300 !text-gray-400 !border !border-gray-300 !cursor-not-allowed"
                            : ""
                        }`}
                        onClick={() => onDelete(khata)}
                        disabled={isRestricted}
                      >
                        <Trash2 size={14} /> Delete
                      </button>

                      <button
                        className={`btn btn-xs btn-info text-white ${
                          isRestricted
                            ? "!bg-gray-300 !text-gray-400 !border !border-gray-300 !cursor-not-allowed"
                            : ""
                        }`}
                        onClick={() => onUpload(khata)}
                        disabled={isRestricted}
                      >
                        <Upload size={14} /> Upload
                      </button>

                      <button
                        className="btn btn-xs btn-success text-white"
                        onClick={() => onMap(khata)}
                      >
                        <MapIcon size={14} /> Maps
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-6 text-gray-500">
                  No khatas found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default KhataTable;
