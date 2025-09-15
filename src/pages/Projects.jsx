import React, { useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import { Pencil, Trash2 } from "lucide-react";

const Projects = () => {
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: "GMDC - Baitarani-West Coal Block",
      status: "Active",
      created: "2025-01-12",
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null); // project to delete
  const [formData, setFormData] = useState({
    name: "",
    status: "Active",
    created: new Date().toISOString().split("T")[0],
  });

  // Open modal for add/edit
  const openModal = (project = null) => {
    if (project) {
      setEditingProject(project);
      setFormData(project);
    } else {
      setEditingProject(null);
      setFormData({
        name: "",
        status: "Active",
        created: new Date().toISOString().split("T")[0],
      });
    }
    setIsModalOpen(true);
  };

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Save project
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingProject) {
      setProjects(
        projects.map((p) =>
          p.id === editingProject.id ? { ...formData, id: p.id } : p
        )
      );
    } else {
      setProjects([...projects, { ...formData, id: projects.length + 1 }]);
    }
    setIsModalOpen(false);
  };

  const confirmDelete = () => {
    setProjects(projects.filter((p) => p.id !== deleteConfirm.id));
    setDeleteConfirm(null);
  };

  return (
    <>
      <main className="flex-1 p-6 overflow-y-auto space-y-6">
        {/* Top Row with Button aligned to Table */}
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Projects List</h2>
          <button className="btn btn-primary" onClick={() => openModal()}>
            + Add Project
          </button>
        </div>

        {/* Projects Table */}
        <div className="card bg-white shadow-lg rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead className="bg-gray-100 text-gray-700 sticky top-0 z-10">
                <tr>
                  <th className="w-12">#</th>
                  <th>Project Name</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th className="text-right pr-6">Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.length > 0 ? (
                  projects.map((project, idx) => (
                    <tr
                      key={project.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="font-medium">{idx + 1}</td>
                      <td className="whitespace-nowrap">{project.name}</td>
                      <td>
                        <span
                          className={`badge ${
                            project.status === "Active"
                              ? "badge-success"
                              : project.status === "Pending"
                              ? "badge-warning"
                              : "badge-error"
                          }`}
                        >
                          {project.status}
                        </span>
                      </td>
                      <td className="text-gray-500">{project.created}</td>
                      <td className="text-right space-x-2">
                        <button
                          className="btn btn-xs btn-warning text-white"
                          onClick={() => openModal(project)}
                        >
                          <Pencil size={14} /> Edit
                        </button>
                        <button
                          className="btn btn-xs btn-error text-white"
                          onClick={() => setDeleteConfirm(project)}
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-6 text-gray-500">
                      No projects found. Click{" "}
                      <span className="font-semibold">+ Add Project</span> to
                      create one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modal */}
      {isModalOpen && (
        <dialog open className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">
              {editingProject ? "Edit Project" : "Add Project"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                <label className="block text-sm font-medium mb-1">Status</label>
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
              </div>

              <div className="modal-action">
                <button type="submit" className="btn btn-primary">
                  Save
                </button>
                <button
                  type="button"
                  className="btn"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </dialog>
      )}
      {deleteConfirm && (
        <dialog open className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Confirm Delete</h3>
            <p>
              Are you sure you want to delete{" "}
              <span className="font-semibold">{deleteConfirm.name}</span>?
            </p>
            <div className="modal-action">
              <button className="btn btn-error" onClick={confirmDelete}>
                Yes, Delete
              </button>
              <button className="btn" onClick={() => setDeleteConfirm(null)}>
                Cancel
              </button>
            </div>
          </div>
        </dialog>
      )}
    </>
  );
};

export default Projects;
