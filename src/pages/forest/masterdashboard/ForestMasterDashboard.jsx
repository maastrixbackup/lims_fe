import React, { useState } from "react";

const summaryCards = [
  {
    title: "Total Projects",
    value: 42,
    gradient: "bg-gradient-to-r from-indigo-500 to-purple-600",
    text: "text-indigo-700",
  },
  {
    title: "Active Projects",
    value: 35,
    gradient: "bg-gradient-to-r from-green-500 to-emerald-600",
    text: "text-green-700",
  },
  {
    title: "Completed Projects",
    value: 12,
    gradient: "bg-gradient-to-r from-blue-500 to-cyan-600",
    text: "text-blue-700",
  },
  {
    title: "Post-Clearance Ongoing",
    value: 9,
    gradient: "bg-gradient-to-r from-orange-500 to-red-500",
    text: "text-orange-700",
  },
];

const dashboardData = [
  { sl: 1, metric: "Total Projects", s0: 25, s1: 20, s2: 17, pc: 9, total: 42 },
  { sl: 2, metric: "Active Projects", s0: 25, s1: 20, s2: 5, pc: 0, total: 35 },
  {
    sl: 3,
    metric: "Completed Projects",
    s0: "-",
    s1: "-",
    s2: 12,
    pc: "-",
    total: 12,
  },
  {
    sl: 4,
    metric: "Post-Clearance Ongoing",
    s0: "-",
    s1: "-",
    s2: "-",
    pc: 9,
    total: 9,
  },
  {
    sl: 5,
    metric: "Stage-0 READY",
    s0: 20,
    s1: "-",
    s2: "-",
    pc: "-",
    total: 20,
  },
  {
    sl: 6,
    metric: "Stage-0 NOT READY",
    s0: 5,
    s1: "-",
    s2: "-",
    pc: "-",
    total: 5,
  },
  {
    sl: 7,
    metric: "Stage-I Completed",
    s0: "-",
    s1: 8,
    s2: "-",
    pc: "-",
    total: 8,
  },
  {
    sl: 8,
    metric: "Stage-I In Progress",
    s0: "-",
    s1: 12,
    s2: "-",
    pc: "-",
    total: 12,
  },
  {
    sl: 9,
    metric: "Stage-I Delayed",
    s0: "-",
    s1: 5,
    s2: "-",
    pc: "-",
    total: 5,
  },
  {
    sl: 10,
    metric: "Stage-II Granted",
    s0: "-",
    s1: "-",
    s2: 12,
    pc: "-",
    total: 12,
  },
  {
    sl: 11,
    metric: "Stage-II In Process",
    s0: "-",
    s1: "-",
    s2: 5,
    pc: "-",
    total: 5,
  },
  { sl: 12, metric: "Mining Projects", s0: 8, s1: 6, s2: 6, pc: 4, total: 14 },
  { sl: 13, metric: "Linear Projects", s0: 6, s1: 5, s2: 0, pc: 0, total: 11 },
  { sl: 14, metric: "Utility Projects", s0: 5, s1: 4, s2: 0, pc: 0, total: 9 },
  {
    sl: 15,
    metric: "Hydel / Irrigation Projects",
    s0: 4,
    s1: 3,
    s2: 1,
    pc: 1,
    total: 6,
  },
  {
    sl: 16,
    metric: "Defence / Strategic Projects",
    s0: 2,
    s1: 2,
    s2: 0,
    pc: 0,
    total: 2,
  },
  {
    sl: 17,
    metric: "Projects ≥90% Ready",
    s0: 15,
    s1: 3,
    s2: "-",
    pc: "-",
    total: 18,
  },
  {
    sl: 18,
    metric: "Projects 60–89%",
    s0: 7,
    s1: 7,
    s2: "-",
    pc: "-",
    total: 14,
  },
  {
    sl: 19,
    metric: "Projects <60%",
    s0: 3,
    s1: 7,
    s2: "-",
    pc: "-",
    total: 10,
  },
  {
    sl: 20,
    metric: "Projects with EDS Raised",
    s0: 2,
    s1: 7,
    s2: "-",
    pc: "-",
    total: 9,
  },
  {
    sl: 21,
    metric: "EDS Queries Pending",
    s0: "-",
    s1: "-",
    s2: "-",
    pc: "-",
    total: 8,
  },
  {
    sl: 22,
    metric: "NPV Payment Pending",
    s0: "-",
    s1: 4,
    s2: "-",
    pc: "-",
    total: 4,
  },
  {
    sl: 23,
    metric: "CA Land Issue Pending",
    s0: "-",
    s1: 4,
    s2: "-",
    pc: "-",
    total: 4,
  },
  {
    sl: 24,
    metric: "FRA Compliance Pending",
    s0: "-",
    s1: 6,
    s2: "-",
    pc: "-",
    total: 6,
  },
  {
    sl: 25,
    metric: "EC / NBWL Pending",
    s0: "-",
    s1: "-",
    s2: 4,
    pc: "-",
    total: 4,
  },
];

export default function ForestMasterDashboard() {
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const totalPages = Math.ceil(dashboardData.length / rowsPerPage);
  const start = (page - 1) * rowsPerPage;
  const currentRows = dashboardData.slice(start, start + rowsPerPage);

  return (
    <div className="p-2 space-y-6">
      <h1 className="text-2xl font-bold text-center">
        FOREST PORTFOLIO – MASTER DASHBOARD
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card, i) => (
          <div
            key={i}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className={`h-1.5 ${card.gradient}`} />

            <div className="p-5">
              <p className="text-sm font-bold text-gray-500">{card.title}</p>
              <p className={`text-3xl font-bold mt-1 ${card.text}`}>
                {card.value}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="shadow-lg overflow-hidden">
        <div className="max-h-[420px] overflow-y-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-200 sticky top-0 z-10">
              <tr>
                <th className="border px-2 py-2">Sl</th>
                <th className="border px-2 py-2 text-left">Dashboard Metric</th>
                <th className="border px-2 py-2">Stage-0</th>
                <th className="border px-2 py-2">Stage-I</th>
                <th className="border px-2 py-2">Stage-II</th>
                <th className="border px-2 py-2">Post</th>
                <th className="border px-2 py-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {currentRows.map((row) => (
                <tr key={row.sl} className="hover:bg-gray-50">
                  <td className="border px-2 py-1 text-center">{row.sl}</td>
                  <td className="border px-2 py-1">{row.metric}</td>
                  <td className="border px-2 py-1 text-center">{row.s0}</td>
                  <td className="border px-2 py-1 text-center">{row.s1}</td>
                  <td className="border px-2 py-1 text-center">{row.s2}</td>
                  <td className="border px-2 py-1 text-center">{row.pc}</td>
                  <td className="border px-2 py-1 text-center font-semibold">
                    {row.total}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between p-3 bg-gray-50">
          <span className="text-sm">
            Showing {start + 1}–{Math.min(start + rowsPerPage, dashboardData.length)} of{" "}
            {dashboardData.length}
          </span>

          <div className="space-x-2">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="border rounded disabled:opacity-50 btn-sm text-sm px-3"
            >
              Prev
            </button>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="border rounded disabled:opacity-50 btn-sm text-sm px-3"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
