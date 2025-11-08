import React, { useState } from "react";
import { FileText, Download, Filter, Search } from "lucide-react";

export default function Reports() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("All");

  const reportsData = [
    { id: 1, title: "Project Summary", type: "Project", date: "2025-10-05" },
    { id: 2, title: "User Activity", type: "User", date: "2025-10-04" },
    { id: 3, title: "Village Progress", type: "Village", date: "2025-10-02" },
  ];

  const filteredReports = reportsData.filter(
    (report) =>
      (filter === "All" || report.type === filter) &&
      report.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <FileText className="w-6 h-6 text-primary" /> Reports
        </h1>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input input-bordered w-full pl-10"
            />
          </div>
          <select
            className="select select-bordered w-32"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Project">Project</option>
            <option value="User">User</option>
            <option value="Village">Village</option>
          </select>
        </div>
      </div>
      <div className="card bg-white shadow-lg rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table w-full text-sm sm:text-base">
            <thead className="bg-gray-100 text-gray-700 sticky top-0">
              <tr>
                <th>Sl/No</th>
                <th>Report Title</th>
                <th>Type</th>
                <th>Date</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map((report, index) => (
                <tr key={report.id} className="hover:bg-gray-50">
                  <td>{index + 1}</td>
                  <td>{report.title}</td>
                  <td>{report.type}</td>
                  <td>{report.date}</td>
                  <td className="text-center">
                    <button className="btn btn-sm btn-outline btn-primary flex items-center gap-1">
                      <Download size={16} /> Download
                    </button>
                  </td>
                </tr>
              ))}
              {filteredReports.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center text-gray-500 py-4">
                    No reports found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
