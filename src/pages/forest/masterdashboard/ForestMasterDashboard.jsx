import React, { useEffect, useMemo, useState } from "react";
import { apiClient } from "../../../utils/apiClient";

const COLUMN_LABELS = {
  sl: "SL",
  metric: "DASHBOARD METRIC",
  s0: "STAGE-0",
  s1: "STAGE-I",
  s2: "STAGE-II",
  pc: "POST-CLEARANCE",
  total: "TOTAL",
};

const EMPTY_SUMMARY = {
  total_projects: 0,
  active_projects: 0,
  completed_projects: 0,
  post_clearance_ongoing: 0,
  stage0_ready: 0,
  stage0_not_ready: 0,
  stage1_completed: 0,
  stage1_in_progress: 0,
  stage1_delayed: 0,
  stage2_granted: 0,
  stage2_in_process: 0,
  mining_projects: 0,
  linear_projects: 0,
  utility_projects: 0,
  hydel_irrigation_projects: 0,
  defence_strategic_projects: 0,
  projects_90_ready: 0,
  projects_60_89: 0,
  projects_60: 0,
  eds_raised: 0,
  eds_pending: 0,
  npv_payment_pending: 0,
  ca_land_issue_pending: 0,
  fra_compliance_pending: 0,
  ec_nbwl_pending: 0,
};

const CARD_CONFIG = [
  {
    title: "Total Projects",
    key: "total_projects",
    gradient: "bg-gradient-to-r from-indigo-500 to-purple-600",
    text: "text-indigo-700",
  },
  {
    title: "Active Projects",
    key: "active_projects",
    gradient: "bg-gradient-to-r from-green-500 to-emerald-600",
    text: "text-green-700",
  },
  {
    title: "Completed Projects",
    key: "completed_projects",
    gradient: "bg-gradient-to-r from-blue-500 to-cyan-600",
    text: "text-blue-700",
  },
  {
    title: "Post-Clearance Ongoing",
    key: "post_clearance_ongoing",
    gradient: "bg-gradient-to-r from-orange-500 to-red-500",
    text: "text-orange-700",
  },
];

const sum = (...keys) => (summary) =>
  keys.reduce((acc, key) => acc + (summary[key] || 0), 0);

const DASHBOARD_CONFIG = [
  {
    metric: "Total Projects",
    s0: sum("stage0_ready", "stage0_not_ready"),
    s1: sum("stage1_completed", "stage1_in_progress", "stage1_delayed"),
    s2: sum("stage2_granted", "stage2_in_process"),
    pc: "post_clearance_ongoing",
    total: "total_projects",
  },
  {
    metric: "Active Projects",
    s0: sum("stage0_ready", "stage0_not_ready"),
    s1: sum("stage1_completed", "stage1_in_progress", "stage1_delayed"),
    s2: "stage2_in_process",
    pc: "post_clearance_ongoing",
    total: "active_projects",
  },
  { metric: "Completed Projects", s2: "stage2_granted", total: "completed_projects" },
  {
    metric: "Post-Clearance Ongoing",
    pc: "post_clearance_ongoing",
    total: "post_clearance_ongoing",
  },
  { metric: "Stage-0 READY", s0: "stage0_ready", total: "stage0_ready" },
  { metric: "Stage-0 NOT READY", s0: "stage0_not_ready", total: "stage0_not_ready" },
  { metric: "Stage-I Completed", s1: "stage1_completed", total: "stage1_completed" },
  { metric: "Stage-I In Progress", s1: "stage1_in_progress", total: "stage1_in_progress" },
  { metric: "Stage-I Delayed", s1: "stage1_delayed", total: "stage1_delayed" },
  { metric: "Stage-II Granted", s2: "stage2_granted", total: "stage2_granted" },
  { metric: "Stage-II In Process", s2: "stage2_in_process", total: "stage2_in_process" },
  { metric: "Mining Projects", total: "mining_projects" },
  { metric: "Linear Projects", total: "linear_projects" },
  { metric: "Utility Projects", total: "utility_projects" },
  { metric: "Hydel / Irrigation Projects", total: "hydel_irrigation_projects" },
  { metric: "Defence / Strategic Projects", total: "defence_strategic_projects" },
  { metric: "Projects >=90% Ready", total: "projects_90_ready" },
  { metric: "Projects 60-89%", total: "projects_60_89" },
  { metric: "Projects <60%", total: "projects_60" },
  { metric: "Projects with EDS Raised", total: "eds_raised" },
  { metric: "EDS Queries Pending", total: "eds_pending" },
  { metric: "NPV Payment Pending", total: "npv_payment_pending" },
  { metric: "CA Land Issue Pending", total: "ca_land_issue_pending" },
  { metric: "FRA Compliance Pending", total: "fra_compliance_pending" },
  { metric: "EC / NBWL Pending", total: "ec_nbwl_pending" },
];

