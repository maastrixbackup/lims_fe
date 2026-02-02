import React, { useState } from "react";

const LevelThreeForm = ({ setRows, setShowModal, rows }) => {
  const [form, setForm] = useState({
    project_id: "",
    compliance_type: "",
    document_submitted: "",
    document_file: null,
    submission_date: "",
    verified_by: "",
    verification_date: "",
    compliance_status: "",
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
      project_id: "",
      compliance_type: "",
      document_submitted: "",
      document_file: null,
      submission_date: "",
      verified_by: "",
      verification_date: "",
      compliance_status: "",
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
              name="project_id"
              className="input input-bordered w-full"
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Compliance Type</label>
            <input
              name="compliance_type"
              className="input input-bordered w-full"
              onChange={handleChange}
            />
          </div>

          {/* Document Submitted */}
          <div>
            <label className="block mb-1">Document Submitted</label>

            <div className="flex gap-4 mt-2">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="document_submitted"
                  value="Yes"
                 
                  onChange={handleChange}
                />
                Yes
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="document_submitted"
                  value="No"
                
                  onChange={handleChange}
                />
                No
              </label>
            </div>
          </div>

          {/* Upload file only if Yes */}
          {form.document_submitted === "Yes" && (
            <div className="col-span-2">
              <label>Compliance Document Upload</label>
              <input
                type="file"
                name="document_file"
                className="file-input file-input-bordered w-full"
                onChange={handleChange}
              />
            </div>
          )}

          <div>
            <label>Submission Date</label>
            <input
              type="date"
              name="submission_date"
              className="input input-bordered w-full"
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Verified By</label>
            <input
              name="verified_by"
              className="input input-bordered w-full"
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Verification Date</label>
            <input
              type="date"
              name="verification_date"
              className="input input-bordered w-full"
              onChange={handleChange}
            />
          </div>

          <div className="col-span-2">
            <label>Compliance Status</label>
            <input
              name="compliance_status"
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
