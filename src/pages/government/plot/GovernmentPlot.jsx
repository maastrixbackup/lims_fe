import React, { useState, useMemo } from "react";
import PlotForm from "./PlotForm";
import {
  GovernmentPlotFields,
  stickyActionCell,
  stickyActionHeader,
} from "../../../utils/constants";
import { useSelector } from "react-redux";
import FilterHeader from "./FilterHeader";

// Dummy data
const plotData = [
  {
    id: 1,
    khataNo: "K001",
    plotNo: "P001",
    thanaNo: "T001",
    village: "Village 1",
    tahashil: "Tahashil A",
    riCircle: "RI-A",

    kissam: "Agriculture",
    rorName: "John Doe",

    totalAreaAcres: 2.5,
    proposedAreaAcres: 1.5,
    totalAreaHectares: 1.01,
    proposedAreaHectares: 0.61,
    leaseCaseNo: "LC001",
    presentStatus: "Lease case to sub-collector",
    uaIdcoToTahasildar: "Yes",
    caseDetails: "Pending approval",
    actionToBeTaken: "Survey",
    riReport: "In Progress",
    proclamation: "Yes",
    objectionReceived: "No",
    others: "N/A",
    modificationRevision: "No",
    missingCasePrep: "No",
    missingCasePrepNo: "MCP002",
    reasonForMiscDrCase: "",
    treeEnumeration: "Completed",
    orderSheetPrep: "not started",
    leaseToIdco: "Yes",
    leaseToUa: "No",
    remarks: "Urgent",
  },
  {
    id: 2,
    khataNo: "K002",
    plotNo: "P002",
    thanaNo: "T002",
    village: "Village 2",
    tahashil: "Tahashil B",
    riCircle: "RI-B",
    kissam: "Residential",
    rorName: "Jane Smith",

    totalAreaAcres: 3.0,
    proposedAreaAcres: 2.0,
    totalAreaHectares: 1.21,
    proposedAreaHectares: 0.81,
    leaseCaseNo: "LC002",
    presentStatus: "Lease Sanctioned by Collector",
    uaIdcoToTahasildar: "No",
    caseDetails: "Under review",
    actionToBeTaken: "Inspection",
    riReport: "Not Started",
    proclamation: "No",
    objectionReceived: "Yes",
    others: "Requires follow-up",
    modificationRevision: "Yes",
    missingCasePrep: "Yes",
    missingCasePrepNo: "MCP001",
    reasonForMiscDrCase: "Incomplete documents",
    treeEnumeration: "Pending",
    orderSheetPrep: "not started",
    leaseToIdco: "No",
    leaseToUa: "Yes",
    remarks: "Follow up next week",
  },
];

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
  const [plots, setPlots] = useState(plotData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlot, setEditingPlot] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const userRole = useSelector((state) => state.auth.user?.role_name);
  const canEdit = userRole !== "Viewer";
  const canDelete = !(userRole === "Data Entry User" || userRole === "Viewer");
  const [activeFilterKey, setActiveFilterKey] = useState(null);

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
