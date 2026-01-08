import React, { useState, useMemo } from "react";
import PlotForm from "./PlotForm";
import {
  GovernmentPlotFields,
  stickyActionCell,
  stickyActionHeader,
} from "../../../utils/constants";
import { useSelector } from "react-redux";
import FilterHeader from "./FilterHeader";

const stickyCol1Header =
  "p-3 text-left bg-gray-200 md:sticky md:left-0 z-[40] shadow-md ";

const stickyCol1Cell = "p-3 text-left bg-white md:sticky md:left-0 shadow-sm ";

const stickyCol2Header =
  "p-3 text-left bg-gray-200 md:sticky md:left-[110px] z-[35] shadow-md ";

const stickyCol2Cell =
  "p-3 text-left bg-white md:sticky md:left-[110px] shadow-sm ";
const Plots = ({ }) => {
  const [plots, setPlots] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlot, setEditingPlot] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const userRole = useSelector((state) => state.auth.user?.role_name);
  const canEdit = userRole !== "Viewer";
  const canDelete = !(userRole === "Data Entry User" || userRole === "Viewer");
  const [activeFilterKey, setActiveFilterKey] = useState(null);
  const [filters, setFilters] = useState({});
  const [sortConfig, setSortConfig] = useState({
    key: "",
    direction: "",
  });

  const openModal = (plot = null) => {
    if (plot) {
      setEditingPlot(plot);
      // setFormData(plot);
    } else {
      setEditingPlot(null);
      // setFormData({
      //   thanaNo: "",
      //   riCircle: "",
      //   khataNo: "",
      //   kissam: "",
      //   rorName: "",
      //   plotNo: "",
      //   totalAreaAcres: "",
      //   proposedAreaAcres: "",
      //   totalAreaHectares: "",
      //   proposedAreaHectares: "",
      //   leaseCaseNo: "",
      //   presentStatus: "",
      //   uaIdcoToTahasildar: "",
      //   caseDetails: "",
      //   actionToBeTaken: "",
      //   riReport: "",
      //   project: "",
      //   village: "",
      //   code: "",
      //   sl: "",
      //   plotNo1: "",
      //   plotNo2: "",
      //   tenant: "",
      //   rorArea: "",
      //   occupiedArea: "",
      //   remarks: "",
      //   missingDrCasePrep: "",
      //   missingDrCaseNo: "",
      //   missingDrCaseReason: "",
      // });
    }
    setIsModalOpen(true);
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
                      (c) => c.key === "khata_no"
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
                      (c) => c.key === "plot_no"
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
                  (c) => !["khata_no", "plot_no"].includes(c.key)
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
                    <td className={stickyCol1Cell}>{plot.khata_no}</td>
                    <td className={stickyCol2Cell}>{plot.plot_no}</td>
                    <td>{plot.thana_no}</td>
                    <td>{plot.mouza}</td>
                    <td>{plot.tahasil}</td>
                    <td>{plot.ri_circle}</td>
                    <td>{plot.kissam}</td>
                    <td>{plot.ror_of_name}</td>
                    <td>{plot.total_area_acres}</td>
                    <td>{plot.proposed_area_acres}</td>
                    <td>{plot.total_area_hectares}</td>
                    <td>{plot.proposed_area_hectares}</td>
                    <td>{plot.lease_case_no}</td>
                    <td>{plot.present_status}</td>
                    <td>{plot.ua_idco_to_tahasildar}</td>
                    <td>{plot.case_details}</td>
                    <td>{plot.action_to_be_taken}</td>
                    <td>{plot.ri_report}</td>
                    <td>{plot.proclamation}</td>
                    <td>{plot.objection_received}</td>
                    <td>{plot.others}</td>
                    <td>{plot.modification_revision}</td>
                    <td>{plot.misc_dr_case_prep}</td>
                    <td>{plot.misc_dr_case_prep_number}</td>
                    <td>{plot.reason_for_misc_dr_case}</td>
                    <td>{plot.tree_enumeration}</td>
                    <td>{plot.order_sheet_prep}</td>
                    <td>{plot.lease_to_idco}</td>
                    <td>{plot.lease_to_ua}</td>
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
      {isModalOpen && <PlotForm closeModal={() => setIsModalOpen(false)} />}

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
