import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { apiClient } from "../utils/apiClient";
import { fetchProjects } from "../utils/listSlice";

const statusMap = {
  Pending: 0,
  Active: 1,
  Closed: 2,
};

export default function useProjects(token) {
  const dispatch = useDispatch();
  const { projects, loading } = useSelector((state) => state.list);

  useEffect(() => {
    if (token) {
      dispatch(fetchProjects());
    }
  }, [token, dispatch]);

  const handleSaveProject = async (formData, editingProject) => {
    const isEdit = !!editingProject;

    try {
      const payload = {
        project_name: formData.name,
        client_code: formData.client_code,
        project_location: formData.project_location,
        status: statusMap[formData.status],
        type: formData.type, // ✅ NUMBER (1 | 2 | 3)
      };

      const url = isEdit
        ? `/project/updateProject/${editingProject.id}`
        : `/project/createProject`;

      const method = isEdit ? "PUT" : "POST";

      const data = await apiClient(url, {
        method,
        body: payload,
      });

      if (!data.success) throw new Error(data.message);

      dispatch(fetchProjects());
    } catch (err) {
      console.error("Error saving project:", err);
      alert("Failed to save project.");
    }
  };

  const handleDeleteProject = async (project) => {
    try {
      await apiClient(`/project/deleteProject/${project.id}`, {
        method: "DELETE",
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
