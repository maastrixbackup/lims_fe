import React from "react";
import { Pencil, Trash2 } from "lucide-react";
import moment from "moment";
import { getTypeName } from "../../utils/constants";

const VillageTable = ({ villages, projects, isRestricted, onEdit, onDelete }) => (
  <div className="card bg-white shadow-lg overflow-hidden">
    <table className="table w-full">
      <thead className="bg-gray-100 text-gray-700">
        <tr>
          <th>#</th>
          <th>Project</th>
          <th>Village</th>
          <th>District</th>
          <th>Tahasil</th>
          <th>Type</th>
          <th>Village Code</th>
          <th>Date</th>
          <th className="text-right pr-6">Actions</th>
        </tr>
      </thead>
      <tbody>
        {villages.length ? (
          villages.map((v, i) => (
            <tr key={v.id} className="hover:bg-gray-50 whitespace-nowrap">
              <td>{i + 1}</td>
              <td>{projects.find((p) => p.id === v.project_id)?.project_name || "N/A"}</td>
              <td>{v.village_name}</td>
              <td>{v.district}</td>
              <td>{v.tahasil}</td>
              <td>{getTypeName(v.type)}</td>
              <td>{v.village_code}</td>
              <td>{moment(v.created_at).format("DD-MM-YYYY")}</td>
              <td className="text-right space-x-2">
                <button
                  className={`btn btn-xs btn-warning text-white ${
                    isRestricted
                      ? "!bg-gray-300 !text-gray-400 !border !border-gray-300 !cursor-not-allowed"
                      : ""
                  }`}
                  onClick={() => onEdit(v)}
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
                  onClick={() => onDelete(v)}
                  disabled={isRestricted}
                >
                  <Trash2 size={14} /> Delete
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="9" className="text-center py-6 text-gray-500">
              No villages found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);

export default VillageTable;
