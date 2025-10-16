import React, { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { API_BASE_URL } from "../utils/config";

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
  });

  // ✅ track whether the form is loading initial khata data
  const initializing = useRef(false);

  // ✅ Load khata data when editing
  useEffect(() => {
    if (khata) {
      initializing.current = true; // prevent reset village during initial set
      setFormData({
        project_id: khata.project_id || "",
        village_id: khata.village_id || "",
        khata_no: khata.khata_no || khata.number || "",
      });
      // small delay before allowing normal change detection
      setTimeout(() => (initializing.current = false), 300);
    } else {
      setFormData({ project_id: "", village_id: "", khata_no: "" });
    }
  }, [khata]);

  // ✅ Reset village ONLY when user manually changes project (not during edit load)
  useEffect(() => {
    if (!initializing.current) {
      setFormData((prev) => ({ ...prev, village_id: "" }));
    }
  }, [formData.project_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "project_id" || name === "village_id"
          ? parseInt(value)
          : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let res, data;

      if (khata) {
        // ✅ Update existing Khata
        res = await fetch(`${API_BASE_URL}/khata/updateKhata/${khata.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        });
      } else {
        // ✅ Add new Khata
        res = await fetch(`${API_BASE_URL}/khata/addKhata`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        });
      }

      data = await res.json();
      console.log("Khata API response:", data);

      if (res.ok) {
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
          created_at:
            data.created_at || khata?.created_at || new Date().toISOString(),
        };

        setKhatas((prev) =>
          khata
            ? prev.map((k) => (k.id === khata.id ? updatedKhata : k))
            : [...prev, updatedKhata]
        );

        onClose();
      } else {
        alert(data.message || "Failed to save khata");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving khata");
    }
  };

  // ✅ Filter villages belonging to selected project
  const filteredVillages = formData.project_id
    ? villages.filter((v) => v.project_id === formData.project_id)
    : [];

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
