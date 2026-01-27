import React, { useState } from "react";
import { useSelector } from "react-redux";

const Level3Stage2Compliance = () => {
   const rows=[{
      projectId: "ertret",
    complianceType: "eter",
    documentSubmitted: "vb vc",
    submissionDate: "cvbvc",
    verifiedBy: "cvbdf",
    verificationDate: "fdgw",
    complianceStatus: "sdf",
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
    complianceType: "",
    documentSubmitted: "",
    submissionDate: "",
    verifiedBy: "",
    verificationDate: "",
    complianceStatus: "",
  });

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
        <h2 className="font-bold text-lg">LEVEL – 3 : STAGE II COMPLIANCE DETAILS</h2>
        <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>
          + Add Level 3
        </button>
      </div>

       <div className="overflow-x-auto" style={{scrollbarWidth:"thin"}}>
        <table className="table table-sm w-full">
       <thead className="bg-gray-500 text-white text-sm sticky top-0 z-20">
            <tr>
              <th>Project ID</th>
              <th>Compliance Type</th>
              <th>Document Submitted</th>
              <th>Submission Date</th>
              <th>Verified By</th>
              <th>Verification Date</th>
              <th>Compliance Status</th>
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
                <td>{r.complianceType}</td>
                <td>{r.documentSubmitted}</td>
                <td>{r.submissionDate}</td>
                <td>{r.verifiedBy}</td>
                <td>{r.verificationDate}</td>
                <td>{r.complianceStatus}</td>
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

            <h3 className="font-bold mb-3">Add Compliance</h3>

            <div className="grid grid-cols-2 gap-3">

              <input name="projectId" placeholder="Project ID" className="input input-bordered" onChange={handleChange} />
              <input name="complianceType" placeholder="Compliance Type" className="input input-bordered" onChange={handleChange} />
              <input name="documentSubmitted" placeholder="Document Submitted" className="input input-bordered" onChange={handleChange} />
              <input type="date" name="submissionDate" className="input input-bordered" onChange={handleChange} />
              <input name="verifiedBy" placeholder="Verified By" className="input input-bordered" onChange={handleChange} />
              <input type="date" name="verificationDate" className="input input-bordered" onChange={handleChange} />
              <input name="complianceStatus" placeholder="Compliance Status" className="input input-bordered col-span-2" onChange={handleChange} />

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

export default Level3Stage2Compliance;
