import { X } from "lucide-react";
import React, { useState, useMemo } from "react";

/* ===================== CONFIG ===================== */

export const STAGE_0_DATA = [
  {
    sl: 1,
    key: "dgpsSurveyDone",
    label: "DGPS Survey Done",
    type: "yesno",
    remark: "DGPS report (all projects with FL)",
    maxFiles: 1,
    accept: ".pdf,.jpg,.png",
  },
  {
    sl: 2,
    key: "dgpsArea",
    label: "DGPS Area (ha)",
    type: "text",
    remark: "",
  },
  {
    sl: 3,
    key: "orsac",
    label: "ORSAC",
    type: "yesno",
    remark: "ORSAC auth letters (where applicable)",
    maxFiles: 1,
    accept: ".pdf",
  },
  {
    sl: 4,
    key: "treeEnumeration",
    label: "Tree Enumeration",
    type: "yesno",
    remark: "Enumeration report",
    maxFiles: 2,
    accept: ".pdf,.jpg,.png",
  },
  {
    sl: 5,
    key: "administrativeDocs",
    label: "Administrative Documents",
    type: "yesno",
    remark: "Authorization, Checklist, Form-A",
    maxFiles: 3,
    accept: ".pdf",
  },
  {
    sl: 6,
    key: "legalLease",
    label: "Legal & Lease",
    type: "yesno",
    remark: "Grant Order / Lease (LoI if lease based)",
    maxFiles: 2,
    accept: ".pdf",
  },
  {
    sl: 7,
    key: "technicalData",
    label: "Technical Data",
    type: "yesno",
    remark: "DPR, Mining Plan, Alignment Plan, Site Layout",
    maxFiles: 3,
    accept: ".pdf",
  },
  {
    sl: 8,
    key: "forestLandDetails",
    label: "Forest & Land Details",
    type: "status",
    options: ["Uploaded", "Not Uploaded"],
    remark: "FL location, area, land use",
    maxFiles: 2,
    accept: ".pdf,.jpg,.png",
  },
  {
    sl: 9,
    key: "caPlanning",
    label: "CA / CA Planning",
    type: "yesno",
    remark: "CA land if applicable",
    maxFiles: 2,
    accept: ".pdf",
  },
  {
    sl: 10,
    key: "fraCompliance",
    label: "FRA & Community",
    type: "status",
    options: ["Completed", "Not Completed"],
    remark: "FRA certificates / exemption",
    maxFiles: 2,
    accept: ".pdf",
  },
  {
    sl: 11,
    key: "envStatutory",
    label: "Environmental & Statutory",
    type: "status",
    options: ["Cleared", "Not Cleared"],
    remark: "EC / SPCB NOC",
    maxFiles: 2,
    accept: ".pdf",
  },
  {
    sl: 12,
    key: "wildlifeSafeguards",
    label: "Wildlife & Safeguards",
    type: "status",
    options: ["Completed", "Not Completed"],
    remark: "WLCP if PA/ESZ involved",
    maxFiles: 1,
    accept: ".pdf",
  },
  {
    sl: 13,
    key: "mapsSpatial",
    label: "Maps & Spatial Evidence",
    type: "status",
    options: ["Authenticated", "Not Authenticated"],
    remark: "DGPS maps, Toposheets, CA & RCA maps",
    maxFiles: 3,
    accept: ".pdf,.jpg,.png",
  },
  {
    sl: 14,
    key: "financial",
    label: "Financial",
    type: "status",
    options: ["Submitted", "Not Submitted"],
    remark: "NPV, CA, ACA declarations",
    maxFiles: 3,
    accept: ".pdf",
  },
  {
    sl: 15,
    key: "proposalSubmitted",
    label: "Proposal Submitted",
    type: "yesno",
    remark: "PARIVESH submission proof",
    maxFiles: 1,
    accept: ".pdf",
  },
  {
    sl: 16,
    key: "pariveshProposal",
    label: "PARIVESH Proposal No.",
    type: "text",
    remark: "",
  },
  {
    sl: 17,
    key: "submissionDate",
    label: "Submission Date",
    type: "date",
    remark: "",
  },
  {
    sl: 18,
    key: "stage0Status",
    label: "Stage-0 Status",
    type: "auto",
    remark: "",
  },
];

