
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { addForestProject } from "../addForestProject";
import { updateForestProject } from "../../../hooks/updateForestProject";
import SuccessMessage from "../../../shared/SuccessMessage";
import { useSuccessMessage } from "../../../hooks/useSuccessMessage";
import {
  NON_LINEAR_PROJECTS,
  PROJECT_CATEGORY_NATURE_MAP,
} from "../../../utils/constants";

const ProjectMaster = () => {
  const token = useSelector((state) => state.auth.userToken);
  const selectedProject = useSelector((s) => s.selectedProject.project);
  const projects = useSelector((s) => s.list.projects || []);
  const [editData, setEditData] = useState();

  const { modal, showSuccess, showError, closeModal } = useSuccessMessage();

  const initialFormData = {
    project_id: "",
    project_name: "",
    proposal_no: "",
    user_agency: "",
    sector: "",
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

    // 🔹 MULTIPLE EDS
    eds_list: [],

    project_category: "",
    project_nature: "",
    project_sub_category: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  useEffect(() => {
    let status = "";

    if (formData.current_stage === "0") {
      status = "Ongoing";
    } else if (formData.current_stage === "I") {
      status = "Completed";
    } else if (formData.current_stage === "II") {
      status = "Granted";
    }

    setFormData((prev) => ({
      ...prev,
      current_stage_status: status,
    }));
  }, [formData.current_stage]);

  useEffect(() => {
    if (editData) {
      setFormData({
        ...initialFormData,
        ...editData,
        eds_flag: Number(editData.eds_flag || 0),
      });
    }
  }, [editData]);

  useEffect(() => {
    if (selectedProject?.id) {
      setFormData((prev) => ({
        ...prev,
        project_id: selectedProject.id,
        project_name:
          selectedProject.project_name || selectedProject.name || "",
      }));
    }
  }, [selectedProject]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      setFormData({ ...formData, [name]: files[0] });
      return;
    }

    if (name === "project_category") {
      const nature = PROJECT_CATEGORY_NATURE_MAP[value] || "";

      setFormData({
        ...formData,
        project_category: value,
        project_nature: nature,
        project_sub_category:
          value === "Mining / Quarrying" ? formData.project_sub_category : "",
      });

      return;
    }

    setFormData({ ...formData, [name]: value });
  };
  const addEDSRow = () => {
    setFormData((prev) => ({
      ...prev,
      eds_list: [
        ...prev.eds_list,
        {
          project_id: prev.project_id,
          eds_sl_no: prev.eds_list.length + 1,
          edsRefNo: "",
          issuingAuthority: "",
          edsIssueDate: "",
          edsDueDate: "",
          totalIssues: "",
          issuesClosed: "",
          issuesPending: "",
          eds_reply_documents: null,
          edsStatus: "",
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
        showSuccess("Project added successfully!");
        // fetchProjects();
        setFormData(initialFormData);
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
              <option value="0">Stage 0</option>
              <option value="I">Stage I</option>
              <option value="II">Stage II</option>
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
          Pending: "bg-gray-100 text-gray-700 border-gray-300",
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
                          value={eds.edsRefNo}
                          onChange={(e) =>
                            handleEDSChange(index, "edsRefNo", e.target.value)
                          }
                        />
                      </td>

                      <td>
                        <input
                          className="input input-sm input-bordered"
                          value={eds.issuingAuthority}
                          onChange={(e) =>
                            handleEDSChange(
                              index,
                              "issuingAuthority",
                              e.target.value,
                            )
                          }
                        />
                      </td>

                      <td>
                        <input
                          type="date"
                          className="input input-sm input-bordered"
                          value={eds.edsIssueDate}
                          onChange={(e) =>
                            handleEDSChange(
                              index,
                              "edsIssueDate",
                              e.target.value,
                            )
                          }
                        />
                      </td>

                      <td>
                        <input
                          type="date"
                          className="input input-sm input-bordered"
                          value={eds.edsDueDate}
                          onChange={(e) =>
                            handleEDSChange(index, "edsDueDate", e.target.value)
                          }
                        />
                      </td>

                      <td>
                        <input
                          className="input input-sm input-bordered"
                          value={eds.totalIssues}
                          onChange={(e) =>
                            handleEDSChange(
                              index,
                              "totalIssues",
                              e.target.value,
                            )
                          }
                        />
                      </td>

                      <td>
                        <input
                          className="input input-sm input-bordered"
                          value={eds.issuesClosed}
                          onChange={(e) =>
                            handleEDSChange(
                              index,
                              "issuesClosed",
                              e.target.value,
                            )
                          }
                        />
                      </td>

                      <td>
                        <input
                          className="input input-sm input-bordered"
                          value={eds.issuesPending}
                          onChange={(e) =>
                            handleEDSChange(
                              index,
                              "issuesPending",
                              e.target.value,
                            )
                          }
                        />
                      </td>

                      <td>
                        <input
                          className="input input-sm input-bordered"
                          value={eds.edsStatus}
                          onChange={(e) =>
                            handleEDSChange(index, "edsStatus", e.target.value)
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
                              "eds_document",
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
