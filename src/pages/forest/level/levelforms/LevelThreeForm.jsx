import React, { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";
import { useSelector } from "react-redux";
import { apiClient } from "../../../../utils/apiClient";
import { useSuccessMessage } from "../../../../hooks/useSuccessMessage";
import SuccessMessage from "../../../../shared/SuccessMessage";
import { POST_CLEARANCE_DATA } from "../../../../utils/stages";
import {
  buildExistingDocumentsByKey,
  downloadRemoteDocument,
  serializeExistingDocuments,
  viewRemoteDocument,
} from "./documentHelpers";

const FILE_MAP = {
  ca_plantation_started: "ca_plantation_started_document",
  ca_plantation_completed: "ca_plantation_completed_document",
  survival_report_submitted: "survival_report_document",
  wildlife_mitigation: "wildlife_mitigation_document",
  safety_zone_maintained: "safety_zone_document",
};

const LevelThreeForm = ({
  onStageComplete,
  onModeChange,
  showNext,
  onNext,
}) => {
  const [form, setForm] = useState({});
  const [files, setFiles] = useState({});
  const [existingDocs, setExistingDocs] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const { modal, showSuccess, showError, closeModal } = useSuccessMessage();

  const fileRefs = useRef({});
  const selectedProject = useSelector((state) => state.selectedProject.project);
  // ---------------- FETCH EXISTING ----------------
  const fetchPostClearance = async (forestProjectId = selectedProject?.id) => {
    if (!forestProjectId) {
      setExistingDocs({});
      setIsEdit(false);
      onModeChange?.("add");
      return;
    }

    try {
      const res = await apiClient(
        `/forestland/getPostClearance/${forestProjectId}`,
      );

      if (res?.success && res.data) {
        const d = res.data;
        setExistingDocs(
          buildExistingDocumentsByKey(d, FILE_MAP, {
            stage: "postclearance",
            forestProjectId,
          }),
        );

        setForm({
          ca_plantation_started: d.ca_plantation_started ? "Yes" : "No",
          ca_plantation_completed: d.ca_plantation_completed ? "Yes" : "No",
          survival_report_submitted: d.survival_report_submitted
            ? "Yes"
            : "No",
          wildlife_mitigation: d.wildlife_mitigation ? "Yes" : "No",
          safety_zone_maintained: d.safety_zone_maintained ? "Yes" : "No",
          periodic_compliance: d.periodic_compliance_submitted ? "Yes" : "No",
          compliance_period: d.periodic_compliance_type || "",
          inspection_observations: d.inspection_observations || "",
          inspection_remarks: d.inspection_remarks || "",
          post_clearance_status: d.post_clearance_status || "",
        });

        setIsEdit(true);
        onModeChange?.("edit");
      } else {
        setIsEdit(false);
        setExistingDocs({});
        onModeChange?.("add");
      }
    } catch (err) {
      console.log("No Post Clearance data found");
      setIsEdit(false);
      setExistingDocs({});
      onModeChange?.("add");
    }
  };

  useEffect(() => {
    fetchPostClearance();
  }, [selectedProject]);

  // ---------------- HANDLERS ----------------
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e, key) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (!selectedFiles.length) return;

    setFiles((prev) => ({
      ...prev,
      [key]: [...(prev[key] || []), ...selectedFiles],
    }));

    e.target.value = "";
  };

  const handleRemoveFile = (key, index) => {
    setFiles((prev) => {
      const updatedList = (prev[key] || []).filter((_, i) => i !== index);
      return {
        ...prev,
        [key]: updatedList,
      };
    });

    if (fileRefs.current[key]) {
      fileRefs.current[key].value = "";
    }
  };
  const handleRemoveExistingDoc = (rowKey, index) => {
    setExistingDocs((prev) => ({
      ...prev,
      [rowKey]: prev[rowKey].filter((_, i) => i !== index),
    }));
  };

  const openFile = async (fileOrUrl, fileName) => {
    if (typeof fileOrUrl === "string") {
      await viewRemoteDocument(fileOrUrl, fileName);
      return;
    }

    const url = URL.createObjectURL(fileOrUrl);
    window.open(url, "_blank", "noopener,noreferrer");
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const downloadFile = async (fileOrUrl, fileName) => {
    if (typeof fileOrUrl === "string") {
      await downloadRemoteDocument(fileOrUrl, fileName);
      return;
    }

    const url = URL.createObjectURL(fileOrUrl);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName || "document";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const yesNoToInt = (value) => (value === "Yes" ? 1 : 0);

  // ---------------- SUBMIT ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    const forestProjectId = selectedProject?.id;
    if (!forestProjectId) {
      showError("Please select a project first");
      return;
    }

    const formData = new FormData();

    formData.append("forest_project_id", forestProjectId);
    formData.append(
      "ca_plantation_started",
      yesNoToInt(form.ca_plantation_started),
    );
    formData.append(
      "ca_plantation_completed",
      yesNoToInt(form.ca_plantation_completed),
    );
    formData.append(
      "survival_report_submitted",
      yesNoToInt(form.survival_report_submitted),
    );
    formData.append(
      "wildlife_mitigation",
      yesNoToInt(form.wildlife_mitigation),
    );
    formData.append(
      "safety_zone_maintained",
      yesNoToInt(form.safety_zone_maintained),
    );
    formData.append(
      "periodic_compliance_submitted",
      yesNoToInt(form.periodic_compliance),
    );
    formData.append("periodic_compliance_type", form.compliance_period || "");
    formData.append(
      "inspection_observations",
      form.inspection_observations || "",
    );
    formData.append("inspection_remarks", form.inspection_remarks || "");
    formData.append("post_clearance_status", form.post_clearance_status || "");

    Object.entries(FILE_MAP).forEach(([uiKey, apiKey]) => {
      const selectedFiles = Array.isArray(files[uiKey]) ? files[uiKey] : [];
      selectedFiles.forEach((file) => {
        formData.append(apiKey, file);
      });
    });
    Object.entries(existingDocs).forEach(([uiKey, docs]) => {
      const apiKey = FILE_MAP[uiKey];
      formData.append(`${apiKey}_existing`, serializeExistingDocuments(docs));
    });

    try {
      setSubmitting(true);
      const submitMode = isEdit ? "edit" : "add";

      const url = isEdit
        ? `/forestland/updatePostClearance/${forestProjectId}`
        : `/forestland/postClearance`;

      const method = isEdit ? "PUT" : "POST";

      const res = await apiClient(url, {
        method,
        body: formData,
      });

      if (!res?.success) {
        throw new Error(res?.message || "Failed to save post clearance");
      }

      showSuccess(
        res?.message ||
          (isEdit
            ? "Post clearance updated successfully"
            : "Post clearance saved successfully"),
      );

      setFiles({});
      Object.values(fileRefs.current).forEach((input) => {
        if (input) input.value = "";
      });
      await fetchPostClearance(forestProjectId);
      setIsEdit(true);
      onModeChange?.("edit");
      onStageComplete?.(submitMode);
    } catch (error) {
      showError(error.message || "Failed to save post clearance");
    } finally {
      setSubmitting(false);
    }
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
                      multiple
                      ref={(el) => (fileRefs.current[row.key] = el)}
                      className="file-input file-input-bordered file-input-sm w-full"
                      onChange={(e) => handleFileChange(e, row.key)}
                    />

                    {existingDocs[row.key]?.length > 0 && (
                      <div className="mb-2 space-y-1">
                        {existingDocs[row.key].map((doc, idx) => (
                          <div
                            key={`${row.key}-existing-${idx}`}
                            className="flex items-center justify-between text-xs bg-gray-100 px-2 py-1 rounded"
                          >
                            <span className="truncate mr-2">{doc.name}</span>
                            <div className="flex items-center gap-2 shrink-0">
                              <button
                                type="button"
                                className="text-blue-700 underline"
                                onClick={() =>
                                  openFile(doc.viewUrl || doc.url, doc.name)
                                }
                              >
                                View
                              </button>
                              <button
                                type="button"
                                className="text-blue-700 underline"
                                onClick={() =>
                                  downloadFile(
                                    doc.downloadUrl || doc.viewUrl || doc.url,
                                    doc.name,
                                  )
                                }
                              >
                                Download
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  handleRemoveExistingDoc(row.key, idx)
                                }
                                className="text-red-500 hover:text-red-700"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    {files[row.key]?.map((file, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between text-xs bg-gray-100 px-2 py-1 rounded mt-1"
                      >
                        <span
                          className="truncate cursor-pointer text-gray-600"
                        >
                          • {file.name}
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            className="text-blue-700 underline"
                            onClick={() => openFile(file, file.name)}
                          >
                            View
                          </button>
                          <button
                            type="button"
                            className="text-blue-700 underline"
                            onClick={() => downloadFile(file, file.name)}
                          >
                            Download
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveFile(row.key, idx)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </>
                )}

                {row.key === "periodic_compliance" &&
                  form.periodic_compliance === "Yes" && (
                    <select
                      name="compliance_period"
                      className="select select-bordered select-sm mt-1 w-full"
                      value={form.compliance_period || ""}
                      onChange={handleChange}
                    >
                      <option value="">Select Period</option>
                      <option value="Half-Yearly">Half-Yearly</option>
                      <option value="Annual">Annual</option>
                    </select>
                  )}

                {row.key === "inspection_observations" &&
                  form.inspection_observations === "Open" && (
                    <textarea
                      name="inspection_remarks"
                      className="textarea textarea-bordered textarea-sm mt-1 w-full"
                      placeholder="Enter inspection observations"
                      value={form.inspection_remarks || ""}
                      onChange={handleChange}
                    />
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
              ? "Update Post-Clearance"
              : "Save Post-Clearance"}
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
      <SuccessMessage
        open={modal.open}
        type={modal.type}
        message={modal.message}
        onClose={closeModal}
      />
    </form>
  );
};

export default LevelThreeForm;
