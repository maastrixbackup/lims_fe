import React, { useState, useMemo } from "react";
import { FileText, Eye, AlertCircle, Search, Filter } from "lucide-react";

export default function KhataDocumentRegister() {
  const mockData = [
    {
      khataNo: "102/3",
      docs: ["ROR.pdf", "SurveyMap.pdf"],
      date: "2025-01-12",
      missing: false,
    },
    {
      khataNo: "88/2",
      docs: ["ROR.pdf"],
      date: "2025-01-05",
      missing: true,
    },
    {
      khataNo: "88/2",
      docs: ["ROR.pdf"],
      date: "2025-01-05",
      missing: true,
    },
    {
      khataNo: "88/2",
      docs: ["ROR.pdf"],
      date: "2025-01-05",
      missing: true,
    },
  ];

  const [search, setSearch] = useState("");
  const [missingFilter, setMissingFilter] = useState("All");

  const filteredData = useMemo(() => {
    return mockData
      .filter((row) => {
        const text = search.toLowerCase();
        return (
          row.khataNo.toLowerCase().includes(text) ||
          row.docs.some((d) => d.toLowerCase().includes(text))
        );
      })
      .filter((row) => {
        if (missingFilter === "Missing") return row.missing === true;
        if (missingFilter === "Complete") return row.missing === false;
        return true; // All
      });
  }, [search, missingFilter, mockData]);

  return (
    <div className="bg-white shadow rounded-xl p-6">
      <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <FileText className="text-primary" /> Khata Document Register
        </h2>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white px-3 py-2 rounded-lg border shadow-sm">
            <Search size={18} className="text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Search khata / documents..."
              className="bg-transparent focus:outline-none text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            value={missingFilter}
            onChange={(e) => setMissingFilter(e.target.value)}
            className="px-3 py-2 text-sm border rounded-lg bg-white shadow-sm"
          >
            <option value="All">All</option>
            <option value="Missing">Missing Only</option>
            <option value="Complete">Complete Only</option>
          </select>
        </div>
      </div>
      <div
        className="overflow-auto"
        style={{
          maxHeight: "350px",
          scrollbarWidth: "thin",
        }}
      >
        <table className="table w-full text-sm">
          <thead className="bg-gray-200 text-gray-700 uppercase text-xs sticky top-0 z-10">
            <tr>
              <th>Sl/No</th>
              <th>Khata No</th>
              <th>Documents</th>
              <th>Uploaded Date</th>
              <th>Missing?</th>
              <th className="text-center">View</th>
            </tr>
          </thead>

          <tbody>
            {filteredData.map((row, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td>{i + 1}</td>
                <td>{row.khataNo}</td>
                <td>
                  {row.docs.map((d, idx) => (
                    <p key={idx} className="text-blue-600 underline">
                      {d}
                    </p>
                  ))}
                </td>
                <td>{row.date}</td>
                <td>
                  {row.missing ? (
                    <span className="flex items-center gap-1 text-red-600">
                      <AlertCircle size={16} /> Missing
                    </span>
                  ) : (
                    "Complete"
                  )}
                </td>
                <td className="text-center">
                  <button className="btn btn-sm btn-primary flex items-center gap-1">
                    <Eye size={16} /> View PDF
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
