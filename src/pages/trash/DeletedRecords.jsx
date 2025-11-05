import React, { useState } from "react";
import { Trash2, RotateCcw, Search } from "lucide-react";

const DeletedRecords = () => {
  // 🧩 Mock deleted records data
  const [records, setRecords] = useState([
    {
      id: 1,
      khata_no: "KH-101",
      owner_name: "Ramesh Patel",
      village_name: "Rampur",
      deleted_by: "Admin",
      deleted_at: "2025-10-22",
    },
    {
      id: 2,
      khata_no: "KH-102",
      owner_name: "Suresh Mehta",
      village_name: "Bhavnagar",
      deleted_by: "Manager",
      deleted_at: "2025-10-25",
    },
    {
      id: 3,
      khata_no: "KH-103",
      owner_name: "Meena Shah",
      village_name: "Surajpur",
      deleted_by: "Admin",
      deleted_at: "2025-10-29",
    },
  ]);

  const [search, setSearch] = useState("");

  // ✅ Filter records by search keyword
  const filteredRecords = records.filter(
    (r) =>
      r.khata_no.toLowerCase().includes(search.toLowerCase()) ||
      r.owner_name.toLowerCase().includes(search.toLowerCase()) ||
      r.village_name.toLowerCase().includes(search.toLowerCase())
  );

  // ✅ Restore record handler
  const handleRestore = (id) => {
    const updated = records.filter((r) => r.id !== id);
    setRecords(updated);
    alert(`Record ${id} restored successfully!`);
  };

  // ✅ Permanently delete handler
  const handlePermanentDelete = (id) => {
    if (window.confirm("Are you sure you want to permanently delete this record?")) {
      const updated = records.filter((r) => r.id !== id);
      setRecords(updated);
      alert(`Record ${id} permanently deleted.`);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">🗑️ Deleted Records</h2>

        {/* Search Box */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search records..."
            className="input input-bordered pl-9 w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="table w-full">
          <thead className="bg-gray-100">
            <tr className="text-gray-700">
              <th>#</th>
              <th>Khata No</th>
              <th>Owner Name</th>
              <th>Village</th>
              <th>Deleted By</th>
              <th>Deleted Date</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredRecords.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-4 text-gray-500">
                  No deleted records found.
                </td>
              </tr>
            ) : (
              filteredRecords.map((record, index) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td>{index + 1}</td>
                  <td className="font-medium">{record.khata_no}</td>
                  <td>{record.owner_name}</td>
                  <td>{record.village_name}</td>
                  <td>{record.deleted_by}</td>
                  <td>{record.deleted_at}</td>
                  <td className="flex justify-center gap-3">
                    <button
                      className="btn btn-sm btn-outline btn-success flex items-center gap-1"
                      onClick={() => handleRestore(record.id)}
                    >
                      <RotateCcw size={16} />
                      Restore
                    </button>
                    <button
                      className="btn btn-sm btn-outline btn-error flex items-center gap-1"
                      onClick={() => handlePermanentDelete(record.id)}
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DeletedRecords;
