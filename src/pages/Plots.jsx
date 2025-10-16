import React, { useState } from "react";
import { plotData } from "../utils/constants";
import { useNavigate } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";
import PlotTable from "../shared/PlotsTable";
import { useSelector } from "react-redux";

const Plots = () => {
  const [plots, setPlots] = useState(plotData);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const token = useSelector((state) => state.auth.userToken);
  const user = useSelector((state) => state.auth.user);
    const userRole = user?.role_name || "";

  const navigate = useNavigate();

  // Delete confirm handler
  const confirmDelete = () => {
    setPlots(plots.filter((p) => p.id !== deleteConfirm.id));
    setDeleteConfirm(null);
  };

  return (
    <main className="flex-1 p-6 overflow-y-auto space-y-6">
      {/* Top bar */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Plots List</h2>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/plot-form")} // 👈 navigate instead of openModal
           disabled={userRole === "Admin" || userRole === "Client"}
        >
          + Add Plot
        </button>
      </div>

      {/* Table */}
      {/* <div className="card bg-white shadow-lg rounded-2xl">
        <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
          <table className="table w-full whitespace-nowrap">
            <thead className="bg-gray-100 text-gray-700 sticky top-0 z-10">
              <tr>
                <th>#</th>
                <th>Project</th>
                <th>Village</th>
                <th>Khata No</th>
                <th>Code</th>
                <th>Tenant</th>
                <th>RoR Area</th>
                <th className="text-right pr-6">Actions</th>
              </tr>
            </thead>
            <tbody>
              {plots.length > 0 ? (
                plots.map((plot, idx) => (
                  <tr key={plot.id} className="hover:bg-gray-50 transition-colors">
                    <td>{idx + 1}</td>
                    <td>{plot.project}</td>
                    <td>{plot.village}</td>
                    <td>{plot.khataNo}</td>
                    <td>{plot.code}</td>
                    <td>{plot.tenant}</td>
                    <td>{plot.rorArea}</td>
                    <td className="text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          className="btn btn-xs btn-warning text-white"
                          onClick={() =>
                            navigate("/plot-form", { state: { plot } }) // 👈 navigate with state for editing
                          }
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          className="btn btn-xs btn-error text-white"
                          onClick={() => setDeleteConfirm(plot)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center py-6 text-gray-500">
                    No plots found. Click{" "}
                    <span className="font-semibold">+ Add Plot</span> to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div> */}
      <PlotTable plots={plots} setDeleteConfirm={setDeleteConfirm} />

      {/* Delete Modal */}
      {deleteConfirm && (
        <dialog open className="modal modal-open">
          <div className="modal-box max-w-md">
            <h3 className="font-bold text-lg mb-4">Confirm Delete</h3>
            <p>
              Are you sure you want to delete{" "}
              <span className="font-semibold">{deleteConfirm.code}</span>?
            </p>
            <div className="modal-action">
              <button className="btn btn-error" onClick={confirmDelete}>
                Yes, Delete
              </button>
              <button className="btn" onClick={() => setDeleteConfirm(null)}>
                Cancel
              </button>
            </div>
          </div>
        </dialog>
      )}
    </main>
  );
};

export default Plots;
