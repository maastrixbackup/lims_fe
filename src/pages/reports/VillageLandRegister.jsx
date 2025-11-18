// VillageLandRegister.jsx
import React, { useState, useMemo } from "react";
import { FileText, Search, Filter } from "lucide-react";

const VillageLandRegister = () => {
  // ------------------------------
  // Dummy Data (Replace later)
  // ------------------------------
  const villages = [
    { name: "Village A", totalKhatas: 18, totalPlots: 72, totalArea: 154.2, govtLand: 40.5, privateLand: 113.7 },
    { name: "Village B", totalKhatas: 10, totalPlots: 41, totalArea: 89.6, govtLand: 12.0, privateLand: 77.6 },
    { name: "Village C", totalKhatas: 25, totalPlots: 103, totalArea: 224.9, govtLand: 55.3, privateLand: 169.6 },
  ];

  // ---------------- Filters ----------------
  const [search, setSearch] = useState("");
  const [areaFilter, setAreaFilter] = useState("All");
  const [govtFilter, setGovtFilter] = useState("All");

  // ---------------- Filter Logic ----------------
  const filteredData = useMemo(() => {
    return villages
      .filter((v) =>
        v.name.toLowerCase().includes(search.toLowerCase())
      )
      .filter((v) => {
        if (areaFilter === "Below100") return v.totalArea < 100;
        if (areaFilter === "100to200") return v.totalArea >= 100 && v.totalArea <= 200;
        if (areaFilter === "Above200") return v.totalArea > 200;
        return true;
      })
      .filter((v) => {
        const ratio = (v.govtLand / v.totalArea) * 100;
        if (govtFilter === "High") return ratio >= 30;
        if (govtFilter === "Low") return ratio < 30;
        return true;
      });
  }, [search, areaFilter, govtFilter]);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-5 flex items-center gap-2 text-gray-800">
        <FileText className="text-primary" /> Village Land Register
      </h2>

      {/* 🔹 FILTER BAR */}
      <div className="flex flex-wrap items-center gap-3 bg-gray-50 p-4 rounded-lg shadow-sm mb-4">

        {/* Search */}
        <div className="flex items-center bg-white px-3 py-2 rounded-lg shadow-sm border border-primary">
          <Search size={18} className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search village..."
            className="bg-transparent focus:outline-none text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Area Filter */}
        <select
          value={areaFilter}
          onChange={(e) => setAreaFilter(e.target.value)}
          className="px-3 py-2 text-sm border border-primary rounded-lg bg-white shadow-sm"
        >
          <option value="All">All Area</option>
          <option value="Below100">Below 100 acres</option>
          <option value="100to200">100 - 200 acres</option>
          <option value="Above200">Above 200 acres</option>
        </select>

        {/* Govt Land Filter */}
        <select
          value={govtFilter}
          onChange={(e) => setGovtFilter(e.target.value)}
          className="px-3 py-2 text-sm border border-primary rounded-lg bg-white shadow-sm"
        >
          <option value="All">All Govt %</option>
          <option value="High">High Govt Land (≥ 30%)</option>
          <option value="Low">Low Govt Land (&lt; 30%)</option>
        </select>

      </div>

      {/* TABLE */}
      <div className="overflow-x-auto rounded-xl shadow">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="bg-gray-200 text-gray-700 uppercase text-xs">
            <tr>
              <th className="py-3 px-4">Village</th>
              <th className="py-3 px-4">Total Khatas</th>
              <th className="py-3 px-4">Total Plots</th>
              <th className="py-3 px-4">Total Area</th>
              <th className="py-3 px-4">Govt Land</th>
              <th className="py-3 px-4">Private Land</th>
              <th className="py-3 px-4 text-center">View</th>
            </tr>
          </thead>

          <tbody>
            {filteredData.map((v, i) => (
              <tr
                key={i}
                className={`${
                  i % 2 === 0 ? "bg-white" : "bg-gray-50"
                } hover:bg-blue-50 transition duration-200`}
              >
                <td className="py-3 px-4 font-medium text-gray-800">{v.name}</td>
                <td className="py-3 px-4">{v.totalKhatas}</td>
                <td className="py-3 px-4">{v.totalPlots}</td>
                <td className="py-3 px-4">{v.totalArea} Acre</td>
                <td className="py-3 px-4">
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                    {v.govtLand} Acre
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                    {v.privateLand} Acre
                  </span>
                </td>

                <td className="py-3 px-4 text-center">
                  <button className="text-primary hover:scale-110 transition">
                    <FileText size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredData.length === 0 && (
          <p className="text-center py-4 text-gray-600">No records found.</p>
        )}
      </div>
    </div>
  );
};

export default VillageLandRegister;
