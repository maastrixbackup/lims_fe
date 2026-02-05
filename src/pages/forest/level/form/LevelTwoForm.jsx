import React, { useState } from "react";

const LevelTwoForm = ({ setRows, setShowModal, rows }) => {
  const [form, setForm] = useState({
    projectId: "",
    stage1Approval: "",
    stage1Doc: null,
    approvalDate: "",
    npvStatus: "",
    npvDoc: null,
    caLand: "",
    acaLand: "",
    stage2Status: "",
    others: "",
    others_docs: null,
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
      stage1Approval: "",
      stage1Doc: null,
      approvalDate: "",
      npvStatus: "",
      npvDoc: null,
      caLand: "",
      acaLand: "",
      stage2Status: "",
      others: "",
      others_docs: null,
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
            <label className="block mb-1">Stage I Approval</label>
            <div className="flex gap-4 mt-2">
              {["Yes", "No"].map((v) => (
                <label key={v} className="flex gap-2 items-center">
                  <input
                    type="radio"
                    name="stage1Approval"
                    value={v}
                    onChange={handleChange}
                  />
                  {v}
                </label>
              ))}
            </div>
          </div>

          {form.stage1Approval === "Yes" && (
            <div className="col-span-2">
              <label>Stage I Approval Document</label>
              <input
                type="file"
                name="stage1Doc"
                className="file-input file-input-bordered w-full"
                onChange={handleChange}
              />
            </div>
          )}

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
            <label className="block mb-1">NPV</label>
            <div className="flex gap-4 mt-2">
              {["Paid", "Not Paid"].map((v) => (
                <label key={v} className="flex gap-2 items-center">
                  <input
                    type="radio"
                    name="npvStatus"
                    value={v}
                    onChange={handleChange}
                  />
                  {v}
                </label>
              ))}
            </div>
          </div>

          {form.npvStatus === "Paid" && (
            <div className="col-span-2">
              <label>NPV Receipt Upload</label>
              <input
                type="file"
                name="npvDoc"
                className="file-input file-input-bordered w-full"
                onChange={handleChange}
              />
            </div>
          )}

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
          <div className="col-span-2">
            <label className="block mb-1">Others / Miscellaneous</label>

            <div className="flex gap-4 mt-2">
              {["Yes", "No"].map((v) => (
                <label key={v} className="flex gap-2 items-center">
                  <input
                    type="radio"
                    name="others"
                    value={v}
                    onChange={handleChange}
                  />
                  {v}
                </label>
              ))}
            </div>
            {form.others === "Yes" && (
              <div className="mt-3">
                <label>Others Document</label>
                <input
                  type="file"
                  name="others_docs"
                  className="file-input file-input-bordered w-full"
                  onChange={handleChange}
                />
              </div>
            )}
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
