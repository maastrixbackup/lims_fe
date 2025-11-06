import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../../utils/config";
import { useSelector } from "react-redux";

const DeletedRecords = () => {
  const { userToken: token } = useSelector((s) => s.auth);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch deleted plots
  const fetchDeletedPlots = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/plots/getDeletedPlots`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success) setRecords(data.data);
    } catch (err) {
      console.error("Error fetching deleted plots:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeletedPlots();
  }, []);

  const handleRestore = async (id) => {
    await fetch(`${API_BASE_URL}/plots/restorePlot/${id}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchDeletedPlots();
  };

  const handlePermanentDelete = async (id) => {
    await fetch(`${API_BASE_URL}/plots/permanentDelete/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchDeletedPlots();
  };

  if (!records.length)
    return <p className="text-center mt-5">No deleted records found...</p>;

  // Dynamically generate headers from first record
  const columns = Object.keys(records[0]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">
        🗑️ Deleted Plot Records
      </h2>

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
                    onClick={() => handleRestore(r.id)}
                  >
                    Restore
                  </button>
                  <button
                    className="btn btn-xs btn-error"
                    onClick={() => handlePermanentDelete(r.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DeletedRecords;
