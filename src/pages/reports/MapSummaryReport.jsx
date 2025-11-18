// MapSummaryReport.jsx
import React from "react";
import { Map } from "lucide-react";

const dummySummary = {
  totalKMZ: 42,
  updated: "2025-11-17 09:45 AM",
};

const MapSummaryReport = ({ summary = dummySummary }) => {
  return (
    <div>
      {/* <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Map /> Map Summary Report
      </h2> */}

      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Total KMZ Files</th>
            <th className="p-2 border">Last Updated Date</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td className="p-2 border">{summary.totalKMZ}</td>
            <td className="p-2 border">{summary.updated}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default MapSummaryReport;
