import React from "react";
// import useFetch from "../../hooks/useFetch";
import useFetchDashboard from "../../hooks/useFetchDashboard";

export default function RecentProjects() {
  const { data, loading, error } = useFetchDashboard();

  if (loading) return <div>Loading recent projects...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const projects = data?.recent_projects || [];
  // console.log('dataaaaaaaaaaaaaaaaaa', projects)

  return (
    <div className="card bg-white shadow-xl rounded-2xl">
      <div className="card-body p-6">
        <h2 className="card-title text-gray-700 mb-4">Recent Projects</h2>

        {projects.length === 0 ? (
          <div className="text-gray-500 text-center py-4">
            No recent projects found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr className="text-gray-600">
                  <th>ID</th>
                  <th>Project Name</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project, index) => (
                  <tr key={project.id || index} className="hover">
                    <td>{project.id}</td>
                    <td>{project.project_name}</td>
                    <td>
                      <span
                        className={`badge ${
                          project.status_text === "Active"
                            ? "badge-success text-white"
                            : project.status_text === "Pending"
                            ? "badge-warning text-white"
                            : "badge-error text-white"
                        }`}
                      >
                        {project.status_text}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
