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
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">

{/* Project */}
<div>
  <label className="label-text font-medium">Project ID</label>
  <input
    name="projectId"
    className="input input-bordered w-full"
    value={form.projectId}
    onChange={handleChange}
  />
</div>




<div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
<div>
  <label className="label-text font-medium">CA Land Area</label>
  <input
    name="caLand"
    className="input input-bordered w-full"
    value={form.caLand}
    onChange={handleChange}
  />
</div>

<div>
  <label className="label-text font-medium">ACA Land Area</label>
  <input
    name="acaLand"
    className="input input-bordered w-full"
    value={form.acaLand}
    onChange={handleChange}
  />
</div>
</div>
{/* Stage II */}
<div className="md:col-span-2">
  <label className="label-text font-medium">Stage II Status</label>
  <input
    name="stage2Status"
    className="input input-bordered w-full"
    value={form.stage2Status}
    onChange={handleChange}
  />
</div>


<div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">

  {/* NPV Amount */}
  <div>
    <label className="label-text font-medium">NPV Amount</label>
    <input
      type="number"
      name="npvAmount"
      className="input input-bordered w-full"
      value={form.npvAmount}
      onChange={handleChange}
    />
  </div>

  {/* NPV Status */}
  <div>
    <label className="label-text font-medium block">NPV Status</label>
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

  {/* NPV Upload */}
  {form.npvStatus === "Paid" ? (
    <div>
      <label className="label-text font-medium">NPV Receipt</label>
      <input
        type="file"
        name="npvDoc"
        className="file-input file-input-bordered w-full"
        onChange={handleChange}
      />
    </div>
  ) : (
    <div />  
  )}

</div>
<div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
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
  <>
    <div>
      <label className="label-text font-medium">Approval Date</label>
      <input
        type="date"
        name="approvalDate"
        className="input input-bordered w-full"
        value={form.approvalDate}
        onChange={handleChange}
      />
    </div>

    <div>
      <label className="label-text font-medium">Stage I Document</label>
      <input
        type="file"
        name="stage1Doc"
        className="file-input file-input-bordered w-full"
        onChange={handleChange}
      />
    </div>
  </>
)}
</div>
<div className="md:col-span-2">
  <label className="label-text font-medium block">Others</label>

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
    <input
      type="file"
      name="others_docs"
      className="file-input file-input-bordered w-full mt-3"
      onChange={handleChange}
    />
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
