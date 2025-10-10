import React, { useState } from "react";
import { plotData, projectVillageKhataMap } from "../utils/constants";
import { Pencil, Trash2, X } from "lucide-react";

const Plots = () => {
  const [plots, setPlots] = useState(plotData);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlot, setEditingPlot] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const [formData, setFormData] = useState({
    project: "",
    village: "",
    khataNo: "",
    code: "",
    sl: "",
    plotNo1: "",
    plotNo2: "",
    tenant: "",
    kissam: "",
    rorArea: "",
    occupiedArea: "",
    remarks: "",
    yadast: "",
    bmv: "",
    ses: "",
  });

  // Open modal
  const openModal = (plot = null) => {
    if (plot) {
      setEditingPlot(plot);
      setFormData(plot);
    } else {
      setEditingPlot(null);
      setFormData({
        project: "",
        village: "",
        khataNo: "",
        code: "",
        sl: "",
        plotNo1: "",
        plotNo2: "",
        tenant: "",
        kissam: "",
        rorArea: "",
        occupiedArea: "",
        remarks: "",
        yadast: "",
        bmv: "",
        ses: "",
      });
    }
    setIsModalOpen(true);
  };

  // Handle form input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    // Reset child dropdowns when parent changes
    if (e.target.name === "project") {
      setFormData((prev) => ({ ...prev, village: "", khataNo: "" }));
    }
    if (e.target.name === "village") {
      setFormData((prev) => ({ ...prev, khataNo: "" }));
    }
  };

  // Save plot
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

  // Delete
  const confirmDelete = () => {
    setPlots(plots.filter((p) => p.id !== deleteConfirm.id));
    setDeleteConfirm(null);
  };

  return (
    <main className="flex-1 p-6 overflow-y-auto space-y-6">
      {/* Top bar */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Plots List</h2>
        <button className="btn btn-primary" onClick={() => openModal()}>
          + Add Plot
        </button>
      </div>

      {/* Table */}
      <div className="card bg-white shadow-lg rounded-2xl">
        <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
          <table className="table w-full whitespace-nowrap">
            <thead className="bg-gray-100 text-gray-700 sticky top-0 z-10">
              <tr>
                <th>#</th>
                <th>Project</th>
                <th>Village</th>
                <th>Khata No</th>
                <th>Code</th>
                <th>Sl</th>
                <th>Plot No. 1</th>
                <th>Plot No. 2</th>
                <th>Tenant</th>
                <th>Kissam</th>
                <th>RoR Area</th>
                <th>Occupied Area</th>
                <th>Remarks</th>
                <th className="text-right pr-6">Actions</th>
              </tr>
            </thead>
            <tbody>
              {plots.length > 0 ? (
                plots.map((plot, idx) => (
                  <tr key={plot.id} className="hover:bg-gray-50 transition-colors">
                    <td>{idx + 1}</td>
                    <td>GMDC - Baitarani-West Coal Block</td>
                    <td>{plot.village}</td>
                    <td>{plot.khataNo}</td>
                    <td>{plot.code}</td>
                    <td>{plot.sl}</td>
                    <td>{plot.plotNo1}</td>
                    <td>{plot.plotNo2}</td>
                    <td>{plot.tenant}</td>
                    <td>{plot.kissam}</td>
                    <td>{plot.rorArea}</td>
                    <td>{plot.occupiedArea}</td>
                    <td>{plot.remarks}</td>
                    <td className="text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          className="btn btn-xs btn-warning text-white"
                          onClick={() => openModal(plot)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-xs btn-error text-white"
                          onClick={() => setDeleteConfirm(plot)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="14" className="text-center py-6 text-gray-500">
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

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <dialog open className="modal modal-open">
          <div className="modal-box max-w-4xl">
              <button
              type="button"
              className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
              onClick={() => setIsModalOpen(false)}
            >
              <X size={20} />
            </button>
            <h3 className="font-bold text-lg mb-4">
              {editingPlot ? "Edit Plot" : "Add Plot"}
            </h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              {/* Project Dropdown */}
              <select
                name="project"
                value={formData.project}
                onChange={handleChange}
                className="select select-bordered w-full"
                required
              >
                <option value="">Select Project</option>
                {Object.keys(projectVillageKhataMap).map((project) => (
                  <option key={project} value={project}>
                    {project}
                  </option>
                ))}
              </select>

              {/* Village Dropdown */}
              <select
                name="village"
                value={formData.village}
                onChange={handleChange}
                className="select select-bordered w-full"
                required
                disabled={!formData.project}
              >
                <option value="">Select Village</option>
                {formData.project &&
                  Object.keys(projectVillageKhataMap[formData.project]).map(
                    (village) => (
                      <option key={village} value={village}>
                        {village}
                      </option>
                    )
                  )}
              </select>

              {/* Khata Dropdown */}
              <select
                name="khataNo"
                value={formData.khataNo}
                onChange={handleChange}
                className="select select-bordered w-full"
                required
                disabled={!formData.village}
              >
                <option value="">Select Khata</option>
                {formData.project &&
                  formData.village &&
                  projectVillageKhataMap[formData.project][formData.village].map(
                    (khata, i) => (
                      <option key={i} value={khata}>
                        {khata}
                      </option>
                    )
                  )}
              </select>

              {/* Rest of fields... */}
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleChange}
                placeholder="Code"
                className="input input-bordered w-full"
                required
              />
              <input
                type="number"
                name="sl"
                value={formData.sl}
                onChange={handleChange}
                placeholder="Sl"
                className="input input-bordered w-full"
                required
              />
              <input
                type="text"
                name="plotNo1"
                value={formData.plotNo1}
                onChange={handleChange}
                placeholder="Plot No. 1"
                className="input input-bordered w-full"
                required
              />
              <input
                type="text"
                name="plotNo2"
                value={formData.plotNo2}
                onChange={handleChange}
                placeholder="Plot No. 2"
                className="input input-bordered w-full"
              />
              <input
                type="text"
                name="tenant"
                value={formData.tenant}
                onChange={handleChange}
                placeholder="Tenant"
                className="input input-bordered w-full"
                required
              />
              <input
                type="text"
                name="kissam"
                value={formData.kissam}
                onChange={handleChange}
                placeholder="Kissam"
                className="input input-bordered w-full"
                required
              />
              <input
                type="number"
                step="0.0001"
                name="rorArea"
                value={formData.rorArea}
                onChange={handleChange}
                placeholder="RoR Area"
                className="input input-bordered w-full"
                required
              />
              <input
                type="number"
                step="0.0001"
                name="occupiedArea"
                value={formData.occupiedArea}
                onChange={handleChange}
                placeholder="Occupied Area"
                className="input input-bordered w-full"
                required
              />
              <input
                type="text"
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
                placeholder="Remarks"
                className="input input-bordered w-full col-span-2"
              />

              <div className="modal-action col-span-2">
                <button type="submit" className="btn btn-primary">
                  Save
                </button>
                <button
                  type="button"
                  className="btn"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </dialog>
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
