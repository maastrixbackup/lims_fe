import { X } from "lucide-react";
import React, { useState } from "react";

/* ---------------- HELPERS ---------------- */

const isPositiveSelection = (value) => {
  if (!value) return false;
  const negativeWords = ["no", "not"];
  return !negativeWords.some((w) => value.toLowerCase().includes(w));
};

const getUploadedCount = (filesObj = {}) =>
  Object.values(filesObj).reduce((sum, arr) => sum + (arr?.length || 0), 0);

const getAllFiles = (filesObj = {}) => Object.values(filesObj).flat();

/* ---------------- INITIAL STATE ---------------- */

const emptyForm = {
  projectId: "",
  dgpsArea: "",
  totalTrees: "",
  orsacAuthNo: "",
  stageStatus: "",
  parivesh_proposal_no: "",
  orsacAuthDate: "",
  submissionDate: "",

  dgpsSurvey: "",
  dgpsSurveyFile: {},
  treeEnum: "",
  treeEnumFile: {},
  adminDocs: "",
  adminDocsFile: {},
  legalDocs: "",
  legalDocsFile: {},
  technicalData: "",
  technicalDataFile: {},
  forestLand: "",
  forestLandFile: {},
  caPlanning: "",
  caPlanningFile: {},
  fraRecords: "",
  fraRecordsFile: {},
  envStatutory: "",
  envStatutoryFile: {},
  wildlife: "",
  wildlifeFile: {},
  maps: "",
  mapsFile: {},
  finance: "",
  financeFile: {},
  proposalSubmitted: "",
  proposalSubmittedFile: {},
  others: "",
  othersFile: {},
};

/* ---------------- FIELD CONFIG ---------------- */

const fields = [
  { name: "dgpsSurvey", label: "DGPS Survey Done", options: ["Yes", "No"] },
  { name: "treeEnum", label: "Tree Enumeration", options: ["Yes", "No"] },
  { name: "adminDocs", label: "Administrative Docs", options: ["Yes", "No"] },
  { name: "legalDocs", label: "Legal & Lease Docs", options: ["Yes", "No"] },
  { name: "technicalData", label: "Technical Data", options: ["Yes", "No"] },
  { name: "forestLand", label: "Forest & Land", options: ["Uploaded", "Not Uploaded"] },
  { name: "caPlanning", label: "CA / ACA Planning", options: ["Yes", "No"] },
  { name: "fraRecords", label: "FRA Records", options: ["Complied", "Not Complied"] },
  { name: "envStatutory", label: "Environmental", options: ["Cleared", "Not Cleared"] },
  { name: "wildlife", label: "Wildlife", options: ["Completed", "Not Completed"] },
  { name: "maps", label: "Maps Evidence", options: ["Authenticated", "Not Authenticated"] },
  { name: "finance", label: "Financial Undertaking", options: ["Submitted", "Not Submitted"] },
  { name: "proposalSubmitted", label: "Proposal Submitted", options: ["Yes", "No"] },
  { name: "others", label: "Others / Miscellaneous", options: ["Yes", "No"] },
];

const docRequirements = {
  dgpsSurvey: ["DGPS Survey Report"],
  treeEnum: ["Tree Enumeration Report"],
  adminDocs: ["Authorization", "Checklist", "Form-A"],
  legalDocs: ["Grant Order", "Lease Deed", "LOI"],
  technicalData: ["DPR", "Mining Plan", "Forest Area Justification"],
  forestLand: ["FL Location & Area", "Tree Enumeration", "Land Use"],
  caPlanning: ["CA Land", "Suitability", "DSS", "ACA Scheme"],
  fraRecords: ["FRA Correspondence", "Compliance Report"],
  envStatutory: ["EC", "SPCB NOC"],
  wildlife: ["SSWLCP", "Wildlife Payment Receipt"],
  maps: ["DGPS Map", "Topo Map", "CA/ACA Map", "Wildlife Map"],
  finance: ["NPV", "CA", "ACA", "Safety Zone Declarations"],
  proposalSubmitted: ["Proposal Document"],
  others: [""],
};

/* ---------------- COMPONENT ---------------- */

