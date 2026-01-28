import React,{useState} from 'react'

const LevelFourForm = ({setRows, setShowModal}) => {
    const [form, setForm] = useState({
    projectId: "",
    finalApprovalNo: "",
    finalApprovalDate: "",
    divertedArea: "",
    landHandover: "",
    handoverDate: "",
    projectClosed: "",
    closureDate: "",
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

            <h3 className="font-bold mb-3">Add Stage II Clearance</h3>

            <div className="grid grid-cols-2 gap-3">

              <input name="projectId" placeholder="Project ID" className="input input-bordered" onChange={handleChange} />
              <input name="finalApprovalNo" placeholder="Final Approval No" className="input input-bordered" onChange={handleChange} />
              <input type="date" name="finalApprovalDate" className="input input-bordered" onChange={handleChange} />
              <input name="divertedArea" placeholder="Diverted Area (ha)" className="input input-bordered" onChange={handleChange} />
              <select name="landHandover" className="select select-bordered" onChange={handleChange}>
                <option>Land Handover</option>
                <option>Yes</option>
                <option>No</option>
              </select>
              <input type="date" name="handoverDate" className="input input-bordered" onChange={handleChange} />
              <select name="projectClosed" className="select select-bordered" onChange={handleChange}>
                <option>Project Closed</option>
                <option>Yes</option>
                <option>No</option>
              </select>
              <input type="date" name="closureDate" className="input input-bordered" onChange={handleChange} />

            </div>

            <div className="modal-action">
              <button className="btn btn-success btn-sm" onClick={handleSubmit}>Save</button>
              <button className="btn btn-sm" onClick={() => setShowModal(false)}>Cancel</button>
            </div>

          </div>
        </dialog>
    </>
  )
}

export default LevelFourForm