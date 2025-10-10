import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Pencil, Trash2, X } from "lucide-react";
import useUserManagement from "../hooks/useUserManagement";

const UserManagement = () => {
  const token = useSelector((state) => state.auth.userToken);
  const {
    users,
    roles,
    projects,
    formData,
    setFormData,
    isModalOpen,
    openModal,
    closeModal,
    handleSubmit,
    deleteConfirm,
    setDeleteConfirm,
    confirmDelete,
    editingUser,
  } = useUserManagement(token);

  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const filteredUsers = useMemo(() => {
    if (!Array.isArray(users)) return [];
    return users.filter((user) => {
      const matchesName = user.name
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesRole =
        roleFilter === "all" || user.role_id === parseInt(roleFilter);
      return matchesName && matchesRole;
    });
  }, [users, searchQuery, roleFilter]);

  return (
    <div className="bg-gray-50 text-gray-800">
      <main className="p-4 sm:p-6 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
          <h2 className="text-lg font-semibold">User Management</h2>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <input
              type="search"
              placeholder="Search by name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input input-bordered w-full sm:w-64"
            />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="select select-bordered w-full sm:w-48"
            >
              <option value="all">All Roles</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>

            <button className="btn btn-primary" onClick={() => openModal()}>
              + Add User
            </button>
          </div>
        </div>
        <div className="card bg-white rounded-2xl shadow-[0_0_12px_rgba(0,0,0,0.15)]">
          <div className="max-h-[400px] overflow-y-auto overflow-x-auto">
            <table className="table w-full text-sm sm:text-base">
              <thead className="bg-gray-100 text-gray-700 sticky top-0 z-10">
                <tr>
                  <th>Sl/No</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Projects</th>
                  <th className="text-right pr-6">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user, idx) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td>{idx + 1}</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.role_name}</td>
                      <td>{user.accessed_projects_name || "—"}</td>
                      <td className="text-right whitespace-nowrap">
                        <button
                          className="btn btn-xs btn-warning text-white mr-2"
                          onClick={() => openModal(user)}
                        >
                          <Pencil size={14} className="mr-1" /> Edit
                        </button>
                        <button
                          className="btn btn-xs btn-error text-white"
                          onClick={() => setDeleteConfirm(user)}
                        >
                          <Trash2 size={14} className="mr-1" /> Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-6 text-gray-500">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      {isModalOpen && (
        <dialog open className="modal modal-open">
          <div className="modal-box w-11/12 max-w-lg bg-white relative">
            <button
              type="button"
              className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
              onClick={closeModal}
            >
              <X size={20} />
            </button>

            <h3 className="font-bold text-lg mb-4">
              {editingUser ? "Edit User" : "Add User"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              {["name", "email"].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium mb-1 capitalize">
                    {field}
                  </label>
                  <input
                    type={field === "email" ? "email" : "text"}
                    name={field}
                    value={formData[field]}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        [field]: e.target.value,
                      }))
                    }
                    className="input input-bordered w-full"
                    required
                  />
                </div>
              ))}
              {!editingUser && (
                <>
                  {["password", "confirmPassword"].map((field) => (
                    <div key={field}>
                      <label className="block text-sm font-medium mb-1 capitalize">
                        {field.replace("Password", " Password")}
                      </label>
                      <input
                        type="password"
                        name={field}
                        value={formData[field]}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            [field]: e.target.value,
                          }))
                        }
                        className="input input-bordered w-full"
                        required
                      />
                    </div>
                  ))}
                </>
              )}
              <div>
                <label className="block text-sm font-medium mb-1">Role</label>
                <select
                  name="role_id"
                  value={formData.role_id}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      role_id: e.target.value,
                    }))
                  }
                  className="select select-bordered w-full"
                  required
                >
                  <option value="">Select Role</option>
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Projects Assigned
                </label>
                <select
                  onChange={(e) => {
                    const newId = parseInt(e.target.value);
                    if (newId && !formData.accessed_projects.includes(newId)) {
                      setFormData((prev) => ({
                        ...prev,
                        accessed_projects: [...prev.accessed_projects, newId],
                      }));
                    }
                    e.target.value = "";
                  }}
                  className="select select-bordered w-full"
                >
                  <option value="">Select Project</option>
                  {projects
                    .filter((p) => !formData.accessed_projects.includes(p.id))
                    .map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.project_name}
                      </option>
                    ))}
                </select>

                <div className="flex flex-wrap gap-2 mt-3">
                  {formData.accessed_projects.length === 0 ? (
                    <span className="text-gray-400 text-sm">
                      No projects selected
                    </span>
                  ) : (
                    formData.accessed_projects.map((pid) => {
                      const project = projects.find((p) => p.id === pid);
                      return (
                        <span
                          key={pid}
                          className="flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm shadow-sm"
                        >
                          {project?.project_name || "Unknown"}
                          <button
                            type="button"
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                accessed_projects: prev.accessed_projects.filter(
                                  (id) => id !== pid
                                ),
                              }))
                            }
                            className="ml-1 text-blue-500 hover:text-blue-700"
                          >
                            ×
                          </button>
                        </span>
                      );
                    })
                  )}
                </div>
              </div>

              <div className="modal-action flex gap-3">
                <button type="submit" className="btn btn-primary">
                  Save
                </button>
                <button type="button" className="btn" onClick={closeModal}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </dialog>
      )}
      {deleteConfirm && (
        <dialog open className="modal modal-open">
          <div className="modal-box w-11/12 max-w-sm bg-white">
            <h3 className="font-bold text-lg mb-4">Confirm Delete</h3>
            <p>
              Are you sure you want to delete{" "}
              <span className="font-semibold">{deleteConfirm.name}</span>?
            </p>
            <div className="modal-action flex gap-3">
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
    </div>
  );
};

export default UserManagement;
