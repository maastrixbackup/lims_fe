import { useState, useEffect } from "react";
import { API_BASE_URL } from "../utils/config";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../utils/userSlice"; 
import { useNavigate } from "react-router-dom";


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
    password: "",
    confirmPassword: "",
    role_id: "",
    accessed_projects: [],
    phone_number: "",
    profile_pic: "",
  });
  const dispatch= useDispatch()
    const navigate = useNavigate();
  const fetchData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [usersRes, rolesRes] = await Promise.all([
        fetch(`${API_BASE_URL}/user/usersList`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_BASE_URL}/role/getRoles`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const [usersData, rolesData] = await Promise.all([
        usersRes.json(),
        rolesRes.json(),
      ]);

      setUsers(Array.isArray(usersData.users) ? usersData.users : []);
      setRoles(Array.isArray(rolesData.roles) ? rolesData.roles : []);
       if (usersRes.status === 401) {
                dispatch(logout());       
                navigate("/");
                alert("This Session Time is Out Please login Again")        
                return;
              }
      // console.log("accesseddddd users project^^^^^^^^^^^", usersData.users);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [token]);
  // console.log("accesseddddd project^^^^^^^^^^^", formData.accessed_projects);
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
        .map((name) => {
          const matchedProject = projects.find(
            (p) => p.name.toLowerCase() === name.toLowerCase()
          );
          return matchedProject ? matchedProject.id : null;
        })
        .filter(Boolean);
    }

    else if (Array.isArray(user.accessed_projects)) {
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
      profile_pic: user.profile_pic || "",
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
      phone_number: "",
      profile_pic: "",
    });
  };

  const closeModal = () => {
    resetForm();
    setIsModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!editingUser && formData.password !== formData.confirmPassword) {
      alert(" Passwords do not match!");
      return;
    }

    try {
      const method = editingUser ? "PUT" : "POST";
      const url = editingUser
        ? `${API_BASE_URL}/auth/updateUser/${editingUser.id}`
        : `${API_BASE_URL}/auth/createUser`;

      const form = new FormData();
      form.append("name", formData.name);
      form.append("email", formData.email);
      form.append("role_id", formData.role_id);
      // form.append("status", formData.status || "active");
      // form.append("phone_number", formData.phone_number || "");
      form.append("phone_number", `+91${formData.phone_number}`);


      if (!editingUser || formData.password)
        form.append("password", formData.password);

      formData.accessed_projects.forEach((id) =>
        form.append("accessed_projects[]", id)
      );

      if (formData.profile_pic)
        form.append("profile_pic", formData.profile_pic);

      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });

      const data = await res.json();
      // console.log("User save response:", data);
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
