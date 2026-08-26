import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { apiClient } from "../utils/apiClient";
import { toast } from "sonner";

export default function useUserManagement(token) {
  const { projects } = useSelector((s) => s.list);

  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);

  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_number: "",
    password: "",
    confirmPassword: "",
    role_id: "",
    accessed_projects: [],
    profile_pic: null,
    existing_profile_pic: "",
    permissions: {
      can_add: false,
      can_edit: false,
      can_delete: false,
      can_upload: false,
      can_view: false,
      can_download: false,
    },
  });

  const fetchData = async () => {
    if (!token) return;

    setLoading(true);

    try {
      const [usersData, rolesData] = await Promise.all([
        apiClient("/user/usersList"),
        apiClient("/role/getRoles"),
      ]);

      setUsers(Array.isArray(usersData.users) ? usersData.users : []);
      setRoles(Array.isArray(rolesData.roles) ? rolesData.roles : []);
    } catch (err) {
      console.error("Error fetching data:", err);
      toast.error(err.message || "Failed to fetch user management data");
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

      let parsedProjects = [];

      if (typeof user.accessed_projects === "string") {
        const names = user.accessed_projects
          .split(",")
          .map((n) => n.trim())
          .filter(Boolean);

        parsedProjects = names
          .map((project_name) => {
            const match = projects.find(
              (p) => p.project_name.toLowerCase() === project_name.toLowerCase()
            );
            return match ? match.id : null;
          })
          .filter(Boolean);
      } else if (Array.isArray(user.accessed_projects)) {
        parsedProjects = user.accessed_projects.map((p) =>
          typeof p === "object" ? p.id : Number(p)
        );
      }

      setFormData({
        name: user.name || "",
        email: user.email || "",
        password: "",
        confirmPassword: "",
        role_id: user.role_id || "",
        accessed_projects: parsedProjects,
        phone_number: user.phone_number || "",
        profile_pic: null,
        existing_profile_pic: user.profile_pic || "",
        permissions: user.permissions || {
          can_add: false,
          can_edit: false,
          can_delete: false,
          can_upload: false,
          can_view: false,
          can_download: false,
        },
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
      phone_number: "",
      password: "",
      confirmPassword: "",
      role_id: "",
      accessed_projects: [],
      profile_pic: null,
      existing_profile_pic: "",
      permissions: {
        can_add: false,
        can_edit: false,
        can_delete: false,
        can_upload: false,
        can_view: false,
        can_download: false,
      },
    });
  };

  const closeModal = () => {
    resetForm();
    setIsModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Field validation for new user creation
    if (!editingUser) {
      if (!formData.name.trim()) {
        toast.warning("Name is required.");
        return;
      }
      if (!formData.email.trim()) {
        toast.warning("Email is required.");
        return;
      }
      if (!formData.phone_number.trim()) {
        toast.warning("Phone number is required.");
        return;
      }
      if (!formData.role_id) {
        toast.warning("Role selection is required.");
        return;
      }
      if (!formData.password) {
        toast.warning("Password is required.");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        toast.warning("Passwords do not match!");
        return;
      }
    } else {
      if (formData.password && formData.password !== formData.confirmPassword) {
        toast.warning("Passwords do not match!");
        return;
      }
    }

    try {
      const form = new FormData();
      form.append("name", formData.name);
      form.append("email", formData.email);
      form.append("role_id", formData.role_id);
      form.append("phone_number", formData.phone_number);

      // Derive username from first name (e.g. "Rudranarayan Sahu" -> "rudra")
      const firstName = formData.name.trim().split(" ")[0] || "";
      const generatedUsername = firstName.slice(0, 5).toLowerCase();
      form.append("username", generatedUsername);

      if (!editingUser || formData.password) {
        form.append("password", formData.password);
      }

      // JSON stringify the array to align with Multer JSON.parse on backend
      form.append(
        "accessed_projects",
        JSON.stringify(formData.accessed_projects)
      );

      if (formData.profile_pic instanceof File) {
        form.append("profile_pic", formData.profile_pic);
      } else if (editingUser && formData.existing_profile_pic) {
        form.append("existing_profile_pic", formData.existing_profile_pic);
        form.append("keep_existing_profile_pic", "1");
      }

      const endpoint = editingUser
        ? `/auth/updateUser/${editingUser.id}`
        : `/auth/createUser`;

      const res = await apiClient(endpoint, {
        method: editingUser ? "PUT" : "POST",
        body: form,
      });

      if (res && res.success !== false) {
        toast.success(
          editingUser ? "User updated successfully" : "User created successfully"
        );
        fetchData();
        closeModal();
      } else {
        toast.error(res?.message || "Failed to save user.");
      }
    } catch (err) {
      console.error("Error saving user:", err);
      toast.error(err.message || "An unexpected error occurred while saving user.");
    }
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;

    try {
      const res = await apiClient(
        `/auth/deleteUser/${deleteConfirm.id}`,
        { method: "DELETE" }
      );

      if (res && res.success !== false) {
        toast.success("User deleted successfully");
        fetchData();
        setDeleteConfirm(null);
      } else {
        toast.error(res?.message || "Failed to delete user.");
      }
    } catch (err) {
      console.error("Error deleting user:", err);
      toast.error(err.message || "An error occurred while deleting user.");
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