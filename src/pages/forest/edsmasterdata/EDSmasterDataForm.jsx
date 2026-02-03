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
  edsDoc: null,
};

const EDSMasterDataForm = ({ setRows, setShowForm }) => {
  const [form, setForm] = useState(emptyForm);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({
      ...form,
      [name]: files ? files[0] : value,
    });
  };

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

            <div>
              <label className="label">Project ID</label>
              <input className="input input-bordered w-full" name="projectId" onChange={handleChange} />
            </div>

            <div>
              <label className="label">EDS Ref No</label>
              <input className="input input-bordered w-full" name="edsRefNo" onChange={handleChange} />
            </div>

            <div className="col-span-2">
              <label className="label">Issuing Authority</label>
              <input className="input input-bordered w-full" name="issuingAuthority" onChange={handleChange} />
            </div>

            <div>
              <label className="label">EDS Issue Date</label>
              <input type="date" className="input input-bordered w-full" name="edsIssueDate" onChange={handleChange} />
            </div>

            <div>
              <label className="label">EDS Due Date</label>
              <input type="date" className="input input-bordered w-full" name="edsDueDate" onChange={handleChange} />
            </div>

            <div>
              <label className="label">Total Issues</label>
              <input type="number" className="input input-bordered w-full" name="totalIssues" onChange={handleChange} />
            </div>

            <div>
              <label className="label">Issues Closed</label>
              <input type="number" className="input input-bordered w-full" name="issuesClosed" onChange={handleChange} />
            </div>

            <div>
              <label className="label">Issues Pending</label>
              <input type="number" className="input input-bordered w-full" name="issuesPending" onChange={handleChange} />
            </div>

            <div>
              <label className="label">EDS Status</label>
              <select name="edsStatus" className="select select-bordered w-full" onChange={handleChange}>
                <option value="">Select Status</option>
                <option>Open</option>
                <option>Pending</option>
                <option>Closed</option>
              </select>
            </div>

            <div className="col-span-2">
              <label className="label">Upload EDS Document</label>
              <input
                type="file"
                name="edsDoc"
                className="file-input file-input-bordered w-full"
                onChange={handleChange}
              />
            </div>

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
