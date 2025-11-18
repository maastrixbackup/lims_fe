// AuditTrail.jsx
import React from "react";
import { History } from "lucide-react";

const dummyAudits = [
  {
    user: "Admin",
    khata: "KH-1023",
    before: "Owner: Ramesh | Area: 2.5 Acres",
    after: "Owner: Suresh | Area: 2.5 Acres",
    time: "2025-11-17 10:45 AM",
  },
  {
    user: "Surveyor1",
    khata: "KH-2045",
    before: "Area: 1.2 Acres",
    after: "Area: 1.5 Acres",
    time: "2025-11-17 09:32 AM",
  },
  {
    user: "Admin",
    khata: "KH-3401",
    before: "Village: Kalinga",
    after: "Village: Badamba",
    time: "2025-11-16 04:15 PM",
  },
];

const AuditTrail = ({ audits = dummyAudits }) => {
  return (
    <div>
      {/* <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <History size={20} /> Audit Trail
      </h2> */}

      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">User</th>
            <th className="p-2 border">Modified Khata</th>
            <th className="p-2 border">Before</th>
            <th className="p-2 border">After</th>
            <th className="p-2 border">Timestamp</th>
          </tr>
        </thead>

        <tbody>
          {audits.map((a, i) => (
            <tr key={i}>
              <td className="p-2 border">{a.user}</td>
              <td className="p-2 border">{a.khata}</td>
              <td className="p-2 border">{a.before}</td>
              <td className="p-2 border">{a.after}</td>
              <td className="p-2 border">{a.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AuditTrail;
