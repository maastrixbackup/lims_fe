import React from "react";
import { Download } from "lucide-react";

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

  return (
    <div className="bg-white shadow rounded-xl">

      {/* Scroll area */}
      <div
        className="overflow-auto"
        style={{
          maxHeight: "350px",           
          scrollbarWidth: "thin",  
        }}
      >
  

        <table className="table w-full">
          <thead className="bg-gray-100 sticky top-0 z-10">
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
            {mockData.map((row, i) => (
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
      </div>
    </div>
  );
}
