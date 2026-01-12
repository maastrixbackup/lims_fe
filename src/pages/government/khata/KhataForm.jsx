import React, { useEffect, useState } from "react";

const emptyForm = {
  khata_no: "",
  kissam: "",
  villae_name: "",
  plot_no: "",
  lease_case_no: "",
  present_status: "",
  case_details: "",
  plot_count: "",
  created: new Date().toISOString().split("T")[0],
};

const KhataForm = ({ initialData, onCancel, editingKhata, closeModal }) => {
  const [formData, setFormData] = useState(emptyForm);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...emptyForm,
        ...initialData,
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({
      ...p,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setShowSuccess(true);
    setFormData(emptyForm);
  };

  return (
    <>
      <dialog open className="modal modal-open">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">
            {editingKhata ? "Edit Khata" : "Add Khata"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Khata No */}
            <div>
              <label className="font-semibold text-sm mb-1 block">
                Khata No.
              </label>
              <input
                name="khata_no"
                value={formData.khata_no}
                onChange={handleChange}
                className="input input-bordered w-full"
              />
            </div>

            {/* Kissam */}
            <div>
              <label className="font-semibold text-sm mb-1 block">Kissam</label>
              <input
                name="kissam"
                value={formData.kissam}
                onChange={handleChange}
                className="input input-bordered w-full"
              />
            </div>

            {/* Village */}
            <div>
              <label className="font-semibold text-sm mb-1 block">
                Village
              </label>
              <input
                name="villae_name"
                value={formData.villae_name}
                onChange={handleChange}
                className="input input-bordered w-full"
              />
            </div>

            {/* Plot No */}
            <div>
              <label className="font-semibold text-sm mb-1 block">
                Plot No
              </label>
              <input
                name="plot_no"
                value={formData.plot_no}
                onChange={handleChange}
                className="input input-bordered w-full"
              />
            </div>

            {/* Lease Case No */}
            <div>
              <label className="font-semibold text-sm mb-1 block">
                Lease Case No
              </label>
              <input
                name="lease_case_no"
                value={formData.lease_case_no}
                onChange={handleChange}
                className="input input-bordered w-full"
              />
            </div>

            <div className="col-span-2">
              <label className="font-semibold text-sm mb-1 block">
                Present Status
              </label>

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
                      name="present_status"
                      value={status}
                      checked={formData.present_status === status}
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
            <div>
              <label className="font-semibold text-sm mb-1 block">
                Case Details
              </label>
              <input
                name="case_details"
                value={formData.case_details}
                onChange={handleChange}
                className="input input-bordered w-full"
              />
            </div>
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={onCancel}
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
               {showSuccess && (
            <dialog className="modal modal-open">
              <div className="modal-box">
                <h3 className="font-bold text-lg text-green-600">✅ Success</h3>

                <p className="py-4">Khata details saved successfully.</p>

                <div className="modal-action">
                  <button
                    className="btn btn-success"
                    onClick={() => {
                      setShowSuccess(false);
                      onCancel?.(); 
                    }}
                  >
                    OK
                  </button>
                </div>
              </div>
            </dialog>
          )}
      </dialog>
    </>
  );
};

export default KhataForm;
