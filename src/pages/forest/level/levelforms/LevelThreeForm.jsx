import React, { useState } from "react";

const POST_CLEARANCE_DATA = [
  { sl: 1, key: "caPlantationStarted", label: "CA Plantation Started", type: "yesno", remark: "Plantation report", allowUpload: true },
  { sl: 2, key: "caPlantationCompleted", label: "CA Plantation Completed", type: "yesno", remark: "Completion report", allowUpload: true },
  { sl: 3, key: "survivalReportSubmitted", label: "Survival Report Submitted", type: "yesno", remark: "Annual survival report", allowUpload: true },
  { sl: 4, key: "wildlifeMitigation", label: "Wildlife Mitigation Implemented", type: "yesno", remark: "If applicable", allowUpload: true },
  { sl: 5, key: "safetyZoneMaintained", label: "Safety Zone Maintained", type: "yesno", remark: "Inspection report", allowUpload: true },
  { sl: 6, key: "periodicCompliance", label: "Periodic Compliance Submitted", type: "yesno", remark: "Half-yearly / Annual", allowUpload: false },
  { sl: 7, key: "inspectionObservations", label: "Inspection Observations", type: "status", options: ["Open", "Closed"], remark: "Remarks ", allowUpload: false },
  { sl: 8, key: "postClearanceStatus", label: "Post-Clearance Status", type: "dropdown", options: ["Ongoing", "Completed"], remark: "", allowUpload: false },
];

const LevelThreeForm = () => {
  const [form, setForm] = useState({});
  const [files, setFiles] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFiles({ ...files, [e.target.name]: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log({
      ...form,
      documents: files,
    });

    alert("Post-Clearance Data Saved");
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 max-w-6xl mx-auto">
      <h2 className="text-lg font-bold mb-4">
        Post Clearance: Compliance & Monitoring
      </h2>

      <table className="table table-bordered w-full text-sm">
        <thead>
          <tr className="bg-gray-200">
            <th>Sl No</th>
            <th>Parameter</th>
            <th>Status</th>
            <th>Documents / Remarks</th>
          </tr>
        </thead>

        <tbody>
          {POST_CLEARANCE_DATA.map((row) => (
            <tr key={row.key}>
              <td>{row.sl}</td>
              <td>{row.label}</td>
              <td>
                {row.type === "yesno" && (
                  <div className="flex gap-3">
                    {["Yes", "No"].map((v) => (
                      <label key={v} className="flex items-center gap-1">
                        <input
                          type="radio"
                          name={row.key}
                          value={v}
                          checked={form[row.key] === v}
                          onChange={handleChange}
                        />
                        {v}
                      </label>
                    ))}
                  </div>
                )}
                {row.type === "status" && (
                  <select
                    name={row.key}
                    className="select select-bordered select-sm w-full"
                    value={form[row.key] || ""}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    {row.options.map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                )}
                {row.sl === 8 && (
                  <select
                    name="postClearanceStatus"
                    className="select select-bordered select-sm w-full"
                    value={form.postClearanceStatus || ""}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    {row.options.map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                )}
              </td>
              <td>
                <div className="text-xs mb-1">{row.remark}</div>
                {row.allowUpload && form[row.key] === "Yes" && (
                  <input
                    type="file"
                    name={`${row.key}Doc`}
                    className="file-input file-input-bordered file-input-sm"
                    onChange={handleFileChange}
                  />
                )}

                {row.sl === 6 && form.periodicCompliance === "Yes" && (
                  <select
                    name="compliancePeriod"
                    className="select select-bordered select-sm mt-1 w-full"
                    onChange={handleChange}
                  >
                    <option value="">Select Period</option>
                    <option value="Half-Yearly">Half-Yearly</option>
                    <option value="Annual">Annual</option>
                  </select>
                )}
                {row.sl === 7 &&
                  form.inspectionObservations === "Open" && (
                    <textarea
                      name="inspectionRemarks"
                      className="textarea textarea-bordered textarea-sm mt-1 w-full"
                      placeholder="Enter inspection observations"
                      onChange={handleChange}
                    />
                  )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end mt-4">
        <button className="btn btn-success btn-sm">
          Save Post-Clearance
        </button>
      </div>
    </form>
  );
};

export default LevelThreeForm;
