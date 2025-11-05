import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

const ProjectFormModal = ({ project, onClose, onSave, loading }) => {
  const [formData, setFormData] = useState({
    name: "",
    client_code:"Cli-1234",
    status: "Active",
  });

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || "",
        client_code:"",
        status: project.status || "Active",
      });
    } else {
      setFormData({ name: "", status: "Active" });
    }
  }, [project]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSave(formData);
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
              className="input input-bordered w-full"
              required
            />
          </div>
           <div>
            <label className="block text-sm font-medium mb-1">
             Client Code
            </label>
            <input
              type="text"
              name="name"
              value={formData.client_code}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="select select-bordered w-full"
            >
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Closed">Closed</option>
            </select>
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
