import React, { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";
import { useSelector } from "react-redux";
import { apiClient } from "../../../../utils/apiClient";
import { showToast } from "../../../../utils/constants";
import { POST_CLEARANCE_DATA } from "../../../../utils/stages";

const LevelThreeForm = ({ onStageComplete }) => {
  const [form, setForm] = useState({});
  const [files, setFiles] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const fileRefs = useRef({});
  const selectedProject = useSelector((state) => state.selectedProject.project);

  // ---------------- FETCH EXISTING ----------------
  useEffect(() => {
    const fetchPostClearance = async () => {
      if (!selectedProject?.id) return;

      try {
        const res = await apiClient(
          `/forestland/getPostClearance/${selectedProject.id}`
        );

        if (res?.success && res.data) {
          const d = res.data;

          setForm({
            ca_plantation_started: d.ca_plantation_started ? "Yes" : "No",
            ca_plantation_completed: d.ca_plantation_completed ? "Yes" : "No",
            survival_report_submitted: d.survival_report_submitted ? "Yes" : "No",
            wildlife_mitigation: d.wildlife_mitigation ? "Yes" : "No",
            safety_zone_maintained: d.safety_zone_maintained ? "Yes" : "No",
            periodic_compliance: d.periodic_compliance_submitted ? "Yes" : "No",
            compliance_period: d.periodic_compliance_type || "",
            inspection_observations: d.inspection_observations || "",
            inspection_remarks: d.inspection_remarks || "",
            post_clearance_status: d.post_clearance_status || "",
          });

          setIsEdit(true);
        }
      } catch (err) {
        console.log("No Post Clearance data found");
        setIsEdit(false);
      }
    };

    fetchPostClearance();
  }, [selectedProject]);

  // ---------------- HANDLERS ----------------
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e, key) => {
    const file = e.target.files[0];
    if (!file) return;

    setFiles((prev) => ({
      ...prev,
      [key]: file,
    }));

    e.target.value = "";
  };

  const handleRemoveFile = (key) => {
    setFiles((prev) => {
      const updated = { ...prev };
      delete updated[key];
      return updated;
    });

    if (fileRefs.current[key]) {
      fileRefs.current[key].value = "";
    }
  };

  const handleViewFile = (file) => {
    const url = URL.createObjectURL(file);
    window.open(url, "_blank");
  };

  const yesNoToInt = (value) => (value === "Yes" ? 1 : 0);

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
      "ca_plantation_started",
      yesNoToInt(form.ca_plantation_started)
    );
    formData.append(
      "ca_plantation_completed",
      yesNoToInt(form.ca_plantation_completed)
    );
    formData.append(
      "survival_report_submitted",
      yesNoToInt(form.survival_report_submitted)
    );
    formData.append(
      "wildlife_mitigation",
      yesNoToInt(form.wildlife_mitigation)
    );
    formData.append(
      "safety_zone_maintained",
      yesNoToInt(form.safety_zone_maintained)
    );
    formData.append(
      "periodic_compliance_submitted",
      yesNoToInt(form.periodic_compliance)
    );
    formData.append(
      "periodic_compliance_type",
      form.compliance_period || ""
    );
    formData.append(
      "inspection_observations",
      form.inspection_observations || ""
    );
    formData.append(
      "inspection_remarks",
      form.inspection_remarks || ""
    );
    formData.append(
      "post_clearance_status",
      form.post_clearance_status || ""
    );

    const fileMap = {
      ca_plantation_started: "ca_plantation_started_document",
      ca_plantation_completed: "ca_plantation_completed_document",
      survival_report_submitted: "survival_report_document",
      wildlife_mitigation: "wildlife_mitigation_document",
      safety_zone_maintained: "safety_zone_document",
    };

    Object.entries(fileMap).forEach(([uiKey, apiKey]) => {
      const file = files[uiKey];
      if (file) {
        formData.append(apiKey, file);
      }
    });

    try {
      setSubmitting(true);

      const url = isEdit
        ? `/forestland/updatePostClearance/${forestProjectId}`
        : `/forestland/postClearance`;

      const method = isEdit ? "PUT" : "POST";

      const res = await apiClient(url, {
        method,
        body: formData,
      });

      if (!res?.success) {
        throw new Error(
          res?.message || "Failed to save post clearance"
        );
      }

      showToast(
        res?.message ||
          (isEdit
            ? "Post clearance updated successfully"
            : "Post clearance saved successfully"),
        "success"
      );

      setIsEdit(true);
      onStageComplete?.();
    } catch (error) {
      showToast(
        error.message || "Failed to save post clearance",
        "error"
      );
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
                      ref={(el) => (fileRefs.current[row.key] = el)}
                      className="file-input file-input-bordered file-input-sm w-full"
                      onChange={(e) => handleFileChange(e, row.key)}
                    />

                    {files[row.key] && (
                      <div className="flex items-center justify-between text-xs bg-gray-100 px-2 py-1 rounded mt-1">
                        <span
                          className="truncate cursor-pointer text-gray-600"
                          onClick={() => handleViewFile(files[row.key])}
                          title="Click to view"
                        >
                          • {files[row.key].name}
                        </span>

                        <button
                          type="button"
                          onClick={() => handleRemoveFile(row.key)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    )}
                  </>
                )}

                {row.key === "periodic_compliance" && form.periodic_compliance === "Yes" && (
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

                {row.key === "inspection_observations" && form.inspection_observations === "Open" && (
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

      <div className="flex justify-end mt-4">
        <button className="btn btn-success btn-sm" disabled={submitting}>
          {submitting
            ? "Saving..."
            : isEdit
            ? "Update Post-Clearance"
            : "Save Post-Clearance"}
        </button>
      </div>
    </form>
  );
};

export default LevelThreeForm;
