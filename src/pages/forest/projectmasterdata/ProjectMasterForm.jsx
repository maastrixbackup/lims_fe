import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { addForestProject } from "../addForestProject";

const ProjectMasterForm = ({ onClose, fetchProjects }) => {
  const token = useSelector((state) => state.auth.userToken);
  const selectedProject = useSelector((s) => s.selectedProject.project);
  const projects = useSelector((s) => s.list.projects || []);

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
    eds_flag: 0,
    eds_document: null,
  };

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (selectedProject?.id) {
      setFormData((prev) => ({
        ...prev,
        project_id: selectedProject.id,
        project_name: selectedProject.project_name || selectedProject.name || "",
      }));
    }
  }, [selectedProject]);

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;

    if (type === "file") {
      setFormData({ ...formData, [name]: files[0] });
      return;
    }

    if (name === "project_id") {
      const selected = projects.find((p) => String(p.id) === value);
      setFormData({
        ...formData,
        project_id: value,
        project_name: selected?.project_name || selected?.name || "",
      });
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await addForestProject({
      formData,
      token,
      selectedProject,
      onSuccess: () => {
        alert("Project added successfully!");
        onClose();
        setFormData({
          ...initialFormData,
          project_id: selectedProject?.id || "",
          project_name: selectedProject?.project_name || selectedProject?.name || "",
        });
            fetchProjects()
      },
      onError: (err) => {
        alert(err?.message || "Error adding project");
        console.error(err);
      },
    });
  };
  return (
    <div className="modal modal-open">
      <div className="modal-box w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-bold mb-4">Add Forest Project</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Project</label>
            <select
              name="project_id"
              value={formData.project_id}
              onChange={handleChange}
              className="select select-bordered w-full"
              required
            >
              <option value="">Select Project</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.project_name || p.name}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { name: "proposal_no", placeholder: "Proposal No", required: true },
              { name: "user_agency", placeholder: "User Agency" },
              { name: "sector", placeholder: "Sector" },
              { name: "state", placeholder: "State" },
              { name: "district", placeholder: "District" },
              { name: "tahasil", placeholder: "Tahasil" },
              { name: "mouza", placeholder: "Mouza" },
              { name: "range_division", placeholder: "Range / Division" },
              { name: "forest_type", placeholder: "Forest Type" },
              { name: "total_project_area_ha", placeholder: "Total Area", type: "number" },
              { name: "forest_area_ha", placeholder: "Forest Area", type: "number" },
              { name: "non_forest_area_ha", placeholder: "Non Forest Area", type: "number" },
              { name: "project_status", placeholder: "Project Status" },
              { name: "current_stage", placeholder: "Current Stage" },
            ].map((field) => (
              <input
                key={field.name}
                type={field.type || "text"}
                name={field.name}
                placeholder={field.placeholder}
                value={formData[field.name]}
                onChange={handleChange}
                className="input input-bordered"
                required={field.required}
              />
            ))}
          </div>
          <div className="flex gap-6 items-center">
            <label>EDS Flag:</label>

            <label className="flex gap-2 items-center">
              <input
                type="radio"
                name="eds_flag"
                checked={formData.eds_flag === 1}
                onChange={() => setFormData({ ...formData, eds_flag: 1 })}
              />
              Yes
            </label>

            <label className="flex gap-2 items-center">
              <input
                type="radio"
                name="eds_flag"
                checked={formData.eds_flag === 0}
                onChange={() => setFormData({ ...formData, eds_flag: 0 })}
              />
              No
            </label>
          </div>

          <input
            type="file"
            name="eds_document"
            onChange={handleChange}
            className="file-input file-input-bordered w-full"
          />
          <div className="modal-action">
            <button type="button" onClick={onClose} className="btn">
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!formData.project_id}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectMasterForm;
