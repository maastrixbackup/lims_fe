// src/components/Plots/PlotTable.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const PlotTable = ({ plots, setDeleteConfirm }) => {
  const navigate = useNavigate();

  if (!plots || plots.length === 0) {
    return (
      <div className="card bg-white shadow-lg rounded-2xl p-6 text-center text-gray-500">
        No plots found. Click <span className="font-semibold">+ Add Plot</span> to create one.
      </div>
    );
  }

  // Sort plots by ID in ascending order
  const sortedPlots = [...plots].sort((a, b) => {
    // handle if id is number or string
    const idA = Number(a.id) || a.id;
    const idB = Number(b.id) || b.id;
    if (idA < idB) return -1;
    if (idA > idB) return 1;
    return 0;
  });

  // Dynamically extract all keys from the first plot
  const columns = Object.keys(sortedPlots[0]);

  return (
    <div className="card bg-white shadow-lg rounded-2xl">
      {/* Scrollable wrapper */}
      <div className="overflow-x-auto overflow-y-auto max-h-[600px]">
        <table className="table w-full text-xs whitespace-nowrap">
          <thead className="bg-gray-100 text-gray-700 sticky top-0 z-10">
            <tr>
              <th>#</th>
              {columns.map((col) => (
                <th key={col}>{col.replace(/_/g, " ").toUpperCase()}</th>
              ))}
              <th className="text-right pr-6">Actions</th>
            </tr>
          </thead>

          <tbody>
            {sortedPlots.map((plot, idx) => (
              <tr key={plot.id || idx} className="hover:bg-gray-50 transition-colors">
                <td>{idx + 1}</td>
                {columns.map((col) => (
                  <td key={col}>
                    {plot[col] !== null && plot[col] !== "" ? plot[col] : "-"}
                  </td>
                ))}
                <td className="text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      className="btn btn-xs btn-warning text-white"
                      onClick={() => navigate("/plot-form", { state: { plot } })}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-xs btn-error text-white"
                      onClick={() => setDeleteConfirm(plot)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PlotTable;
