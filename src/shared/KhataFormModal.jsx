// src/components/Khata/KhataFormModal.jsx
import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

const KhataFormModal = ({ khata, onClose, setKhatas }) => {
  const projects = [{ id: 1, name: "GMDC - Baitarani-West Coal Block" }];
  const villages = [
    { id: 1, name: "Chhendipada Jangal", project: "GMDC - Baitarani-West Coal Block" },
    { id: 2, name: "Handigora", project: "GMDC - Baitarani-West Coal Block" },
  ];

  const [formData, setFormData] = useState({
    project: "",
    village: "",
    number: "",
    created: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    if (khata) setFormData(khata);
  }, [khata]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setKhatas((prev) => {
      if (khata) {
        return prev.map((k) =>
          k.id === khata.id ? { ...formData, id: khata.id } : k
        );
      }
      return [...prev, { ...formData, id: prev.length + 1 }];
    });
    onClose();
  };

  return (
    <dialog open className="modal modal-open">
      <div className="modal-box">
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
              name="project"
              value={formData.project}
              onChange={handleChange}
              className="select select-bordered w-full"
              required
            >
              <option value="">Select Project</option>
              {projects.map((p) => (
                <option key={p.id} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Village */}
          <div>
            <label className="block text-sm font-medium mb-1">Village</label>
            <select
              name="village"
              value={formData.village}
              onChange={handleChange}
              className="select select-bordered w-full"
              required
            >
              <option value="">Select Village</option>
              {villages
                .filter((v) => v.project === formData.project)
                .map((v) => (
                  <option key={v.id} value={v.name}>
                    {v.name}
                  </option>
                ))}
            </select>
          </div>

          {/* Khata No */}
          <div>
            <label className="block text-sm font-medium mb-1">Khata No.</label>
            <input
              type="text"
              name="number"
              value={formData.number}
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
