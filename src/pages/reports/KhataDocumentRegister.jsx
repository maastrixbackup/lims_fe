import React from "react";
import { FileText, Eye, AlertCircle } from "lucide-react";

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

  return (
    <div className="bg-white shadow rounded-xl">
      {/* <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
        <FileText className="text-primary" /> Khata Document Register
      </h2> */}

         <div
        className="overflow-auto"
        style={{
          maxHeight: "350px",           
          scrollbarWidth: "thin",  
        }}
      >
        <table className="table w-full">
          <thead className="bg-gray-100">
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
            {mockData.map((row, i) => (
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
                  <button className="btn btn-sm btn-primary">
                    <Eye size={16} /> View PDF
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
