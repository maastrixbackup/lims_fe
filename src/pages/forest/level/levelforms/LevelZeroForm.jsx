// import { X } from "lucide-react";
// import React, { useState } from "react";

// const isPositiveSelection = (value) => {
//   if (!value) return false;
//   const negativeWords = ["no", "not"];
//   return !negativeWords.some((w) => value.toLowerCase().includes(w));
// };

// const getUploadedCount = (filesObj = {}) =>
//   Object.values(filesObj).reduce((sum, arr) => sum + (arr?.length || 0), 0);

// const getAllFiles = (filesObj = {}) => Object.values(filesObj).flat();

// const emptyForm = {
//   projectId: "",
//   dgpsArea: "",
//   totalTrees: "",
//   orsacAuthNo: "",
//   stageStatus: "",
//   parivesh_proposal_no: "",
//   orsacAuthDate: "",
//   submissionDate: "",

//   dgpsSurvey: "",
//   dgpsSurveyFile: {},

//   treeEnum: "",
//   treeEnumFile: {},

//   adminDocs: "",
//   adminDocsFile: {},

//   legalDocs: "",
//   legalDocsFile: {},

//   technicalData: "",
//   technicalDataFile: {},

//   forestLand: "",
//   forestLandFile: {},

//   caPlanning: "",
//   caPlanningFile: {},

//   fraRecords: "",
//   fraRecordsFile: {},

//   envStatutory: "",
//   envStatutoryFile: {},

//   wildlife: "",
//   wildlifeFile: {},

//   maps: "",
//   mapsFile: {},

//   finance: "",
//   financeFile: {},

//   proposalSubmitted: "",
//   proposalSubmittedFile: {},
//   others: "",
//   othersFile: {},
// };

// const fields = [
//   { name: "dgpsSurvey", label: "DGPS Survey Done", options: ["Yes", "No"] },
//   { name: "treeEnum", label: "Tree Enumeration", options: ["Yes", "No"] },
//   { name: "adminDocs", label: "Administrative Docs", options: ["Yes", "No"] },
//   { name: "legalDocs", label: "Legal & Lease Docs", options: ["Yes", "No"] },
//   { name: "technicalData", label: "Technical Data", options: ["Yes", "No"] },
//   {
//     name: "forestLand",
//     label: "Forest & Land",
//     options: ["Uploaded", "Not Uploaded"],
//   },
//   { name: "caPlanning", label: "CA / ACA Planning", options: ["Yes", "No"] },
//   {
//     name: "fraRecords",
//     label: "FRA Records",
//     options: ["Complied", "Not Complied"],
//   },
//   {
//     name: "envStatutory",
//     label: "Environmental",
//     options: ["Cleared", "Not Cleared"],
//   },
//   {
//     name: "wildlife",
//     label: "Wildlife",
//     options: ["Completed", "Not Completed"],
//   },
//   {
//     name: "maps",
//     label: "Maps Evidence",
//     options: ["Authenticated", "Not Authenticated"],
//   },
//   {
//     name: "finance",
//     label: "Financial Undertaking",
//     options: ["Submitted", "Not Submitted"],
//   },
//   {
//     name: "proposalSubmitted",
//     label: "Proposal Submitted",
//     options: ["Yes", "No"],
//   },
//   {
//     name: "others",
//     label: "Others/ miscellaneous",
//     options: ["Yes", "No"],
//   },
// ];

// const docRequirements = {
//   dgpsSurvey: ["DGPS Survey Report"],
//   treeEnum: ["Tree Enumeration Report"],
//   adminDocs: ["Authorization", "Checklist", "Form-A"],
//   legalDocs: ["Grant Order", "Lease Deed", "LOI"],
//   technicalData: ["DPR", "Mining Plan", "Forest Area Justification"],
//   forestLand: ["FL Location & Area", "Tree Enumeration", "Land Use"],
//   caPlanning: ["CA Land", "Suitability", "DSS", "ACA Scheme"],
//   fraRecords: ["FRA Correspondence", "Compliance Report"],
//   envStatutory: ["EC", "SPCB NOC"],
//   wildlife: ["SSWLCP", "Wildlife Payment Receipt"],
//   maps: ["DGPS Map", "Topo Map", "CA/ACA Map", "Wildlife Map"],
//   finance: ["NPV", "CA", "ACA", "Safety Zone Declarations"],
//   proposalSubmitted: ["Proposal Document"],
//   others: [""],
// };

// const LevelZeroForm = () => {
//   const [form, setForm] = useState(emptyForm);
//   const [docModal, setDocModal] = useState({ open: false, field: "" });

//   const handleChange = (e) =>
//     setForm({ ...form, [e.target.name]: e.target.value });

//   const handleFiles = (field, docName, files) => {
//     setForm((prev) => ({
//       ...prev,
//       [`${field}File`]: {
//         ...prev[`${field}File`],
//         [docName]: [
//           ...(prev[`${field}File`][docName] || []),
//           ...Array.from(files),
//         ],
//       },
//     }));
//   };

