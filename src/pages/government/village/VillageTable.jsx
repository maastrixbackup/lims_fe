/* eslint-disable no-unused-vars */
import React, { useMemo, useState } from "react";
import moment from "moment";
import { useSelector } from "react-redux";
import Pagination from "../../../shared/Pagination";
import FilterableHeader from "../../private/khata/FilterableHeader";
import Loader from "../../../shared/Loader";
import { Edit3, Trash2 } from "lucide-react";
import { toast } from "sonner";

const VillageTable = ({
  villages = [],
  projects = [],
  isRestricted,
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
        }),
      )
      .sort((a, b) => {
        if (!sortConfig.field || !sortConfig.direction) return 0;

        return compareValues(
          a[sortConfig.field],
          b[sortConfig.field],
          sortConfig.direction,
          sortConfig.field,
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
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      {showNoProject && (
        <div className="py-10 text-center">
          <p className="text-lg font-medium text-gray-500">
            Please{" "}
            <span className="text-primary font-semibold">Select a Project</span>{" "}
            first.
          </p>
          <p className="text-lg text-gray-500 mt-1">
            A project is required to view the Village list.
          </p>
        </div>
      )}

      {showLoading && <Loader message="Loading village list..." />}

      {showNoVillages && !showLoading && (
        <div className="py-10 text-center">
          <p className="text-md font-medium text-red-500">
            No Village found for the{" "}
            <span className="text-primary font-bold">Selected Project</span>
          </p>
          <p className="text-md text-gray-500 mt-1">
            Try selecting a different{" "}
            <span className="text-gray-600 font-semibold">Project</span> or add
            a new Village.
          </p>
        </div>
      )}

      {!showNoProject && !showNoVillages && !showLoading && (
        <>
          <div
            className="max-h-[400px] overflow-x-auto"
            style={{ scrollbarWidth: "thin" }}
          >
            <table className="table w-full">
              <thead className="bg-slate-50 text-slate-600 sticky top-0 z-10 text-xs font-semibold tracking-wider uppercase border-b border-gray-200">
                <tr>
                  <th>Sl/No</th>
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
                    label="Thana Name & No"
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
                  <th className="text-right pr-6 sticky right-0 bg-gray-100 z-20">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredVillages.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-6 text-gray-500">
                      No data found
                    </td>
                  </tr>
                ) : (
                  filteredVillages.map((v, i) => (
                    <tr
                      key={v.id}
                      className="hover:bg-slate-50/80 transition-colors border-b border-gray-100 text-sm text-gray-700"
                    >
                      <td className="font-medium text-gray-500">{i + 1}</td>
                      <td className="font-semibold text-gray-800">
                        {v.village_name || "—"}
                      </td>
                      <td>{v.district || "—"}</td>
                      <td>{v.tahasil || "—"}</td>
                      <td>{v.thana_name_no || "—"}</td>
                      <td className="text-gray-500">
                        {moment(v.created_at).format("DD MMM YYYY")}
                      </td>

                      <td className="text-right pr-4">
                        <div className="flex items-center justify-end gap-2">
                          {/* Edit Button */}
                          <button
                            type="button"
                            onClick={() => {
                              if (!canEdit) {
                                toast.error(
                                  "You do not have permission to edit.",
                                );
                                return;
                              }
                              onEdit(v);
                            }}
                            disabled={!canEdit}
                            className={`p-1.5 rounded-lg border transition-all ${
                              canEdit
                                ? "bg-indigo-50 border-indigo-200 text-indigo-600 hover:bg-indigo-100 hover:scale-105"
                                : "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed opacity-50"
                            }`}
                            title={canEdit ? "Edit Village" : "Edit Restricted"}
                          >
                            <Edit3 size={15} />
                          </button>

                          {/* Delete Button */}
                          <button
                            type="button"
                            onClick={() => {
                              if (!canDelete) {
                                toast.error(
                                  "You do not have permission to delete.",
                                );
                                return;
                              }
                              onDelete(v);
                            }}
                            disabled={!canDelete}
                            className={`p-1.5 rounded-lg border transition-all ${
                              canDelete
                                ? "bg-red-50 border-red-200 text-red-600 hover:bg-red-100 hover:scale-105"
                                : "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed opacity-50"
                            }`}
                            title={
                              canDelete ? "Delete Village" : "Delete Restricted"
                            }
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <Pagination
            page={page}
            limit={limit}
            setPage={setPage}
            totalPages={totalPages}
            setLimit={setLimit}
          />
        </>
      )}
    </div>
  );
};

export default VillageTable;
