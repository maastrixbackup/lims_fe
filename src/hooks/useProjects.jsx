import { useState, useEffect, useCallback } from "react";
import { API_BASE_URL } from "../utils/config";
import moment from "moment";
import { useSelector } from "react-redux";

const statusMap = { Pending: 0, Active: 1, Closed: 2 };
const reverseStatusMap = { 0: "Pending", 1: "Active", 2: "Closed" };

export default function useProjects(token) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const project_access= useSelector((state) => state.auth.project_access); 

  const fetchProjects = useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/project/projectList`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      const formatted = (data?.projects || data)?.map((p) => ({
        id: p.id || p.project_id,
        name: p.project_name || p.name,
        status: reverseStatusMap[p.status] || "Active",
        project_access: project_access || [],
        created: p.created_at
          ? moment(p.created_at).format("YYYY-MM-DD")
          : moment().format("YYYY-MM-DD"),
      }));

      setProjects(formatted);
    } catch (e) {
      console.error("Error fetching projects:", e);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleSaveProject = async (formData, editingProject) => {
    const isEdit = !!editingProject;
    setLoading(true);

    try {
      const payload = {
        project_name: formData.name,
        status: statusMap[formData.status],
      };

      const url = isEdit
        ? `${API_BASE_URL}/project/updateProject/${editingProject.id}`
        : `${API_BASE_URL}/project/createProject`;

      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (isEdit) {
        setProjects((prev) =>
          prev.map((p) =>
            p.id === editingProject.id
              ? { ...p, name: formData.name, status: formData.status }
              : p
          )
        );
      } else {
        setProjects((prev) => [
          ...prev,
          {
            id: data?.id || Date.now(),
            name: formData.name,
            status: formData.status,
            created: moment().format("YYYY-MM-DD"),
          },
        ]);
      }
    } catch (err) {
      console.error("Error saving project:", err);
      alert("Failed to save project.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (project) => {
    if (!project) return;
    try {
      setLoading(true);
      await fetch(`${API_BASE_URL}/project/deleteProject/${project.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects((prev) => prev.filter((p) => p.id !== project.id));
    } catch (err) {
      console.error("Error deleting project:", err);
      alert("Failed to delete project.");
    } finally {
      setLoading(false);
    }
  };

  return {
    projects,
    loading,
    fetchProjects,
    handleSaveProject,
    handleDeleteProject,
  };
}
