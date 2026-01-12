import React, { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { useSelector } from "react-redux";
import { GovtKhataColumn, stickyActionCell, stickyActionHeader } from "../../../utils/constants";
import FilterHeader from "../plot/FilterHeader";
import KhataForm from "./KhataForm";

const GovernmentKhata = () => {
  // Khata data
  const [khatas, setKhatas] = useState([
    {
      id: 1,
      plot_no: "P001",
      lease_case_no: "LC001",
      present_status: "Vacant",
      case_details: "Survey pending",
      village: "Village 1",
      plot_count: 2,
      created: "2025-01-01",
    },
    {
      id: 2,
      plot_no: "P002",
      lease_case_no: "LC002",
      present_status: "Occupied",
      case_details: "Approval pending",
      village: "Village 1",
      plot_count: 3,
      created: "2025-01-02",
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingKhata, setEditingKhata] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const userRole = useSelector((state) => state.auth.user?.role_name);
  const canEdit = userRole !== "Viewer";
  const canDelete = !(userRole === "Data Entry User" || userRole === "Viewer");
  const [filters, setFilters] = useState({});
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "asc",
  });
  const [activeFilterKey, setActiveFilterKey] = useState(null);

const openModal = (khata = null) => {
  if (khata) {
    setEditingKhata(khata);
  } else {
    setEditingKhata(null);
  }
  setIsModalOpen(true);
};


  const getUniqueValues = (key) => {
    return [...new Set(khatas.map((k) => k[key]).filter(Boolean))];
  };

  const filteredKhatas = khatas
    .filter((k) =>
      Object.entries(filters).every(([key, value]) =>
        value
          ? String(k[key]).toLowerCase().includes(value.toLowerCase())
          : true
      )
    )
    .sort((a, b) => {
      if (!sortConfig.key) return 0;

      const aVal = a[sortConfig.key] ?? "";
      const bVal = b[sortConfig.key] ?? "";

      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

  const confirmDelete = () => {
    setKhatas(khatas.filter((k) => k.id !== deleteConfirm.id));
    setDeleteConfirm(null);
  };

  return (
    <main className="p-2 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Government Land Khata</h2>
        <button className="btn btn-primary" onClick={() => openModal()}>
          + Add Khata
        </button>
      </div>

      <div className="card bg-white shadow-lg">
        <div
          className="overflow-x-auto max-h-[400px] overflow-y-auto"
          style={{ scrollbarWidth: "thin" }}
        >
          <table className="table w-full whitespace-nowrap">
            <thead className="bg-gray-200 text-gray-700 sticky top-0 z-10">
              <tr>
                <th>Sl/No</th>

                {GovtKhataColumn.map((col) => (
                  <th key={col.key}>
                    <FilterHeader
                      column={col}
                      filters={filters}
                      setFilters={setFilters}
                      sortConfig={sortConfig}
                      setSortConfig={setSortConfig}
                      getUniqueValues={getUniqueValues}
                      activeFilterKey={activeFilterKey}
                      setActiveFilterKey={setActiveFilterKey}
                    />
                  </th>
                ))}

                <th className={stickyActionHeader}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {khatas.length > 0 ? (
                filteredKhatas.map((khata, idx) => (
                  <tr key={khata.id}>
                    <td>{idx + 1}</td>
                    <td>{khata.khata_no || "no data"}</td>
                    <td>{khata.kissam || "no data"}</td>
                    <td>{khata.village || "no data"}</td>
                    <td>{khata.plot_no || "no data"}</td>
                    <td>{khata.lease_case_no || "no data"}</td>
                    <td>{khata.present_status || "no data"}</td>
                    <td>{khata.case_details || "no data"}</td>
                    <td>{khata.plot_count || "no data"}</td>
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
                    No khata found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

 {isModalOpen && (


      <KhataForm
        onCancel={() => setIsModalOpen(false)}
        isEdit={!!editingKhata}
      />
 
)}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <dialog open className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Confirm Delete</h3>
            <p className="my-3">
              Are you sure you want to delete Khata{" "}
              <b>{deleteConfirm.plotNo}</b>?
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

export default GovernmentKhata;
