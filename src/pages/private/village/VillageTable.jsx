import React, { useMemo, useState } from "react";
import moment from "moment";
import { useSelector } from "react-redux";
import Pagination from "../../../shared/Pagination";
import FilterableHeader from "../khata/FilterableHeader";
import Loader from "../../../shared/Loader";
import { Pencil, Trash2 } from "lucide-react";

const VillageTable = ({
  villages = [],
  onEdit,
  onDelete,
  page,
  setPage,
  limit,
  setLimit,
  totalPages,
  loading = false,
}) => {
  const selectedProject = useSelector((state) => state.selectedProject.project);
  const userRole = useSelector((state) => state.auth.user?.role_name);
  const [filters, setFilters] = useState({});
  const [activeFilter, setActiveFilter] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    field: null,
    direction: null,
  });

  const sortCollator = new Intl.Collator(undefined, {
    sensitivity: "base",
    numeric: true,
  });

  const canEdit = userRole !== "Viewer";
  const canDelete = !(userRole === "Data Entry User" || userRole === "Viewer");

  const projectVillages = selectedProject
    ? villages.filter((v) => v.project_id === selectedProject.id)
    : [];

  const getFilterOptions = (field) => {
    const set = new Set();
    projectVillages.forEach((row) => {
      const val = row[field];
      if (val === null || val === undefined || val === "") return;
      set.add(String(val).trim());
    });
    return Array.from(set).sort((a, b) => sortCollator.compare(a, b));
  };

  const parseNumericValue = (value) => {
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (value == null) return null;
    const normalized = String(value).replace(/,/g, "").trim();
    if (!normalized) return null;
    const num = Number(normalized);
    return Number.isFinite(num) ? num : null;
  };

  const compareValues = (aVal, bVal, direction, field) => {
    if (aVal == null && bVal == null) return 0;
    if (aVal == null) return 1;
    if (bVal == null) return -1;
    if (field === "created_at") {
      const aTime = new Date(aVal).getTime();
      const bTime = new Date(bVal).getTime();
      const aSafe = Number.isFinite(aTime) ? aTime : 0;
      const bSafe = Number.isFinite(bTime) ? bTime : 0;
      const diff = aSafe - bSafe;
      return direction === "asc" ? diff : -diff;
    }
    const aNum = parseNumericValue(aVal);
    const bNum = parseNumericValue(bVal);
    if (aNum !== null && bNum !== null) {
      const diff = aNum - bNum;
      return direction === "asc" ? diff : -diff;
    }
    const aText = String(aVal).trim();
    const bText = String(bVal).trim();
    const result = sortCollator.compare(aText, bText);
    return direction === "asc" ? result : -result;
  };

  const filteredVillages = useMemo(() => {
    return projectVillages
      .filter((row) =>
        Object.entries(filters).every(([field, value]) => {
          if (!value) return true;
          const fieldValue = row[field];
          if (fieldValue === null || fieldValue === undefined) return false;
          return String(fieldValue).trim() === String(value).trim();
        })
      )
      .sort((a, b) => {
        if (!sortConfig.field || !sortConfig.direction) return 0;
        return compareValues(
          a[sortConfig.field],
          b[sortConfig.field],
          sortConfig.direction,
          sortConfig.field
        );
      });
  }, [projectVillages, filters, sortConfig]);

  const handleSort = (field) => {
    setSortConfig((prev) => {
      if (prev.field !== field) return { field, direction: "asc" };
      if (prev.direction === "asc") return { field, direction: "desc" };
      return { field: null, direction: null };
    });
  };

  const showNoProject = !selectedProject;
  const showLoading = selectedProject && loading;
  const showNoVillages = selectedProject && filteredVillages.length === 0;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@300;400;500&display=swap');
        .vt-root { font-family: 'DM Sans', sans-serif; }
        .vt-serif { font-family: 'DM Serif Display', serif; }

        .vt-table { width: 100%; border-collapse: collapse; }

        .vt-thead th {
          padding: 10px 14px;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.09em;
          text-transform: uppercase;
          color: #000;
          background: #e5e7eb;
          border-bottom: 1px solid #E5E3DC;
          white-space: nowrap;
          text-align: left;
        }
        .vt-thead th:last-child { text-align: right; padding-right: 20px; }

        .vt-tbody tr {
          border-bottom: 0.5px solid #F1EFE8;
          transition: background 0.12s;
        }
        .vt-tbody tr:hover { background: #FAFAF8; }
        .vt-tbody tr:last-child { border-bottom: none; }

        .vt-tbody td {
          padding: 11px 14px;
          font-size: 13px;
          color: #444441;
          white-space: nowrap;
        }

        .vt-sl { color: #B4B2A9; font-size: 12px; }
        .vt-village { font-weight: 500; color: #1C1B18; }
        .vt-date { font-size: 12px; color: #888780; font-variant-numeric: tabular-nums; }

        .vt-icon-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          border-radius: 6px;
          border: 0.5px solid #E5E3DC;
          background: white;
          cursor: pointer;
          transition: background 0.13s, border-color 0.13s, transform 0.1s;
          padding: 0;
        }
        .vt-icon-btn:hover { background: #F1EFE8; border-color: #D3D1C7; }
        .vt-icon-btn:active { transform: scale(0.93); }
        .vt-icon-btn:disabled { opacity: 0.3; cursor: not-allowed; pointer-events: none; }
        .vt-icon-btn.del:hover { background: #FCEBEB; border-color: #F09595; }

        .vt-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem 1rem;
          gap: 6px;
          text-align: center;
        }
        .vt-empty-icon {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 6px;
          font-size: 20px;
        }
        .vt-empty-title {
          font-family: 'DM Serif Display', serif;
          font-size: 16px;
          color: #1C1B18;
          margin: 0;
        }
        .vt-empty-sub {
          font-size: 12.5px;
          color: #888780;
          margin: 0;
          max-width: 280px;
          line-height: 1.6;
        }
        .vt-highlight { color: #534AB7; font-weight: 500; }
      `}</style>

      <div className="vt-root bg-white rounded-2xl border border-[#E5E3DC] overflow-hidden">

        {showNoProject && (
          <div className="vt-empty">
            <div className="vt-empty-icon bg-[#EEEDFE]">🗂️</div>
            <p className="vt-empty-title">No project selected</p>
            <p className="vt-empty-sub">
              Please <span className="vt-highlight">select a project</span> first to view the village list.
            </p>
          </div>
        )}

        {showLoading && <Loader message="Loading village list..." />}

        {showNoVillages && !showLoading && (
          <div className="vt-empty">
            <div className="vt-empty-icon bg-[#FCEBEB]">📭</div>
            <p className="vt-empty-title">No villages found</p>
            <p className="vt-empty-sub">
              No villages exist for the <span className="vt-highlight">selected project</span>. Try a different project or add a new village.
            </p>
          </div>
        )}

        {!showNoProject && !showNoVillages && !showLoading && (
          <>
            <div
              className="overflow-x-auto"
              style={{ maxHeight: 400, overflowY: "auto", scrollbarWidth: "thin" }}
            >
              <table className="vt-table">
                <thead className="vt-thead sticky top-0 z-10">
                  <tr>
                    <th style={{ width: 48 }}>Sl/No</th>
                    <FilterableHeader
                      label="Village"
                      field="village_name"
                      filters={filters}
                      setFilters={setFilters}
                      activeFilter={activeFilter}
                      setActiveFilter={setActiveFilter}
                      getFilterOptions={getFilterOptions}
                      onSort={handleSort}
                      sortConfig={sortConfig}
                    />
                    <FilterableHeader
                      label="District"
                      field="district"
                      filters={filters}
                      setFilters={setFilters}
                      activeFilter={activeFilter}
                      setActiveFilter={setActiveFilter}
                      getFilterOptions={getFilterOptions}
                      onSort={handleSort}
                      sortConfig={sortConfig}
                    />
                    <FilterableHeader
                      label="Tahasil"
                      field="tahasil"
                      filters={filters}
                      setFilters={setFilters}
                      activeFilter={activeFilter}
                      setActiveFilter={setActiveFilter}
                      getFilterOptions={getFilterOptions}
                      onSort={handleSort}
                      sortConfig={sortConfig}
                    />
                    <FilterableHeader
                      label="Thana Name/ No"
                      field="thana_name_no"
                      filters={filters}
                      setFilters={setFilters}
                      activeFilter={activeFilter}
                      setActiveFilter={setActiveFilter}
                      getFilterOptions={getFilterOptions}
                      onSort={handleSort}
                      sortConfig={sortConfig}
                    />
                    <FilterableHeader
                      label="Date"
                      field="created_at"
                      filters={filters}
                      setFilters={setFilters}
                      activeFilter={activeFilter}
                      setActiveFilter={setActiveFilter}
                      getFilterOptions={getFilterOptions}
                      onSort={handleSort}
                      sortConfig={sortConfig}
                    />
                    <th className="text-right pr-6">Actions</th>
                  </tr>
                </thead>

                <tbody className="vt-tbody">
                  {filteredVillages.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-6 text-[#888780] text-sm">
                        No data found
                      </td>
                    </tr>
                  ) : (
                    filteredVillages.map((v, i) => (
                      <tr key={v.id}>
                        <td className="vt-sl">{i + 1}</td>
                        <td className="vt-village">{v.village_name || "No Data"}</td>
                        <td>{v.district || "No Data"}</td>
                        <td>{v.tahasil || "No Data"}</td>
                        <td>{v.thana_name_no || "No Data"}</td>
                        <td className="vt-date">{moment(v.created_at).format("DD-MM-YYYY")}</td>
                         <td className="text-right">
                        <select
                          className="select select-sm bg-gray-100 border border-gray-300 w-[42px]"
                          defaultValue=""
                          onChange={(e) => {
                            const action = e.target.value;
                            e.target.value = "";

                            if (action === "edit" && canEdit) {
                              onEdit(v);
                            }

                            if (action === "delete" && canDelete) {
                              onDelete(v);
                            }
                          }}
                        >
                          <option value="" disabled>
                            Actions
                          </option>

                          <option
                            value="edit"
                            disabled={userRole === "Viewer"}
                            className={`text-md text-gray-700 font-bold ${
                              userRole === "Viewer" ? "!text-gray-400" : ""
                            }`}
                          >
                          ✍️ Edit
                          </option>

                          <option
                            value="delete"
                            disabled={!canDelete}
                            className={`text-md text-gray-700 font-bold ${
                              !canDelete ? "!text-gray-400" : ""
                            }`}
                          >
                             ❌ Delete
                          </option>
                        </select>
                      </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="border-t border-[#E5E3DC]">
              <Pagination
                page={page}
                limit={limit}
                setPage={setPage}
                totalPages={totalPages}
                setLimit={setLimit}
              />
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default VillageTable;
