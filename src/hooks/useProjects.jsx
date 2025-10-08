import { useEffect, useState } from "react";

export const useProjects = (token) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState("");

  // --- Fetch all projects ---
  const fetchProjects = async () => {
  if (!token) return;
  setLoading(true);
  try {
    const res = await fetch("http://localhost:3000/api/project/projectList", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Failed to fetch projects");

    const json = await res.json();
    console.log("Fetched projects raw response:", json);

    const projectArray = Array.isArray(json)
      ? json
      : Array.isArray(json.data)
      ? json.data
      : [];

    const formatted = projectArray.map((p) => ({
      id: p.id,
      name: p.project_name,
      status: p.project_status,
      created: new Date(p.created_at).toISOString().split("T")[0],
    }));

    setProjects(formatted);
  } catch (error) {
    console.error("Error fetching projects:", error);
  } finally {
    setLoading(false);
  }
};


  // --- Create new project ---
  const createProject = async (formData) => {
    setLoading(true);
    try {
      const payload = {
        project_name: formData.name,
        status:
          formData.status === "Pending"
            ? 0
            : formData.status === "Active"
            ? 1
            : 2,
      };

      const res = await fetch("http://localhost:3000/api/project/createProject", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to create project");
      const data = await res.json();

      const newProject = {
        id: data.id || Date.now(),
        name: data.project_name,
        status: data.project_status || formData.status,
        created: new Date(data.created_at || new Date())
          .toISOString()
          .split("T")[0],
      };

      setProjects((prev) => [...prev, newProject]);
    } catch (error) {
      console.error("Error creating project:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = (id) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  const updateProject = (updated) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === updated.id ? updated : p))
    );
  };

  // --- Sort Projects ---
  const sortedProjects = [...projects].sort((a, b) => {
    if (!sortOrder) return 0;
    return sortOrder === "asc"
      ? a.name.localeCompare(b.name)
      : b.name.localeCompare(a.name);
  });

  useEffect(() => {
    fetchProjects();
  }, [token]);

  return {
    projects: sortedProjects,
    loading,
    sortOrder,
    setSortOrder,
    createProject,
    deleteProject,
    updateProject,
    fetchProjects,
  };
};
