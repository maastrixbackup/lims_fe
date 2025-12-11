import React, { useState, useMemo, useEffect } from "react";
import {
  Download,
  FileText,
  Search,
  ChevronUp,
  ChevronDown,
  Filter,
} from "lucide-react";
import { useSelector } from "react-redux";
import { API_BASE_URL } from "../../utils/config";

export default function KhataSummaryReport() {
const token = useSelector((state) => state.auth.userToken);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [projectFilter, setProjectFilter] = useState("All");
  const [villageFilter, setVillageFilter] = useState("All");
  const [sortAsc, setSortAsc] = useState(true);

  // ---------------- Fetch API Data ----------------
  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/report/khataSummary`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // 🔥 Send Auth Token
            },
          }
        );

        const result = await res.json();
        if (result.success) {
          setData(
            result.data.map((d) => ({
              id: d.id,
              khataNo: d.khata_no,
              village: d.village_name,
              project: d.project_name,
              totalPlots: d.total_plots,
              totalArea: d.total_area,
              createdDate: d.created_at?.split("T")[0],
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching khata summary:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [token]);

  // ---------------- Filter Options ----------------
  const projectOptions = ["All", ...new Set(data.map((d) => d.project))];
  const villageOptions = ["All", ...new Set(data.map((d) => d.village))];

  // ---------------- Filter + Sort ----------------
  const filteredData = useMemo(() => {
    return data
      .filter(
        (row) =>
          row.khataNo.toLowerCase().includes(search.toLowerCase()) ||
          row.village.toLowerCase().includes(search.toLowerCase()) ||
          row.project.toLowerCase().includes(search.toLowerCase())
      )
      .filter((row) =>
        projectFilter === "All" ? true : row.project === projectFilter
      )
      .filter((row) =>
        villageFilter === "All" ? true : row.village === villageFilter
      )
      .sort((a, b) =>
        sortAsc
          ? a.khataNo.localeCompare(b.khataNo)
          : b.khataNo.localeCompare(a.khataNo)
      );
  }, [search, projectFilter, villageFilter, sortAsc, data]);

  // ---------------- UI ----------------

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500">
        Loading khata summary...
      </div>
    );
  }

  return (
    <div className="p-6 bg-white shadow rounded-xl">
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <FileText className="text-primary" /> Khata Summary Report
        </h2>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white px-6 py-2 rounded-lg shadow-sm">
            <Search size={18} className="text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Search khata / village / project..."
              className="bg-transparent focus:outline-none text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Project Filter */}
          <select
            className="px-3 py-2 text-sm border rounded-lg bg-white shadow-sm"
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
          >
            {projectOptions.map((p, i) => (
              <option key={i} value={p}>
                {p}
              </option>
            ))}
          </select>

          {/* Village Filter */}
          <select
            className="px-3 py-2 text-sm border rounded-lg bg-white shadow-sm"
            value={villageFilter}
            onChange={(e) => setVillageFilter(e.target.value)}
          >
            {villageOptions.map((v, i) => (
              <option key={i} value={v}>
                {v}
              </option>
            ))}
          </select>

          {/* Sort Button */}
          <button
            onClick={() => setSortAsc(!sortAsc)}
            className="flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm shadow-sm"
          >
            <Filter size={16} />
            Sort {sortAsc ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      <div className="overflow-auto" style={{ maxHeight: "400px" }}>
        <table className="table w-full text-sm">
          <thead className="bg-gray-200 text-gray-700 uppercase text-xs sticky top-0 z-10">
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
            {filteredData.map((row, i) => (
              <tr key={row.id} className="hover:bg-gray-50">
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

        {filteredData.length === 0 && (
          <p className="text-center py-4 text-gray-500">No records found.</p>
        )}
      </div>
    </div>
  );
}
