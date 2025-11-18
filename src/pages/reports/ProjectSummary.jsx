// ProjectSummary.jsx
import React from "react";
import { BarChart } from "lucide-react";

const ProjectSummary = ({ data }) => {
  // Dummy data (used when no real data is passed)
  const dummyData = [
    {
      project: "Smart City Development",
      villages: 12,
      khatas: 340,
      area: 156.5,
      acquisition: 78,
    },
    {
      project: "Railway Expansion Project",
      villages: 8,
      khatas: 220,
      area: 98.3,
      acquisition: 56,
    },
    {
      project: "Industrial Corridor",
      villages: 15,
      khatas: 410,
      area: 203.1,
      acquisition: 67,
    },
  ];

  const dataToUse = data?.length ? data : dummyData;

  return (
    <div>
      {/* <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <BarChart /> Project Summary
      </h2> */}

      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Project</th>
            <th className="p-2 border">Villages</th>
            <th className="p-2 border">Total Khatas</th>
            <th className="p-2 border">Total Area</th>
            <th className="p-2 border">Land Acquisition Progress</th>
          </tr>
        </thead>

        <tbody>
          {dataToUse.map((p, i) => (
            <tr key={i}>
              <td className="p-2 border">{p.project}</td>
              <td className="p-2 border">{p.villages}</td>
              <td className="p-2 border">{p.khatas}</td>
              <td className="p-2 border">{p.area} Acre</td>
              <td className="p-2 border">{p.acquisition}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectSummary;
