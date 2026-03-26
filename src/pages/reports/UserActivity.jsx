// UserActivityLog.jsx
import React, { useState, useMemo } from "react";
import { User, Search, Filter } from "lucide-react";

const dummyLogs = [
  { user: "Admin", action: "Logged in", file_uploads: "", views: "", deletion: "", login_history: "Login at 10:20 AM" },
  { user: "Admin", action: "Uploaded a file", file_uploads: "report.pdf", views: "", deletion: "", login_history: "" },
  { user: "Admin", action: "Viewed dashboard", file_uploads: "", views: "dashboard", deletion: "", login_history: "" },
  { user: "Admin", action: "Deleted a file", file_uploads: "", views: "", deletion: "archive.zip", login_history: "" },
];

const UserActivity = ({ logs = dummyLogs }) => {
  // Filters
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("");
  const [userFilter, setUserFilter] = useState("");

  // Prepare unique users for dropdown
  const uniqueUsers = [...new Set(logs.map((l) => l.user))];

  // Filtering logic
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesSearch =
        search.trim() === "" ||
        log.action.toLowerCase().includes(search.toLowerCase()) ||
        log.file_uploads?.toLowerCase().includes(search.toLowerCase()) ||
        log.views?.toLowerCase().includes(search.toLowerCase()) ||
        log.deletion?.toLowerCase().includes(search.toLowerCase());

      const matchesAction = actionFilter === "" || log.action === actionFilter;
      const matchesUser = userFilter === "" || log.user === userFilter;

      return matchesSearch && matchesAction && matchesUser;
    });
  }, [logs, search, actionFilter, userFilter]);

  return (
    <div className="p-4">
      {/* Title */}
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <User size={20} className="text-blue-600" /> User Activity Log
      </h2>

      {/* ---------------- FILTER PANEL ---------------- */}
      <div className="bg-white shadow rounded-xl p-4 mb-4 flex flex-wrap gap-4">

        {/* Search Bar */}
        <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg w-full md:w-64">
          <Search size={18} className="text-gray-500" />
          <input
            type="text"
            placeholder="Search activity..."
            className="bg-transparent outline-none text-sm w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* User Filter */}
        <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg">
          <Filter size={18} className="text-gray-600" />
          <select
            className="bg-transparent outline-none text-sm"
            value={userFilter}
            onChange={(e) => setUserFilter(e.target.value)}
          >
            <option value="">All Users</option>
            {uniqueUsers.map((u, i) => (
              <option key={i} value={u}>
                {u}
              </option>
            ))}
          </select>
        </div>

        {/* Action Filter */}
        <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg">
          <Filter size={18} className="text-gray-600" />
          <select
            className="bg-transparent outline-none text-sm"
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
          >
            <option value="">All Actions</option>
            <option value="Logged in">Logged in</option>
            <option value="Uploaded a file">Uploaded a file</option>
            <option value="Viewed dashboard">Viewed dashboard</option>
            <option value="Deleted a file">Deleted a file</option>
          </select>
        </div>
      </div>

      {/* ---------------- TABLE ---------------- */}
      <div className="overflow-hidden rounded-xl shadow bg-white">
        <table className="w-full">
          <thead className="bg-gray-200 text-gray-700 text-sm">
            <tr>
              <th className="p-3 text-left font-semibold">User</th>
              <th className="p-3 text-left font-semibold">Action</th>
              <th className="p-3 text-left font-semibold">File Uploads</th>
              <th className="p-3 text-left font-semibold">Views</th>
              <th className="p-3 text-left font-semibold">Deletion</th>
              <th className="p-3 text-left font-semibold">Login History</th>
            </tr>
          </thead>

          <tbody>
            {filteredLogs.map((l, i) => (
              <tr key={i} className="hover:bg-gray-100 transition">
                <td className="p-3">{l.user}</td>
                <td className="p-3">{l.action}</td>
                <td className="p-3">{l.file_uploads || "-"}</td>
                <td className="p-3">{l.views || "-"}</td>
                <td className="p-3">{l.deletion || "-"}</td>
                <td className="p-3">{l.login_history || "-"}</td>
              </tr>
            ))}

            {filteredLogs.length === 0 && (
              <tr>
                <td colSpan="6" className="p-4 text-center text-gray-500">
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserActivity;


