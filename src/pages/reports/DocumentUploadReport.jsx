// DocumentUploadReport.jsx
import React, { useState, useMemo } from "react";
import { FileCheck, Search } from "lucide-react";

const DocumentUploadReport = () => {
  const uploads = [
    {
      fileName: "Khata_102_ROR.pdf",
      khataNo: "102",
      uploadedBy: "Admin",
      uploadDate: "2024-01-12",
      type: "PDF",
    },
    {
      fileName: "Plot_45_Map.kmz",
      khataNo: "56",
      uploadedBy: "Surveyor",
      uploadDate: "2024-02-05",
      type: "KMZ",
    },
    {
      fileName: "Village_A_Survey.pdf",
      khataNo: "NA",
      uploadedBy: "Supervisor",
      uploadDate: "2024-01-30",
      type: "PDF",
    },
  ];

  // -------------------------
  // FILTER STATES
  // -------------------------
  const [search, setSearch] = useState("");
  const [fileType, setFileType] = useState("ALL");

  // -------------------------
  // FILTER LOGIC
  // -------------------------
  const filteredData = useMemo(() => {
    return uploads.filter((item) => {
      const matchesSearch =
        item.fileName.toLowerCase().includes(search.toLowerCase()) ||
        item.khataNo.toLowerCase().includes(search.toLowerCase()) ||
        item.uploadedBy.toLowerCase().includes(search.toLowerCase());

      const matchesType =
        fileType === "ALL" ? true : item.type === fileType;

      return matchesSearch && matchesType;
    });
  }, [search, fileType]);

  return (
    <div className="p-6">

      <h2 className="text-xl font-bold mb-5 flex items-center gap-2 text-gray-800">
        <FileCheck className="text-primary" /> Document Upload Report
      </h2>

      <div className="mb-4 flex flex-col sm:flex-row gap-3 items-center">

        <div className="relative w-full sm:w-1/2">
          <Search className="absolute left-3 top-3 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search by file name, khata, uploaded by..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400"
          value={fileType}
          onChange={(e) => setFileType(e.target.value)}
        >
          <option value="ALL">All Types</option>
          <option value="PDF">PDF</option>
          <option value="KMZ">KMZ</option>
        </select>
      </div>
      <div className="overflow-x-auto rounded-xl shadow">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="bg-gray-200 text-gray-700 uppercase text-xs">
            <tr>
              <th className="py-3 px-4">File Name</th>
              <th className="py-3 px-4">Khata No</th>
              <th className="py-3 px-4">Uploaded By</th>
              <th className="py-3 px-4">Upload Date</th>
              <th className="py-3 px-4">Type</th>
            </tr>
          </thead>

          <tbody>
            {filteredData.map((u, i) => (
              <tr
                key={i}
                className={`${
                  i % 2 === 0 ? "bg-white" : "bg-gray-50"
                } hover:bg-blue-50 transition duration-200`}
              >
                <td className="py-3 px-4 font-medium text-gray-800">{u.fileName}</td>
                <td className="py-3 px-4">{u.khataNo}</td>
                <td className="py-3 px-4">{u.uploadedBy}</td>
                <td className="py-3 px-4">{u.uploadDate}</td>
                <td className="py-3 px-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold 
                    ${
                      u.type === "PDF"
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {u.type}
                  </span>
                </td>
              </tr>
            ))}

            {filteredData.length === 0 && (
              <tr>
                <td
                  colSpan="5"
                  className="text-center py-5 text-gray-500 font-medium"
                >
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

export default DocumentUploadReport;
