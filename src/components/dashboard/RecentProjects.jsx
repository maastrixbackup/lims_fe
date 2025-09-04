export default function RecentProjects() {
  const projects = [
    { id: 1, name: "Smart City", status: "Active", progress: 75 },
    { id: 2, name: "Green Village", status: "Pending", progress: 40 },
    { id: 3, name: "Solar Housing", status: "Completed", progress: 100 },
  ];

  return (
    <div className="card bg-white shadow-xl rounded-2xl">
      <div className="card-body p-6">
        <h2 className="card-title text-gray-700 mb-4">Recent Projects</h2>
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr className="text-gray-600">
                <th>ID</th>
                <th>Name</th>
                <th>Status</th>
                <th>Progress</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id} className="hover">
                  <td>{project.id}</td>
                  <td>{project.name}</td>
                  <td>
                    <span className={`badge ${
                      project.status === "Active" ? "badge-success" :
                      project.status === "Pending" ? "badge-warning" :
                      "badge-neutral"
                    }`}>
                      {project.status}
                    </span>
                  </td>
                  <td>
                    <progress
                      className="progress progress-primary w-32"
                      value={project.progress}
                      max="100"
                    ></progress>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