const toNumber = (value) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
};

const getCellValue = (configValue, summary) => {
  if (configValue === undefined) return "-";
  if (typeof configValue === "function") return configValue(summary);
  return summary[configValue] ?? "-";
};

const exportDashboardCSV = (rows, fileName) => {
  if (!rows.length) return;

  const keys = Object.keys(COLUMN_LABELS);
  const headers = keys.map((key) => COLUMN_LABELS[key]);
  const csvRows = rows.map((row) => keys.map((key) => `"${row[key] ?? ""}"`).join(","));
  const csvContent = [headers.join(","), ...csvRows].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
};

export default function ForestMasterDashboard() {
  const [summary, setSummary] = useState(EMPTY_SUMMARY);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        const res = await apiClient("/forestland/masterDashboardSummary", {
          method: "GET",
        });

        const merged = { ...EMPTY_SUMMARY, ...(res?.data || {}) };
        Object.keys(merged).forEach((key) => {
          merged[key] = toNumber(merged[key]);
        });

        setSummary(merged);
      } catch (error) {
        console.error("Forest master dashboard summary API error:", error);
        setSummary(EMPTY_SUMMARY);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  const summaryCards = useMemo(
    () => CARD_CONFIG.map((card) => ({ ...card, value: summary[card.key] ?? 0 })),
    [summary],
  );

  const dashboardRows = useMemo(
    () =>
      DASHBOARD_CONFIG.map((row, index) => ({
        sl: index + 1,
        metric: row.metric,
        s0: getCellValue(row.s0, summary),
        s1: getCellValue(row.s1, summary),
        s2: getCellValue(row.s2, summary),
        pc: getCellValue(row.pc, summary),
        total: getCellValue(row.total, summary),
      })),
    [summary],
  );

  return (
    <div className="p-2 space-y-6">
      <h1 className="text-2xl font-bold text-center mb-4">
        FOREST PORTFOLIO - MASTER DASHBOARD
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card) => (
          <div key={card.title} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className={`h-1.5 ${card.gradient}`} />
            <div className="p-5">
              <p className="text-sm font-bold text-gray-500">{card.title}</p>
              <p className={`text-3xl font-bold mt-1 ${card.text}`}>
                {loading ? "..." : card.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end mb-2">
        <button
          onClick={() => exportDashboardCSV(dashboardRows, "FOREST_MASTER_DASHBOARD.csv")}
          className="btn bg-green-600 text-white flex items-center gap-2"
        >
          Export
        </button>
      </div>

      <div className="shadow-lg overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-200 sticky top-0 z-10 border-collapse border border-gray-700">
            <tr>
              <th className="px-2 py-2">Sl</th>
              <th className="px-2 py-2 text-left">Dashboard Metric</th>
              <th className="px-2 py-2">Stage-0</th>
              <th className="px-2 py-2">Stage-I</th>
              <th className="px-2 py-2">Stage-II</th>
              <th className="px-2 py-2">Post</th>
              <th className="px-2 py-2">Total</th>
            </tr>
          </thead>
          <tbody className="border-collapse border border-gray-300">
            {dashboardRows.map((row) => (
              <tr key={row.sl} className="hover:bg-gray-50">
                <td className="border px-2 py-1 text-center">{row.sl}</td>
                <td className="border px-2 py-1">{row.metric}</td>
                <td className="border px-2 py-1 text-center">{row.s0}</td>
                <td className="border px-2 py-1 text-center">{row.s1}</td>
                <td className="border px-2 py-1 text-center">{row.s2}</td>
                <td className="border px-2 py-1 text-center">{row.pc}</td>
                <td className="border px-2 py-1 text-center font-semibold">{row.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
