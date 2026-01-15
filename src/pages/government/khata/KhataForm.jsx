import React, { useEffect, useState } from "react";
import SuccessMessage from "../../../shared/SuccessMessage";
import { useSuccessMessage } from "../../../hooks/useSuccessMessage";
import { apiClient } from "../../../utils/apiClient";
import { useLandTypeParam } from "../../../utils/landtypes";
import { useSelector } from "react-redux";
import { API_BASE_URL } from "../../../utils/config";
import { X } from "lucide-react";

const EMPTY_FORM = {
  project_id: "",
  khata_no: "",
  kissam: "",
  village_id: "",
  plot_no: "",
  lease_case_no: "",
  present_status: "",
  case_details: "",
};

const KhataForm = ({ onCancel, editingKhata }) => {
  const [villages, setVillages] = useState([]);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const token = useSelector((s) => s.auth.userToken);
  const { modal, showSuccess, showError, closeModal } = useSuccessMessage();

  const projects = useSelector((s) => s.list.projects || []);
  const selectedProjectId = useSelector((s) => s.selectedProject.project?.id);

  const typeParam = useLandTypeParam();

  /* ================= PREFILL PROJECT ID ================= */
  useEffect(() => {
    if (selectedProjectId) {
      setFormData((p) => ({
        ...p,
        project_id: selectedProjectId,
      }));
    }
  }, [selectedProjectId]);


  useEffect(() => {
    const fetchVillages = async () => {
      if (!formData.project_id || !typeParam) {
        setVillages([]);
        return;
      }

      try {
        const res = await apiClient(
          `/village/villageList?project_id=${formData.project_id}&type=${typeParam}`
        );

        if (res?.success) {
          setVillages(res.villages || []);
        }
      } catch (err) {
        console.error("Village fetch failed:", err);
      }
    };

    fetchVillages();
  }, [formData.project_id, typeParam]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!formData.project_id) {
    showError("Project ID is required");
    return;
  }

  try {
    const payload = {
      project_id: formData.project_id,
      type: typeParam,
      khata_no: formData.khata_no,
      village_id: formData.village_id,
      kissam_of_land: formData.kissam,
      plot_no: formData.plot_no,
      lease_case_no: formData.lease_case_no,
      present_status: formData.present_status,
      case_details: formData.case_details,
    };

    const response = await fetch(`${API_BASE_URL}/govtkhata/addGovtKhata`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const res = await response.json();

    if (!response.ok || !res.success) {
      throw new Error(res.message || "Failed to save khata");
    }


    showSuccess(res.message || "Document Uploaded Successfully");


    setFormData(EMPTY_FORM);
  } catch (err) {
    showError(err.message || "Something went wrong");
  }
};


  return (
    <>
      <dialog open className="modal modal-open">
        <div className="modal-box max-w-2xl">
           <button className="absolute right-3 top-3" onClick={onCancel}>
          <X size={20} />
        </button>
          <h3 className="font-bold text-lg mb-4">
            {editingKhata ? "Edit Khata" : "Add Khata"}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Project ID */}
            <div>
              <label className="label">Project</label>
              <select
                name="project_id"
                value={formData.project_id}
                onChange={handleChange}
                className="select select-bordered w-full"
              >
                <option value="">Select Project</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.project_name || p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Khata No */}
            <div>
              <label className="font-semibold text-sm block mb-1">
                Khata No
              </label>
              <input
                name="khata_no"
                value={formData.khata_no}
                onChange={handleChange}
                className="input input-bordered w-full"
                required
              />
            </div>

            {/* Kissam */}
            <div>
              <label className="font-semibold text-sm block mb-1">Kissam</label>
              <input
                name="kissam"
                value={formData.kissam}
                onChange={handleChange}
                className="input input-bordered w-full"
                required
              />
            </div>

            {/* Village */}
            <div>
              <label className="font-semibold text-sm block mb-1">
                Village
              </label>
              <select
                name="village_id"
                value={formData.village_id}
                onChange={handleChange}
                className="select select-bordered w-full"
              >
                <option value="">Select Village</option>
                {villages.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.village_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Plot No */}
            <div>
              <label className="font-semibold text-sm block mb-1">
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
              <label className="font-semibold text-sm block mb-1">
                Lease Case No
              </label>
              <input
                name="lease_case_no"
                value={formData.lease_case_no}
                onChange={handleChange}
                className="input input-bordered w-full"
              />
            </div>

            {/* Present Status */}
            <div>
              <label className="font-semibold text-sm block mb-2">
                Present Status
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 bg-base-200 p-3 rounded-lg">
                {[
                  "Lease Case to Sub-Collector",
                  "Lease Case to ADM (Rev Sec)",
                  "Demand Raised",
                  "Lease Sanctioned by Collector",
                ].map((status) => (
                  <label key={status} className="flex gap-2 items-center">
                    <input
                      type="radio"
                      name="present_status"
                      value={status}
                      checked={formData.present_status === status}
                      onChange={handleChange}
                    />
                    <span className="text-sm">{status}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Case Details */}
            <div>
              <label className="font-semibold text-sm block mb-1">
                Case Details
              </label>
              <input
                name="case_details"
                value={formData.case_details}
                onChange={handleChange}
                className="input input-bordered w-full"
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-4 pt-2">
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

        <SuccessMessage
          open={modal.open}
          type={modal.type}
          message={modal.message}
          onClose={closeModal}
        />
      </dialog>
    </>
  );
};

export default KhataForm;
