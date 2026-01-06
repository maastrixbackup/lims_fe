import React, { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { useSelector } from "react-redux";

const GovernmentKhata = () => {
  // Khata data
  const [khatas, setKhatas] = useState([
    {
      id: 1,
      plotNo: "P001",
      leaseCaseNo: "LC001",
      presentStatus: "Vacant",
      caseDetails: "Survey pending",
      village: "Village 1",
      plot_count: 2,
      created: "2025-01-01",
    },
    {
      id: 2,
      plotNo: "P002",
      leaseCaseNo: "LC002",
      presentStatus: "Occupied",
      caseDetails: "Approval pending",
      village: "Village 1",
      plot_count: 3,
      created: "2025-01-02",
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingKhata, setEditingKhata] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
   const userRole = useSelector((state) => state.auth.user?.role_name);
  const canEdit = userRole !== "Viewer";
  const canDelete = !(userRole === "Data Entry User" || userRole === "Viewer");

  const [formData, setFormData] = useState({
    plotNo: "",
    leaseCaseNo: "",
    presentStatus: "",
    caseDetails: "",
    village: "",
    plot_count: "",
    created: new Date().toISOString().split("T")[0],
  });

  // Open modal
  const openModal = (khata = null) => {
    if (khata) {
      setEditingKhata(khata);
      setFormData(khata);
    } else {
      setEditingKhata(null);
      setFormData({
        plotNo: "",
        leaseCaseNo: "",
        presentStatus: "",
        caseDetails: "",
        village: "",
        plot_count: "",
        created: new Date().toISOString().split("T")[0],
      });
    }
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingKhata) {
      setKhatas(
        khatas.map((k) =>
          k.id === editingKhata.id ? { ...formData, id: k.id } : k
        )
      );
    } else {
      setKhatas([...khatas, { ...formData, id: khatas.length + 1 }]);
    }

    setIsModalOpen(false);
  };

  const confirmDelete = () => {
    setKhatas(khatas.filter((k) => k.id !== deleteConfirm.id));
    setDeleteConfirm(null);
  };

  return (
    <main className="p-2 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Government Khata</h2>
        <button className="btn btn-primary" onClick={() => openModal()}>
          + Add Khata
        </button>
      </div>

      <div className="card bg-white shadow-lg">
       <div
          className="overflow-x-auto max-h-[400px] overflow-y-auto"
          style={{ scrollbarWidth: "thin" }}
        >
       <table className="table w-full whitespace-nowrap">
            <thead className="bg-gray-200 text-gray-700 sticky top-0 z-10">
              <tr>
                <th>Sl/No</th>
                <th>Plot No</th>
                <th>Lease Case No</th>
                <th>Preset Status</th>
                <th>Case Details/Deservation Req.</th>
                <th>Plot Count</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {khatas.length > 0 ? (
                khatas.map((khata, idx) => (
                  <tr key={khata.id}>
                    <td>{idx + 1}</td>
                    <td>{khata.plotNo}</td>
                    <td>{khata.leaseCaseNo}</td>
                    <td>{khata.presentStatus}</td>
                    <td>{khata.caseDetails}</td>
                    <td>{khata.plot_count}</td>
                      <td className="text-right">
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
                    No khata found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Khata Modal */}
      {isModalOpen && (
        <dialog open className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">
              {editingKhata ? "Edit Khata" : "Add Khata"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                name="plotNo"
                placeholder="Plot No"
                value={formData.plotNo}
                onChange={handleChange}
                className="input input-bordered w-full"
                required
              />

              <input
                name="leaseCaseNo"
                placeholder="Lease Case No"
                value={formData.leaseCaseNo}
                onChange={handleChange}
                className="input input-bordered w-full"
                required
              />

              <input
                name="presentStatus"
                placeholder="Present Status"
                value={formData.presentStatus}
                onChange={handleChange}
                className="input input-bordered w-full"
                required
              />

              <input
                name="caseDetails"
                placeholder="Case Details/ Deservation Req"
                value={formData.caseDetails}
                onChange={handleChange}
                className="input input-bordered w-full"
              />

              <div className="modal-action">
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

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <dialog open className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Confirm Delete</h3>
            <p className="my-3">
              Are you sure you want to delete Khata{" "}
              <b>{deleteConfirm.plotNo}</b>?
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

export default GovernmentKhata;
