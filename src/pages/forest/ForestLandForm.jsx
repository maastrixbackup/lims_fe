import React, { useState, useEffect } from "react";
import { submitLandSchedule } from "../../hooks/useLandScheduleSubmit";
import { updateLandSchedule } from "../../hooks/UpdateForestLand";
import { useSelector } from "react-redux";
import SuccessMessage from "../../shared/SuccessMessage";
import { useSuccessMessage } from "../../hooks/useSuccessMessage";

const initialState = {
  district: "",
  ri_circle: "",
  forest_division: "",
  forest_range: "",
  village: "",
  khata_no: "",
  plot_no: "",
  kisam: "",
  forest_category_id: "",
  total_area_ha: "",
  proposed_acquired_area_ha: "",
  remarks: "",
};

const ForestLandForm = ({ open, onClose, onSuccess, editData }) => {
  const [formData, setFormData] = useState(initialState);
  const token = useSelector((state) => state.auth.userToken);
  const { modal, showSuccess, showError, closeModal } =
    useSuccessMessage();

  const isEdit = Boolean(editData?.id);


  useEffect(() => {
    if (isEdit) {
      setFormData({
        district: editData.district ?? "",
        ri_circle: editData.ri_circle ?? "",
        forest_division: editData.forest_division ?? "",
        forest_range: editData.forest_range ?? "",
        village: editData.village ?? "",
        khata_no: editData.khata_no ?? "",
        plot_no: editData.plot_no ?? "",
        kisam: editData.kisam ?? "",
        forest_category_id: editData.forest_category_id ?? "",
        total_area_ha: editData.total_area_ha ?? "",
        proposed_acquired_area_ha:
          editData.proposed_acquired_area_ha ?? "",
        remarks: editData.remarks ?? "",
      });
    } else {
      setFormData(initialState);
    }
  }, [editData, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const apiFn = isEdit
      ? updateLandSchedule
      : submitLandSchedule;

    await apiFn({
      id: isEdit ? editData.id : undefined,
      formData,
      activeTab: "forest",
      token,
      onSuccess: () => {
        showSuccess(
          isEdit
            ? "Forest Land Updated Successfully"
            : "Forest Land Added Successfully"
        );
        onSuccess?.();
        onClose();
      },
      onError: (err) =>
        showError(err?.message || "Something went wrong"),
    });
  };

  return (
    <>
      <dialog className="modal" open={open}>
        <div className="modal-box max-w-2xl">
          <h3 className="font-semibold text-lg mb-4">
            {isEdit
              ? "Edit Forest Land Details"
              : "Add Forest Land Details"}
          </h3>

          <form
            className="grid grid-cols-2 gap-4"
            onSubmit={handleSubmit}
          >
            {[
              ["district", "District"],
              ["ri_circle", "RI Circle"],
              ["forest_division", "Forest Division"],
              ["forest_range", "Range"],
              ["village", "Village"],
              ["khata_no", "Khata No"],
              ["plot_no", "Plot No"],
              ["kisam", "Kisam"],
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
              <label className="label">Forest Category</label>
              <select
                name="forest_category_id"
                value={formData.forest_category_id}
                className="select select-bordered w-full"
                onChange={handleChange}
              >
                <option value="">Select Category</option>
                <option value="1">Revenue Forest</option>
                <option value="2">Reserved Forest</option>
                <option value="3">Proposed Reserved Forest</option>
                <option value="4">Protected Forest</option>
                <option value="5">Sabik Forest</option>
                <option value="6">DLC Forest</option>
                <option value="7">Others Forest</option>
              </select>
            </div>

            <div>
              <label className="label">Total Area (ha)</label>
              <input
                type="number"
                name="total_area_ha"
                value={formData.total_area_ha}
                className="input input-bordered w-full"
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="label">
                Proposed / Acquired Area (ha)
              </label>
              <input
                type="number"
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

            <div className="modal-action col-span-2">
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

      <SuccessMessage
        open={modal.open}
        type={modal.type}
        message={modal.message}
        onClose={closeModal}
      />
    </>
  );
};

export default ForestLandForm;
