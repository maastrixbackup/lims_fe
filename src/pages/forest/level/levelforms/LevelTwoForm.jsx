import React, { useState } from "react";

const emptyForm = {
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
};

const LevelTwoForm = ({ setRows, rows }) => {
  const [form, setForm] = useState(emptyForm);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setForm({
      ...form,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setRows([...rows, form]);
    setForm(emptyForm);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">

      <h3 className="font-bold text-lg mb-6">Stage-I Approval / Level-2</h3>

      <div className="grid grid-cols-2 gap-4">

        {/* Project */}
        <div>
          <label className="label-text font-medium">Project ID</label>
          <input
            name="projectId"
            className="input input-bordered w-full"
            onChange={handleChange}
            value={form.projectId}
          />
        </div>

        {/* Stage I Approval */}
        <div>
          <label className="label-text font-medium block">Stage I Approval</label>
          <div className="flex gap-4 mt-2">
            {["Yes", "No"].map((v) => (
              <label key={v} className="flex gap-2 items-center">
                <input
                  type="radio"
                  name="stage1Approval"
                  value={v}
                  checked={form.stage1Approval === v}
                  onChange={handleChange}
                />
                {v}
              </label>
            ))}
          </div>
        </div>

        {form.stage1Approval === "Yes" && (
          <div className="col-span-2">
            <label className="label-text font-medium">
              Stage I Approval Document
            </label>
            <input
              type="file"
              name="stage1Doc"
              className="file-input file-input-bordered w-full"
              onChange={handleChange}
            />
          </div>
        )}

        {/* Approval Date */}
        <div>
          <label className="label-text font-medium">Approval Date</label>
          <input
            type="date"
            name="approvalDate"
            className="input input-bordered w-full"
            onChange={handleChange}
            value={form.approvalDate}
          />
        </div>

        {/* NPV */}
        <div>
          <label className="label-text font-medium block">NPV</label>
          <div className="flex gap-4 mt-2">
            {["Paid", "Not Paid"].map((v) => (
              <label key={v} className="flex gap-2 items-center">
                <input
                  type="radio"
                  name="npvStatus"
                  value={v}
                  checked={form.npvStatus === v}
                  onChange={handleChange}
                />
                {v}
              </label>
            ))}
          </div>
        </div>

        {form.npvStatus === "Paid" && (
          <div className="col-span-2">
            <label className="label-text font-medium">NPV Receipt</label>
            <input
              type="file"
              name="npvDoc"
              className="file-input file-input-bordered w-full"
              onChange={handleChange}
            />
          </div>
        )}

        {/* CA / ACA */}
        <div>
          <label className="label-text font-medium">CA Land Area (ha)</label>
          <input
            name="caLand"
            className="input input-bordered w-full"
            onChange={handleChange}
            value={form.caLand}
          />
        </div>

        <div>
          <label className="label-text font-medium">ACA Land Area (ha)</label>
          <input
            name="acaLand"
            className="input input-bordered w-full"
            onChange={handleChange}
            value={form.acaLand}
          />
        </div>

        {/* Stage II */}
        <div className="col-span-2">
          <label className="label-text font-medium">Stage II Status</label>
          <input
            name="stage2Status"
            className="input input-bordered w-full"
            onChange={handleChange}
            value={form.stage2Status}
          />
        </div>

        {/* Others */}
        <div className="col-span-2">
          <label className="label-text font-medium block">
            Others / Miscellaneous
          </label>

          <div className="flex gap-4 mt-2">
            {["Yes", "No"].map((v) => (
              <label key={v} className="flex gap-2 items-center">
                <input
                  type="radio"
                  name="others"
                  value={v}
                  checked={form.others === v}
                  onChange={handleChange}
                />
                {v}
              </label>
            ))}
          </div>

          {form.others === "Yes" && (
            <div className="mt-3">
              <label className="label-text font-medium">Others Document</label>
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

      <div className="flex justify-end mt-6">
        <button type="submit" className="btn btn-success btn-sm">
          Save Level-2
        </button>
      </div>

    </form>
  );
};

export default LevelTwoForm;
