import React, { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { API_BASE_URL } from "../../utils/config";

const KhataFormModal = ({
  khata,
  onClose,
  setKhatas,
  token,
  projects,
  villages,
}) => {
  const [formData, setFormData] = useState({
    project_id: "",
    village_id: "",
    khata_no: "",
    type: "",
  });

  const initializing = useRef(false);

  // Initialize form when khata is provided (Edit mode)
  useEffect(() => {
    if (khata) {
      initializing.current = true;
      setFormData({
        project_id: khata.project_id || "",
        village_id: khata.village_id || "",
        khata_no: khata.khata_no || khata.number || "",
        type: khata.type?.toString() || "",
      });
      setTimeout(() => (initializing.current = false), 300);
    } else {
      setFormData({ project_id: "", village_id: "", khata_no: "", type: "" });
    }
  }, [khata]);

  // Reset village when project changes (except during initialization)
  useEffect(() => {
    if (!initializing.current) {
      setFormData((prev) => ({ ...prev, village_id: "" }));
    }
  }, [formData.project_id]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "project_id" || name === "village_id" || name === "type"
          ? parseInt(value)
          : value,
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
    console.log("Khata API response:", data);

    if (!res.status==="201") {
      alert(data.message || "Failed to save khata");
      return;
    }

    const updatedKhata = {
      id: data.id || khata?.id,
      project_id: formData.project_id,
      village_id: formData.village_id,
      project_name:
        projects.find((p) => p.id === formData.project_id)?.project_name ||
        data.project_name,
      village_name:
        villages.find((v) => v.id === formData.village_id)?.village_name ||
        data.village_name,
      khata_no: formData.khata_no,
      type: formData.type,
      created_at:
        data.created_at || khata?.created_at || new Date().toISOString(),
    };

    // Update list
    setKhatas((prev) =>
      khata
        ? prev.map((k) => (k.id === khata.id ? updatedKhata : k))
        : [...prev, updatedKhata]
    );


    const toast = document.createElement("div");
    toast.textContent = khata ? "Khata updated successfully!" : "Khata added successfully!";
    toast.className =
      "fixed top-5 right-5 bg-green-600 text-white px-4 py-2 rounded-md shadow-md animate-fade-in";
    document.body.appendChild(toast);

    // Auto-remove toast & close modal
    setTimeout(() => {
      toast.classList.add("opacity-0", "transition-opacity", "duration-500");
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 500);
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
          {/* Project */}
          <div>
            <label className="block text-sm font-medium mb-1">Project</label>
            <select
              name="project_id"
              value={formData.project_id || ""}
              onChange={handleChange}
              className="select select-bordered w-full"
              required
            >
              <option value="">Select Project</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.project_name || p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Village */}
          <div>
            <label className="block text-sm font-medium mb-1">Village</label>
            <select
              name="village_id"
              value={formData.village_id || ""}
              onChange={handleChange}
              className="select select-bordered w-full"
              required
              disabled={!formData.project_id}
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
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium mb-1">Type</label>
            <select
              name="type"
              value={formData.type || ""}
              onChange={handleChange}
              className="select select-bordered w-full"
              required
            >
              <option value="">Select Type</option>
              <option value={1}>Pvt Land</option>
              <option value={2}>Govt Land</option>
              <option value={3}>Forest Land</option>
            </select>
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
