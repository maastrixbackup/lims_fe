import React, { useState } from "react";
import { useSelector } from "react-redux";

const Level4Stage2Clearance = () => {

  const [showModal, setShowModal] = useState(false);
 const stickyActionHeader =
    "text-right bg-gray-500  text-white md:sticky md:right-0 z-[30] shadow-md";
  const stickyActionCell =
    "text-right bg-white font-bold md:sticky md:right-0 border-gray-100 shadow-sm";
  const userRole = useSelector((s) => s.auth.user?.role_name);
  const canEdit = userRole !== "Viewer";
  const canDelete = !(userRole === "Data Entry User" || userRole === "Viewer");
  const [form, setForm] = useState({
    projectId: "",
    finalApprovalNo: "",
    finalApprovalDate: "",
    divertedArea: "",
    landHandover: "",
    handoverDate: "",
    projectClosed: "",
    closureDate: "",
  });
  const rows=[{
   projectId: "fdgfd",
    finalApprovalNo: "dfgfd",
    finalApprovalDate: "fdgfd",
    divertedArea: "dfgdf",
    landHandover: "dfgdfg",
    handoverDate: "dfgfdg",
    projectClosed: "bvcn",
    closureDate: "cbnfg",
  }]

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    setRows([...rows, form]);
    setShowModal(false);
    setForm({});
  };

  return (
    <div className="p-4">

      <div className="flex justify-between mb-3">
        <h2 className="font-bold text-lg">LEVEL – 4 : STAGE II CLEARANCE FROM MOEF&CC</h2>
        <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>
          + Add Level 4
        </button>
      </div>

      <div className="overflow-x-auto" style={{scrollbarWidth:"thin"}}>
        <table className="table w-full">
          <thead className="bg-gray-500 text-white text-sm sticky top-0 z-20">
            <tr>
              <th>Project ID</th>
              <th>Final Approval No</th>
              <th>Final Approval Date</th>
              <th>Diverted Area (ha)</th>
              <th>Land Handover</th>
              <th>Handover Date</th>
              <th>Project Closed</th>
              <th>Closure Date</th>
              <th className={stickyActionHeader}>Action</th>
            </tr>
          </thead>

          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan="8" className="text-center">No Data</td>
              </tr>
            )}

            {rows.map((r, i) => (
              <tr key={i}>
                <td>{r.projectId}</td>
                <td>{r.finalApprovalNo}</td>
                <td>{r.finalApprovalDate}</td>
                <td>{r.divertedArea}</td>
                <td>{r.landHandover}</td>
                <td>{r.handoverDate}</td>
                <td>{r.projectClosed}</td>
                <td>{r.closureDate}</td>
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

      {showModal && (
        <dialog className="modal modal-open">
          <div className="modal-box max-w-xl">

            <h3 className="font-bold mb-3">Add Stage II Clearance</h3>

            <div className="grid grid-cols-2 gap-3">

              <input name="projectId" placeholder="Project ID" className="input input-bordered" onChange={handleChange} />
              <input name="finalApprovalNo" placeholder="Final Approval No" className="input input-bordered" onChange={handleChange} />
              <input type="date" name="finalApprovalDate" className="input input-bordered" onChange={handleChange} />
              <input name="divertedArea" placeholder="Diverted Area (ha)" className="input input-bordered" onChange={handleChange} />
              <select name="landHandover" className="select select-bordered" onChange={handleChange}>
                <option>Land Handover</option>
                <option>Yes</option>
                <option>No</option>
              </select>
              <input type="date" name="handoverDate" className="input input-bordered" onChange={handleChange} />
              <select name="projectClosed" className="select select-bordered" onChange={handleChange}>
                <option>Project Closed</option>
                <option>Yes</option>
                <option>No</option>
              </select>
              <input type="date" name="closureDate" className="input input-bordered" onChange={handleChange} />

            </div>

            <div className="modal-action">
              <button className="btn btn-success btn-sm" onClick={handleSubmit}>Save</button>
              <button className="btn btn-sm" onClick={() => setShowModal(false)}>Cancel</button>
            </div>

          </div>
        </dialog>
      )}

    </div>
  );
};

export default Level4Stage2Clearance;
