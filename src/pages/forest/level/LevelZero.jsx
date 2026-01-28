import React, { useState } from "react";
import { useSelector } from "react-redux";

const Level0PreProposal = () => {
  const rows = [
    {
        projectId: "fghdfh",
    stageStatus: "rtyrty",
    landSchedule: "ryttry",
    forestLand: "rytrty",
    gis: "rtyrty",
    dgps: "rtyrty",
    verification: "yrrtyt",
    remarks: "rtytryt",
    completionDate: "tytyt",
    },
  ];
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
    stageStatus: "",
    landSchedule: "",
    forestLand: "",
    gis: "",
    dgps: "",
    verification: "",
    remarks: "",
    completionDate: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    setRows([...rows, form]);
    setForm({});
    setShowModal(false);
  };

  return (
    <div >
      <div className="flex justify-between mb-4">
        <h2 className="text-lg font-bold">LEVEL - 0 PRE PROPOSAL</h2>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => setShowModal(true)}
        >
          + Add Level 0
        </button>
      </div>
      <div className="overflow-x-auto" style={{ scrollbarWidth: "thin" }}>
        <table className="table table-sm w-full">
          <thead className="bg-gray-500 text-white text-sm sticky top-0 z-20">
            <tr>
              <th>Project ID</th>
              <th>Stage Status</th>
              <th>Land Schedule</th>
              <th>Forest Land</th>
              <th>Preliminary GIS</th>
              <th>DGPS Planned</th>
              <th>Internal Verification</th>
              <th>Remarks</th>
              <th>Completion Date</th>
              <th className={stickyActionHeader}>Action</th>
            </tr>
          </thead>

          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan="9" className="text-center">
                  No Data
                </td>
              </tr>
            )}

            {rows.map((r, i) => (
              <tr key={i}>
                <td>{r.projectId}</td>
                <td>{r.stageStatus}</td>
                <td>{r.landSchedule}</td>
                <td>{r.forestLand}</td>
                <td>{r.gis}</td>
                <td>{r.dgps}</td>
                <td>{r.verification}</td>
                <td>{r.remarks}</td>
                <td>{r.completionDate}</td>
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
          <div className="modal-box max-w-2xl">
            <h3 className="font-bold mb-3">Add Level-0 Details</h3>

            <div className="grid grid-cols-2 gap-3">
              <input
                className="input input-bordered"
                placeholder="Project ID"
                name="projectId"
                onChange={handleChange}
              />

              <input
                className="input input-bordered"
                placeholder="Stage Status"
                name="stageStatus"
                onChange={handleChange}
              />

              {[
                "landSchedule",
                "forestLand",
                "gis",
                "dgps",
                "verification",
              ].map((f) => (
                <select
                  key={f}
                  name={f}
                  className="select select-bordered"
                  onChange={handleChange}
                >
                  <option value="">Select</option>
                  <option>Yes</option>
                  <option>No</option>
                </select>
              ))}

              <textarea
                className="textarea textarea-bordered col-span-2"
                placeholder="Remarks"
                name="remarks"
                onChange={handleChange}
              />

              <input
                type="date"
                className="input input-bordered col-span-2"
                name="completionDate"
                onChange={handleChange}
              />
            </div>

            <div className="modal-action">
              <button className="btn btn-success btn-sm" onClick={handleSubmit}>
                Save
              </button>
              <button
                className="btn btn-sm"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default Level0PreProposal;
