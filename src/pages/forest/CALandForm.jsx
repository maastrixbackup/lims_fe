import React, { useState } from "react";
import { useSelector } from "react-redux";
import { submitLandSchedule } from "../../hooks/useLandScheduleSubmit";

const CALandForm = ({ open, onClose }) => {
  const [formData, setFormData] = useState({});
  const token = useSelector((state) => state.auth.userToken);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((p) => ({
      ...p,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await submitLandSchedule({
      formData,
      activeTab: "ca",
      token,
      onSuccess: () => {
        alert("CA Land Added");
        onClose();
      },
    });
  };

  return (
    <dialog className="modal" open={open}>
      <div className="modal-box max-w-2xl max-h-130 relative">
        <h3 className="font-bold text-lg mb-4">Add CA Land Details</h3>

        {/* Form */}
        <form className="grid grid-cols-2 gap-4" onSubmit={handleSubmit}>
          <div>
            <label className="label">District</label>
            <input
              name="district"
              className="input input-bordered w-full"
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="label">RI Circle</label>
            <input
              name="ri_circle"
              className="input input-bordered w-full"
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="label">Tahashil</label>
            <input
              name="tahashil"
              className="input input-bordered w-full"
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="label">Village</label>
            <input
              name="village"
              className="input input-bordered w-full"
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="label">Khata No</label>
            <input
              name="khata_no"
              className="input input-bordered w-full"
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="label">Plot No</label>
            <input
              name="plot_no"
              className="input input-bordered w-full"
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="label">Kissam</label>
            <input
              name="kisam"
              className="input input-bordered w-full"
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="label">Wonership</label>
            <input
              name="wonership"
              className="input input-bordered w-full"
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="label">Forest Range/ Divison</label>
            <input
              name="forest_range"
              className="input input-bordered w-full"
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="label">Patch Name</label>
            <input
              name="patch_name"
              className="input input-bordered w-full"
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="label">Total Area (ha)</label>
            <input
              type="number"
              name="total_area"
              className="input input-bordered w-full"
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="label">CA Area</label>
            <input
              type="number"
              name="ca_area"
              className="input input-bordered w-full"
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="label">Remarks</label>
            <input
              name="remarks"
              className="input input-bordered w-full"
              onChange={handleChange}
            />
          </div>
          <div className="modal-action col-span-2 mt-6">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>

            <button type="submit" className="btn btn-primary">
              Save
            </button>
          </div>
        </form>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </dialog>
  );
};

export default CALandForm;
