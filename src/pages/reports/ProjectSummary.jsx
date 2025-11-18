// ProjectSummary.jsx
import React, { useState, useMemo } from "react";
import { BarChart, Search, Filter } from "lucide-react";

const ProjectSummary = ({ data }) => {
  const dummyData = [
    { project: "Smart City Development", villages: 12, khatas: 340, area: 156.5, acquisition: 78 },
    { project: "Railway Expansion Project", villages: 8, khatas: 220, area: 98.3, acquisition: 56 },
    { project: "Industrial Corridor", villages: 15, khatas: 410, area: 203.1, acquisition: 67 },
  ];

  const dataToUse = data?.length ? data : dummyData;

  // -------------------------------------
  // 🔍 Filters
  // -------------------------------------
  const [search, setSearch] = useState("");
  const [acqFilter, setAcqFilter] = useState("");
  const [villageFilter, setVillageFilter] = useState("");

  const filteredData = useMemo(() => {
    return dataToUse.filter((item) => {
      const matchesSearch = item.project.toLowerCase().includes(search.toLowerCase());
      const matchesAcq =
        acqFilter === ""
          ? true
          : acqFilter === "50"
          ? item.acquisition >= 50
          : acqFilter === "70"
          ? item.acquisition >= 70
          : true;

      const matchesVillage =
        villageFilter === ""
          ? true
          : villageFilter === "10"
          ? item.villages >= 10
          : villageFilter === "15"
          ? item.villages >= 15
          : true;

      return matchesSearch && matchesAcq && matchesVillage;
    });
  }, [search, acqFilter, villageFilter, dataToUse]);

  // -------------------------------------
  // UI
  // -------------------------------------
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <BarChart className="text-blue-600" /> Project Summary
      </h2>

      {/* ------------------- FILTERS ------------------- */}
      <div className="bg-white p-4 rounded-xl shadow mb-4 flex flex-wrap gap-4 items-center">

        {/* Search */}
        <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg w-full md:w-60">
          <Search size={18} className="text-gray-500" />
          <input
            type="text"
            placeholder="Search project..."
            className="bg-transparent outline-none text-sm w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Acquisition Filter */}
        <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg">
          <Filter size={18} className="text-gray-600" />
          <select
            className="bg-transparent outline-none text-sm"
            value={acqFilter}
            onChange={(e) => setAcqFilter(e.target.value)}
          >
            <option value="">Acquisition %</option>
            <option value="50">Above 50%</option>
            <option value="70">Above 70%</option>
          </select>
        </div>

        {/* Village Filter */}
        <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg">
          <Filter size={18} className="text-gray-600" />
          <select
            className="bg-transparent outline-none text-sm"
            value={villageFilter}
            onChange={(e) => setVillageFilter(e.target.value)}
          >
            <option value="">Village Count</option>
            <option value="10">10+ Villages</option>
            <option value="15">15+ Villages</option>
          </select>
        </div>
      </div>

      {/* ------------------- TABLE ------------------- */}
      <div className="overflow-hidden rounded-xl shadow bg-white">
        <table className="w-full">
          <thead className="bg-gray-200 text-black text-sm">
            <tr>
              <th className="p-3 text-left font-semibold">Project</th>
              <th className="p-3 text-left font-semibold">Villages</th>
              <th className="p-3 text-left font-semibold">Total Khatas</th>
              <th className="p-3 text-left font-semibold">Total Area</th>
              <th className="p-3 text-left font-semibold">Acquisition</th>
            </tr>
          </thead>

          <tbody>
            {filteredData.map((p, i) => (
              <tr key={i} className="hover:bg-gray-100 transition">
                <td className="p-3 font-medium">{p.project}</td>
                <td className="p-3">{p.villages}</td>
                <td className="p-3">{p.khatas}</td>
                <td className="p-3">{p.area} Acre</td>

                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <span>{p.acquisition}%</span>
                    <div className="w-28 h-2 bg-gray-200 rounded-full">
                      <div
                        className="h-2 rounded-full bg-blue-600"
                        style={{ width: `${p.acquisition}%` }}
                      />
                    </div>
                  </div>
                </td>
              </tr>
            ))}

            {filteredData.length === 0 && (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500">
                  No matching projects found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProjectSummary;
