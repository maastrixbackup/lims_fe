// import React, { useState, useMemo } from "react";
// import { X } from "lucide-react";
// import { useSelector } from "react-redux";
// import { apiClient } from "../../../../utils/apiClient";
// import { showToast } from "../../../../utils/constants";

// const STAGE_I_IMAGE_DATA = [
//   {
//     "sl": 1,
//     "key": "stage_1_approval_letter",
//     "label": "Stage-I Approval Letter",
//     "type": "upload",
//     "options": ["Uploaded", "Not Uploaded"],
//     "remark": "Stage-I FC letter",
//     "allowUpload": true
//   },
//   {
//     "sl": 2,
//     "key": "stage_1_conditions",
//     "label": "Stage-I Conditions",
//     "type": "yesno",
//     "remark": "Condition sheet",
//     "allowUpload": true
//   },
//   {
//     "sl": 3,
//     "key": "ca_land_handed_over",
//     "label": "CA Land Handed Over",
//     "type": "yesno",
//     "remark": "Handover docs",
//     "allowUpload": true
//   },
//   {
//     "sl": 4,
//     "key": "fra_compliance",
//     "label": "FRA Compliance",
//     "type": "status",
//     "options": ["Complied", "Pending"],
//     "remark": "Final FRA certificate",
//     "allowUpload": true
//   },
//   {
//     "sl": 5,
//     "key": "npv_payment",
//     "label": "NPV Payment",
//     "type": "paid",
//     "remark": "NPV Payment Receipt",
//     "allowUpload": true
//   },
//   {
//     "sl": 6,
//     "key": "ca_payment",
//     "label": "CA Payment",
//     "type": "paid",
//     "remark": "CA Payment Receipt",
//     "allowUpload": true
//   },
//   {
//     "sl": 7,
//     "key": "aca_payment",
//     "label": "ACA / Additional Payments",
//     "type": "paid",
//     "remark": "ACA Receipt",
//     "allowUpload": true
//   },
//   {
//     "sl": 8,
//     "key": "wildlife_payment",
//     "label": "Wildlife Payments",
//     "type": "paid",
//     "remark": "If wildlife applicable",
//     "allowUpload": true
//   },
//   {
//     "sl": 9,
//     "key": "technical_compliance",
//     "label": "Technical Compliance",
//     "type": "status",
//     "options": ["Completed", "Pending"],
//     "remark": "Mining / Linear approval",
//     "allowUpload": true
//   },
//   {
//     "sl": 10,
//     "key": "stage_1_compliance",
//     "label": "Stage-I Compliance Accepted",
//     "type": "yesno",
//     "remark": "Authority confirmation",
//     "allowUpload": true
//   },
//   {
//     "sl": 11,
//     "key": "eligible_stage_2",
//     "label": "Eligible for Stage-II",
//     "type": "chip"
//   },
//   {
//     "sl": 12,
//     "key": "stage_1_status",
//     "label": "Stage-I Status",
//     "type": "chip"
//   }
// ]

// const LevelOneForm = ({ onStageComplete }) => {
//   const [form, setForm] = useState({});
//   const [files, setFiles] = useState({});
//   const [submitting, setSubmitting] = useState(false);
//   const selectedProject = useSelector((state) => state.selectedProject.project);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleFileChange = (key, selectedFiles) => {
//     setFiles((prev) => ({
//       ...prev,
//       [key]: [...(prev[key] || []), ...Array.from(selectedFiles)],
//     }));
//   };

//   const removeFile = (key, index) => {
//     setFiles((prev) => ({
//       ...prev,
//       [key]: prev[key].filter((_, i) => i !== index),
//     }));
//   };

//   const eligible_stage_2 = useMemo(() => {
//     return form.stage_1_compliance === "Yes" &&
//       form.fra_compliance === "Complied" &&
//       form.technical_compliance === "Completed"
//       ? "Yes"
//       : "No";
//   }, [form]);

//   const stage_1_status = useMemo(() => {
//     return form.stage_1_compliance === "Yes" ? "Completed" : "Pending";
//   }, [form.stage_1_compliance]);

//   const yesNoToInt = (value) => (value === "Yes" ? 1 : 0);