//   const clearFileInput = (field, doc) => {
//     const input = document.querySelector(
//       `input[data-field="${field}"][data-doc="${doc}"]`,
//     );
//     if (input) {
//       input.value = "";
//     }
//   };

//   const removeFile = (field, doc, idx) => {
//     setForm((prev) => {
//       const fieldKey = `${field}File`;
//       const updatedFiles = [...(prev[fieldKey][doc] || [])];
//       updatedFiles.splice(idx, 1);

//       if (updatedFiles.length === 0) {
//         clearFileInput(field, doc);
//       }

//       return {
//         ...prev,
//         [fieldKey]: {
//           ...prev[fieldKey],
//           [doc]: updatedFiles,
//         },
//       };
//     });
//   };
//   const resetFilesForField = (field) => {
//     setForm((prev) => ({
//       ...prev,
//       [`${field}File`]: {},
//     }));
//   };

//   const handleSubmit = () => {
//     for (let f of fields) {
//       if (isPositiveSelection(form[f.name])) {
//         if (!getUploadedCount(form[`${f.name}File`])) {
//           alert(`Upload required for ${f.label}`);
//           return;
//         }
//       }
//     }

//     // setRows((prev) => [...prev, form]);
//     // setShowModal(false);
//   };

//   const totalFiles = fields.reduce(
//     (sum, f) => sum + getUploadedCount(form[`${f.name}File`]),
//     0,
//   );
//   const closeDocModal = () => {
//     const field = docModal.field;

//     if (field) {
//       const uploaded = getUploadedCount(form[`${field}File`]);

//       // If user selected YES but uploaded nothing → reset dropdown
//       if (!uploaded) {
//         setForm((prev) => ({
//           ...prev,
//           [field]: "", // reset select
//           [`${field}File`]: {}, // clear files
//         }));
//       }
//     }

//     setDocModal({ open: false, field: "" });
//   };

//   return (
//     <div className="mx-auto p-2">
//       <div>
//         <h3 className="font-bold text-lg mb-2">STAGE - 0 : Proposal Preparation & Readiness (Pre-PARIVESH)</h3>

//         <div className="alert alert-info py-2 text-sm mb-4">
//           📎 Total Files Uploaded: <b>{totalFiles}</b>
//         </div>

//         {/* BASIC INPUTS */}
//         <div className="grid grid-cols-3 gap-3">
//           {[
//             // ["projectId", "Project ID"],
//             ["dgpsArea", "DGPS Area"],
//             ["totalTrees", "Total Trees"],
//             ["orsacAuthNo", "ORSAC Auth No"],
//             ["stageStatus", "Stage 1 Status"],
//             ["parivesh_proposal_no", "PARIVESH Proposal No"],
//           ].map(([name, label]) => (
//             <div key={name} className="form-control">
//               <label className="label">
//                 <span className="label-text">{label}</span>
//               </label>
//               <input
//                 name={name}
//                 type={
//                   name.includes("No") || name.includes("Area")
//                     ? "number"
//                     : "text"
//                 }
//                 className="input input-bordered"
//                 onChange={handleChange}
//               />
//             </div>
//           ))}
//         </div>

//         {/* SELECTS */}
//         <div className="grid grid-cols-3 gap-3 mt-4">
//           {fields.map((f) => {
//             const uploadedCount = getUploadedCount(form[`${f.name}File`]);
//             const allFiles = getAllFiles(form[`${f.name}File`]);

//             return (
//               <div key={f.name} className="form-control relative group">
//                 <label className="label flex justify-between">
//                   <span className="label-text">{f.label}</span>

//                   {uploadedCount > 0 && (
//                     <button
//                       type="button"
//                       className="badge badge-success badge-sm cursor-pointer hover:badge-primary"
//                       onClick={() => setDocModal({ open: true, field: f.name })}
//                     >
//                       📎 {uploadedCount}
//                     </button>
//                   )}
//                 </label>

//                 <select
//                   name={f.name}
//                   value={form[f.name]}
//                   className="select select-bordered"
//                   onChange={(e) => {
//                     const value = e.target.value;

//                     handleChange(e);

//                     if (isPositiveSelection(value)) {
//                       setDocModal({ open: true, field: f.name });
//                     } else {
//                       // User selected NO / NOT — clear uploaded files
//                       resetFilesForField(f.name);
//                     }
//                   }}
//                 >
//                   <option value="">Select</option>
//                   {f.options.map((o) => (
//                     <option key={o}>{o}</option>
//                   ))}
//                 </select>

//                 {uploadedCount > 0 && (
//                   <p className="text-xs text-success mt-1">
//                     ✔ Documents attached
//                   </p>
//                 )}

