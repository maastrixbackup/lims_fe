import React, { useMemo, useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Pencil,
  Trash2,
  X,
  Filter,
  HandCoins,
  ChevronDown,
} from "lucide-react";
import moment from "moment";
import { useSelector } from "react-redux";
import { API_BASE_URL } from "../../../utils/config";
import PlotTabs from "./PlotTabs";
import FilterHeader from "./FilterHeader";
import {
  stickyCol1Cell,
  stickyCol2Header,
  stickyCol2Cell,
  stickyCol3Cell,
  stickyCol3Header,
  stickyActionCell,
  stickyCol1Header,
  stickyActionHeader,
  stickyPaymentCell,
  stickyPaymentHeader,
  BasicDetails,
  TenantDetails,
  BANK_DETAILS_COLUMNS,
  LegalIssues,
  LAND_AREA_VALUATION_COLUMNS,
  TribunalColumns,
  FamilyDetails,
} from "../../../utils/constants";
import ResetFilters from "../../../shared/ResetFilters";
import Pagination from "../../../shared/Pagination";
import SuccessMessage from "../../../shared/SuccessMessage";
import { useSuccessMessage } from "../../../hooks/useSuccessMessage";
// import { useLandTypeParam } from "../../../utils/landtypes";

const PlotTable = ({
  plots,
  page,
  setPage,
  limit,
  setLimit,
  setDeleteConfirm,
}) => {
  const { landType } = useParams();
  const [selectedVillage, setSelectedVillage] = useState("");
  const [selectedKhata, setSelectedKhata] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const user = useSelector((state) => state.auth.user);
  const role = user?.role_name;
  const isRestricted = role === "Viewer";
  const canEdit = role !== "Viewer";
  const canDelete = !(role === "Data Entry User" || role === "Viewer");
  const selectedProject = useSelector((state) => state.selectedProject.project);
  const token = useSelector((state) => state.auth.userToken);
  const [paymentStatusMap, setPaymentStatusMap] = useState({});
  const [loadingPlotId, setLoadingPlotId] = useState(null);
  const [columnFilters, setColumnFilters] = useState({});
  const [noData, setNoData] = useState(false);
  const [openFilterField, setOpenFilterField] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    field: null,
    direction: "asc",
  });
  const { modal, showSuccess, showError, closeModal } = useSuccessMessage();
  const updateFilter = (field, value) => {
    setColumnFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSort = (field) => {
    setSortConfig((prev) => {
      if (prev.field === field) {
        return {
          field,
          direction: prev.direction === "asc" ? "desc" : "asc",
        };
      }
      return { field, direction: "asc" };
    });
  };

  const getOptions = (field) => {
    return [
      ...new Set(projectFilteredPlots.map((p) => p[field]).filter(Boolean)),
    ];
  };

  const getPaymentCode = (plot) => {
    if (paymentStatusMap[plot.id]) {
      return paymentStatusMap[plot.id];
    }

    if (plot.payment_status === "processing") return "PP";
    if (plot.payment_status === "complete") return "PC";
    if (plot.payment_status === "ready") return "RP";

    return "";
  };

  const extractApiErrorMessage = (message, fallback = "Network error") => {
    const raw = String(message || "").trim();
    if (!raw) return fallback;
    try {
      const parsed = JSON.parse(raw);
      return parsed?.message || raw;
    } catch {
      return raw;
    }
  };

  const isSuccessResponse = (data) =>
    data?.success === true ||
    String(data?.success || "").toLowerCase() === "true" ||
    data?.status === 200;

  const handlePaymentStatusChange = async (plot, code) => {
    if (isRestricted) return;
    const targetCode = code === "RC" ? "PC" : code;
    const currentCode = getPaymentCode(plot);
    if (!targetCode || currentCode === targetCode) return;

    if (currentCode === "PP" && targetCode === "RP") {
      showError(
        "Payment is already in processing. It cannot be changed back to ready.",
      );
      return;
    }

    if (targetCode === "PC") {
      setPaymentStatusMap((prev) => ({
        ...prev,
        [plot.id]: "PC",
      }));
      navigate(`/${landType}/land-cost`, {
        state: { plot: { ...plot, payment_status: "complete" } },
      });
      return;
    }

    if (targetCode !== "RP" && targetCode !== "PP") return;

    setLoadingPlotId(plot.id);

    try {
      const payment_status = targetCode === "RP" ? "ready" : "processing";
      const res = await fetch(`${API_BASE_URL}/plots/paymentReady`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          plot_id: plot.id,
          payment_status,
        }),
      });

      const data = await res.json();
      if (!isSuccessResponse(data)) {
        throw new Error(data?.message || "Failed to update status");
      }

      setPaymentStatusMap((prev) => ({
        ...prev,
        [plot.id]: targetCode,
      }));
      showSuccess(data?.message || "Payment status updated");

      if (targetCode === "PP") {
        const updatedPlot = { ...plot, payment_status: "processing" };
        setTimeout(() => {
          closeModal();
          navigate(`/${landType}/land-cost`, { state: { plot: updatedPlot } });
        }, 300);
      }
    } catch (err) {
      const message = extractApiErrorMessage(
        err?.message,
        "Network error. Please try again",
      );

      if (
        message.toLowerCase().includes("already in processing state") ||
        message.toLowerCase().includes("already in processing")
      ) {
        setPaymentStatusMap((prev) => ({
          ...prev,
          [plot.id]: "PP",
        }));
      }

      showError(message);
    } finally {
      setLoadingPlotId(null);
    }
  };

  const sortedPlots = useMemo(() => {
    if (!plots || plots.length === 0) return [];
    return [...plots].sort((a, b) => (a.id || 0) - (b.id || 0));
  }, [plots]);

  const projectFilteredPlots = useMemo(() => {
    if (!selectedProject) return sortedPlots;
    return sortedPlots.filter(
      (plot) =>
        plot.project_id === selectedProject.id ||
        plot.project_name === selectedProject.project_name,
    );
  }, [sortedPlots, selectedProject]);

  const villageOptions = useMemo(() => {
    const uniqueVillages = new Set(
      projectFilteredPlots.map((p) => p.village_name).filter(Boolean),
    );
    return [...uniqueVillages];
  }, [projectFilteredPlots]);

  const filteredPlots = useMemo(() => {
    const collator = new Intl.Collator(undefined, {
      numeric: true,
      sensitivity: "base",
    });

    const parseNumericValue = (value) => {
      if (typeof value === "number" && Number.isFinite(value)) return value;
      if (typeof value !== "string") return null;
      const normalized = value.replace(/,/g, "").trim();
      if (!normalized) return null;
      const num = Number(normalized);
      return Number.isFinite(num) ? num : null;
    };

    const naturalCompare = (aText, bText) => {
      const aParts = aText.match(/(\d+|\D+)/g) || [aText];
      const bParts = bText.match(/(\d+|\D+)/g) || [bText];
      const maxLen = Math.max(aParts.length, bParts.length);

      for (let i = 0; i < maxLen; i += 1) {
        const aPart = aParts[i];
        const bPart = bParts[i];

        if (aPart === undefined) return -1;
        if (bPart === undefined) return 1;

        const aIsNum = /^\d+$/.test(aPart);
        const bIsNum = /^\d+$/.test(bPart);

        if (aIsNum && bIsNum) {
          const diff = Number(aPart) - Number(bPart);
          if (diff !== 0) return diff;
          continue;
        }

        const partCompare = collator.compare(aPart, bPart);
        if (partCompare !== 0) return partCompare;
      }

      return 0;
    };

    const compareValues = (aVal, bVal, direction) => {
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;

      const aNum = parseNumericValue(aVal);
      const bNum = parseNumericValue(bVal);

      if (aNum !== null && bNum !== null) {
        return direction === "asc" ? aNum - bNum : bNum - aNum;
      }

      const aText = String(aVal).trim();
      const bText = String(bVal).trim();
      const result = naturalCompare(aText, bText);
      return direction === "asc" ? result : -result;
    };

    let data = projectFilteredPlots.filter((plot) => {
      const searchText = Object.values(plot)
        .map((value) => {
          if (value === null || value === undefined) return "";
          if (typeof value === "object") return JSON.stringify(value);
          return String(value);
        })
        .join(" ")
        .toLowerCase();

      const searchMatch =
        !searchQuery || searchText.includes(searchQuery.toLowerCase());

      const columnMatch = Object.entries(columnFilters).every(
        ([field, value]) => !value || plot[field] === value,
      );
      const villageMatch =
        !selectedVillage || plot.village_name === selectedVillage;

      return searchMatch && columnMatch && villageMatch;
    });

    if (sortConfig.field) {
      data.sort((a, b) => {
        const aVal = a[sortConfig.field];
        const bVal = b[sortConfig.field];
        return compareValues(aVal, bVal, sortConfig.direction);
      });
    }

    return data;
  }, [projectFilteredPlots, searchQuery, columnFilters, sortConfig, selectedVillage]);

  const clientTotalPages = Math.max(1, Math.ceil(filteredPlots.length / limit));
  const paginatedPlots = filteredPlots.slice(
    (page - 1) * limit,
    page * limit,
  );

  useEffect(() => {
    if (page > clientTotalPages) {
      setPage?.(clientTotalPages);
    }
  }, [page, clientTotalPages, setPage]);

  const resetFilters = useCallback(() => {
    setSearchQuery("");
    setColumnFilters({});
    setSortConfig({ field: null, direction: "asc" });
  }, []);
  const isAnyFilterApplied =
    searchQuery || Object.values(columnFilters).some(Boolean);

  useEffect(() => {
    if (isAnyFilterApplied && filteredPlots.length === 0) {
      setNoData(true);
    } else {
      setNoData(false);
    }
  }, [filteredPlots, isAnyFilterApplied]);

  const navigate = useNavigate();

  const formatDate = (date) => {
    if (!date) return "N/A";
    const d = moment(date);
    return d.isValid() ? d.format("DD-MM-YYYY") : "N/A";
  };

  const rowClass = "hover:bg-gray-50 transition-colors";
  if (noData) {
    return <ResetFilters onClick={resetFilters} />;
  }

  return (
    <>
      <div className="rounded-xl bg-white p-4 mb-4 shadow-sm overflow-x-auto">
        <div className="flex items-end gap-4 min-w-max">
          <div className="flex flex-col w-48 shrink-0">
            <label className="text-xs font-medium text-gray-600 mb-1">
              Village
            </label>
            <select
              className="select select-sm w-full rounded-lg border-gray-300
          focus:border-indigo-500 focus:ring-indigo-400 text-gray-700"
              value={selectedVillage}
              onChange={(e) => setSelectedVillage(e.target.value)}
            >
              <option value="">All Villages</option>
              {villageOptions.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col w-64 lg:w-80 shrink-0">
            <label className="text-xs font-medium text-gray-600 mb-1">
              Search
            </label>

            <div
              className="flex items-center w-full rounded-lg border border-gray-300 bg-white
          shadow-sm focus-within:ring-2 focus-within:ring-indigo-400"
            >
              <input
                type="text"
                placeholder="Search tenant, plot, khata..."
                className="w-full px-3 py-2 text-sm rounded-l-lg focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />

              <button
                type="button"
                onClick={resetFilters}
                title="Reset filters"
                className="px-2 text-gray-500 hover:text-indigo-600"
              >
                <X size={18} />
              </button>
            </div>
          </div>
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-lg
        bg-indigo-100 text-sm font-medium text-indigo-700 shadow-inner
        shrink-0"
          >
            <Filter size={16} />
            Showing
            <span className="font-semibold text-indigo-900">
              {filteredPlots.length}
            </span>
            results
          </div>
        </div>
      </div>

      {(!selectedProject || filteredPlots.length === 0) && (
        <div className=" card bg-white py-10 text-center text-gray-600">
          {selectedProject ? (
            <>
              <p className="text-md font-medium text-red-500">
                No Plot found for the{" "}
                <span className="text-primary font-bold">
                  Selected Project.
                </span>
              </p>
              <p className="text-md text-gray-500 mt-1">
                Try selecting a different{" "}
                <span className="text-gray-700 font-semibold">Project</span> or
                add a new Plot.
              </p>
            </>
          ) : (
            <>
              <p className="text-lg font-medium">
                Please{" "}
                <span className="text-primary font-semibold">
                  Select a Project
                </span>{" "}
                first.
              </p>
              <p className="text-lg text-gray-500 mt-1">
                A project is required to view Plot list.
              </p>
            </>
          )}
        </div>
      )}

      {selectedProject && filteredPlots.length > 0 && (
        <PlotTabs>
          <div
            className="max-h-[400px] overflow-x-auto relative "
            style={{ scrollbarWidth: "thin" }}
          >
            <table className="table w-full">
              <thead className="bg-gray-200 sticky top-0 z-10 text-sm ">
                <tr>
                  {BasicDetails.map((col) => (
                    <FilterHeader
                      key={col.field}
                      label={col.label}
                      field={col.field}
                      options={getOptions(col.field)}
                      columnFilters={columnFilters}
                      updateFilter={updateFilter}
                      openFilterField={openFilterField}
                      setOpenFilterField={setOpenFilterField}
                      onSort={handleSort}
                      sortConfig={sortConfig}
                      className={col.stickyClass}
                      // className={`${col.stickyClass} uppercase text-sm font-medium text-gray-700`}
                    />
                  ))}

                  {/* <th className="p-3 text-left">LO13 Remarks</th> */}
                  {/* <th className={stickyPaymentHeader}>Payment Status</th> */}
                  <th className={stickyActionHeader}>Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 text-xs">
                {paginatedPlots.map((plot, idx) => (
                  <tr
                    key={plot.id || idx}
                    className="hover:bg-gray-50 transition"
                  >
                    <td className="p-3 text-left bg-white md:sticky md:left-0 shadow-sm">
                      {(page - 1) * limit + idx + 1}
                    </td>
                    {/* <td className="p-3">{plot.project_name || "N/A"}</td> */}
                    <td className={stickyCol1Cell}>
                      {plot.la_case_file_no || "N/A"}
                    </td>
                    <td className={stickyCol2Cell}>{plot.khata_no || "N/A"}</td>
                    <td className={stickyCol3Cell}>{plot.plot_no || "N/A"}</td>
                    <td className="p-3">{plot.full_part || "N/A"}</td>
                    <td className="p-3">{plot.ses_survey_no || "N/A"}</td>
                    <td className="p-3">{formatDate(plot.date_of_award)}</td>
                    <td className="p-3">
                      {plot.name_of_recorded_tenant || "N/A"}
                    </td>
                    <td className="p-3">
                      {plot.name_of_present_tenant || "N/A"}
                    </td>
                    <td className="p-3">
                      {plot.present_tenant_count || "N/A"}
                    </td>
                    <td className="p-3">{plot.present_address || "N/A"}</td>
                    <td className="p-3">
                      {plot.displaced_affected_person === "PAF"
                        ? "Person Affected Families"
                        : plot.displaced_affected_person === "PDF"
                          ? "Person Displaced Families"
                          : plot.displaced_affected_person || "N/A"}
                    </td>

                    <td className="p-3 whitespace-nowrap">
                      {plot.village_name || "N/A"}
                    </td>
                    <td className="p-3">{plot.tahasil_name || "N/A"}</td>
                    <td className="p-3">{plot.ri_circle_name || "N/A"}</td>
                    <td className="p-3">{plot.thana_no || "N/A"}</td>
                    <td className="p-3">{plot.kissam_of_land || "N/A"}</td>
                    <td className="p-3">{plot.land_category || "N/A"}</td>
                    <td className="p-3">{plot.lo13_remarks || "N/A"}</td>
                    <td className={stickyPaymentCell}>
                      <div className="relative">
                        <select
                          value={getPaymentCode(plot) || ""}
                          disabled={loadingPlotId === plot.id}
                          onChange={(e) =>
                            handlePaymentStatusChange(plot, e.target.value)
                          }
                          className="absolute inset-0 opacity-0 cursor-pointer shadow-lg"
                        >
                          <option value="" disabled></option>
                          <option value="RP">Ready for Payment (RP) </option>
                          <option value="PP">Payment Processing (PP) </option>
                          <option value="PC">Payment Complete (PC) </option>
                        </select>
                        <div
                          className={`w-[42px] h-[28px] px-1 flex items-center rounded text-xs font-semibold cursor-pointer shadow-lg
        ${getPaymentCode(plot) ? "justify-between" : "justify-center"}
        ${
          getPaymentCode(plot) === "RP"
            ? "bg-orange-600 text-white"
            : getPaymentCode(plot) === "PP"
              ? "bg-green-700 text-white"
              : getPaymentCode(plot) === "PC"
                ? "bg-blue-400 text-white"
                : "bg-gray-200 text-gray-600"
        }
      `}
                        >
                          {getPaymentCode(plot) ? (
                            <>
                              <span>{getPaymentCode(plot)}</span>
                              <ChevronDown size={12} />
                            </>
                          ) : (
                            <ChevronDown size={14} />
                          )}
                        </div>
                      </div>
                    </td>

                    <td className={stickyActionCell}>
                      <select
                        className="select select-sm bg-gray-100 border border-gray-300 w-[42px]"
                        defaultValue=""
                        onChange={(e) => {
                          const action = e.target.value;
                          e.target.value = "";

                          if (action === "edit") {
                            navigate(`/${landType}/plot-form`, {
                              state: { plot },
                            });
                          }

                          if (action === "delete") {
                            setDeleteConfirm(plot);
                          }
                        }}
                      >
                        <option value="" disabled>
                          Actions
                        </option>

                        <option
                          value="edit"
                          // disabled={!canEdit}
                          disabled={!canEdit}
                          className={`text-md text-gray-700 font-bold ${
                            !canEdit ? "!text-gray-400" : ""
                          }`}
                        >
                          ✏️ Edit
                        </option>

                        <option
                          value="delete"
                          disabled={!canDelete}
                          className={`text-md text-gray-700 font-bold ${
                            !canDelete ? "!text-gray-400" : ""
                          }`}
                        >
                          🗑 Delete
                        </option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div
            className="max-h-[400px] overflow-x-auto relative"
            style={{ scrollbarWidth: "thin" }}
          >
            <table className="table w-full">
              <thead className="bg-gray-200 text-gray-700 sticky top-0 z-10 text-sm">
                <tr>
                  {TenantDetails.map((col) => (
                    <FilterHeader
                      key={col.field}
                      label={col.label}
                      field={col.field}
                      options={getOptions(col.field)}
                      columnFilters={columnFilters}
                      updateFilter={updateFilter}
                      openFilterField={openFilterField}
                      setOpenFilterField={setOpenFilterField}
                      onSort={handleSort}
                      sortConfig={sortConfig}
                      className={col.stickyClass}
                    />
                  ))}

                  <th className={stickyActionHeader}>Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 text-xs ">
                {paginatedPlots.map((plot, idx) => (
                  <tr
                    key={plot.id || idx}
                    className="hover:bg-gray-50 transition"
                  >
                    <td className="p-3 text-left bg-white md:sticky md:left-0 shadow-sm">
                      {(page - 1) * limit + idx + 1}
                    </td>
                    {/* <td className="p-3">{plot.project_name || "N/A"}</td> */}
                    <td className={stickyCol1Cell}>
                      {plot.la_case_file_no || "N/A"}
                    </td>
                    <td className={stickyCol2Cell}>{plot.khata_no || "N/A"}</td>
                    <td className={stickyCol3Cell}>{plot.plot_no || "N/A"}</td>
                    <td className="p-3">
                      {plot.name_of_recorded_tenant || "N/A"}
                    </td>
                    <td className="p-3">
                      {plot.name_of_present_tenant || "N/A"}
                    </td>
                    <td className="p-3">
                      {plot.present_tenant_count || "N/A"}
                    </td>
                    <td className="p-3">{plot.present_address || "N/A"}</td>
                    <td className="p-3">
                      {plot.displaced_affected_person || "N/A"}
                    </td>
                    <td className={stickyPaymentCell}>
                      <div className="relative">
                        {/* Invisible select */}
                        <select
                          value={getPaymentCode(plot) || ""}
                          disabled={loadingPlotId === plot.id}
                          onChange={(e) =>
                            handlePaymentStatusChange(plot, e.target.value)
                          }
                          className="absolute inset-0 opacity-0 cursor-pointer shadow-md"
                        >
                          <option value="" disabled></option>
                          <option value="RP">Ready for Payment</option>
                          <option value="PP">Payment Processing</option>
                          <option value="RC">Payment Complete</option>
                        </select>

                        {/* Visible badge */}
                        <div
                          className={`w-[42px] h-[28px] px-1 flex items-center rounded text-xs font-semibold cursor-pointer shadow-md
        ${getPaymentCode(plot) ? "justify-between" : "justify-center"}
        ${
          getPaymentCode(plot) === "RP"
            ? "bg-orange-600 text-white"
            : getPaymentCode(plot) === "PP"
              ? "bg-green-700 text-white"
              : getPaymentCode(plot) === "PC"
                ? "bg-blue-400 text-white"
                : "bg-gray-200 text-gray-600"
        }
      `}
                        >
                          {getPaymentCode(plot) ? (
                            <>
                              <span>{getPaymentCode(plot)}</span>
                              <ChevronDown size={12} />
                            </>
                          ) : (
                            <ChevronDown size={14} />
                          )}
                        </div>
                      </div>
                    </td>
                    <td className={stickyActionCell}>
                      <select
                        className="select select-sm bg-gray-100 border border-gray-300 w-[42px]"
                        defaultValue=""
                        onChange={(e) => {
                          const action = e.target.value;
                          e.target.value = "";

                          if (action === "edit") {
                            navigate(`/${landType}/plot-form`, {
                              state: { plot },
                            });
                          }

                          if (action === "delete") {
                            setDeleteConfirm(plot);
                          }
                        }}
                      >
                        <option value="" disabled>
                          Actions
                        </option>

                        <option
                          value="edit"
                          // disabled={!canEdit}
                          disabled={!canEdit}
                          className={`text-md text-gray-700 font-bold ${
                            !canEdit ? "!text-gray-400" : ""
                          }`}
                        >
                          ✏️ Edit
                        </option>

                        <option
                          value="delete"
                          disabled={!canDelete}
                          className={`text-md text-gray-700 font-bold ${
                            !canDelete ? "!text-gray-400" : ""
                          }`}
                        >
                          🗑 Delete
                        </option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div
            className="max-h-[400px] overflow-x-auto relative"
            style={{ scrollbarWidth: "thin" }}
          >
            <table className="table w-full">
              <thead className="bg-gray-200 text-gray-700 sticky top-0 z-10 whitespace-nowrap text-sm">
                <tr>
                  {BANK_DETAILS_COLUMNS.map((col) => (
                    <FilterHeader
                      key={col.field}
                      label={col.label}
                      field={col.field}
                      options={getOptions(col.field)}
                      columnFilters={columnFilters}
                      updateFilter={updateFilter}
                      openFilterField={openFilterField}
                      setOpenFilterField={setOpenFilterField}
                      onSort={handleSort}
                      sortConfig={sortConfig}
                      className={col.stickyClass}
                    />
                  ))}

                  <th className={stickyActionHeader}>Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {paginatedPlots.map((plot, idx) => (
                  <tr key={plot.id || idx} className={rowClass}>
                    <td className="p-3 text-left bg-white md:sticky md:left-0 shadow-sm">
                      {(page - 1) * limit + idx + 1}
                    </td>
                    <td className={stickyCol1Cell}>
                      {plot.la_case_file_no || "N/A"}
                    </td>
                    <td className={stickyCol2Cell}>{plot.khata_no || "N/A"}</td>
                    <td className={stickyCol3Cell}>{plot.plot_no || "N/A"}</td>
                    <td className="p-3">{plot.bank_name || "N/A"}</td>
                    <td className="p-3">{plot.bank_account_no || "N/A"}</td>
                    <td className="p-3">{plot.branch_ifsc || "N/A"}</td>
                    <td className="p-3">{plot.aadhaar_no || "N/A"}</td>
                    <td className="p-3">{plot.pan_no || "N/A"}</td>
                    <td className="p-3">{plot.age || "N/A"}</td>
                    <td className="p-3">{plot.caste || "N/A"}</td>
                    <td className="p-3">{plot.marital_status || "N/A"}</td>
                    <td className="p-3">{plot.education || "N/A"}</td>
                    <td className="p-3">{plot.occupation || "N/A"}</td>
                    <td className="p-3">{plot.annual_income || "N/A"}</td>
                    <td className="p-3">{plot.skill_acquired || "N/A"}</td>
                    <td className="p-3">{plot.affidavit_details || "N/A"}</td>
                    <td className={stickyPaymentCell}>
                      <div className="relative">
                        {/* Invisible select */}
                        <select
                          value={getPaymentCode(plot) || ""}
                          disabled={loadingPlotId === plot.id}
                          onChange={(e) =>
                            handlePaymentStatusChange(plot, e.target.value)
                          }
                          className="absolute inset-0 opacity-0 cursor-pointer shadow-md"
                        >
                          <option value="" disabled></option>
                          <option value="RP">Ready for Payment</option>
                          <option value="PP">Payment Processing</option>
                          <option value="RC">Payment Complete</option>
                        </select>

                        {/* Visible badge */}
                        <div
                          className={`w-[42px] h-[28px] px-1 flex items-center rounded text-xs font-semibold cursor-pointer shadow-md
        ${getPaymentCode(plot) ? "justify-between" : "justify-center"}
        ${
          getPaymentCode(plot) === "RP"
            ? "bg-orange-600 text-white"
            : getPaymentCode(plot) === "PP"
              ? "bg-green-700 text-white"
              : getPaymentCode(plot) === "PC"
                ? "bg-blue-400 text-white"
                : "bg-gray-200 text-gray-600"
        }
      `}
                        >
                          {getPaymentCode(plot) ? (
                            <>
                              <span>{getPaymentCode(plot)}</span>
                              <ChevronDown size={12} />
                            </>
                          ) : (
                            <ChevronDown size={14} />
                          )}
                        </div>
                      </div>
                    </td>
                    <td className={stickyActionCell}>
                      <select
                        className="select select-sm bg-gray-100 border border-gray-300 w-[42px]"
                        defaultValue=""
                        onChange={(e) => {
                          const action = e.target.value;
                          e.target.value = "";

                          if (action === "edit") {
                            navigate(`/${landType}/plot-form`, {
                              state: { plot },
                            });
                          }

                          if (action === "delete") {
                            setDeleteConfirm(plot);
                          }
                        }}
                      >
                        <option value="" disabled>
                          Actions
                        </option>

                        <option
                          value="edit"
                          // disabled={!canEdit}
                          disabled={!canEdit}
                          className={`text-md text-gray-700 font-bold ${
                            !canEdit ? "!text-gray-400" : ""
                          }`}
                        >
                          ✏️ Edit
                        </option>

                        <option
                          value="delete"
                          disabled={!canDelete}
                          className={`text-md text-gray-700 font-bold ${
                            !canDelete ? "!text-gray-400" : ""
                          }`}
                        >
                          🗑 Delete
                        </option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div
            className="max-h-[400px] overflow-x-auto relative"
            style={{ scrollbarWidth: "thin" }}
          >
            <table className="table w-full">
              <thead className="bg-gray-200 text-gray-700 sticky top-0 z-10 whitespace-nowrap text-sm">
                <tr>
                  {LegalIssues.map((col) => (
                    <FilterHeader
                      key={col.field}
                      label={col.label}
                      field={col.field}
                      options={getOptions(col.field)}
                      columnFilters={columnFilters}
                      updateFilter={updateFilter}
                      openFilterField={openFilterField}
                      setOpenFilterField={setOpenFilterField}
                      onSort={handleSort}
                      sortConfig={sortConfig}
                      className={col.stickyClass}
                    />
                  ))}

                  <th className={stickyActionHeader}>Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 text-xs">
                {paginatedPlots.map((plot, idx) => (
                  <tr
                    key={plot.id || idx}
                    className="hover:bg-gray-50 transition"
                  >
                    <td className="p-3 text-left bg-white md:sticky md:left-0 shadow-sm">
                      {(page - 1) * limit + idx + 1}
                    </td>
                    <td className={stickyCol1Cell}>
                      {plot.la_case_file_no || "N/A"}
                    </td>
                    <td className={stickyCol2Cell}>{plot.khata_no || "N/A"}</td>
                    <td className={stickyCol3Cell}>{plot.plot_no || "N/A"}</td>
                    <td className="p-3">
                      {plot.legal_heir_certificate_no || "N/A"}
                    </td>
                    <td className="p-3">{plot.land_case_no || "N/A"}</td>
                    <td className="p-3">
                      {formatDate(plot.land_case_date) || "N/A"}
                    </td>
                    <td className="p-3">{plot.land_case_type || "N/A"}</td>
                    <td className="p-3">{plot.land_case_status || "N/A"}</td>
                    <td className="p-3">{plot.land_case_action || "N/A"}</td>

                    <td className={stickyPaymentCell}>
                      <div className="relative">
                        {/* Invisible select */}
                        <select
                          value={getPaymentCode(plot) || ""}
                          disabled={loadingPlotId === plot.id}
                          onChange={(e) =>
                            handlePaymentStatusChange(plot, e.target.value)
                          }
                          className="absolute inset-0 opacity-0 cursor-pointer shadow-md"
                        >
                          <option value="" disabled></option>
                          <option value="RP">Ready for Payment</option>
                          <option value="PP">Payment Processing</option>
                          <option value="RC">Payment Complete</option>
                        </select>

                        {/* Visible badge */}
                        <div
                          className={`w-[42px] h-[28px] px-1 flex items-center rounded text-xs font-semibold cursor-pointer shadow-md
        ${getPaymentCode(plot) ? "justify-between" : "justify-center"}
        ${
          getPaymentCode(plot) === "RP"
            ? "bg-orange-600 text-white"
            : getPaymentCode(plot) === "PP"
              ? "bg-green-700 text-white"
              : getPaymentCode(plot) === "PC"
                ? "bg-blue-400 text-white"
                : "bg-gray-200 text-gray-600"
        }
      `}
                        >
                          {getPaymentCode(plot) ? (
                            <>
                              <span>{getPaymentCode(plot)}</span>
                              <ChevronDown size={12} />
                            </>
                          ) : (
                            <ChevronDown size={14} />
                          )}
                        </div>
                      </div>
                    </td>

                    <td className={stickyActionCell}>
                      <select
                        className="select select-sm bg-gray-100 border border-gray-300 w-[42px]"
                        defaultValue=""
                        onChange={(e) => {
                          const action = e.target.value;
                          e.target.value = "";

                          if (action === "edit") {
                            navigate(`/${landType}/plot-form`, {
                              state: { plot },
                            });
                          }

                          if (action === "delete") {
                            setDeleteConfirm(plot);
                          }
                        }}
                      >
                        <option value="" disabled>
                          Actions
                        </option>

                        <option
                          value="edit"
                          disabled={!canEdit}
                          className={`text-md text-gray-700 font-bold ${
                            !canEdit ? "!text-gray-400" : ""
                          }`}
                        >
                          ✏️ Edit
                        </option>

                        <option
                          value="delete"
                          disabled={!canDelete}
                          className={`text-md text-gray-700 font-bold ${
                            !canDelete ? "!text-gray-400" : ""
                          }`}
                        >
                          🗑 Delete
                        </option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div
            className="max-h-[400px] overflow-x-auto relative"
            style={{ scrollbarWidth: "thin" }}
          >
            <table className="table w-full">
              <thead className="bg-gray-200 text-gray-700 sticky top-0 z-10 text-sm">
                <tr>
                  {LAND_AREA_VALUATION_COLUMNS.map((col) => (
                    <FilterHeader
                      key={col.field}
                      label={col.label}
                      field={col.field}
                      options={getOptions(col.field)}
                      columnFilters={columnFilters}
                      updateFilter={updateFilter}
                      openFilterField={openFilterField}
                      setOpenFilterField={setOpenFilterField}
                      onSort={handleSort}
                      sortConfig={sortConfig}
                      className={col.stickyClass}
                    />
                  ))}

                  <th className={stickyActionHeader}>Actions</th>
                </tr>
              </thead>

              <tbody className="text-xs">
                {paginatedPlots.map((plot, idx) => (
                  <tr key={plot.id || idx} className="">
                    <td className="p-3 text-left bg-white md:sticky md:left-0 shadow-sm">
                      {(page - 1) * limit + idx + 1}
                    </td>
                    <td className={stickyCol1Cell}>
                      {plot.la_case_file_no || "N/A"}
                    </td>
                    <td className={stickyCol2Cell}>{plot.khata_no || "N/A"}</td>
                    <td className={stickyCol3Cell}>{plot.plot_no || "N/A"}</td>

                    <td className="p-3">
                      {plot.land_area_total_acres || "N/A"}
                    </td>
                    <td className="p-3">
                      {plot.land_area_total_hectares || "N/A"}
                    </td>
                    <td className="p-3">
                      {plot.land_area_acquired_acres || "N/A"}
                    </td>
                    <td className="p-3">
                      {plot.land_area_acquired_hectares || "N/A"}
                    </td>
                    <td className="p-3">
                      {plot.market_value_per_acre || "N/A"}
                    </td>
                    <td className="p-3">{plot.basic_land_value || "N/A"}</td>
                    <td className="p-3">{plot.land_value_with_mf || "N/A"}</td>
                    <td className="p-3">{plot.no_of_trees || "N/A"}</td>
                    <td className="p-3">
                      {plot.total_value_of_trees || "N/A"}
                    </td>
                    <td className="p-3">{plot.no_of_house || "N/A"}</td>
                    <td className="p-3">{plot.value_of_house || "N/A"}</td>
                    <td className="p-3">
                      {plot.details_of_other_structures || "N/A"}
                    </td>
                    <td className="p-3">
                      {plot.value_of_other_structures || "N/A"}
                    </td>
                    <td className="p-3">{plot.total_value || "N/A"}</td>
                    <td className="p-3">{plot.solatium_100 || "N/A"}</td>
                    <td className="p-3">{plot.no_days_interest || "N/A"}</td>
                    <td className="p-3">
                      {plot.additional_12_percent || "N/A"}
                    </td>
                    <td className="p-3">{plot.total_compensation || "N/A"}</td>
                    <td className="p-3">
                      {plot.apportionment_amount || "N/A"}
                    </td>
                    <td className="p-3">{plot.priority_urgency || "N/A"}</td>
                    <td className="p-3">{plot.land_use_plan || "N/A"}</td>
                    <td className="p-3">{plot.la21_remarks || "N/A"}</td>
                    <td className={stickyPaymentCell}>
                      <div className="relative">
                        {/* Invisible select */}
                        <select
                          value={getPaymentCode(plot) || ""}
                          disabled={loadingPlotId === plot.id}
                          onChange={(e) =>
                            handlePaymentStatusChange(plot, e.target.value)
                          }
                          className="absolute inset-0 opacity-0 cursor-pointer shadow-md"
                        >
                          <option value="" disabled></option>
                          <option value="RP">Ready for Payment</option>
                          <option value="PP">Payment Processing</option>
                          <option value="RC">Payment Complete</option>
                        </select>

                        {/* Visible badge */}
                        <div
                          className={`w-[42px] h-[28px] px-1 flex items-center rounded text-xs font-semibold cursor-pointer shadow-md
        ${getPaymentCode(plot) ? "justify-between" : "justify-center"}
        ${
          getPaymentCode(plot) === "RP"
            ? "bg-orange-600 text-white"
            : getPaymentCode(plot) === "PP"
              ? "bg-green-700 text-white"
              : getPaymentCode(plot) === "PC"
                ? "bg-blue-400 text-white"
                : "bg-gray-200 text-gray-600"
        }
      `}
                        >
                          {getPaymentCode(plot) ? (
                            <>
                              <span>{getPaymentCode(plot)}</span>
                              <ChevronDown size={12} />
                            </>
                          ) : (
                            <ChevronDown size={14} />
                          )}
                        </div>
                      </div>
                    </td>
                    <td className={stickyActionCell}>
                      <select
                        className="select select-sm bg-gray-100 border border-gray-300 w-[42px]"
                        defaultValue=""
                        onChange={(e) => {
                          const action = e.target.value;
                          e.target.value = "";

                          if (action === "edit") {
                            navigate(`/${landType}/plot-form`, {
                              state: { plot },
                            });
                          }

                          if (action === "delete") {
                            setDeleteConfirm(plot);
                          }
                        }}
                      >
                        <option value="" disabled>
                          Actions
                        </option>

                        <option
                          value="edit"
                          // disabled={!canEdit}
                          disabled={!canEdit}
                          className={`text-md text-gray-700 font-bold ${
                            !canEdit ? "!text-gray-400" : ""
                          }`}
                        >
                          ✏️ Edit
                        </option>

                        <option
                          value="delete"
                          disabled={!canDelete}
                          className={`text-md text-gray-700 font-bold ${
                            !canDelete ? "!text-gray-400" : ""
                          }`}
                        >
                          🗑 Delete
                        </option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div
            className="max-h-[400px] overflow-x-auto relative"
            style={{ scrollbarWidth: "thin" }}
          >
            <table className="table w-full">
              <thead className="bg-gray-200 text-gray-700 sticky top-0 z-10 whitespace-nowrap text-sm">
                <tr>
                  {TribunalColumns.map((col) => (
                    <FilterHeader
                      key={col.field}
                      label={col.label}
                      field={col.field}
                      options={getOptions(col.field)}
                      columnFilters={columnFilters}
                      updateFilter={updateFilter}
                      openFilterField={openFilterField}
                      setOpenFilterField={setOpenFilterField}
                      onSort={handleSort}
                      sortConfig={sortConfig}
                      className={col.stickyClass}
                    />
                  ))}

                  <th className={stickyActionHeader}>Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 text-xs ">
                {paginatedPlots.map((plot, idx) => (
                  <tr
                    key={plot.id || idx}
                    className="hover:bg-gray-50 transition"
                  >
                    <td className="p-3 text-left bg-white md:sticky md:left-0 shadow-sm">
                      {(page - 1) * limit + idx + 1}
                    </td>
                    {/* <td className="p-3">{plot.project_name || "N/A"}</td> */}
                    <td className={stickyCol1Cell}>
                      {plot.la_case_file_no || "N/A"}
                    </td>
                    <td className={stickyCol2Cell}>{plot.khata_no || "N/A"}</td>
                    <td className={stickyCol3Cell}>{plot.plot_no || "N/A"}</td>
                    <td className="p-3">{plot.grievance_no || "N/A"}</td>
                    <td className="p-3">
                      {formatDate(plot.grievance_date) || "N/A"}
                    </td>
                    <td className="p-3">{plot.grievance_subject || "N/A"}</td>
                    <td className="p-3">{plot.grievance_status || "N/A"}</td>
                    <td className="p-3">{plot.grievance_action || "N/A"}</td>
                    <td className="p-3">
                      {plot.tribunal === "Y" ? "Yes" : "No"}
                    </td>
                    <td className="p-3">
                      {formatDate(plot.tribunal_deposit_date) || "N/A"}
                    </td>
                    <td className="p-3">{plot.tribunal_amount ?? "N/A"}</td>

                    <td className="p-3">{plot.abatement || "N/A"}</td>
                    <td className={stickyPaymentCell}>
                      <div className="relative">
                        {/* Invisible select */}
                        <select
                          value={getPaymentCode(plot) || ""}
                          disabled={loadingPlotId === plot.id}
                          onChange={(e) =>
                            handlePaymentStatusChange(plot, e.target.value)
                          }
                          className="absolute inset-0 opacity-0 cursor-pointer shadow-md"
                        >
                          <option value="" disabled></option>
                          <option value="RP">Ready for Payment</option>
                          <option value="PP">Payment Processing</option>
                          <option value="RC">Payment Complete</option>
                        </select>

                        {/* Visible badge */}
                        <div
                          className={`w-[42px] h-[28px] px-1 flex items-center rounded text-xs font-semibold cursor-pointer shadow-md
        ${getPaymentCode(plot) ? "justify-between" : "justify-center"}
        ${
          getPaymentCode(plot) === "RP"
            ? "bg-orange-600 text-white"
            : getPaymentCode(plot) === "PP"
              ? "bg-green-700 text-white"
              : getPaymentCode(plot) === "PC"
                ? "bg-blue-400 text-white"
                : "bg-gray-200 text-gray-600"
        }
      `}
                        >
                          {getPaymentCode(plot) ? (
                            <>
                              <span>{getPaymentCode(plot)}</span>
                              <ChevronDown size={12} />
                            </>
                          ) : (
                            <ChevronDown size={14} />
                          )}
                        </div>
                      </div>
                    </td>
                    <td className={stickyActionCell}>
                      <select
                        className="select select-sm bg-gray-100 border border-gray-300 w-[42px]"
                        defaultValue=""
                        onChange={(e) => {
                          const action = e.target.value;
                          e.target.value = "";

                          if (action === "edit") {
                            navigate(`/${landType}/plot-form`, {
                              state: { plot },
                            });
                          }

                          if (action === "delete") {
                            setDeleteConfirm(plot);
                          }
                        }}
                      >
                        <option value="" disabled>
                          Actions
                        </option>

                        <option
                          value="edit"
                          // disabled={!canEdit}
                          disabled={!canEdit}
                          className={`text-md text-gray-700 font-bold ${
                            !canEdit ? "!text-gray-400" : ""
                          }`}
                        >
                          ✏️ Edit
                        </option>

                        <option
                          value="delete"
                          disabled={!canDelete}
                          className={`text-md text-gray-700 font-bold ${
                            !canDelete ? "!text-gray-400" : ""
                          }`}
                        >
                          🗑 Delete
                        </option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div
            className="max-h-[400px] overflow-x-auto relative"
            style={{ scrollbarWidth: "thin" }}
          >
            <table className="table w-full">
              <thead className="bg-gray-200 text-gray-700 sticky top-0 z-10 whitespace-nowrap text-sm">
                <tr>
                  {FamilyDetails.map((col) => (
                    <FilterHeader
                      key={col.field}
                      label={col.label}
                      field={col.field}
                      options={getOptions(col.field)}
                      columnFilters={columnFilters}
                      updateFilter={updateFilter}
                      openFilterField={openFilterField}
                      setOpenFilterField={setOpenFilterField}
                      onSort={handleSort}
                      sortConfig={sortConfig}
                      className={col.stickyClass}
                    />
                  ))}

                  <th className={stickyActionHeader}>Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {paginatedPlots.map((plot, idx) => (
                  <tr key={plot.id || idx} className={rowClass}>
                    <td className="p-3 text-left bg-white md:sticky md:left-0 shadow-sm">
                      {(page - 1) * limit + idx + 1}
                    </td>
                    {/* <td className="p-3">{plot.project_name || "N/A"}</td> */}
                    <td className={stickyCol1Cell}>
                      {plot.la_case_file_no || "N/A"}
                    </td>
                    <td className={stickyCol2Cell}>{plot.khata_no || "N/A"}</td>
                    <td className={stickyCol3Cell}>{plot.plot_no || "N/A"}</td>
                    <td className="p-3">{plot.family_major_male ?? "N/A"}</td>
                    <td className="p-3">{plot.family_major_female ?? "N/A"}</td>
                    <td className="p-3">{plot.family_minor_male ?? "N/A"}</td>
                    <td className="p-3">{plot.family_minor_female ?? "N/A"}</td>
                    <td className="p-3">
                      {plot.family_major_transgender ?? "N/A"}
                    </td>
                    <td className="p-3">
                      {plot.family_minor_transgender ?? "N/A"}
                    </td>
                    <td className="p-3">
                      {plot.persons_with_disability ?? "N/A"}
                    </td>
                    <td className="p-3">
                      {plot.family_with_orphan_members === "Y"
                        ? "Yes"
                        : ("No" ?? "N/A")}
                    </td>
                    <td className={stickyPaymentCell}>
                      <div className="relative">
                        {/* Invisible select */}
                        <select
                          value={getPaymentCode(plot) || ""}
                          disabled={loadingPlotId === plot.id}
                          onChange={(e) =>
                            handlePaymentStatusChange(plot, e.target.value)
                          }
                          className="absolute inset-0 opacity-0 cursor-pointer shadow-md"
                        >
                          <option value="" disabled></option>
                          <option value="RP">Ready for Payment</option>
                          <option value="PP">Payment Processing</option>
                          <option value="RC">Payment Complete</option>
                        </select>

                        {/* Visible badge */}
                        <div
                          className={`w-[42px] h-[28px] px-1 flex items-center rounded text-xs font-semibold cursor-pointer shadow-md
        ${getPaymentCode(plot) ? "justify-between" : "justify-center"}
        ${
          getPaymentCode(plot) === "RP"
            ? "bg-orange-600 text-white"
            : getPaymentCode(plot) === "PP"
              ? "bg-green-700 text-white"
              : getPaymentCode(plot) === "PC"
                ? "bg-blue-400 text-white"
                : "bg-gray-200 text-gray-600"
        }
      `}
                        >
                          {getPaymentCode(plot) ? (
                            <>
                              <span>{getPaymentCode(plot)}</span>
                              <ChevronDown size={12} />
                            </>
                          ) : (
                            <ChevronDown size={14} />
                          )}
                        </div>
                      </div>
                    </td>
                    {/* <td className={stickyActionCell}>{ActionButtons(plot)}</td> */}
                    <td className={stickyActionCell}>
                      <select
                        className="select select-sm bg-gray-100 border border-gray-300 w-[42px]"
                        defaultValue=""
                        onChange={(e) => {
                          const action = e.target.value;
                          e.target.value = "";

                          if (action === "edit") {
                            navigate(`/${landType}/plot-form`, {
                              state: { plot },
                            });
                          }

                          if (action === "delete") {
                            setDeleteConfirm(plot);
                          }
                        }}
                      >
                        <option value="" disabled>
                          Actions
                        </option>

                        <option
                          value="edit"
                          // disabled={!canEdit}
                          disabled={!canEdit}
                          className={`text-md text-gray-700 font-bold ${
                            !canEdit ? "!text-gray-400" : ""
                          }`}
                        >
                          ✏️ Edit
                        </option>

                        <option
                          value="delete"
                          disabled={!canDelete}
                          className={`text-md text-gray-700 font-bold ${
                            !canDelete ? "!text-gray-400" : ""
                          }`}
                        >
                          🗑 Delete
                        </option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </PlotTabs>
      )}
      {selectedProject && filteredPlots.length > 0 && (
        <Pagination
          page={page}
          totalPages={clientTotalPages}
          setPage={setPage}
          limit={limit}
          setLimit={setLimit}
        />
      )}
      <SuccessMessage
        open={modal.open}
        type={modal.type}
        message={modal.message}
        onClose={closeModal}
      />
    </>
  );
};

export default PlotTable;

