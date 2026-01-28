import React, { useState, useEffect } from "react";
import { submitLandSchedule } from "../../hooks/useLandScheduleSubmit";
import { updateLandSchedule } from "../../hooks/UpdateForestLand";
import { useSelector } from "react-redux";
import { useSuccessMessage } from "../../hooks/useSuccessMessage";
import SuccessMessage from "../../shared/SuccessMessage";

const initialState = {
   project_master_id: "",
  district: "",
  ri_circle: "",
  tahasil: "",
  village: "",
  khata_no: "",
  plot_no: "",
  kisam: "",
  ownership: "",
  fra_allotted: "",
  total_area_ha: "",
  proposed_acquired_area_ha: "",
  remarks: "",
};

const NonForestLandForm = ({ open, onClose, onSuccess, editData }) => {
  const [formData, setFormData] = useState(initialState);
  const token = useSelector((state) => state.auth.userToken);
   const selectedProject = useSelector((s) => s.selectedProject.project);
    const projects = useSelector((s) => s.list.projects || []);
  const { modal, showSuccess, showError, closeModal } =
    useSuccessMessage();

  const isEdit = Boolean(editData?.id);

  useEffect(() => {
    if (isEdit) {
      setFormData({
         project_master_id: editData.project_master_id || selectedProject?.id || "",
        district: editData.district ?? "",
        ri_circle: editData.ri_circle ?? "",
        tahasil: editData.tahasil ?? "",
        village: editData.village ?? "",
        khata_no: editData.khata_no ?? "",
        plot_no: editData.plot_no ?? "",
        kisam: editData.kisam ?? "",
        ownership: editData.ownership ?? "",
        fra_allotted: editData.fra_allotted ?? "",
        total_area_ha: editData.total_area_ha ?? "",
        proposed_acquired_area_ha:
          editData.proposed_acquired_area_ha ?? "",
        remarks: editData.remarks ?? "",
      });
    } else {  setFormData({
        ...initialState,
        project_master_id: selectedProject?.id || "",
      });
    }
  }, [editData, isEdit, selectedProject]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const apiFn = isEdit ? updateLandSchedule : submitLandSchedule;

    await apiFn({
      id: isEdit ? editData.id : undefined,
      formData,
      activeTab: "nonForest",
      token,
      selectedProject, 
      onSuccess: () => {
        showSuccess(
          isEdit
            ? "Non-Forest Land Updated Successfully"
            : "Non-Forest Land Added Successfully"
        );
        onSuccess?.();
        onClose();
      },
      onError: (err) => showError(err?.message || "Error"),
    });
  };

  return (
    <>
      <dialog className="modal" open={open}>
        <div className="modal-box max-w-2xl max-h-130 relative">
          <h3 className="font-semibold text-lg mb-4">
            {isEdit
              ? "Edit Non-Forest Land Details"
              : "Add Non-Forest Land Details"}
          </h3>

          <form className="grid grid-cols-2 gap-4" onSubmit={handleSubmit}>
            <div>
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

            {[
              ["district", "District"],
              ["ri_circle", "RI Circle"],
              ["tahasil", "Tahasil"],
              ["village", "Village"],
              ["khata_no", "Khata No"],
              ["plot_no", "Plot No"],
              ["kisam", "Kisam"],
              ["ownership", "Ownership"],
            ].map(([name, label]) => (
              <div key={name}>
                <label className="label">{label}</label>
                <input
                  name={name}
                  value={formData[name]}
                  className="input input-bordered w-full"
                  onChange={handleChange}
                />
              </div>
            ))}

            <div>
              <label className="label">Land Allotted Through FRA</label>
              <select
                name="fra_allotted"
                value={formData.fra_allotted}
                className="select select-bordered w-full"
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>

            <div>
              <label className="label">Total Area (ha)</label>
              <input
                type="text"
                name="total_area_ha"
                value={formData.total_area_ha}
                className="input input-bordered w-full"
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="label">Proposed / Acquired Area (ha)</label>
              <input
                type="text"
                name="proposed_acquired_area_ha"
                value={formData.proposed_acquired_area_ha}
                className="input input-bordered w-full"
                onChange={handleChange}
              />
            </div>

            <div className="col-span-2">
              <label className="label">Remarks</label>
              <input
                name="remarks"
                value={formData.remarks}
                className="input input-bordered w-full"
                onChange={handleChange}
              />
            </div>

            <div className="modal-action col-span-2 mt-6">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={onClose}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {isEdit ? "Update" : "Save"}
              </button>
            </div>
          </form>
        </div>

        <div className="modal-backdrop" onClick={onClose} />
      </dialog>

      {/* Success/Error modal */}
      {modal && (
        <SuccessMessage
          open={modal.open}
          type={modal.type}
          message={modal.message}
          onClose={closeModal}
        />
      )}
    </>
  );
};

export default NonForestLandForm;
