import React, { useState, useEffect, useMemo } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { useSelector } from "react-redux";

const API_BASE_URL = "http://localhost:3000/api";

const UserManagement = () => {
  const token = useSelector((state) => state.auth.userToken);

  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [projects, setProjects] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role_id: "",
    accessed_projects: [],
  });

  /** Fetch all data at once */
  const fetchData = async () => {
    try {
      const [usersRes, rolesRes, projectsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/user/usersList`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_BASE_URL}/role/getRoles`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_BASE_URL}/project/projectList`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const [usersData, rolesData, projectsData] = await Promise.all([
        usersRes.json(),
        rolesRes.json(),
        projectsRes.json(),
      ]);

      setUsers(Array.isArray(usersData.users) ? usersData.users : []);
      setRoles(Array.isArray(rolesData.roles) ? rolesData.roles : []);
      setProjects(
        Array.isArray(projectsData.projects) ? projectsData.projects : []
      );
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  /**Open/close modal */
  const openModal = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        password: "",
        confirmPassword: "",
        role_id: user.role_id,
        accessed_projects: user.accessed_projects || [],
      });
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setEditingUser(null);
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role_id: "",
      accessed_projects: [],
    });
  };

  const closeModal = () => {
    resetForm();
    setIsModalOpen(false);
  };

  /**Handle changes */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProjectSelect = (e) => {
    const selected = Array.from(e.target.selectedOptions, (opt) =>
      parseInt(opt.value)
    );
    setFormData((prev) => ({ ...prev, accessed_projects: selected }));
  };

  /**Submit form */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!editingUser && formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      if (editingUser) {
        alert("Update endpoint not implemented yet.");
      } else {
        const res = await fetch(`${API_BASE_URL}/auth/createUser`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            role_id: parseInt(formData.role_id),
            accessed_projects: formData.accessed_projects,
          }),
        });

        const data = await res.json();
        if (data.success) {
          fetchData();
          closeModal();
        } else alert(data.message || "Failed to create user");
      }
    } catch (err) {
      console.error("Error creating/updating user:", err);
    }
  };

  /**Delete user */
  const confirmDelete = async () => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/user/deleteUser/${deleteConfirm.id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (data.success) {
        fetchData();
        setDeleteConfirm(null);
      } else alert(data.message || "Failed to delete user");
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  /**Filtering logic */
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
        {/* Header Section */}
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

            {/*Role Filter Dropdown */}
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

            <button
              className="btn btn-primary w-full sm:w-auto"
              onClick={() => openModal()}
            >
              + Add User
            </button>
          </div>
        </div>

        {/* User Table */}
        <div className="card bg-white rounded-2xl  shadow-[0_0_12px_rgba(0,0,0,0.15)]">
          {/* Scrollable container */}
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
                    <tr
                      key={user.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
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

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <dialog open className="modal modal-open">
          <div className="modal-box w-11/12 max-w-lg bg-white">
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
                    onChange={handleChange}
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
                        onChange={handleChange}
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
                  onChange={handleChange}
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
                  multiple
                  name="accessed_projects"
                  value={formData.accessed_projects}
                  onChange={handleProjectSelect}
                  className="select select-bordered w-full h-32"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.project_name}
                    </option>
                  ))}
                </select>
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

      {/* Delete Confirmation */}
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
