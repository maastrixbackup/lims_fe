import React, { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import moment from "moment";
import { API_BASE_URL } from "../utils/config";

const Logs = () => {
  const { userToken: token } = useSelector((state) => state.auth);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const fetchLogs = async (pageNo = 1) => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`${API_BASE_URL}/log/logList?page=${pageNo}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch logs");

      setLogs(data.logs || []);
      setTotalPages(data.totalPages || 1);
      setPage(data.page || 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(page);
  }, [token, page]);
  const filteredLogs = useMemo(() => {
    if (!search) return logs;
    return logs.filter((log) =>
      Object.values(log).some((val) =>
        typeof val === "string"
          ? val.toLowerCase().includes(search.toLowerCase())
          : JSON.stringify(val)
              .toLowerCase()
              .includes(search.toLowerCase())
      )
    );
  }, [search, logs]);

  return (
    <main className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-xl font-bold">📜 System Logs</h2>
        <input
          type="text"
          placeholder="Search logs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-md p-2 w-full sm:w-1/2 md:w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-200"

        />
      </div>

      {loading && <p>Loading logs...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && (
        <div className="overflow-auto max-h-[600px] border rounded-md shadow-sm">
          <table className="min-w-full text-sm text-left border-collapse">
            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-2 border">#</th>
                <th className="px-4 py-2 border">User ID</th>
                <th className="px-4 py-2 border">Action</th>
                <th className="px-4 py-2 border">Status</th>
                <th className="px-4 py-2 border">Message</th>
                <th className="px-4 py-2 border">User</th>
                <th className="px-4 py-2 border">Created At</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log, idx) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border text-center">
                      {(page - 1) * 10 + idx + 1}
                    </td>
                     <td className="px-4 py-2 border text-center">
                     {log.user_id}
                    </td>
                    <td className="px-4 py-2 border">{log.action}</td>
                    <td
                      className={`px-4 py-2 border font-medium ${
                        log.status === "success"
                          ? "text-green-600"
                          : "text-red-500"
                      }`}
                    >
                      {log.status}
                    </td>
                    <td className="px-4 py-2 border">{log.message}</td>
                    <td className="px-4 py-2 border">
                      {log.response_payload?.name || "N/A"}
                    </td>
                    <td className="px-4 py-2 border">
                      {moment(log.created_at).format("DD MMM YYYY")}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center text-gray-500 py-4 border"
                  >
                    No logs found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      <div className="flex justify-center items-center gap-3 mt-4">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="px-3 py-1 border rounded-md disabled:opacity-50"
        >
          Prev
        </button>
        <span className="font-medium">
          Page {page} / {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
          className="px-3 py-1 border rounded-md disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </main>
  );
};

export default Logs;
