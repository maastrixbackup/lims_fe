import React, { useState } from "react";

const LevelZeroForm = ({ setRows, rows }) => {
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
    others: "",
    others_docs: "",
  });

  const [files, setFiles] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFiles({ ...files, [e.target.name]: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setRows([...rows, { ...form, documents: files }]);
  };

  const yesNoFields = [
    { key: "landSchedule", label: "Land Schedule Uploaded" },
    { key: "forestLand", label: "Forest Land Identified" },
    { key: "gis", label: "Preliminary GIS Uploaded" },
    { key: "dgps", label: "DGPS Planned" },
    { key: "verification", label: "Internal Verification" },
    { key: "others", label: "Others / Miscellaneous" },
  ];

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">

      <h3 className="font-bold text-lg mb-6">Level-0 Details</h3>

      {/* Project + Status */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="label-text font-medium">Project ID</label>
          <input
            className="input input-bordered input-sm w-full"
            name="projectId"
            value={form.projectId}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="label-text font-medium">Stage-0 Status</label>
          <input
            className="input input-bordered input-sm w-full"
            name="stageStatus"
            value={form.stageStatus}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Yes / No Fields */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {yesNoFields.map(({ key, label }) => (
          <div key={key}>
            <label className="label-text font-medium">{label}</label>

            <div className="flex items-center gap-6 mt-1 mb-2">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name={key}
                  value="Yes"
                  checked={form[key] === "Yes"}
                  onChange={handleChange}
                />
                Yes
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name={key}
                  value="No"
                  checked={form[key] === "No"}
                  onChange={handleChange}
                />
                No
              </label>
            </div>

            {form[key] === "Yes" && (
              <input
                type="file"
                name={`${key}Doc`}
                className="file-input file-input-bordered file-input-sm w-full"
                onChange={handleFileChange}
              />
            )}
          </div>
        ))}
      </div>

      {/* Remarks */}
      <div className="mb-4">
        <label className="label-text font-medium">Remarks</label>
        <textarea
          className="textarea textarea-bordered textarea-sm w-full"
          name="remarks"
          value={form.remarks}
          onChange={handleChange}
        />
      </div>

      {/* Completion Date */}
      <div className="mb-6">
        <label className="label-text font-medium">Stage-0 Completion Date</label>
        <input
          type="date"
          className="input input-bordered input-sm w-full"
          name="completionDate"
          value={form.completionDate}
          onChange={handleChange}
        />
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button type="submit" className="btn btn-success btn-sm">
          Save Level-0
        </button>
      </div>

    </form>
  );
};

export default LevelZeroForm;
