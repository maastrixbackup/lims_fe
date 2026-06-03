import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import moment from "moment";
import * as XLSX from "xlsx";
import { apiClient } from "../utils/apiClient";

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
        const initialLogs = Array.isArray(firstPage?.logs) ? firstPage.logs : [];
        const totalPages = Number(firstPage?.totalPages) || 1;

        if (totalPages <= 1) {
          setLogs(initialLogs);
          return;
        }

        const pageRequests = Array.from({ length: totalPages - 1 }, (_, index) =>
          apiClient(`/log/logList?page=${index + 2}`)
        );

        const remainingPages = await Promise.all(pageRequests);
        const remainingLogs = remainingPages.flatMap((response) =>
          Array.isArray(response?.logs) ? response.logs : []
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
    [logs]
  );

  const actionOptions = useMemo(
    () => [...new Set(logs.map((log) => getActionLabel(log)))].sort(),
    [logs]
  );

  const filteredLogs = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return logs.filter((log) => {
      const matchesSearch =
        !normalizedSearch ||
        Object.values(log).some((value) =>
          String(value ?? "").toLowerCase().includes(normalizedSearch)
        );

      const matchesUser =
        !selectedUser || getUserLabel(log) === selectedUser;

      const matchesAction =
        !selectedAction || getActionLabel(log) === selectedAction;

      const matchesDate = matchesDateRange(
        moment(log.created_at),
        startDate,
        endDate
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
    { Field: "Exported At", Value: exportTimestamp.format("YYYY-MM-DD HH:mm:ss") },
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
        `compliance_logs_${exportTimestamp.format("YYYYMMDD_HHmmss")}.xlsx`
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
        XLSX.utils.json_to_sheet(summaryRows)
      );
      const logsCsv = XLSX.utils.sheet_to_csv(XLSX.utils.json_to_sheet(logRows));
      const csvContent = `${summaryCsv}\n\n${logsCsv}`;

      downloadBlob(
        csvContent,
        `compliance_logs_${exportTimestamp.format("YYYYMMDD_HHmmss")}.csv`,
        "text/csv;charset=utf-8;"
      );
    } finally {
      setExporting(false);
    }
  };

  return (
    <main className="p-4 space-y-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-xl font-bold">System Logs</h2>
          <p className="text-sm text-gray-500">
            Filter by user, action type, and date range, then export for compliance review.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={clearFilters}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium"
          >
            Clear Filters
          </button>
          <button
            type="button"
            onClick={handleExportCsv}
            disabled={!logs.length || exporting}
            className="px-4 py-2 border border-green-600 text-green-700 rounded-md text-sm font-medium disabled:opacity-50"
          >
            {exporting ? "Exporting..." : "Export CSV"}
          </button>
          <button
            type="button"
            onClick={handleExportExcel}
            disabled={!logs.length || exporting}
            className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium disabled:opacity-50"
          >
            {exporting ? "Exporting..." : "Export Excel"}
          </button>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        <input
          type="text"
          placeholder="Search logs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-200"
        />

        <select
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-200"
        >
          <option value="">All Users</option>
          {userOptions.map((user) => (
            <option key={user} value={user}>
              {user}
            </option>
          ))}
        </select>

        <select
          value={selectedAction}
          onChange={(e) => setSelectedAction(e.target.value)}
          className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-200"
        >
          <option value="">All Action Types</option>
          {actionOptions.map((action) => (
            <option key={action} value={action}>
              {action}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-200"
        />

        <input
          type="date"
          value={endDate}
          min={startDate || undefined}
          onChange={(e) => setEndDate(e.target.value)}
          className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-gray-600">
        <span>
          Showing {paginatedLogs.length} of {filteredLogs.length} filtered logs
        </span>
        <span>Total loaded logs: {logs.length}</span>
      </div>

      {loading && <p>Loading logs...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <div
          className="overflow-auto max-h-[600px] border rounded-md shadow-sm"
          style={{ scrollbarWidth: "thin" }}
        >
          <table className="min-w-full text-sm text-left border-collapse">
            <thead className="bg-gray-100 sticky top-0 z-10 whitespace-nowrap">
              <tr>
                <th className="px-4 py-2 border">#</th>
                <th className="px-4 py-2 border">User ID</th>
                <th className="px-4 py-2 border">Action Type</th>
                <th className="px-4 py-2 border">Status</th>
                <th className="px-4 py-2 border">Message</th>
                <th className="px-4 py-2 border">User</th>
                <th className="px-4 py-2 border">Created At</th>
              </tr>
            </thead>
            <tbody>
              {paginatedLogs.length > 0 ? (
                paginatedLogs.map((log, idx) => (
                  <tr key={log.id ?? `${log.user_id}-${idx}`} className="hover:bg-gray-50 whitespace-nowrap">
                    <td className="px-4 py-2 border text-center">
                      {(page - 1) * PAGE_SIZE + idx + 1}
                    </td>
                    <td className="px-4 py-2 border text-center">{log.user_id ?? "-"}</td>
                    <td className="px-4 py-2 border">{getActionLabel(log)}</td>
                    <td
                      className={`px-4 py-2 border font-medium ${
                        String(log.status || "").toLowerCase() === "success"
                          ? "text-green-600"
                          : "text-red-500"
                      }`}
                    >
                      {log.status || "-"}
                    </td>
                    <td className="px-4 py-2 border max-w-[360px] whitespace-normal">
                      {log.message || "-"}
                    </td>
                    <td className="px-4 py-2 border">{getUserLabel(log)}</td>
                    <td className="px-4 py-2 border">
                      {log.created_at
                        ? moment(log.created_at).format("DD MMM YYYY, h:mm A")
                        : "-"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center text-gray-500 py-4 border">
                    No data found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex justify-center items-center gap-3 mt-4">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1 || !filteredLogs.length}
          className="px-3 py-1 border rounded-md disabled:opacity-50"
        >
          Prev
        </button>
        <span className="font-medium">
          Page {filteredLogs.length ? page : 0} / {filteredLogs.length ? totalPages : 0}
        </span>
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages || !filteredLogs.length}
          className="px-3 py-1 border rounded-md disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </main>
  );
};

export default Logs;
