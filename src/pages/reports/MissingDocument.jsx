import React, { useState } from "react";
import { AlertTriangle, Search } from "lucide-react";

const MissingDocumentsReport = () => {
  const missingDocs = [
    { khataNo: "102", missingRor: true, missingSurveyMap: false, missingKmz: true },
    { khataNo: "56", missingRor: false, missingSurveyMap: true, missingKmz: false },
    { khataNo: "77", missingRor: true, missingSurveyMap: true, missingKmz: true },
  ];

  const [searchText, setSearchText] = useState("");
  const [filterType, setFilterType] = useState("all");

  const StatusBadge = ({ missing }) => (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${
        missing ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
      }`}
    >
      {missing ? "Missing" : "Available"}
    </span>
  );
  const filteredData = missingDocs.filter((doc) => {
    const matchesSearch = doc.khataNo.toLowerCase().includes(searchText.toLowerCase());

    let matchesFilter = true;

    if (filterType === "missingRor") matchesFilter = doc.missingRor;
    if (filterType === "missingSurveyMap") matchesFilter = doc.missingSurveyMap;
    if (filterType === "missingKmz") matchesFilter = doc.missingKmz;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-5 flex items-center gap-2 text-gray-800">
        <AlertTriangle className="text-red-600" /> Missing Documents Report
      </h2>
      <div className="mb-5 flex flex-wrap gap-4 items-center">
    
        <div className="flex items-center gap-2 bg-white border rounded-lg px-3 py-2 shadow-sm">
          <Search className="text-gray-500" size={18} />
          <input
            type="text"
            placeholder="Search Khata No..."
            className="outline-none text-sm"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
        <select
          className="border bg-white px-3 py-2 rounded-lg shadow-sm text-sm"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="all">All</option>
          <option value="missingRor">Missing RoR</option>
          <option value="missingSurveyMap">Missing Survey Map</option>
          <option value="missingKmz">Missing KMZ</option>
        </select>
      </div>
      <div className="overflow-x-auto rounded-xl shadow">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="bg-gray-200 text-gray-700 uppercase text-xs">
            <tr>
              <th className="py-3 px-4">Khata No</th>
              <th className="py-3 px-4">Missing RoR</th>
              <th className="py-3 px-4">Missing Survey Map</th>
              <th className="py-3 px-4">Missing KMZ</th>
            </tr>
          </thead>

          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((d, i) => (
                <tr
                  key={i}
                  className={`${
                    i % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-blue-50 transition duration-200`}
                >
                  <td className="py-3 px-4 font-medium text-gray-800">{d.khataNo}</td>
                  <td className="py-3 px-4"><StatusBadge missing={d.missingRor} /></td>
                  <td className="py-3 px-4"><StatusBadge missing={d.missingSurveyMap} /></td>
                  <td className="py-3 px-4"><StatusBadge missing={d.missingKmz} /></td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-500">
                  No matching records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MissingDocumentsReport;
