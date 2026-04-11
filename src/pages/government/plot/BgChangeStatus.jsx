import React, { useState, useMemo, useEffect, useCallback } from "react";
import { API_BASE_URL } from "../../../utils/config";
import PlotForm from "./PlotForm";
import {
  GovernmentPlotFields,
  LandAreaEvaluationFields,
  legalIssue,
  stickyActionCell,
  stickyActionHeader,
} from "../../../utils/constants";
import { useSelector } from "react-redux";
import FilterHeader from "./FilterHeader";
import PlotTabs from "./PlotTab";
import DeleteConfirmModal from "../../../shared/DeleteConfirmModal";
import ConfirmDelete from "../../../shared/ConfirmDelete";
import { apiClient } from "../../../utils/apiClient";
import SuccessMessage from "../../../shared/SuccessMessage";
import { useSuccessMessage } from "../../../hooks/useSuccessMessage";
import Pagination from "../../../shared/Pagination";
import { FolderUp } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import Loader from "../../../shared/Loader";

export const PRESENT_STATUS_MAP = {
  1: "Lease Case to Sub-Collector",
  2: "Lease Case to ADM (Rev Sec)",
  3: "Demand Raised",
  4: "Lease Sanctioned by Collector",
};
const stickyCol1Header =
  "p-3 text-left bg-gray-200 md:sticky md:left-0 z-[40] shadow-md ";

const stickyCol1Cell = "p-3 text-left bg-base-100 md:sticky md:left-0 shadow-sm ";

const stickyCol2Header =
  "p-3 text-left bg-gray-200 md:sticky md:left-[110px] z-[35] shadow-md ";

const stickyCol2Cell =
  "p-3 text-left bg-base-100 md:sticky md:left-[110px] shadow-sm ";
