import React, { useState, useMemo } from "react";
import { X } from "lucide-react";

const STAGE_I_IMAGE_DATA = [
  {
    "sl": 1,
    "key": "stage_1_approval_letter",
    "label": "Stage-I Approval Letter",
    "type": "upload",
    "options": ["Uploaded", "Not Uploaded"],
    "remark": "Stage-I FC letter",
    "allowUpload": true
  },
  {
    "sl": 2,
    "key": "stage_1_conditions",
    "label": "Stage-I Conditions",
    "type": "yesno",
    "remark": "Condition sheet",
    "allowUpload": true
  },
  {
    "sl": 3,
    "key": "ca_land_handed_over",
    "label": "CA Land Handed Over",
    "type": "yesno",
    "remark": "Handover docs",
    "allowUpload": true
  },
  {
    "sl": 4,
    "key": "fra_compliance",
    "label": "FRA Compliance",
    "type": "status",
    "options": ["Complied", "Pending"],
    "remark": "Final FRA certificate",
    "allowUpload": true
  },
  {
    "sl": 5,
    "key": "npv_payment",
    "label": "NPV Payment",
    "type": "paid",
    "remark": "NPV Payment Receipt",
    "allowUpload": true
  },
  {
    "sl": 6,
    "key": "ca_payment",
    "label": "CA Payment",
    "type": "paid",
    "remark": "CA Payment Receipt",
    "allowUpload": true
  },
  {
    "sl": 7,
    "key": "aca_payment",
    "label": "ACA / Additional Payments",
    "type": "paid",
    "remark": "ACA Receipt",
    "allowUpload": true
  },
  {
    "sl": 8,
    "key": "wildlife_payment",
    "label": "Wildlife Payments",
    "type": "paid",
    "remark": "If wildlife applicable",
    "allowUpload": true
  },
  {
    "sl": 9,
    "key": "technical_compliance",
    "label": "Technical Compliance",
    "type": "status",
    "options": ["Completed", "Pending"],
    "remark": "Mining / Linear approval",
    "allowUpload": true
  },
  {
    "sl": 10,
    "key": "stage_1_compliance",
    "label": "Stage-I Compliance Accepted",
    "type": "yesno",
    "remark": "Authority confirmation",
    "allowUpload": true
  },
  {
    "sl": 11,
    "key": "eligible_stage_2",
    "label": "Eligible for Stage-II",
    "type": "chip"
  },
  {
    "sl": 12,
    "key": "stage_1_status",
    "label": "Stage-I Status",
    "type": "chip"
  }
]


const LevelOneForm = () => {
  const [form, setForm] = useState({});
  const [files, setFiles] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ MULTI FILE UPLOAD
  const handleFileChange = (key, selectedFiles) => {
    setFiles((prev) => ({
      ...prev,
      [key]: [...(prev[key] || []), ...Array.from(selectedFiles)],
    }));
  };

  // ❌ REMOVE FILE
  const removeFile = (key, index) => {
    setFiles((prev) => ({
      ...prev,
      [key]: prev[key].filter((_, i) => i !== index),
    }));
  };

  // ✅ LOGIC
  const eligibleStage2 = useMemo(() => {
    return form.stage1Compliance === "Yes" &&
      form.fraCompliance === "Complied" &&
      form.technicalCompliance === "Completed"
      ? "Yes"
      : "No";
  }, [form]);

  const stage1Status = useMemo(() => {
    return form.stage1Compliance === "Yes" ? "Completed" : "Pending";
  }, [form.stage1Compliance]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("STAGE-I PAYLOAD:", { ...form, eligibleStage2, stage1Status, documents: files });
    alert("Stage-I Saved");
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 max-w-6xl mx-auto">
      <h2 className="font-bold text-lg mb-4">Stage – I : In-Principle Approval</h2>

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
          {STAGE_I_IMAGE_DATA.map((row) => (
            <tr key={row.key}>
              <td>{row.sl}</td>
              <td>{row.label}</td>

              {/* STATUS */}
              <td>
                {row.type === "yesno" && ["Yes", "No"].map((v) => (
                  <label key={v} className="mr-3">
                    <input type="radio" name={row.key} value={v}
                      checked={form[row.key] === v} onChange={handleChange} /> {v}
                  </label>
                ))}

                {["paid", "status", "upload"].includes(row.type) && (
                  <select
                    name={row.key}
                    value={form[row.key] || ""}
                    onChange={handleChange}
                    className="select select-bordered select-sm"
                  >
                    <option value="">Select</option>
                    {(row.options || ["Paid", "Not Paid"]).map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                )}

                {row.type === "chip" && row.key === "eligibleStage2" && (
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold
                    ${eligibleStage2 === "Yes" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {eligibleStage2}
                  </span>
                )}

                {row.type === "chip" && row.key === "stage1Status" && (
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold
                    ${stage1Status === "Completed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                    {stage1Status}
                  </span>
                )}
              </td>

              <td>
                <div className="text-xs mb-1">{row.remark}</div>

                {row.allowUpload &&
                  ["Yes", "Paid", "Uploaded", "Complied", "Completed"].includes(form[row.key]) && (
                    <>
                      <input
                        type="file"
                        multiple
                        className="file-input file-input-bordered file-input-sm"
                        onChange={(e) => handleFileChange(row.key, e.target.files)}
                      />

                      {files[row.key]?.length > 0 && (
                        <div className="text-xs text-green-700 mt-1">
                          {files[row.key].length} document(s) uploaded
                        </div>
                      )}
                      <ul className="mt-1 space-y-1">
                        {files[row.key]?.map((f, i) => (
                          <li key={i} className="flex items-center gap-2 text-xs bg-gray-100 px-2 py-1 rounded">
                            <span className="truncate">{f.name}</span>
                            <button type="button" onClick={() => removeFile(row.key, i)}>
                              <X size={14} className="text-red-500" />
                            </button>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end mt-4">
        <button className="btn btn-success btn-sm">Save Stage-I</button>
      </div>
    </form>
  );
};

export default LevelOneForm;
