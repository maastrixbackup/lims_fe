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
import SuccessMessage from "../../../shared/SuccessMessage";
import { useSuccessMessage } from "../../../hooks/useSuccessMessage";
// import { useLandTypeParam } from "../../../utils/landtypes";

const PlotTable = ({ plots, setDeleteConfirm }) => {
  const { landType } = useParams();
  // console.log("landType***************", landType);
  // const typeParam = useLandTypeParam();
  // Filter States
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
  // console.log("tokennnn", token);
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

  const handlePaymentStatusChange = async (plot, code) => {
    if (isRestricted) return;
    if (code === "RP") {
      setLoadingPlotId(plot.id);

      try {
        const res = await fetch(`${API_BASE_URL}/plots/paymentReady`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            plot_id: plot.id,
            payment_status: "ready",
          }),
        });

        const data = await res.json();

        if (data.success === true) {
          showSuccess(data.message || "Successful");

          setPaymentStatusMap((prev) => ({
            ...prev,
            [plot.id]: "RP",
          }));
        } else if (data.success === false) {
          showSuccess(data.message || "Failed to update status", "error");
        } else {
          showSuccess(data.message || "Failed to update status", "error");
        }
      } catch (err) {
        showError("Network error", "error");
      }

      setLoadingPlotId(null);
      return;
    }

    if (code === "RC") {
      navigate(`/${landType}/land-cost`, { state: { plot } });
      return;
    }

    if (code === "PP") {
      setLoadingPlotId(plot.id);

      try {
        const res = await fetch(`${API_BASE_URL}/plots/paymentReady`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            plot_id: plot.id,
            payment_status: "processing",
          }),
        });

        const data = await res.json();
        if (showSuccess(data.message || "Successful")) {
          setPaymentStatusMap((prev) => ({
            ...prev,
            [plot.id]: "PP",
          }));
        }

        showSuccess(data.message || "Failed to update payment", "error");
        setTimeout(() => {
          closeModal();
          navigate(`/${landType}/land-cost`, { state: { plot } });
        }, 400);
      } catch (err) {
        showSuccess(err.message || "Network error. Please try again", "error");
      } finally {
        setLoadingPlotId(null);
      }
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
    let data = projectFilteredPlots.filter((plot) => {
      const searchMatch =
        !searchQuery ||
        Object.values(plot)
          .join(" ")
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

      const columnMatch = Object.entries(columnFilters).every(
        ([field, value]) => !value || plot[field] === value,
      );

      return searchMatch && columnMatch;
    });

    if (sortConfig.field) {
      data.sort((a, b) => {
        const aVal = a[sortConfig.field];
        const bVal = b[sortConfig.field];

        if (aVal == null) return 1;
        if (bVal == null) return -1;

        if (typeof aVal === "number") {
          return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal;
        }

        return sortConfig.direction === "asc"
          ? String(aVal).localeCompare(String(bVal))
          : String(bVal).localeCompare(String(aVal));
      });
    }

    return data;
  }, [projectFilteredPlots, searchQuery, columnFilters, sortConfig]);

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
      <div className="rounded-xl bg-white p-4 mb-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row flex-wrap gap-4 w-full min-w-0">
            {/* Village */}
            <div className="flex flex-col w-full sm:w-48">
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

            {/* Search */}
            <div className="flex flex-col w-full sm:flex-1 min-w-0">
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
          </div>

          {/* Results Count */}
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-lg
      bg-indigo-100 text-sm font-medium text-indigo-700 shadow-inner
      w-fit self-start lg:self-auto"
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
      {/* </div> */}
      {selectedProject && filteredPlots.length > 0 && (
        <PlotTabs>
          <div
            className="max-h-[400px] overflow-x-auto relative"
            style={{ scrollbarWidth: "thin" }}
          >
            <table className="table w-full">
              <thead className="bg-gray-200 text-gray-700 sticky top-0 z-10 text-sm">
                <tr>
                  <th className="p-3 text-left bg-gray-200 md:sticky md:left-0 z-[30] shadow-md">
                    Sl/No
                  </th>

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
                    />
                  ))}

                  <th className="p-3 text-left">LO13 Remarks</th>
                  <th className={stickyPaymentHeader}>Payment Status</th>
                  <th className={stickyActionHeader}>Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 text-xs">
                {filteredPlots.map((plot, idx) => (
                  <tr
                    key={plot.id || idx}
                    className="hover:bg-gray-50 transition"
                  >
                    <td className="p-3 text-left bg-white md:sticky md:left-0 shadow-sm">
                      {idx + 1}
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
                          className="absolute inset-0 opacity-0 cursor-pointer shadow-md"
                        >
                          <option value="" disabled></option>
                          <option value="RP">Ready for Payment</option>
                          <option value="PP">Payment Processing</option>
                          <option value="RC">Payment Complete</option>
                        </select>
                        <div
                          className={`w-[42px] h-[28px] px-1 flex items-center rounded text-xs font-semibold cursor-pointer shadow-md
        ${getPaymentCode(plot) ? "justify-between" : "justify-center"}
        ${
          getPaymentCode(plot) === "RP"
            ? "bg-orange-600 text-white"
            : getPaymentCode(plot) === "PP"
              ? "bg-green-700 text-white"
              : getPaymentCode(plot) === "RC"
                ? "bg-blue-600 text-white"
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
                  <th className="p-3 text-left bg-gray-200 md:sticky md:left-0 z-[30] shadow-md">
                    Sl/No
                  </th>
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
                      className={col.headerClass}
                    />
                  ))}
                  <th className="p-3 text-left">Displaced/Affected</th>
                  <th className={stickyPaymentHeader}>Payment Status</th>
                  <th className={stickyActionHeader}>Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 text-xs whitespace-nowrap">
                {filteredPlots.map((plot, idx) => (
                  <tr
                    key={plot.id || idx}
                    className="hover:bg-gray-50 transition"
                  >
                    <td className="p-3 text-left bg-white md:sticky md:left-0 shadow-sm">
                      {idx + 1}
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
              : getPaymentCode(plot) === "RC"
                ? "bg-blue-600 text-white"
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
                  <th className="p-3 text-left bg-gray-200 text-gray-700 md:sticky md:left-0 z-[30] shadow-md">
                    Sl/No
                  </th>
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
                      className={col.headerClass}
                    />
                  ))}
                  <th className={stickyPaymentHeader}>Payment Status</th>
                  <th className={stickyActionHeader}>Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {filteredPlots.map((plot, idx) => (
                  <tr key={plot.id || idx} className={rowClass}>
                    <td className="p-3 text-left bg-white md:sticky md:left-0 shadow-sm">
                      {idx + 1}
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
              : getPaymentCode(plot) === "RC"
                ? "bg-blue-600 text-white"
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
                  <th className="p-3 text-left bg-gray-200 text-gray-700 md:sticky md:left-0 z-[30] shadow-md">
                    Sl/No
                  </th>
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
                      className={col.headerClass}
                    />
                  ))}

                  <th className={stickyPaymentHeader}>Payment Status</th>
                  <th className={stickyActionHeader}>Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 text-xs">
                {filteredPlots.map((plot, idx) => (
                  <tr
                    key={plot.id || idx}
                    className="hover:bg-gray-50 transition"
                  >
                    <td className="p-3 text-left bg-white md:sticky md:left-0 shadow-sm">
                      {idx + 1}
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
              : getPaymentCode(plot) === "RC"
                ? "bg-blue-600 text-white"
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
                  <th className="p-3 text-left bg-gray-200 text-gray-700 md:sticky md:left-0 z-[30] shadow-md">
                    Sl/No
                  </th>
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
                      className={col.headerClass}
                    />
                  ))}
                  <th className={stickyPaymentHeader}>Payment Status</th>
                  <th className={stickyActionHeader}>Actions</th>
                </tr>
              </thead>

              <tbody className="text-xs">
                {filteredPlots.map((plot, idx) => (
                  <tr key={plot.id || idx} className="">
                    <td className="p-3 text-left bg-white md:sticky md:left-0 shadow-sm">
                      {idx + 1}
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
              : getPaymentCode(plot) === "RC"
                ? "bg-blue-600 text-white"
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
                  <th className="p-3 text-left bg-gray-200 text-gray-700 md:sticky md:left-0 z-[30] shadow-md">
                    Sl/No
                  </th>
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
                      className={col.headerClass}
                    />
                  ))}
                  <th className={stickyPaymentHeader}>Payment Status</th>
                  <th className={stickyActionHeader}>Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 text-xs ">
                {filteredPlots.map((plot, idx) => (
                  <tr
                    key={plot.id || idx}
                    className="hover:bg-gray-50 transition"
                  >
                    <td className="p-3 text-left bg-white md:sticky md:left-0 shadow-sm">
                      {idx + 1}
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
              : getPaymentCode(plot) === "RC"
                ? "bg-blue-600 text-white"
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
                  <th className="p-3 text-left bg-gray-200 text-gray-700 md:sticky md:left-0 z-[30] shadow-md">
                    Sl/No
                  </th>
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
                      className={col.headerClass}
                    />
                  ))}
                  <th className={stickyPaymentHeader}>Payment Status</th>
                  <th className={stickyActionHeader}>Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {filteredPlots.map((plot, idx) => (
                  <tr key={plot.id || idx} className={rowClass}>
                    <td className="p-3 text-left bg-white md:sticky md:left-0 shadow-sm">
                      {idx + 1}
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
              : getPaymentCode(plot) === "RC"
                ? "bg-blue-600 text-white"
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
