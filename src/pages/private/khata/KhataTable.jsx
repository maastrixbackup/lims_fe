import React, { useState, useEffect } from "react";
import {
  SlidersHorizontal,
  Upload,
  Map as MapIcon,
  LandPlot,
  DockIcon,
  // SlidersHorizontal,
  Filter,
  FilterIcon,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import PlotListModal from "./PlotListModal";
import { setSelectedKhataId } from "../../../utils/khataSlice";
import Pagination from "../../../shared/Pagination";
import FilterableHeader from "./FilterableHeader";
import {
  RR_FIELDS,
  FOREST_LAND_COLUMNS,
  GOVERNMENT_LAND_COLUMNS,
  PRIVATE_LAND_COLUMNS,
  RR_COLUMNS,
  RR_FIELDS_FORMS,
} from "../../../utils/constants";
import { useLandTypeParam } from "../../../utils/landtypes";

const KhataTable = ({
  khatas,
  page,
  limit,
  setLimit,
  totalPages,
  setPage,
  onEdit,
  onDelete,
  onUpload,
  onMap,
  total,
}) => {
  const dispatch = useDispatch();
  const selectedProject = useSelector((state) => state.selectedProject.project);
  const [noData, setNoData] = useState(false);

  const [isPlotModalOpen, setIsPlotModalOpen] = useState(false);
  const [filters, setFilters] = useState({});
  const [activeFilter, setActiveFilter] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    field: null,
    direction: null,
  });
  const userRole = useSelector((state) => state.auth.user?.role_name);
  const isRestricted = userRole === "Data Entry User" || userRole === "Viewer";

  const stickyCol1Header =
    "p-3 text-left bg-gray-200 md:sticky md:left-0 z-[40] shadow-md min-w-[140px]";

  const stickyCol1Cell =
    "p-3 text-left bg-white md:sticky md:left-0 shadow-sm min-w-[140px]";

  const stickyCol2Header =
    "p-3 text-left bg-gray-200 md:sticky md:left-[140px] z-[35] shadow-md min-w-[180px]";

  const stickyCol2Cell =
    "p-3 text-left bg-white md:sticky md:left-[140px] shadow-sm min-w-[180px]";

  const stickyActionHeader =
    "p-3 text-right bg-gray-200 sticky right-0 z-[30] shadow-md";
  const stickyActionCell =
    "p-3 text-right sticky right-0 border-l border-gray-100 shadow-sm bg-white";

  const typeParam = useLandTypeParam();

  const landType =
    typeParam === 2
      ? "Government Land"
      : typeParam === 3
      ? "Forest Land"
      : "Private Land";

  const tableColumns =
    landType === "Government Land"
      ? GOVERNMENT_LAND_COLUMNS
      : landType === "Forest Land"
      ? FOREST_LAND_COLUMNS
      : PRIVATE_LAND_COLUMNS;

  const formatThreeItems = (value) => {
    if (!value) return "No data";
    const items =
      typeof value === "string"
        ? value.split(",").map((v) => v.trim())
        : Array.isArray(value)
        ? value
        : [];
    const firstThree = items.slice(0, 3).join(", ");
    return items.length > 3 ? `${firstThree} … (${items.length})` : firstThree;
  };

  const normalizeValue = (value) => {
    if (value === null || value === undefined) return "";
    if (typeof value === "number") return value;
    if (!isNaN(Date.parse(value))) return new Date(value).getTime();
    if (typeof value === "string")
      return value.split(",")[0].trim().toLowerCase();
    return value.toString().toLowerCase();
  };

  const handleSort = (field) => {
    setSortConfig((prev) => {
      if (prev.field !== field) return { field, direction: "asc" };
      if (prev.direction === "asc") return { field, direction: "desc" };
      return { field: null, direction: null };
    });
  };

  const displayKhatas = selectedProject
    ? khatas.filter((k) => k.project_id === selectedProject.id)
    : [];

  const getFilterOptions = (field) => {
    const set = new Set();
    displayKhatas.forEach((row) => {
      const val = row[field];
      if (!val) return;
      if (typeof val === "string") {
        val.split(",").forEach((v) => set.add(v.trim()));
      } else {
        set.add(String(val));
      }
    });
    return Array.from(set).sort();
  };

  const filteredKhatas = displayKhatas
    .filter((khata) =>
      Object.entries(filters).every(([field, value]) => {
        if (!value) return true;
        const fieldValue = khata[field];
        if (!fieldValue) return false;

        if (typeof fieldValue === "string")
          return fieldValue
            .split(",")
            .map((v) => v.trim())
            .includes(value);

        return String(fieldValue) === String(value);
      })
    )
    .sort((a, b) => {
      if (!sortConfig.field || !sortConfig.direction) return 0;
      const aVal = normalizeValue(a[sortConfig.field]);
      const bVal = normalizeValue(b[sortConfig.field]);

      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  const isAnyFilterApplied = Object.values(filters).some(Boolean);
  useEffect(() => {
    if (isAnyFilterApplied && filteredKhatas.length === 0) {
      setNoData(true);
    } else {
      setNoData(false);
    }
  }, [filteredKhatas, isAnyFilterApplied]);
  const resetFilters = () => {
    setFilters({});
    setActiveFilter(null);
    setSortConfig({ field: null, direction: null });
    setPage?.(1);
  };

  if (noData) {
    return (
      <div className="card bg-white shadow-lg py-16 flex flex-col items-center">
        <p className="text-lg font-semibold text-red-600">
          No matching Khata found
        </p>

        <p className="text-sm text-gray-500 mt-1">
          Applied filters returned no results.
        </p>

        <button
          className="btn btn-sm btn-outline btn-primary mt-5"
          onClick={resetFilters}
        >
          Reset Filters
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="card bg-white shadow-lg">
        {(!selectedProject || displayKhatas.length === 0) && (
          <div className="py-10 text-center text-gray-600">
            {!selectedProject ? (
              <>
                <p className="text-lg font-medium">
                  Please{" "}
                  <span className="text-primary font-semibold">
                    Select a Project
                  </span>{" "}
                  first.
                </p>
                <p className="text-lg text-gray-500 mt-1">
                  A project is required to view Khata list.
                </p>
              </>
            ) : (
              <>
                <p className="text-md font-medium text-red-500">
                  No Khata found for the{" "}
                  <span className="text-primary font-bold">
                    Selected Project.
                  </span>
                </p>
                <p className="text-md text-gray-500 mt-1">
                  Try selecting a different{" "}
                  <span className="text-gray-700 font-semibold">Project</span>{" "}
                  or add a new Khata.
                </p>
              </>
            )}
          </div>
        )}
        {selectedProject && filteredKhatas.length > 0 && (
          <>
            <div
              className="max-h-[400px] overflow-x-auto relative"
              style={{ scrollbarWidth: "thin" }}
            >
              <table className="table w-full whitespace-nowrap">
                <thead className="sticky top-0 bg-gray-200 z-20 text-gray-700">
                  <tr>
                    <th>Sl/No</th>

                    <FilterableHeader
                      label="Khata No."
                      field="khata_no"
                      className={stickyCol1Header}
                      filters={filters}
                      setFilters={setFilters}
                      activeFilter={activeFilter}
                      setActiveFilter={setActiveFilter}
                      getFilterOptions={getFilterOptions}
                      onSort={handleSort}
                      sortConfig={sortConfig}
                    />

                    <FilterableHeader
                      label="Village"
                      field="village_name"
                      className={stickyCol2Header}
                      filters={filters}
                      setFilters={setFilters}
                      activeFilter={activeFilter}
                      setActiveFilter={setActiveFilter}
                      getFilterOptions={getFilterOptions}
                      onSort={handleSort}
                      sortConfig={sortConfig}
                    />

                    {tableColumns.map(({ label, field }) => (
                      <FilterableHeader
                        key={field}
                        label={label}
                        field={field}
                        filters={filters}
                        setFilters={setFilters}
                        activeFilter={activeFilter}
                        setActiveFilter={setActiveFilter}
                        getFilterOptions={getFilterOptions}
                        onSort={handleSort}
                        sortConfig={sortConfig}
                      />
                    ))}

                    <th className={stickyActionHeader}>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredKhatas.map((khata, idx) => (
                    <tr key={khata.id}>
                      {/* Sl No */}
                      <td>{(page - 1) * limit + idx + 1}</td>

                      {/* Sticky Columns */}
                      <td className={stickyCol1Cell}>{khata.khata_no}</td>
                      <td className={stickyCol2Cell}>{khata.village_name}</td>

                      {/* Dynamic Columns by Land Type */}
                      {tableColumns.map(({ field, format }) => (
                        <td key={field}>
                          {format === "multi"
                            ? formatThreeItems(khata[field] || "No Data")
                            : field === "created_at"
                            ? moment(khata[field]).format("DD-MM-YYYY")
                            : khata[field] || "No Data"}
                        </td>
                      ))}

                      <td className={stickyActionCell}>
                        <select
                          className="select select-sm bg-gray-100 border border-gray-300 w-[42px] "
                          defaultValue=""
                          onChange={(e) => {
                            const action = e.target.value;
                            e.target.value = "";

                            if (action === "viewPlots") {
                              dispatch(setSelectedKhataId(khata.id));
                              setIsPlotModalOpen(true);
                            }

                            if (action === "upload") onUpload(khata);
                            if (action === "map") onMap(khata);
                            if (action === "edit") onEdit(khata);
                            if (action === "delete") onDelete(khata);
                          }}
                        >
                          <option value="" disabled>
                            Actions
                          </option>

                          <option
                            value="viewPlots"
                            className="text-md text-gray-700 font-bold"
                          >
                            <LandPlot size={14} />
                            View Plots ({khata.plot_count || 0})
                          </option>

                          <option
                            value="upload"
                            disabled={userRole === "Viewer"}
                            className={`text-md text-gray-700 font-bold ${
                              userRole === "Viewer" ? "!text-gray-400" : ""
                            }`}
                          >
                            <Upload size={14} />
                            Upload ({khata.khata_document_count || 0})
                          </option>

                          <option
                            value="map"
                            className="text-md text-gray-700 font-bold"
                          >
                            <MapIcon size={14} />
                            Map ({khata.khata_map_document_count || 0})
                          </option>

                          <option
                            value="edit"
                            disabled={userRole === "Viewer"}
                            className={`text-md text-gray-700 font-bold ${
                              userRole === "Viewer" ? "!text-gray-400" : ""
                            }`}
                          >
                            ✍️Edit
                          </option>

                          <option
                            value="delete"
                            disabled={isRestricted}
                            className={`text-md text-gray-700 font-bold ${
                              isRestricted ? "!text-gray-400" : ""
                            }`}
                          >
                            ❌Delete
                          </option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Pagination
              page={page}
              totalPages={totalPages}
              setPage={setPage}
              limit={limit}
              setLimit={setLimit}
            />
          </>
        )}
      </div>

      {isPlotModalOpen && (
        <PlotListModal onClose={() => setIsPlotModalOpen(false)} />
      )}
    </>
  );
};

export default KhataTable;
