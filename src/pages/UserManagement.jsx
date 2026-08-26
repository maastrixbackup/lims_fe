import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Eye, EyeOff, Pencil, Trash2, X } from "lucide-react";
import useUserManagement from "../hooks/useUserManagement";

const UserManagement = () => {
  const { userToken: token, user } = useSelector((s) => s.auth);
  const userRole = user.role_name;
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

  const [filters, setFilters] = useState({ query: "", role: "all" });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!isModalOpen) {
      setShowPassword(false);
    }
  }, [isModalOpen]);

  const filteredUsers = useMemo(() => {
    return (users || []).filter((u) => {
      if (u.role_name === "Admin" && u.role_id === 1) return false;
      const matchName = u.name
        ?.toLowerCase()
        .includes(filters.query.toLowerCase());
      const matchRole = filters.role === "all" || u.role_id === +filters.role;
      return matchName && matchRole;
    });
  }, [users, filters]);

  const isRestricted = ["data entry user", "viewer"].includes(userRole);

  return (
    <div className="bg-gray-50 text-gray-800 h-screen ">
      <main className="p-4 sm:p-6 space-y-6">
        <div className="bg-gray-50 min-h-screen text-gray-800 p-4 sm:p-6 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between gap-4 items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 tracking-tight">
              User Management
            </h2>

            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto items-center">
              <input
                type="search"
                placeholder="Search by name..."
                value={filters.query}
                onChange={(e) =>
                  setFilters({ ...filters, query: e.target.value })
                }
                className="input input-bordered input-sm sm:input-md w-full sm:w-64 bg-white text-gray-800"
              />
              <select
                value={filters.role}
                onChange={(e) =>
                  setFilters({ ...filters, role: e.target.value })
                }
                className="select select-bordered select-sm sm:select-md w-full sm:w-44 bg-white text-gray-800"
              >
                <option value="all">All Roles</option>
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
              <button
                className={`btn btn-primary btn-sm sm:btn-md text-white font-medium ${isRestricted ? "btn-disabled opacity-50" : ""}`}
                onClick={() => !isRestricted && openModal()}
                disabled={isRestricted}
              >
                + Add User
              </button>
            </div>
          </div>

          <div className="card bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden">
            <div className="overflow-x-auto max-h-[calc(100vh-230px)]">
              <table className="table w-full border-collapse">
                <thead className="bg-gray-100/80 text-gray-600 sticky top-0 z-10 text-xs font-semibold uppercase tracking-wider border-b border-gray-200">
                  <tr>
                    <th className="py-3.5 px-4">#</th>
                    <th className="py-3.5 px-4">User</th>
                    <th className="py-3.5 px-4">Email</th>
                    <th className="py-3.5 px-4">Role</th>
                    <th className="py-3.5 px-4">Projects</th>
                    <th className="py-3.5 px-4 text-right pr-6">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {filteredUsers.length ? (
                    filteredUsers.map((u, i) => (
                      <tr
                        key={u.id}
                        className="hover:bg-gray-50/80 transition-colors"
                      >
                        <td className="font-medium text-gray-500 py-3.5 px-4">
                          {i + 1}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm overflow-hidden flex-shrink-0">
                              {u.profile_pic ? (
                                <img
                                  src={u.profile_pic}
                                  alt={u.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.target.style.display = "none";
                                  }}
                                />
                              ) : null}
                              <span>{u.name?.charAt(0) || "U"}</span>
                            </div>
                            <span className="font-semibold text-gray-800">
                              {u.name}
                            </span>
                          </div>
                        </td>
                        <td className="text-gray-600 py-3.5 px-4">{u.email}</td>
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                            {u.role_name}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          {u.accessed_projects ? (
                            <div className="flex flex-wrap gap-1 max-w-xs">
                              {String(u.accessed_projects)
                                .split(",")
                                .map((proj, idx) => (
                                  <span
                                    key={idx}
                                    className="bg-blue-50 text-blue-700 text-xs font-medium px-2 py-0.5 rounded border border-blue-100"
                                  >
                                    {proj.trim()}
                                  </span>
                                ))}
                            </div>
                          ) : (
                            <span className="text-xs text-rose-500 italic font-medium">
                              No Projects
                            </span>
                          )}
                        </td>
                        <td className="text-right py-3.5 px-4 pr-6">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              className="btn btn-ghost btn-xs text-amber-600 hover:bg-amber-50"
                              onClick={() => openModal(u)}
                            >
                              <Pencil size={15} /> Edit
                            </button>
                            <button
                              className="btn btn-ghost btn-xs text-rose-600 hover:bg-rose-50"
                              onClick={() => setDeleteConfirm(u)}
                            >
                              <Trash2 size={15} /> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        className="text-center py-10 text-gray-400 font-medium"
                      >
                        No users found matching filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
      {isModalOpen && (
        <dialog open className="modal modal-open">
          <div
            className="modal-box max-w-xl max-h-[85vh] overflow-y-auto bg-white rounded-2xl p-6 relative"
            style={{ scrollbarWidth: "thin" }}
          >
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
              <div>
                <label className="block text-sm font-medium mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  className="input border border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none w-full transition-all rounded-lg text-sm"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, name: e.target.value }))
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  className="input border border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none w-full transition-all rounded-lg text-sm"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, email: e.target.value }))
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Phone Number
                </label>
                <input
                  type="number"
                  className="input border border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none w-full transition-all rounded-lg text-sm"
                  value={formData.phone_number}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      phone_number: e.target.value,
                    }))
                  }
                />
              </div>
              {!editingUser && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        className="input border border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none w-full transition-all rounded-lg text-sm pr-12"
                        value={formData.password}
                        onChange={(e) =>
                          setFormData((p) => ({
                            ...p,
                            password: e.target.value,
                          }))
                        }
                        required
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700"
                        onClick={() => setShowPassword((prev) => !prev)}
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        className="input border border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none w-full transition-all rounded-lg text-sm pr-12"
                        value={formData.confirmPassword}
                        onChange={(e) =>
                          setFormData((p) => ({
                            ...p,
                            confirmPassword: e.target.value,
                          }))
                        }
                        required
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700"
                        onClick={() => setShowPassword((prev) => !prev)}
                        aria-label={
                          showPassword
                            ? "Hide confirm password"
                            : "Show confirm password"
                        }
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>
                </>
              )}
              <div>
                <label className="block text-sm font-medium mb-1">Role</label>
                <select
                  className="select border border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none w-full transition-all rounded-lg text-sm"
                  value={formData.role_id}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, role_id: e.target.value }))
                  }
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
                  Assign Project
                </label>
                <select
                  className="select border border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none w-full transition-all rounded-lg text-sm"
                  value=""
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      accessed_projects: [
                        ...p.accessed_projects,
                        +e.target.value,
                      ],
                    }))
                  }
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
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.accessed_projects.length ? (
                  formData.accessed_projects.map((id) => {
                    const projectName =
                      projects.find((p) => p.id === id)?.project_name ||
                      "Unknown";
                    return (
                      <span
                        key={id}
                        className="flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm shadow-sm"
                      >
                        {projectName}
                        <button
                          type="button"
                          onClick={() =>
                            setFormData((p) => ({
                              ...p,
                              accessed_projects: p.accessed_projects.filter(
                                (pid) => pid !== id,
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
                ) : (
                  <span className="text-gray-400 text-sm">
                    No projects selected
                  </span>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Profile Picture
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setFormData((prev) => ({ ...prev, profile_pic: file }));
                    }
                  }}
                  className="file-input file-input-bordered border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 w-full rounded-lg text-sm"
                />
                {(formData.profile_pic || formData.existing_profile_pic) && (
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.profile_pic instanceof File
                      ? formData.profile_pic.name
                      : formData.existing_profile_pic.split("/").pop()}
                  </p>
                )}
              </div>

              {/* <div>
                <label className="block text-sm font-medium mb-2">
                  Permissions
                </label>

                <div className="flex flex-wrap gap-3">
                  {[
                    { key: "can_add", label: "Add" },
                    { key: "can_edit", label: "Edit" },
                    { key: "can_delete", label: "Delete" },
                    { key: "can_upload", label: "Upload" },
                    { key: "can_view", label: "View" },
                    { key: "can_download", label: "Download" },
                  ].map((perm) => {
                    const active = formData.permissions?.[perm.key] || false;
                    return (
                      <button
                        key={perm.key}
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            permissions: {
                              ...prev.permissions,
                              [perm.key]: !active,
                            },
                          }))
                        }
                        className={`px-4 py-0 rounded-full text-sm border shadow-sm
            ${
              active
                ? "bg-blue-600 text-white border-blue-700"
                : "bg-gray-200 text-gray-600 border-gray-300"
            }`}
                      >
                        {perm.label}
                      </button>
                    );
                  })}
                </div>
              </div> */}
              <div className="modal-action flex gap-3">
                <button type="submit" className="btn btn-primary">
                  {editingUser ? "Update" : "Save"}
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
          <div className="modal-box bg-white relative">
            <button
              type="button"
              className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
              onClick={() => setDeleteConfirm(null)}
            >
              <X size={20} />
            </button>
            <h3 className="font-bold text-lg mb-4">Confirm Delete</h3>
            <p>
              Delete <b>{deleteConfirm.name}</b>?
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
