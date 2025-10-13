import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Pencil, Trash2, X } from "lucide-react";
import useUserManagement from "../hooks/useUserManagement";

const UserManagement = () => {
  const { userToken: token, user } = useSelector((s) => s.auth);
  const userRole = user?.role_name?.toLowerCase();
  const userId = user?.id;

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

  const filteredUsers = useMemo(
    () =>
      (users || []).filter((u) => {
        if (userRole === "super admin" && u.id === userId) return false;
        const matchName = u.name?.toLowerCase().includes(filters.query.toLowerCase());
        const matchRole = filters.role === "all" || u.role_id === +filters.role;
        return matchName && matchRole;
      }),
    [users, filters, userRole, userId]
  );

  const isRestricted = ["admin", "client"].includes(userRole);

  return (
    <div className="bg-gray-50 text-gray-800">
      <main className="p-4 sm:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between gap-3 items-center">
          <h2 className="text-lg font-semibold">User Management</h2>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <input
              type="search"
              placeholder="Search by name"
              value={filters.query}
              onChange={(e) => setFilters({ ...filters, query: e.target.value })}
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
              className={`btn btn-primary ${isRestricted ? "btn-disabled opacity-50" : ""}`}
              onClick={() => !isRestricted && openModal()}
              disabled={isRestricted}
            >
              + Add User
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="card bg-white rounded-2xl shadow">
          <div className="max-h-[400px] overflow-auto">
            <table className="table w-full text-sm sm:text-base">
              <thead className="bg-gray-100 sticky top-0 text-gray-700">
                <tr>
                  {["#", "Name", "Email", "Role", "Projects", "Actions"].map((h) => (
                    <th key={h} className={h === "Actions" ? "text-right pr-6" : ""}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length ? (
                  filteredUsers.map((u, i) => (
                    <tr key={u.id} className="hover:bg-gray-50 transition whitespace-nowrap">
                      <td>{i + 1}</td>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>{u.role_name}</td>
                      <td>{u.accessed_projects_name || "—"}</td>
                      <td className="text-right">
                        <button className="btn btn-xs btn-warning text-white mr-2" onClick={() => openModal(u)}>
                          <Pencil size={14} className="mr-1" /> Edit
                        </button>
                        <button className="btn btn-xs btn-error text-white" onClick={() => setDeleteConfirm(u)}>
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

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <Modal title={editingUser ? "Edit User" : "Add User"} onClose={closeModal}>
          <form onSubmit={handleSubmit} className="space-y-4">
            {["name", "email"].map((f) => (
              <Input
                key={f}
                label={f}
                type={f === "email" ? "email" : "text"}
                value={formData[f]}
                onChange={(v) => setFormData((p) => ({ ...p, [f]: v }))}
              />
            ))}

            {!editingUser &&
              ["password", "confirmPassword"].map((f) => (
                <Input
                  key={f}
                  label={f.replace("Password", " Password")}
                  type="password"
                  value={formData[f]}
                  onChange={(v) => setFormData((p) => ({ ...p, [f]: v }))}
                />
              ))}

            <Select
              label="Role"
              value={formData.role_id}
              options={roles.map((r) => ({ value: r.id, label: r.name }))}
              onChange={(v) => setFormData((p) => ({ ...p, role_id: v }))}
            />

            <Select
              label="Projects Assigned"
              value=""
              options={projects
                .filter((p) => !formData.accessed_projects.includes(p.id))
                .map((p) => ({ value: p.id, label: p.project_name }))}
              onChange={(v) =>
                setFormData((p) => ({
                  ...p,
                  accessed_projects: [...p.accessed_projects, +v],
                }))
              }
            />

            <div className="flex flex-wrap gap-2 mt-2">
              {formData.accessed_projects.length ? (
                formData.accessed_projects.map((id) => {
                  const name = projects.find((p) => p.id === id)?.project_name || "Unknown";
                  return (
                    <span
                      key={id}
                      className="flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm shadow-sm"
                    >
                      {name}
                      <button
                        type="button"
                        onClick={() =>
                          setFormData((p) => ({
                            ...p,
                            accessed_projects: p.accessed_projects.filter((pid) => pid !== id),
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
                <span className="text-gray-400 text-sm">No projects selected</span>
              )}
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
        </Modal>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <Modal title="Confirm Delete" onClose={() => setDeleteConfirm(null)}>
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
        </Modal>
      )}
    </div>
  );
};

/* 🔹 Small reusable helpers */
const Input = ({ label, type = "text", value, onChange }) => (
  <div>
    <label className="block text-sm font-medium mb-1 capitalize">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="input input-bordered w-full"
      required
    />
  </div>
);

const Select = ({ label, value, options, onChange }) => (
  <div>
    <label className="block text-sm font-medium mb-1">{label}</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="select select-bordered w-full"
    >
      <option value="">Select {label}</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  </div>
);

const Modal = ({ title, children, onClose }) => (
  <dialog open className="modal modal-open">
    <div className="modal-box w-11/12 max-w-lg bg-white relative">
      <button
        type="button"
        className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
        onClick={onClose}
      >
        <X size={20} />
      </button>
      <h3 className="font-bold text-lg mb-4">{title}</h3>
      {children}
    </div>
  </dialog>
);

export default UserManagement;