/* ===================== FILE PREVIEW ===================== */

const FilePreview = ({ file }) => {
  const url = URL.createObjectURL(file);

  if (file.type.startsWith("image/")) {
    return (
      <img
        src={url}
        alt={file.name}
        className="w-14 h-14 object-cover rounded border"
      />
    );
  }

  if (file.type === "application/pdf") {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 underline text-xs"
      >
        📄 View PDF
      </a>
    );
  }

  return <span className="text-xs">{file.name}</span>;
};

/* ===================== COMPONENT ===================== */

const StageZeroForm = () => {
  const [form, setForm] = useState({});
  const [files, setFiles] = useState({});
  const [inputKeys, setInputKeys] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e, row) => {
    const selectedFiles = Array.from(e.target.files);
    const existingFiles = files[row.key] || [];
    const maxFiles = row.maxFiles || 1;

    if (existingFiles.length + selectedFiles.length > maxFiles) {
      alert(`Maximum ${maxFiles} file(s) allowed for ${row.label}`);
      return;
    }

    setFiles((prev) => ({
      ...prev,
      [row.key]: [...existingFiles, ...selectedFiles],
    }));

    // reset file input
    setInputKeys((prev) => ({
      ...prev,
      [row.key]: Date.now(),
    }));
  };

  const handleRemoveFile = (rowKey, index) => {
    setFiles((prev) => ({
      ...prev,
      [rowKey]: prev[rowKey].filter((_, i) => i !== index),
    }));
  };

  const stage0Status = useMemo(() => {
    return form.proposalSubmitted === "Yes" ? "READY" : "ON-GOING";
  }, [form.proposalSubmitted]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      stage0Status,
      documents: files,
    };

    console.log("STAGE-0 PAYLOAD:", payload);
    alert("Stage-0 Saved Successfully");
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 max-w-6xl mx-auto">
      <h2 className="text-lg font-bold mb-4">
        Stage-0 : Proposal Preparation & Readiness (Pre-PARIVESH)
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
          {STAGE_0_DATA.map((row) => (
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

                {row.type === "text" && (
                  <input
                    type="text"
                    name={row.key}
                    className="input input-bordered input-sm"
                    value={form[row.key] || ""}
                    onChange={handleChange}
                  />
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

                {row.type === "auto" && (
                  <input
                    readOnly
                    className="input input-bordered input-sm bg-gray-100"
                    value={stage0Status}
                  />
                )}
              </td>

              <td>
                {row.remark && (
                  <div className="text-xs text-gray-600 mb-1">
                    {row.remark}
                  </div>
                )}

                {["Yes", "Uploaded", "Completed", "Submitted", "Authenticated"].includes(
                  form[row.key]
                ) && (
                  <>
                    <input
                      key={inputKeys[row.key] || "default"}
                      type="file"
                      accept={row.accept}
                      multiple={row.maxFiles > 1}
                      className="file-input file-input-bordered file-input-sm"
                      onChange={(e) => handleFileChange(e, row)}
                    />

                    <div className="text-xs text-gray-500">
                      Max {row.maxFiles || 1} file(s)
                    </div>

                    {files[row.key]?.map((file, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 bg-gray-100 px-2 py-1 rounded mt-1"
                      >
                        <FilePreview file={file} />

                        <span className="truncate text-xs flex-1">
                          {file.name}
                        </span>

                        <button
                          type="button"
                          onClick={() => handleRemoveFile(row.key, idx)}
                          className="text-red-500"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end mt-4">
        <button className="btn btn-success btn-sm">
          Save Stage-0
        </button>
      </div>
    </form>
  );
};

export default StageZeroForm;
