import React, { useState } from "react";
import { useSelector } from "react-redux";

const Level1FDProposal = () => {
    const rows=[{
    projectId: "fghgfh",
    dgpsSurvey: "fghfg",
    dgpsArea: "fghfgh",
    orsacAuthNo: "fghfgh",
    orsacAuthDate: "fghfghg",
    treeEnum: "fghfg",
    totalTrees: "rtreter",
    adminDocs: "yutuyt",
    legalDocs: "tyuyt",
    technicalData: "567u6",
    forestLand: "jghj ",
    caPlanning: "g jggh",
    fraRecords: "hgjgh",
    envStatutory: "jhhjh",
    wildlife: "hgjghj",
    maps: "ujyuj",
    finance: "gjghj",
    proposalSubmitted: "ghjgh",
    submissionDate: "ghjghj",
    stageStatus: "ghjghjgh",
  }]
  const [showModal, setShowModal] = useState(false);
 const stickyActionHeader =
    "p-3 text-right bg-gray-500 text-white md:sticky md:right-0 z-[30] shadow-md";
  const stickyActionCell =
    "text-right font-bold md:sticky md:right-0 border-gray-100 shadow-sm bg-white";
  const userRole =useSelector((s) => s.auth.user?.role_name);
  const canEdit = userRole !== "Viewer";
  const canDelete = !(userRole === "Data Entry User" || userRole === "Viewer");
  const [form, setForm] = useState({
    projectId: "",
    dgpsSurvey: "",
    dgpsArea: "",
    orsacAuthNo: "",
    orsacAuthDate: "",
    treeEnum: "",
    totalTrees: "",
    adminDocs: "",
    legalDocs: "",
    technicalData: "",
    forestLand: "",
    caPlanning: "",
    fraRecords: "",
    envStatutory: "",
    wildlife: "",
    maps: "",
    finance: "",
    proposalSubmitted: "",
    submissionDate: "",
    stageStatus: "",
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
        <h2 className="font-bold text-lg">LEVEL – 1 FD PROPOSAL</h2>
        <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>
          + Add Level 1
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto" style={{scrollbarWidth:"thin"}}>
        <table className="table table-sm w-full">
          <thead className="bg-gray-500 text-white text-sm sticky top-0 z-20">
            <tr>
              <th>Project ID</th>
              <th>DGPS Survey</th>
              <th>DGPS Area</th>
              <th>ORSAC Auth No</th>
              <th>ORSAC Date</th>
              <th>Tree Enum</th>
              <th>Total Trees</th>
              <th>Admin Docs</th>
              <th>Legal Docs</th>
              <th>Technical</th>
              <th>Forest & Land</th>
              <th>CA Planning</th>
              <th>FRA</th>
              <th>Env</th>
              <th>Wildlife</th>
              <th>Maps</th>
              <th>Finance</th>
              <th>Proposal</th>
              <th>Submission</th>
              <th>Status</th>
              <th className={stickyActionHeader}>Action</th>
            </tr>
          </thead>

          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan="20" className="text-center">No Data</td>
              </tr>
            )}

            {rows.map((r, i) => (
              <tr key={i}>
                <td>{r.projectId}</td>
                <td>{r.dgpsSurvey}</td>
                <td>{r.dgpsArea}</td>
                <td>{r.orsacAuthNo}</td>
                <td>{r.orsacAuthDate}</td>
                <td>{r.treeEnum}</td>
                <td>{r.totalTrees}</td>
                <td>{r.adminDocs}</td>
                <td>{r.legalDocs}</td>
                <td>{r.technicalData}</td>
                <td>{r.forestLand}</td>
                <td>{r.caPlanning}</td>
                <td>{r.fraRecords}</td>
                <td>{r.envStatutory}</td>
                <td>{r.wildlife}</td>
                <td>{r.maps}</td>
                <td>{r.finance}</td>
                <td>{r.proposalSubmitted}</td>
                <td>{r.submissionDate}</td>
                <td>{r.stageStatus}</td>
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
          <div className="modal-box max-w-4xl">

            <h3 className="font-bold mb-3">Add Level-1 FD Details</h3>

            <div className="grid grid-cols-3 gap-3 text-sm">

              <input name="projectId" placeholder="Project ID" className="input input-bordered" onChange={handleChange} />
              <select name="dgpsSurvey" className="select select-bordered" onChange={handleChange}><option>DGPS Survey</option><option>Yes</option><option>No</option></select>
              <input name="dgpsArea" placeholder="DGPS Area" className="input input-bordered" onChange={handleChange} />

              <input name="orsacAuthNo" placeholder="ORSAC Auth No" className="input input-bordered" onChange={handleChange} />
              <input type="date" name="orsacAuthDate" className="input input-bordered" onChange={handleChange} />
              <select name="treeEnum" className="select select-bordered" onChange={handleChange}><option>Tree Enumeration</option><option>Yes</option><option>No</option></select>

              <input name="totalTrees" placeholder="Total Trees" className="input input-bordered" onChange={handleChange} />

              {[
                ["adminDocs","Admin Docs"],
                ["legalDocs","Legal Docs"],
                ["technicalData","Technical"],
                ["forestLand","Forest & Land"],
                ["caPlanning","CA Planning"],
                ["fraRecords","FRA"],
                ["envStatutory","Environmental"],
                ["wildlife","Wildlife"],
                ["maps","Maps"],
                ["finance","Finance"],
                ["proposalSubmitted","Proposal Submitted"],
              ].map(([n,l]) => (
                <select key={n} name={n} className="select select-bordered" onChange={handleChange}>
                  <option>{l}</option>
                  <option>Yes</option>
                  <option>No</option>
                </select>
              ))}

              <input type="date" name="submissionDate" className="input input-bordered" onChange={handleChange} />
              <input name="stageStatus" placeholder="Stage Status" className="input input-bordered" onChange={handleChange} />

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

export default Level1FDProposal;
