import React, { useState } from "react";

const LevelZeroForm = ({ setRows, rows, setShowModal }) => {
  const [form, setForm] = useState({
    projectId: "",
    stageStatus: "",
    landSchedule: "",
    forestLand: "",
    gis: "",
    dgps: "",
    verification: "",
    remarks: "",
    completionDate: "",
    others:"",
    others_docs:""
  });

  const [files, setFiles] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFiles({ ...files, [e.target.name]: e.target.files[0] });
  };

  const handleSubmit = () => {
    setRows([...rows, { ...form, documents: files }]);
    setShowModal(false);
  };

  const yesNoFields = [
    { key: "landSchedule", label: "Land Schedule Uploaded" },
    { key: "forestLand", label: "Forest Land Identified" },
    { key: "gis", label: "Preliminary GIS Uploaded" },
    { key: "dgps", label: "DGPS Planned" },
    { key: "verification", label: "Internal Verification" },
    { key: "others", label: "Others/ Mislaneous" },
  ];

  return (
    <dialog className="modal modal-open">
      <div className="modal-box max-w-2xl">
        <h3 className="font-bold text-lg mb-4">Add Level-0 Details</h3>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="label">
              <span className="label-text">Project ID</span>
            </label>
            <input
              className="input input-bordered input-sm w-full"
              name="projectId"
              value={form.projectId}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="label">
              <span className="label-text">Stage-0 Status</span>
            </label>
            <input
              className="input input-bordered input-sm w-full"
              name="stageStatus"
              value={form.stageStatus}
              onChange={handleChange}
            />
          </div>
        </div>
       <div className="grid grid-cols-2 gap-4 mb-6">
          {yesNoFields.map(({ key, label }) => (
            <div key={key}>
              <label className="label font-medium">
                <span className="label-text">{label}</span>
              </label>
              <div className="flex items-center gap-6 mb-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name={key}
                    value="Yes"
                    checked={form[key] === "Yes"}
                    onChange={handleChange}
                    // className="radio radio-xs"
                  />
                  <span>Yes</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name={key}
                    value="No"
                    checked={form[key] === "No"}
                    onChange={handleChange}
                    // className="radio radio-xs"
                  />
                  <span>No</span>
                </label>
              </div>
              {form[key] === "Yes" && (
                <input
                  type="file"
                  name={`${key}Doc`}
                  className="file-input file-input-bordered file-input-sm w-full"
                  onChange={handleFileChange}
                />
              )}
            </div>
          ))}
        </div>
        <div className="mt-6">
          <label className="label">
            <span className="label-text">Remarks</span>
          </label>
          <textarea
            className="textarea textarea-bordered textarea-sm w-full"
            name="remarks"
            value={form.remarks}
            onChange={handleChange}
          />
        </div>
        <div className="mt-4">
          <label className="label">
            <span className="label-text">Stage-0 Completion Date</span>
          </label>
          <input
            type="date"
            className="input input-bordered input-sm w-full"
            name="completionDate"
            value={form.completionDate}
            onChange={handleChange}
          />
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

export default LevelZeroForm;
