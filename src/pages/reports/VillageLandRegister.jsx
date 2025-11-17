// VillageLandRegister.jsx
import React from "react";
import { FileText } from "lucide-react";

const VillageLandRegister = () => {
  // ------------------------------
  // ✅ Dummy Data (Replace with API later)
  // ------------------------------
  const villages = [
    {
      name: "Village A",
      totalKhatas: 18,
      totalPlots: 72,
      totalArea: 154.2,
      govtLand: 40.5,
      privateLand: 113.7,
    },
    {
      name: "Village B",
      totalKhatas: 10,
      totalPlots: 41,
      totalArea: 89.6,
      govtLand: 12.0,
      privateLand: 77.6,
    },
    {
      name: "Village C",
      totalKhatas: 25,
      totalPlots: 103,
      totalArea: 224.9,
      govtLand: 55.3,
      privateLand: 169.6,
    },
  ];

  return (
    <div>
      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Village</th>
            <th className="p-2 border">Total Khatas</th>
            <th className="p-2 border">Total Plots</th>
            <th className="p-2 border">Total Area</th>
            <th className="p-2 border">Govt Land</th>
            <th className="p-2 border">Private Land</th>
            <th className="p-2 border">View</th>
          </tr>
        </thead>

        <tbody>
          {villages.map((v, i) => (
            <tr key={i}>
              <td className="p-2 border">{v.name}</td>
              <td className="p-2 border">{v.totalKhatas}</td>
              <td className="p-2 border">{v.totalPlots}</td>
              <td className="p-2 border">{v.totalArea} Acre</td>
              <td className="p-2 border">{v.govtLand} Acre</td>
              <td className="p-2 border">{v.privateLand} Acre</td>

              <td className="p-2 border text-center">
                <button className="text-blue-600 hover:underline">
                  <FileText size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VillageLandRegister;
