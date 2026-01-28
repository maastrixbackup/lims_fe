import React, {useState} from 'react'

const LevelTwoForm = ({setRows, setShowModal }) => {
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
    setForm({});
  };

  return (
    <>
         <dialog className="modal modal-open">
          <div className="modal-box max-w-xl">

            <h3 className="font-bold mb-3">Add Stage I Approval</h3>

            <div className="grid grid-cols-2 gap-3">

              <input
                name="projectId"
                placeholder="Project ID"
                className="input input-bordered"
                onChange={handleChange}
              />

              <input
                name="stage1ApprovalNo"
                placeholder="Stage I Approval No"
                className="input input-bordered"
                onChange={handleChange}
              />

              <input
                type="date"
                name="approvalDate"
                className="input input-bordered"
                onChange={handleChange}
              />

              <input
                name="npvAmount"
                placeholder="NPV Amount"
                className="input input-bordered"
                onChange={handleChange}
              />

              <input
                name="caLand"
                placeholder="CA Land Area (ha)"
                className="input input-bordered"
                onChange={handleChange}
              />

              <input
                name="acaLand"
                placeholder="ACA Land Area (ha)"
                className="input input-bordered"
                onChange={handleChange}
              />

              <input
                name="stage2Status"
                placeholder="Stage 2 Status"
                className="input input-bordered col-span-2"
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
  )
}

export default LevelTwoForm