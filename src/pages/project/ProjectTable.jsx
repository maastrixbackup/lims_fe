import React from "react";
import { Pencil, Trash2 } from "lucide-react";
import moment from "moment";
import { useSelector } from "react-redux";
import { stickyActionCell, stickyActionHeader } from "../../utils/constants";

const projectTypeMap = {
  1: { label: "Private Land", badge: "badge-warning" },
  2: { label: "Government Land", badge: "badge-info" },
  3: { label: "Forest Land", badge: "badge-success" },
};

const ProjectTable = ({ projects = [], onEdit, onDelete, loading }) => {
  const user = useSelector((state) => state.auth.user);
  const role = user?.role_name;

  const canEdit = !(role === "Data Entry User" || role === "Viewer");

  if (loading) return <p className="text-center py-6">Loading...</p>;

  return (
    <div
      className="overflow-x-auto max-h-[400px] overflow-y-auto card bg-white shadow-lg"
      style={{ scrollbarWidth: "thin" }}
    >
      <table className="table w-full">
        <thead className="bg-gray-200 text-xs uppercase ">
          <tr>
            <th>SL/NO</th>
            <th>Project Name</th>
            <th>Location</th>
            <th>Status</th>
            <th>Client Code</th>
            <th>Project Type</th>
            <th>Created</th>
            <th className={stickyActionHeader}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {projects.map((p, i) => (
            <tr key={p.id} className="whitespace-nowrap">
              <td>{i + 1}</td>
              <td>{p.project_name}</td>
              <td>{p.project_location}</td>

              <td>
                <span
                  className={`badge ${p.status === 1 ? "badge-success" : "badge-warning"} text-white`}
                >
                  {p.status === 1 ? "Active" : "Pending"}
                </span>
              </td>

              <td>{p.client_code}</td>

              <td>
                {/* {projectTypeMap[p.type] ? (
                  <span className={`badge ${projectTypeMap[p.type].badge} text-white`}>
                  
                  </span>
                ) : (
                  <span className="badge badge-ghost">Unknown</span>
                )} */}
                {projectTypeMap[p.type].label}
              </td>

              <td>{moment(p.created_at).format("DD-MM-YYYY")}</td>

              <td className={stickyActionCell}>
               <div className="gap-2 flex">
                 <button
                  className="btn btn-xs btn-warning text-white"
                  onClick={() => canEdit && onEdit(p)}
                  disabled={!canEdit}
                >
                  <Pencil size={14} /> Edit
                </button>

                <button
                  className="btn btn-xs btn-error text-white"
                  onClick={() => onDelete(p)}
                  disabled={!canEdit}
                >
                  <Trash2 size={14} /> Delete
                </button>
               </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectTable;