const Plots = () => {
  // const [plots, setPlots] = useState(plotData);
  const { modal, showSuccess, showError, closeModal } = useSuccessMessage();
  const [attachmentModal, setAttachmentModal] = useState({
    open: false,
    files: [],
    title: "",
  });
  const [paymentStatusMap, setPaymentStatusMap] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlot, setEditingPlot] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const userRole = useSelector((state) => state.auth.user?.role_name);
  const canEdit = userRole !== "Viewer";
  const canDelete = !(userRole === "Data Entry User" || userRole === "Viewer");
  const [activeFilterKey, setActiveFilterKey] = useState(null);
  const [plots, setPlots] = useState([]);
  const [filters, setFilters] = useState({});
  const [sortConfig, setSortConfig] = useState({
    key: "",
    direction: "",
  });
  const [loading, setLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletePlotList, setDeletePlotList] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const user = useSelector((state) => state.auth.user);
  const role = user?.role_name;
  const isRestricted = role === "Viewer";
  // selected project id (from redux / props / dropdown)
  const selectedProjectId = useSelector(
    (state) => state.selectedProject.project?.id,
  );
  const [loadingLeaseCaseNo, setLoadingLeaseCaseNo] = useState(null);
  const [selectedLeaseCaseNo, setSelectedLeaseCaseNo] = useState("");
  const token = useSelector((state) => state.auth.userToken);

  const getLeasePaymentKey = (plot) => plot?.lease_case_no || `plot_${plot?.id}`;

  const paymentCodeFromStatus = (status) => {
    if (status === "processing") return "PP";
    if (status === "complete") return "RC";
    if (status === "ready") return "RP";
    return "";
  };

  const paymentStatusFromCode = (code) => {
    if (code === "PP") return "processing";
    if (code === "RC") return "complete";
    if (code === "RP") return "ready";
    return "";
  };

  const leaseCaseOptions = useMemo(
    () => [...new Set(plots.map((p) => p.lease_case_no).filter(Boolean))],
    [plots],
  );
  const mapGovtPlot = (item) => ({
    id: item.id,
    project_id: item.project_id || "",
    mouza: item.mouza || "",
    tahasil: item.tahasil || "",
    thana_no: item.thana_no || "",
    ri_circle: item.ri_circle || "",
    khata_no: item.khata_no || "",
    kissam: item.kissam || "",
    name_of_ror: item.name_of_ror || "",
    plot_no: item.plot_no || "",
    total_area_acres: item.total_area_acres || "",
    proposed_area_acres: item.proposed_area_acres || "",
    total_area_hectares: item.total_area_hectares || "",
    proposed_area_hectares: item.proposed_area_hectares || "",
    lease_case_no: item.lease_case_no,
    present_status: PRESENT_STATUS_MAP[item.present_status] || "",
    ua_idco_to_tahasildar: item.ua_idco_to_tahasildar ? "Yes" : "No",
    case_details: item.case_details || "",
    action_to_be_taken: item.action_to_be_taken || "",
    ri_report: item.ri_report || "",
    proclamation: item.proclamation ? "Yes" : "No",
    objection_received: item.objection_received ? "Yes" : "No",
    others: item.others,
    modification_revision: item.modification_revision ? "Yes" : "No",
    misc_dr_case_prep: item.misc_dr_case_prep ? "Yes" : "No",
    misc_dr_case_prep_number: item.misc_dr_case_prep_number || "",
    reason_for_misc_dr_case: item.reason_for_misc_dr_case || "",
    tree_enumeration: item.tree_enumeration || "",
    order_sheet_prep: item.order_sheet_prep || "",
    lease_to_idco: item.lease_to_idco ? "Yes" : "No",
    lease_to_ua: item.lease_to_ua ? "Yes" : "No",
    remarks: item.remarks || "",
    ri_report_attachment: item.ri_report_attachment || "",
    tree_enumeration_attachment: item.tree_enumeration_attachment || "",
    lease_to_idco_attachment: item.lease_to_idco_attachment || "",
    lease_to_ua_attachment: item.lease_to_ua_attachment || "",
    legal_heir_case_no: item.legal_heir_case_no || "",
    land_case_no: item.land_case_no || "",
    land_case_date: item.land_case_date || "",
    land_case_type: item.land_case_type || "",
    land_case_status: item.land_case_status || "",
    land_case_details: item.land_case_details || "",
    land_area_total_acres: item.land_area_total_acres || "",
    land_area_total_hectares: item.land_area_total_hectares || "",
    land_area_acquired_acres: item.land_area_acquired_acres || "",
    land_area_acquired_hectares: item.land_area_acquired_hectares || "",
    market_value_per_acre: item.market_value_per_acre || "",
    basic_land_value: item.basic_land_value || "",
    land_value_with_mf: item.land_value_with_mf || "",
    no_of_trees: item.no_of_trees || "",
    total_value_of_trees: item.total_value_of_trees || "",
    no_of_house: item.no_of_house || "",
    value_of_house: item.value_of_house || "",
    details_of_other_structures: item.details_of_other_structures || "",
    value_of_other_structures: item.value_of_other_structures || "",
    total_value: item.total_value || "",
    solatium_100: item.solatium_100 || "",
    no_days_interest: item.no_days_interest || "",
    additional_12_percent: item.additional_12_percent || "",
    total_compensation: item.total_compensation || "",
    bench_market_value: item.bench_market_value || "",
    premium: item.premium || "",
    ground_rent: item.ground_rent || "",
    cess: item.cess || "",
    admin_charges: item.admin_charges || "",
    total_cost: item.total_cost || "",
    payment_status: item.payment_status || "",
  });
  const fetchPlots = useCallback(async () => {
    if (!selectedProjectId || !token) {
      setPlots([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const pageSize = 500;
      let currentPage = 1;
      let totalPageCount = 1;
      const allPlots = [];

      do {
        const res = await fetch(
          `${API_BASE_URL}/govtplots/govtPlotList?project_id=${selectedProjectId}&type=2&page=${currentPage}&limit=${pageSize}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );

        const json = await res.json();
        const pageData = (json.data || []).map(mapGovtPlot);

        allPlots.push(...pageData);
        totalPageCount = json.totalPages || 1;

        if (pageData.length === 0) break;
        currentPage += 1;
      } while (currentPage <= totalPageCount);

      setPlots(allPlots);
    } catch (error) {
      console.error("Failed to fetch plots", error);
    } finally {
      setLoading(false);
    }
  }, [selectedProjectId, token]);
  useEffect(() => {
    setPage(1);
  }, [selectedProjectId]);

  useEffect(() => {
    fetchPlots();
  }, [fetchPlots]);

  useEffect(() => {
    setPaymentStatusMap((prev) => {
      const merged = { ...prev };
      plots.forEach((plot) => {
        const key = getLeasePaymentKey(plot);
        if (!merged[key]) {
          merged[key] = paymentCodeFromStatus(plot.payment_status);
        }
      });
      return merged;
    });
  }, [plots]);

  useEffect(() => {
    if (!leaseCaseOptions.length) {
      setSelectedLeaseCaseNo("");
      return;
    }

    if (selectedLeaseCaseNo && !leaseCaseOptions.includes(selectedLeaseCaseNo)) {
      setSelectedLeaseCaseNo("");
    }
  }, [leaseCaseOptions, selectedLeaseCaseNo]);

  const openModal = (plot) => {
    if (plot) {
      const code = paymentStatusMap[getLeasePaymentKey(plot)] || "";
      setEditingPlot({
        ...plot,
        payment_status: paymentStatusFromCode(code) || plot.payment_status,
      });
    } else {
      setEditingPlot(null);
    }
    setIsModalOpen(true);
  };
  const onDelete = (plot) => {
    setDeletePlotList(plot);
    setIsDeleteModalOpen(true);
  };

  const renderAttachments = (attachments, title = "Attachments") => {
    if (!attachments) return "No Attachments";

    let files = [];

    // 1️⃣ If already an array
    if (Array.isArray(attachments)) {
      files = attachments.map((f) => {
        // API object
        if (typeof f === "object" && f !== null) {
          return f.file_name || f.path || f.url || "";
        }
        // String filename
        return String(f);
      });
    }

    // 2️⃣ If backend sent comma-separated string
    else if (typeof attachments === "string") {
      files = attachments
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean);
    }

    if (files.length === 0) return "No Attachments";

    const visibleFiles = files.slice(0, 3);
    const remainingCount = files.length - 3;

    return (
      <div className="text-sm text-gray-700 space-y-1">
        {visibleFiles.map((file, idx) => (
          <div
            key={idx}
            className="truncate max-w-[180px] cursor-pointer hover:underline"
            onClick={() =>
              setAttachmentModal({
                open: true,
                files,
                title,
              })
            }
          >
            {file}
          </div>
        ))}

        {remainingCount > 0 && (
          <div
            className="text-gray-500 font-semibold cursor-pointer hover:underline"
            onClick={() =>
              setAttachmentModal({
                open: true,
                files,
                title,
              })
            }
          >
            ... +{remainingCount} more
          </div>
        )}
      </div>
    );
  };
  const handleDelete = async () => {
    if (!deletePlotList) return;
    try {
      const data = await apiClient(
        `/govtplots/deleteGovtPlot/${deletePlotList.id}`,
        {
          method: "DELETE",
        },
      );
      if (data && data.success) {
        showSuccess(data.message || "Plot deleted successfully!");
        fetchPlots();
      } else {
        alert(data?.message || "Failed to delete Plot.");
      }
    } catch (err) {
      console.error("Delete error:", err);
      showError(err.message || "Plot Deleletd Successfully");
    } finally {
      setIsDeleteModalOpen(false);
      setDeletePlotList(null);
    }
  };
  const getUniqueValues = (key) => {
    const isPresent = (value) => {
      if (value == null) return false;
      if (typeof value === "string") return value.trim() !== "";
      return true;
    };

    return [...new Set(plots.map((p) => p[key]).filter(isPresent))];
  };
  const filteredPlots = useMemo(() => {
    let data = [...plots];

    // FILTERING
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        const filterValue = String(value).toLowerCase();
        data = data.filter((row) =>
          String(row[key] ?? "")
            .toLowerCase()
            .includes(filterValue),
        );
      }
    });
    if (sortConfig.key) {
      data.sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];

        if (aVal == null) return 1;
        if (bVal == null) return -1;

        return sortConfig.direction === "asc"
          ? String(aVal).localeCompare(String(bVal))
          : String(bVal).localeCompare(String(aVal));
      });
    }

    return data;
  }, [plots, filters, sortConfig]);

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
  const handleExport = () => {
    if (!filteredPlots.length) return;

    const headers = [
      "Sl No",
      "Khata No",
      "Plot No",
      "Thana No",
      "Mouza",
      "Tahasil",
      "RI Circle",
      "Kissam",
      "Name Of ROR",
      "Total Area Acres",
      "Proposed Area Acres",
      "Total Area Hectars",
      "Proposed Area Hectars",
      "Lease Case No",
      "Present Status",
      "UA/IDCO to Tahasildar",
      "Case Details",
      "Action To be Taken",
      "Ri Report",
      "Ri Report Attachment",
      "Proclamation",
      "Objection Recevied",
      "Others",
      "Modification/ Revesion",
      "Missing Case Prep/ DR Case",
      "Missing Case Prep/ DR Case Number",
      "Reason For Misc/ DR Case",
      "Tree Enumeration",
      "Tree Enumeration Attachment",
      "OrderSheet Prep",
      "Lease To IDCO",
      "Lease To IDCO Attachment",
      "Lease To UA",
      "Lease To UA Attachment",
      "Remarks",
      "Legal Heir Certificate No",
      "Land Case No",
      "Land Case Date",
      "Land Case Type",
      "Land Case Status",
      "Land Case Details",
      "Land Area Total (Acres)",
      "Land Area Total (Hectares)",
      "Land Area Accuired (Acres)",
      "Land Area Accuired (Hectres)",
      "Market Value Per Acres",
      "Bench market Value",
      "Premium",
      "Ground Rate",
      "Cess",
      "Admin Cost",
      "Total Cost",
      "Payment Status",
    ];

    const rows = filteredPlots.map((p) => [
      p.id,
      p.khata_no,
      p.plot_no,
      p.thana_no,
      p.mouza,
      p.tahasil,
      p.ri_circle,
      p.kissam,
      p.name_of_ror,
      p.total_area_acres,
      p.proposed_area_acres,
      p.total_area_hectares,
      p.proposed_area_hectares,
      p.lease_case_no,
      p.present_status,
      p.ua_idco_to_tahasildar,
      p.case_details,
      p.action_to_be_taken,
      p.ri_report,
      p.ri_report_attachment,
      p.proclamation,
      p.objection_received,
      p.others,
      p.modification_revision,
      p.misc_dr_case_prep,
      p.misc_dr_case_prep_number,
      p.reason_for_misc_dr_case,
      p.tree_enumeration,
      p.tree_enumeration_attachment,
      p.order_sheet_prep,
      p.lease_to_idco,
      p.lease_to_idco_attachment,
      p.lease_to_ua,
      p.lease_to_ua_attachment,
      p.remarks,
      p.legal_heir_case_no,
      p.land_case_no,
      p.land_case_date,
      p.land_case_type,
      p.land_case_status,
      p.land_case_details,
      p.land_area_total_acres,
      p.land_area_total_hectares,
      p.land_area_acquired_acres,
      p.land_area_acquired_hectares,
      p.market_value_per_acre,
      // p.basic_land_value,
      // p.land_value_with_mf,
      // p.no_of_trees,
      // p.total_value_of_trees,
      // p.no_of_house,
      // p.value_of_house,
      // p.details_of_other_structures,
      // p.value_of_other_structures,
      // p.total_value,
      // p.solatium_100,
      // p.no_days_interest,
      // p.additional_12_percent,
      // p.total_compensation,
      p.bench_market_value,
      p.premium,
      p.ground_rent,
      p.cess,
      p.admin_charges,
      p.total_cost,
      paymentStatusFromCode(getPaymentCode(p)) || p.payment_status,
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map((v) => `"${v ?? ""}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "government_plots.csv";
    link.click();

    URL.revokeObjectURL(url);
  };
  const { landType } = useParams();
  const navigate = useNavigate();

  const getPaymentCode = (plot) => {
    const leaseKey = getLeasePaymentKey(plot);
    if (paymentStatusMap[leaseKey]) return paymentStatusMap[leaseKey];
    return paymentCodeFromStatus(plot.payment_status);
  };

  const getPaymentCodeByLease = (leaseCaseNo) => {
    if (!leaseCaseNo) return "";
    if (paymentStatusMap[leaseCaseNo]) return paymentStatusMap[leaseCaseNo];

    const plot = plots.find((p) => p.lease_case_no === leaseCaseNo);
    return paymentCodeFromStatus(plot?.payment_status);
  };
  const handleGlobalPaymentStatusChange = async (code) => {
    if (isRestricted || !selectedLeaseCaseNo) return;

    const leasePlots = plots.filter((p) => p.lease_case_no === selectedLeaseCaseNo);
    if (!leasePlots.length) return;

    const targetPlot = leasePlots[0];

    if (code === "RC") {
      const updatedPlot = { ...targetPlot, payment_status: "complete" };
      setPaymentStatusMap((prev) => ({
        ...prev,
        [selectedLeaseCaseNo]: "RC",
      }));
      navigate(`/${landType}/land-cost`, { state: { plot: updatedPlot } });
      return;
    }

    if (code !== "RP" && code !== "PP") return;

    setLoadingLeaseCaseNo(selectedLeaseCaseNo);

    try {
      const payment_status = code === "RP" ? "ready" : "processing";

      await Promise.all(
        leasePlots.map((plot) =>
          apiClient("/govtplots/paymentReady", {
            method: "POST",
            body: {
              plot_id: plot.id,
              payment_status,
            },
          }),
        ),
      );

      setPaymentStatusMap((prev) => ({
        ...prev,
        [selectedLeaseCaseNo]: code,
      }));

      showSuccess("Payment status updated");

      if (code === "PP") {
        const updatedPlot = { ...targetPlot, payment_status: "processing" };
        setTimeout(() => {
          closeModal();
          navigate(`/${landType}/government/land-cost`, { state: { plot: updatedPlot } });
        }, 300);
      }
    } catch (err) {
      if (err.message === "Invalid or expired token") {
        navigate("/");
        return;
      }
      showError(err.message || "Network error. Please try again");
    } finally {
      setLoadingLeaseCaseNo(null);
    }
  };


  return (
    <main className="flex-1 overflow-y-auto space-y-2">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Government Land Plot</h2>

       <div className="grid grid-cols-4 gap-2 items-center justify-end">
          <select
            value={selectedLeaseCaseNo}
            onChange={(e) => setSelectedLeaseCaseNo(e.target.value)}
            className="select select-sm select-bordered min-w-[180px]"
            disabled={!leaseCaseOptions.length}
          >
            <option value="">Select Lease Case</option>
            {leaseCaseOptions.map((leaseNo) => (
              <option key={leaseNo} value={leaseNo}>
                {leaseNo}
              </option>
            ))}
          </select>

          <select
            value={getPaymentCodeByLease(selectedLeaseCaseNo) || ""}
            onChange={(e) => handleGlobalPaymentStatusChange(e.target.value)}
            className={`select select-sm select-bordered min-w-[180px] text-md font-medium ${
              getPaymentCodeByLease(selectedLeaseCaseNo) === "RP"
                ? "bg-orange-600 text-white border-orange-600"
                : getPaymentCodeByLease(selectedLeaseCaseNo) === "PP"
                  ? "bg-green-700 text-white border-green-700"
                  : getPaymentCodeByLease(selectedLeaseCaseNo) === "RC"
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 border-gray-300"
            }`}
            disabled={
              isRestricted ||
              !selectedLeaseCaseNo ||
              loadingLeaseCaseNo === selectedLeaseCaseNo
            }
          >
            <option value="" disabled>
              Payment Status
            </option>
            <option value="RP">Ready for Payment</option>
            <option value="PP">Payment Processing</option>
            <option value="RC">Payment Complete</option>
          </select>

          <button
            className="btn btn-sm bg-green-600 text-white"
            onClick={handleExport}
            // disabled={!filteredPlots.length}
          >
            <FolderUp size={18} /> Export
          </button>

          <button
            className={`btn btn-primary btn-sm text-white whitespace-nowrap
        ${
          isRestricted
            ? "!bg-gray-300 !text-gray-400 !border !border-gray-300 !cursor-not-allowed"
            : ""
        }
      `}
            onClick={() =>openModal()}
            disabled={isRestricted}
          >
            Add Plot
          </button>
        </div>
      </div>

      <div>
        {loading && selectedProjectId ? (
          <Loader message="Loading plot list..." />
        ) : null}
        {!loading && (!selectedProjectId || filteredPlots.length === 0) && (
          <div className="py-10 text-center text-gray-600">
            {!selectedProjectId ? (
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
        {!loading && selectedProjectId && filteredPlots.length > 0 && (
          <>
            <PlotTabs>
              <div
                className=" max-h-[400px] overflow-y-auto"
                style={{ scrollbarWidth: "thin" }}
              >
                <table
                  className="table w-full whitespace-nowrap overflow-x-auto"
                  title="Basic Details"
                >
                  <thead className="bg-gray-200 sticky top-0 z-10">
                    <tr>
                      <th className="">Sl/No</th>
                      <th className={stickyCol1Header}>
                        <FilterHeader
                          column={GovernmentPlotFields.find(
                            (c) => c.key === "khata_no",
                          )}
                          filters={filters}
                          setFilters={setFilters}
                          sortConfig={sortConfig}
                          setSortConfig={setSortConfig}
                          getUniqueValues={getUniqueValues}
                          activeFilterKey={activeFilterKey}
                          setActiveFilterKey={setActiveFilterKey}
                        />
                      </th>

                      {/* PLOT NO */}
                      <th className={stickyCol2Header}>
                        <FilterHeader
                          column={GovernmentPlotFields.find(
                            (c) => c.key === "plot_no",
                          )}
                          filters={filters}
                          setFilters={setFilters}
                          sortConfig={sortConfig}
                          setSortConfig={setSortConfig}
                          getUniqueValues={getUniqueValues}
                          activeFilterKey={activeFilterKey}
                          setActiveFilterKey={setActiveFilterKey}
                        />
                      </th>

                      {GovernmentPlotFields.filter(
                        (c) =>
                          !["khata_no", "plot_no", "payment_status"].includes(
                            c.key,
                          ),
                      ).map((col) => (
                        <th key={col.key}>
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

                      <th className={stickyActionHeader}>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {plots.length > 0 ? (
                      paginatedPlots.map((plot, idx) => (
                        <tr
                          key={plot.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td>{(page - 1) * limit + idx + 1}</td>
                          <td className={stickyCol1Cell}>
                            {plot.khata_no || "No data found"}
                          </td>
                          <td className={stickyCol2Cell}>
                            {plot.plot_no || "No data found"}
                          </td>
                          <td>{plot.thana_no || "No data found"}</td>
                          <td>{plot.mouza || "No data found"}</td>
                          <td>{plot.tahasil || "No data found"}</td>
                          <td>{plot.ri_circle || "No data found"}</td>
                          <td>{plot.kissam || "No data found"}</td>
                          <td>{plot.name_of_ror || "No data found"}</td>
                          <td>{plot.total_area_acres || "No data found"}</td>
                          <td>{plot.proposed_area_acres || "No data found"}</td>
                          <td>{plot.total_area_hectares || "No data found"}</td>
                          <td>{plot.proposed_area_hectares || "No data found"}</td>
                          <td>{plot.lease_case_no || "No data found"}</td>
                          <td>{plot.present_status || "No data found"}</td>
                          <td>{plot.ua_idco_to_tahasildar || "No data found"}</td>
                          <td>{plot.case_details || "No data found"}</td>
                          <td>{plot.action_to_be_taken || "No data found"}</td>
                          <td>{plot.ri_report || "No data found"}</td>
                          <td>
                            {renderAttachments(
                              plot.ri_report_attachment.file_name,
                              "RI Report Attachments" || "No data found",
                            )}
                          </td>
                          <td>{plot.proclamation || "No data found"}</td>
                          <td>{plot.objection_received || "No data found"}</td>
                          <td>{plot.others || "No data found"}</td>
                          <td>{plot.modification_revision || "No data found"}</td>
                          <td>{plot.misc_dr_case_prep || "No data found"}</td>
                          <td>{plot.misc_dr_case_prep_number || "No data found"}</td>
                          <td>{plot.reason_for_misc_dr_case || "No data found"}</td>
                          <td>{plot.tree_enumeration || "No data found"}</td>
                          <td>
                            {renderAttachments(
                              plot.tree_enumeration_attachment.file_name,
                              "Tree Enumeration Attachments" || "No data found",
                            )}
                          </td>
                          <td>{plot.order_sheet_prep || "No data found"}</td>
                          <td>{plot.lease_to_idco || "No data found"}</td>
                          <td>
                            {renderAttachments(
                              plot.lease_to_idco_attachment.file_name,
                              "Lease to IDCO Attachments" || "No data found",
                            )}
                          </td>
                          <td>{plot.lease_to_ua || "No data found"}</td>
                          <td>
                            {renderAttachments(
                              plot.lease_to_ua_attachment.file_name,
                              "Lease to UA Attachments" || "No data found",
                            )}
                          </td>
                          <td>{plot.remarks || "No data found"}</td>
                          <td className={stickyActionCell}>
                            <select
                              className="select select-sm bg-gray-100 border border-gray-300 w-[42px] "
                              defaultValue=""
                              onChange={(e) => {
                                const action = e.target.value;
                                e.target.value = "";

                                if (action === "edit" && canEdit) {
                                  openModal(plot);
                                }

                                if (action === "delete" && canDelete) {
                                  onDelete(plot);
                                }
                              }}
                              // disabled={!canEdit && !canDelete}
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
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="8"
                          className="text-center py-6 text-gray-500"
                        >
                          No data found. Click{" "}
                          <span className="font-semibold">+ Add Plot</span> to
                          create one.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {attachmentModal.open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                  <div className="bg-white rounded-xl shadow-xl w-[500px] max-h-[70vh] overflow-hidden">
                    {/* Header */}
                    <div className="flex justify-between items-center px-4 py-3 border-b">
                      <h3 className="font-bold text-lg">
                        {attachmentModal.title}
                      </h3>
                      <button
                        className="text-gray-500 hover:text-red-600 text-xl"
                        onClick={() =>
                          setAttachmentModal({
                            open: false,
                            files: [],
                            title: "",
                          })
                        }
                      >
                        ✕
                      </button>
                    </div>

                    {/* Body */}
                    <div className="p-4 overflow-y-auto space-y-2">
                      {attachmentModal.files.map((file, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between bg-gray-100 px-3 py-2 rounded-lg"
                        >
                          <span className="truncate max-w-[350px]">{file}</span>
                          <a
                            href={file}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline text-sm"
                          >
                            View
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div
                className="overflow-x-auto max-h-[400px] overflow-y-auto"
                style={{ scrollbarWidth: "thin" }}
              >
                <table
                  className="table w-full whitespace-nowrap"
                  title="Legal Issues"
                >
                  <thead className="bg-gray-200 sticky top-0 z-10">
                    <tr>
                      <th>Sl/No</th>
                      <th className={stickyCol1Header}>
                        <FilterHeader
                          column={legalIssue.find((c) => c.key === "khata_no")}
                          filters={filters}
                          setFilters={setFilters}
                          sortConfig={sortConfig}
                          setSortConfig={setSortConfig}
                          getUniqueValues={getUniqueValues}
                          activeFilterKey={activeFilterKey}
                          setActiveFilterKey={setActiveFilterKey}
                        />
                      </th>

                      {/* PLOT NO */}
                      <th className={stickyCol2Header}>
                        <FilterHeader
                          column={legalIssue.find((c) => c.key === "plot_no")}
                          filters={filters}
                          setFilters={setFilters}
                          sortConfig={sortConfig}
                          setSortConfig={setSortConfig}
                          getUniqueValues={getUniqueValues}
                          activeFilterKey={activeFilterKey}
                          setActiveFilterKey={setActiveFilterKey}
                        />
                      </th>

                      {legalIssue
                        .filter(
                          (c) =>
                            !["khata_no", "plot_no", "payment_status"].includes(
                              c.key,
                            ),
                        )
                        .map((col) => (
                          <th key={col.key}>
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

                      <th className={stickyActionHeader}>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {plots.length > 0 ? (
                      paginatedPlots.map((plot, idx) => (
                        <tr
                          key={plot.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td>{(page - 1) * limit + idx + 1}</td>
                          <td className={stickyCol1Cell}>
                            {plot.khata_no || "No data found"}
                          </td>
                          <td className={stickyCol2Cell}>
                            {plot.plot_no || "No data found"}
                          </td>
                          <td>{plot.legal_heir_case_no || "No data found"}</td>
                          <td>{plot.land_case_no || "No data found"}</td>
                          <td>{plot.land_case_date || "No data found"}</td>
                          <td>{plot.land_case_type || "No data found"}</td>
                          <td
                            className={`
 text-gray-700 text-center rounded-full btn btn-xs mt-3
    ${
      plot.land_case_status === "Pending"
        ? "bg-red-100 text-red-700 border border-red-300 text-xs"
        : plot.land_case_status === "In Progress"
          ? "bg-yellow-100 text-yellow-700 border border-yellow-300 text-xs"
          : plot.land_case_status === "Disposed"
            ? "bg-green-100 text-green-700 border border-green-300 text-xs"
            : "bg-gray-200"
    }
  `}
                          >
                            {plot.land_case_status || "No data found"}
                          </td>

                          <td>{plot.land_case_details || "No data found"}</td>
                          <td className={stickyActionCell}>
                            <select
                              className="select select-sm bg-gray-100 border border-gray-300 w-[42px]"
                              defaultValue=""
                              onChange={(e) => {
                                const action = e.target.value;
                                e.target.value = "";

                                if (action === "edit" && canEdit) {
                                  openModal(plot);
                                }

                                if (action === "delete" && canDelete) {
                                  onDelete(plot);
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
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="8"
                          className="text-center py-6 text-gray-500"
                        >
                          No data found. Click{" "}
                          <span className="font-semibold">+ Add Plot</span> to
                          create one.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div
                className="overflow-x-auto max-h-[400px] overflow-y-auto"
                style={{ scrollbarWidth: "thin" }}
              >
                <table
                  className="table w-full whitespace-nowrap"
                  title="Land Area Valution"
                >
                  <thead className="bg-gray-200 sticky top-0 z-10">
                    <tr>
                      <th>Sl/No</th>
                      <th className={stickyCol1Header}>
                        <FilterHeader
                          column={legalIssue.find((c) => c.key === "khata_no")}
                          filters={filters}
                          setFilters={setFilters}
                          sortConfig={sortConfig}
                          setSortConfig={setSortConfig}
                          getUniqueValues={getUniqueValues}
                          activeFilterKey={activeFilterKey}
                          setActiveFilterKey={setActiveFilterKey}
                        />
                      </th>

                      {/* PLOT NO */}
                      <th className={stickyCol2Header}>
                        <FilterHeader
                          column={legalIssue.find((c) => c.key === "plot_no")}
                          filters={filters}
                          setFilters={setFilters}
                          sortConfig={sortConfig}
                          setSortConfig={setSortConfig}
                          getUniqueValues={getUniqueValues}
                          activeFilterKey={activeFilterKey}
                          setActiveFilterKey={setActiveFilterKey}
                        />
                      </th>

                      {LandAreaEvaluationFields.filter(
                        (c) =>
                          !["khata_no", "plot_no", "payment_status"].includes(
                            c.key,
                          ),
                      ).map((col) => (
                        <th key={col.key}>
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

                      <th className={stickyActionHeader}>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {plots.length > 0 ? (
                      paginatedPlots.map((plot, idx) => (
                        <tr
                          key={plot.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td>{(page - 1) * limit + idx + 1}</td>
                          <td className={stickyCol1Cell}>
                            {plot.khata_no || "No data found"}
                          </td>
                          <td className={stickyCol2Cell}>
                            {plot.plot_no || "No data found"}
                          </td>
                          <td>{plot.land_area_total_acres || "No data found"}</td>
                          <td>{plot.land_area_total_hectares || "No data found"}</td>
                          <td>{plot.land_area_acquired_acres || "No data found"}</td>
                          <td>
                            {plot.land_area_acquired_hectares || "No data found"}
                          </td>
                          <td>{plot.market_value_per_acre || "No data found"}</td>
                          <td>{plot.bench_market_value || "No data found"}</td>
                          <td>{plot.premium || "No data found"}</td>
                          <td>{plot.ground_rent || "No data found"}</td>
                          <td>{plot.cess || "No data found"}</td>
                          <td>{plot.admin_charges || "No data found"}</td>
                          <td>{plot.total_cost || "No data found"}</td>
                          {/* <td>{plot.basic_land_value || "No data found"}</td>
                      <td>{plot.land_value_with_mf || "No data found"}</td>
                      <td>{plot.no_of_trees || "No data found"}</td>
                      <td>{plot.total_value_of_trees || "No data found"}</td>
                      <td>{plot.no_of_house || "No data found"}</td>
                      <td>{plot.value_of_house || "No data found"}</td>
                      <td>{plot.details_of_other_structures || "No data found"}</td>
                      <td>{plot.value_of_other_structures || "No data found"}</td>
                      <td>{plot.total_value || "No data found"}</td>
                      <td>{plot.solatium_100 || "No data found"}</td>
                      <td>{plot.no_days_interest || "No data found"}</td>
                      <td>{plot.additional_12_percent || "No data found"}</td>
                      <td>{plot.total_compensation || "No data found"}</td> */}
                          <td className={stickyActionCell}>
                            <select
                              className="select select-sm bg-gray-100 border border-gray-300 w-[42px]"
                              defaultValue=""
                              onChange={(e) => {
                                const action = e.target.value;
                                e.target.value = "";

                                if (action === "edit" && canEdit) {
                                  openModal(plot);
                                }

                                if (action === "delete" && canDelete) {
                                  onDelete(plot);
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
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="8"
                          className="text-center py-6 text-gray-500"
                        >
                          No data found. Click{" "}
                          <span className="font-semibold">+ Add Plot</span> to
                          create one.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </PlotTabs>
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

      {isModalOpen && (
        <PlotForm
          close={() => setIsModalOpen(false)}
          fetchPlots={fetchPlots}
          editingPlot={editingPlot}
        />
      )}
      {isDeleteModalOpen && deletePlotList && (
        <ConfirmDelete
          isOpen={isDeleteModalOpen}
          title="Confirm Delete"
          message={`Are you sure you want to delete plot no "${deletePlotList.plot_no}"?`}
          onConfirm={handleDelete}
          onCancel={() => {
            setIsDeleteModalOpen(false);
            setDeletePlotList(null);
          }}
        />
      )}
      <SuccessMessage
        open={modal.open}
        type={modal.type}
        message={modal.message}
        onClose={closeModal}
      />
    </main>
  );
};

export default Plots;


