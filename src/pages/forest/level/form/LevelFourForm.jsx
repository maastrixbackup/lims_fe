import React, { useState } from "react";

const LevelFourForm = ({ setRows, setShowModal, rows }) => {
  const [form, setForm] = useState({
    projectId: "",
    finalApprovalNo: "",
    finalApprovalDate: "",
    divertedArea: "",
    landHandover: "",
    handoverDate: "",
    handoverDoc: null,
    projectClosed: "",
    closureDate: "",
    closureDoc: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setForm({
      ...form,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = () => {
    setRows([...rows, form]);
    setShowModal(false);

    setForm({
      projectId: "",
      finalApprovalNo: "",
      finalApprovalDate: "",
      divertedArea: "",
      landHandover: "",
      handoverDate: "",
      handoverDoc: null,
      projectClosed: "",
      closureDate: "",
      closureDoc: null,
    });
  };

  return (
    <dialog className="modal modal-open">
      <div className="modal-box max-w-xl">
        <h3 className="font-bold mb-4">Add Stage II Clearance</h3>

        <div className="grid grid-cols-2 gap-4">

          <div>
            <label>Project ID</label>
            <input
              name="projectId"
              className="input input-bordered w-full"
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Final Approval No</label>
            <input
              name="finalApprovalNo"
              className="input input-bordered w-full"
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Final Approval Date</label>
            <input
              type="date"
              name="finalApprovalDate"
              className="input input-bordered w-full"
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Diverted Area (ha)</label>
            <input
              name="divertedArea"
              className="input input-bordered w-full"
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Land Handover</label>
            <select
              name="landHandover"
              className="select select-bordered w-full"
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>

          <div>
            <label>Handover Date</label>
            <input
              type="date"
              name="handoverDate"
              className="input input-bordered w-full"
              onChange={handleChange}
            />
          </div>

          {form.landHandover === "Yes" && (
            <div className="col-span-2">
              <label>Handover Document</label>
              <input
                type="file"
                name="handoverDoc"
                className="file-input file-input-bordered w-full"
                onChange={handleChange}
              />
            </div>
          )}

          <div>
            <label>Project Closed</label>
            <select
              name="projectClosed"
              className="select select-bordered w-full"
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>

          <div>
            <label>Closure Date</label>
            <input
              type="date"
              name="closureDate"
              className="input input-bordered w-full"
              onChange={handleChange}
            />
          </div>

          {form.projectClosed === "Yes" && (
            <div className="col-span-2">
              <label>Closure Document</label>
              <input
                type="file"
                name="closureDoc"
                className="file-input file-input-bordered w-full"
                onChange={handleChange}
              />
            </div>
          )}
        </div>

        <div className="modal-action">
          <button className="btn btn-success btn-sm" onClick={handleSubmit}>
            Save
          </button>

          <button className="btn btn-sm" onClick={() => setShowModal(false)}>
            Cancel
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default LevelFourForm;
