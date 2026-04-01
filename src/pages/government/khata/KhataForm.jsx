import React, { useEffect, useState, useRef } from "react";
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
 kissam:"",
  village_id: "",
  plot_no: "",
  lease_case_no: "",
  present_status: "",
  case_details: "",
  name_of_ror: "",
  land_category:"",
};
const STATUS_MAP = {
  1: "Lease Case to Sub-Collector",
  2: "Lease Case to ADM (Rev Sec)",
  3: "Demand Raised",
  4: "Lease Sanctioned by Collector",
};

const STATUS_REVERSE_MAP = Object.fromEntries(
  Object.entries(STATUS_MAP).map(([k, v]) => [v, Number(k)]),
);

const KhataForm = ({ onCancel, editingKhata, fetchKhatas }) => {
  const token = useSelector((s) => s.auth.userToken);
  const projects = useSelector((s) => s.list.projects || []);
  const selectedProjectId = useSelector((s) => s.selectedProject.project?.id);
  // console.log("selectedProjectId", selectedProjectId);
  const typeParam = useLandTypeParam();
  const { modal, showSuccess, showError, closeModal } = useSuccessMessage();

  const [formData, setFormData] = useState(EMPTY_FORM);
  const [villages, setVillages] = useState([]);
  const initializing = useRef(false);

  useEffect(() => {
    initializing.current = true;

    if (editingKhata) {
      setFormData({
        project_id: editingKhata.project_id || "",
        khata_no: editingKhata.khata_no || "", 
        kissam:editingKhata.kissam || "",
        village_id: editingKhata.village_id || "",
        plot_no: editingKhata.plot_no || "",
        lease_case_no: editingKhata.lease_case_no || "",
        present_status: STATUS_REVERSE_MAP[editingKhata.present_status] || 0,
        case_details: editingKhata.case_details || "",
        village: editingKhata.village_name || "",
        name_of_ror: editingKhata.name_of_ror || "",
        land_category:editingKhata.land_category || ""
      });
    } else {
      setFormData({
        ...EMPTY_FORM,
        project_id: selectedProjectId || "",
      });
    }

    setTimeout(() => {
      initializing.current = false;
    }, 0);
  }, [editingKhata, selectedProjectId]);

  useEffect(() => {
    if (!initializing.current && !editingKhata) {
      setFormData((prev) => ({
        ...prev,
        village_id: "",
      }));
    }
  }, [formData.project_id, editingKhata]);

  useEffect(() => {
    if (!formData.project_id || !typeParam) {
      setVillages([]);
      return;
    }

    const fetchVillages = async () => {
      try {
        const res = await apiClient(
          `/village/villageList?project_id=${formData.project_id}&type=${typeParam}`,
        );
        if (res?.success) {
          setVillages(res.villages || []);
        }
      } catch (err) {
        console.error("Village fetch failed", err);
      }
    };

    fetchVillages();
  }, [formData.project_id, typeParam]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.project_id) {
      showError("Project is required");
      return;
    }

    const payload = {
      project_id: formData.project_id,
      type: typeParam,
      khata_no: formData.khata_no,
      village_id: formData.village_id,
      village_name: formData.village_name,
      kissam: formData.kissam,
      plot_no: formData.plot_no,
      lease_case_no: formData.lease_case_no,
      present_status: formData.present_status,
      case_details: formData.case_details,
      name_of_ror: formData.name_of_ror,
      land_category:formData.land_category
    };
    console.log("payload..........", payload);
    try {
      const url = editingKhata
        ? `${API_BASE_URL}/govtkhata/updateGovtKhata/${editingKhata.id}`
        : `${API_BASE_URL}/govtkhata/addGovtKhata`;

      const method = editingKhata ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const res = await response.json();

      if (!response.ok || !res.success) {
        throw new Error(res.message || "Operation failed");
      }

      showSuccess(
        editingKhata
          ? "Khata updated successfully"
          : "Khata added successfully",
      );

      fetchKhatas();

      setTimeout(() => {
        onCancel();
        if (!editingKhata) setFormData(EMPTY_FORM);
      }, 800);
    } catch (err) {
      showError(err.message || "Something went wrong");
    }
  };
  return (
    <>
      <dialog open className="modal modal-open">
        <div
          className="modal-box max-w-2xl max-h-130 relative"
          style={{ scrollbarWidth: "thin" }}
        >
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
                  { id: 1, label: "Lease Case to Sub-Collector" },
                  { id: 2, label: "Lease Case to ADM (Rev Sec)" },
                  { id: 3, label: "Demand Raised" },
                  { id: 4, label: "Lease Sanctioned by Collector" },
                ].map((status) => (
                  <label key={status.id} className="flex gap-2 items-center">
                    <input
                      type="radio"
                      name="present_status"
                      value={status.id}
                      checked={Number(formData.present_status) === status.id}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          present_status: Number(e.target.value),
                        }))
                      }
                    />
                    <span className="text-sm">{status.label}</span>
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
            <div>
              <label className="font-semibold text-sm block mb-1">
                ROR Name
              </label>
              <input
                name="name_of_ror"
                value={formData.name_of_ror}
                onChange={handleChange}
                className="input input-bordered w-full"
              />
            </div>
             <div>
              <label className="block text-sm font-medium ">
                Category of Land
              </label>
              <input
                type="text"
                name="land_category"
                value={formData.land_category}
                onChange={handleChange}
                className="input input-bordered w-full"
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-4 pt-2">
              <button
                type="button"
                onClick={onCancel}
                className="btn btn-error text-white"
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {" "}
                {editingKhata ? "Update" : "Save"}{" "}
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
