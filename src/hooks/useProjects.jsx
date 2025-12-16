import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { apiClient } from "../utils/apiClient";       // ⬅ USE GLOBAL CLIENT
import { fetchProjects } from "../utils/listSlice";

const statusMap = { Pending: 0, Active: 1, Closed: 2 };

export default function useProjects(token) {
  const dispatch = useDispatch();
  const { projects, loading } = useSelector((state) => state.list);
  // console.log('project list', projects)

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
        status: statusMap[formData.status],
        client_code: formData.client_code,
        project_location: formData.project_location,
        // start_date: formData.start_date,
        // end_date: formData.end_date,
        // description: formData.description,
      };

      const url = isEdit
        ? `/project/updateProject/${editingProject.id}`
        : `/project/createProject`;

      const method = isEdit ? "PUT" : "POST";

      const data = await apiClient(url, {
        method,
        body: payload,
      });
console.log("data plotssssss", data)
      if (!data.success) throw new Error(data.message);

      dispatch(fetchProjects());
    } catch (err) {
      console.error("Error saving project:", err);
      alert("Failed to save project.");
    }
  };

  const handleDeleteProject = async (project) => {
    if (!project) return;

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
