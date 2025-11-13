import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { API_BASE_URL } from "../utils/config";
import { fetchProjects } from "../utils/listSlice";

const statusMap = { Pending: 0, Active: 1, Closed: 2 };

export default function useProjects(token) {
  const dispatch = useDispatch();
  const { projects, loading } = useSelector((state) => state.list);
  // console.log('projectsss', projects)


  useEffect(() => {
    if (token) dispatch(fetchProjects());
    
  }, [token, dispatch]);


  const handleSaveProject = async (formData, editingProject) => {
    const isEdit = !!editingProject;

    try {
      const payload = {
        project_name: formData.name,
        status: statusMap[formData.status],
        client_code: formData.client_code,
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
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to save project");
      }

      dispatch(fetchProjects());
    } catch (err) {
      console.error("Error saving project:", err);
      alert("Failed to save project.");
    }
  };


  const handleDeleteProject = async (project) => {
    if (!project) return;

    try {
      await fetch(`${API_BASE_URL}/project/deleteProject/${project.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });


      dispatch(fetchProjects());
    } catch (err) {
      console.error("Error deleting project:", err);
      alert("Failed to delete project.");
    }
  };

  return {
    projects,
    loading,
    handleSaveProject,
    handleDeleteProject,
  };
}
