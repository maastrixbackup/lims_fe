import React, { useState, useMemo, useEffect } from "react";
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
  2: "Lease Case to ADM (Rev.Sec)",
  3: "Demand Raised",
  4: "Lease Sanctioned by Collector",
};


const projectVillageKhataMap = {
  "Project A": {
    "Village 1": ["K001", "K002"],
    "Village 2": ["K003"],
  },
  "Project B": {
    "Village 3": ["K004", "K005"],
  },
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlot, setEditingPlot] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const userRole = useSelector((state) => state.auth.user?.role_name);
  const canEdit = userRole !== "Viewer";
  const canDelete = !(userRole === "Data Entry User" || userRole === "Viewer");
  const [activeFilterKey, setActiveFilterKey] = useState(null);
  const [plots, setPlots] = useState([]);
const [loading, setLoading] = useState(false);
const [page, setPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);
  const [formData, setFormData] = useState({
    thanaNo: "",
    riCircle: "",
    khataNo: "",
    kissam: "",
    rorName: "",
    plotNo: "",
    totalAreaAcres: "",
    proposedAreaAcres: "",
    totalAreaHectares: "",
    proposedAreaHectares: "",
    leaseCaseNo: "",
    presentStatus: "",
    uaIdcoToTahasildar: "",
    caseDetails: "",
    actionToBeTaken: "",
    riReport: "",
    project: "",
    village: "",
    code: "",
    sl: "",
    plotNo1: "",
    plotNo2: "",
    tenant: "",
    rorArea: "",
    occupiedArea: "",
    remarks: "",
  });
  const [filters, setFilters] = useState({});
  const [sortConfig, setSortConfig] = useState({
    key: "",
    direction: "",
  });

// selected project id (from redux / props / dropdown)
const selectedProjectId = useSelector((state) => state.selectedProject.project?.id);

const token = useSelector((state) => state.auth.userToken); 
const mapGovtPlot = (item) => ({
  id: item.id,
  projectId: item.project_id,
  village: item.mouza,
  tahashil: item.tahasil,
  thanaNo: item.thana_no,
  riCircle: item.ri_circle,
  khataNo: item.khata_no,
  kissam: item.kissam,
  rorName: item.name_of_ror,
  plotNo: item.plot_no,
  totalAreaAcres: item.total_area_acres,
  proposedAreaAcres: item.proposed_area_acres,
  totalAreaHectares: item.total_area_hectares,
  proposedAreaHectares: item.proposed_area_hectares,
  leaseCaseNo: item.lease_case_no,
 presentStatus:
    PRESENT_STATUS_MAP[item.present_status] || "No Data",
  uaIdcoToTahasildar: item.ua_idco_to_tahasildar ? "Yes" : "No",
  caseDetails: item.case_details,
  actionToBeTaken: item.action_to_be_taken,
  riReport: item.ri_report,
  proclamation: item.proclamation ? "Yes" : "No",
  objectionReceived: item.objection_received ? "Yes" : "No",
  others: item.others,
  modificationRevision: item.modification_revision ? "Yes" : "No",
  missingCasePrep: item.misc_dr_case_prep ? "Yes" : "No",
  missingCasePrepNo: item.misc_dr_case_prep_number,
  reasonForMiscDrCase: item.reason_for_misc_dr_case,
  treeEnumeration: item.tree_enumeration,
  orderSheetPrep: item.order_sheet_prep,
  leaseToIdco: item.lease_to_idco ? "Yes" : "No",
  leaseToUa: item.lease_to_ua ? "Yes" : "No",
  remarks: item.remarks,
});
useEffect(() => {
  if (!selectedProjectId || !token) return;

  const fetchPlots = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `${API_BASE_URL}/govtplots/govtPlotList?project_id=${selectedProjectId}&page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const json = await res.json();

      // assuming response format
      // { data: [], meta: { total_pages: X } }

      const mappedData = json.data.map(mapGovtPlot);

      setPlots(mappedData);
      setTotalPages(json.meta?.total_pages || 1);
    } catch (error) {
      console.error("Failed to fetch plots", error);
    } finally {
      setLoading(false);
    }
  };

  fetchPlots();
}, [selectedProjectId, page, token]);





  const openModal = (plot = null) => {
    if (plot) {
      setEditingPlot(plot);
      setFormData(plot);
    } else {
      setEditingPlot(null);
      setFormData({
        thanaNo: "",
        riCircle: "",
        khataNo: "",
        kissam: "",
        rorName: "",
        plotNo: "",
        totalAreaAcres: "",
        proposedAreaAcres: "",
        totalAreaHectares: "",
        proposedAreaHectares: "",
        leaseCaseNo: "",
        presentStatus: "",
        uaIdcoToTahasildar: "",
        caseDetails: "",
        actionToBeTaken: "",
        riReport: "",
        project: "",
        village: "",
        code: "",
        sl: "",
        plotNo1: "",
        plotNo2: "",
        tenant: "",
        rorArea: "",
        occupiedArea: "",
        remarks: "",
        missingDrCasePrep: "",
        missingDrCaseNo: "",
        missingDrCaseReason: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingPlot) {
      setPlots(
        plots.map((p) =>
          p.id === editingPlot.id ? { ...formData, id: p.id } : p
        )
      );
    } else {
      setPlots([...plots, { ...formData, id: plots.length + 1 }]);
    }
    setIsModalOpen(false);
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

      {/* Table */}
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
                    <td className={stickyCol1Cell}>{plot.khataNo}</td>
                    <td className={stickyCol2Cell}>{plot.plotNo}</td>
                    <td>{plot.thanaNo}</td>
                    <td>{plot.village}</td>
                    <td>{plot.tahashil}</td>
                    <td>{plot.riCircle}</td>
                    <td>{plot.kissam}</td>
                    <td>{plot.rorName}</td>
                    <td>{plot.totalAreaAcres}</td>
                    <td>{plot.proposedAreaAcres}</td>
                    <td>{plot.totalAreaHectares}</td>
                    <td>{plot.proposedAreaHectares}</td>
                    <td>{plot.leaseCaseNo}</td>
                    <td>{plot.presentStatus}</td>
                    <td>{plot.uaIdcoToTahasildar}</td>
                    <td>{plot.caseDetails}</td>
                    <td>{plot.actionToBeTaken}</td> 
                    <td>{plot.riReport}</td>
                    <td>{plot.proclamation}</td>
                    <td>{plot.objectionReceived}</td>
                    <td>{plot.others}</td>
                    <td>{plot.modificationRevision}</td>
                    <td>{plot.missingCasePrep}</td>
                    <td>{plot.missingCasePrepNo}</td>
                    <td>{plot.reasonForMiscDrCase}</td>
                    <td>{plot.treeEnumeration}</td>
                    <td>{plot.orderSheetPrep}</td>
                    <td>{plot.leaseToIdco}</td>
                    <td>{plot.leaseToUa}</td>
                    <td>{plot.remarks}</td>

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
        </div>
      </div>

      {/* PlotForm Modal */}
      {isModalOpen && (
        <PlotForm
          formData={formData}
          setFormData={setFormData}
          handleSubmit={handleSubmit}
          closeModal={() => setIsModalOpen(false)}
          projectVillageKhataMap={projectVillageKhataMap}
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
