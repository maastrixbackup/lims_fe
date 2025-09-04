import { Clock, CheckCircle, AlertCircle } from "lucide-react";

export default function RecentActivity() {
  const activities = [
    { id: 1, text: "New project Smart City created", time: "2h ago", icon: <CheckCircle className="text-green-500" size={18} /> },
    { id: 2, text: "Village data updated", time: "5h ago", icon: <Clock className="text-blue-500" size={18} /> },
    { id: 3, text: "Plot registration pending approval", time: "1d ago", icon: <AlertCircle className="text-yellow-500" size={18} /> },
  ];

  return (
    <div className="card bg-white shadow-xl rounded-2xl">
      <div className="card-body p-6">
        <h2 className="card-title text-gray-700 mb-4">Recent Activity</h2>
        <ul className="space-y-4">
          {activities.map((activity) => (
            <li key={activity.id} className="flex items-start space-x-3">
              <div className="mt-1">{activity.icon}</div>
              <div>
                <p className="text-gray-700 text-sm">{activity.text}</p>
                <span className="text-xs text-gray-500">{activity.time}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
