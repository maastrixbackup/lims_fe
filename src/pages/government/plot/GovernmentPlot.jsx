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

export const PRESENT_STATUS_MAP = {
  1: "Lease Case to Sub-Collector",
  2: "Lease Case to ADM (Rev Sec)",
  3: "Demand Raised",
  4: "Lease Sanctioned by Collector",
};
const stickyCol1Header =
  "p-3 text-left bg-gray-200 md:sticky md:left-0 z-[40] shadow-md ";

const stickyCol1Cell = "p-3 text-left bg-white md:sticky md:left-0 shadow-sm ";

const stickyCol2Header =
  "p-3 text-left bg-gray-200 md:sticky md:left-[110px] z-[35] shadow-md ";

const stickyCol2Cell =
  "p-3 text-left bg-white md:sticky md:left-[110px] shadow-sm ";
const Plots = () => {
  // const [plots, setPlots] = useState(plotData);
  const { modal, showSuccess, showError, closeModal } = useSuccessMessage();
  const [attachmentModal, setAttachmentModal] = useState({
    open: false,
    files: [],
    title: "",
  });

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
  const [loading, setLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletePlotList, setDeletePlotList] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  // selected project id (from redux / props / dropdown)
  const selectedProjectId = useSelector(
    (state) => state.selectedProject.project?.id,
  );

  const token = useSelector((state) => state.auth.userToken);
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
    legal_heir_certificate_no: item.legal_heir_certificate_no || "",
    land_case_no: item.land_case_no || "",
    land_case_date: item.land_case_date || "",
    land_case_type: item.land_case_type || "",
    land_case_status: item.land_case_status || "",
    land_case_action: item.land_case_action || "",
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
    ground_rate: item.ground_rate || "",
    cess: item.cess || "",
    admin_cost: item.admin_cost || "",
    total_cost: item.total_cost || "",
    payment_status:item.payment_status || ""
  });
  const fetchPlots = useCallback(async () => {
    if (!selectedProjectId || !token) return;

    try {
      setLoading(true);

      const res = await fetch(
        `${API_BASE_URL}/govtplots/govtPlotList?project_id=${selectedProjectId}&type=2&page=${page}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      const json = await res.json();

      const mappedData = json.data.map(mapGovtPlot);

      setPlots(mappedData);

      // ✅ FIX HERE
      setTotalPages(json.totalPages || Math.ceil(json.total / limit));
    } catch (error) {
      console.error("Failed to fetch plots", error);
    } finally {
      setLoading(false);
    }
  }, [selectedProjectId, page, limit, token]);
  useEffect(() => {
    setPage(1);
  }, [selectedProjectId]);

  useEffect(() => {
    fetchPlots();
  }, [fetchPlots]);

  const openModal = (plot) => {
    setEditingPlot(plot);
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
    return [...new Set(plots.map((p) => p[key]).filter(Boolean))];
  };
  const filteredPlots = useMemo(() => {
    let data = [...plots];

    // FILTERING
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        data = data.filter((row) =>
          String(row[key] ?? "")
            .toLowerCase()
            .includes(value.toLowerCase()),
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

  return (
    <main className="flex-1 overflow-y-auto space-y-2">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Government Land Plot</h2>
        <button className="btn btn-primary" onClick={() => openModal()}>
          + Add Plot
        </button>
      </div>
      <div>
        {(!selectedProjectId || filteredPlots.length === 0) && (
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
        {selectedProjectId && filteredPlots.length > 0 && (
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
                      (c) => !["khata_no", "plot_no"].includes(c.key),
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
                    filteredPlots.map((plot, idx) => (
                      <tr
                        key={plot.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td>{idx + 1}</td>
                        <td className={stickyCol1Cell}>
                          {plot.khata_no || "No Data"}
                        </td>
                        <td className={stickyCol2Cell}>
                          {plot.plot_no || "No Data"}
                        </td>
                        <td>{plot.thana_no || "No Data"}</td>
                        <td>{plot.mouza || "No Data"}</td>
                        <td>{plot.tahasil || "No Data"}</td>
                        <td>{plot.ri_circle || "No Data"}</td>
                        <td>{plot.kissam || "No Data"}</td>
                        <td>{plot.name_of_ror || "No Data"}</td>
                        <td>{plot.total_area_acres || "No Data"}</td>
                        <td>{plot.proposed_area_acres || "No Data"}</td>
                        <td>{plot.total_area_hectares || "No Data"}</td>
                        <td>{plot.proposed_area_hectares || "No Data"}</td>
                        <td>{plot.lease_case_no || "No Data"}</td>
                        <td>{plot.present_status || "No Data"}</td>
                        <td>{plot.ua_idco_to_tahasildar || "No Data"}</td>
                        <td>{plot.case_details || "No Data"}</td>
                        <td>{plot.action_to_be_taken || "No Data"}</td>
                        <td>{plot.ri_report || "No Data"}</td>
                        <td>
                          {renderAttachments(
                            plot.ri_report_attachment.file_name,
                            "RI Report Attachments" || "No Data",
                          )}
                        </td>
                        <td>{plot.proclamation || "No Data"}</td>
                        <td>{plot.objection_received || "No Data"}</td>
                        <td>{plot.others || "No Data"}</td>
                        <td>{plot.modification_revision || "No Data"}</td>
                        <td>{plot.misc_dr_case_prep || "No Data"}</td>
                        <td>{plot.misc_dr_case_prep_number || "No Data"}</td>
                        <td>{plot.reason_for_misc_dr_case || "No Data"}</td>
                        <td>{plot.tree_enumeration || "No Data"}</td>
                        <td>
                          {renderAttachments(
                            plot.tree_enumeration_attachment.file_name,
                            "Tree Enumeration Attachments" || "No Data",
                          )}
                        </td>
                        <td>{plot.order_sheet_prep || "No Data"}</td>
                        <td>{plot.lease_to_idco || "No Data"}</td>
                        <td>
                          {renderAttachments(
                            plot.lease_to_idco_attachment.file_name,
                            "Lease to IDCO Attachments" || "No Data",
                          )}
                        </td>
                        <td>{plot.lease_to_ua || "No Data"}</td>
                        <td>
                          {renderAttachments(
                            plot.lease_to_ua_attachment.file_name,
                            "Lease to UA Attachments" || "No Data",
                          )}
                        </td>
                        <td>{plot.remarks || "No Data"}</td>
                        <td>{plot.payment_status || "No Data"}</td>
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
                        No plots found. Click{" "}
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
                      .filter((c) => !["khata_no", "plot_no"].includes(c.key))
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
                    filteredPlots.map((plot, idx) => (
                      <tr
                        key={plot.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td>{idx + 1}</td>
                        <td className={stickyCol1Cell}>
                          {plot.khata_no || "No Data"}
                        </td>
                        <td className={stickyCol2Cell}>
                          {plot.plot_no || "No Data"}
                        </td>
                        <td>{plot.legal_heir_certificate_no || "no data"}</td>
                        <td>{plot.land_case_no || "no data"}</td>
                        <td>{plot.land_case_date || "no data"}</td>
                        <td>{plot.land_case_type || "no data"}</td>
                        <td
                          className={`
 text-gray-700 text-center rounded-full btn btn-xs mt-3
    ${
      plot.land_case_status === "Pending"
        ? "bg-warning/70"
        : plot.land_case_status === "In Progress"
          ? "bg-blue-200"
          : plot.land_case_status === "Complete"
            ? "bg-green-200"
            : "bg-gray-200"
    }
  `}
                        >
                          {plot.land_case_status || "No Data"}
                        </td>

                        <td>{plot.land_case_action || "no data"}</td>
                        <td>{plot.payment_status || "No Data"}</td>

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
                        No plots found. Click{" "}
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
                      (c) => !["khata_no", "plot_no"].includes(c.key),
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
                    filteredPlots.map((plot, idx) => (
                      <tr
                        key={plot.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td>{idx + 1}</td>
                        <td className={stickyCol1Cell}>
                          {plot.khata_no || "No Data"}
                        </td>
                        <td className={stickyCol2Cell}>
                          {plot.plot_no || "No Data"}
                        </td>
                        <td>{plot.land_area_total_acres || "no data"}</td>
                        <td>{plot.land_area_total_hectares || "no data"}</td>
                        <td>{plot.land_area_acquired_acres || "no data"}</td>
                        <td>{plot.land_area_acquired_hectares || "no data"}</td>
                        <td>{plot.market_value_per_acre || "no data"}</td>
                        <td>{plot.bench_market_value || "no data"}</td>
                        <td>{plot.premium || "no data"}</td>
                        <td>{plot.ground_rate || "no data"}</td>
                        <td>{plot.cess || "no data"}</td>
                        <td>{plot.admin_charges || "no data"}</td>
                        <td>{plot.total_cost || "no data"}</td>
                        <td>{plot.payment_status || "No Data"}</td>
                        {/* <td>{plot.basic_land_value || "no data"}</td>
                      <td>{plot.land_value_with_mf || "no data"}</td>
                      <td>{plot.no_of_trees || "no data"}</td>
                      <td>{plot.total_value_of_trees || "no data"}</td>
                      <td>{plot.no_of_house || "no data"}</td>
                      <td>{plot.value_of_house || "no data"}</td>
                      <td>{plot.details_of_other_structures || "no data"}</td>
                      <td>{plot.value_of_other_structures || "no data"}</td>
                      <td>{plot.total_value || "no data"}</td>
                      <td>{plot.solatium_100 || "no data"}</td>
                      <td>{plot.no_days_interest || "no data"}</td>
                      <td>{plot.additional_12_percent || "no data"}</td>
                      <td>{plot.total_compensation || "no data"}</td> */}
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
                        No plots found. Click{" "}
                        <span className="font-semibold">+ Add Plot</span> to
                        create one.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </PlotTabs>
        )}
      </div>
      {selectedProjectId && (
        <Pagination
          page={page}
          setPage={setPage}
          limit={limit}
          setLimit={setLimit}
          totalPages={totalPages}
        />
      )}

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
