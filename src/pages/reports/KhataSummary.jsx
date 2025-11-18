import React, { useState, useMemo } from "react";
import {
  Download,
  FileText,
  Search,
  ChevronUp,
  ChevronDown,
  Filter,
} from "lucide-react";

export default function KhataSummaryReport() {
  const mockData = [
    {
      khataNo: "102/3",
      village: "Bhalunki",
      project: "NH-53",
      totalPlots: 12,
      totalArea: "4.32 Acres",
      createdDate: "2025-01-12",
    },
    {
      khataNo: "88/2",
      village: "Satmile",
      project: "Irrigation Canal",
      totalPlots: 5,
      totalArea: "1.12 Acres",
      createdDate: "2025-01-10",
    },
    {
      khataNo: "88/2",
      village: "Satmile",
      project: "Irrigation Canal",
      totalPlots: 5,
      totalArea: "1.12 Acres",
      createdDate: "2025-01-10",
    },
    {
      khataNo: "88/2",
      village: "Satmile",
      project: "Irrigation Canal",
      totalPlots: 5,
      totalArea: "1.12 Acres",
      createdDate: "2025-01-10",
    },
  ];

  // ---------------- Filters + States ----------------
  const [search, setSearch] = useState("");
  const [projectFilter, setProjectFilter] = useState("All");
  const [villageFilter, setVillageFilter] = useState("All");
  const [sortAsc, setSortAsc] = useState(true);

  // Unique filter values
  const projectOptions = ["All", ...new Set(mockData.map((d) => d.project))];
  const villageOptions = ["All", ...new Set(mockData.map((d) => d.village))];

  // ---------------- Filter + Sort Logic ----------------
  const filteredData = useMemo(() => {
    return mockData
      .filter(
        (row) =>
          row.khataNo.toLowerCase().includes(search.toLowerCase()) ||
          row.village.toLowerCase().includes(search.toLowerCase()) ||
          row.project.toLowerCase().includes(search.toLowerCase())
      )
      .filter((row) =>
        projectFilter === "All" ? true : row.project === projectFilter
      )
      .filter((row) =>
        villageFilter === "All" ? true : row.village === villageFilter
      )
      .sort((a, b) =>
        sortAsc
          ? a.khataNo.localeCompare(b.khataNo)
          : b.khataNo.localeCompare(a.khataNo)
      );
  }, [search, projectFilter, villageFilter, sortAsc]);

  return (
    <div className="p-6 bg-white shadow rounded-xl">
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <FileText className="text-primary" /> Khata Summary Report
        </h2>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white px-6 py-2 rounded-lg shadow-sm">
            <Search size={18} className="text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Search khata / village / project..."
              className="bg-transparent focus:outline-none text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            className="px-3 py-2 text-sm border rounded-lg bg-white shadow-sm"
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
          >
            {projectOptions.map((p, i) => (
              <option key={i} value={p}>
                {p}
              </option>
            ))}
          </select>

          <select
            className="px-3 py-2 text-sm border rounded-lg bg-white shadow-sm"
            value={villageFilter}
            onChange={(e) => setVillageFilter(e.target.value)}
          >
            {villageOptions.map((v, i) => (
              <option key={i} value={v}>
                {v}
              </option>
            ))}
          </select>

          <button
            onClick={() => setSortAsc(!sortAsc)}
            className="flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm shadow-sm"
          >
            <Filter size={16} />
            Sort {sortAsc ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      <div
        className="overflow-auto"
        style={{
          maxHeight: "400px",
          scrollbarWidth: "thin",
        }}
      >
        <table className="table w-full text-sm">
          <thead className="bg-gray-200 text-gray-700 uppercase text-xs sticky top-0 z-10">
            <tr>
              <th>Sl/No</th>
              <th>Khata No</th>
              <th>Village</th>
              <th>Project</th>
              <th>Total Plots</th>
              <th>Total Area</th>
              <th>Created Date</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredData.map((row, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td>{i + 1}</td>
                <td>{row.khataNo}</td>
                <td>{row.village}</td>
                <td>{row.project}</td>
                <td>{row.totalPlots}</td>
                <td>{row.totalArea}</td>
                <td>{row.createdDate}</td>
                <td className="text-center">
                  <button className="btn btn-sm btn-outline btn-primary flex items-center gap-1">
                    <Download size={16} />
                    Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredData.length === 0 && (
          <p className="text-center py-4 text-gray-500">No records found.</p>
        )}
      </div>
    </div>
  );
}