//   const getFirstFile = (key) =>
//     Array.isArray(files[key]) && files[key].length > 0 ? files[key][0] : null;

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const forestProjectId = selectedProject?.id;
//     if (!forestProjectId) {
//       showToast("Please select a project first", "error");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("forest_project_id", forestProjectId);
//     formData.append("stage1_approval_letter", form.stage_1_approval_letter || "");
//     formData.append(
//       "stage1_conditions_extracted",
//       yesNoToInt(form.stage_1_conditions),
//     );
//     formData.append("ca_land_handed_over", yesNoToInt(form.ca_land_handed_over));
//     formData.append("fra_compliance", form.fra_compliance || "");
//     formData.append("npv_payment", form.npv_payment || "");
//     formData.append("ca_payment", form.ca_payment || "");
//     formData.append("aca_payment", form.aca_payment || "");
//     formData.append("wildlife_payment", form.wildlife_payment || "");
//     formData.append("technical_compliance", form.technical_compliance || "");
//     formData.append(
//       "stage1_compliance_accepted",
//       yesNoToInt(form.stage_1_compliance),
//     );

//     const fileMap = {
//       stage_1_approval_letter: "stage1_approval_document",
//       stage_1_conditions: "stage1_conditions_document",
//       ca_land_handed_over: "ca_land_document",
//       fra_compliance: "fra_document",
//       npv_payment: "npv_document",
//       ca_payment: "ca_payment_document",
//       aca_payment: "aca_payment_document",
//       wildlife_payment: "wildlife_payment_document",
//       technical_compliance: "technical_document",
//       stage_1_compliance: "stage1_acceptance_document",
//     };

//     Object.entries(fileMap).forEach(([uiKey, apiKey]) => {
//       const file = getFirstFile(uiKey);
//       if (file) {
//         formData.append(apiKey, file);
//       }
//     });

//     try {
//       setSubmitting(true);
//       const res = await apiClient("/forestland/addStage1", {
//         method: "POST",
//         body: formData,
//       });

//       if (!res?.success) {
//         throw new Error(res?.message || "Failed to save Stage-I");
//       }

//       showToast(res?.message || "Stage-I saved successfully", "success");
//       onStageComplete?.();
//     } catch (error) {
//       showToast(error.message || "Failed to save Stage-I", "error");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="p-4 max-w-6xl mx-auto">
//       <h2 className="font-bold text-lg mb-4">Stage – I : In-Principle Approval</h2>

//       <table className="table table-bordered w-full text-sm">
//         <thead>
//           <tr className="bg-gray-200">
//             <th>Sl</th>
//             <th>Parameter</th>
//             <th>Status</th>
//             <th>Documents / Remarks</th>
//           </tr>
//         </thead>

//         <tbody>
//           {STAGE_I_IMAGE_DATA.map((row) => (
//             <tr key={row.key}>
//               <td>{row.sl}</td>
//               <td>{row.label}</td>

//               {/* STATUS */}
//               <td>
//                 {row.type === "yesno" && ["Yes", "No"].map((v) => (
//                   <label key={v} className="mr-3">
//                     <input type="radio" name={row.key} value={v}
//                       checked={form[row.key] === v} onChange={handleChange} /> {v}
//                   </label>
//                 ))}

//                 {["paid", "status", "upload"].includes(row.type) && (
//                   <select
//                     name={row.key}
//                     value={form[row.key] || ""}
//                     onChange={handleChange}
//                     className="select select-bordered select-sm"
//                   >
//                     <option value="">Select</option>
//                     {(row.options || ["Paid", "Not Paid"]).map((o) => (
//                       <option key={o}>{o}</option>
//                     ))}
//                   </select>
//                 )}

//                 {row.type === "chip" && row.key === "eligible_stage_2" && (
//                   <span className={`px-3 py-1 rounded-full text-xs font-semibold
//                     ${eligible_stage_2=== "Yes" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
//                     {eligible_stage_2}
//                   </span>
//                 )}

//                 {row.type === "chip" && row.key === "stage_1_status" && (
//                   <span className={`px-3 py-1 rounded-full text-xs font-semibold
//                     ${stage_1_status === "Completed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
//                     {stage_1_status}
//                   </span>
//                 )}
//               </td>

