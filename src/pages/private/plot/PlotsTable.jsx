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
  showToast,
} from "../../../utils/constants";
import ResetFilters from "../../../shared/ResetFilters";
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
    if (paymentStatusMap[plot.id]) return paymentStatusMap[plot.id];

    if (plot.payment_status === "processing") return "PP";
    if (plot.payment_status === "complete") return "RC";

    return "RP";
  };

  // const handlePaymentReady = async (plot) => {
  //   if (isRestricted) return;

  //   setLoadingPlotId(plot.id);

  //   try {
  //     const response = await fetch(`${API_BASE_URL}/plots/paymentReady`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //       body: JSON.stringify({ plot_id: plot.id }),
  //     });

  //     const data = await response.json();

  //     if (data.success) {
  //       window.toast?.success(data.message || "Payment processed successfully");

  //       // Update local status map
  //       setPaymentStatusMap((prev) => ({
  //         ...prev,
  //         [plot.id]: "success",
  //       }));
  //       navigate(`/${landType}/land-cost`, { state: { plot } });

  //       // setTimeout(() => refreshPlots && refreshPlots(), 1000);
  //     } else {
  //       window.toast?.error(data.message || "Payment request failed");
  //     }
  //   } catch (error) {
  //     console.error("Payment API error:", error);
  //     window.toast?.error("Network error, please try again");
  //   }

  //   setLoadingPlotId(null);
  // };
  const handlePaymentStatusChange = async (plot, code) => {
    if (isRestricted) return;

    // RP → do nothing
    if (code === "RP") return;

    // RC → redirect only
    if (code === "RC") {
      navigate(`/${landType}/land-cost`, { state: { plot } });
      return;
    }

    // PP → call API
    if (code === "PP") {
      setLoadingPlotId(plot.id);

      try {
        const response = await fetch(`${API_BASE_URL}/plots/paymentReady`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ plot_id: plot.id }),
        });

        const data = await response.json();

        if (data.success) {
          showToast("Payment moved to processing", "primary");

          setPaymentStatusMap((prev) => ({
            ...prev,
            [plot.id]: "PP",
          }));

          navigate(`/${landType}/land-cost`, { state: { plot } });
        } else {
          window.toast?.error(data.message);
        }
      } catch (err) {
        window.toast?.error("Network error");
      }

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
        plot.project_name === selectedProject.project_name
    );
  }, [sortedPlots, selectedProject]);

  const villageOptions = useMemo(() => {
    const uniqueVillages = new Set(
      projectFilteredPlots.map((p) => p.village_name).filter(Boolean)
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
        ([field, value]) => !value || plot[field] === value
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

  const TableWrapper = ({ title, children }) => (
    <div className="space-y-2">
      <h2 className="font-semibold text-gray-800 bg-gray-100 px-4 py-2 shadow-sm">
        {title}
      </h2>
      <div
        className="overflow-x-auto max-h-[400px] overflow-y-auto shadow-md bg-white"
        style={{ scrollbarWidth: "thin" }}
      >
        <table className="min-w-full relative table-fixed whitespace-nowrap">
          {children}
        </table>
      </div>
    </div>
  );

  const rowClass = "hover:bg-gray-50 transition-colors";
  if (noData) {
    return <ResetFilters onClick={resetFilters} />;
  }

  return (
    <div className="">
      <div className="rounded-xl bg-white p-4 mb-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          {/* Filters */}
          <div className="flex flex-wrap gap-4 w-full">
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

            {/* Khata */}
            {/* <div className="flex flex-col w-full sm:w-48">
              <label className="text-xs font-medium text-gray-600 mb-1">
                Khata No.
              </label>
              <select
                className="select select-sm w-full rounded-lg border-gray-300
            focus:border-indigo-500 focus:ring-indigo-400 text-gray-700"
                value={selectedKhata}
                onChange={(e) => setSelectedKhata(e.target.value)}
              >
                <option value="">All Khata Numbers</option>
                {khataOptions.map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </select>
            </div> */}

            {/* Search */}
            <div className="flex flex-col w-20 sm:flex-1 min-w-[20px]">
              <label className="text-xs font-medium text-gray-600 mb-1">
                Search
              </label>
              <div
                className="flex items-center rounded-lg border border-gray-300 bg-white
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
      bg-indigo-100 text-sm font-medium text-indigo-700 shadow-inner w-fit"
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
          <TableWrapper title="Basic Details">
            <thead className="bg-gray-200 text-gray-700 sticky top-0 z-10 whitespace-nowrap text-sm">
              <tr>
                 <td className="p-3 text-left bg-gray-200 text-gray-700 md:sticky md:left-0 z-[30] shadow-md">Sl/No</td>

                <FilterHeader
                  label="LA Case File No"
                  field="la_case_file_no"
                  options={getOptions("la_case_file_no")}
                  columnFilters={columnFilters}
                  updateFilter={updateFilter}
                  openFilterField={openFilterField}
                  setOpenFilterField={setOpenFilterField}
                  className={stickyCol1Header}
                  onSort={handleSort}
                  sortConfig={sortConfig}
                />

                <FilterHeader
                  label="Khata"
                  field="khata_no"
                  options={getOptions("khata_no")}
                  columnFilters={columnFilters}
                  updateFilter={updateFilter}
                  openFilterField={openFilterField}
                  setOpenFilterField={setOpenFilterField}
                  onSort={handleSort}
                  sortConfig={sortConfig}
                  className={stickyCol2Header}
                />

                <FilterHeader
                  label="Plot No"
                  field="plot_no"
                  options={getOptions("plot_no")}
                  columnFilters={columnFilters}
                  updateFilter={updateFilter}
                  openFilterField={openFilterField}
                  setOpenFilterField={setOpenFilterField}
                  onSort={handleSort}
                  sortConfig={sortConfig}
                  className={stickyCol3Header}
                />

                <th className="p-3 text-left">Full/Part Plot</th>
                <th className="p-3 text-left">SES Survey No</th>
                <th className="p-3 text-left">Date of Award</th>
                <th className="p-3 text-left">Recorded Tenant</th>

                <th className="p-3 text-left">Name of Present Tenant</th>
                <th className="p-3 text-left">Number Of Present Tenant</th>
                <th className="p-3 text-left">Present Address</th>
                <th className="p-3 text-left">Displaced/Affected</th>

                <th className="p-3 text-left">Village Name</th>

                <th className="p-3 text-left">Tahasil</th>
                <th className="p-3 text-left">RI Circle</th>
                <th className="p-3 text-left">Thana No</th>
                <th className="p-3 text-left">Total Area (Acre)</th>
                <th className="p-3 text-left">Total Area (Hectare)</th>
                <th className="p-3 text-left">Acquired Area (Acre)</th>
                <th className="p-3 text-left">Acquired Area (Hectare)</th>
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
                  <td className="p-3 text-left bg-white md:sticky md:left-0 shadow-sm">{idx + 1}</td>
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
                    {plot.number_of_present_tenant || "N/A"}
                  </td>
                  <td className="p-3">{plot.present_address || "N/A"}</td>
                  <td className="p-3">
                    {plot.displaced_affected_person || "N/A"}
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    {plot.village_name || "N/A"}
                  </td>
                  <td className="p-3">{plot.tahasil_name || "N/A"}</td>
                  <td className="p-3">{plot.ri_circle_name || "N/A"}</td>
                  <td className="p-3">{plot.thana_no || "N/A"}</td>
                  <td className="p-3">{plot.land_area_total_acres || "N/A"}</td>
                  <td className="p-3">
                    {plot.land_area_total_hectares || "N/A"}
                  </td>
                  <td className="p-3">
                    {plot.land_area_acquired_acres || "N/A"}
                  </td>
                  <td className="p-3">
                    {plot.land_area_acquired_hectares || "N/A"}
                  </td>
                  <td className={stickyPaymentCell}>
                    <div
                      className={`dropdown dropdown-left ${
                        isRestricted ? "opacity-60 pointer-events-none" : ""
                      }`}
                    >
                      {/* Trigger Button */}
                      
                      <label
                        tabIndex={0}
                        className={`btn btn-sm w-[60px] font-bold justify-center flex items-center
        ${
          getPaymentCode(plot) === "RP"
            ? "bg-orange-600 text-white"
            : getPaymentCode(plot) === "PP"
            ? "bg-green-700 text-white"
            : "bg-green-600 text-white"
        }
      `}
                      >
                        
                        {getPaymentCode(plot)}
                        {/* {loadingPlotId === plot.id && (
                          <span className="ml-1 loading loading-spinner loading-xs"></span>
                        )} */}
                       <ChevronDown size={16} strokeWidth={5} />
                      </label>

                      {/* Dropdown Menu */}
                      {!isRestricted && loadingPlotId !== plot.id && (
                        <ul
                          tabIndex={0}
                          className="dropdown-content z-[50] menu p-1 shadow-xl bg-green-50 rounded-box w-44 text-sm font-semibold"
                        >
                          <li>
                            <button
                              onClick={() =>
                                handlePaymentStatusChange(plot, "RP")
                              }
                              className="justify-start"
                            >
                              Ready for Payment
                            </button>
                          </li>

                          <li>
                            <button
                              onClick={() =>
                                handlePaymentStatusChange(plot, "PP")
                              }
                              className="justify-start"
                            >
                              Payment Processing
                            </button>
                          </li>

                          <li>
                            <button
                              onClick={() =>
                                handlePaymentStatusChange(plot, "RC")
                              }
                              className="justify-start"
                            >
                              Payment Complete
                            </button>
                          </li>
                        </ul>
                      )}
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
          </TableWrapper>
          <TableWrapper title="Tenant Information">
            <thead className="bg-gray-200 text-gray-700 sticky top-0 z-10 whitespace-nowrap text-sm">
              <tr>
                <th className="p-3 text-left">#</th>

                <FilterHeader
                  label="LA Case File No"
                  field="la_case_file_no"
                  options={getOptions("la_case_file_no")}
                  columnFilters={columnFilters}
                  updateFilter={updateFilter}
                  openFilterField={openFilterField}
                  setOpenFilterField={setOpenFilterField}
                  className={stickyCol1Header}
                  onSort={handleSort}
                  sortConfig={sortConfig}
                />

                <FilterHeader
                  label="Khata"
                  field="khata_no"
                  options={getOptions("khata_no")}
                  columnFilters={columnFilters}
                  updateFilter={updateFilter}
                  openFilterField={openFilterField}
                  setOpenFilterField={setOpenFilterField}
                  onSort={handleSort}
                  sortConfig={sortConfig}
                  className={stickyCol2Header}
                />

                <FilterHeader
                  label="Plot No"
                  field="plot_no"
                  options={getOptions("plot_no")}
                  columnFilters={columnFilters}
                  updateFilter={updateFilter}
                  openFilterField={openFilterField}
                  setOpenFilterField={setOpenFilterField}
                  onSort={handleSort}
                  sortConfig={sortConfig}
                  className={stickyCol3Header}
                />
                <th className="p-3 text-left">Recorded Tenant</th>
                {/* <th className="p-3 text-left">Present Tenant</th> */}
                <FilterHeader
                  label="Present Tenant"
                  field="name_of_present_tenant"
                  options={getOptions("name_of_present_tenant")}
                  columnFilters={columnFilters}
                  updateFilter={updateFilter}
                  openFilterField={openFilterField}
                  setOpenFilterField={setOpenFilterField}
                  onSort={handleSort}
                  sortConfig={sortConfig}
                />
                <th className="p-3 text-left">Number Of Present Tenant</th>
                <th className="p-3 text-left">Present Address</th>
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
                  <td className="p-3">{idx + 1}</td>
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
                    {plot.number_of_present_tenant || "N/A"}
                  </td>
                  <td className="p-3">{plot.present_address || "N/A"}</td>
                  <td className="p-3">
                    {plot.displaced_affected_person || "N/A"}
                  </td>
                  <td className={stickyPaymentCell}>
                    <div className="relative group inline-block">
                      <button
                        className={`btn btn-sm text-white flex items-center gap-1 ${
                          isRestricted || loadingPlotId === plot.id
                            ? "!bg-gray-300 !text-gray-400 !border !border-gray-300 !cursor-not-allowed"
                            : paymentStatusMap[plot.id] === "success"
                            ? "bg-green-400 hover:bg-green-700"
                            : plot.payment_status === null
                            ? "bg-orange-600 hover:bg-orange-700"
                            : "bg-green-600 hover:bg-green-700"
                        }`}
                        onClick={() => handlePaymentReady(plot)}
                        disabled={
                          isRestricted ||
                          loadingPlotId === plot.id ||
                          paymentStatusMap[plot.id] === "success"
                        }
                      >
                        {loadingPlotId === plot.id ? (
                          <span className="loading loading-spinner loading-xs"></span>
                        ) : paymentStatusMap[plot.id] === "success" ? (
                          "RC"
                        ) : plot.payment_status === null ? (
                          "RP"
                        ) : (
                          "PP"
                        )}
                      </button>

                      {/* Tooltip */}
                      <span
                        className="absolute -translate-x-1/2 -top-5
      opacity-0 group-hover:opacity-100 transition
      bg-white text-gray-700 text-xs font-bold rounded px-2 py-1 whitespace-nowrap z-50"
                      >
                        {loadingPlotId === plot.id
                          ? "Processing Payment"
                          : paymentStatusMap[plot.id] === "success"
                          ? "Payment Completed"
                          : plot.payment_status === null
                          ? "Ready For Payment"
                          : "Payment in Processing"}
                      </span>
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
          </TableWrapper>
          <TableWrapper title="Bank & Personal Details">
            <thead className="bg-gray-200 text-gray-700 sticky top-0 z-10 whitespace-nowrap text-sm">
              <tr>
                <th className="p-3 text-left">SL/No</th>
                {/* <th className="p-3 text-left">Project Name</th> */}
                <FilterHeader
                  label="LA Case File No"
                  field="la_case_file_no"
                  options={getOptions("la_case_file_no")}
                  columnFilters={columnFilters}
                  updateFilter={updateFilter}
                  openFilterField={openFilterField}
                  setOpenFilterField={setOpenFilterField}
                  className={stickyCol1Header}
                  onSort={handleSort}
                  sortConfig={sortConfig}
                />

                <FilterHeader
                  label="Khata"
                  field="khata_no"
                  options={getOptions("khata_no")}
                  columnFilters={columnFilters}
                  updateFilter={updateFilter}
                  openFilterField={openFilterField}
                  setOpenFilterField={setOpenFilterField}
                  onSort={handleSort}
                  sortConfig={sortConfig}
                  className={stickyCol2Header}
                />

                <FilterHeader
                  label="Plot No"
                  field="plot_no"
                  options={getOptions("plot_no")}
                  columnFilters={columnFilters}
                  updateFilter={updateFilter}
                  openFilterField={openFilterField}
                  setOpenFilterField={setOpenFilterField}
                  onSort={handleSort}
                  sortConfig={sortConfig}
                  className={stickyCol3Header}
                />

                <FilterHeader
                  label="Bank"
                  field="bank_name"
                  options={getOptions("bank_name")}
                  columnFilters={columnFilters}
                  updateFilter={updateFilter}
                  openFilterField={openFilterField}
                  setOpenFilterField={setOpenFilterField}
                  onSort={handleSort}
                  sortConfig={sortConfig}
                />
                <th className="p-3 text-left">Account No</th>
                <FilterHeader
                  label="IFSC Code"
                  field="branch_ifsc"
                  options={getOptions("branch_ifsc")}
                  columnFilters={columnFilters}
                  updateFilter={updateFilter}
                  openFilterField={openFilterField}
                  setOpenFilterField={setOpenFilterField}
                  onSort={handleSort}
                  sortConfig={sortConfig}
                />
                <FilterHeader
                  label="Aadhar Number"
                  field="aadhaar_no"
                  options={getOptions("aadhaar_no")}
                  columnFilters={columnFilters}
                  updateFilter={updateFilter}
                  openFilterField={openFilterField}
                  setOpenFilterField={setOpenFilterField}
                  onSort={handleSort}
                  sortConfig={sortConfig}
                />
                <th className="p-3 text-left">PAN No</th>
                <th className="p-3 text-left">Age</th>
                <th className="p-3 text-left">Caste</th>
                <th className="p-3 text-left">Marital Status</th>
                <th className="p-3 text-left">Education</th>
                <th className="p-3 text-left">Occupation</th>
                <th className="p-3 text-left">Annual Income (₹)</th>
                <th className="p-3 text-left">Skill Acquired</th>
                <th className="p-3 text-left">Affidavit Details</th>
                <th className={stickyPaymentHeader}>Payment Status</th>
                <th className={stickyActionHeader}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {filteredPlots.map((plot, idx) => (
                <tr key={plot.id || idx} className={rowClass}>
                  <td className="p-3">{idx + 1}</td>
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
                  {/* <td className={stickyPaymentCell}>
                    <select
                      className={`select select-xs w-36 border-gray-300 ${
                        isRestricted || loadingPlotId === plot.id
                          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                          : "bg-white-100 text-green-800"
                      }`}
                      value={
                        loadingPlotId === plot.id
                          ? "PROCESSING"
                          : paymentStatusMap[plot.id] === "success"
                          ? "SUCCESS"
                          : plot.payment_status === null
                          ? "READY"
                          : "PROCESSING"
                      }
                      disabled={
                        isRestricted ||
                        loadingPlotId === plot.id ||
                        paymentStatusMap[plot.id] === "success"
                      }
                      onChange={(e) => {
                        if (e.target.value === "READY") {
                          handlePaymentReady(plot);
                        }
                      }}
                    >
                      <option value="READY">
                        Ready For Payment{" "}
                        <span
                          className={`px-2 py-1 text-xs text-white rounded font-bold bg-orange-600 ml-12`}
                        >
                          RP
                        </span>
                      </option>
                      <option value="PROCESSING">
                        Payment in Processing{" "}
                        <span
                          className={`px-2 py-1 text-xs text-white rounded font-bold bg-green-600 ml-8`}
                        >
                          PP
                        </span>
                      </option>
                      <option value="SUCCESS">
                        Payment Completed{" "}
                        <span
                          className={`px-2 py-1 text-xs text-white rounded font-bold bg-green-400 ml-11`}
                        >
                          RC
                        </span>
                      </option>
                    </select>
                  </td> */}
                  <td className={stickyPaymentCell}>
                    <div className="relative group inline-block">
                      <button
                        className={`btn btn-sm  text-white flex items-center gap-1 ${
                          isRestricted || loadingPlotId === plot.id
                            ? "!bg-gray-300 !text-gray-400 !border !border-gray-300 !cursor-not-allowed"
                            : paymentStatusMap[plot.id] === "success"
                            ? "bg-green-400 hover:bg-green-700"
                            : plot.payment_status === null
                            ? "bg-orange-600 hover:bg-orange-700"
                            : "bg-green-600 hover:bg-green-700"
                        }`}
                        onClick={() => handlePaymentReady(plot)}
                        disabled={
                          isRestricted ||
                          loadingPlotId === plot.id ||
                          paymentStatusMap[plot.id] === "success"
                        }
                      >
                        {loadingPlotId === plot.id ? (
                          <span className="loading loading-spinner loading-xs"></span>
                        ) : paymentStatusMap[plot.id] === "success" ? (
                          "RC"
                        ) : plot.payment_status === null ? (
                          "RP"
                        ) : (
                          "PP"
                        )}
                      </button>

                      {/* Tooltip */}
                      <span
                        className="absolute -translate-x-1/2 -top-5
      opacity-0 group-hover:opacity-100 transition
      bg-white text-gray-700 text-xs font-bold rounded px-2 py-1 whitespace-nowrap z-50"
                      >
                        {loadingPlotId === plot.id
                          ? "Processing Payment"
                          : paymentStatusMap[plot.id] === "success"
                          ? "Payment Completed"
                          : plot.payment_status === null
                          ? "Ready For Payment"
                          : "Payment in Processing"}
                      </span>
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
          </TableWrapper>
          <TableWrapper title="Legal Issues">
            <thead className="bg-gray-200 text-gray-700 sticky top-0 z-10 whitespace-nowrap text-sm">
              <tr>
                <th className="p-3 text-left">#</th>

                <FilterHeader
                  label="LA Case File No"
                  field="la_case_file_no"
                  options={getOptions("la_case_file_no")}
                  columnFilters={columnFilters}
                  updateFilter={updateFilter}
                  openFilterField={openFilterField}
                  setOpenFilterField={setOpenFilterField}
                  className={stickyCol1Header}
                  onSort={handleSort}
                  sortConfig={sortConfig}
                />

                <FilterHeader
                  label="Khata"
                  field="khata_no"
                  options={getOptions("khata_no")}
                  columnFilters={columnFilters}
                  updateFilter={updateFilter}
                  openFilterField={openFilterField}
                  setOpenFilterField={setOpenFilterField}
                  onSort={handleSort}
                  sortConfig={sortConfig}
                  className={stickyCol2Header}
                />

                <FilterHeader
                  label="Plot No"
                  field="plot_no"
                  options={getOptions("plot_no")}
                  columnFilters={columnFilters}
                  updateFilter={updateFilter}
                  openFilterField={openFilterField}
                  setOpenFilterField={setOpenFilterField}
                  onSort={handleSort}
                  sortConfig={sortConfig}
                  className={stickyCol3Header}
                />

                <FilterHeader
                  label="Legal Heir Cert. No"
                  field="legal_heir_certificate_no"
                  options={getOptions("legal_heir_certificate_no")}
                  columnFilters={columnFilters}
                  updateFilter={updateFilter}
                  openFilterField={openFilterField}
                  setOpenFilterField={setOpenFilterField}
                  onSort={handleSort}
                  sortConfig={sortConfig}
                />

                <FilterHeader
                  label="Land Case No"
                  field="land_case_no"
                  options={getOptions("land_case_no")}
                  columnFilters={columnFilters}
                  updateFilter={updateFilter}
                  openFilterField={openFilterField}
                  setOpenFilterField={setOpenFilterField}
                  onSort={handleSort}
                  sortConfig={sortConfig}
                />

                <th className="p-3 text-left">Land Case Date</th>
                <th className="p-3 text-left">Land Case Type</th>
                <th className="p-3 text-left">Land Case Status</th>
                <th className="p-3 text-left">Land Case Action</th>

                <th className={stickyPaymentHeader}>Payment Status</th>
                <th className={stickyActionHeader}>Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 text-xs">
              {filteredPlots.map((plot, idx) => (
                <tr
                  key={plot.id || idx}
                  className="hover:bg-gray-50 shadow-sm transition"
                >
                  <td className="p-3">{idx + 1}</td>
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
                    <div className="relative group inline-block">
                      <button
                        className={`btn btn-sm text-white flex items-center gap-1 ${
                          isRestricted || loadingPlotId === plot.id
                            ? "!bg-gray-300 !text-gray-400 !border !border-gray-300 !cursor-not-allowed"
                            : paymentStatusMap[plot.id] === "success"
                            ? "bg-green-400 hover:bg-green-700"
                            : plot.payment_status === null
                            ? "bg-orange-600 hover:bg-orange-700"
                            : "bg-green-600 hover:bg-green-700"
                        }`}
                        onClick={() => handlePaymentReady(plot)}
                        disabled={
                          isRestricted ||
                          loadingPlotId === plot.id ||
                          paymentStatusMap[plot.id] === "success"
                        }
                      >
                        {loadingPlotId === plot.id ? (
                          <span className="loading loading-spinner loading-xs"></span>
                        ) : paymentStatusMap[plot.id] === "success" ? (
                          "RC"
                        ) : plot.payment_status === null ? (
                          "RP"
                        ) : (
                          "PP"
                        )}
                      </button>

                      <span
                        className="absolute -translate-x-1/2 -top-5
      opacity-0 group-hover:opacity-100 transition
      bg-white text-gray-700 text-xs font-bold rounded px-2 py-1 whitespace-nowrap z-50"
                      >
                        {loadingPlotId === plot.id
                          ? "Processing Payment"
                          : paymentStatusMap[plot.id] === "success"
                          ? "Payment Completed"
                          : plot.payment_status === null
                          ? "Ready For Payment"
                          : "Payment in Processing"}
                      </span>
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
          </TableWrapper>
          <TableWrapper title="Land Area Valuation Details">
            <thead className="bg-gray-200 text-gray-700 sticky top-0 z-10 whitespace-nowrap text-sm">
              <tr>
                <th className="p-3 text-left">#</th>
                {/* <th className="p-3 text-left">Project Name</th> */}
                <FilterHeader
                  label="LA Case File No"
                  field="la_case_file_no"
                  options={getOptions("la_case_file_no")}
                  columnFilters={columnFilters}
                  updateFilter={updateFilter}
                  openFilterField={openFilterField}
                  setOpenFilterField={setOpenFilterField}
                  className={stickyCol1Header}
                  onSort={handleSort}
                  sortConfig={sortConfig}
                />

                <FilterHeader
                  label="Khata"
                  field="khata_no"
                  options={getOptions("khata_no")}
                  columnFilters={columnFilters}
                  updateFilter={updateFilter}
                  openFilterField={openFilterField}
                  setOpenFilterField={setOpenFilterField}
                  onSort={handleSort}
                  sortConfig={sortConfig}
                  className={stickyCol2Header}
                />

                <FilterHeader
                  label="Plot No"
                  field="plot_no"
                  options={getOptions("plot_no")}
                  columnFilters={columnFilters}
                  updateFilter={updateFilter}
                  openFilterField={openFilterField}
                  setOpenFilterField={setOpenFilterField}
                  onSort={handleSort}
                  sortConfig={sortConfig}
                  className={stickyCol3Header}
                />
                {/* <th className="p-3 text-left">Kissam of Land</th> */}
                <FilterHeader
                  label="Kissam of Land"
                  field="kissam_of_land"
                  options={getOptions("kissam_of_land")}
                  columnFilters={columnFilters}
                  updateFilter={updateFilter}
                  openFilterField={openFilterField}
                  setOpenFilterField={setOpenFilterField}
                  onSort={handleSort}
                  sortConfig={sortConfig}
                />
                {/* <th className="p-3 text-left">Land Category</th> */}
                <FilterHeader
                  label="Land Category"
                  field="land_category"
                  options={getOptions("land_category")}
                  columnFilters={columnFilters}
                  updateFilter={updateFilter}
                  openFilterField={openFilterField}
                  setOpenFilterField={setOpenFilterField}
                  onSort={handleSort}
                  sortConfig={sortConfig}
                />
                <th className="p-3 text-left">LO13 Remarks</th>
                {/* <th className="p-3 text-left">Total Area (Acre)</th>
              <th className="p-3 text-left">Total Area (Hectare)</th>
              <th className="p-3 text-left">Acquired Area (Acre)</th>
              <th className="p-3 text-left">Acquired Area (Hectare)</th> */}
                {/* <th className="p-3 text-left">Legal Heir Cert. No</th> */}

                {/* <th className="p-3 text-left">Land Case No</th> */}

                <th className="p-3 text-left">Bench Market Value</th>
                <th className="p-3 text-left">Basic Land Value (₹)</th>
                <th className="p-3 text-left">Land Value w/ MF (₹)</th>
                <th className="p-3 text-left">No. of Trees</th>
                <th className="p-3 text-left">Value of Trees (₹)</th>
                <th className="p-3 text-left">No. of Houses</th>
                {/* <th className="p-3 text-left">Value of Houses (₹)</th> */}
                <FilterHeader
                  label="Value of Houses"
                  field="value_of_house"
                  options={getOptions("value_of_house")}
                  columnFilters={columnFilters}
                  updateFilter={updateFilter}
                  openFilterField={openFilterField}
                  setOpenFilterField={setOpenFilterField}
                  onSort={handleSort}
                  sortConfig={sortConfig}
                />
                <th className="p-3 text-left">Other Structures</th>
                <th className="p-3 text-left">Value of Other Structures (₹)</th>
                <th className="p-3 text-left">Total Value (₹)</th>
                {/* <th className="p-3 text-left">Solatium 100% (₹)</th> */}
                <FilterHeader
                  label="Solatium 100% (₹)"
                  field="solatium_100"
                  options={getOptions("solatium_100")}
                  columnFilters={columnFilters}
                  updateFilter={updateFilter}
                  openFilterField={openFilterField}
                  setOpenFilterField={setOpenFilterField}
                  onSort={handleSort}
                  sortConfig={sortConfig}
                />
                <th className="p-3 text-left">No. Days of interest</th>
                <th className="p-3 text-left">Additional 12% (₹)</th>
                <th className="p-3 text-left">Total Compensation (₹)</th>
                {/* <th className="p-3 text-left">Apportionment Amount (₹)</th> */}
                <th className="p-3 text-left">Priority / Urgency</th>
                {/* <th className="p-3 text-left">Land Use Plan</th> */}
                <th className="p-3 text-left">LA21 Remarks</th>
                <th className={stickyPaymentHeader}>Payment Status</th>
                <th className={stickyActionHeader}>Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 text-xs">
              {filteredPlots.map((plot, idx) => (
                <tr
                  key={plot.id || idx}
                  className="hover:bg-gray-50 shadow-sm transition"
                >
                  <td className="p-3">{idx + 1}</td>
                  {/* <td className="p-3">{plot.project_name || "N/A"}</td> */}
                  <td className={stickyCol1Cell}>
                    {plot.la_case_file_no || "N/A"}
                  </td>
                  <td className={stickyCol2Cell}>{plot.khata_no || "N/A"}</td>
                  <td className={stickyCol3Cell}>{plot.plot_no || "N/A"}</td>
                  <td className="p-3">{plot.kissam_of_land || "N/A"}</td>
                  <td className="p-3">{plot.land_category || "N/A"}</td>
                  <td className="p-3">{plot.lo13_remarks || "N/A"}</td>
                  {/* <td className="p-3">{plot.land_area_total_acres || "N/A"}</td>
                <td className="p-3">
                  {plot.land_area_total_hectares || "N/A"}
                </td>
                <td className="p-3">
                  {plot.land_area_acquired_acres || "N/A"}
                </td>
                <td className="p-3">
                  {plot.land_area_acquired_hectares || "N/A"}
                </td> */}

                  <td className="p-3">{plot.market_value_per_acre || "N/A"}</td>
                  <td className="p-3">{plot.basic_land_value || "N/A"}</td>
                  <td className="p-3">{plot.land_value_with_mf || "N/A"}</td>
                  <td className="p-3">{plot.no_of_trees || "N/A"}</td>
                  <td className="p-3">{plot.total_value_of_trees || "N/A"}</td>
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
                  <td className="p-3">{plot.additional_12_percent || "N/A"}</td>
                  <td className="p-3">{plot.total_compensation || "N/A"}</td>
                  {/* <td className="p-3">{plot.apportionment_amount || "N/A"}</td> */}
                  <td className="p-3">{plot.priority_urgency || "N/A"}</td>
                  {/* <td className="p-3">{plot.land_use_plan || "N/A"}</td> */}
                  <td className="p-3">{plot.la21_remarks || "N/A"}</td>
                  <td className={stickyPaymentCell}>
                    <div className="relative group inline-block">
                      <button
                        className={`btn btn-sm text-white flex items-center gap-1 ${
                          isRestricted || loadingPlotId === plot.id
                            ? "!bg-gray-300 !text-gray-400 !border !border-gray-300 !cursor-not-allowed"
                            : paymentStatusMap[plot.id] === "success"
                            ? "bg-green-400 hover:bg-green-700"
                            : plot.payment_status === null
                            ? "bg-orange-600 hover:bg-orange-700"
                            : "bg-green-600 hover:bg-green-700"
                        }`}
                        onClick={() => handlePaymentReady(plot)}
                        disabled={
                          isRestricted ||
                          loadingPlotId === plot.id ||
                          paymentStatusMap[plot.id] === "success"
                        }
                      >
                        {loadingPlotId === plot.id ? (
                          <span className="loading loading-spinner loading-xs"></span>
                        ) : paymentStatusMap[plot.id] === "success" ? (
                          "RC"
                        ) : plot.payment_status === null ? (
                          "RP"
                        ) : (
                          "PP"
                        )}
                      </button>

                      {/* Tooltip */}
                      <span
                        className="absolute -translate-x-1/2 -top-5
      opacity-0 group-hover:opacity-100 transition
      bg-white text-gray-700 text-xs font-bold rounded px-2 py-1 whitespace-nowrap z-50"
                      >
                        {loadingPlotId === plot.id
                          ? "Processing Payment"
                          : paymentStatusMap[plot.id] === "success"
                          ? "Payment Completed"
                          : plot.payment_status === null
                          ? "Ready For Payment"
                          : "Payment in Processing"}
                      </span>
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
          </TableWrapper>
          <TableWrapper title="Grievance & Tribunal Details">
            <thead className="bg-gray-200 text-gray-700 sticky top-0 z-10 whitespace-nowrap text-sm">
              <tr>
                <th className="p-3 text-left">#</th>
                {/* <th className="p-3 text-left">Project Name</th> */}
                <FilterHeader
                  label="LA Case File No"
                  field="la_case_file_no"
                  options={getOptions("la_case_file_no")}
                  columnFilters={columnFilters}
                  updateFilter={updateFilter}
                  openFilterField={openFilterField}
                  setOpenFilterField={setOpenFilterField}
                  className={stickyCol1Header}
                  onSort={handleSort}
                  sortConfig={sortConfig}
                />

                <FilterHeader
                  label="Khata"
                  field="khata_no"
                  options={getOptions("khata_no")}
                  columnFilters={columnFilters}
                  updateFilter={updateFilter}
                  openFilterField={openFilterField}
                  setOpenFilterField={setOpenFilterField}
                  onSort={handleSort}
                  sortConfig={sortConfig}
                  className={stickyCol2Header}
                />

                <FilterHeader
                  label="Plot No"
                  field="plot_no"
                  options={getOptions("plot_no")}
                  columnFilters={columnFilters}
                  updateFilter={updateFilter}
                  openFilterField={openFilterField}
                  setOpenFilterField={setOpenFilterField}
                  onSort={handleSort}
                  sortConfig={sortConfig}
                  className={stickyCol3Header}
                />
                <th className="p-3 text-left">Grievance No</th>
                <th className="p-3 text-left">Grievance Date</th>
                <th className="p-3 text-left">Subject</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Action Taken</th>
                <th className="p-3 text-left">Tribunal</th>
                <th className="p-3 text-left">Deposit Date</th>
                <th className="p-3 text-left">Tribunal Amount (₹)</th>
                <th className="p-3 text-left">Ground Rent (₹)</th>
                <th className="p-3 text-left">Cess (₹)</th>
                <th className="p-3 text-left">Incidental Charges (₹)</th>
                <th className="p-3 text-left">Total (₹)</th>
                <th className="p-3 text-left">Abatement</th>
                <th className={stickyPaymentHeader}>Payment Status</th>
                <th className={stickyActionHeader}>Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 text-xs ">
              {filteredPlots.map((plot, idx) => (
                <tr
                  key={plot.id || idx}
                  className="hover:bg-gray-50 shadow-sm transition"
                >
                  <td className="p-3">{idx + 1}</td>
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
                  <td className="p-3">{plot.ground_rent ?? "N/A"}</td>
                  <td className="p-3">{plot.cess ?? "N/A"}</td>
                  <td className="p-3">{plot.incidental_charges ?? "N/A"}</td>
                  <td className="p-3">{plot.total ?? "N/A"}</td>
                  <td className="p-3">{plot.abatement || "N/A"}</td>
                  <td className={stickyPaymentCell}>
                    <div className="relative group inline-block">
                      <button
                        className={`btn btn-sm text-white flex items-center gap-1 ${
                          isRestricted || loadingPlotId === plot.id
                            ? "!bg-gray-300 !text-gray-400 !border !border-gray-300 !cursor-not-allowed"
                            : paymentStatusMap[plot.id] === "success"
                            ? "bg-green-400 hover:bg-green-700"
                            : plot.payment_status === null
                            ? "bg-orange-600 hover:bg-orange-700"
                            : "bg-green-600 hover:bg-green-700"
                        }`}
                        onClick={() => handlePaymentReady(plot)}
                        disabled={
                          isRestricted ||
                          loadingPlotId === plot.id ||
                          paymentStatusMap[plot.id] === "success"
                        }
                      >
                        {loadingPlotId === plot.id ? (
                          <span className="loading loading-spinner loading-xs"></span>
                        ) : paymentStatusMap[plot.id] === "success" ? (
                          "RC"
                        ) : plot.payment_status === null ? (
                          "RP"
                        ) : (
                          "PP"
                        )}
                      </button>

                      {/* Tooltip */}
                      <span
                        className="absolute -translate-x-1/2 -top-5
      opacity-0 group-hover:opacity-100 transition
      bg-white text-gray-700 text-xs font-bold rounded px-2 py-1 whitespace-nowrap z-50"
                      >
                        {loadingPlotId === plot.id
                          ? "Processing Payment"
                          : paymentStatusMap[plot.id] === "success"
                          ? "Payment Completed"
                          : plot.payment_status === null
                          ? "Ready For Payment"
                          : "Payment in Processing"}
                      </span>
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
          </TableWrapper>
          <TableWrapper title="Family Details">
            <thead className="bg-gray-200 text-gray-700 sticky top-0 z-10 whitespace-nowrap text-sm">
              <tr>
                <th className="p-3 text-left">#</th>
                {/* <th className="p-3 text-left">Project Name</th> */}
                <FilterHeader
                  label="LA Case File No"
                  field="la_case_file_no"
                  options={getOptions("la_case_file_no")}
                  columnFilters={columnFilters}
                  updateFilter={updateFilter}
                  openFilterField={openFilterField}
                  setOpenFilterField={setOpenFilterField}
                  className={stickyCol1Header}
                  onSort={handleSort}
                  sortConfig={sortConfig}
                />

                <FilterHeader
                  label="Khata"
                  field="khata_no"
                  options={getOptions("khata_no")}
                  columnFilters={columnFilters}
                  updateFilter={updateFilter}
                  openFilterField={openFilterField}
                  setOpenFilterField={setOpenFilterField}
                  onSort={handleSort}
                  sortConfig={sortConfig}
                  className={stickyCol2Header}
                />

                <FilterHeader
                  label="Plot No"
                  field="plot_no"
                  options={getOptions("plot_no")}
                  columnFilters={columnFilters}
                  updateFilter={updateFilter}
                  openFilterField={openFilterField}
                  setOpenFilterField={setOpenFilterField}
                  onSort={handleSort}
                  sortConfig={sortConfig}
                  className={stickyCol3Header}
                />
                <th className="p-3 text-left">Major Male</th>
                <th className="p-3 text-left">Major Female</th>
                <th className="p-3 text-left">Minor Male</th>
                <th className="p-3 text-left">Minor Female</th>
                <th className="p-3 text-left">Major Transgender</th>
                <th className="p-3 text-left">Minor Transgender</th>
                <th className="p-3 text-left">PwD Members</th>
                <th className="p-3 text-left">Orphan Members</th>
                <th className={stickyPaymentHeader}>Payment Status</th>
                <th className={stickyActionHeader}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {filteredPlots.map((plot, idx) => (
                <tr key={plot.id || idx} className={rowClass}>
                  <td className="p-3">{idx + 1}</td>
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
                    {plot.family_with_orphan_members === "Y" ? "Yes" : "No"}
                  </td>
                  <td className={stickyPaymentCell}>
                    <div className="relative group inline-block">
                      <button
                        className={`btn btn-sm text-white flex items-center gap-1 ${
                          isRestricted || loadingPlotId === plot.id
                            ? "!bg-gray-300 !text-gray-400 !border !border-gray-300 !cursor-not-allowed"
                            : paymentStatusMap[plot.id] === "success"
                            ? "bg-green-400 hover:bg-green-700"
                            : plot.payment_status === null
                            ? "bg-orange-600 hover:bg-orange-700"
                            : "bg-green-600 hover:bg-green-700"
                        }`}
                        onClick={() => handlePaymentReady(plot)}
                        disabled={
                          isRestricted ||
                          loadingPlotId === plot.id ||
                          paymentStatusMap[plot.id] === "success"
                        }
                      >
                        {loadingPlotId === plot.id ? (
                          <span className="loading loading-spinner loading-xs"></span>
                        ) : paymentStatusMap[plot.id] === "success" ? (
                          "RC"
                        ) : plot.payment_status === null ? (
                          "RP"
                        ) : (
                          "PP"
                        )}
                      </button>

                      {/* Tooltip */}
                      <span
                        className="absolute -translate-x-1/2 -top-5
      opacity-0 group-hover:opacity-100 transition
      bg-white text-gray-700 text-xs font-bold rounded px-2 py-1 whitespace-nowrap z-50"
                      >
                        {loadingPlotId === plot.id
                          ? "Processing Payment"
                          : paymentStatusMap[plot.id] === "success"
                          ? "Payment Completed"
                          : plot.payment_status === null
                          ? "Ready For Payment"
                          : "Payment in Processing"}
                      </span>
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
          </TableWrapper>
          {/* {landType === "govt-land" && (
            <TableWrapper title="Legal Issues">
              <thead className="bg-gray-200 text-gray-700 sticky top-0 z-10 whitespace-nowrap text-sm">
                <tr>
                  <th className="p-3 text-left">#</th>

                  <FilterHeader
                    label="LA Case File No"
                    field="la_case_file_no"
                    options={getOptions("la_case_file_no")}
                    columnFilters={columnFilters}
                    updateFilter={updateFilter}
                    openFilterField={openFilterField}
                    setOpenFilterField={setOpenFilterField}
                    className={stickyCol1Header}
                    onSort={handleSort}
                    sortConfig={sortConfig}
                  />

                  <FilterHeader
                    label="Khata"
                    field="khata_no"
                    options={getOptions("khata_no")}
                    columnFilters={columnFilters}
                    updateFilter={updateFilter}
                    openFilterField={openFilterField}
                    setOpenFilterField={setOpenFilterField}
                    onSort={handleSort}
                    sortConfig={sortConfig}
                    className={stickyCol2Header}
                  />

                  <FilterHeader
                    label="Plot No"
                    field="plot_no"
                    options={getOptions("plot_no")}
                    columnFilters={columnFilters}
                    updateFilter={updateFilter}
                    openFilterField={openFilterField}
                    setOpenFilterField={setOpenFilterField}
                    onSort={handleSort}
                    sortConfig={sortConfig}
                    className={stickyCol3Header}
                  />

                  <FilterHeader
                    label="Legal Heir Cert. No"
                    field="legal_heir_certificate_no"
                    options={getOptions("legal_heir_certificate_no")}
                    columnFilters={columnFilters}
                    updateFilter={updateFilter}
                    openFilterField={openFilterField}
                    setOpenFilterField={setOpenFilterField}
                    onSort={handleSort}
                    sortConfig={sortConfig}
                  />

                  <FilterHeader
                    label="Land Case No"
                    field="land_case_no"
                    options={getOptions("land_case_no")}
                    columnFilters={columnFilters}
                    updateFilter={updateFilter}
                    openFilterField={openFilterField}
                    setOpenFilterField={setOpenFilterField}
                    onSort={handleSort}
                    sortConfig={sortConfig}
                  />

                  <th className="p-3 text-left">Land Case Date</th>
                  <th className="p-3 text-left">Land Case Type</th>
                  <th className="p-3 text-left">Land Case Status</th>
                  <th className="p-3 text-left">Land Case Action</th>

                  <th className={stickyPaymentHeader}>Payment Status</th>
                  <th className={stickyActionHeader}>Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 text-xs">
                {filteredPlots.map((plot, idx) => (
                  <tr
                    key={plot.id || idx}
                    className="hover:bg-gray-50 shadow-sm transition"
                  >
                    <td className="p-3">{idx + 1}</td>
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
                      <div className="relative group inline-block">
                        <button
                          className={`btn btn-sm text-white flex items-center gap-1 ${
                            isRestricted || loadingPlotId === plot.id
                              ? "!bg-gray-300 !text-gray-400 !border !border-gray-300 !cursor-not-allowed"
                              : paymentStatusMap[plot.id] === "success"
                              ? "bg-green-400 hover:bg-green-700"
                              : plot.payment_status === null
                              ? "bg-orange-600 hover:bg-orange-700"
                              : "bg-green-600 hover:bg-green-700"
                          }`}
                          onClick={() => handlePaymentReady(plot)}
                          disabled={
                            isRestricted ||
                            loadingPlotId === plot.id ||
                            paymentStatusMap[plot.id] === "success"
                          }
                        >
                          {loadingPlotId === plot.id ? (
                            <span className="loading loading-spinner loading-xs"></span>
                          ) : paymentStatusMap[plot.id] === "success" ? (
                            "RC"
                          ) : plot.payment_status === null ? (
                            "RP"
                          ) : (
                            "PP"
                          )}
                        </button>

              
                        <span
                          className="absolute -translate-x-1/2 -top-5
      opacity-0 group-hover:opacity-100 transition
      bg-white text-gray-700 text-xs font-bold rounded px-2 py-1 whitespace-nowrap z-50"
                        >
                          {loadingPlotId === plot.id
                            ? "Processing Payment"
                            : paymentStatusMap[plot.id] === "success"
                            ? "Payment Completed"
                            : plot.payment_status === null
                            ? "Ready For Payment"
                            : "Payment in Processing"}
                        </span>
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
            </TableWrapper>
          )} */}
        </PlotTabs>
      )}
    </div>
  );
};

export default PlotTable;