const LevelOneForm = ({ setRows }) => {
  const [form, setForm] = useState(emptyForm);
  const [docModal, setDocModal] = useState({ open: false, field: "" });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleFiles = (field, docName, files) => {
    setForm((prev) => ({
      ...prev,
      [`${field}File`]: {
        ...prev[`${field}File`],
        [docName]: [
          ...(prev[`${field}File`][docName] || []),
          ...Array.from(files),
        ],
      },
    }));
  };

  const removeFile = (field, doc, idx) => {
    setForm((prev) => {
      const updated = [...(prev[`${field}File`][doc] || [])];
      updated.splice(idx, 1);

      return {
        ...prev,
        [`${field}File`]: {
          ...prev[`${field}File`],
          [doc]: updated,
        },
      };
    });
  };

  const resetFilesForField = (field) =>
    setForm((prev) => ({ ...prev, [`${field}File`]: {} }));

  const handleSubmit = (e) => {
    e.preventDefault();

    for (let f of fields) {
      if (isPositiveSelection(form[f.name])) {
        if (!getUploadedCount(form[`${f.name}File`])) {
          alert(`Upload required for ${f.label}`);
          return;
        }
      }
    }

    setRows((prev) => [...prev, form]);
  };

  const totalFiles = fields.reduce(
    (sum, f) => sum + getUploadedCount(form[`${f.name}File`]),
    0
  );

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">

      <h3 className="font-bold text-lg mb-4">LEVEL-1 FD PROPOSAL</h3>

      <div className="alert alert-info py-2 text-sm mb-4">
        📎 Total Files Uploaded: <b>{totalFiles}</b>
      </div>

      {/* BASIC INPUTS */}
      <div className="grid grid-cols-3 gap-3">
        {[
          ["projectId", "Project ID"],
          ["dgpsArea", "DGPS Area"],
          ["totalTrees", "Total Trees"],
          ["orsacAuthNo", "ORSAC Auth No"],
          ["stageStatus", "Stage 1 Status"],
          ["parivesh_proposal_no", "PARIVESH Proposal No"],
        ].map(([n, l]) => (
          <div key={n}>
            <label className="label-text font-medium">{l}</label>
            <input name={n} className="input input-bordered w-full" onChange={handleChange} />
          </div>
        ))}
      </div>

      {/* SELECTS */}
      <div className="grid grid-cols-3 gap-3 mt-4">
        {fields.map((f) => (
          <div key={f.name}>
            <label className="label-text font-medium">{f.label}</label>

            <select
              name={f.name}
              className="select select-bordered w-full"
              onChange={(e) => {
                handleChange(e);
                isPositiveSelection(e.target.value)
                  ? setDocModal({ open: true, field: f.name })
                  : resetFilesForField(f.name);
              }}
            >
              <option value="">Select</option>
              {f.options.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </div>
        ))}
      </div>

      {/* DATES */}
      <div className="grid grid-cols-2 gap-4 mt-4">
        {[
          ["orsacAuthDate", "ORSAC Auth Date"],
          ["submissionDate", "Submission Date"],
        ].map(([n, l]) => (
          <div key={n}>
            <label className="label-text font-medium">{l}</label>
            <input type="date" name={n} className="input input-bordered w-full" onChange={handleChange} />
          </div>
        ))}
      </div>

      <div className="flex justify-end mt-6">
        <button type="submit" className="btn btn-success btn-sm">
          Save Level-1
        </button>
      </div>

      {/* DOCUMENT MODAL KEPT */}

      {docModal.open && (
        <dialog className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold mb-3">Required Documents</h3>

            {docRequirements[docModal.field].map((doc) => (
              <div key={doc} className="mb-4">
                <input
                  type="file"
                  multiple
                  className="file-input file-input-bordered w-full"
                  onChange={(e) => handleFiles(docModal.field, doc, e.target.files)}
                />

                {(form[`${docModal.field}File`][doc] || []).map((file, idx) => (
                  <div key={idx} className="flex justify-between mt-2">
                    <span className="text-xs">{file.name}</span>
                    <button type="button" onClick={() => removeFile(docModal.field, doc, idx)}>
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            ))}

            <button className="btn btn-primary btn-sm" onClick={() => setDocModal({ open: false, field: "" })}>
              Done
            </button>
          </div>
        </dialog>
      )}
    </form>
  );
};

export default LevelOneForm;
