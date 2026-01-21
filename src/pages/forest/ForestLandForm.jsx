import React from "react";

const ForestLandForm = ({ open, onClose }) => {
  if (!open) return null;

  return (
    <dialog className="modal modal-open">
      <div className="modal-box max-w-3xl">
        <h3 className="font-bold text-lg mb-4">
          Add Forest Land Details
        </h3>

        {/* Form */}
        <form className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">District</label>
            <input className="input input-bordered w-full" />
          </div>

          <div>
            <label className="label">RI Circle</label>
            <input className="input input-bordered w-full" />
          </div>

          <div>
            <label className="label">Forest Division</label>
            <input className="input input-bordered w-full" />
          </div>

          <div>
            <label className="label">Range</label>
            <input className="input input-bordered w-full" />
          </div>

          <div>
            <label className="label">Village</label>
            <input className="input input-bordered w-full" />
          </div>

          <div>
            <label className="label">Khata No</label>
            <input className="input input-bordered w-full" />
          </div>

          <div>
            <label className="label">Plot No</label>
            <input className="input input-bordered w-full" />
          </div>

          <div>
            <label className="label">Kisam</label>
            <input className="input input-bordered w-full" />
          </div>

          <div>
            <label className="label">Forest Category</label>
            <select className="select select-bordered w-full">
              <option>Protected Forest</option>
              <option>Reserved Forest</option>
              <option>Unclassed Forest</option>
            </select>
          </div>

          <div>
            <label className="label">Total Area (ha)</label>
            <input type="number" className="input input-bordered w-full" />
          </div>

          <div>
            <label className="label">Proposed / Acquired Area (ha)</label>
            <input type="number" className="input input-bordered w-full" />
          </div>

          <div>
            <label className="label">Remarks</label>
            <input className="input input-bordered w-full" />
          </div>
        </form>

        {/* Actions */}
        <div className="modal-action mt-6">
          <button className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary">
            Save
          </button>
        </div>
      </div>

      {/* backdrop */}
      <div className="modal-backdrop" onClick={onClose}></div>
    </dialog>
  );
};

export default ForestLandForm;
