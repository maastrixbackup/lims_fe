import { X } from "lucide-react";
import React, { useState, useMemo, useEffect } from "react";
import { STAGE_0_DATA, showToast } from "../../../../utils/constants";
import { useSelector } from "react-redux";
import { apiClient } from "../../../../utils/apiClient";
import { buildExistingDocumentsByKey } from "./documentHelpers";

const FILE_MAP = {
  dgps_survey_done: "dgps_document",
  orsac: "orsac_document",
  tree_enumeration: "tree_enumeration_document",
  administrative_docs: "administrative_document",
  legal_lease: "legal_lease_document",
  technical_data: "technical_document",
  forest_land_details: "forest_land_details_document",
  ca_planning: "ca_ca_document",
  fra_compliance: "fra_document",
  env_statutory: "environmental_document",
  wildlife_safeguards: "wildlife_document",
  maps_spatial: "maps_document",
  financial: "financial_document",
  proposal_submitted: "proposal_document",
};

const normalizeDateValue = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value.split("T")[0];

  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) return "";

  return parsedDate.toISOString().split("T")[0];
};

const StageZeroForm = ({ onStageComplete, onModeChange, showNext, onNext }) => {
  const [form, setForm] = useState({});
  const [files, setFiles] = useState({});
  const [existingDocs, setExistingDocs] = useState({});
  const [inputKeys, setInputKeys] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const selectedProject = useSelector((state) => state.selectedProject.project);

  const normalizeStatusValue = (value, options = []) => {
    if (value === null || value === undefined) return "";

    const exactMatch = options.find((opt) => opt === value);
    if (exactMatch) return exactMatch;

    const normalized = String(value).trim().toLowerCase();

    const optionMatch = options.find(
      (opt) => String(opt).trim().toLowerCase() === normalized,
    );

    if (optionMatch) return optionMatch;

    if (["1", "true", "yes", "y"].includes(normalized)) {
      return options[0] || "";
    }

    if (["0", "false", "no", "n"].includes(normalized)) {
      return options[1] || "";
    }

    return String(value);
  };

  useEffect(() => {
    const fetchStage0 = async () => {
      if (!selectedProject?.id) {
        setExistingDocs({});
        setIsEdit(false);
        onModeChange?.("add");
        return;
      }

      try {
        const res = await apiClient(
          `/forestland/getStage0/${selectedProject.id}`,
        );

        if (res?.success && res.data) {
          const data = res.data;

          setExistingDocs(buildExistingDocumentsByKey(data, FILE_MAP));

          setForm({
            dgps_area_ha: data.dgps_area_ha || "",
            dgps_survey_done: data.dgps_survey_done ? "Yes" : "No",
            orsac: data.orsac_authentication ? "Yes" : "No",
            tree_enumeration: data.tree_enumeration_done ? "Yes" : "No",
            administrative_docs: data.administrative_documents ? "Yes" : "No",
            legal_lease: data.legal_lease_documents ? "Yes" : "No",
            technical_data: data.technical_data ? "Yes" : "No",
            forest_land_details: normalizeStatusValue(
              data.forest_land_details,
              ["Uploaded", "Not Uploaded"],
            ),
            ca_planning: data.ca_ca_planning ? "Yes" : "No",
            fra_compliance: normalizeStatusValue(data.fra_records, [
              "Completed",
              "Not Completed",
            ]),
            env_statutory: normalizeStatusValue(data.environmental_statutory, [
              "Cleared",
              "Not Cleared",
            ]),
            wildlife_safeguards: normalizeStatusValue(
              data.wildlife_safeguards,
              ["Completed", "Not Completed"],
            ),
            maps_spatial: normalizeStatusValue(data.maps_spatial_evidence, [
              "Authenticated",
              "Not Authenticated",
            ]),
            financial: normalizeStatusValue(data.financial_undertakings, [
              "Submitted",
              "Not Submitted",
            ]),
            proposal_submitted: data.proposal_submitted ? "Yes" : "No",
            parivesh_proposal: data.parivesh_proposal_no || "",
            submission_date: normalizeDateValue(data.submission_date),
          });

          setIsEdit(true);
          onModeChange?.("edit");
        } else {
          setIsEdit(false);
          setExistingDocs({});
          onModeChange?.("add");
        }
      } catch (error) {
        setIsEdit(false);
        setExistingDocs({});
        onModeChange?.("add");
      }
    };

    fetchStage0();
  }, [selectedProject]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e, rowKey) => {
    const selectedFiles = Array.from(e.target.files || []);

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

  const isMultipleAllowed = (remark = "") =>
    remark.includes(",") || remark.includes("/");

  const yesNoToInt = (value) => (value === "Yes" ? 1 : 0);

  const getFiles = (key) =>
    Array.isArray(files[key]) && files[key].length > 0 ? files[key] : [];

  const stage0Status = useMemo(() => {
    return form.proposal_submitted === "Yes" ? "READY" : "ON-GOING";
  }, [form.proposal_submitted]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const forestProjectId = selectedProject?.id;

    if (!forestProjectId) {
      showToast("Please select a project first", "error");
      return;
    }

    const formData = new FormData();

    formData.append("forest_project_id", forestProjectId);

    formData.append("dgps_area_ha", form.dgps_area_ha || "");

    formData.append("dgps_survey_done", yesNoToInt(form.dgps_survey_done));

    formData.append("orsac_authentication", yesNoToInt(form.orsac));

    formData.append("tree_enumeration_done", yesNoToInt(form.tree_enumeration));

    formData.append(
      "administrative_documents",
      yesNoToInt(form.administrative_docs),
    );

    formData.append("legal_lease_documents", yesNoToInt(form.legal_lease));

    formData.append("technical_data", yesNoToInt(form.technical_data));

    formData.append("forest_land_details", form.forest_land_details || "");

    formData.append("ca_ca_planning", yesNoToInt(form.ca_planning));

    formData.append("fra_records", form.fra_compliance || "");

    formData.append("environmental_statutory", form.env_statutory || "");

    formData.append("wildlife_safeguards", form.wildlife_safeguards || "");

    formData.append("maps_spatial_evidence", form.maps_spatial || "");

    formData.append("financial_undertakings", form.financial || "");

    formData.append("proposal_submitted", yesNoToInt(form.proposal_submitted));

    formData.append("parivesh_proposal_no", form.parivesh_proposal || "");

    formData.append(
      "submission_date",
      normalizeDateValue(form.submission_date),
    );

    Object.entries(FILE_MAP).forEach(([uiKey, apiKey]) => {
      const selectedFiles = getFiles(uiKey);

      selectedFiles.forEach((file) => {
        formData.append(apiKey, file);
      });
    });

    Object.entries(existingDocs).forEach(([uiKey, docs]) => {
      const apiKey = FILE_MAP[uiKey];

      if (docs && docs.length > 0) {
        formData.append(`${apiKey}_existing`, JSON.stringify(docs));
      }
    });

    try {
      setSubmitting(true);

      const submitMode = isEdit ? "edit" : "add";

      const url = isEdit
        ? `/forestland/updateStage0/${forestProjectId}`
        : `/forestland/addStage0`;

      const method = isEdit ? "PUT" : "POST";

      const res = await apiClient(url, {
        method,
        body: formData,
      });

      if (!res?.success) {
        throw new Error(res?.message || "Failed to save Stage-0");
      }

      showToast(
        res?.message ||
          (isEdit
            ? "Stage-0 updated successfully"
            : "Stage-0 saved successfully"),
        "success",
      );

      setIsEdit(true);
      onModeChange?.("edit");
      onStageComplete?.(submitMode);
    } catch (error) {
      showToast(error.message || "Failed to save Stage-0", "error");
    } finally {
      setSubmitting(false);
    }
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

                {row.type === "text" && (
                  <input
                    type="text"
                    name={row.key}
                    className="input input-bordered input-sm w-full"
                    value={form[row.key] || ""}
                    onChange={handleChange}
                  />
                )}

                {row.type === "date" && (
                  <input
                    type="date"
                    name={row.key}
                    className="input input-bordered input-sm w-full"
                    value={form[row.key] || ""}
                    onChange={handleChange}
                  />
                )}

                {row.type === "status" && (
                  <select
                    name={row.key}
                    className="select select-bordered select-sm w-full"
                    value={form[row.key] || ""}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    {(row.options || []).map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                )}

                {row.type === "auto" && (
                  <span
                    className={`px-2 py-1 text-xs rounded ${
                      stage0Status === "READY"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {stage0Status}
                  </span>
                )}
              </td>

              <td>
                <div className="text-xs mb-1 text-gray-600">{row.remark}</div>

                {[
                  "Yes",
                  "Uploaded",
                  "Completed",
                  "Submitted",
                  "Authenticated",
                  "Cleared",
                  "Complied",
                ].includes(form[row.key]) && (
                  <>
                    <input
                      key={inputKeys[row.key] || "default"}
                      type="file"
                      multiple={isMultipleAllowed(row.remark)}
                      className="file-input file-input-bordered file-input-sm w-full"
                      onChange={(e) => handleFileChange(e, row.key)}
                    />

                    {existingDocs[row.key]?.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {existingDocs[row.key].map((doc, idx) => (
                          <div
                            key={`${row.key}-${idx}`}
                            className="flex items-center justify-between text-xs bg-gray-100 px-2 py-1 rounded"
                          >
                            <button
                              type="button"
                              className="text-blue-700 underline truncate"
                              onClick={() => window.open(doc.url, "_blank")}
                            >
                              {doc.name}
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleRemoveExistingDoc(row.key, idx)
                              }
                            >
                              <X size={14} className="text-red-500" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {files[row.key]?.length > 0 && (
                      <div className="text-xs text-green-700 mt-2">
                        {files[row.key].length} document(s) uploaded
                      </div>
                    )}

                    <div className="space-y-1 mt-1">
                      {files[row.key]?.map((file, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between text-xs bg-gray-100 px-2 py-1 rounded"
                        >
                          <span className="truncate">{file.name}</span>

                          <button
                            type="button"
                            onClick={() => handleRemoveFile(row.key, idx)}
                          >
                            <X size={14} className="text-red-500" />
                          </button>
                        </div>
                      ))}
                    </div>
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
              ? "Update Stage-0"
              : "Save Stage-0"}
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

export default StageZeroForm;
