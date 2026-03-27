import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { addForestProject } from "../addForestProject";
import { updateForestProject } from "../../../hooks/updateForestProject";
import { apiClient } from "../../../utils/apiClient";
import SuccessMessage from "../../../shared/SuccessMessage";
import { useSuccessMessage } from "../../../hooks/useSuccessMessage";
import {
  NON_LINEAR_PROJECTS,
  PROJECT_CATEGORY_NATURE_MAP,
} from "../../../utils/constants";

const PROJECT_MASTER_DRAFTS_KEY = "forest_project_master_drafts_v1";

const readProjectMasterDrafts = () => {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(PROJECT_MASTER_DRAFTS_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
};

const writeProjectMasterDrafts = (drafts) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(PROJECT_MASTER_DRAFTS_KEY, JSON.stringify(drafts));
  } catch {
    // Ignore localStorage write errors (quota/private mode)
  }
};

const ProjectMaster = () => {
  const token = useSelector((state) => state.auth.userToken);
  const selectedProject = useSelector((s) => s.selectedProject.project);
  const projects = useSelector((s) => s.list.projects || []);
  const location = useLocation();
  const [editData, setEditData] = useState();

  const { modal, showSuccess, showError, closeModal } = useSuccessMessage();

  const initialFormData = {
    project_id: "",
    project_name: "",
    proposal_no: "",
    user_agency: "",
    state: "",
    district: "",
    tahasil: "",
    mouza: "",
    range_division: "",
    forest_type: "",
    total_project_area_ha: "",
    forest_area_ha: "",
    non_forest_area_ha: "",
    project_status: "",
    current_stage: "",
    current_stage_status: "",
    eds_flag: 0,
    eds_list: [
      {
        eds_ref_no: "",
        issuing_authority: "",
        eds_issue_date: "",
        eds_due_date: "",
        total_issues: "",
        issues_closed: "",
        issues_pending: "",
        eds_status: "",
        eds_reply_document:""
      },
    ],
    project_category: "",
    project_nature: "",
    project_sub_category: "",
  };
useEffect(() => {
  let cancelled = false;

  const fetchData = async () => {
    if (!selectedProject?.id) return;

    try {
      const res = await apiClient(
        `/forestland/forestProjectList?project_id=${selectedProject.id}&page=1&limit=1`
      );

      if (cancelled) return;

      const latest = res?.data?.[0];
      const normalized = normalizeEditPayload(latest);

      if (normalized) {
        setFormData({
          ...initialFormData,
          ...normalized,
          project_id: selectedProject.id,
          project_name:
            selectedProject.project_name || selectedProject.name || "",
        });

        // ✅ STORE EXISTING EDS FILES
        const fileMap = {};
        normalized.eds_list?.forEach((eds, i) => {
          if (eds.eds_reply_document) {
            fileMap[i] = eds.eds_reply_document;
          }
        });

        setExistingEdsFiles(fileMap);
        setIsEdit(true);
        return;
      }

      setIsEdit(false);
    } catch {
      setIsEdit(false);
    }
  };

  fetchData();
  return () => (cancelled = true);
}, [selectedProject?.id]);
  const [formData, setFormData] = useState(initialFormData);

  const sanitizeDraft = (data) => ({
    ...data,
    eds_list: Array.isArray(data?.eds_list)
      ? data.eds_list.map((eds) => ({
          ...eds,
          // File objects are not serializable in localStorage
          eds_reply_document:
            typeof eds?.eds_reply_document === "string"
              ? eds.eds_reply_document
              : null,
        }))
      : initialFormData.eds_list,
  });

  const normalizeEditPayload = (row) => {
    if (!row) return null;

    let parsedEdsList = [];
    if (Array.isArray(row.eds_list)) {
      parsedEdsList = row.eds_list;
    } else if (typeof row.eds_list === "string") {
      try {
        const parsed = JSON.parse(row.eds_list);
        parsedEdsList = Array.isArray(parsed) ? parsed : [];
      } catch {
        parsedEdsList = [];
      }
    }

    return {
      ...row,
      eds_flag: Number(row.eds_flag || 0),
      eds_list:
        parsedEdsList.length > 0 ? parsedEdsList : initialFormData.eds_list,
    };
  };

  useEffect(() => {
    let cancelled = false;

    const fetchExistingMasterData = async () => {
      const requestedRow = location.state?.projectMasterRow;
      if (requestedRow && selectedProject?.id && String(requestedRow.project_id) === String(selectedProject.id)) {
        const normalized = normalizeEditPayload(requestedRow);
        setEditData(normalized);
        setFormData({
          ...initialFormData,
          ...normalized,
          project_id: selectedProject.id,
          project_name: selectedProject.project_name || selectedProject.name || "",
          eds_flag: Number(normalized.eds_flag || 0),
          eds_list:
            Array.isArray(normalized.eds_list) && normalized.eds_list.length
              ? normalized.eds_list
              : initialFormData.eds_list,
        });
        return;
      }

      if (!selectedProject?.id) return;

      try {
        const res = await apiClient(
          `/forestland/forestProjectList?project_id=${selectedProject.id}&page=1&limit=1`,
        );

        if (cancelled) return;

        const latestRecord = Array.isArray(res?.data) ? res.data[0] : null;
        const normalized = normalizeEditPayload(latestRecord);
        const drafts = readProjectMasterDrafts();
        const projectId = String(selectedProject.id);
        const localDraft = drafts[projectId];

        setEditData(normalized);

        if (localDraft) {
          setFormData({
            ...initialFormData,
            ...localDraft,
            project_id: selectedProject.id,
            project_name:
              selectedProject.project_name || selectedProject.name || "",
          });
          return;
        }

        if (normalized) {
          setFormData({
            ...initialFormData,
            ...normalized,
            project_id: selectedProject.id,
            project_name:
              selectedProject.project_name || selectedProject.name || "",
            eds_flag: Number(normalized.eds_flag || 0),
            eds_list:
              Array.isArray(normalized.eds_list) && normalized.eds_list.length
                ? normalized.eds_list
                : initialFormData.eds_list,
          });
          return;
        }

        setFormData({
          ...initialFormData,
          project_id: selectedProject.id,
          project_name: selectedProject.project_name || selectedProject.name || "",
        });
      } catch {
        if (!cancelled) {
          setEditData(null);
          const drafts = readProjectMasterDrafts();
          const projectId = String(selectedProject.id);
          const localDraft = drafts[projectId];

          if (localDraft) {
            setFormData({
              ...initialFormData,
              ...localDraft,
              project_id: selectedProject.id,
              project_name:
                selectedProject.project_name || selectedProject.name || "",
            });
          } else {
            setFormData({
              ...initialFormData,
              project_id: selectedProject.id,
              project_name:
                selectedProject.project_name || selectedProject.name || "",
            });
          }
        }
      }
    };

    fetchExistingMasterData();

    return () => {
      cancelled = true;
    };
  }, [selectedProject?.id]);

  useEffect(() => {
    let cancelled = false;

    const fetchStageStatus = async () => {
      const projectId = formData.project_id;
      const stage = formData.current_stage;

      if (!projectId || !stage) {
        setFormData((prev) => ({
          ...prev,
          current_stage_status: "",
        }));
        return;
      }

      try {
        const res = await apiClient(
          `/forestland/getStageStatus/${projectId}/${encodeURIComponent(stage)}`,
        );

        if (!cancelled) {
          setFormData((prev) => ({
            ...prev,
            current_stage_status: res?.stage_status || "",
          }));
        }
      } catch (err) {
        if (!cancelled) {
          setFormData((prev) => ({
            ...prev,
            current_stage_status: "",
          }));
        }
      }
    };

    fetchStageStatus();

    return () => {
      cancelled = true;
    };
  }, [formData.project_id, formData.current_stage]);

  useEffect(() => {
    const projectId = formData?.project_id || selectedProject?.id;
    if (!projectId) return;

    const drafts = readProjectMasterDrafts();
    drafts[String(projectId)] = sanitizeDraft(formData);
    writeProjectMasterDrafts(drafts);
  }, [formData, selectedProject?.id]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
      return;
    }

    if (name === "project_category") {
      const nature = PROJECT_CATEGORY_NATURE_MAP[value] || "";

      setFormData((prev) => ({
        ...prev,
        project_category: value,
        project_nature: nature,
        project_sub_category:
          value === "Mining / Quarrying" ? prev.project_sub_category : "",
      }));

      return;
    }

    if (name === "project_id") {
      const matchedProject = projects.find((p) => String(p.id) === String(value));
      const nextProjectName = matchedProject?.project_name || matchedProject?.name || "";
      const drafts = readProjectMasterDrafts();
      const projectDraft = drafts[String(value)];

      if (projectDraft) {
        setFormData({
          ...initialFormData,
          ...projectDraft,
          project_id: value,
          project_name: nextProjectName,
        });
      } else {
        setFormData((prev) => ({
          ...prev,
          project_id: value,
          project_name: nextProjectName,
        }));
      }
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const addEDSRow = () => {
    setFormData((prev) => ({
      ...prev,
      eds_list: [
        ...prev.eds_list,
        {
          project_id: prev.project_id,
          eds_sl_no: prev.eds_list.length + 1,
          eds_ref_no: "",
          issuing_authority: "",
          eds_issue_date: "",
          eds_due_date: "",
          total_issues: "",
          issues_closed: "",
          issues_pending: "",
          eds_reply_document: null,
          eds_status: "",
        },
      ],
    }));
  };

  const removeEDSRow = (index) => {
    setFormData((prev) => ({
      ...prev,
      eds_list: prev.eds_list.filter((_, i) => i !== index),
    }));
  };

  const handleEDSChange = (index, field, value) => {
    const updated = [...formData.eds_list];
    updated[index][field] = value;
    setFormData({ ...formData, eds_list: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editData) {
      await updateForestProject({
        id: editData.id,
        formData,
        token,
        onSuccess: () => {
          const drafts = readProjectMasterDrafts();
          delete drafts[String(formData.project_id)];
          writeProjectMasterDrafts(drafts);
          showSuccess("Project updated successfully!");
          //   fetchProjects();
        },
        onError: (err) => showError(err?.message || "Error updating project"),
      });
      return;
    }

    await addForestProject({
      formData,
      token,
      selectedProject,
      onSuccess: () => {
        const drafts = readProjectMasterDrafts();
        delete drafts[String(formData.project_id || selectedProject?.id)];
        writeProjectMasterDrafts(drafts);
        showSuccess("Project added successfully!");
        // fetchProjects();
        setFormData({
          ...initialFormData,
          project_id: selectedProject?.id || "",
          project_name: selectedProject?.project_name || selectedProject?.name || "",
        });
      },
      onError: (err) => showError(err?.message || "Error adding project"),
    });
  };

  return (
    <div className="bg-white p-2 rounded-lg shadow-sm">
      <h3 className="text-xl font-bold mb-2">
        {editData
          ? "Edit Forest Project Master Data"
          : "Add Forest Project Master Data"}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Project ID</label>
            <input
              type="text"
              name={"project_id"}
              value={formData.project_id}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </div>
          <div>
            <label className="label">Project</label>
            <select
              name="project_id"
              value={formData.project_id}
              onChange={handleChange}
              className="select select-bordered w-full"
            >
              <option value="">Select Project</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.project_name || p.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Project Category</label>

            <div className="dropdown w-full">
              <label
                tabIndex={0}
                className="input input-bordered w-full flex items-center justify-between cursor-pointer"
              >
                <span className="truncate">
                  {formData.project_category || "Select Project Category"}
                </span>
                <span className="text-gray-400">▾</span>
              </label>

              <div
                tabIndex={0}
                className="dropdown-content z-[20] mt-1 w-full rounded-box shadow-lg bg-base-100 shadow max-h-60 overflow-y-auto"
                style={{ scrollbarWidth: "thin" }}
              >
                <ul className="menu menu-md p-1">
                  {Object.keys(PROJECT_CATEGORY_NATURE_MAP).map((cat) => (
                    <li key={cat}>
                      <button
                        type="button"
                        className={`whitespace-normal ${
                          formData.project_category === cat ? "active" : ""
                        }`}
                        onClick={() =>
                          handleChange({
                            target: {
                              name: "project_category",
                              value: cat,
                            },
                          })
                        }
                      >
                        {cat}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div>
            <label className="label">Project Nature</label>
            <input
              value={formData.project_nature || ""}
              readOnly
              placeholder="Auto-filled"
              className="input input-bordered w-full bg-gray-50 text-gray-700"
            />
          </div>

          <div>
            <label className="label">Mining Sub-Category</label>

            {NON_LINEAR_PROJECTS.includes(formData.project_category) ? (
              <select
                name="project_sub_category"
                value={formData.project_sub_category}
                onChange={handleChange}
                className="select select-bordered w-full"
              >
                <option value="">Select Mining Type</option>
                <option value="Coal">Coal</option>
                <option value="Non-Coal">Non-Coal</option>
                <option value="Critical Minerals">Critical Minerals</option>
              </select>
            ) : (
              <p className="text-sm text-gray-400 mt-3">
                Applicable only for NON-LINEAR projects
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[
            { name: "user_agency", label: "User Agency" },
            { name: "state", label: "State" },
            { name: "district", label: "District" },
            { name: "tahasil", label: "Tahasil" },
            { name: "mouza", label: "Mouza" },
            { name: "proposal_no", label: "Proposal No" },
            { name: "range_division", label: "Range / Division" },
            { name: "forest_type", label: "Forest Type" },
            {
              name: "total_project_area_ha",
              label: "Total Area (Ha)",
              type: "number",
            },
            {
              name: "forest_area_ha",
              label: "Forest Area (Ha)",
              type: "number",
            },
            {
              name: "non_forest_area_ha",
              label: "Non Forest Area (Ha)",
              type: "number",
            },
          ].map((f) => (
            <div key={f.name}>
              <label className="label">{f.label}</label>
              <input
                type={f.type || "text"}
                name={f.name}
                value={formData[f.name]}
                onChange={handleChange}
                className="input input-bordered w-full"
              />
            </div>
          ))}

          <div>
            <label className="label">Project Status</label>
            <select
              name="project_status"
              value={formData.project_status}
              onChange={handleChange}
              className="select select-bordered w-full"
            >
              <option value="">Select Status</option>
              <option value="Active">Active</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Current Stage
            </label>
            <select
              name="current_stage"
              value={formData.current_stage}
              onChange={handleChange}
              className="select select-bordered w-full"
              required
            >
              <option value="">Select Stage</option>
              <option value="Stage 0">Stage 0</option>
              <option value="Stage 1">Stage I</option>
              <option value="Stage 2">Stage II</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Current Stage Status
            </label>

            {formData.current_stage_status && (
              <div
                className={`inline-block px-5 py-1 rounded-full text-sm font-semibold border mt-2 ml-3
      ${
        {
          Completed: "bg-green-100 text-green-700 border-green-300",
          Ongoing: "bg-yellow-100 text-yellow-700 border-yellow-300",
          Granted: "bg-blue-100 text-blue-700 border-blue-300",
          Pending: "bg-gray-100 text-red-700 border-red-300",
          Ready: "bg-purple-100 text-purple-700 border-purple-300",
        }[formData.current_stage_status] ||
        "bg-gray-100 text-gray-700 border-gray-300"
      }
    `}
              >
                {formData.current_stage_status}
              </div>
            )}
          </div>
        </div>
        <div>
          <label className="label font-medium">EDS Flag</label>
          <div className="flex gap-6">
            <label className="flex gap-2">
              <input
                type="radio"
                checked={formData.eds_flag === 1}
                onChange={() => setFormData({ ...formData, eds_flag: 1 })}
              />
              Yes
            </label>

            <label className="flex gap-2">
              <input
                type="radio"
                checked={formData.eds_flag === 0}
                onChange={() => setFormData({ ...formData, eds_flag: 0 })}
              />
              No
            </label>
          </div>
        </div>

        {formData.eds_flag === 1 && (
          <div className="mt-4 bg-base-200 rounded-lg ">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-semibold text-lg">EDS Details</h4>
              <button
                type="button"
                className="btn btn-sm btn-primary"
                onClick={addEDSRow}
              >
                + Add EDS
              </button>
            </div>

            <div
              className="overflow-x-auto"
              style={{ scrollbarWidth: "thin", maxHeight: "300px" }}
            >
              <table className="table table-bordered w-full table-fixed">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="w-[80px]">EDS Sl No</th>
                    <th className="w-[160px]">EDS Ref No</th>
                    <th className="w-[200px]">Issuing Authority</th>
                    <th className="w-[160px]">EDS Issue Date</th>
                    <th className="w-[160px]">EDS Due Date</th>
                    <th className="w-[130px]">Total Issues</th>
                    <th className="w-[140px]">Issues Closed</th>
                    <th className="w-[150px]">Issues Pending</th>
                    <th className="w-[150px]">EDS Status</th>
                    <th className="w-[300px]">EDS Reply Document</th>
                    <th className="w-[100px]">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {formData.eds_list.length === 0 && (
                    <tr>
                      <td colSpan="7" className="text-center text-gray-400">
                        No EDS added
                      </td>
                    </tr>
                  )}

                  {formData.eds_list.map((eds, index) => (
                    <tr key={index}>
                      {/* <td>
                        <input
                          className="input input-sm input-bordered"
                          value={eds.project_id}
                          onChange={(e) =>
                            handleEDSChange(index, "project_id", e.target.value)
                          }
                        />
                      </td> */}
                      <td>
                        <input
                          className="input input-sm input-bordered"
                          value={eds.eds_sl_no}
                          onChange={(e) =>
                            handleEDSChange(index, "eds_sl_no", e.target.value)
                          }
                        />
                      </td>
                      <td>
                        <input
                          className="input input-sm input-bordered"
                          value={eds.eds_ref_no}
                          onChange={(e) =>
                            handleEDSChange(index, "eds_ref_no", e.target.value)
                          }
                        />
                      </td>

                      <td>
                        <input
                          className="input input-sm input-bordered"
                          value={eds.issuing_authority}
                          onChange={(e) =>
                            handleEDSChange(
                              index,
                              "issuing_authority",
                              e.target.value,
                            )
                          }
                        />
                      </td>

                      <td>
                        <input
                          type="date"
                          className="input input-sm input-bordered"
                          value={eds.eds_issue_date}
                          onChange={(e) =>
                            handleEDSChange(
                              index,
                              "eds_issue_date",
                              e.target.value,
                            )
                          }
                        />
                      </td>

                      <td>
                        <input
                          type="date"
                          className="input input-sm input-bordered"
                          value={eds.eds_due_date}
                          onChange={(e) =>
                            handleEDSChange(
                              index,
                              "eds_due_date",
                              e.target.value,
                            )
                          }
                        />
                      </td>

                      <td>
                        <input
                          className="input input-sm input-bordered"
                          value={eds.total_issues}
                          onChange={(e) =>
                            handleEDSChange(
                              index,
                              "total_issues",
                              e.target.value,
                            )
                          }
                        />
                      </td>

                      <td>
                        <input
                          className="input input-sm input-bordered"
                          value={eds.issues_closed}
                          onChange={(e) =>
                            handleEDSChange(
                              index,
                              "issues_closed",
                              e.target.value,
                            )
                          }
                        />
                      </td>

                      <td>
                        <input
                          className="input input-sm input-bordered"
                          value={eds.issues_pending}
                          onChange={(e) =>
                            handleEDSChange(
                              index,
                              "issues_pending",
                              e.target.value,
                            )
                          }
                        />
                      </td>

                      <td>
                        <input
                          className="input input-sm input-bordered"
                          value={eds.eds_status}
                          onChange={(e) =>
                            handleEDSChange(index, "eds_status", e.target.value)
                          }
                        />
                      </td>

                      <td>
                        <input
                          type="file"
                          className="file-input file-input-sm w-full file-input-bordered"
                          onChange={(e) =>
                            handleEDSChange(
                              index,
                              "eds_reply_document",
                              e.target.files[0],
                            )
                          }
                        />
                      </td>

                      <td>
                        <button
                          type="button"
                          className="btn btn-xs btn-error"
                          onClick={() => removeEDSRow(index)}
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <button type="submit" className="btn btn-primary">
            {editData ? "Update" : "Save"}
          </button>
        </div>
      </form>

      <SuccessMessage
        open={modal.open}
        type={modal.type}
        message={modal.message}
        onClose={closeModal}
      />
    </div>
  );
};

export default ProjectMaster;
