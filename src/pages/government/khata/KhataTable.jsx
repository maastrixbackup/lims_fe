import React from "react";
import { GovtKhataColumn, stickyActionCell, stickyActionHeader } from "../../../utils/constants";
import FilterHeader from "../plot/FilterHeader";

const KhataTable = ({ khatas, onEdit, onDelete, userRole }) => {
  const canEdit = userRole !== "Viewer";
  const canDelete = !(userRole === "Data Entry User" || userRole === "Viewer");

  return (
    <div className="card bg-white shadow-lg">
      <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
        <table className="table w-full whitespace-nowrap">
          <thead className="bg-gray-200 sticky top-0 z-10">
            <tr>
              <th>Sl/No</th>
              {GovtKhataColumn.map((col) => (
                <th key={col.key}>{col.label}</th>
              ))}
              <th className={stickyActionHeader}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {khatas.length ? (
              khatas.map((k, idx) => (
                <tr key={k.id}>
                  <td>{idx + 1}</td>
                  <td>{k.plot_no}</td>
                  <td>{k.lease_case_no}</td>
                  <td>{k.present_status}</td>
                  <td>{k.case_details}</td>
                  <td>{k.village}</td>
                  <td>{k.plot_count}</td>
<td className={stickyActionCell}>
                      <select
                        className="select select-sm bg-gray-100 border border-gray-300 w-[42px] "
                        defaultValue=""
                        onChange={(e) => {
                          const action = e.target.value;
                          e.target.value = "";

                          if (action === "edit" && canEdit) {
                            onEdit(v);
                          }

                          if (action === "delete" && canDelete) {
                            onDelete(v);
                          }
                        }}
                        // disabled={!canEdit && !canDelete}
                      >
                        <option value="" disabled>
                          Actions
                        </option>

                        <option
                          value="edit"
                          disabled={userRole === "Viewer"}
                          className={`text-md text-gray-700 font-bold ${
                            userRole === "Viewer" ? "!text-gray-400" : ""
                          }`}
                        >
                          ✏️ Edit
                        </option>

                        <option
                          value="delete"
                          disabled={!canDelete}
                          className={`text-md text-gray-700 font-bold ${
                            !canDelete ? "!text-gray-400" : ""
                          }`}
                        >
                          🗑 Delete
                        </option>
                      </select>
                    </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center py-6 text-gray-500">
                  No khata found
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
