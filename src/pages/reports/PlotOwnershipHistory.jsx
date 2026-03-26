import React, { useState } from "react";
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

  // ---------------- Filters ----------------
  const [plotSearch, setPlotSearch] = useState("");
  const [ownerSearch, setOwnerSearch] = useState("");
  const [mutationFilter, setMutationFilter] = useState("");
  const [transactionFilter, setTransactionFilter] = useState("");

  const filterClass =
    "border border-primary/50 rounded-lg px-3 py-2 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition";


  const filteredData = mockData.filter((row) => {
    return (
      row.plotNo.toLowerCase().includes(plotSearch.toLowerCase()) &&
      row.previousOwners.toLowerCase().includes(ownerSearch.toLowerCase()) &&
      (mutationFilter ? row.mutationType === mutationFilter : true) &&
      (transactionFilter ? row.transactionType === transactionFilter : true)
    );
  });

  return (
    <div className="bg-white shadow rounded-xl p-4">
      <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
        <History className="text-primary" /> Plot Ownership History
      </h2>
        <div className="grid md:grid-cols-4 grid-cols-1 gap-4 mb-6">

          {/* Plot Search */}
          <div>
            <label className="text-sm font-medium mb-1 block">Plot No</label>
            <input
              type="text"
              placeholder="Search Plot No"
              value={plotSearch}
              onChange={(e) => setPlotSearch(e.target.value)}
              className={filterClass}
            />
          </div>

          {/* Owner Search */}
          <div>
            <label className="text-sm font-medium mb-1 block">
              Previous Owner
            </label>
            <input
              type="text"
              placeholder="Search Owner"
              value={ownerSearch}
              onChange={(e) => setOwnerSearch(e.target.value)}
              className={filterClass}
            />
          </div>

          {/* Mutation Type Filter */}
          <div>
            <label className="text-sm font-medium mb-1 block">
              Mutation Type
            </label>
            <select
              className={filterClass}
              value={mutationFilter}
              onChange={(e) => setMutationFilter(e.target.value)}
            >
              <option value="">All Types</option>
              <option value="Sale">Sale</option>
              <option value="Gift">Gift</option>
              <option value="Inheritance">Inheritance</option>
            </select>
          </div>

          {/* Transaction Type Filter */}
          <div>
            <label className="text-sm font-medium mb-1 block">
              Transaction Type
            </label>
            <select
              className={filterClass}
              value={transactionFilter}
              onChange={(e) => setTransactionFilter(e.target.value)}
            >
              <option value="">All Transactions</option>
              <option value="Registry">Registry</option>
              <option value="Mutation">Mutation</option>
              <option value="Court Order">Court Order</option>
            </select>
          </div>

        </div>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead className="bg-gray-200 text-gray-700 uppercase text-xs">
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
            {filteredData.map((row, i) => (
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

            {filteredData.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center py-4 text-gray-500">
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}


