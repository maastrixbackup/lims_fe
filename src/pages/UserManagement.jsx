import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Pencil, Trash2, X } from "lucide-react";
import useUserManagement from "../hooks/useUserManagement";

const UserManagement = () => {
  const { userToken: token, user } = useSelector((s) => s.auth);
  const userRole = user.role_name;
  const userId = user?.role_id;
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
    <div className="bg-gray-50 text-gray-800">
      <main className="p-4 sm:p-6 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between gap-3 items-center">
          <h2 className="text-lg font-semibold">User Management</h2>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <input
              type="search"
              placeholder="Search by name"
              value={filters.query}
              onChange={(e) =>
                setFilters({ ...filters, query: e.target.value })
              }
              className="input input-bordered w-full sm:w-64"
            />
            <select
              value={filters.role}
              onChange={(e) => setFilters({ ...filters, role: e.target.value })}
              className="select select-bordered w-full sm:w-48"
            >
              <option value="all">All Roles</option>
              {roles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
            <button
              className={`btn btn-primary ${
                isRestricted ? "btn-disabled opacity-50" : ""
              }`}
              onClick={() => !isRestricted && openModal()}
              disabled={isRestricted}
            >
              + Add User
            </button>
          </div>
        </div>

        <div className="card bg-white shadow-lg overflow-hidden">
          <div className="max-h-[400px] overflow-x-auto">
            <table className="table w-full">
              <thead className="bg-gray-200 text-gray-700 sticky top-0 z-10 whitespace-nowrap">
                <tr>
                  {["#", "Name", "Email", "Role", "Projects", "Actions"].map(
                    (h) => (
                      <th
                        key={h}
                        className={h === "Actions" ? "text-right pr-6" : ""}
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length ? (
                  filteredUsers.map((u, i) => (
                    <tr
                      key={u.id}
                      className="hover:bg-gray-50 transition whitespace-nowrap"
                    >
                      <td>{i + 1}</td>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>{u.role_name}</td>
                      <td>{u.accessed_projects || "—"}</td>
                      <td className="text-right">
                        <button
                          className="btn btn-xs btn-warning text-white mr-2"
                          onClick={() => openModal(u)}
                        >
                          <Pencil size={14} className="mr-1" /> Edit
                        </button>
                        <button
                          className="btn btn-xs btn-error text-white"
                          onClick={() => setDeleteConfirm(u)}
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
              <div>
                <label className="block text-sm font-medium mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full"
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
                  className="input input-bordered w-full"
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
                  className="input input-bordered w-full"
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
                    <input
                      type="password"
                      className="input input-bordered w-full"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData((p) => ({
                          ...p,
                          password: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      className="input input-bordered w-full"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        setFormData((p) => ({
                          ...p,
                          confirmPassword: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium mb-1">Role</label>
                <select
                  className="select select-bordered w-full"
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
                  className="select select-bordered w-full"
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
                                (pid) => pid !== id
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
                  className="file-input file-input-bordered w-full"
                />
                {formData.profile_pic && (
                  <p className="text-xs text-gray-500 mt-1">
                    {typeof formData.profile_pic === "string"
                      ? formData.profile_pic.split("/").pop()
                      : formData.profile_pic.name}
                  </p>
                )}
              </div>

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
