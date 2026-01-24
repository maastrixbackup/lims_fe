import React, {useState}from 'react'
import { useSelector } from 'react-redux';

const ProjectMasterForm = ({onClose}) => {
    const token = useSelector((state)=>state.auth.userToken)
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
    } else if (type === "checkbox") {
      setFormData({ ...formData, [name]: e.target.checked ? 1 : 0 });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addForestProject({
        formData,
      
        onSuccess: (res) => {
          alert("Project added successfully!");
          setIsModalOpen(false);
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
          console.error(err);
        },
      });
    } catch (err) {
      console.error(err);
    }
  };
  return (
   <> 
   <div className="modal modal-open">
      <div className="modal-box w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-bold mb-4">Add Forest Project</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
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
            <label className="flex items-center space-x-2 mt-2">
              <input
                type="checkbox"
                name="eds_flag"
                checked={formData.eds_flag === 1}
                onChange={handleChange}
                className="checkbox"
              />
              <span>EDS Flag</span>
            </label>
            <input
              type="file"
              name="eds_document"
              onChange={handleChange}
              className="file-input file-input-bordered w-full mt-2"
            />
          </div>

          {/* Buttons */}
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
  )
}

export default ProjectMasterForm