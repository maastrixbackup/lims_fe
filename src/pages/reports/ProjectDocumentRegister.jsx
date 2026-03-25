// ProjectDocumentRegister.jsx
import React, { useState, useMemo } from "react";
import { FileArchive, Search, Filter } from "lucide-react";

const ProjectDocumentRegister = ({ docs }) => {
  // Dummy data
  const dummyDocs = [
    { project: "Smart City Development", maps: 12, pdfs: 8, kmz: 5 },
    { project: "Railway Expansion Project", maps: 7, pdfs: 4, kmz: 3 },
    { project: "Industrial Corridor", maps: 15, pdfs: 10, kmz: 9 },
    { project: "Rural Housing Mission", maps: 0, pdfs: 3, kmz: 0 },
  ];

  const documents = docs?.length ? docs : dummyDocs;

  // -----------------------------
  // 🔎 Filters
  // -----------------------------
  const [searchTerm, setSearchTerm] = useState("");
  const [docType, setDocType] = useState("all"); // all | maps | pdfs | kmz
  const [missingOnly, setMissingOnly] = useState(false);

  // -----------------------------
  // 🔄 Filter Logic
  // -----------------------------
  const filteredDocs = useMemo(() => {
    return documents.filter((d) => {
      const matchesSearch =
        d.project.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDocType =
        docType === "all" ||
        (docType === "maps" && d.maps > 0) ||
        (docType === "pdfs" && d.pdfs > 0) ||
        (docType === "kmz" && d.kmz > 0);

      const matchesMissing =
        !missingOnly ||
        (missingOnly && (d.maps === 0 || d.pdfs === 0 || d.kmz === 0));

      return matchesSearch && matchesDocType && matchesMissing;
    });
  }, [documents, searchTerm, docType, missingOnly]);

  return (
    <div className="p-4 bg-white shadow rounded-xl">
      <h2 className="text-xl font-bold mb-4">Project Document Register</h2>

      {/* ---------------- Filters Section ---------------- */}
      <div className="flex flex-wrap gap-3 mb-4 items-center">
        {/* Search */}
        <div className="flex items-center gap-2 border rounded-lg px-3 py-1">
          <Search size={18} className="text-gray-500" />
          <input
            type="text"
            placeholder="Search project..."
            className="outline-none text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Doc Type Filter */}
        <div className="flex items-center gap-2 border rounded-lg px-3 py-1">
          <Filter size={18} className="text-gray-500" />
          <select
            className="text-sm outline-none bg-transparent"
            value={docType}
            onChange={(e) => setDocType(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="maps">Maps Only</option>
            <option value="pdfs">PDFs Only</option>
            <option value="kmz">KMZ Only</option>
          </select>
        </div>

        {/* Missing Only */}
        <label className="flex items-center gap-2 cursor-pointer text-sm">
          <input
            type="checkbox"
            checked={missingOnly}
            onChange={() => setMissingOnly(!missingOnly)}
          />
          Missing Documents Only
        </label>
      </div>

      {/* ---------------- Table ---------------- */}
      <table className="w-full rounded-lg overflow-hidden">
        <thead className="bg-gray-200 text-gray-700 uppercase text-xs">
          <tr>
            <th className="p-3">Project</th>
            <th className="p-3">Maps</th>
            <th className="p-3">PDFs</th>
            <th className="p-3">KMZ</th>
            <th className="p-3">View</th>
          </tr>
        </thead>

        <tbody>
          {filteredDocs.length === 0 ? (
            <tr>
              <td
                colSpan={5}
                className="p-4 text-center text-gray-500 italic border"
              >
                No data found
              </td>
            </tr>
          ) : (
            filteredDocs.map((d, i) => (
              <tr
                key={i}
                className="hover:bg-gray-100 transition "
              >
                <td className="p-3">{d.project}</td>
                <td className={`p-3 ${d.maps === 0 ? "text-red-600 font-semibold" : ""}`}>
                  {d.maps}
                </td>
                <td className={`p-3 ${d.pdfs === 0 ? "text-red-600 font-semibold" : ""}`}>
                  {d.pdfs}
                </td>
                <td className={`p-3 ${d.kmz === 0 ? "text-red-600 font-semibold" : ""}`}>
                  {d.kmz}
                </td>
                <td className="p-3 text-center">
                  <button className="text-blue-600 hover:text-blue-800">
                    <FileArchive size={18} />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectDocumentRegister;


