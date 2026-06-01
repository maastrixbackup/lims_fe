import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronDown, Filter, X } from "lucide-react";
import moment from "moment";
import { useSelector } from "react-redux";
import { API_BASE_URL } from "../../../utils/config";
import PlotTabs from "./PlotTabs";
import FilterHeader from "./FilterHeader";
import {
  stickyActionCell,
  stickyActionHeader,
  stickyCol1Cell,
  stickyCol2Cell,
  stickyCol3Cell,
  stickyPaymentCell,
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

const DEFAULT_CELL_CLASS = "p-3";
const BASE_ROW_CLASS = "hover:bg-gray-50 transition";
const TABLE_WRAPPER_CLASS = "max-h-[400px] overflow-x-auto relative";
const TABLE_WRAPPER_STYLE = { scrollbarWidth: "thin" };
const PAYMENT_OPTIONS = [
  { value: "RP", label: "Ready for Payment" },
  { value: "PP", label: "Payment Processing" },
  { value: "RC", label: "Payment Complete" },
];

const baseRowCells = [
  {
    key: "serial",
    className: "p-3 text-left bg-white md:sticky md:left-0 shadow-sm",
    render: (_, index, page, limit) => (page - 1) * limit + index + 1,
  },
  {
    key: "la_case_file_no",
    className: stickyCol1Cell,
    render: (plot) => plot.la_case_file_no || "N/A",
  },
  {
    key: "khata_no",
    className: stickyCol2Cell,
    render: (plot) => plot.khata_no || "N/A",
  },
  {
    key: "plot_no",
    className: stickyCol3Cell,
    render: (plot) => plot.plot_no || "N/A",
  },
];

const paymentBadgeClassMap = {
  RP: "bg-orange-600 text-white",
  PP: "bg-green-700 text-white",
  PC: "bg-blue-400 text-white",
};

const formatYesNoValue = (value) => {
  if (value === null || value === undefined || value === "") return "N/A";
  const normalized = String(value).trim().toUpperCase();

  if (["Y", "YES", "1"].includes(normalized)) return "Yes";
  if (["N", "NO", "0"].includes(normalized)) return "No";

  return String(value);
};

const formatDisplacedAffectedValue = (value) => {
  if (value === "PAF") return "Person Affected Families";
  if (value === "PDF") return "Person Displaced Families";
  return value || "N/A";
};

const getCellValue = (plot, key, fallback = "N/A") => plot[key] ?? fallback;

const tableConfigs = [
  {
    key: "basic",
    columns: BasicDetails,
    rows: [
      { key: "full_part" },
      { key: "ses_survey_no" },
      { key: "date_of_award", render: (plot, _, __, ___, formatDate) => formatDate(plot.date_of_award) },
      { key: "name_of_recorded_tenant" },
      { key: "name_of_present_tenant" },
      { key: "present_tenant_count" },
      { key: "present_address" },
      {
        key: "displaced_affected_project",
        render: (plot) => formatDisplacedAffectedValue(plot.displaced_affected_project),
      },
      { key: "district" },
      { key: "village_name", className: `${DEFAULT_CELL_CLASS} whitespace-nowrap` },
      { key: "tahasil_name" },
      { key: "ri_circle_name" },
      { key: "thana_no" },
      { key: "kissam_of_land" },
      { key: "land_category" },
      { key: "lo13_remarks" },
    ],
    includePaymentCell: true,
    rowClassName: BASE_ROW_CLASS,
  },
  {
    key: "tenant",
    columns: TenantDetails,
    rows: [
      { key: "name_of_recorded_tenant" },
      { key: "name_of_present_tenant" },
      { key: "present_tenant_count" },
      { key: "present_address" },
      { key: "displaced_affected_project" },
    ],
    includePaymentCell: true,
    rowClassName: BASE_ROW_CLASS,
  },
  {
    key: "bank",
    columns: BANK_DETAILS_COLUMNS,
    rows: [
      { key: "bank_name" },
      { key: "bank_account_no" },
      { key: "branch_ifsc" },
      { key: "aadhaar_no" },
      { key: "pan_no" },
      { key: "age" },
      { key: "caste" },
      { key: "marital_status" },
      { key: "education" },
      { key: "occupation" },
      { key: "annual_income" },
      { key: "skill_acquired" },
      { key: "affidavit_details" },
    ],
    includePaymentCell: true,
    rowClassName: "hover:bg-gray-50 transition-colors",
  },
  {
    key: "legal",
    columns: LegalIssues,
    rows: [
      { key: "legal_heir_certificate_no" },
      { key: "land_case_no" },
      { key: "land_case_date", render: (plot, _, __, ___, formatDate) => formatDate(plot.land_case_date) },
      { key: "land_case_type" },
      { key: "land_case_status" },
      { key: "land_case_action" },
    ],
    includePaymentCell: true,
    rowClassName: BASE_ROW_CLASS,
  },
  {
    key: "land-valuation",
    columns: LAND_AREA_VALUATION_COLUMNS,
    rows: [
      { key: "land_area_total_acres" },
      { key: "land_area_total_hectares" },
      { key: "land_area_acquired_acres" },
      { key: "land_area_acquired_hectares" },
      { key: "market_value_per_acre" },
      { key: "basic_land_value" },
      { key: "land_value_with_mf" },
      { key: "no_of_trees" },
      { key: "total_value_of_trees" },
      { key: "no_of_house" },
      { key: "value_of_house" },
      { key: "details_of_other_structures" },
      { key: "value_of_other_structures" },
      { key: "total_value" },
      { key: "solatium_100", render: (plot) => plot.total_value || "N/A" },
      { key: "no_days_interest" },
      { key: "additional_12_percent" },
      { key: "total_compensation" },
      { key: "apportionment_amount" },
      { key: "priority_urgency" },
      { key: "land_use_plan" },
      { key: "la21_remarks" },
    ],
    includePaymentCell: true,
  },
  {
    key: "tribunal",
    columns: TribunalColumns,
    rows: [
      { key: "grievance_no" },
      { key: "grievance_date", render: (plot, _, __, ___, formatDate) => formatDate(plot.grievance_date) },
      { key: "grievance_subject" },
      { key: "grievance_status" },
      { key: "grievance_action" },
      { key: "tribunal", render: (plot) => formatYesNoValue(plot.tribunal) },
      { key: "tribunal_deposit_date", render: (plot, _, __, ___, formatDate) => formatDate(plot.tribunal_deposit_date) },
      { key: "tribunal_amount", fallback: "N/A" },
    ],
    includePaymentCell: true,
    rowClassName: BASE_ROW_CLASS,
  },
  {
    key: "family",
    columns: FamilyDetails,
    rows: [
      { key: "family_major_male", fallback: "N/A" },
      { key: "family_major_female", fallback: "N/A" },
      { key: "family_minor_male", fallback: "N/A" },
      { key: "family_minor_female", fallback: "N/A" },
      { key: "family_major_transgender", fallback: "0" },
      { key: "family_minor_transgender", fallback: "0" },
      { key: "persons_with_disability", fallback: "N/A" },
      {
        key: "family_with_orphan_members",
        render: (plot) => formatYesNoValue(plot.family_with_orphan_members),
      },
    ],
    includePaymentCell: true,
    rowClassName: "hover:bg-gray-50 transition-colors",
  },
];

const PlotTable = ({
  plots,
  page,
  setPage,
  limit,
  setLimit,
  setDeleteConfirm,
}) => {
  const navigate = useNavigate();
  const { landType } = useParams();
  const [selectedVillage, setSelectedVillage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [paymentStatusMap, setPaymentStatusMap] = useState({});
  const [loadingPlotId, setLoadingPlotId] = useState(null);
  const [columnFilters, setColumnFilters] = useState({});
  const [openFilterField, setOpenFilterField] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    field: null,
    direction: "asc",
  });
  const user = useSelector((state) => state.auth.user);
  const selectedProject = useSelector((state) => state.selectedProject.project);
  const token = useSelector((state) => state.auth.userToken);
  const role = user?.role_name;
  const isRestricted = role === "Viewer";
  const canEdit = role !== "Viewer";
  const canDelete = !(role === "Data Entry User" || role === "Viewer");
  const { modal, showSuccess, showError, closeModal } = useSuccessMessage();

  const updateFilter = useCallback((field, value) => {
    setColumnFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const handleSort = useCallback((field) => {
    setSortConfig((prev) => {
      if (prev.field !== field) {
        return { field, direction: "asc" };
      }
      if (prev.direction === "asc") {
        return { field, direction: "desc" };
      }
      return { field: null, direction: "asc" };
    });
  }, []);

  const getPaymentCode = useCallback(
    (plot) => {
      if (paymentStatusMap[plot.id]) {
        return paymentStatusMap[plot.id];
      }

      if (plot.payment_status === "processing") return "PP";
      if (plot.payment_status === "complete") return "PC";
      if (plot.payment_status === "ready") return "RP";

      return "";
    },
    [paymentStatusMap],
  );

  const extractApiErrorMessage = useCallback(
    (message, fallback = "Network error") => {
      const raw = String(message || "").trim();
      if (!raw) return fallback;

      try {
        const parsed = JSON.parse(raw);
        return parsed?.message || raw;
      } catch {
        return raw;
      }
    },
    [],
  );

  const isSuccessResponse = useCallback(
    (data) =>
      data?.success === true ||
      String(data?.success || "").toLowerCase() === "true" ||
      data?.status === 200,
    [],
  );

  const sortedPlots = useMemo(() => {
    if (!plots?.length) return [];
    return [...plots].sort((a, b) => (a.id || 0) - (b.id || 0));
  }, [plots]);

  const projectFilteredPlots = useMemo(() => {
    if (!selectedProject) return sortedPlots;

    return sortedPlots
      .filter(
        (plot) =>
          plot.project_id === selectedProject.id ||
          plot.project_name === selectedProject.project_name,
      )
      .map((plot) => {
        const total =
          (Number(plot.land_value_with_mf) || 0) +
          (Number(plot.total_value_of_trees) || 0) +
          (Number(plot.value_of_house) || 0) +
          (Number(plot.value_of_other_structures) || 0);

        return {
          ...plot,
          total_value: total,
          total_compensation:
            total + total + (Number(plot.additional_12_percent) || 0),
        };
      });
  }, [selectedProject, sortedPlots]);

  const villageOptions = useMemo(
    () => [...new Set(projectFilteredPlots.map((plot) => plot.village_name).filter(Boolean))],
    [projectFilteredPlots],
  );

  const getOptions = useCallback(
    (field) => [
      ...new Set(projectFilteredPlots.map((plot) => plot[field]).filter(Boolean)),
    ],
    [projectFilteredPlots],
  );

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

      const numericValue = Number(normalized);
      return Number.isFinite(numericValue) ? numericValue : null;
    };

    const naturalCompare = (firstValue, secondValue) => {
      const firstParts = firstValue.match(/(\d+|\D+)/g) || [firstValue];
      const secondParts = secondValue.match(/(\d+|\D+)/g) || [secondValue];
      const maxLength = Math.max(firstParts.length, secondParts.length);

      for (let index = 0; index < maxLength; index += 1) {
        const firstPart = firstParts[index];
        const secondPart = secondParts[index];

        if (firstPart === undefined) return -1;
        if (secondPart === undefined) return 1;

        const firstIsNumeric = /^\d+$/.test(firstPart);
        const secondIsNumeric = /^\d+$/.test(secondPart);

        if (firstIsNumeric && secondIsNumeric) {
          const difference = Number(firstPart) - Number(secondPart);
          if (difference !== 0) return difference;
          continue;
        }

        const partComparison = collator.compare(firstPart, secondPart);
        if (partComparison !== 0) return partComparison;
      }

      return 0;
    };

    const compareValues = (firstValue, secondValue, direction) => {
      if (firstValue == null && secondValue == null) return 0;
      if (firstValue == null) return 1;
      if (secondValue == null) return -1;

      const firstNumber = parseNumericValue(firstValue);
      const secondNumber = parseNumericValue(secondValue);

      if (firstNumber !== null && secondNumber !== null) {
        return direction === "asc"
          ? firstNumber - secondNumber
          : secondNumber - firstNumber;
      }

      const result = naturalCompare(
        String(firstValue).trim(),
        String(secondValue).trim(),
      );

      return direction === "asc" ? result : -result;
    };

    const data = projectFilteredPlots.filter((plot) => {
      const searchText = Object.values(plot)
        .map((value) => {
          if (value === null || value === undefined) return "";
          if (typeof value === "object") return JSON.stringify(value);
          return String(value);
        })
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !searchQuery || searchText.includes(searchQuery.toLowerCase());
      const matchesColumnFilters = Object.entries(columnFilters).every(
        ([field, value]) => !value || plot[field] === value,
      );
      const matchesVillage =
        !selectedVillage || plot.village_name === selectedVillage;

      return matchesSearch && matchesColumnFilters && matchesVillage;
    });

    if (sortConfig.field) {
      data.sort((firstPlot, secondPlot) =>
        compareValues(
          firstPlot[sortConfig.field],
          secondPlot[sortConfig.field],
          sortConfig.direction,
        ),
      );
    }

    return data;
  }, [columnFilters, projectFilteredPlots, searchQuery, selectedVillage, sortConfig]);

  const clientTotalPages = Math.max(1, Math.ceil(filteredPlots.length / limit));
  const paginatedPlots = filteredPlots.slice((page - 1) * limit, page * limit);
  const isAnyFilterApplied =
    searchQuery || Object.values(columnFilters).some(Boolean);
  const noData = isAnyFilterApplied && filteredPlots.length === 0;

  useEffect(() => {
    if (page > clientTotalPages) {
      setPage?.(clientTotalPages);
    }
  }, [clientTotalPages, page, setPage]);

  const resetFilters = useCallback(() => {
    setSearchQuery("");
    setColumnFilters({});
    setSortConfig({ field: null, direction: "asc" });
  }, []);

  const formatDate = useCallback((date) => {
    if (!date) return "N/A";
    const parsedDate = moment(date);
    return parsedDate.isValid() ? parsedDate.format("DD-MM-YYYY") : "N/A";
  }, []);

  const handleActionChange = useCallback(
    (plot, action) => {
      if (action === "edit") {
        navigate(`/${landType}/plot-form`, { state: { plot } });
      }

      if (action === "delete") {
        setDeleteConfirm(plot);
      }
    },
    [landType, navigate, setDeleteConfirm],
  );

  const handlePaymentStatusChange = useCallback(
    async (plot, code) => {
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
        const response = await fetch(`${API_BASE_URL}/plots/paymentReady`, {
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

        const data = await response.json();
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
            navigate(`/${landType}/land-cost`, {
              state: { plot: updatedPlot },
            });
          }, 300);
        }
      } catch (error) {
        const message = extractApiErrorMessage(
          error?.message,
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
    },
    [
      closeModal,
      extractApiErrorMessage,
      getPaymentCode,
      isRestricted,
      isSuccessResponse,
      landType,
      navigate,
      showError,
      showSuccess,
      token,
    ],
  );

  const renderPaymentCell = useCallback(
    (plot) => {
      const paymentCode = getPaymentCode(plot);

      return (
        <td className={stickyPaymentCell}>
          <div className="relative">
            <select
              value={paymentCode || ""}
              disabled={loadingPlotId === plot.id}
              onChange={(event) =>
                handlePaymentStatusChange(plot, event.target.value)
              }
              className="absolute inset-0 opacity-0 cursor-pointer shadow-md"
            >
              <option value="" disabled></option>
              {PAYMENT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <div
              className={`w-[42px] h-[28px] px-1 flex items-center rounded text-xs font-semibold cursor-pointer shadow-md ${
                paymentCode ? "justify-between" : "justify-center"
              } ${paymentBadgeClassMap[paymentCode] || "bg-gray-200 text-gray-600"}`}
            >
              {paymentCode ? (
                <>
                  <span>{paymentCode}</span>
                  <ChevronDown size={12} />
                </>
              ) : (
                <ChevronDown size={14} />
              )}
            </div>
          </div>
        </td>
      );
    },
    [getPaymentCode, handlePaymentStatusChange, loadingPlotId],
  );

  const renderActionCell = useCallback(
    (plot) => (
      <td className={stickyActionCell}>
        <select
          className="select select-sm bg-gray-100 border border-gray-300 w-[42px]"
          defaultValue=""
          onChange={(event) => {
            const { value } = event.target;
            event.target.value = "";
            handleActionChange(plot, value);
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
    ),
    [canDelete, canEdit, handleActionChange],
  );

  const renderConfigCell = useCallback(
    (plot, index, cell) => {
      const value = cell.render
        ? cell.render(plot, index, page, limit, formatDate)
        : getCellValue(plot, cell.key, cell.fallback);

      return (
        <td key={cell.key} className={cell.className || DEFAULT_CELL_CLASS}>
          {value}
        </td>
      );
    },
    [formatDate, limit, page],
  );

  const renderTable = useCallback(
    ({ key, columns, rows, includePaymentCell, rowClassName = "" }) => (
      <div key={key} className={TABLE_WRAPPER_CLASS} style={TABLE_WRAPPER_STYLE}>
        <table className="table w-full">
          <thead className="bg-gray-200 text-gray-700 sticky top-0 z-10 whitespace-nowrap text-sm">
            <tr>
              {columns.map((column) => (
                <FilterHeader
                  key={column.field}
                  label={column.label}
                  field={column.field}
                  options={getOptions(column.field)}
                  columnFilters={columnFilters}
                  updateFilter={updateFilter}
                  openFilterField={openFilterField}
                  setOpenFilterField={setOpenFilterField}
                  onSort={handleSort}
                  sortConfig={sortConfig}
                  className={column.stickyClass}
                />
              ))}
              <th className={stickyActionHeader}>Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 text-xs">
            {paginatedPlots.map((plot, index) => (
              <tr key={plot.id || index} className={rowClassName}>
                {baseRowCells.map((cell) =>
                  renderConfigCell(plot, index, cell),
                )}
                {rows.map((cell) => renderConfigCell(plot, index, cell))}
                {includePaymentCell && renderPaymentCell(plot)}
                {renderActionCell(plot)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ),
    [
      columnFilters,
      getOptions,
      handleSort,
      openFilterField,
      paginatedPlots,
      renderActionCell,
      renderConfigCell,
      renderPaymentCell,
      sortConfig,
      updateFilter,
    ],
  );

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
              className="select select-sm w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-400 text-gray-700"
              value={selectedVillage}
              onChange={(event) => setSelectedVillage(event.target.value)}
            >
              <option value="">All Villages</option>
              {villageOptions.map((village) => (
                <option key={village} value={village}>
                  {village}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col w-64 lg:w-80 shrink-0">
            <label className="text-xs font-medium text-gray-600 mb-1">
              Search
            </label>
            <div className="flex items-center w-full rounded-lg border border-gray-300 bg-white shadow-sm focus-within:ring-2 focus-within:ring-indigo-400">
              <input
                type="text"
                placeholder="Search tenant, plot, khata..."
                className="w-full px-3 py-2 text-sm rounded-l-lg focus:outline-none"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
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

          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-100 text-sm font-medium text-indigo-700 shadow-inner shrink-0">
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
        <div className="card bg-white py-10 text-center text-gray-600">
          {selectedProject ? (
            <>
              <p className="text-md font-medium text-red-500">
                No data found for the{" "}
                <span className="text-primary font-bold">Selected Project.</span>
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
        <PlotTabs>{tableConfigs.map(renderTable)}</PlotTabs>
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
