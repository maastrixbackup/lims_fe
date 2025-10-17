import { Clock, CheckCircle, AlertCircle } from "lucide-react";
import useFetchDashboard from "../../hooks/useFetchDashboard";

export default function RecentActivity() {
  const { data, loading, error } = useFetchDashboard();

  if (loading) return <div>Loading recent projects...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const activities = data?.recent_activity || [];

  // Optionally map icons dynamically
  const iconMap = {
    completed: <CheckCircle className="text-green-500" size={18} />,
    pending: <Clock className="text-yellow-500" size={18} />,
    alert: <AlertCircle className="text-red-500" size={18} />,
  };

  return (
    <div className="card bg-white shadow-xl rounded-2xl">
      <div className="card-body p-6">
        <h2 className="card-title text-gray-700 mb-4">Recent Activity</h2>
        <ul className="space-y-4">
          {activities.map((activity, index) => (
            <li
              key={activity.id || index} // ✅ ensures a unique key for each item
              className="flex items-start space-x-3"
            >
              <div className="mt-1">
                {iconMap[activity.type] || (
                  <Clock className="text-gray-400" size={18} />
                )}
              </div>
              <div>
                <p className="text-gray-700 text-sm">{activity.message}</p>
                <span className="text-xs text-gray-500">
                  {activity.created_at}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
