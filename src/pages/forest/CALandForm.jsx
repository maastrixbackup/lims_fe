import React, { useState, useEffect } from "react";
import { submitLandSchedule } from "../../hooks/useLandScheduleSubmit";
import { updateLandSchedule } from "../../hooks/UpdateForestLand";
import { useSelector } from "react-redux";
import { useSuccessMessage } from "../../hooks/useSuccessMessage";
import SuccessMessage from "../../shared/SuccessMessage";

const initialState = {
  district: "",
  ri_circle: "",
  tahasil: "",
  village: "",
  khata_no: "",
  plot_no: "",
  kisam: "",
  ownership: "",
  patch_name: "",
  total_area_ha: "",
  ca_area_ha:"",
  forest_division: "",
  remarks: "",
};

const CATLandForm = ({ open, onClose, onSuccess, editData }) => {
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
        patch_name: editData.patch_name ?? "",
        total_area_ha: editData.total_area_ha ?? "",
        ca_area_ha:editData.ca_area_ha ?? "",
        forest_division:editData.forest_division ?? "",
        remarks: editData.remarks ?? "",
      });
    } else {
      setFormData({
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
      activeTab: "ca",
      token,
      selectedProject,
      onSuccess: () => {
        showSuccess(
          isEdit
            ? "CA Land Updated Successfully"
            : "CA Land Added Successfully"
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
              ? "Edit CA-Land Land Details"
              : "Add CA-Land Land Details"}
          </h3>

          <form className="grid grid-cols-2 gap-4" onSubmit={handleSubmit}>
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
              <label className="label">Patch Name</label>
              <input
                type="text"
                name="patch_name"
                value={formData.patch_name}
                className="input input-bordered w-full"
                onChange={handleChange}
              />
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
              <label className="label">CA Area</label>
              <input
                type="text"
                name="ca_area_ha"
                value={formData.ca_area_ha}
                className="input input-bordered w-full"
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="label">Forest Division</label>
              <input
                type="text"
                name="forest_division"
                value={formData.forest_division}
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

export default CATLandForm;
