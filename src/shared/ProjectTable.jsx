import React from "react";
import { Pencil, Trash2 } from "lucide-react";
import moment from "moment";

const ProjectTable = ({ projects, canModify, onEdit, onDelete, loading }) => {
  if (loading) return <p className="text-center py-6">Loading...</p>;

  return (
    <div className="card bg-white shadow-lg rounded-2xl overflow-hidden">
      <div className="max-h-[400px] overflow-y-auto overflow-x-auto">
        <table className="table w-full">
          <thead className="bg-gray-100 text-gray-700 sticky top-0">
            <tr>
              <th>Sl/No</th>
              <th>Project Name</th>
              <th>Status</th>
              <th>Created</th>
              <th className="text-right pr-6">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.length > 0 ? (
              projects.map((p, idx) => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors whitespace-nowrap">
                  <td>{idx + 1}</td>
                  <td>{p.name}</td>
                  <td>
                    <span
                      className={`badge w-24 justify-center ${
                        p.status === 1
                          ? "badge-success"
                          : p.status === 0
                          ? "badge-warning"
                          : "badge-error"
                      }`}
                    >
                      {p.status === 1 ? "Active" : p.status === 0 ? "Pending" : "Closed" }
                    </span>
                  </td>
                  <td>{moment(p.created).format("DD-MM-YYYY")}</td>
                  <td className="text-right space-x-2">
                    <button
                      // className="btn btn-xs btn-warning text-white"
                       className={`btn btn-xs btn-warning text-white ${
                          !canModify
                            ? "!bg-gray-300 !text-gray-400 !border !border-gray-300 !cursor-not-allowed"
                            : ""
                        }`}
                      onClick={() => onEdit(p)}
                      disabled={!canModify}
                    >
                      <Pencil size={14} /> Edit
                    </button>
                    <button
                      // className="btn btn-xs btn-error text-white"
                       className={`btn btn-xs btn-error text-white ${
                          !canModify
                            ? "!bg-gray-300 !text-gray-400 !border !border-gray-300 !cursor-not-allowed"
                            : ""
                        }`}
                      onClick={() => onDelete(p)}
                      disabled={!canModify}
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500">
                  No projects found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProjectTable;
