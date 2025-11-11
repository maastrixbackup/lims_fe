import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

const ProjectFormModal = ({ project, onClose, onSave, loading }) => {
  const [formData, setFormData] = useState({
    name: "",
    client_code: "",
    status: "Active",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || "",
        client_code: project.client_code || "",
        status: project.statusText || "Active",
      });
    } else {
      setFormData({
        name: "",
        client_code: "",
        status: "Active",
      });
    }
    setErrors({});
  }, [project]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear the error message when the user edits the field
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Project name validation
    if (!formData.name.trim()) {
      newErrors.name = "Project name is required.";
    } else if (formData.name.length < 3) {
      newErrors.name = "Project name must be at least 3 characters long.";
    }

    // Client code validation
    if (!formData.client_code.trim()) {
      newErrors.client_code = "Client code is required.";
    } else if (!/^[A-Za-z0-9_-]+$/.test(formData.client_code)) {
      newErrors.client_code =
        "Client code can only contain letters, numbers, underscores, and hyphens.";
    }

    // Status validation
    if (!["Active", "Pending", "Closed"].includes(formData.status)) {
      newErrors.status = "Invalid status selected.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    await onSave(formData, project);
  };

  return (
    <dialog open className="modal modal-open">
      <div className="modal-box relative">
        {/* Close Button */}
        <button
          type="button"
          className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <X size={20} />
        </button>

        <h3 className="font-bold text-lg mb-4">
          {project ? "Edit Project" : "Add Project"}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Project Name */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Project Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`input input-bordered w-full ${
                errors.name ? "input-error" : ""
              }`}
              // required
            />
            {errors.name && (
              <p className="text-error text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Client Code */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Client Code
            </label>
            <input
              type="text"
              name="client_code"
              value={formData.client_code}
              onChange={handleChange}
              className={`input input-bordered w-full ${
                errors.client_code ? "input-error" : ""
              }`}
              // required
            />
            {errors.client_code && (
              <p className="text-error text-sm mt-1">{errors.client_code}</p>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={`select select-bordered w-full ${
                errors.status ? "select-error" : ""
              }`}
            >
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Closed">Closed</option>
            </select>
            {errors.status && (
              <p className="text-error text-sm mt-1">{errors.status}</p>
            )}
          </div>

          {/* Actions */}
          <div className="modal-action">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
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

export default ProjectFormModal;
