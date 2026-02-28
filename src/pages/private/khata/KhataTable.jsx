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
  RR_FIELDS_FORMS,
  COMMON_COLUMNS,
} from "../../../utils/constants";
import KhataTabs from "./KhataTabs";

const KhataTable = ({
  khatas,
  page,
  limit,
  setLimit,
  setPage,
  onEdit,
  onDelete,
  onUpload,
  onMap,
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
    "p-3 text-left bg-gray-200 text-gray-700 md:sticky md:left-10 z-[30] shadow-md";
  const stickyCol1Cell =
    "p-3 text-left bg-white md:sticky md:left-10 shadow-sm ";

  const stickyCol2Header =
    "p-3 text-left bg-gray-200 text-gray-700 md:sticky md:left-[90px] z-[30] shadow-md";
  const stickyCol2Cell =
    "p-3 text-left bg-white md:sticky md:left-[90px] shadow-sm";

  const stickyCol3Header =
    "p-3 text-left bg-gray-200 text-gray-700 md:sticky md:left-[180px] z-[30] shadow-md";
  const stickyCol3Cell =
    "p-3 text-left bg-white md:sticky md:left-[180px] shadow-sm";
  const stickyCol4Header =
    "p-3 text-left bg-gray-200 text-gray-700 md:sticky md:left-[320px] z-[30] shadow-md";
  const stickyCol4Cell =
    "p-3 text-left bg-white md:sticky md:left-[320px] shadow-sm";

  const stickyActionHeader =
    "p-3 text-right bg-gray-200 sticky right-0 z-[30] shadow-md";
  const stickyActionCell =
    "p-3 text-right sticky right-0 border-l border-gray-100 shadow-sm bg-white";
  const sortCollator = new Intl.Collator(undefined, {
    sensitivity: "base",
    numeric: true,
  });

  const formatThreeItems = (value) => {
    if (!value) return "No data";
    const items =
      typeof value === "string"
        ? value.split(",").map((v) => v.trim())
        : Array.isArray(value)
        ? value
        : [];
    const firstThree = items.slice(0, 3).join(", ");
    const remainingCount = items.length - 3;
    return remainingCount > 0
      ? `${firstThree} ... (${remainingCount})`
      : firstThree;
  };

  const parseNumericValue = (value) => {
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (value == null) return null;
    const normalized = String(value).replace(/,/g, "").trim();
    if (!normalized) return null;
    const num = Number(normalized);
    return Number.isFinite(num) ? num : null;
  };

  const compareNaturally = (aVal, bVal, direction) => {
    if (aVal == null && bVal == null) return 0;
    if (aVal == null) return 1;
    if (bVal == null) return -1;

    const aText = String(aVal).split(",")[0].trim();
    const bText = String(bVal).split(",")[0].trim();
    const aNum = parseNumericValue(aText);
    const bNum = parseNumericValue(bText);

    if (aNum !== null && bNum !== null) {
      const diff = aNum - bNum;
      return direction === "asc" ? diff : -diff;
    }

    const result = sortCollator.compare(aText, bText);
    return direction === "asc" ? result : -result;
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
    return Array.from(set).sort((a, b) =>
      sortCollator.compare(String(a), String(b))
    );
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
      return compareNaturally(
        a[sortConfig.field],
        b[sortConfig.field],
        sortConfig.direction
      );
    });

  const clientTotalPages = Math.max(1, Math.ceil(filteredKhatas.length / limit));
  const paginatedKhatas = filteredKhatas.slice(
    (page - 1) * limit,
    page * limit
  );

  useEffect(() => {
    if (page > clientTotalPages) {
      setPage?.(clientTotalPages);
    }
  }, [page, clientTotalPages, setPage]);

  useEffect(() => {
    setPage?.(1);
  }, [filters, sortConfig.field, sortConfig.direction, setPage]);

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
      <div className="card bg-white py-16 flex flex-col items-center">
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
      <div className="card bg-white ">
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
            <KhataTabs>
              <div>
                <div
                  className="max-h-[400px] overflow-x-auto relative"
                  style={{ scrollbarWidth: "thin" }}
                >
                  <table className="table w-full">
                    <thead className="sticky top-0 bg-gray-200 z-20 text-gray-700 uppercase text-xs">
                      <tr>
                        <th className="p-3 text-left bg-gray-200 text-gray-700 md:sticky md:left-0 z-[30] shadow-md">
                          Sl/No
                        </th>
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
                        <FilterableHeader
                          label="Recorded Tenant"
                          field="name_of_recorded_tenant"
                          className={stickyCol3Header}
                          filters={filters}
                          setFilters={setFilters}
                          activeFilter={activeFilter}
                          setActiveFilter={setActiveFilter}
                          getFilterOptions={getFilterOptions}
                          onSort={handleSort}
                          sortConfig={sortConfig}
                        />
                        <FilterableHeader
                          label="Present Tenant"
                          field="name_of_present_tenant"
                          className={stickyCol4Header}
                          filters={filters}
                          setFilters={setFilters}
                          activeFilter={activeFilter}
                          setActiveFilter={setActiveFilter}
                          getFilterOptions={getFilterOptions}
                          onSort={handleSort}
                          sortConfig={sortConfig}
                        />

                        {/* <FilterableHeader
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
                        /> */}

                        {COMMON_COLUMNS.map(({ label, field }) => (
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
                      {paginatedKhatas.map((khata, idx) => (
                        <tr key={khata.id}>
                          <td className="p-3 text-left bg-white md:sticky md:left-0 shadow-sm">
                            {(page - 1) * limit + idx + 1}
                          </td>
                          <td className={stickyCol1Cell}>{khata.khata_no || "No Data"}</td>
                          <td className={stickyCol2Cell}>
                            {khata.village_name || "No Data"}
                          </td>
                          <td className={stickyCol3Cell}>
                            {khata.name_of_recorded_tenant || "No Data"}
                          </td>
                          <td className={stickyCol4Cell}>
                            {khata.name_of_present_tenant || "No Data"}
                          </td>

                          {COMMON_COLUMNS.map(({ field, format }) => (
                            <td key={field} className="whitespace-nowrap">
                              {format === "multi"
                                ? formatThreeItems(khata[field])
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
                  totalPages={clientTotalPages}
                  setPage={setPage}
                  limit={limit}
                  setLimit={setLimit}
                />
              </div>
              <div>
                <div
                  className="max-h-[400px] overflow-x-auto relative"
                  style={{ scrollbarWidth: "thin" }}
                >
                  <table className="table w-full ">
                    <thead className="sticky top-0 bg-gray-200 z-20 text-gray-700 uppercase text-xs">
                      <tr>
                        <th className="p-3 text-left bg-gray-200 text-gray-700 md:sticky md:left-0 z-[30] shadow-md">
                          Sl/No
                        </th>
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
                        <FilterableHeader
                          label="Recorded Tenant"
                          field="name_of_recorded_tenant"
                          className={stickyCol3Header}
                          filters={filters}
                          setFilters={setFilters}
                          activeFilter={activeFilter}
                          setActiveFilter={setActiveFilter}
                          getFilterOptions={getFilterOptions}
                          onSort={handleSort}
                          sortConfig={sortConfig}
                        />
                        <FilterableHeader
                          label="Present Tenant"
                          field="name_of_present_tenant"
                          className={stickyCol4Header}
                          filters={filters}
                          setFilters={setFilters}
                          activeFilter={activeFilter}
                          setActiveFilter={setActiveFilter}
                          getFilterOptions={getFilterOptions}
                          onSort={handleSort}
                          sortConfig={sortConfig}
                        />
                        {/* {RR_FIELDS_FORMS.map(({ label }) => (
                          <th key={label}>{label}</th>
                        ))} */}
                        {RR_FIELDS_FORMS.map(({ label, field }) => (
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
                      {paginatedKhatas.map((khata, idx) => (
                        <tr key={khata.id}>
                          <td className="p-3 text-left bg-white md:sticky md:left-0 shadow-sm">
                            {(page - 1) * limit + idx + 1}
                          </td>

                          <td className={stickyCol1Cell}>
                            {khata.khata_no || "No Data"}
                          </td>
                          <td className={stickyCol2Cell}>
                            {khata.village_name || "No Data"}
                          </td>
                          <td className={stickyCol3Cell}>
                            {khata.name_of_recorded_tenant || "No Data"}
                          </td>
                          <td className={stickyCol4Cell}>
                            {khata.name_of_present_tenant || "No Data"}
                          </td>

                          {RR_FIELDS_FORMS.map(({ name }) => (
                            <td key={name}>
                              {khata[name] !== null &&
                              khata[name] !== undefined &&
                              khata[name] !== ""
                                ? khata[name]
                                : "No Data"}
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
                  totalPages={clientTotalPages}
                  setPage={setPage}
                  limit={limit}
                  setLimit={setLimit}
                />
              </div>
            </KhataTabs>
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
