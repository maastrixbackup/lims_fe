import { Clock, CheckCircle, AlertCircle } from "lucide-react";
import useFetch from "../../hooks/useFetch";

export default function RecentActivity() {
    const { data, loading, error } = useFetch();
  
    if (loading) return <div>Loading recent projects...</div>;
    if (error) return <div>Error: {error.message}</div>;

    const activities = data?.recent_activity || []


  return (
    <div className="card bg-white shadow-xl rounded-2xl">
      <div className="card-body p-6">
        <h2 className="card-title text-gray-700 mb-4">Recent Activity</h2>
        <ul className="space-y-4">
          {activities.map((activity) => (
            <li key={activity.id} className="flex items-start space-x-3">
              <div className="mt-1">{activity.icon}</div>
              <div>
                <p className="text-gray-700 text-sm">{activity.message}</p>
                <span className="text-xs text-gray-500">{activity.created_at}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
