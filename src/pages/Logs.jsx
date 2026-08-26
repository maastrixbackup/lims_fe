import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import moment from "moment";
import * as XLSX from "xlsx";
import { apiClient } from "../utils/apiClient";
import { Search, Calendar, RefreshCw, FileSpreadsheet, Download, User, Activity, ChevronLeft, ChevronRight } from "lucide-react";

const PAGE_SIZE = 10;

const getUserLabel = (log) =>
  String(log.user_name || log.user || log.user_id || "Unknown User");

const getActionLabel = (log) => String(log.action || "Unknown Action");

const downloadBlob = (content, fileName, contentType) => {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const matchesDateRange = (logDate, startDate, endDate) => {
  if (!logDate?.isValid()) return false;

  if (startDate && logDate.isBefore(moment(startDate).startOf("day"))) {
    return false;
  }

  if (endDate && logDate.isAfter(moment(endDate).endOf("day"))) {
    return false;
  }

  return true;
};

const Logs = () => {
  const { userToken: token } = useSelector((state) => state.auth);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedAction, setSelectedAction] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!token) return;

    const fetchLogs = async () => {
      try {
        setLoading(true);
        setError(null);

        const firstPage = await apiClient("/log/logList?page=1");
        const initialLogs = Array.isArray(firstPage?.logs)
          ? firstPage.logs
          : [];
        const totalPages = Number(firstPage?.totalPages) || 1;

        if (totalPages <= 1) {
          setLogs(initialLogs);
          return;
        }

        const pageRequests = Array.from(
          { length: totalPages - 1 },
          (_, index) => apiClient(`/log/logList?page=${index + 2}`),
        );

        const remainingPages = await Promise.all(pageRequests);
        const remainingLogs = remainingPages.flatMap((response) =>
          Array.isArray(response?.logs) ? response.logs : [],
        );

        setLogs([...initialLogs, ...remainingLogs]);
      } catch (err) {
        setError(err.message || "Failed to fetch logs");
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [token]);

  const userOptions = useMemo(
    () => [...new Set(logs.map((log) => getUserLabel(log)))].sort(),
    [logs],
  );

  const actionOptions = useMemo(
    () => [...new Set(logs.map((log) => getActionLabel(log)))].sort(),
    [logs],
  );

  const filteredLogs = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return logs.filter((log) => {
      const matchesSearch =
        !normalizedSearch ||
        Object.values(log).some((value) =>
          String(value ?? "")
            .toLowerCase()
            .includes(normalizedSearch),
        );

      const matchesUser = !selectedUser || getUserLabel(log) === selectedUser;

      const matchesAction =
        !selectedAction || getActionLabel(log) === selectedAction;

      const matchesDate = matchesDateRange(
        moment(log.created_at),
        startDate,
        endDate,
      );

      return matchesSearch && matchesUser && matchesAction && matchesDate;
    });
  }, [logs, search, selectedUser, selectedAction, startDate, endDate]);

  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / PAGE_SIZE));

  useEffect(() => {
    setPage(1);
  }, [search, selectedUser, selectedAction, startDate, endDate]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const paginatedLogs = useMemo(() => {
    const startIndex = (page - 1) * PAGE_SIZE;
    return filteredLogs.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filteredLogs, page]);

  const clearFilters = () => {
    setSearch("");
    setSelectedUser("");
    setSelectedAction("");
    setStartDate("");
    setEndDate("");
  };

  const getExportRows = () =>
    logs.map((log, index) => ({
      "Sl. No.": index + 1,
      "Log ID": log.id ?? "-",
      "User ID": log.user_id ?? "-",
      User: getUserLabel(log),
      "Action Type": getActionLabel(log),
      Status: log.status ?? "-",
      Message: log.message ?? "-",
      "Created At": log.created_at
        ? moment(log.created_at).format("YYYY-MM-DD HH:mm:ss")
        : "-",
    }));

  const getSummaryRows = (exportTimestamp) => [
    {
      Field: "Exported At",
      Value: exportTimestamp.format("YYYY-MM-DD HH:mm:ss"),
    },
    { Field: "Total Exported Records", Value: logs.length },
    { Field: "Export Mode", Value: "All loaded logs" },
    { Field: "Search", Value: search || "All" },
    { Field: "User Filter", Value: selectedUser || "All Users" },
    { Field: "Action Type Filter", Value: selectedAction || "All Actions" },
    { Field: "Start Date", Value: startDate || "Not Applied" },
    { Field: "End Date", Value: endDate || "Not Applied" },
  ];

  const handleExportExcel = () => {
    if (!logs.length) return;

    try {
      setExporting(true);

      const exportTimestamp = moment();
      const logRows = getExportRows();
      const summaryRows = getSummaryRows(exportTimestamp);

      const workbook = XLSX.utils.book_new();
      const logSheet = XLSX.utils.json_to_sheet(logRows);
      const summarySheet = XLSX.utils.json_to_sheet(summaryRows);

      XLSX.utils.book_append_sheet(workbook, summarySheet, "Export Summary");
      XLSX.utils.book_append_sheet(workbook, logSheet, "Audit Logs");
      XLSX.writeFile(
        workbook,
        `compliance_logs_${exportTimestamp.format("YYYYMMDD_HHmmss")}.xlsx`,
      );
    } finally {
      setExporting(false);
    }
  };

  const handleExportCsv = () => {
    if (!logs.length) return;

    try {
      setExporting(true);

      const exportTimestamp = moment();
      const summaryRows = getSummaryRows(exportTimestamp);
      const logRows = getExportRows();

      const summaryCsv = XLSX.utils.sheet_to_csv(
        XLSX.utils.json_to_sheet(summaryRows),
      );
      const logsCsv = XLSX.utils.sheet_to_csv(
        XLSX.utils.json_to_sheet(logRows),
      );
      const csvContent = `${summaryCsv}\n\n${logsCsv}`;

      downloadBlob(
        csvContent,
        `compliance_logs_${exportTimestamp.format("YYYYMMDD_HHmmss")}.csv`,
        "text/csv;charset=utf-8;",
      );
    } finally {
      setExporting(false);
    }
  };

  return (
    <main className="p-4 sm:p-6 space-y-5 bg-gray-50/50 min-h-screen text-gray-800">
      {/* Top Header Card */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">
            System Audit Logs
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Monitor system activities, compliance actions, and export records
            for auditing.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={clearFilters}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 rounded-lg text-xs font-semibold shadow-sm transition-all"
          >
            <RefreshCw size={14} /> Clear Filters
          </button>
          <button
            type="button"
            onClick={handleExportCsv}
            disabled={!logs.length || exporting}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-emerald-600/30 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs font-semibold shadow-sm transition-all disabled:opacity-50"
          >
            <Download size={14} /> {exporting ? "Exporting..." : "Export CSV"}
          </button>
          <button
            type="button"
            onClick={handleExportExcel}
            disabled={!logs.length || exporting}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all disabled:opacity-50"
          >
            <FileSpreadsheet size={14} />{" "}
            {exporting ? "Exporting..." : "Export Excel"}
          </button>
        </div>
      </div>

      {/* Filter Inputs Grid */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search logs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white border border-gray-300 text-gray-900 rounded-lg text-xs focus:ring-2 focus:ring-blue-100 focus:border-blue-500 focus:outline-none transition-all"
          />
        </div>

        <div className="relative">
          <User className="absolute left-3 top-2.5 text-gray-400" size={16} />
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white border border-gray-300 text-gray-900 rounded-lg text-xs focus:ring-2 focus:ring-blue-100 focus:border-blue-500 focus:outline-none transition-all appearance-none"
          >
            <option value="">All Users</option>
            {userOptions.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </div>

        <div className="relative">
          <Activity
            className="absolute left-3 top-2.5 text-gray-400"
            size={16}
          />
          <select
            value={selectedAction}
            onChange={(e) => setSelectedAction(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white border border-gray-300 text-gray-900 rounded-lg text-xs focus:ring-2 focus:ring-blue-100 focus:border-blue-500 focus:outline-none transition-all appearance-none"
          >
            <option value="">All Action Types</option>
            {actionOptions.map((act) => (
              <option key={act} value={act}>
                {act}
              </option>
            ))}
          </select>
        </div>

        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-full px-3 py-2 bg-white border border-gray-300 text-gray-900 rounded-lg text-xs focus:ring-2 focus:ring-blue-100 focus:border-blue-500 focus:outline-none transition-all"
        />

        <input
          type="date"
          value={endDate}
          min={startDate || undefined}
          onChange={(e) => setEndDate(e.target.value)}
          className="w-full px-3 py-2 bg-white border border-gray-300 text-gray-900 rounded-lg text-xs focus:ring-2 focus:ring-blue-100 focus:border-blue-500 focus:outline-none transition-all"
        />
      </div>

      {/* Metadata Counter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500 px-1 font-medium">
        <span>
          Showing{" "}
          <strong className="text-gray-800">{paginatedLogs.length}</strong> of{" "}
          <strong className="text-gray-800">{filteredLogs.length}</strong>{" "}
          filtered logs
        </span>
        <span>
          Total Loaded: <strong className="text-gray-800">{logs.length}</strong>
        </span>
      </div>

      {/* Table Card Container */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto max-h-[calc(100vh-340px)] min-h-[350px]">
          <table className="min-w-full text-xs text-left border-collapse">
            <thead className="bg-gray-100/80 text-gray-600 sticky top-0 z-10 uppercase tracking-wider font-semibold border-b border-gray-200">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">User ID</th>
                <th className="px-4 py-3">Action Type</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Message</th>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Created At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-gray-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <RefreshCw
                        className="animate-spin text-blue-500"
                        size={20}
                      />
                      <span>Loading logs...</span>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td
                    colSpan="7"
                    className="text-center py-12 text-rose-500 font-medium"
                  >
                    {error}
                  </td>
                </tr>
              ) : paginatedLogs.length > 0 ? (
                paginatedLogs.map((log, idx) => {
                  const isSuccess =
                    String(log.status || "").toLowerCase() === "success";
                  return (
                    <tr
                      key={log.id ?? `${log.user_id}-${idx}`}
                      className="hover:bg-gray-50/80 transition-colors"
                    >
                      <td className="px-4 py-3 font-medium text-gray-400">
                        {(page - 1) * PAGE_SIZE + idx + 1}
                      </td>
                      <td className="px-4 py-3 font-mono text-gray-500">
                        {log.user_id ?? "-"}
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-800">
                        {getActionLabel(log)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                            isSuccess
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-rose-50 text-rose-700 border border-rose-200"
                          }`}
                        >
                          {log.status || "-"}
                        </span>
                      </td>
                      <td
                        className="px-4 py-3 max-w-[320px] truncate text-gray-600"
                        title={log.message}
                      >
                        {log.message || "-"}
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-800">
                        {getUserLabel(log)}
                      </td>
                      <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                        {log.created_at
                          ? moment(log.created_at).format("DD MMM YYYY, h:mm A")
                          : "-"}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="text-center py-12 text-gray-400 font-medium"
                  >
                    No matching logs found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Container */}
        <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200">
          <span className="text-xs text-gray-500 font-medium">
            Page {filteredLogs.length ? page : 0} of{" "}
            {filteredLogs.length ? totalPages : 0}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1 || !filteredLogs.length}
              className="inline-flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-semibold bg-white hover:bg-gray-50 text-gray-700 disabled:opacity-40 transition-all"
            >
              <ChevronLeft size={14} /> Prev
            </button>
            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages || !filteredLogs.length}
              className="inline-flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-semibold bg-white hover:bg-gray-50 text-gray-700 disabled:opacity-40 transition-all"
            >
              Next <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Logs;
