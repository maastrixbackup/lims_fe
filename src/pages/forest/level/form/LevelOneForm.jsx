import React, { useState } from "react";

/* ================= HELPERS ================= */

const isPositiveSelection = (value) => {
  if (!value) return false;
  const negativeWords = ["no", "not"];
  return !negativeWords.some((w) => value.toLowerCase().includes(w));
};

/* ================= EMPTY FORM ================= */

const emptyForm = {
  projectId: "",

  dgpsSurvey: "",
  dgpsSurveyFile: {},

  dgpsArea: "",

  orsacAuthNo: "",
  orsacAuthNoFile: {},

  orsacAuthDate: "",

  treeEnum: "",
  treeEnumFile: {},

  totalTrees: "",

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

  submissionDate: "",
  stageStatus: "",
};

/* ================= FIELD CONFIG ================= */

const fields = [
  {
    name: "dgpsSurvey",
    label: "DGPS Survey Done",
    options: ["Yes", "No"],
    upload: true,
  },
  // { name: "orsacAuthNo", label: "ORSAC Auth No", options: ["Entered"], upload: true },
  {
    name: "treeEnum",
    label: "Tree Enumeration",
    options: ["Yes", "No"],
    upload: true,
  },

  {
    name: "adminDocs",
    label: "Administrative Docs",
    options: ["Yes", "No"],
    upload: true,
  },
  {
    name: "legalDocs",
    label: "Legal & Lease Docs",
    options: ["Yes", "No"],
    upload: true,
  },
  {
    name: "technicalData",
    label: "Technical Data",
    options: ["Yes", "No"],
    upload: true,
  },

  {
    name: "forestLand",
    label: "Forest & Land",
    options: ["Uploaded", "Not Uploaded"],
    upload: true,
  },
  {
    name: "caPlanning",
    label: "CA / ACA Planning",
    options: ["Yes", "No"],
    upload: true,
  },
  {
    name: "fraRecords",
    label: "FRA Records",
    options: ["Complied", "Not Complied"],
    upload: true,
  },

  {
    name: "envStatutory",
    label: "Environmental",
    options: ["Cleared", "Not Cleared"],
    upload: true,
  },
  {
    name: "wildlife",
    label: "Wildlife",
    options: ["Completed", "Not Completed"],
    upload: true,
  },

  {
    name: "maps",
    label: "Maps Evidence",
    options: ["Authenticated", "Not Authenticated"],
    upload: true,
  },

  {
    name: "finance",
    label: "Financial Undertaking",
    options: ["Submitted", "Not Submitted"],
    upload: true,
  },

  {
    name: "proposalSubmitted",
    label: "Proposal Submitted",
    options: ["Yes", "No"],
    upload: true,
  },
];

/* ================= DOCUMENT REQUIREMENTS ================= */

const docRequirements = {
  dgpsSurvey: ["DGPS Survey Report"],
  // orsacAuthNo: ["ORSAC Authorization Letter"],
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
};

/* ================= COMPONENT ================= */

const LevelOneForm = ({ setRows, setShowModal }) => {
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

  const removeFile = (field, docName, index) => {
    setForm((prev) => ({
      ...prev,
      [`${field}File`]: {
        ...prev[`${field}File`],
        [docName]: prev[`${field}File`][docName].filter((_, i) => i !== index),
      },
    }));
  };

  /* ===== SUBMIT VALIDATION ===== */

  const handleSubmit = () => {
    for (let f of fields) {
      const val = form[f.name];

      if (f.upload && isPositiveSelection(val)) {
        const filesObj = form[`${f.name}File`];
        const hasAnyFile = Object.values(filesObj || {}).some(
          (arr) => arr.length > 0,
        );

        if (!hasAnyFile) {
          alert(`Upload required for ${f.label}`);
          return;
        }
      }
    }

    setRows((prev) => [...prev, form]);
    setShowModal(false);
    setForm(emptyForm);
  };

  return (
    <dialog className="modal modal-open">
      <div className="modal-box max-w-2xl">
        <h3 className="font-bold mb-4">LEVEL-1 FD PROPOSAL</h3>

        <div className="grid grid-cols-3 gap-3 text-sm">
          <input
            name="projectId"
            placeholder="Project ID"
            className="input input-bordered"
            onChange={handleChange}
          />
          <input
            type="number"
            name="dgpsArea"
            placeholder="DGPS Area"
            className="input input-bordered"
            onChange={handleChange}
          />
          <input
            type="number"
            name="totalTrees"
            placeholder="Total Trees"
            className="input input-bordered"
            onChange={handleChange}
          />

          <input
            type="number"
            name="orsacAuthNo"
            placeholder="ORSAC Auth No"
            className="input input-bordered"
            onChange={handleChange}
          />
          <input
            name="stageStatus"
            placeholder="Stage 1 Status"
            className="input input-bordered"
            onChange={handleChange}
          />
          <input
            type="number"
            name="parivesh_proposal_no"
            placeholder="PARIVESH Proposal No"
            className="input input-bordered"
            onChange={handleChange}
          />
          {fields.map((f) => (
            <select
              key={f.name}
              name={f.name}
              className="select select-bordered"
              onChange={(e) => {
                handleChange(e);
                if (
                  isPositiveSelection(e.target.value) &&
                  docRequirements[f.name]
                ) {
                  setDocModal({ open: true, field: f.name });
                }
              }}
            >
              <option value="">{f.label}</option>
              {f.options.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6 mt-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">ORSAC Auth Date</span>
            </label>
            <input
              type="date"
              name="orsacAuthDate"
              className="input input-bordered w-full"
              onChange={handleChange}
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Submission Date</span>
            </label>
            <input
              type="date"
              name="submissionDate"
              className="input input-bordered w-full"
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="modal-action">
          <button className="btn btn-success btn-sm" onClick={handleSubmit}>
            Save
          </button>
          <button className="btn btn-sm" onClick={() => setShowModal(false)}>
            Cancel
          </button>
        </div>
      </div>

      {docModal.open && (
        <dialog className="modal modal-open">
          <div className="modal-box max-w-lg">
            <h3 className="font-bold mb-3">Required Documents</h3>

            {docRequirements[docModal.field].map((doc) => (
              <div key={doc} className="mb-4">
                <label className="text-sm">{doc}</label>

                <input
                  type="file"
                  multiple
                  className="input input-bordered w-full mt-1"
                  onChange={(e) =>
                    handleFiles(docModal.field, doc, e.target.files)
                  }
                />

                {(form[`${docModal.field}File`][doc] || []).map((file, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between bg-base-200 px-2 py-1 rounded mt-1 text-xs"
                  >
                    {file.name}
                    <button
                      className="btn btn-xs btn-error"
                      onClick={() => removeFile(docModal.field, doc, idx)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            ))}

            <div className="modal-action">
              <button
                className="btn btn-sm btn-primary"
                onClick={() => setDocModal({ open: false, field: "" })}
              >
                Done
              </button>
            </div>
          </div>
        </dialog>
      )}
    </dialog>
  );
};

export default LevelOneForm;
