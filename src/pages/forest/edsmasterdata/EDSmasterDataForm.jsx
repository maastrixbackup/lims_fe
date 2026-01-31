import React, { useState } from "react";

const emptyForm = {
  projectId: "",
  edsRefNo: "",
  issuingAuthority: "",
  edsIssueDate: "",
  edsDueDate: "",
  totalIssues: "",
  issuesClosed: "",
  issuesPending: "",
  edsStatus: "",
};

const EDSMasterDataForm = ({ setRows, setShowForm }) => {
  const [form, setForm] = useState(emptyForm);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setRows((prev) => [...prev, form]);
    setShowForm(false);
  };

  return (
    <div className="modal modal-open">

      <div className="modal-box max-w-3xl">

        <h3 className="font-bold text-lg mb-4">Add EDS Master Data</h3>

        <form onSubmit={handleSubmit}>

          <div className="grid grid-cols-2 gap-4">

            <input className="input input-bordered" placeholder="Project ID" name="projectId" onChange={handleChange} />
            <input className="input input-bordered" placeholder="EDS Ref No" name="edsRefNo" onChange={handleChange} />

            <input className="input input-bordered col-span-2" placeholder="Issuing Authority" name="issuingAuthority" onChange={handleChange} />

            <input type="date" className="input input-bordered" name="edsIssueDate" onChange={handleChange} />
            <input type="date" className="input input-bordered" name="edsDueDate" onChange={handleChange} />

            <input type="number" className="input input-bordered" placeholder="Total Issues" name="totalIssues" onChange={handleChange} />
            <input type="number" className="input input-bordered" placeholder="Issues Closed" name="issuesClosed" onChange={handleChange} />

            <input type="number" className="input input-bordered" placeholder="Issues Pending" name="issuesPending" onChange={handleChange} />

            <select name="edsStatus" className="select select-bordered">
              <option value="">Select Status</option>
              <option>Open</option>
              <option>Pending</option>
              <option>Closed</option>
            </select>

          </div>

          <div className="modal-action">

            <button
              type="button"
              className="btn btn-error btn-sm"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>

            <button className="btn btn-primary btn-sm">
              Save
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default EDSMasterDataForm;
