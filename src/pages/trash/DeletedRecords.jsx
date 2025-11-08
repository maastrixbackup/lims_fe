import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../../utils/config";
import { useSelector } from "react-redux";
import {showToast} from "../../utils/constants"

const DeletedRecords = () => {
  const { userToken: token } = useSelector((s) => s.auth);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({ open: false, action: null, id: null, message: "" });
  // Fetch Deleted Records
  const fetchDeletedPlots = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/plots/getDeletedPlots`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setRecords(data.data);
    } catch (err) {
      console.error("Error fetching deleted plots:", err);
      showToast("Failed to fetch deleted plots", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeletedPlots();
  }, []);

  // Restore Record
  const handleRestore = async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/plots/restorePlot/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        showToast("Record restored successfully!", "success");
        setRecords((prev) => prev.filter((r) => r.id !== id));
      } else {
        showToast("Failed to restore record.", "error");
      }
    } catch (err) {
      console.error("Error restoring plot:", err);
      showToast("Error restoring record", "error");
    }
  };

  // Permanent Delete
  const handlePermanentDelete = async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/plots/permanentDelete/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        showToast("Record permanently deleted!", "success");
        setRecords((prev) => prev.filter((r) => r.id !== id));
      } else {
        showToast("Failed to delete record.", "error");
      }
    } catch (err) {
      console.error("Error deleting plot:", err);
      showToast("Error deleting record", "error");
    }
  };

  // 🔹 Open confirmation modal
  const confirmAction = (id, actionType) => {
    setModal({
      open: true,
      id,
      action: actionType,
      message:
        actionType === "restore"
          ? "Are you sure you want to restore this record?"
          : "This will permanently delete the record. Continue?",
    });
  };

  const handleModalConfirm = async () => {
    if (modal.action === "restore") await handleRestore(modal.id);
    else if (modal.action === "delete") await handlePermanentDelete(modal.id);
    setModal({ open: false, action: null, id: null, message: "" });
  };

  if (loading)
    return <p className="text-center mt-5">Loading deleted records...</p>;

  if (!records.length)
  return (
    <div className="flex flex-col items-center justify-center mt-10 text-center">
      <img
        src="https://cdn-icons-png.flaticon.com/512/7486/7486751.png"
        alt="No data"
        className="w-40 h-40 opacity-70 mb-4"
      />
      <p className="text-gray-600 text-lg font-medium">
        No deleted records found...
      </p>
    </div>
  );


  const columns = Object.keys(records[0]);

  return (
    <div className="p-4 relative">
      <h2 className="text-xl font-bold mb-4">🗑️ Deleted Plot Records</h2>

      <div className="overflow-auto border rounded-lg">
        <table className="table table-zebra w-full min-w-max">
          <thead className="bg-gray-200 sticky top-0">
            <tr>
              {columns.map((col) => (
                <th key={col} className="text-xs whitespace-nowrap">
                  {col.replaceAll("_", " ").toUpperCase()}
                </th>
              ))}
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {records.map((r) => (
              <tr key={r.id}>
                {columns.map((col) => (
                  <td key={col}>
                    {r[col] === null || r[col] === ""
                      ? "-"
                      : typeof r[col] === "string" && r[col].includes("T")
                      ? new Date(r[col]).toLocaleDateString()
                      : r[col].toString()}
                  </td>
                ))}
                <td className="flex gap-2">
                  <button
                    className="btn btn-xs btn-success"
                    onClick={() => confirmAction(r.id, "restore")}
                  >
                    Restore
                  </button>
                  <button
                    className="btn btn-xs btn-error"
                    onClick={() => confirmAction(r.id, "delete")}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal.open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-[10000]">
          <div className="bg-white p-6 rounded-xl shadow-lg w-80">
            <p className="text-gray-800 mb-4">{modal.message}</p>
            <div className="flex justify-end gap-3">
              <button
                className="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300"
                onClick={() =>
                  setModal({ open: false, action: null, id: null, message: "" })
                }
              >
                Cancel
              </button>
              <button
                className={`px-3 py-1 rounded-md text-white ${
                  modal.action === "restore"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
                onClick={handleModalConfirm}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeletedRecords;
