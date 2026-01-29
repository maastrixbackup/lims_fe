import React, { useState } from "react";

const LevelThreeForm = ({ setRows, setShowModal, rows }) => {
  const [form, setForm] = useState({
    projectId: "",
    complianceType: "",
    documentSubmitted: "",
    submissionDate: "",
    verifiedBy: "",
    verificationDate: "",
    complianceStatus: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    setRows([...rows, form]);
    setShowModal(false);

    setForm({
      projectId: "",
      complianceType: "",
      documentSubmitted: "",
      submissionDate: "",
      verifiedBy: "",
      verificationDate: "",
      complianceStatus: "",
    });
  };

  return (
    <dialog className="modal modal-open">
      <div className="modal-box max-w-xl">

        <h3 className="font-bold mb-4">Add Compliance</h3>

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
            <label>Compliance Type</label>
            <input
              name="complianceType"
              className="input input-bordered w-full"
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Document Submitted</label>
            <input
              name="documentSubmitted"
              className="input input-bordered w-full"
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Submission Date</label>
            <input
              type="date"
              name="submissionDate"
              className="input input-bordered w-full"
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Verified By</label>
            <input
              name="verifiedBy"
              className="input input-bordered w-full"
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Verification Date</label>
            <input
              type="date"
              name="verificationDate"
              className="input input-bordered w-full"
              onChange={handleChange}
            />
          </div>

          <div className="col-span-2">
            <label>Compliance Status</label>
            <input
              name="complianceStatus"
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

export default LevelThreeForm;
