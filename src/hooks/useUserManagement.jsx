import { useState, useEffect } from "react";
import { API_BASE_URL } from "../utils/config";

export default function useUserManagement(token) {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);

  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role_id: "",
    accessed_projects: [],
  });
  const fetchData = async () => {
    if (!token) return;
    setLoading(true);
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
      setProjects(Array.isArray(projectsData.projects) ? projectsData.projects : []);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);
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
      
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!editingUser && formData.password !== formData.confirmPassword) {
      alert("⚠️ Passwords do not match!");
      return;
    }

    try {
      const method = editingUser ? "PUT" : "POST";
      const url = editingUser
        ? `${API_BASE_URL}/auth/updateUser/${editingUser.id}`
        : `${API_BASE_URL}/auth/createUser`;

      const payload = {
        name: formData.name,
        email: formData.email,
        role_id: parseInt(formData.role_id),
        accessed_projects: formData.accessed_projects,
      };

      if (!editingUser || formData.password) {
        payload.password = formData.password;
      }

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        fetchData();
        closeModal();
      } else {
        alert(data.message || "Failed to save user.");
      }
    } catch (err) {
      console.error("Error saving user:", err);
    }
  };
  const confirmDelete = async () => {
    if (!deleteConfirm) return;
    try {
      const res = await fetch(
        `${API_BASE_URL}/auth/deleteUser/${deleteConfirm.id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (data.success) {
        fetchData();
        setDeleteConfirm(null);
      } else {
        alert(data.message || "Failed to delete user.");
      }
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  return {
    users,
    roles,
    projects,
    loading,
    formData,
    setFormData,
    isModalOpen,
    setIsModalOpen,
    openModal,
    closeModal,
    handleSubmit,
    deleteConfirm,
    setDeleteConfirm,
    confirmDelete,
    editingUser,
  };
}
