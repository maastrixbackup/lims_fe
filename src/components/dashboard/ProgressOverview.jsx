export default function ProgressOverview() {
  const kpis = [
    {
      id: 1,
      title: "Land Acqusition Completed",
      value: 70,
      color: "progress-primary",
    },
    {
      id: 2,
      title: "Forest Diversion Completed",
      value: 50,
      color: "progress-secondary",
    },
    {
      id: 3,
      title: "Socio-Economic Survey Completed",
      value: 90,
      color: "progress-success",
    },
    { id: 4, title: "Yadaast Completed", value: 40, color: "progress-error" },
  ];

  return (
    <div className="card bg-white shadow-xl rounded-2xl">
      <div className="card-body p-6">
        <h2 className="card-title text-gray-700 mb-4">
          Project Progress Overview
        </h2>
        <div className="space-y-4">
          {kpis.map((kpi) => (
            <div key={kpi.id}>
              <div className="flex justify-between mb-1 text-sm text-gray-600">
                <span>{kpi.title}</span>
                <span>{kpi.value}%</span>
              </div>
              <progress
                className={`progress w-full ${kpi.color}`}
                value={kpi.value}
                max="100"
              ></progress>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