//                 {uploadedCount > 0 && (
//                   <div className="hidden group-hover:block absolute z-50 bg-base-200 shadow rounded p-2 text-xs top-full mt-1 w-full">
//                     {allFiles.map((file, i) => (
//                       <div key={i} className="truncate">
//                         • {file.name}
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             );
//           })}
//         </div>

//         {/* DATES */}
//         <div className="grid grid-cols-2 gap-4 mt-4">
//           {[
//             ["orsacAuthDate", "ORSAC Auth Date"],
//             ["submissionDate", "Submission Date"],
//           ].map(([n, l]) => (
//             <div key={n} className="form-control">
//               <label className="label">
//                 <span className="label-text">{l}</span>
//               </label>
//               <input
//                 type="date"
//                 name={n}
//                 className="input input-bordered"
//                 onChange={handleChange}
//               />
//             </div>
//           ))}
//         </div>

//         <div className="modal-action">
//           <button className="btn btn-success btn-sm" onClick={handleSubmit}>
//             Save
//           </button>
//           <button className="btn btn-sm" onClick={() => setShowModal(false)}>
//             Cancel
//           </button>
//         </div>
//       </div>
//       {docModal.open && (
//         <dialog className="modal modal-open">
//           <div className="modal-box max-w-lg">
//             <h3 className="font-bold mb-3">Required Documents</h3>

//             {docRequirements[docModal.field].map((doc) => (
//               <div key={doc} className="mb-4">
//                 <label className="text-sm">{doc}</label>

//                 <input
//                   type="file"
//                   multiple
//                   className="file-input file-input-bordered w-full"
//                   data-field={docModal.field}
//                   data-doc={doc}
//                   onChange={(e) =>
//                     handleFiles(docModal.field, doc, e.target.files)
//                   }
//                 />
//                 {(form[`${docModal.field}File`][doc] || []).map((file, idx) => (
//                   <div
//                     key={idx}
//                     className="flex items-center justify-between border rounded p-2 mt-2 bg-base-100"
//                   >
//                     <div className="flex items-center gap-3">
//                       <div className="w-10 h-10 flex items-center justify-center bg-red-100 rounded">
//                         📄
//                       </div>
//                       <div className="text-xs">
//                         <p className="font-medium truncate max-w-[200px]">
//                           {file.name}
//                         </p>

//                         <a
//                           href={URL.createObjectURL(file)}
//                           target="_blank"
//                           rel="noreferrer"
//                           className="text-primary underline"
//                         >
//                           View
//                         </a>
//                       </div>
//                     </div>
//                     <button
//                       className="btn btn-xs btn-error"
//                       onClick={() => removeFile(docModal.field, doc, idx)}
//                     >
//                       <X size={12} />
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             ))}

//             <div className="modal-action">
//               <button className="btn btn-base btn-sm" onClick={closeDocModal}>
//                 Cancel
//               </button>

//               <button
//                 className="btn btn-primary btn-sm"
//                 onClick={closeDocModal}
//               >
//                 Done
//               </button>
//             </div>
//           </div>
//         </dialog>
//       )}
//     </div>
//   );
// };

// export default LevelZeroForm;

import { X } from "lucide-react";
import React, { useState, useMemo } from "react";
import { STAGE_0_DATA } from "../../../../utils/constants";

const StageZeroForm = () => {
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

    // 🔁 reset file input
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

  const isMultipleAllowed = (remark = "") =>
    remark.includes(",") || remark.includes("/");

  const stage0Status = useMemo(() => {
    return form.proposal_submitted === "Yes" ? "READY" : "ON-GOING";
  }, [form.proposal_submitted]);

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
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold
      ${
        stage0Status === "READY"
          ? "bg-green-100 text-green-700 border border-green-300"
          : "bg-yellow-100 text-yellow-700 border border-yellow-300"
      }
    `}
                  >
                    {stage0Status}
                  </span>
                )}
              </td>
              <td>
                {row.remark && (
                  <div className="text-xs mb-1 text-gray-600">{row.remark}</div>
                )}

                {[
                  "Yes",
                  "Uploaded",
                  "Completed",
                  "Submitted",
                  "Authenticated",
                  "Cleared",
                  "Complied",
                ].includes(form[row.key]) && (
                  <div className="space-y-1">
                    <input
                      key={inputKeys[row.key] || "default"}
                      type="file"
                      multiple={isMultipleAllowed(row.remark)}
                      className="file-input file-input-bordered file-input-sm"
                      onChange={(e) => handleFileChange(e, row.key)}
                    />

                    {files[row.key]?.length > 0 && (
                      <div className="text-xs text-green-700">
                        {files[row.key].length} document(s) uploaded
                      </div>
                    )}

                    {files[row.key]?.map((file, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded"
                      >
                        <span className="truncate">• {file.name}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveFile(row.key, idx)}
                          className="text-red-500 hover:text-red-700 font-bold ml-2"
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
        <button className="btn btn-success btn-sm">Save Stage-0</button>
      </div>
    </form>
  );
};

export default StageZeroForm;
