import { X } from "lucide-react";
import React, { useState, useMemo } from "react";

const STAGE_II_DATA = [
  {
    "sl": 1,
    "key": "environmental_clearance",
    "label": "Environmental Clearance",
    "type": "status",
    "options": ["Obtained", "Not Obtained"],
    "remark": "EC letter (if applicable)",
    "allowUpload": true
  },
  {
    "sl": 2,
    "key": "nbwl_clearance",
    "label": "NBWL Clearance",
    "type": "status",
    "options": ["Obtained", "Not Obtained"],
    "remark": "NBWL approval (if applicable)",
    "allowUpload": true
  },
  {
    "sl": 3,
    "key": "final_ca_execution",
    "label": "Final CA Execution",
    "type": "status",
    "options": ["Completed", "Pending"],
    "remark": "Execution proof",
    "allowUpload": true
  },
  {
    "sl": 4,
    "key": "final_maps_approved",
    "label": "Final Maps Approved",
    "type": "yesno",
    "remark": "Approved maps",
    "allowUpload": true
  },
  {
    "sl": 5,
    "key": "final_technical_approval",
    "label": "Final Technical Approval",
    "type": "status",
    "options": ["Completed", "Pending"],
    "remark": "Mining / Linear approval",
    "allowUpload": true
  },
  {
    "sl": 6,
    "key": "stage_2_approval_letter",
    "label": "Stage-II Approval Letter",
    "type": "yesno",
    "remark": "Final FC Letter Upload",
    "allowUpload": true
  },
  {
    "sl": 7,
    "key": "stage_2_approval_date",
    "label": "Stage-II Approval Date",
    "type": "date"
  },
  {
    "sl": 8,
    "key": "approved_forest_area",
    "label": "Approved Forest Area (Ha)",
    "type": "text"
  },
  {
    "sl": 9,
    "key": "approved_non_forest_area",
    "label": "Approved Non-Forest Area (Ha)",
    "type": "text"
  },
  {
    "sl": 10,
    "key": "stage_2_status",
    "label": "Stage-II Status",
    "type": "chip"
  },
  {
    "sl": 11,
    "key": "eligible_post_clearance",
    "label": "Eligible for Post-Clearance?",
    "type": "yesno"
  }
]


const LevelTwoForm = ({ onStageComplete }) => {
  const [form, setForm] = useState({});
  const [files, setFiles] = useState({});
  const [inputKeys, setInputKeys] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e, rowKey) => {
    const selectedFiles = Array.from(e.target.files);

    setFiles((prev) => ({
      ...prev,
      [rowKey]: [...(prev[rowKey] || []), ...selectedFiles],
    }));

    setInputKeys((prev) => ({
      ...prev,
      [rowKey]: Date.now(),
    }));
  };

  const handleRemoveFile = (rowKey, index) => {
    setFiles((prev) => ({
      ...prev,
      [rowKey]: prev[rowKey].filter((_, i) => i !== index),
    }));
  };
  const stage_2_status = useMemo(() => {
    return form.stage_2_approval_letter === "Yes"
      ? "Granted"
      : "Not Granted";
  }, [form.stage_2_approval_letter]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      stage_2_status,
      documents: files,
    };

    console.log("STAGE-II PAYLOAD:", payload);
    alert("Stage-II Saved Successfully");
    onStageComplete?.();
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 max-w-6xl mx-auto">
      <h2 className="text-lg font-bold mb-4">
        Stage – II : Final Approval
      </h2>

      <table className="table table-bordered w-full text-sm">
        <thead>
          <tr className="bg-gray-200">
            <th>Sl</th>
            <th>Parameter</th>
            <th>Status</th>
            <th>Documents / Remarks</th>
          </tr>
        </thead>

        <tbody>
          {STAGE_II_DATA.map((row) => (
            <tr key={row.key}>
              <td>{row.sl}</td>
              <td>{row.label}</td>

              {/* STATUS COLUMN */}
              <td>
                {row.type === "yesno" && (
                  <div className="flex gap-4">
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
                    className="select select-bordered select-sm"
                    value={form[row.key] || ""}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    {row.options.map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                )}

                {row.type === "date" && (
                  <input
                    type="date"
                    name={row.key}
                    className="input input-bordered input-sm"
                    value={form[row.key] || ""}
                    onChange={handleChange}
                  />
                )}

                {row.type === "text" && (
                  <input
                    type="text"
                    name={row.key}
                    className="input input-bordered input-sm w-full"
                    value={form[row.key] || ""}
                    onChange={handleChange}
                  />
                )}

                {/* ✅ STAGE-II STATUS CHIP */}
                {row.type === "chip" && (
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold
                      ${
                        stage_2_status === "Granted"
                          ? "bg-green-100 text-green-700 border border-green-300"
                          : "bg-red-100 text-red-700 border border-red-300"
                      }
                    `}
                  >
                    {stage_2_status}
                  </span>
                )}
              </td>

              {/* DOCUMENT COLUMN */}
              <td>
                {row.remark && (
                  <div className="text-xs mb-1 text-gray-600">
                    {row.remark}
                  </div>
                )}

                {row.allowUpload &&
                  ["Yes", "Obtained", "Completed"].includes(
                    form[row.key]
                  ) && (
                    <div className="space-y-1">
                      <input
                        key={inputKeys[row.key] || "default"}
                        type="file"
                        multiple
                        className="file-input file-input-bordered file-input-sm"
                        onChange={(e) =>
                          handleFileChange(e, row.key)
                        }
                      />

                      {/* 📄 FILE COUNT */}
                      {files[row.key]?.length > 0 && (
                        <div className="text-xs text-green-700">
                          {files[row.key].length} document(s) uploaded
                        </div>
                      )}

                      {/* 📂 FILE LIST */}
                      {files[row.key]?.map((file, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between text-xs bg-gray-100 px-2 py-1 rounded"
                        >
                          <span className="truncate">
                            • {file.name}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              handleRemoveFile(row.key, idx)
                            }
                            className="text-red-500 hover:text-red-700"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end mt-4">
        <button className="btn btn-success btn-sm">
          Save Stage-II
        </button>
      </div>
    </form>
  );
};

export default LevelTwoForm;

