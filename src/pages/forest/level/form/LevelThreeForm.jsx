
import React, {useState} from 'react'

const LevelThreeForm = ({setRows, setShowModal}) => {
    
  const [form, setForm] = useState({
    projectId: "",
    complianceType: "",
    documentSubmitted: "",
    submissionDate: "",
    verifiedBy: "",
    verificationDate: "",
    complianceStatus: "",
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

            <h3 className="font-bold mb-3">Add Compliance</h3>

            <div className="grid grid-cols-2 gap-3">

              <input name="projectId" placeholder="Project ID" className="input input-bordered" onChange={handleChange} />
              <input name="complianceType" placeholder="Compliance Type" className="input input-bordered" onChange={handleChange} />
              <input name="documentSubmitted" placeholder="Document Submitted" className="input input-bordered" onChange={handleChange} />
              <input type="date" name="submissionDate" className="input input-bordered" onChange={handleChange} />
              <input name="verifiedBy" placeholder="Verified By" className="input input-bordered" onChange={handleChange} />
              <input type="date" name="verificationDate" className="input input-bordered" onChange={handleChange} />
              <input name="complianceStatus" placeholder="Compliance Status" className="input input-bordered col-span-2" onChange={handleChange} />

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

export default LevelThreeForm