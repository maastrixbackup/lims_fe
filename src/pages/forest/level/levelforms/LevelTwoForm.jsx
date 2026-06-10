import { X } from "lucide-react";
import React, { useState, useMemo, useEffect } from "react";
import { useSelector } from "react-redux";
import { apiClient } from "../../../../utils/apiClient";
import { useSuccessMessage } from "../../../../hooks/useSuccessMessage";
import SuccessMessage from "../../../../shared/SuccessMessage";
import { STAGE_II_DATA } from "../../../../utils/stages";
import {
  MAX_FILE_SIZE_HELPER_TEXT,
  buildExistingDocumentsByKey,
  downloadRemoteDocument,
  serializeExistingDocuments,
  viewRemoteDocument,
} from "./documentHelpers";

const FILE_MAP = {
  environmental_clearance: "environmental_document",
  nbwl_clearance: "nbwl_document",
  final_ca_execution: "final_ca_document",
  final_maps_approved: "final_maps_document",
  final_technical_approval: "final_technical_document",
  stage_2_approval_letter: "stage2_approval_document",
};

const LevelTwoForm = ({ onStageComplete, onModeChange, showNext, onNext }) => {
  const [form, setForm] = useState({});
  const [files, setFiles] = useState({});
  const [existingDocs, setExistingDocs] = useState({});
  const [inputKeys, setInputKeys] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const { modal, showSuccess, showError, closeModal } = useSuccessMessage();

  const selectedProject = useSelector((state) => state.selectedProject.project);
  // ---------------- FETCH EXISTING ----------------
  const fetchStage2 = async (forestProjectId = selectedProject?.id) => {
    if (!forestProjectId) {
      setExistingDocs({});
      setIsEdit(false);
      onModeChange?.("add");
      return;
    }

    try {
      const res = await apiClient(`/forestland/getStage2/${forestProjectId}`);

      if (res?.success && res.data) {
        const d = res.data;
        setExistingDocs(
          buildExistingDocumentsByKey(d, FILE_MAP, {
            stage: "stage2",
            forestProjectId,
          }),
        );

        setForm({
          environmental_clearance: d.environmental_clearance || "",
          nbwl_clearance: d.nbwl_clearance || "",
          final_ca_execution: d.final_ca_execution || "",
          final_maps_approved: d.final_maps_approved ? "Yes" : "No",
          final_technical_approval: d.final_technical_approval || "",
          stage_2_approval_letter: d.stage2_approval_letter ? "Yes" : "No",
          stage_2_approval_date: d.stage2_approval_date || "",
          approved_forest_area: d.approved_forest_area_ha || "",
          approved_non_forest_area: d.approved_non_forest_area_ha || "",
        });

        setIsEdit(true);
        onModeChange?.("edit");
      } else {
        setIsEdit(false);
        setExistingDocs({});
        onModeChange?.("add");
      }
    } catch (err) {
      console.log("No Stage-2 data found");
      setIsEdit(false);
      setExistingDocs({});
      onModeChange?.("add");
    }
  };

  useEffect(() => {
    fetchStage2();
  }, [selectedProject]);

  // ---------------- HANDLERS ----------------
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

  const getFiles = (key) =>
    Array.isArray(files[key]) && files[key].length > 0 ? files[key] : [];

  // ---------------- DERIVED ----------------
  const stage_2_status = useMemo(() => {
    return form.stage_2_approval_letter === "Yes" ? "Granted" : "Not Granted";
  }, [form.stage_2_approval_letter]);

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
      "environmental_clearance",
      form.environmental_clearance || "",
    );
    formData.append("nbwl_clearance", form.nbwl_clearance || "");
    formData.append("final_ca_execution", form.final_ca_execution || "");
    formData.append(
      "final_maps_approved",
      yesNoToInt(form.final_maps_approved),
    );
    formData.append(
      "final_technical_approval",
      form.final_technical_approval || "",
    );
    formData.append(
      "stage2_approval_letter",
      yesNoToInt(form.stage_2_approval_letter),
    );
    formData.append("stage2_approval_date", form.stage_2_approval_date || "");
    formData.append("approved_forest_area_ha", form.approved_forest_area || "");
    formData.append(
      "approved_non_forest_area_ha",
      form.approved_non_forest_area || "",
    );

    Object.entries(FILE_MAP).forEach(([uiKey, apiKey]) => {
      const selectedFiles = getFiles(uiKey);
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
        ? `/forestland/updateStage2/${forestProjectId}`
        : `/forestland/addStage2`;

      const method = isEdit ? "PUT" : "POST";

      const res = await apiClient(url, {
        method,
        body: formData,
      });

      if (!res?.success) {
        throw new Error(res?.message || "Failed to save Stage-II");
      }

      showSuccess(
        res?.message ||
          (isEdit
            ? "Stage-II updated successfully"
            : "Stage-II saved successfully"),
      );

      setFiles({});
      setInputKeys({});
      await fetchStage2(forestProjectId);
      setIsEdit(true);
      onModeChange?.("edit");
      onStageComplete?.(submitMode);
    } catch (error) {
      showError(error.message || "Failed to save Stage-II");
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <form onSubmit={handleSubmit} className="p-4 max-w-6xl mx-auto">
      <h2 className="text-lg font-bold mb-4">Stage – II : Final Approval</h2>

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
                  <div className="text-xs mb-1 text-gray-600">{row.remark}</div>
                )}

      

                {row.allowUpload &&
                  ["Yes", "Obtained", "Completed"].includes(form[row.key]) && (
                    <div className="space-y-1">
                      <input
                        key={inputKeys[row.key] || "default"}
                        type="file"
                        multiple
                        className="file-input file-input-bordered file-input-sm"
                        onChange={(e) => handleFileChange(e, row.key)}
                      />
                      <div className="mt-1 text-xs text-red-500">
                        {MAX_FILE_SIZE_HELPER_TEXT}
                      </div>
       {existingDocs[row.key]?.length > 0 && (
  <div className="mb-2 space-y-1">
    {existingDocs[row.key].map((doc, idx) => (
      <div
        key={`${row.key}-existing-${idx}`}
        className="flex items-center justify-between text-xs bg-gray-100 px-2 py-1 rounded"
      >
        <button
          type="button"
          className="text-blue-700 underline truncate"
          onClick={() => openFile(doc.viewUrl || doc.url, doc.name)}
        >
          {doc.name}
        </button>

        <button
          type="button"
          className="text-blue-700 underline"
          onClick={() => openFile(doc.viewUrl || doc.url, doc.name)}
        >
          View
        </button>
        <button
          type="button"
          className="text-blue-700 underline"
          onClick={() =>
            downloadFile(doc.downloadUrl || doc.viewUrl || doc.url, doc.name)
          }
        >
          Download
        </button>
        <button
          type="button"
          onClick={() => handleRemoveExistingDoc(row.key, idx)}
          className="text-red-500 hover:text-red-700"
        >
          <X size={14} />
        </button>
      </div>
    ))}
  </div>
)}
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
                          <span className="truncate">• {file.name}</span>
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
                    </div>
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
              ? "Update Stage-II"
              : "Save Stage-II"}
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

export default LevelTwoForm;