//               <td>
//                 <div className="text-xs mb-1">{row.remark}</div>

//                 {row.allowUpload &&
//                   ["Yes", "Paid", "Uploaded", "Complied", "Completed"].includes(form[row.key]) && (
//                     <>
//                       <input
//                         type="file"
//                         multiple
//                         className="file-input file-input-bordered file-input-sm"
//                         onChange={(e) => handleFileChange(row.key, e.target.files)}
//                       />

//                       {files[row.key]?.length > 0 && (
//                         <div className="text-xs text-green-700 mt-1">
//                           {files[row.key].length} document(s) uploaded
//                         </div>
//                       )}
//                       <ul className="mt-1 space-y-1">
//                         {files[row.key]?.map((f, i) => (
//                           <li key={i} className="flex items-center gap-2 text-xs bg-gray-100 px-2 py-1 rounded">
//                             <span className="truncate">{f.name}</span>
//                             <button type="button" onClick={() => removeFile(row.key, i)}>
//                               <X size={14} className="text-red-500" />
//                             </button>
//                           </li>
//                         ))}
//                       </ul>
//                     </>
//                   )}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       <div className="flex justify-end mt-4">
//         <button className="btn btn-success btn-sm" disabled={submitting}>
//           {submitting ? "Saving..." : "Save Stage-I"}
//         </button>
//       </div>
//     </form>
//   );
// };

// export default LevelOneForm;

import React, { useState, useMemo, useEffect } from "react";
import { X } from "lucide-react";
import { useSelector } from "react-redux";
import { apiClient } from "../../../../utils/apiClient";
import { showToast } from "../../../../utils/constants";
import { buildExistingDocumentsByKey } from "./documentHelpers";

const STAGE_I_IMAGE_DATA = [
  {
    sl: 1,
    key: "stage_1_approval_letter",
    label: "Stage-I Approval Letter",
    type: "upload",
    options: ["Uploaded", "Not Uploaded"],
    remark: "Stage-I FC letter",
    allowUpload: true,
  },
  {
    sl: 2,
    key: "stage_1_conditions",
    label: "Stage-I Conditions",
    type: "yesno",
    remark: "Condition sheet",
    allowUpload: true,
  },
  {
    sl: 3,
    key: "ca_land_handed_over",
    label: "CA Land Handed Over",
    type: "yesno",
    remark: "Handover docs",
    allowUpload: true,
  },
  {
    sl: 4,
    key: "fra_compliance",
    label: "FRA Compliance",
    type: "status",
    options: ["Complied", "Pending"],
    remark: "Final FRA certificate",
    allowUpload: true,
  },
  {
    sl: 5,
    key: "npv_payment",
    label: "NPV Payment",
    type: "paid",
    remark: "NPV Payment Receipt",
    allowUpload: true,
  },
  {
    sl: 6,
    key: "ca_payment",
    label: "CA Payment",
    type: "paid",
    remark: "CA Payment Receipt",
    allowUpload: true,
  },
  {
    sl: 7,
    key: "aca_payment",
    label: "ACA / Additional Payments",
    type: "paid",
    remark: "ACA Receipt",
    allowUpload: true,
  },
  {
    sl: 8,
    key: "wildlife_payment",
    label: "Wildlife Payments",
    type: "paid",
    remark: "If wildlife applicable",
    allowUpload: true,
  },
  {
    sl: 9,
    key: "technical_compliance",
    label: "Technical Compliance",
    type: "status",
    options: ["Completed", "Pending"],
    remark: "Mining / Linear approval",
    allowUpload: true,
  },
  {
    sl: 10,
    key: "stage_1_compliance",
    label: "Stage-I Compliance Accepted",
    type: "yesno",
    remark: "Authority confirmation",
    allowUpload: true,
  },
  {
    sl: 11,
    key: "eligible_stage_2",
    label: "Eligible for Stage-II",
    type: "chip",
  },
  {
    sl: 12,
    key: "stage_1_status",
    label: "Stage-I Status",
    type: "chip",
  },
];

