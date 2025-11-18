// UserActivityLog.jsx
import React from "react";
import { User } from "lucide-react";

const dummyLogs = [
  {
    user: "Admin",
    action: "Logged in",
    file_uploads: "",
    views: "",
    deletion: "",
    login_history: ""
  },
  {
    user: "Admin",
    action: "Uploaded a file",
    file_uploads: "report.pdf",
    views: "",
    deletion: "",
    login_history: ""
  },
  {
    user: "Admin",
    action: "Viewed dashboard",
    file_uploads: "",
    views: "dashboard",
    deletion: "",
    login_history: ""
  },
  {
    user: "Admin",
    action: "Deleted a file",
    file_uploads: "",
    views: "",
    deletion: "archive.zip",
    login_history: ""
  },
];

const UserActivity = ({ logs = dummyLogs }) => {
  return (
    <div >
      {/* <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <User size={20} /> User Activity Log
      </h2> */}

      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">User</th>
            <th className="p-2 border">Action</th>
            <th className="p-2 border">File Uploads</th>
            <th className="p-2 border">Views</th>
            <th className="p-2 border">Deletion</th>
            <th className="p-2 border">Login History</th>
          </tr>
        </thead>

        <tbody>
          {logs.map((l, i) => (
            <tr key={i}>
              <td className="p-2 border">{l.user}</td>
              <td className="p-2 border">{l.action}</td>
              <td className="p-2 border">{l.file_uploads || "-"}</td>
              <td className="p-2 border">{l.views || "-"}</td>
              <td className="p-2 border">{l.deletion || "-"}</td>
              <td className="p-2 border">{l.login_history || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserActivity;
