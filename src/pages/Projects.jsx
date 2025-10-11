import React, { useState, useEffect } from "react";
import { Pencil, Trash2, X } from "lucide-react";
import ConfirmModal from "../shared/ConfirmModal";
import { useSelector } from "react-redux";
import { API_BASE_URL } from "../utils/config";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const token = useSelector((state) => state.auth.userToken);
  const user = useSelector((state) => state.auth.user);
  const userRole = user?.role_name || "";

  console.log("Auth token in Projects:", token, "Role:", userRole);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    status: "Active",
    created: new Date().toISOString().split("T")[0],
  });
  const [sortOrder, setSortOrder] = useState("");
  const [loading, setLoading] = useState(false);

 
  const canModify = userRole !== "Admin" && userRole !== "Client"; 

  const statusMap = {
    Pending: 0,
    Active: 1,
    Closed: 2,
  };

  const reverseStatusMap = {
    0: "Pending",
    1: "Active",
    2: "Closed",
  };

  // --- Open Add/Edit Modal ---
  const openModal = (project = null) => {
    if (!canModify) return; // prevent access
    if (project) {
      setEditingProject(project);
      setFormData({ ...project });
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- Fetch Projects ---
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${API_BASE_URL}/project/projectList`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch projects");

        const data = await response.json();
        console.log("Fetched projects raw response:", data);

        const formatted = (data?.projects || data)?.map((item) => ({
          id: item.id || item.project_id,
          name: item.project_name || item.name,
          status: reverseStatusMap[item.status] || "Active",
          created: item.created_at
            ? new Date(item.created_at).toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0],
        }));

        setProjects(formatted);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchProjects();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingProject) {
        const payload = {
          project_name: formData.name,
          status: statusMap[formData.status],
        };

        const response = await fetch(
          `${API_BASE_URL}/project/updateProject/${editingProject.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
          }
        );

        if (!response.ok) throw new Error("Failed to update project");

        const data = await response.json();
        console.log("Project updated:", data);

        setProjects((prev) =>
          prev.map((p) =>
            p.id === editingProject.id
              ? { ...p, name: formData.name, status: formData.status }
              : p
          )
        );
      } else {
        const payload = {
          project_name: formData.name,
          status: statusMap[formData.status],
        };

        const response = await fetch(
          `${API_BASE_URL}/project/createProject`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
          }
        );

        if (!response.ok) throw new Error("Failed to create project");

        const data = await response.json();

        const newProject = {
          id: data?.id || Date.now(),
          name: formData.name,
          status: formData.status,
          created: new Date().toISOString().split("T")[0],
        };

        setProjects((prev) => [...prev, newProject]);
      }

      setIsModalOpen(false);
      setEditingProject(null);
    } catch (error) {
      console.error("Error saving project:", error);
      alert("Something went wrong while saving the project.");
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;

    try {
      setLoading(true);

      const response = await fetch(
        // `http://localhost:3000/api/project/deleteProject/${deleteConfirm.id}`,
        `${API_BASE_URL}/project/deleteProject/${deleteConfirm.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to delete project");

      const data = await response.json();
      console.log("Project deleted:", data);
      setProjects((prev) => prev.filter((p) => p.id !== deleteConfirm.id));
    } catch (error) {
      console.error("Error deleting project:", error);
      alert("Failed to delete project. Please try again.");
    } finally {
      setDeleteConfirm(null);
      setLoading(false);
    }
  };

  const sortedProjects = [...projects].sort((a, b) => {
    if (!sortOrder) return 0;
    return sortOrder === "asc"
      ? a.name.localeCompare(b.name)
      : b.name.localeCompare(a.name);
  });

  return (
    <>
      <main className="flex-1 p-6 overflow-y-auto space-y-6">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <h2 className="text-lg font-semibold">Projects List</h2>

          <div className="flex items-center gap-3">
            <select
              className="select bg-white rounded-box border border-gray-400 focus:border-blue-500 focus:outline-none"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="">All Projects</option>
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
            {canModify && (
              <button
                className="btn btn-primary"
                onClick={() => openModal()}
                disabled={loading}
              >
                + Add Project
              </button>
            )}
          </div>
        </div>
        <div className="card bg-white shadow-lg rounded-2xl overflow-hidden whitespace-nowrap">
          <div className="max-h-[400px] overflow-y-auto overflow-x-auto">
            <table className="table w-full">
              <thead className="bg-gray-100 text-gray-700 sticky top-0 z-10">
                <tr>
                  <th className="w-12">Sl/No</th>
                  <th>Project Name</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th className="text-right pr-6">Actions</th>
                </tr>
              </thead>

              <tbody>
                {sortedProjects.length > 0 ? (
                  sortedProjects.map((project, idx) => (
                    <tr
                      key={project.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="font-medium">{idx + 1}</td>
                      <td className="whitespace-nowrap">{project.name}</td>
                      <td>
                        <span
                          className={`badge w-24 justify-center ${
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
                        {/* ✅ Disable edit/delete for Admin & Client */}
                        <button
                          className="btn btn-xs btn-warning text-white"
                          onClick={() => canModify && openModal(project)}
                          disabled={!canModify}
                        >
                          <Pencil size={14} /> Edit
                        </button>

                        <button
                          className="btn btn-xs btn-error text-white"
                          onClick={() => canModify && setDeleteConfirm(project)}
                          disabled={!canModify}
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-6 text-gray-500">
                      No projects found.{" "}
                      {canModify && (
                        <>
                          Click{" "}
                          <span className="font-semibold">+ Add Project</span>{" "}
                          to create one.
                        </>
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <dialog open className="modal modal-open">
          <div className="modal-box relative">
            <button
              type="button"
              className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
              onClick={() => setIsModalOpen(false)}
            >
              <X size={20} />
            </button>

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
                  <option value="Active">Active</option>
                  <option value="Pending">Pending</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              <div className="modal-action">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save"}
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

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteConfirm}
        title="Confirm Delete"
        message={
          deleteConfirm
            ? `Are you sure you want to delete "${deleteConfirm.name}"?`
            : ""
        }
        confirmText="Yes, Delete"
        cancelText="Cancel"
        confirmButtonClass="btn btn-error"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteConfirm(null)}
      />
    </>
  );
};

export default Projects;
