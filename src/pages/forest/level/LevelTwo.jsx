import React, { useState } from "react";
import { useSelector } from "react-redux";

const Level2Stage1Approval = () => {
   const rows=[{
   projectId: "hjku",
    stage1ApprovalNo: "ghjgh",
    approvalDate: "ghjgh",
    npvAmount: "dgdfgd",
    caLand: "dfgdfg",
    acaLand: "ddfggdf",
    stage2Status: "ghh",
  }]
  const [showModal, setShowModal] = useState(false);
 const stickyActionHeader =
    "p-3 text-right bg-gray-500 text-white md:sticky md:right-0 z-[30] shadow-md";
  const stickyActionCell =
    "text-right font-bold md:sticky md:right-0 border-gray-100 shadow-sm bg-white";
  const userRole = useSelector((s) => s.auth.user?.role_name);
  const canEdit = userRole !== "Viewer";
  const canDelete = !(userRole === "Data Entry User" || userRole === "Viewer");
  const [form, setForm] = useState({
    projectId: "",
    stage1ApprovalNo: "",
    approvalDate: "",
    npvAmount: "",
    caLand: "",
    acaLand: "",
    stage2Status: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    setRows([...rows, form]);
    setShowModal(false);
    setForm({});
  };

  return (
    <div>

      {/* Header */}
      <div className="flex justify-between mb-3">
        <h2 className="font-bold text-lg">LEVEL – 2 : STAGE I APPROVAL</h2>
        <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>
          + Add Level 2
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto" style={{scrollbarWidth:"thin"}}>
        <table className="table table-sm w-full">
        <thead className="bg-gray-500 text-white text-sm sticky top-0 z-20">
            <tr>
              <th>Project ID</th>
              <th>Stage I Approval No</th>
              <th>Approval Date</th>
              <th>NPV Amount</th>
              <th>CA Land Area (ha)</th>
              <th>ACA Land Area (ha)</th>
              <th>Stage 2 Status</th>
              <th className={stickyActionHeader}>Action</th>
            </tr>
          </thead>

          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center">No Data</td>
              </tr>
            )}

            {rows.map((r, i) => (
              <tr key={i}>
                <td>{r.projectId}</td>
                <td>{r.stage1ApprovalNo}</td>
                <td>{r.approvalDate}</td>
                <td>{r.npvAmount}</td>
                <td>{r.caLand}</td>
                <td>{r.acaLand}</td>
                <td>{r.stage2Status}</td>
                 <td className={stickyActionCell}>
                  <select
                    className="select select-sm bg-gray-100 border border-gray-300 w-[42px]"
                    defaultValue=""
                    onChange={(e) => {
                      const action = e.target.value;
                      e.target.value = "";

                      if (action === "edit" && canEdit) {
                        onEdit(row);
                      }

                      if (action === "delete" && canDelete) {
                        onDelete(row);
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
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <dialog className="modal modal-open">
          <div className="modal-box max-w-xl">

            <h3 className="font-bold mb-3">Add Stage I Approval</h3>

            <div className="grid grid-cols-2 gap-3">

              <input
                name="projectId"
                placeholder="Project ID"
                className="input input-bordered"
                onChange={handleChange}
              />

              <input
                name="stage1ApprovalNo"
                placeholder="Stage I Approval No"
                className="input input-bordered"
                onChange={handleChange}
              />

              <input
                type="date"
                name="approvalDate"
                className="input input-bordered"
                onChange={handleChange}
              />

              <input
                name="npvAmount"
                placeholder="NPV Amount"
                className="input input-bordered"
                onChange={handleChange}
              />

              <input
                name="caLand"
                placeholder="CA Land Area (ha)"
                className="input input-bordered"
                onChange={handleChange}
              />

              <input
                name="acaLand"
                placeholder="ACA Land Area (ha)"
                className="input input-bordered"
                onChange={handleChange}
              />

              <input
                name="stage2Status"
                placeholder="Stage 2 Status"
                className="input input-bordered col-span-2"
                onChange={handleChange}
              />
            </div>

            <div className="modal-action">
              <button className="btn btn-success btn-sm" onClick={handleSubmit}>
                Save
              </button>
              <button className="btn btn-sm" onClick={() => setShowModal(false)}>
                Cancel
              </button>
            </div>

          </div>
        </dialog>
      )}

    </div>
  );
};

export default Level2Stage1Approval;
