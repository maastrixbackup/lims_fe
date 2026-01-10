import React, { useState, useMemo, useEffect, useCallback } from "react";
import { API_BASE_URL } from "../../../utils/config";
import PlotForm from "./PlotForm";
import {
  GovernmentPlotFields,
  stickyActionCell,
  stickyActionHeader,
} from "../../../utils/constants";
import { useSelector } from "react-redux";
import FilterHeader from "./FilterHeader";
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
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({});
  const [sortConfig, setSortConfig] = useState({
    key: "",
    direction: "",
  });
 const [loading, setLoading] = useState(false); 
  // selected project id (from redux / props / dropdown)
  const selectedProjectId = useSelector(
    (state) => state.selectedProject.project?.id
  );

  const token = useSelector((state) => state.auth.userToken);
  const mapGovtPlot = (item) => ({
    id: item.id,
    projectId: item.project_id || "",
    village: item.mouza || "",
    tahashil: item.tahasil || "",
    thanaNo: item.thana_no || "",
    riCircle: item.ri_circle || "",
    khataNo: item.khata_no || "",
    kissam: item.kissam || "",
    rorName: item.name_of_ror || "",
    plotNo: item.plot_no || "",
    totalAreaAcres: item.total_area_acres || "",
    proposedAreaAcres: item.proposed_area_acres || "",
    totalAreaHectares: item.total_area_hectares || "",
    proposedAreaHectares: item.proposed_area_hectares || "",
    leaseCaseNo: item.lease_case_no,
    presentStatus: PRESENT_STATUS_MAP[item.present_status] || "",
    uaIdcoToTahasildar: item.ua_idco_to_tahasildar ? "Yes" : "No",
    caseDetails: item.case_details || "",
    actionToBeTaken: item.action_to_be_taken || "",
    riReport: item.ri_report || "",
    proclamation: item.proclamation ? "Yes" : "No",
    objectionReceived: item.objection_received ? "Yes" : "No",
    others: item.others,
    modificationRevision: item.modification_revision ? "Yes" : "No",
    missingCasePrep: item.misc_dr_case_prep ? "Yes" : "No",
    missingCasePrepNo: item.misc_dr_case_prep_number || "",
    reasonForMiscDrCase: item.reason_for_misc_dr_case || "",
    treeEnumeration: item.tree_enumeration || "",
    orderSheet: item.order_sheet_prep || "",
    leaseToIDCO: item.lease_to_idco ? "Yes" : "No",
    leaseToUA: item.lease_to_ua ? "Yes" : "No",
    remarks: item.remarks || "",
    riReportAttachment: item.ri_report_attachment || "",
    treeEnumerationAttachment: item.tree_enumeration_attachment || "",
    leaseToIDCOAttachment: item.lease_to_idco_attachment || "",
    leaseToUAAttachment: item.lease_to_ua_attachment || "",
  });
  const fetchPlots = useCallback(async () => {
    if (!selectedProjectId || !token) return;

    try {
      setLoading(true);

      const res = await fetch(
        `${API_BASE_URL}/govtplots/govtPlotList?project_id=${selectedProjectId}&page=1`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const json = await res.json();
      const mappedData = json.data.map(mapGovtPlot);

      setPlots(mappedData);

    } catch (error) {
      console.error("Failed to fetch plots", error);
    } finally {
      setLoading(false);
    }
  }, [selectedProjectId, page, token]);
 
  useEffect(() => {
    fetchPlots();
  }, [fetchPlots]);

  const onEdit = (plot) => {
    setEditingPlot(plot);
    setIsModalOpen(true);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const renderAttachments = (attachments, title = "Attachments") => {
    if (!attachments) return "No Attachments";

    const files = Array.isArray(attachments)
      ? attachments
      : attachments.split(",").map((f) => f.trim());

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

  const confirmDelete = () => {
    setPlots(plots.filter((p) => p.id !== deleteConfirm.id));
    setDeleteConfirm(null);
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
            .includes(value.toLowerCase())
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
      <div className="card bg-white shadow-lg rounded-2xl">
        <div
          className="overflow-x-auto max-h-[400px] overflow-y-auto"
          style={{ scrollbarWidth: "thin" }}
        >
          <table className="table w-full whitespace-nowrap">
            <thead className="bg-gray-200 sticky top-0 z-10">
              <tr>
                <th>Sl/No</th>
                <th className={stickyCol1Header}>
                  <FilterHeader
                    column={GovernmentPlotFields.find(
                      (c) => c.key === "khataNo"
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
                      (c) => c.key === "plotNo"
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
                  (c) => !["khataNo", "plotNo"].includes(c.key)
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
                    <td className={stickyCol1Cell}>{plot.khataNo || "No Data"}</td>
                    <td className={stickyCol2Cell}>{plot.plotNo || "No Data"}</td>
                    <td>{plot.thanaNo || "No Data"}</td>
                    <td>{plot.village || "No Data"}</td>
                    <td>{plot.tahashil || "No Data"}</td>
                    <td>{plot.riCircle || "No Data"}</td>
                    <td>{plot.kissam || "No Data"}</td>
                    <td>{plot.rorName || "No Data"}</td>
                    <td>{plot.totalAreaAcres || "No Data"}</td>
                    <td>{plot.proposedAreaAcres || "No Data"}</td>
                    <td>{plot.totalAreaHectares || "No Data"}</td>
                    <td>{plot.proposedAreaHectares || "No Data"}</td>
                    <td>{plot.leaseCaseNo || "No Data"}</td>
                    <td>{plot.presentStatus || "No Data"}</td>
                    <td>{plot.uaIdcoToTahasildar || "No Data"}</td>
                    <td>{plot.caseDetails || "No Data"}</td>
                    <td>{plot.actionToBeTaken || "No Data"}</td>
                    <td>{plot.riReport || "No Data"}</td>
                    <td>
                      {renderAttachments(
                        plot.riReportAttachment,
                        "RI Report Attachments" || "No Data"
                      )}
                    </td>
                    <td>{plot.proclamation || "No Data"}</td>
                    <td>{plot.objectionReceived || "No Data"}</td>
                    <td>{plot.others || "No Data"}</td>
                    <td>{plot.modificationRevision || "No Data"}</td>
                    <td>{plot.missingCasePrep || "No Data"}</td>
                    <td>{plot.missingCasePrepNo || "No Data"}</td>
                    <td>{plot.reasonForMiscDrCase || "No Data"}</td>
                    <td>{plot.treeEnumeration || "No Data"}</td>
                    <td>
                      {renderAttachments(
                        plot.treeEnumerationAttachment,
                        "Tree Enumeration Attachments" || "No Data"
                      )}
                    </td>
                    <td>{plot.orderSheet || "No Data"}</td>
                    <td>{plot.leaseToIDCO || "No Data"}</td>
                    <td>
                      {renderAttachments(
                        plot.leaseToIDCOAttachment,
                        "Lease to IDCO Attachments" || "No Data"
                      )}
                    </td>
                    <td>{plot.leaseToUA || "No Data"}</td>
                    <td>
                      {renderAttachments(
                        plot.leaseToUAAttachment,
                        "Lease to UA Attachments" || "No Data"
                      )}
                    </td>
                    <td>{plot.remarks || "No Data"}</td>
                    <td className={stickyActionCell}>
                      <select
                        className="select select-sm bg-gray-100 border border-gray-300 w-[42px] "
                        defaultValue=""
                        onChange={(e) => {
                          const action = e.target.value;
                          e.target.value = "";

                          if (action === "edit" && canEdit) {
                            onEdit(v);
                          }

                          if (action === "delete" && canDelete) {
                            onDelete(v);
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
                  <td colSpan="8" className="text-center py-6 text-gray-500">
                    No plots found. Click{" "}
                    <span className="font-semibold">+ Add Plot</span> to create
                    one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {attachmentModal.open && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
              <div className="bg-white rounded-xl shadow-xl w-[500px] max-h-[70vh] overflow-hidden">
                {/* Header */}
                <div className="flex justify-between items-center px-4 py-3 border-b">
                  <h3 className="font-bold text-lg">{attachmentModal.title}</h3>
                  <button
                    className="text-gray-500 hover:text-red-600 text-xl"
                    onClick={() =>
                      setAttachmentModal({ open: false, files: [], title: "" })
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
        </div>
      </div>
      {isModalOpen && (
        <PlotForm
          closeModal={() => setIsModalOpen(false)}
          fetchPlots={fetchPlots}
        />
      )}

      {/* Delete Modal */}
      {deleteConfirm && (
        <dialog open className="modal modal-open">
          <div className="modal-box max-w-md">
            <h3 className="font-bold text-lg mb-4">Confirm Delete</h3>
            <p>
              Are you sure you want to delete{" "}
              <span className="font-semibold">{deleteConfirm.code}</span>?
            </p>
            <div className="modal-action">
              <button className="btn btn-error" onClick={confirmDelete}>
                Yes, Delete
              </button>
              <button className="btn" onClick={() => setDeleteConfirm(null)}>
                Cancel
              </button>
            </div>
          </div>
        </dialog>
      )}
    </main>
  );
};

export default Plots;
