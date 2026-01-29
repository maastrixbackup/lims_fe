import React, { useState } from "react";

const LevelTwoForm = ({ setRows, setShowModal, rows }) => {
  const [form, setForm] = useState({
    projectId: "",
    stage1ApprovalNo: "",
    approvalDate: "",
    npvAmount: "",
    caLand: "",
    acaLand: "",
    stage2Status: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    setRows([...rows, form]);
    setShowModal(false);

    setForm({
      projectId: "",
      stage1ApprovalNo: "",
      approvalDate: "",
      npvAmount: "",
      caLand: "",
      acaLand: "",
      stage2Status: "",
    });
  };

  return (
    <dialog className="modal modal-open">
      <div className="modal-box max-w-xl">

        <h3 className="font-bold mb-4">Add Stage I Approval</h3>

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
            <label>Stage I Approval No</label>
            <input
              name="stage1ApprovalNo"
              className="input input-bordered w-full"
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Approval Date</label>
            <input
              type="date"
              name="approvalDate"
              className="input input-bordered w-full"
              onChange={handleChange}
            />
          </div>

          <div>
            <label>NPV Amount</label>
            <input
              name="npvAmount"
              className="input input-bordered w-full"
              onChange={handleChange}
            />
          </div>

          <div>
            <label>CA Land Area (ha)</label>
            <input
              name="caLand"
              className="input input-bordered w-full"
              onChange={handleChange}
            />
          </div>

          <div>
            <label>ACA Land Area (ha)</label>
            <input
              name="acaLand"
              className="input input-bordered w-full"
              onChange={handleChange}
            />
          </div>

          <div className="col-span-2">
            <label>Stage II Status</label>
            <input
              name="stage2Status"
              className="input input-bordered w-full"
              onChange={handleChange}
            />
          </div>

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

export default LevelTwoForm;
