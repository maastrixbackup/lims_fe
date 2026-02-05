import React, { useState } from "react";

const emptyForm = {
  project_id: "",
  compliance_type: "",
  document_submitted: "",
  document_file: null,
  submission_date: "",
  verified_by: "",
  verification_date: "",
  compliance_status: "",
};

const LevelThreeForm = ({ setRows, rows }) => {
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

    setRows([...rows, form]);
    setForm(emptyForm);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">

      <h3 className="font-bold text-lg mb-6">Level-3 Compliance</h3>

      <div className="grid grid-cols-2 gap-4">

        {/* Project ID */}
        <div>
          <label className="label-text font-medium">Project ID</label>
          <input
            name="project_id"
            className="input input-bordered w-full"
            value={form.project_id}
            onChange={handleChange}
          />
        </div>

        {/* Compliance Type */}
        <div>
          <label className="label-text font-medium">Compliance Type</label>
          <input
            name="compliance_type"
            className="input input-bordered w-full"
            value={form.compliance_type}
            onChange={handleChange}
          />
        </div>

        {/* Document Submitted */}
        <div>
          <label className="label-text font-medium block">
            Document Submitted
          </label>

          <div className="flex gap-4 mt-2">
            {["Yes", "No"].map((v) => (
              <label key={v} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="document_submitted"
                  value={v}
                  checked={form.document_submitted === v}
                  onChange={handleChange}
                />
                {v}
              </label>
            ))}
          </div>
        </div>

        {/* Upload only if Yes */}
        {form.document_submitted === "Yes" && (
          <div className="col-span-2">
            <label className="label-text font-medium">
              Compliance Document
            </label>
            <input
              type="file"
              name="document_file"
              className="file-input file-input-bordered w-full"
              onChange={handleChange}
            />
          </div>
        )}

        {/* Submission Date */}
        <div>
          <label className="label-text font-medium">Submission Date</label>
          <input
            type="date"
            name="submission_date"
            className="input input-bordered w-full"
            value={form.submission_date}
            onChange={handleChange}
          />
        </div>

        {/* Verified By */}
        <div>
          <label className="label-text font-medium">Verified By</label>
          <input
            name="verified_by"
            className="input input-bordered w-full"
            value={form.verified_by}
            onChange={handleChange}
          />
        </div>

        {/* Verification Date */}
        <div>
          <label className="label-text font-medium">Verification Date</label>
          <input
            type="date"
            name="verification_date"
            className="input input-bordered w-full"
            value={form.verification_date}
            onChange={handleChange}
          />
        </div>

        {/* Compliance Status */}
        <div className="col-span-2">
          <label className="label-text font-medium">Compliance Status</label>
          <input
            name="compliance_status"
            className="input input-bordered w-full"
            value={form.compliance_status}
            onChange={handleChange}
          />
        </div>

      </div>

      <div className="flex justify-end mt-6">
        <button type="submit" className="btn btn-success btn-sm">
          Save Level-3
        </button>
      </div>

    </form>
  );
};

export default LevelThreeForm;
