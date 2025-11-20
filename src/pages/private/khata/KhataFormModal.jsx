import React, { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { API_BASE_URL } from "../../../utils/config";
import { useSelector } from "react-redux";
import { useLandTypeParam } from "../../../utils/landtypes";

const KhataFormModal = ({
  khata,
  onClose,
  token,
  villages,
  fetchKhatas,
}) => {

  const typeParam = useLandTypeParam();

  const typeLabel =
    typeParam === 2 ? "Govt Land" : typeParam === 3 ? "Forest Land" : "Pvt Land";

  const selectedProject = useSelector((s) => s.selectedProject.project);

  const [formData, setFormData] = useState({
    project_id: "",
    village_id: "",
    khata_no: "",
    type: typeParam,
  });

  const initializing = useRef(false);
  const userRole = useSelector((s) => s.auth.user?.role_name || "");
  const isRestricted = userRole === "Data Entry User";

  // ⭐ SET DEFAULT FORM DATA
  useEffect(() => {
    if (khata) {
      initializing.current = true;
      setFormData({
        project_id: khata.project_id,
        village_id: khata.village_id,
        khata_no: khata.khata_no || khata.number || "",
        type: khata.type || typeParam,
      });

      setTimeout(() => (initializing.current = false), 300);
    } else {
      setFormData({
        project_id: selectedProject?.id || "",
        village_id: "",
        khata_no: "",
        type: typeParam,
      });
    }
  }, [khata, typeParam, selectedProject]);

  // Reset village on project change (only when editing)
  useEffect(() => {
    if (!initializing.current) {
      setFormData((prev) => ({
        ...prev,
        village_id: "",
      }));
    }
  }, [formData.project_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "village_id" ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = khata ? "PUT" : "POST";
      const url = khata
        ? `${API_BASE_URL}/khata/updateKhata/${khata.id}`
        : `${API_BASE_URL}/khata/addKhata`;

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Failed to save khata");
        return;
      }

      await fetchKhatas();

      // Toast
      const toast = document.createElement("div");
      toast.textContent = khata
        ? "Khata updated successfully!"
        : "Khata added successfully!";
      toast.className =
        "fixed top-5 right-5 bg-green-600 text-white px-4 py-2 rounded-md shadow-md animate-fade-in";
      document.body.appendChild(toast);

      setTimeout(() => {
        toast.classList.add("opacity-0", "transition-opacity", "duration-500");
        setTimeout(() => toast.remove(), 500);
        onClose();
      }, 1000);
    } catch (err) {
      console.error(err);
      alert("Error saving khata");
    }
  };

  return (
    <dialog open className="modal modal-open">
      <div className="modal-box relative">
        <button
          type="button"
          className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <X size={20} />
        </button>

        <h3 className="font-bold text-lg mb-4">
          {khata ? "Edit Khata" : "Add Khata"}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* ⭐ PROJECT NAME (Read Only - Auto from Redux) */}
          <div>
            <label className="block text-sm font-medium mb-1">Project</label>
            <input
              type="text"
              className="input input-bordered w-full bg-gray-100 font-medium text-gray-700"
              value={
                selectedProject?.project_name ||
                selectedProject?.name ||
                "No Project Selected"
              }
              // disabled
            />

            {/* hidden actual project_id */}
            <input type="hidden" name="project_id" value={formData.project_id} />
          </div>

          {/* Village */}
          <div>
            <label className="block text-sm font-medium mb-1">Village</label>
            <select
              name="village_id"
              value={formData.village_id}
              onChange={handleChange}
              className="select select-bordered w-full"
              required
            >
              <option value="">Select Village</option>
              {villages.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.village_name}
                </option>
              ))}
            </select>
          </div>

          {/* Khata No */}
          <div>
            <label className="block text-sm font-medium mb-1">Khata No.</label>
            <input
              type="text"
              name="khata_no"
              value={formData.khata_no}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
              disabled={isRestricted}
            />
          </div>

          {/* Land Type */}
          <div>
            <label className="block text-sm font-medium mb-1">Land Type</label>
            <input
              type="text"
              className="input input-bordered w-full bg-gray-100"
              value={typeLabel}
              // disabled
            />
          </div>

          <div className="modal-action">
            <button type="submit" className="btn btn-primary">
              Save
            </button>
            <button type="button" className="btn" onClick={onClose}>
              Cancel
            </button>
          </div>

        </form>
      </div>
    </dialog>
  );
};

export default KhataFormModal;
