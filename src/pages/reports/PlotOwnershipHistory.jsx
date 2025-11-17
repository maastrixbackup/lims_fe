import React from "react";
import { History } from "lucide-react";

export default function PlotOwnershipHistory() {
  const mockData = [
    {
      plotNo: "45",
      previousOwners: "Ramesh → Suresh",
      mutationType: "Sale",
      date: "2024-12-01",
      transactionType: "Registry",
      docNo: "DOC/2342/2024",
    },
  ];

  return (
    <div className="bg-white shadow rounded-xl">
      {/* <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
        <History className="text-primary" /> Plot Ownership History
      </h2> */}

      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead className="bg-gray-100">
            <tr>
              <th>Sl/No</th>
              <th>Plot No</th>
              <th>Previous Owners</th>
              <th>Mutation Type</th>
              <th>Date</th>
              <th>Transaction Type</th>
              <th>Document No</th>
            </tr>
          </thead>

          <tbody>
            {mockData.map((row, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td>{i + 1}</td>
                <td>{row.plotNo}</td>
                <td>{row.previousOwners}</td>
                <td>{row.mutationType}</td>
                <td>{row.date}</td>
                <td>{row.transactionType}</td>
                <td>{row.docNo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