const FILE_MAP = {
  stage_1_approval_letter: "stage1_approval_document",
  stage_1_conditions: "stage1_conditions_document",
  ca_land_handed_over: "ca_land_document",
  fra_compliance: "fra_document",
  npv_payment: "npv_document",
  ca_payment: "ca_payment_document",
  aca_payment: "aca_payment_document",
  wildlife_payment: "wildlife_payment_document",
  technical_compliance: "technical_document",
  stage_1_compliance: "stage1_acceptance_document",
};

const LevelOneForm = ({ onStageComplete, onModeChange, showNext, onNext }) => {
  const [form, setForm] = useState({});
  const [files, setFiles] = useState({});
  const [existingDocs, setExistingDocs] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const selectedProject = useSelector((state) => state.selectedProject.project);
  // ---------------- FETCH EXISTING ----------------
  useEffect(() => {
    const fetchStage1 = async () => {
      if (!selectedProject?.id) {
        setExistingDocs({});
        setIsEdit(false);
        onModeChange?.("add");
        return;
      }

      try {
        const res = await apiClient(
          `/forestland/getStage1/${selectedProject.id}`,
        );

        if (res?.success && res.data) {
          const d = res.data;
          setExistingDocs(buildExistingDocumentsByKey(d, FILE_MAP));

          setForm({
            stage_1_approval_letter: d.stage1_approval_letter || "",
            stage_1_conditions: d.stage1_conditions_extracted ? "Yes" : "No",
            ca_land_handed_over: d.ca_land_handed_over ? "Yes" : "No",
            fra_compliance: d.fra_compliance || "",
            npv_payment: d.npv_payment || "",
            ca_payment: d.ca_payment || "",
            aca_payment: d.aca_payment || "",
            wildlife_payment: d.wildlife_payment || "",
            technical_compliance: d.technical_compliance || "",
            stage_1_compliance: d.stage1_compliance_accepted ? "Yes" : "No",
          });

          setIsEdit(true);
          onModeChange?.("edit");
        } else {
          setIsEdit(false);
          setExistingDocs({});
          onModeChange?.("add");
        }
      } catch (err) {
        console.log("No Stage-1 data found");
        setIsEdit(false);
        setExistingDocs({});
        onModeChange?.("add");
      }
    };

    fetchStage1();
  }, [selectedProject]);

  // ---------------- HANDLERS ----------------
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (key, selectedFiles) => {
    setFiles((prev) => ({
      ...prev,
      [key]: [...(prev[key] || []), ...Array.from(selectedFiles)],
    }));
  };

  const removeFile = (key, index) => {
    setFiles((prev) => ({
      ...prev,
      [key]: prev[key].filter((_, i) => i !== index),
    }));
  };

  const yesNoToInt = (value) => (value === "Yes" ? 1 : 0);

  const getFiles = (key) =>
    Array.isArray(files[key]) && files[key].length > 0 ? files[key] : [];

  // ---------------- DERIVED ----------------
  const eligible_stage_2 = useMemo(() => {
    return form.stage_1_compliance === "Yes" &&
      form.fra_compliance === "Complied" &&
      form.technical_compliance === "Completed"
      ? "Yes"
      : "No";
  }, [form]);

  const stage_1_status = useMemo(() => {
    return form.stage_1_compliance === "Yes" ? "Completed" : "Pending";
  }, [form.stage_1_compliance]);

  // ---------------- SUBMIT ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    const forestProjectId = selectedProject?.id;
    if (!forestProjectId) {
      showToast("Please select a project first", "error");
      return;
    }

    const formData = new FormData();

    formData.append("forest_project_id", forestProjectId);
    formData.append(
      "stage1_approval_letter",
      form.stage_1_approval_letter || "",
    );
    formData.append(
      "stage1_conditions_extracted",
      yesNoToInt(form.stage_1_conditions),
    );
    formData.append(
      "ca_land_handed_over",
      yesNoToInt(form.ca_land_handed_over),
    );
    formData.append("fra_compliance", form.fra_compliance || "");
    formData.append("npv_payment", form.npv_payment || "");
    formData.append("ca_payment", form.ca_payment || "");
    formData.append("aca_payment", form.aca_payment || "");
    formData.append("wildlife_payment", form.wildlife_payment || "");
    formData.append("technical_compliance", form.technical_compliance || "");
    formData.append(
      "stage1_compliance_accepted",
      yesNoToInt(form.stage_1_compliance),
    );

    Object.entries(FILE_MAP).forEach(([uiKey, apiKey]) => {
      const selectedFiles = getFiles(uiKey);
      selectedFiles.forEach((file) => {
        formData.append(apiKey, file);
      });
    });

    try {
      setSubmitting(true);
      const submitMode = isEdit ? "edit" : "add";

      const url = isEdit
        ? `/forestland/updateStage1/${forestProjectId}`
        : `/forestland/addStage1`;

      const method = isEdit ? "PUT" : "POST";

      const res = await apiClient(url, {
        method,
        body: formData,
      });

      if (!res?.success) {
        throw new Error(res?.message || "Failed to save Stage-I");
      }

      showToast(
        res?.message ||
          (isEdit
            ? "Stage-I updated successfully"
            : "Stage-I saved successfully"),
        "success",
      );

      setIsEdit(true);
      onModeChange?.("edit");
      onStageComplete?.(submitMode);
    } catch (error) {
      showToast(error.message || "Failed to save Stage-I", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 max-w-6xl mx-auto">
      <h2 className="font-bold text-lg mb-4">
        Stage – I : In-Principle Approval
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
          {STAGE_I_IMAGE_DATA.map((row) => (
            <tr key={row.key}>
              <td>{row.sl}</td>
              <td>{row.label}</td>

              {/* STATUS */}
              <td>
                {row.type === "yesno" &&
                  ["Yes", "No"].map((v) => (
                    <label key={v} className="mr-3">
                      <input
                        type="radio"
                        name={row.key}
                        value={v}
                        checked={form[row.key] === v}
                        onChange={handleChange}
                      />{" "}
                      {v}
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

                {row.type === "chip" && row.key === "eligible_stage_2" && (
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold
                    ${eligible_stage_2 === "Yes" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                  >
                    {eligible_stage_2}
                  </span>
                )}

                {row.type === "chip" && row.key === "stage_1_status" && (
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold
                    ${stage_1_status === "Completed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}
                  >
                    {stage_1_status}
                  </span>
                )}
              </td>

              <td>
                <div className="text-xs mb-1">{row.remark}</div>

                {existingDocs[row.key]?.length > 0 && (
                  <div className="mb-2">
                    {existingDocs[row.key].map((doc, idx) => (
                      <button
                        key={`${row.key}-existing-${idx}`}
                        type="button"
                        className="text-xs text-blue-700 underline block text-left"
                        onClick={() => window.open(doc.url, "_blank")}
                      >
                        {doc.name}
                      </button>
                    ))}
                  </div>
                )}

                {row.allowUpload &&
                  ["Yes", "Paid", "Uploaded", "Complied", "Completed"].includes(
                    form[row.key],
                  ) && (
                    <>
                      <input
                        type="file"
                        multiple
                        className="file-input file-input-bordered file-input-sm"
                        onChange={(e) =>
                          handleFileChange(row.key, e.target.files)
                        }
                      />

                      {files[row.key]?.length > 0 && (
                        <div className="text-xs text-green-700 mt-1">
                          {files[row.key].length} document(s) uploaded
                        </div>
                      )}
                      <ul className="mt-1 space-y-1">
                        {files[row.key]?.map((f, i) => (
                          <li
                            key={i}
                            className="flex items-center gap-2 text-xs bg-gray-100 px-2 py-1 rounded"
                          >
                            <span className="truncate">{f.name}</span>
                            <button
                              type="button"
                              onClick={() => removeFile(row.key, i)}
                            >
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

      <div className="flex justify-end gap-2 mt-4">
        <button className="btn btn-success btn-sm" disabled={submitting}>
          {submitting
            ? "Saving..."
            : isEdit
              ? "Update Stage-I"
              : "Save Stage-I"}
        </button>
        {showNext && (
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={onNext}
          >
            Next
          </button>
        )}
      </div>
    </form>
  );
};

export default LevelOneForm;
