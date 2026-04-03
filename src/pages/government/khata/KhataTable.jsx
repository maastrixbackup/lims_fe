import React, { useEffect, useState } from "react";
import {
  GovtKhataColumn,
  stickyActionCell,
  stickyActionHeader,
} from "../../../utils/constants";
import FilterHeader from "../plot/FilterHeader";
import { useDispatch, useSelector } from "react-redux";
import Pagination from "../../../shared/Pagination";
import { setSelectedKhataId } from "../../../utils/khataSlice";

const KhataTable = ({
  khatas,
  onEdit,
  userRole,
  onDelete,
  page,
  setPage,
  limit,
  setLimit,
  onUpload,
  onMap,
  onViewPlots,
}) => {
  const canEdit = userRole !== "Viewer";
  const canDelete = !(userRole === "Data Entry User" || userRole === "Viewer");
  const [filters, setFilters] = useState({});
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "asc",
  });
  const [activeFilterKey, setActiveFilterKey] = useState(null);
  const selectedProjectId = useSelector(
    (state) => state.selectedProject.project?.id,
  );
  const dispatch = useDispatch();

  const emptyValue = "";
  const headerCellClass =
    "px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-700 bg-gray-200 whitespace-nowrap border-b border-slate-200/80";
  const bodyCellClass =
    "px-4 py-3 text-sm text-slate-800 border-b border-r border-slate-200 align-top bg-white";

  const stickyCol1Header =
    "px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-700 md:sticky md:left-0 z-[40] bg-gray-200 whitespace-nowrap border-b border-slate-200/80";
  const stickyCol1Cell =
    "px-4 py-3 text-sm text-slate-800 md:sticky md:left-0 border-b border-r border-slate-200 align-top bg-white";

  const stickyCol2Header =
    "px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-700 md:sticky md:left-[120px] z-[35] bg-gray-200 whitespace-nowrap border-b border-slate-200/80";
  const stickyCol2Cell =
    "px-4 py-3 text-sm text-slate-800 md:sticky md:left-[120px] border-b border-r border-slate-200 align-top bg-white";

  const sortCollator = new Intl.Collator(undefined, {
    sensitivity: "base",
    numeric: true,
  });

  const parseNumericValue = (value) => {
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (value == null) return null;

    const normalized = String(value).replace(/,/g, "").trim();
    if (!normalized) return null;

    const num = Number(normalized);
    return Number.isFinite(num) ? num : null;
  };

  const compareValues = (aVal, bVal, direction) => {
    if (aVal == null && bVal == null) return 0;
    if (aVal == null) return 1;
    if (bVal == null) return -1;

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

  const extractPlotNumbers = (value) => {
    if (!value) return [];
    return String(value)
      .split(/[,\n]/)
      .map((v) => v.trim())
      .filter(Boolean);
  };

  const getUniqueValues = (key) => {
    if (key === "plot_no") {
      return [...new Set(khatas.flatMap((k) => extractPlotNumbers(k.plot_no)))].sort((a, b) =>
        sortCollator.compare(String(a), String(b)),
      );
    }

    return [...new Set(khatas.map((k) => k[key]).filter(Boolean))].sort((a, b) =>
      sortCollator.compare(String(a), String(b)),
    );
  };

  const filteredKhatas = khatas
    .filter((k) =>
      Object.entries(filters).every(([key, value]) =>
        value
          ? key === "plot_no"
            ? extractPlotNumbers(k.plot_no).some(
                (plotNo) => plotNo.toLowerCase() === String(value).toLowerCase(),
              )
            : String(k[key]).toLowerCase().includes(value.toLowerCase())
          : true,
      ),
    )
    .sort((a, b) => {
      if (!sortConfig.key) return 0;

      const aVal = a[sortConfig.key] ?? "";
      const bVal = b[sortConfig.key] ?? "";
      return compareValues(aVal, bVal, sortConfig.direction);
    });

  const clientTotalPages = Math.max(1, Math.ceil(filteredKhatas.length / limit));
  const paginatedKhatas = filteredKhatas.slice((page - 1) * limit, page * limit);

  useEffect(() => {
    if (page > clientTotalPages) {
      setPage?.(clientTotalPages);
    }
  }, [page, clientTotalPages, setPage]);

  return (
    <div className="card rounded-xl bg-white shadow-sm border border-slate-200">
      {(!selectedProjectId || filteredKhatas.length === 0) && (
        <div className="py-10 text-center text-gray-600">
          {!selectedProjectId ? (
            <>
              <p className="text-lg font-medium">
                Please <span className="text-primary font-semibold">Select a Project</span>{" "}
                first.
              </p>
              <p className="text-lg text-gray-500 mt-1">
                A project is required to view Khata list.
              </p>
            </>
          ) : (
            <>
              <p className="text-md font-medium text-red-500">
                No Khata found for the <span className="text-primary font-bold">Selected Project.</span>
              </p>
              <p className="text-md text-gray-500 mt-1">
                Try selecting a different <span className="text-gray-700 font-semibold">Project</span> or
                add a new Khata.
              </p>
            </>
          )}
        </div>
      )}

      {selectedProjectId && filteredKhatas.length > 0 && (
        <>
          <div
            className="overflow-x-auto overflow-y-auto max-h-[420px] rounded-lg"
            style={{ scrollbarWidth: "thin" }}
          >
            <table className="table w-full">
              <thead className="bg-gray-200 text-gray-700 sticky top-0 z-10 uppercase text-xs">
                <tr>
                  <th className={headerCellClass}>
                    <FilterHeader
                      column={GovtKhataColumn.find((c) => c.key === "sl_no")}
                      filters={filters}
                      setFilters={setFilters}
                      sortConfig={sortConfig}
                      setSortConfig={setSortConfig}
                      getUniqueValues={getUniqueValues}
                      activeFilterKey={activeFilterKey}
                      setActiveFilterKey={setActiveFilterKey}
                    />
                  </th>

                  <th className={stickyCol1Header}>
                    <FilterHeader
                      column={GovtKhataColumn.find((c) => c.key === "khata_no")}
                      filters={filters}
                      setFilters={setFilters}
                      sortConfig={sortConfig}
                      setSortConfig={setSortConfig}
                      getUniqueValues={getUniqueValues}
                      activeFilterKey={activeFilterKey}
                      setActiveFilterKey={setActiveFilterKey}
                    />
                  </th>

                  <th className={stickyCol2Header}>
                    <FilterHeader
                      column={GovtKhataColumn.find((c) => c.key === "plot_no")}
                      filters={filters}
                      setFilters={setFilters}
                      sortConfig={sortConfig}
                      setSortConfig={setSortConfig}
                      getUniqueValues={getUniqueValues}
                      activeFilterKey={activeFilterKey}
                      setActiveFilterKey={setActiveFilterKey}
                    />
                  </th>

                  {GovtKhataColumn.filter(
                    (c) => !["khata_no", "plot_no", "sl_no"].includes(c.key),
                  ).map((col) => (
                    <th key={col.key} className={headerCellClass}>
                      <FilterHeader
                        column={col}
                        filters={filters}
                        setFilters={setFilters}
                        sortConfig={sortConfig}
                        setSortConfig={setSortConfig}
                        getUniqueValues={getUniqueValues}
                        activeFilterKey={activeFilterKey}
                        setActiveFilterKey={setActiveFilterKey}
                      />
                    </th>
                  ))}

                  <th
                    className={`${stickyActionHeader} px-4 py-3 text-[11px] font-semibold uppercase tracking-wide bg-gray-200 text-slate-700`}
                  >
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {paginatedKhatas.map((k, idx) => (
                  <tr key={k.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className={bodyCellClass}>{(page - 1) * limit + idx + 1}</td>
                    <td className={stickyCol1Cell}>{k.khata_no || emptyValue}</td>
                    <td className={`${stickyCol2Cell} min-w-[300px] max-w-[360px]`}>
                      <div className="max-h-24 overflow-y-auto leading-6 pr-1 whitespace-normal break-words" style={{scrollbarWidth:"thin"}}>
                        {k.plot_numbers || emptyValue}
                      </div>
                    </td>
                    <td className={`${bodyCellClass} min-w-[180px]`}>{k.village_name || emptyValue}</td>
                    <td className={bodyCellClass}>{k.kissam || emptyValue}</td>
                    <td className={bodyCellClass}>{k.lease_case_no || emptyValue}</td>
                    <td className={`${bodyCellClass} min-w-[220px]`} style={{scrollbarWidth:"thin"}}>{k.present_status || emptyValue}</td>
                    <td className={`${bodyCellClass} min-w-[220px]`}>{k.case_details || emptyValue}</td>
                    <td className={bodyCellClass}>{k.plot_count || emptyValue}</td>
                    <td className={bodyCellClass}>{k.unique_id || emptyValue}</td>
                    <td className={bodyCellClass}>{k.name_of_ror || emptyValue}</td>
                    <td className={bodyCellClass}>{k.land_category || emptyValue}</td>

                    <td
                      className={`${stickyActionCell} px-4 py-3 border-b border-slate-200 align-top bg-white`}
                    >
                      <select
                        className="select select-sm bg-white border-slate-300 w-[42px] min-h-8 h-8"
                        defaultValue=""
                        onChange={(e) => {
                          const action = e.target.value;
                          e.target.value = "";

                          if (action === "viewPlots") {
                            dispatch(setSelectedKhataId(k.id));
                            onViewPlots(k);
                          }
                          if (action === "upload") onUpload(k);
                          if (action === "map") onMap(k);
                          if (action === "edit" && canEdit) onEdit(k);
                          if (action === "delete" && canDelete) onDelete(k);
                        }}
                      >
                        <option value="" disabled>
                          Actions
                        </option>
                        <option value="viewPlots">View Plots ({k.plot_count || 0})</option>
                        <option value="upload" disabled={userRole === "Viewer"}>
                          Upload ({k.khata_document_count || 0})
                        </option>
                        <option value="map">Map ({k.khata_map_document_count || 0})</option>
                        <option value="edit" disabled={!canEdit}>
                          Edit
                        </option>
                        <option value="delete" disabled={!canDelete}>
                          Delete
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
            setPage={setPage}
            limit={limit}
            setLimit={setLimit}
            totalPages={clientTotalPages}
          />
        </>
      )}
    </div>
  );
};

export default KhataTable;
