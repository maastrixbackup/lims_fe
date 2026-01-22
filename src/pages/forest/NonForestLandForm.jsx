import React, { useState } from "react";
import { submitLandSchedule } from "../../hooks/useLandScheduleSubmit";
import { useSelector } from "react-redux";

const NonForestLandForm = ({ open, onClose }) => {
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
      activeTab: "nonForest",
      token,
      onSuccess: () => {
        alert("Non-Forest Land Added");
        onClose();
      },
    });
  };

  return (
    <dialog className="modal" open={open}>
      <div className="modal-box max-w-2xl max-h-130 relative">
        <h3 className="font-bold text-lg mb-4">Add Non-Forest Land Details</h3>

        {/* Form */}
        <form className="grid grid-cols-2 gap-4" onSubmit={handleSubmit}>
          <div>
            <label className="label">District</label>
            <input name="district" className="input input-bordered w-full" onChange={handleChange}/>
          </div>

          <div>
            <label className="label">RI Circle</label>
            <input name="ri_circle" className="input input-bordered w-full" onChange={handleChange}/>
          </div>

          <div>
            <label className="label">Tahashil</label>
            <input name="tahashil" className="input input-bordered w-full" onChange={handleChange}/>
          </div>

          <div>
            <label className="label">Village</label>
            <input name="village" className="input input-bordered w-full" onChange={handleChange}/>
          </div>

          <div>
            <label className="label">Khata No</label>
            <input name="khata_no" className="input input-bordered w-full" onChange={handleChange}/>
          </div>

          <div>
            <label className="label">Plot No</label>
            <input name="plot_no" className="input input-bordered w-full" onChange={handleChange}/>
          </div>

          <div>
            <label className="label">Kissam</label>
            <input name="kisam" className="input input-bordered w-full" onChange={handleChange}/>
          </div>
          <div>
            <label className="label">Wonership</label>
            <input name="wonership" className="input input-bordered w-full" onChange={handleChange}/>
          </div>
          <div>
            <label className="label">Land Alloted Through FRA if</label>
            <select
              name="fra_allotted"
              className="select select-bordered w-full"
              onChange={handleChange}
            >
              <option>Yes</option>
              <option>No</option>
            </select>
          </div>

          <div>
            <label className="label">Total Area (ha)</label>
            <input
              type="number"
              name="total_area_ha"
              className="input input-bordered w-full"
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="label">Proposed / Acquired Area (ha)</label>
            <input
              type="number"
              name="proposed_acquired_area_ha"
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
    <button
      type="button"
      className="btn btn-ghost"
      onClick={onClose}
    >
      Cancel
    </button>

    <button
      type="submit"
      className="btn btn-primary"
    >
      Save
    </button>
  </div>
        </form>
      </div>

      {/* backdrop */}
      <div className="modal-backdrop" onClick={onClose}></div>
    </dialog>
  );
};

export default NonForestLandForm;
