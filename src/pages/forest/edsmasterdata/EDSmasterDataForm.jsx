import React, { useState } from "react";

const EDSMasterDataForm = () => {
  const [form, setForm] = useState({
    projectId: "",
    edsRefNo: "",
    issuingAuthority: "",
    edsIssueDate: "",
    edsDueDate: "",
    totalIssues: "",
    issuesClosed: "",
    issuesPending: "",
    edsStatus: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", form);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md">

      <table className="table table-bordered w-full">

        <thead>
          <tr>
            <th colSpan={2} className="bg-black text-white text-center">
              EDS MASTER DATA
            </th>
          </tr>
        </thead>

        <tbody>

          <tr>
            <td className="font-semibold bg-base-200">Project ID</td>
            <td>
              <input
                name="projectId"
                value={form.projectId}
                onChange={handleChange}
                className="input input-bordered w-full"
              />
            </td>
          </tr>

          <tr>
            <td className="font-semibold bg-base-200">EDS Ref No</td>
            <td>
              <input
                name="edsRefNo"
                value={form.edsRefNo}
                onChange={handleChange}
                className="input input-bordered w-full"
              />
            </td>
          </tr>

          <tr>
            <td className="font-semibold bg-base-200">Issuing Authority</td>
            <td>
              <input
                name="issuingAuthority"
                value={form.issuingAuthority}
                onChange={handleChange}
                className="input input-bordered w-full"
              />
            </td>
          </tr>

          <tr>
            <td className="font-semibold bg-base-200">EDS Issue Date</td>
            <td>
              <input
                type="date"
                name="edsIssueDate"
                value={form.edsIssueDate}
                onChange={handleChange}
                className="input input-bordered w-full"
              />
            </td>
          </tr>

          <tr>
            <td className="font-semibold bg-base-200">EDS Due Date</td>
            <td>
              <input
                type="date"
                name="edsDueDate"
                value={form.edsDueDate}
                onChange={handleChange}
                className="input input-bordered w-full"
              />
            </td>
          </tr>

          <tr>
            <td className="font-semibold bg-base-200">Total Issues</td>
            <td>
              <input
                type="number"
                name="totalIssues"
                value={form.totalIssues}
                onChange={handleChange}
                className="input input-bordered w-full"
              />
            </td>
          </tr>

          <tr>
            <td className="font-semibold bg-base-200">Issues Closed</td>
            <td>
              <input
                type="number"
                name="issuesClosed"
                value={form.issuesClosed}
                onChange={handleChange}
                className="input input-bordered w-full"
              />
            </td>
          </tr>

          <tr>
            <td className="font-semibold bg-base-200">Issues Pending</td>
            <td>
              <input
                type="number"
                name="issuesPending"
                value={form.issuesPending}
                onChange={handleChange}
                className="input input-bordered w-full"
              />
            </td>
          </tr>

          <tr>
            <td className="font-semibold bg-base-200">EDS Status</td>
            <td>
              <select
                name="edsStatus"
                value={form.edsStatus}
                onChange={handleChange}
                className="select select-bordered w-full"
              >
                <option value="">Select</option>
                <option value="Open">Open</option>
                <option value="Pending">Pending</option>
                <option value="Closed">Closed</option>
              </select>
            </td>
          </tr>

        </tbody>
      </table>

      <div className="mt-4 text-right">
        <button className="btn btn-primary">
          Save
        </button>
      </div>

    </form>
  );
};

export default EDSMasterDataForm;
