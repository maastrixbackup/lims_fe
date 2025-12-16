import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Pencil, Trash2, X, Filter, HandCoins } from "lucide-react";
import moment from "moment";
import { useSelector } from "react-redux";
import { API_BASE_URL } from "../../../utils/config";
import PlotTabs from "./PlotTabs";
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
  const isRestricted = role === "Data Entry User" || role === "Viewer";
  const selectedProject = useSelector((state) => state.selectedProject.project);
  const token = useSelector((state) => state.auth.userToken);
  // console.log("tokennnn", token);
  const [paymentStatusMap, setPaymentStatusMap] = useState({});
  const [loadingPlotId, setLoadingPlotId] = useState(null);

  const handlePaymentReady = async (plot) => {
    if (isRestricted) return;

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
        window.toast?.success(data.message || "Payment processed successfully");

        // Update local status map
        setPaymentStatusMap((prev) => ({
          ...prev,
          [plot.id]: "success",
        }));
        navigate(`/${landType}/land-cost`, { state: { plot } });

        // setTimeout(() => refreshPlots && refreshPlots(), 1000);
      } else {
        window.toast?.error(data.message || "Payment request failed");
      }
    } catch (error) {
      console.error("Payment API error:", error);
      window.toast?.error("Network error, please try again");
    }

    setLoadingPlotId(null);
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

  const khataOptions = useMemo(() => {
    const uniqueKhata = new Set(
      projectFilteredPlots.map((p) => p.khata_no).filter(Boolean)
    );
    return [...uniqueKhata];
  }, [projectFilteredPlots]);

  const filteredPlots = useMemo(() => {
    return projectFilteredPlots.filter((plot) => {
      const matchVillage =
        !selectedVillage || plot.village_name === selectedVillage;
      const matchKhata = !selectedKhata || plot.khata_no === selectedKhata;
      const query = searchQuery.toLowerCase();
      const matchSearch =
        !searchQuery ||
        Object.values(plot).join(" ").toLowerCase().includes(query);

      return matchVillage && matchKhata && matchSearch;
    });
  }, [projectFilteredPlots, selectedVillage, selectedKhata, searchQuery]);
  // Reset filters
  const resetFilters = () => {
    setSelectedVillage("");
    setSelectedTahasil("");
    setSearchQuery("");
  };

  const navigate = useNavigate();

  // if (!filteredPlots.length) {
  //   return (
  //     <div className="text-center py-10 text-gray-500">
  //       No plots found. Click{" "}
  //       <span
  //         className="font-semibold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer transition-all duration-200"
  //         onClick={() => navigate(`/${landType}/plot-form`)}
  //       >
  //         + Add Plot
  //       </span>{" "}
  //       to create one.
  //     </div>
  //   );
  // }
  const formatDate = (date) => {
    if (!date) return "N/A";
    const d = moment(date);
    return d.isValid() ? d.format("DD-MM-YYYY") : "N/A";
  };

  const TableWrapper = ({ title, children }) => (
    <div className="space-y-2">
      <h2 className="font-semibold text-gray-800 bg-gray-100 px-4 py-2 rounded-t-md shadow-sm">
        {title}
      </h2>
      <div className="overflow-x-auto max-h-[400px] overflow-y-auto rounded-xl shadow-md bg-white">
        <table className="min-w-full text-xs relative">{children}</table>
      </div>
    </div>
  );

  const ActionButtons = (plot) => (
    <div className="flex justify-end gap-2">
      {/* <button
        className={`btn btn-xs btn-success text-white flex items-center gap-1 px-3 w-40 ${
          isRestricted || loadingPlotId === plot.id
            ? "!bg-gray-300 !text-gray-400 !border !border-gray-300 !cursor-not-allowed"
            : "hover:bg-green-700"
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
        ) : (
          <HandCoins size={12} />
        )}

        {loadingPlotId === plot.id
          ? "Processing..."
          : paymentStatusMap[plot.id] === "success"
          ? "Success"
          : plot.payment_status === null
          ? "Ready For Payment"
          : "Processing"}
      </button> */}

      <button
        className={`btn btn-xs btn-warning text-white ${
          isRestricted
            ? "!bg-gray-300 !text-gray-400 !border !border-gray-300 !cursor-not-allowed"
            : ""
        }`}
        onClick={() => navigate(`/${landType}/plot-form`, { state: { plot } })}
        disabled={isRestricted}
      >
        <Pencil size={12} /> Edit
      </button>
      <button
        className={`btn btn-xs btn-error text-white ${
          isRestricted
            ? "!bg-gray-300 !text-gray-400 !border !border-gray-300 !cursor-not-allowed"
            : ""
        }`}
        onClick={() => setDeleteConfirm(plot)}
        disabled={isRestricted}
      >
        <Trash2 size={12} /> Delete
      </button>
    </div>
  );

  const rowClass = "hover:bg-gray-50 transition-colors";

  const stickyActionHeader =
    "p-3 text-right bg-gray-200 text-gray-700 sticky right-0 z-[30] shadow-md";

  const stickyActionCell =
    "p-3 text-right bg-white sticky right-0 border-l border-gray-100 shadow-sm";

  return (
    <div className="">
      <div className="rounded-xl p-4 mb-6 shadow-sm bg-white space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-end gap-4">
          <div className="flex flex-wrap gap-4 w-full">
            <div className="flex flex-col w-full sm:w-48">
              <label className="text-xs font-medium text-gray-600 mb-1">
                Village
              </label>
              <select
                className="select select-sm border-gray-300 focus:border-indigo-500 focus:ring-indigo-400 rounded-lg w-full text-gray-700"
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
            <div className="flex flex-col w-full sm:w-48">
              <label className="text-xs font-medium text-gray-600 mb-1">
                Khata No.
              </label>
              <select
                className="select select-sm border-gray-300 focus:border-indigo-500 focus:ring-indigo-400 rounded-lg w-full text-gray-700"
                value={selectedKhata}
                onChange={(e) => setSelectedKhata(e.target.value)}
              >
                <option value="">All Khata Numbers</option>
                {khataOptions.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            {/* Search */}
            <div className="flex flex-col w-full sm:flex-1">
              <label className="text-xs font-medium text-gray-600 mb-1">
                Search
              </label>
              <div className="flex items-center bg-white border border-gray-300 rounded-lg shadow-sm focus-within:ring-2 focus-within:ring-indigo-400">
                <input
                  type="text"
                  placeholder="Search tenant, plot, khata..."
                  className="px-3 py-2 w-full text-sm rounded-l-lg focus:outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  className="px-2 text-gray-500 hover:text-indigo-600"
                  onClick={resetFilters}
                  title="Reset filters"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Results count */}
          <div className="flex items-center gap-2 bg-indigo-100 px-3 py-2 rounded-lg text-sm text-indigo-700 font-medium shadow-inner w-fit">
            <Filter size={16} />
            Showing{" "}
            <span className="text-indigo-900 font-semibold">
              {filteredPlots.length}
            </span>{" "}
            results
          </div>
        </div>
      </div>

      {/* <div className="card bg-white shadow-lg p-4"> */}
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
                  <span className="text-gray-700 font-semibold">Project</span>{" "}
                  or add a new Plot.
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
            <thead className="bg-gray-200 text-gray-700 sticky top-0 z-10 whitespace-nowrap">
              <tr>
                <th className="p-3 text-left">#</th>
                <th className="p-3 text-left">Project Name</th>
                <th className="p-3 text-left">LA Case File No</th>
                <th className="p-3 text-left">Khata No</th>
                <th className="p-3 text-left">Plot No</th>
                <th className="p-3 text-left">Full/Part Plot</th>
                <th className="p-3 text-left">SES Survey No</th>
                <th className="p-3 text-left">Date of Award</th>
                <th className="p-3 text-left">Recorded Tenant</th>
                <th className="p-3 text-left">Present Tenant</th>
                <th className="p-3 text-left">Number Of Present Tenant</th>
                <th className="p-3 text-left">Present Address</th>
                <th className="p-3 text-left">Displaced/Affected</th>
                <th className="p-3 text-left">Village</th>
                <th className="p-3 text-left">Tahasil</th>
                <th className="p-3 text-left">RI Circle</th>
                <th className="p-3 text-left">Thana No</th>
                <th className="p-3 text-left">Total Area (Acre)</th>
                <th className="p-3 text-left">Total Area (Hectare)</th>
                <th className="p-3 text-left">Acquired Area (Acre)</th>
                <th className="p-3 text-left">Acquired Area (Hectare)</th>
                <th className="p-3 text-left bg-gray-200 sticky right-34 z-[30] shadow-md">
                  Payment Status
                </th>
                <th className={stickyActionHeader}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 whitespace-nowrap">
              {filteredPlots.map((plot, idx) => (
                <tr
                  key={plot.id || idx}
                  className="hover:bg-gray-50 transition"
                >
                  <td className="p-3">{idx + 1}</td>
                  <td className="p-3">{plot.project_name || "N/A"}</td>
                  <td className="p-3">{plot.la_case_file_no || "N/A"}</td>
                  <td className="p-3">{plot.khata_no || "N/A"}</td>
                  <td className="p-3">{plot.plot_no || "N/A"}</td>
                  <td className="p-3">{plot.full_plot || "N/A"}</td>
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
                  <td className="p-3">{plot.village_name || "N/A"}</td>
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
                  <td className="p-3 bg-white sticky right-34 border-l border-gray-100 shadow-sm">
                    <button
                      className={`btn btn-xs btn-success text-white flex items-center gap-1 px-3 w-40 ${
                        isRestricted || loadingPlotId === plot.id
                          ? "!bg-gray-300 !text-gray-400 !border !border-gray-300 !cursor-not-allowed"
                          : "hover:bg-green-700"
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
                      ) : (
                        <HandCoins size={12} />
                      )}

                      {loadingPlotId === plot.id
                        ? "Processing..."
                        : paymentStatusMap[plot.id] === "success"
                        ? "Success"
                        : plot.payment_status === null
                        ? "Ready For Payment"
                        : "Processing..."}
                    </button>
                  </td>

                  <td className={stickyActionCell}>{ActionButtons(plot)}</td>
                </tr>
              ))}
            </tbody>
          </TableWrapper>
          <TableWrapper title="Bank & Personal Details">
            <thead className="bg-gray-200 text-gray-700 sticky top-0 z-10 whitespace-nowrap">
              <tr>
                <th className="p-3 text-left">#</th>
                <th className="p-3 text-left">Project Name</th>
                <th className="p-3 text-left">LA Case File No</th>
                <th className="p-3 text-left">Bank Name</th>
                <th className="p-3 text-left">Account No</th>
                <th className="p-3 text-left">IFSC Code</th>
                <th className="p-3 text-left">Aadhaar No</th>
                <th className="p-3 text-left">PAN No</th>
                <th className="p-3 text-left">Age</th>
                <th className="p-3 text-left">Caste</th>
                <th className="p-3 text-left">Marital Status</th>
                <th className="p-3 text-left">Education</th>
                <th className="p-3 text-left">Occupation</th>
                <th className="p-3 text-left">Annual Income (₹)</th>
                <th className="p-3 text-left">Skill Acquired</th>
                <th className="p-3 text-left">Affidavit Details</th>
                <th className="p-3 text-left bg-gray-200 sticky right-34 z-[30] shadow-md">
                  Payment Status
                </th>
                <th className={stickyActionHeader}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 whitespace-nowrap">
              {filteredPlots.map((plot, idx) => (
                <tr key={plot.id || idx} className={rowClass}>
                  <td className="p-3">{idx + 1}</td>
                  <td className="p-3">{plot.project_name || "N/A"}</td>
                  <td className="p-3">{plot.la_case_file_no || "N/A"}</td>
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
                  <td className="p-3 bg-white sticky right-34 border-l border-gray-100 shadow-sm">
                    <button
                      className={`btn btn-xs btn-success text-white flex items-center gap-1 px-3 w-40 ${
                        isRestricted || loadingPlotId === plot.id
                          ? "!bg-gray-300 !text-gray-400 !border !border-gray-300 !cursor-not-allowed"
                          : "hover:bg-green-700"
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
                      ) : (
                        <HandCoins size={12} />
                      )}

                      {loadingPlotId === plot.id
                        ? "Processing..."
                        : paymentStatusMap[plot.id] === "success"
                        ? "Success"
                        : plot.payment_status === null
                        ? "Ready For Payment"
                        : "Processing..."}
                    </button>
                  </td>
                  <td className={stickyActionCell}>{ActionButtons(plot)}</td>
                </tr>
              ))}
            </tbody>
          </TableWrapper>
          <TableWrapper title="Land area Valuation Details">
            <thead className="bg-gray-200 text-gray-700 sticky top-0 z-10 whitespace-nowrap shadow-md">
              <tr>
                <th className="p-3 text-left">#</th>
                <th className="p-3 text-left">Project Name</th>
                <th className="p-3 text-left">LA Case File No</th>
                <th className="p-3 text-left">Kissam of Land</th>
                <th className="p-3 text-left">Land Category</th>
                <th className="p-3 text-left">LO13 Remarks</th>
                {/* <th className="p-3 text-left">Total Area (Acre)</th>
              <th className="p-3 text-left">Total Area (Hectare)</th>
              <th className="p-3 text-left">Acquired Area (Acre)</th>
              <th className="p-3 text-left">Acquired Area (Hectare)</th> */}
                <th className="p-3 text-left">Legal Heir Cert. No</th>
                <th className="p-3 text-left">Land Case No</th>
                <th className="p-3 text-left">Land Case Date</th>
                <th className="p-3 text-left">Land Case Type</th>
                <th className="p-3 text-left">Land Case Status</th>
                <th className="p-3 text-left">Land Case Action</th>
                <th className="p-3 text-left">Market Value / Acre</th>
                <th className="p-3 text-left">Basic Land Value (₹)</th>
                <th className="p-3 text-left">Land Value w/ MF (₹)</th>
                <th className="p-3 text-left">No. of Trees</th>
                <th className="p-3 text-left">Value of Trees (₹)</th>
                <th className="p-3 text-left">No. of Houses</th>
                <th className="p-3 text-left">Value of Houses (₹)</th>
                <th className="p-3 text-left">Other Structures</th>
                <th className="p-3 text-left">Value of Other Structures (₹)</th>
                <th className="p-3 text-left">Total Value (₹)</th>
                <th className="p-3 text-left">Solatium 100% (₹)</th>
                <th className="p-3 text-left">Additional 12% (₹)</th>
                <th className="p-3 text-left">Total Compensation (₹)</th>
                <th className="p-3 text-left">Apportionment Amount (₹)</th>
                <th className="p-3 text-left">Priority / Urgency</th>
                <th className="p-3 text-left">Land Use Plan</th>
                <th className="p-3 text-left">LA21 Remarks</th>
                <th className="p-3 text-left bg-gray-200 sticky right-34 z-[30] shadow-md">
                  Payment Status
                </th>
                <th className={stickyActionHeader}>Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 whitespace-nowrap">
              {filteredPlots.map((plot, idx) => (
                <tr
                  key={plot.id || idx}
                  className="hover:bg-gray-50 shadow-sm transition"
                >
                  <td className="p-3">{idx + 1}</td>
                  <td className="p-3">{plot.project_name || "N/A"}</td>
                  <td className="p-3">{plot.la_case_file_no || "N/A"}</td>
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
                  <td className="p-3">{plot.additional_12_percent || "N/A"}</td>
                  <td className="p-3">{plot.total_compensation || "N/A"}</td>
                  <td className="p-3">{plot.apportionment_amount || "N/A"}</td>
                  <td className="p-3">{plot.priority_urgency || "N/A"}</td>
                  <td className="p-3">{plot.land_use_plan || "N/A"}</td>
                  <td className="p-3">{plot.la21_remarks || "N/A"}</td>
                  <td className="p-3 bg-white sticky right-34 border-l border-gray-100 shadow-sm">
                    <button
                      className={`btn btn-xs btn-success text-white flex items-center gap-1 px-3 w-40 ${
                        isRestricted || loadingPlotId === plot.id
                          ? "!bg-gray-300 !text-gray-400 !border !border-gray-300 !cursor-not-allowed"
                          : "hover:bg-green-700"
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
                      ) : (
                        <HandCoins size={12} />
                      )}

                      {loadingPlotId === plot.id
                        ? "Processing..."
                        : paymentStatusMap[plot.id] === "success"
                        ? "Success"
                        : plot.payment_status === null
                        ? "Ready For Payment"
                        : "Processing..."}
                    </button>
                  </td>
                  <td className={stickyActionCell}>{ActionButtons(plot)}</td>
                </tr>
              ))}
            </tbody>
          </TableWrapper>
          <TableWrapper title="RR Details">
            <thead className="bg-gray-200 text-gray-700 sticky top-0 z-10 whitespace-nowrap">
              <tr>
                <th className="p-3 text-left">#</th>
                <th className="p-3 text-left">Project Name</th>
                <th className="p-3 text-left">LA Case File No</th>
                <th className="p-3 text-left">RR Employment</th>
                <th className="p-3 text-left">RR Cash In Lieu</th>
                <th className="p-3 text-left">RR Training/Skill Upgradation</th>
                <th className="p-3 text-left">RR Self Employment</th>
                <th className="p-3 text-left">RR Special Allowance ST/NTFP</th>
                <th className="p-3 text-left">RR Homestead Allotment</th>
                <th className="p-3 text-left">RR House Building Assistance</th>
                <th className="p-3 text-left">RR Constructed By</th>
                <th className="p-3 text-left">RR Transit Shed</th>
                <th className="p-3 text-left">RR Transport Allowance</th>
                <th className="p-3 text-left">RR Maintenance Allowance</th>
                <th className="p-3 text-left">
                  RR Multiple Displacement Allowance
                </th>
                <th className="p-3 text-left">RR Ex-Gratia</th>
                <th className="p-3 text-left">RR Other Benefits</th>
                <th className="p-3 text-left bg-gray-200 sticky right-34 z-[30] shadow-md">
                  Payment Status
                </th>
                <th className={stickyActionHeader}>Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 whitespace-nowrap">
              {filteredPlots.map((plot, idx) => (
                <tr key={plot.id || idx} className={rowClass}>
                  <td className="p-3">{idx + 1}</td>
                  <td className="p-3">{plot.project_name || "N/A"}</td>
                  <td className="p-3">{plot.la_case_file_no || "N/A"}</td>
                  <td className="p-3">{plot.rr_employment || "N/A"}</td>
                  <td className="p-3">{plot.rr_cash_in_lieu || "N/A"}</td>
                  <td className="p-3">
                    {plot.rr_training_skill_upgradation || "N/A"}
                  </td>
                  <td className="p-3">{plot.rr_self_employment || "N/A"}</td>
                  <td className="p-3">
                    {plot.rr_special_allowance_st_ntfp || "N/A"}
                  </td>
                  <td className="p-3">
                    {plot.rr_homestead_allotment || "N/A"}
                  </td>
                  <td className="p-3">
                    {plot.rr_house_building_assistance || "N/A"}
                  </td>
                  <td className="p-3">{plot.rr_constructed_by || "N/A"}</td>
                  <td className="p-3">{plot.rr_transit_shed || "N/A"}</td>
                  <td className="p-3">
                    {plot.rr_transport_allowance || "N/A"}
                  </td>
                  <td className="p-3">
                    {plot.rr_maintenance_allowance || "N/A"}
                  </td>
                  <td className="p-3">
                    {plot.rr_multiple_displacement_allowance || "N/A"}
                  </td>
                  <td className="p-3">{plot.rr_exgratia || "N/A"}</td>
                  <td className="p-3">{plot.rr_other_benefits || "N/A"}</td>
                  <td className="p-3 bg-white sticky right-34 border-l border-gray-100 shadow-sm">
                    <button
                      className={`btn btn-xs btn-success text-white flex items-center gap-1 px-3 w-40 ${
                        isRestricted || loadingPlotId === plot.id
                          ? "!bg-gray-300 !text-gray-400 !border !border-gray-300 !cursor-not-allowed"
                          : "hover:bg-green-700"
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
                      ) : (
                        <HandCoins size={12} />
                      )}

                      {loadingPlotId === plot.id
                        ? "Processing..."
                        : paymentStatusMap[plot.id] === "success"
                        ? "Success"
                        : plot.payment_status === null
                        ? "Ready For Payment"
                        : "Processing..."}
                    </button>
                  </td>
                  <td className={stickyActionCell}>{ActionButtons(plot)}</td>
                </tr>
              ))}
            </tbody>
          </TableWrapper>
          <TableWrapper title="Grievance & Tribunal Details">
            <thead className="bg-gray-200 text-gray-700 sticky top-0 z-10 whitespace-nowrap shadow-md">
              <tr>
                <th className="p-3 text-left">#</th>
                <th className="p-3 text-left">Project Name</th>
                <th className="p-3 text-left">LA Case File No</th>
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
                <th className="p-3 text-left bg-gray-200 sticky right-34 z-[30] shadow-md">
                  Payment Status
                </th>
                <th className={stickyActionHeader}>Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 whitespace-nowrap">
              {filteredPlots.map((plot, idx) => (
                <tr
                  key={plot.id || idx}
                  className="hover:bg-gray-50 shadow-sm transition"
                >
                  <td className="p-3">{idx + 1}</td>
                  <td className="p-3">{plot.project_name || "N/A"}</td>
                  <td className="p-3">{plot.la_case_file_no || "N/A"}</td>
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
                  <td className="p-3 bg-white sticky right-34 border-l border-gray-100 shadow-sm">
                    <button
                      className={`btn btn-xs btn-success text-white flex items-center gap-1 px-3 w-40 ${
                        isRestricted || loadingPlotId === plot.id
                          ? "!bg-gray-300 !text-gray-400 !border !border-gray-300 !cursor-not-allowed"
                          : "hover:bg-green-700"
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
                      ) : (
                        <HandCoins size={12} />
                      )}

                      {loadingPlotId === plot.id
                        ? "Processing..."
                        : paymentStatusMap[plot.id] === "success"
                        ? "Success"
                        : plot.payment_status === null
                        ? "Ready For Payment"
                        : "Processing..."}
                    </button>
                  </td>
                  <td className={stickyActionCell}>{ActionButtons(plot)}</td>
                </tr>
              ))}
            </tbody>
          </TableWrapper>
          <TableWrapper title="Family Details">
            <thead className="bg-gray-200 text-gray-700 sticky top-0 z-10 whitespace-nowrap">
              <tr>
                <th className="p-3 text-left">#</th>
                <th className="p-3 text-left">Project Name</th>
                <th className="p-3 text-left">LA Case File No</th>
                <th className="p-3 text-left">Major Male</th>
                <th className="p-3 text-left">Major Female</th>
                <th className="p-3 text-left">Minor Male</th>
                <th className="p-3 text-left">Minor Female</th>
                <th className="p-3 text-left">Major Transgender</th>
                <th className="p-3 text-left">Minor Transgender</th>
                <th className="p-3 text-left">PwD Members</th>
                <th className="p-3 text-left">Orphan Members</th>
                <th className="p-3 text-left bg-gray-200 sticky right-34 z-[30] shadow-md">
                  Payment Status
                </th>
                <th className={stickyActionHeader}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 whitespace-nowrap">
              {filteredPlots.map((plot, idx) => (
                <tr key={plot.id || idx} className={rowClass}>
                  <td className="p-3">{idx + 1}</td>
                  <td className="p-3">{plot.project_name || "N/A"}</td>
                  <td className="p-3">{plot.la_case_file_no || "N/A"}</td>
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
                  <td className="p-3 bg-white sticky right-34 border-l border-gray-100 shadow-sm">
                    <button
                      className={`btn btn-xs btn-success text-white flex items-center gap-1 px-3 w-40 ${
                        isRestricted || loadingPlotId === plot.id
                          ? "!bg-gray-300 !text-gray-400 !border !border-gray-300 !cursor-not-allowed"
                          : "hover:bg-green-700"
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
                      ) : (
                        <HandCoins size={12} />
                      )}

                      {loadingPlotId === plot.id
                        ? "Processing..."
                        : paymentStatusMap[plot.id] === "success"
                        ? "Success"
                        : plot.payment_status === null
                        ? "Ready For Payment"
                        : "Processing..."}
                    </button>
                  </td>
                  <td className={stickyActionCell}>{ActionButtons(plot)}</td>
                </tr>
              ))}
            </tbody>
          </TableWrapper>
        </PlotTabs>
      )}
    </div>
  );
};

export default PlotTable;
