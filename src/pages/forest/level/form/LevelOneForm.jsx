import React, { useState } from "react";

const emptyForm = {
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
};

const LevelOneForm = ({ setRows, setShowModal }) => {
  const [form, setForm] = useState(emptyForm);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    setRows((prev) => [...prev, form]);
    setShowModal(false);
    setForm(emptyForm);
  };

  return (
    <dialog className="modal modal-open">
      <div className="modal-box max-w-4xl">

        <h3 className="font-bold mb-3">Add Level-1 FD Details</h3>

        <div className="grid grid-cols-3 gap-3 text-sm">

          <input name="projectId" placeholder="Project ID" className="input input-bordered" onChange={handleChange} />

          <select name="dgpsSurvey" className="select select-bordered" onChange={handleChange}>
            <option value="">DGPS Survey</option>
            <option>Yes</option>
            <option>No</option>
          </select>

          <input name="dgpsArea" placeholder="DGPS Area" className="input input-bordered" onChange={handleChange} />

          <input name="orsacAuthNo" placeholder="ORSAC Auth No" className="input input-bordered" onChange={handleChange} />

          <input type="date" name="orsacAuthDate" className="input input-bordered" onChange={handleChange} />

          <select name="treeEnum" className="select select-bordered" onChange={handleChange}>
            <option value="">Tree Enumeration</option>
            <option>Yes</option>
            <option>No</option>
          </select>

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
              <option value="">{l}</option>
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
  );
};

export default LevelOneForm;
