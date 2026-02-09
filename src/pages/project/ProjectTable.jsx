import React from "react";
import { Pencil, Trash2 } from "lucide-react";
import moment from "moment";
import { useSelector } from "react-redux";

const ProjectTable = ({ projects = [], onEdit, onDelete, loading }) => {
  const user = useSelector((state) => state.auth.user);
  const userRole = user?.role_name || "";

  const canEdit = !(userRole === "Data Entry User" || userRole === "Viewer");
  const canDelete = canEdit;

  if (loading) {
    return <p className="text-center py-6">Loading...</p>;
  }

  return (
    <div className="card bg-white shadow-lg overflow-hidden">
      <div className="max-h-[400px] overflow-x-auto" style={{scrollbarWidth:"thin"}}>
        <table className="table w-full">
          <thead className="bg-gray-200 text-gray-700 sticky top-0 z-10 whitespace-nowrap">
            <tr>
              <th>Sl/No</th>
              <th>Project Name</th>
              <th>Project Location</th>
              <th>Status</th>
              <th>Client Code</th>
              <th>Created</th>
              <th className="text-right pr-6">Actions</th>
            </tr>
          </thead>

          <tbody>
            {projects.length > 0 ? (
              projects.map((p, idx) => (
                <tr
                  key={p.id}
                  className="hover:bg-gray-50 transition-colors whitespace-nowrap"
                >
                  <td>{idx + 1}</td>
                  <td>{p.name}</td>
                  <td>{p.project_location || "No Data"}</td>

                  <td>
                    <span
                      className={`badge w-24 justify-center ${
                        p.status === 1
                          ? "badge-success text-white"
                          : p.status === 0
                          ? "badge-warning text-white"
                          : "badge-error text-white"
                      }`}
                    >
                      {p.status === 1
                        ? "Active"
                        : p.status === 0
                        ? "Pending"
                        : "Closed"}
                    </span>
                  </td>

                  <td>{p.client_code}</td>
                  <td>{moment(p.created).format("DD-MM-YYYY")}</td>

                  <td className="text-right space-x-2">
                    <button
                      className={`btn btn-xs btn-warning text-white ${
                        !canEdit &&
                        "!bg-gray-300 !text-gray-400 !border-gray-300 !cursor-not-allowed"
                      }`}
                      onClick={() => canEdit && onEdit(p)}
                      disabled={!canEdit}
                    >
                      <Pencil size={14} /> Edit
                    </button>

                    <button
                      className={`btn btn-xs btn-error text-white ${
                        !canDelete &&
                        "!bg-gray-300 !text-gray-400 !border-gray-300 !cursor-not-allowed"
                      }`}
                      onClick={() => canDelete && onDelete(p)}
                      disabled={!canDelete}
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-6 text-gray-500">
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
