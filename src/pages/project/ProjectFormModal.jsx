import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

const reverseStatusMap = {
  0: "Pending",
  1: "Active",
  2: "Closed",
};

// backend number → UI value
const landTypeMap = {
  1: "private",
  2: "government",
  3: "forest",
};

// UI value → backend number
const landTypeReverseMap = {
  private: 1,
  government: 2,
  forest: 3,
};

const ProjectFormModal = ({ project, onClose, onSave, loading }) => {
  const [formData, setFormData] = useState({
    name: "",
    client_code: "",
    status: "Active",
    project_location: "",
    type: "private",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.project_name || "",
        client_code: project.client_code || "",
        status: reverseStatusMap[project.status] || "Active",
        project_location: project.project_location || "",
        type: landTypeMap[project.type] || "private",
      });
    }
  }, [project]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Project name is required";
    if (!formData.client_code.trim())
      newErrors.client_code = "Client code is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    await onSave(
      {
        ...formData,
        type: landTypeReverseMap[formData.type], // ✅ convert ONCE
      },
      project
    );
  };

  return (
    <dialog open className="modal modal-open">
      <div className="modal-box relative">
        <button
          className="absolute right-3 top-3"
          onClick={onClose}
        >
          <X size={20} />
        </button>

        <h3 className="font-bold text-lg mb-4">
          {project ? "Edit Project" : "Add Project"}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Project Name"
            className="input input-bordered w-full"
          />

          <input
            name="project_location"
            value={formData.project_location}
            onChange={handleChange}
            placeholder="Project Location"
            className="input input-bordered w-full"
          />

          <input
            name="client_code"
            value={formData.client_code}
            onChange={handleChange}
            placeholder="Client Code"
            className="input input-bordered w-full"
          />

          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="select select-bordered w-full"
          >
            <option>Active</option>
            <option>Pending</option>
            <option>Closed</option>
          </select>

          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="select select-bordered w-full"
          >
            <option value="private">Private Land</option>
            <option value="government">Government Land</option>
            <option value="forest">Forest Land</option>
          </select>

          <div className="modal-action">
            <button type="button" className="btn" onClick={onClose}>
              Cancel
            </button>
            <button className="btn btn-primary" disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

export default ProjectFormModal;
