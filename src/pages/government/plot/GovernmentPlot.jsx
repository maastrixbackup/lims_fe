import React, { useState } from "react";
import PlotForm from "./PlotForm";
import { stickyActionCell, stickyActionHeader } from "../../../utils/constants";
import { useSelector } from "react-redux";

// Dummy data
const plotData = [
  {
    id: 1,
    thanaNo: "T001",
    riCircle: "RI-A",
    khataNo: "K001",
    kissam: "Agriculture",
    rorName: "John Doe",
    plotNo: "P001",
    totalAreaAcres: 2.5,
    proposedAreaAcres: 1.5,
    totalAreaHectares: 1.01,
    proposedAreaHectares: 0.61,
    leaseCaseNo: "LC001",
    presentStatus: "Vacant",
    uaIdcoToTahasildar: "Submitted",
    caseDetails: "Pending approval",
    actionToBeTaken: "Survey",
    riReport: "OK",
    project: "Project A",
    village: "Village 1",
    code: "C001",
    sl: 1,
    plotNo1: "P-101",
    plotNo2: "P-102",
    tenant: "Tenant A",
    rorArea: 2.5,
    occupiedArea: 1.0,
    remarks: "No remarks",
    proclamation: "",
    objectionReceived: "",
    others: "",
    modificationRevision: "",
    missingCasePrep: "",
    reasonForMiscDrCase: "",
    treeEnumeration: "",
    orderSheetPrep: "",
    leaseToIdco: "",
    leaseToUa: "",
  },
  {
    id: 2,
    thanaNo: "T002",
    riCircle: "RI-A",
    khataNo: "K001",
    kissam: "Agriculture",
    rorName: "John Doe",
    plotNo: "P001",
    totalAreaAcres: 2.5,
    proposedAreaAcres: 1.5,
    totalAreaHectares: 1.01,
    proposedAreaHectares: 0.61,
    leaseCaseNo: "LC001",
    presentStatus: "Vacant",
    uaIdcoToTahasildar: "Submitted",
    caseDetails: "Pending approval",
    actionToBeTaken: "Survey",
    riReport: "OK",
    project: "Project A",
    village: "Village 1",
    code: "C001",
    sl: 1,
    plotNo1: "P-101",
    plotNo2: "P-102",
    tenant: "Tenant A",
    rorArea: 2.5,
    occupiedArea: 1.0,
    remarks: "No remarks",
    proclamation: "ssssss",
  objectionReceived: "ssssssssss",
  others: "ssssssss",
  modificationRevision: "sssssssss",
  missingCasePrep: "sssssssss",
  reasonForMiscDrCase: "ssssssssss",
  treeEnumeration: "ssssssssss",
  orderSheetPrep: "ssssssssssss",
  leaseToIdco: "ssssssssssss",
  leaseToUa: "sssssssssss",

  },
  {
    id: 3,
    thanaNo: "T003",
    riCircle: "RI-A",
    khataNo: "K001",
    kissam: "Agriculture",
    rorName: "John Doe",
    plotNo: "P001",
    totalAreaAcres: 2.5,
    proposedAreaAcres: 1.5,
    totalAreaHectares: 1.01,
    proposedAreaHectares: 0.61,
    leaseCaseNo: "LC001",
    presentStatus: "Vacant",
    uaIdcoToTahasildar: "Submitted",
    caseDetails: "Pending approval",
    actionToBeTaken: "Survey",
    riReport: "OK",
    project: "Project A",
    village: "Village 1",
    code: "C001",
    sl: 1,
    plotNo1: "P-101",
    plotNo2: "P-102",
    tenant: "Tenant A",
    rorArea: 2.5,
    occupiedArea: 1.0,
    remarks: "No remarks",
    proclamation: "",
  objectionReceived: "",
  others: "",
  modificationRevision: "",
  missingCasePrep: "",
  reasonForMiscDrCase: "",
  treeEnumeration: "",
  orderSheetPrep: "",
  leaseToIdco: "",
  leaseToUa: "",
 
  },
  {
    id: 4,
    thanaNo: "T004",
    riCircle: "RI-A",
    khataNo: "K001",
    kissam: "Agriculture",
    rorName: "John Doe",
    plotNo: "P001",
    totalAreaAcres: 2.5,
    proposedAreaAcres: 1.5,
    totalAreaHectares: 1.01,
    proposedAreaHectares: 0.61,
    leaseCaseNo: "LC001",
    presentStatus: "Vacant",
    uaIdcoToTahasildar: "Submitted",
    caseDetails: "Pending approval",
    actionToBeTaken: "Survey",
    riReport: "OK",
    project: "Project A",
    village: "Village 1",
    code: "C001",
    sl: 1,
    plotNo1: "P-101",
    plotNo2: "P-102",
    tenant: "Tenant A",
    rorArea: 2.5,
    occupiedArea: 1.0,
    remarks: "No remarks",
    proclamation: "",
  objectionReceived: "",
  others: "",
  modificationRevision: "",
  missingCasePrep: "",
  reasonForMiscDrCase: "",
  treeEnumeration: "",
  orderSheetPrep: "",
  leaseToIdco: "",
  leaseToUa: "",
  },
  {
    id: 5,
    thanaNo: "T005",
    riCircle: "RI-A",
    khataNo: "K001",
    kissam: "Agriculture",
    rorName: "John Doe",
    plotNo: "P001",
    totalAreaAcres: 2.5,
    proposedAreaAcres: 1.5,
    totalAreaHectares: 1.01,
    proposedAreaHectares: 0.61,
    leaseCaseNo: "LC001",
    presentStatus: "Vacant",
    uaIdcoToTahasildar: "Submitted",
    caseDetails: "Pending approval",
    actionToBeTaken: "Survey",
    riReport: "OK",
    project: "Project A",
    village: "Village 1",
    code: "C001",
    sl: 1,
    plotNo1: "P-101",
    plotNo2: "P-102",
    tenant: "Tenant A",
    rorArea: 2.5,
    occupiedArea: 1.0,
    remarks: "No remarks",
    proclamation: "",
  objectionReceived: "",
  others: "",
  modificationRevision: "",
  missingCasePrep: "",
  reasonForMiscDrCase: "",
  treeEnumeration: "",
  orderSheetPrep: "",
  leaseToIdco: "",
  leaseToUa: "",
  },
  {
    id: 6,
    thanaNo: "T006",
    riCircle: "RI-A",
    khataNo: "K001",
    kissam: "Agriculture",
    rorName: "John Doe",
    plotNo: "P001",
    totalAreaAcres: 2.5,
    proposedAreaAcres: 1.5,
    totalAreaHectares: 1.01,
    proposedAreaHectares: 0.61,
    leaseCaseNo: "LC001",
    presentStatus: "Vacant",
    uaIdcoToTahasildar: "Submitted",
    caseDetails: "Pending approval",
    actionToBeTaken: "Survey",
    riReport: "OK",
    project: "Project A",
    village: "Village 1",
    code: "C001",
    sl: 1,
    plotNo1: "P-101",
    plotNo2: "P-102",
    tenant: "Tenant A",
    rorArea: 2.5,
    occupiedArea: 1.0,
    remarks: "No remarks",
    proclamation: "",
  objectionReceived: "",
  others: "",
  modificationRevision: "",
  missingCasePrep: "",
  reasonForMiscDrCase: "",
  treeEnumeration: "",
  orderSheetPrep: "",
  leaseToIdco: "",
  leaseToUa: "",
  },
  {
    id: 7,
    thanaNo: "T007",
    riCircle: "RI-A",
    khataNo: "K001",
    kissam: "Agriculture",
    rorName: "John Doe",
    plotNo: "P001",
    totalAreaAcres: 2.5,
    proposedAreaAcres: 1.5,
    totalAreaHectares: 1.01,
    proposedAreaHectares: 0.61,
    leaseCaseNo: "LC001",
    presentStatus: "Vacant",
    uaIdcoToTahasildar: "Submitted",
    caseDetails: "Pending approval",
    actionToBeTaken: "Survey",
    riReport: "OK",
    project: "Project A",
    village: "Village 1",
    code: "C001",
    sl: 1,
    plotNo1: "P-101",
    plotNo2: "P-102",
    tenant: "Tenant A",
    rorArea: 2.5,
    occupiedArea: 1.0,
    remarks: "No remarks",
    proclamation: "",
  objectionReceived: "",
  others: "",
  modificationRevision: "",
  missingCasePrep: "",
  reasonForMiscDrCase: "",
  treeEnumeration: "",
  orderSheetPrep: "",
  leaseToIdco: "",
  leaseToUa: "",
  
  },
  {
    id: 8,
    thanaNo: "T008",
    riCircle: "RI-A",
    khataNo: "K001",
    kissam: "Agriculture",
    rorName: "John Doe",
    plotNo: "P001",
    totalAreaAcres: 2.5,
    proposedAreaAcres: 1.5,
    totalAreaHectares: 1.01,
    proposedAreaHectares: 0.61,
    leaseCaseNo: "LC001",
    presentStatus: "Vacant",
    uaIdcoToTahasildar: "Submitted",
    caseDetails: "Pending approval",
    actionToBeTaken: "Survey",
    riReport: "OK",
    project: "Project A",
    village: "Village 1",
    code: "C001",
    sl: 1,
    plotNo1: "P-101",
    plotNo2: "P-102",
    tenant: "Tenant A",
    rorArea: 2.5,
    occupiedArea: 1.0,
    remarks: "No remarks",
    proclamation: "",
  objectionReceived: "",
  others: "",
  modificationRevision: "",
  missingCasePrep: "",
  reasonForMiscDrCase: "",
  treeEnumeration: "",
  orderSheetPrep: "",
  leaseToIdco: "",
  leaseToUa: "",
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
  "p-3 text-left bg-gray-200 md:sticky md:left-[80px] z-[35] shadow-md ";

const stickyCol2Cell =
  "p-3 text-left bg-white md:sticky md:left-[80px] shadow-sm ";
const Plots = () => {
  const [plots, setPlots] = useState(plotData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlot, setEditingPlot] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const userRole = useSelector((state) => state.auth.user?.role_name);
  const canEdit = userRole !== "Viewer";
  const canDelete = !(userRole === "Data Entry User" || userRole === "Viewer");

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

  return (
    <main className="flex-1 overflow-y-auto space-y-2">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Government Plot</h2>
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
            <thead className="bg-gray-200 text-gray-700 sticky top-0 z-10">
              <tr>
                <th>Sl/No</th>
                <th className={stickyCol1Header}>Khata No</th>
                <th className={stickyCol2Header}>Plot No</th>
                <th>Thana No</th>
                <th>Village Name</th>
                <th>Tahashil</th>
                <th>RI Circle</th>
                <th>Kissam</th>
                <th>Name of ROR</th>
                <th>Total Area (Acres)</th>
                <th>Proposed Area (Acres)</th>
                <th>Total Area (Hectares)</th>
                <th>Proposed Area (Hectares)</th>
                <th>Lease Case No</th>
                <th>Present Status</th>
                <th>UA / IDCO to Tahasildar</th>
                <th>Case Details/Deservation Details Req.</th>
                <th>Action to be taken</th>
                <th>RI Report</th>
                <th>Proclamation</th>
                <th>Objection Received</th>
                <th>Others</th>
                <th>Modification / Revision</th>
                <th>Missing Case Prep. / DR Case Prep.</th>
                <th>Reason for Misc / DR Case</th>
                <th>Tree Enumeration</th>
                <th>Order Sheet Prep.</th>
                <th>Lease to IDCO</th>
                <th>Lease to UA</th>
                <th>Remarks</th>
                <th className={stickyActionHeader}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {plots.length > 0 ? (
                plots.map((plot, idx) => (
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
