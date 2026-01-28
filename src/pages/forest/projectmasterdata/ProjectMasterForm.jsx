import React, { useState } from "react";
import { useSelector } from "react-redux";
import { addForestProject } from "../addForestProject";

const ProjectMasterForm = ({ onClose }) => {
  const token = useSelector((state) => state.auth.userToken);
    const selectedProject = useSelector((s) => s.selectedProject.project);
    const projects = useSelector((s) => s.list.projects || []);
  const [formData, setFormData] = useState({
    proposal_no: "",
    project_name: "",
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
  });
const handleChange = (e) => {
  const { name, value, files, type } = e.target;

  if (type === "file") {
    setFormData({ ...formData, [name]: files[0] });
  } else {
    setFormData({ ...formData, [name]: value });
  }
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
        proposal_no: "",
        project_name: "",
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
      });
    },
    onError: (err) => {
      alert("Error adding project");
      console.error("API Error:", err);
    },
  });
};

  return (
    <>
      <div className="modal modal-open">
        <div className="modal-box w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <h3 className="text-lg font-bold mb-4">Add Forest Project</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
              <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Project Name</label>
              <select
                name="project_master_id"
                value={formData.project_master_id}
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
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                name="proposal_no"
                placeholder="Proposal No"
                value={formData.proposal_no}
                onChange={handleChange}
                className="input input-bordered w-full"
                required
              />
              <input
                type="text"
                name="project_name"
                placeholder="Project Name"
                value={formData.project_name}
                onChange={handleChange}
                className="input input-bordered w-full"
                required
              />
              <input
                type="text"
                name="user_agency"
                placeholder="User Agency"
                value={formData.user_agency}
                onChange={handleChange}
                className="input input-bordered w-full"
              />
              <input
                type="text"
                name="sector"
                placeholder="Sector"
                value={formData.sector}
                onChange={handleChange}
                className="input input-bordered w-full"
              />
              <input
                type="text"
                name="state"
                placeholder="State"
                value={formData.state}
                onChange={handleChange}
                className="input input-bordered w-full"
              />
              <input
                type="text"
                name="district"
                placeholder="District"
                value={formData.district}
                onChange={handleChange}
                className="input input-bordered w-full"
              />
              <input
                type="text"
                name="tahasil"
                placeholder="Tahasil"
                value={formData.tahasil}
                onChange={handleChange}
                className="input input-bordered w-full"
              />
              <input
                type="text"
                name="mouza"
                placeholder="Mouza"
                value={formData.mouza}
                onChange={handleChange}
                className="input input-bordered w-full"
              />
              <input
                type="text"
                name="range_division"
                placeholder="Range / Division"
                value={formData.range_division}
                onChange={handleChange}
                className="input input-bordered w-full"
              />
              <input
                type="text"
                name="forest_type"
                placeholder="Forest Type"
                value={formData.forest_type}
                onChange={handleChange}
                className="input input-bordered w-full"
              />
              <input
                type="number"
                name="total_project_area_ha"
                placeholder="Total Project Area (ha)"
                value={formData.total_project_area_ha}
                onChange={handleChange}
                className="input input-bordered w-full"
              />
              <input
                type="number"
                name="forest_area_ha"
                placeholder="Forest Area (ha)"
                value={formData.forest_area_ha}
                onChange={handleChange}
                className="input input-bordered w-full"
              />
              <input
                type="number"
                name="non_forest_area_ha"
                placeholder="Non Forest Area (ha)"
                value={formData.non_forest_area_ha}
                onChange={handleChange}
                className="input input-bordered w-full"
              />
              <input
                type="text"
                name="project_status"
                placeholder="Project Status"
                value={formData.project_status}
                onChange={handleChange}
                className="input input-bordered w-full"
              />
              <input
                type="text"
                name="current_stage"
                placeholder="Current Stage"
                value={formData.current_stage}
                onChange={handleChange}
                className="input input-bordered w-full"
              />
           <div className="flex gap-6 items-center">
            <label>EDS Flag :</label>
  <label className="flex items-center gap-2">
    <input
      type="radio"
      name="eds_flag"
      value="1"
      checked={formData.eds_flag === 1}
      onChange={() => setFormData({ ...formData, eds_flag: 1 })}
    />
    Yes
  </label>

  <label className="flex items-center gap-2">
    <input
      type="radio"
      name="eds_flag"
      value="0"
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
                className="file-input file-input-bordered w-full mt-2"
              />
            </div>
            <div className="modal-action mt-4">
              <button type="button" onClick={onClose} className="btn">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ProjectMasterForm;
