import React, { useState, useRef } from "react";
import { X } from "lucide-react";

const POST_CLEARANCE_DATA = [
  { sl: 1, key: "ca_plantation_started", label: "CA Plantation Started", type: "yesno", remark: "Plantation report", allowUpload: true },
  { sl: 2, key: "ca_plantation_completed", label: "CA Plantation Completed", type: "yesno", remark: "Completion report", allowUpload: true },
  { sl: 3, key: "survival_report_submitted", label: "Survival Report Submitted", type: "yesno", remark: "Annual survival report", allowUpload: true },
  { sl: 4, key: "wildlife_mitigation", label: "Wildlife Mitigation Implemented", type: "yesno", remark: "If applicable", allowUpload: true },
  { sl: 5, key: "safety_zone_maintained", label: "Safety Zone Maintained", type: "yesno", remark: "Inspection report", allowUpload: true },
  { sl: 6, key: "periodic_compliance", label: "Periodic Compliance Submitted", type: "yesno", remark: "Half-yearly / Annual", allowUpload: false },
  { sl: 7, key: "inspection_observations", label: "Inspection Observations", type: "status", options: ["Open", "Closed"], remark: "Remarks", allowUpload: false },
  { sl: 8, key: "post_clearance_status", label: "Post-Clearance Status", type: "dropdown", options: ["Ongoing", "Completed"], remark: "", allowUpload: false },
];

const LevelThreeForm = ({ onStageComplete }) => {
  const [form, setForm] = useState({});
  const [files, setFiles] = useState({});
  const fileRefs = useRef({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* 📂 SINGLE FILE UPLOAD */
  const handleFileChange = (e, key) => {
    const file = e.target.files[0];
    if (!file) return;

    setFiles((prev) => ({
      ...prev,
      [key]: file,
    }));

    e.target.value = "";
  };

  /* 👁 VIEW FILE */
  const handleViewFile = (file) => {
    const url = URL.createObjectURL(file);
    window.open(url, "_blank");
  };

  /* ❌ REMOVE FILE */
  const handleRemoveFile = (key) => {
    setFiles((prev) => {
      const updated = { ...prev };
      delete updated[key];
      return updated;
    });

    if (fileRefs.current[key]) {
      fileRefs.current[key].value = "";
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log({
      ...form,
      documents: files,
    });

    alert("Post-Clearance Data Saved");
    onStageComplete?.();
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

              {/* STATUS */}
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

                {row.key === "post_clearance_status" && (
                  <select
                    name="post_clearance_status"
                    className="select select-bordered select-sm w-full"
                    value={form.post_clearance_status || ""}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    {row.options.map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                )}
              </td>

              {/* DOCUMENTS */}
              <td>
                <div className="text-xs mb-1">{row.remark}</div>

                {row.allowUpload && form[row.key] === "Yes" && (
                  <>
                    <input
                      type="file"
                      ref={(el) => (fileRefs.current[row.key] = el)}
                      className="file-input file-input-bordered file-input-sm w-full"
                      onChange={(e) => handleFileChange(e, row.key)}
                    />

                    {files[row.key] && (
                      <div className="flex items-center justify-between text-xs bg-gray-100 px-2 py-1 rounded mt-1">
                        <span
                          className="truncate cursor-pointer text-gray-600"
                          onClick={() => handleViewFile(files[row.key])}
                          title="Click to view"
                        >
                          • {files[row.key].name}
                        </span>

                        <button
                          type="button"
                          onClick={() => handleRemoveFile(row.key)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    )}
                  </>
                )}

                {row.key === "periodic_compliance" && form.periodic_compliance === "Yes" && (
                  <select
                    name="compliance_period"
                    className="select select-bordered select-sm mt-1 w-full"
                    onChange={handleChange}
                  >
                    <option value="">Select Period</option>
                    <option value="Half-Yearly">Half-Yearly</option>
                    <option value="Annual">Annual</option>
                  </select>
                )}

                {row.key === "inspection_observations" && form.inspection_observations === "Open" && (
                  <textarea
                    name="inspection_remarks"
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
