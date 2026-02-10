import React, { useState } from "react";

const LevelFourForm = ({ setShowModal, setRows }) => {
  const [formData, setFormData] = useState({
    projectId: "",

    finalApprovalNoYes: "",
    finalApprovalDoc: null,

    finalApprovalDateYes: "",
    finalApprovalDateDoc: null,

    divertedAreaYes: "",
    divertedAreaDoc: null,

    landHandover: "",
    handoverDoc: null,

    handoverDateYes: "",
    handoverDateDoc: null,

    projectClosed: "",
    closureDate: "",
    closureDoc: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = () => {
    setRows((prevRows) => [...prevRows, formData]);
    setShowModal(false);
  };

  const RadioBlock = ({ label, radioName, docName }) => (
    <div className="col-span-2">
      <label className="font-medium">{label}</label>

      <div className="flex gap-6 mt-1">
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name={radioName}
            value="Yes"
            checked={formData[radioName] === "Yes"}
            onChange={handleChange}
          />
          Yes
        </label>

        <label className="flex items-center gap-2">
          <input
            type="radio"
            name={radioName}
            value="No"
            checked={formData[radioName] === "No"}
            onChange={handleChange}
          />
          No
        </label>
      </div>

      {formData[radioName] === "Yes" && docName && (
        <input
          type="file"
          name={docName}
          className="file-input file-input-bordered w-full mt-2"
          onChange={handleChange}
        />
      )}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      {/* Modal removed — form stays exactly same */}

      <h3 className="font-bold text-lg mb-6">Level 4 Clearance</h3>

      <div >
        <div className="col-span-2 mb-4">
          <label>Project ID</label>
          <input
            name="projectId"
            className="input input-bordered w-full"
            onChange={handleChange}
            value={formData.projectId}
          />
        </div>

        <div className="grid grid-cols-2 gap-4 p-2">
          <div>
            <RadioBlock
              label="Final Approval No"
              radioName="finalApprovalNoYes"
              docName="finalApprovalDoc"
            />
          </div>

          <div>
            <RadioBlock
              label="Final Approval Date"
              radioName="finalApprovalDateYes"
              docName="finalApprovalDateDoc"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 p-2">
          <div>
            <RadioBlock
              label="Diverted Area"
              radioName="divertedAreaYes"
              docName="divertedAreaDoc"
            />
          </div>

          <div>
            <RadioBlock
              label="Land Handover Done"
              radioName="landHandover"
              docName="handoverDoc"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 p-2">
          <RadioBlock
            label="Handover Date"
            radioName="handoverDateYes"
            docName="handoverDateDoc"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 p-2">
          <div>
            <label>Project Closed</label>
            <input
              name="projectClosed"
              className="input input-bordered w-full"
              onChange={handleChange}
              value={formData.projectClosed}
            />
          </div>

          <div>
            <label>Closure Date</label>
            <input
              type="date"
              name="closureDate"
              className="input input-bordered w-full"
              onChange={handleChange}
              value={formData.closureDate}
            />
          </div>
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
  );
};

export default LevelFourForm;
