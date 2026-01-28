import React, {useState} from "react";

const LevelZeroForm = ({ setRows, setShowModal }) => {
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
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    setRows([...rows, form]);
    setForm({});
    setShowModal(false);
  };
  return (
    <>
      <dialog className="modal modal-open">
        <div className="modal-box max-w-2xl">
          <h3 className="font-bold mb-3">Add Level-0 Details</h3>

          <div className="grid grid-cols-2 gap-3">
            <input
              className="input input-bordered"
              placeholder="Project ID"
              name="projectId"
              onChange={handleChange}
            />

            <input
              className="input input-bordered"
              placeholder="Stage Status"
              name="stageStatus"
              onChange={handleChange}
            />

            {["landSchedule", "forestLand", "gis", "dgps", "verification"].map(
              (f) => (
                <select
                  key={f}
                  name={f}
                  className="select select-bordered"
                  onChange={handleChange}
                >
                  <option value="">Select</option>
                  <option>Yes</option>
                  <option>No</option>
                </select>
              ),
            )}

            <textarea
              className="textarea textarea-bordered col-span-2"
              placeholder="Remarks"
              name="remarks"
              onChange={handleChange}
            />

            <input
              type="date"
              className="input input-bordered col-span-2"
              name="completionDate"
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
    </>
  );
};

export default LevelZeroForm;
