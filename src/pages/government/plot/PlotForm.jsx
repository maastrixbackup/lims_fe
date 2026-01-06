import React from "react";

const PlotForm = ({
  formData,
  setFormData,
  handleSubmit,
  closeModal,
  projectVillageKhataMap,
}) => {
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    if (e.target.name === "project") {
      setFormData((prev) => ({ ...prev, village: "", khataNo: "" }));
    }
    if (e.target.name === "village") {
      setFormData((prev) => ({ ...prev, khataNo: "" }));
    }
  };
  /* FILE UPLOAD HANDLER */
  const handleFileChange = (e) => {
    const { name, files } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: files[0] || null,
    }));
  };

  return (
    <dialog open className="modal modal-open">
      <div className="modal-box max-w-3xl">
        <h3 className="font-bold text-lg mb-2">
          {formData.id ? "Edit Plot" : "Add Plot"}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* SECTION 1 : Location Details */}
          <div className="card bg-base-100 shadow-md p-2">
            <h2 className="text-lg font-semibold mb-2">📍 Location Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Project</label>
                <select
                  name="project"
                  value={formData.project}
                  onChange={handleChange}
                  className="select select-bordered w-full"
                  required
                >
                  <option value="">Select Project</option>
                  {Object.keys(projectVillageKhataMap).map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label">Village</label>
                <select
                  name="village"
                  value={formData.village}
                  onChange={handleChange}
                  className="select select-bordered w-full"
                  disabled={!formData.project}
                >
                  <option value="">Select Village</option>
                  {formData.project &&
                    Object.keys(projectVillageKhataMap[formData.project]).map(
                      (v) => (
                        <option key={v} value={v}>
                          {v}
                        </option>
                      )
                    )}
                </select>
              </div>

              <div>
                <label className="label">Khata No</label>
                <select
                  name="khataNo"
                  value={formData.khataNo}
                  onChange={handleChange}
                  className="select select-bordered w-full"
                  disabled={!formData.village}
                >
                  <option value="">Select Khata</option>
                  {formData.project &&
                    formData.village &&
                    projectVillageKhataMap[formData.project][
                      formData.village
                    ].map((k, i) => (
                      <option key={i} value={k}>
                        {k}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="label">Tahashil</label>
                <input
                  className="input input-bordered w-full"
                  name="tahashil"
                  value={formData.tahashil}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                ["thanaNo", "Thana No"],
                ["riCircle", "RI Circle"],
                ["rorName", "Name of ROR"],
                ["plotNo", "Plot No"],
                ["kissam", "Kissam"],
              ].map(([name, label]) => (
                <div key={name}>
                  <label className="label">{label}</label>
                  <input
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                  />
                </div>
              ))}
            </div>
          </div>
          {/* <div className="card bg-base-100 shadow-md">
    <h2 className="text-lg font-semibold mb-2">🏡 Plot & Ownership Details</h2>

   
  </div> */}
          <div className="card bg-base-100 shadow-md">
            <h2 className="text-lg font-semibold mb-2">📐 Area Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                ["totalAreaAcres", "Total Area (Acres)"],
                ["proposedAreaAcres", "Proposed Area (Acres)"],
                ["totalAreaHectares", "Total Area (Hectares)"],
                ["proposedAreaHectares", "Proposed Area (Hectares)"],
                ["occupiedArea", "Occupied Area"],
              ].map(([name, label]) => (
                <div key={name}>
                  <label className="label">{label}</label>
                  <input
                    type="number"
                    step="0.01"
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 4 : Lease Case Details */}
          <div className="card bg-base-100 shadow-md">
            <h2 className="text-lg font-semibold mb-4">
              📄 Lease Case Details
            </h2>
            <div>
              <label className="label">Lease Case No</label>
              <input
                type="number"
                name="leaseCaseNo"
                value={formData.leaseCaseNo}
                onChange={handleChange}
                className="input input-bordered w-full"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
              <div className="col-span-2">
                <label className="label">Present Status</label>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-base-200 rounded-lg">
                  {[
                    "Lease Case to Sub-Collector",
                    "Lease Case to ADM (Rev Sec)",
                    "Demand Raised",
                    "Lease Sanctioned by Collector",
                  ].map((status) => (
                    <label key={status} className="label">
                      <input
                        type="radio"
                        name="presentStatus"
                        value={status}
                        checked={formData.presentStatus === status}
                        onChange={handleChange}
                        // className="mt-1"
                      />
                      <span className="text-sm leading-5 text-gray-800">
                        {status}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4">
              <label className="label">Case Details / Observation</label>
              <textarea
                className="textarea textarea-bordered w-full"
                name="caseDetails"
                value={formData.caseDetails}
                onChange={handleChange}
              />
            </div>

            <div className="mt-4">
              <label className="label">Action to be Taken</label>
              <textarea
                className="textarea textarea-bordered w-full"
                name="actionToBeTaken"
                value={formData.actionToBeTaken}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="card bg-base-100 shadow-md p-4">
            <h2 className="text-lg font-semibold mb-3">🔄 Workflow Tracking</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                ["uaIdcoToTahasildar", "UA / IDCO to Tahasildar"],
                ["proclamation", "Proclamation"],
                ["objectionReceived", "Objection Received"],
                ["modificationRevision", "Modification / Revision"],
              ].map(([name, label]) => (
                <div key={name}>
                  <label className="label">{label}</label>
                  <div className="flex gap-6">
                    {["Yes", "No"].map((v) => (
                      <label key={v} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={name}
                          value={v}
                          checked={formData[name] === v}
                          onChange={handleChange}
                        />
                        {v}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* STATUS + DOCUMENT FIELDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {[
                ["riReport", "RI Report", "riReportDoc"],
                ["treeEnumeration", "Tree Enumeration", "treeEnumerationDoc"],
                ["orderSheetPrep", "Order Sheet Prep", "orderSheetPrepDoc"],
              ].map(([name, label, docField]) => (
                <div key={name}>
                  <label className="label">{label}</label>

                  <select
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    className="select select-bordered w-full"
                  >
                    <option value="">Select</option>
                    <option>Not Started</option>
                    <option>In Progress</option>
                    <option>Complete</option>
                  </select>

                  {/* DOCUMENT UPLOAD – ONLY IF COMPLETE */}
                  {formData[name] === "Complete" && (
                    <div className="mt-2">
                      <label className="label text-sm text-gray-600">
                        Upload {label} Document
                      </label>
                      <input
                        type="file"
                        name={docField}
                        onChange={handleFileChange}
                        className="file-input file-input-bordered w-full"
                        accept=".pdf,.jpg,.png"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* LEASE DOCUMENTS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {[
                ["leaseToIdco", "Lease to IDCO", "leaseToIdcoDoc"],
                ["leaseToUa", "Lease to UA", "leaseToUaDoc"],
              ].map(([name, label, docField]) => (
                <div key={name}>
                  <label className="label">{label}</label>

                  <div className="flex gap-6">
                    {["Yes", "No"].map((v) => (
                      <label key={v} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={name}
                          value={v}
                          checked={formData[name] === v}
                          onChange={handleChange}
                        />
                        {v}
                      </label>
                    ))}
                  </div>

                  {/* DOCUMENT UPLOAD – ONLY IF YES */}
                  {formData[name] === "Yes" && (
                    <div className="mt-2">
                      <label className="label text-sm text-gray-600">
                        Attach Lease Case Deed
                      </label>
                      <input
                        type="file"
                        name={docField}
                        onChange={handleFileChange}
                        className="file-input file-input-bordered w-full"
                        accept=".pdf"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="card bg-base-100 shadow-md">
            <h2 className="text-lg font-semibold mb-2">📝 Remarks</h2>

            <textarea
              className="textarea textarea-bordered w-full"
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
            />
          </div>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={closeModal}
              className="btn btn-ghost"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

export default PlotForm;
