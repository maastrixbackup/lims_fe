// AuditTrail.jsx
import React, { useState, useMemo } from "react";
import { History, Search, Filter } from "lucide-react";

const dummyAudits = [
  {
    user: "Admin",
    khata: "KH-1023",
    before: "Owner: Ramesh | Area: 2.5 Acres",
    after: "Owner: Suresh | Area: 2.5 Acres",
    time: "2025-11-17 10:45 AM",
  },
  {
    user: "Surveyor1",
    khata: "KH-2045",
    before: "Area: 1.2 Acres",
    after: "Area: 1.5 Acres",
    time: "2025-11-17 09:32 AM",
  },
  {
    user: "Admin",
    khata: "KH-3401",
    before: "Village: Kalinga",
    after: "Village: Badamba",
    time: "2025-11-16 04:15 PM",
  },
];

const AuditTrail = ({ audits = dummyAudits }) => {
  // Filters
  const [search, setSearch] = useState("");
  const [userFilter, setUserFilter] = useState("");
  const [khataFilter, setKhataFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  // Unique users
  const uniqueUsers = [...new Set(audits.map((a) => a.user))];

  // Filtering logic
  const filteredAudits = useMemo(() => {
    return audits.filter((a) => {
      const matchesSearch =
        search === "" ||
        a.before.toLowerCase().includes(search.toLowerCase()) ||
        a.after.toLowerCase().includes(search.toLowerCase()) ||
        a.khata.toLowerCase().includes(search.toLowerCase());

      const matchesUser = userFilter === "" || a.user === userFilter;
      const matchesKhata = khataFilter === "" || a.khata === khataFilter;

      // Date-based filtering (basic demo)
      const date = new Date(a.time);
      const now = new Date();

      let matchesDate = true;
      if (dateFilter === "today") {
        matchesDate = date.toDateString() === now.toDateString();
      } else if (dateFilter === "7") {
        matchesDate = (now - date) / (1000 * 60 * 60 * 24) <= 7;
      } else if (dateFilter === "30") {
        matchesDate = (now - date) / (1000 * 60 * 60 * 24) <= 30;
      }

      return matchesSearch && matchesUser && matchesKhata && matchesDate;
    });
  }, [audits, search, userFilter, khataFilter, dateFilter]);

  return (
    <div className="p-4">
      {/* Title */}
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <History size={20} className="text-blue-600" /> Audit Trail
      </h2>

      {/* ---------------- FILTER PANEL ---------------- */}
      <div className="bg-white shadow rounded-xl p-4 mb-4 flex flex-wrap gap-4">

        {/* Search */}
        <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg w-full md:w-72">
          <Search size={18} className="text-gray-500" />
          <input
            type="text"
            placeholder="Search khata or changes..."
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

        {/* Khata Filter */}
        <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg">
          <Filter size={18} className="text-gray-600" />
          <input
            type="text"
            placeholder="Filter Khata..."
            className="bg-transparent outline-none text-sm w-32"
            value={khataFilter}
            onChange={(e) => setKhataFilter(e.target.value)}
          />
        </div>

        {/* Date Filter */}
        <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg">
          <Filter size={18} className="text-gray-600" />
          <select
            className="bg-transparent outline-none text-sm"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          >
            <option value="">All Dates</option>
            <option value="today">Today</option>
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
          </select>
        </div>
      </div>

      {/* ---------------- TABLE ---------------- */}
      <div className="overflow-hidden rounded-xl shadow bg-white">
        <table className="w-full">
          <thead className="bg-gray-200 text-gray-700 text-sm">
            <tr>
              <th className="p-3 text-left font-semibold">User</th>
              <th className="p-3 text-left font-semibold">Khata</th>
              <th className="p-3 text-left font-semibold">Before</th>
              <th className="p-3 text-left font-semibold">After</th>
              <th className="p-3 text-left font-semibold">Timestamp</th>
            </tr>
          </thead>

          <tbody>
            {filteredAudits.map((a, i) => (
              <tr key={i} className="hover:bg-gray-100 transition">
                <td className="p-3">{a.user}</td>
                <td className="p-3">{a.khata}</td>
                <td className="p-3">{a.before}</td>
                <td className="p-3">{a.after}</td>
                <td className="p-3">{a.time}</td>
              </tr>
            ))}

            {filteredAudits.length === 0 && (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500">
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

export default AuditTrail;


