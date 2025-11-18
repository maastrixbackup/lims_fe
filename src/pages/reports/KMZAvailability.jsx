import React, { useState, useMemo } from "react";
import { MapPin, Search, Filter } from "lucide-react";

const KMZAvailability = ({ kmz }) => {
  const dummyKMZ = [
    { village: "Village A", khata: "12", plot: "101", file: "villageA_plot101.kmz" },
    { village: "Village B", khata: "45", plot: "202", file: "villageB_plot202.kmz" },
    { village: "Village C", khata: "78", plot: "303", file: "" },
  ];

  const dataToUse = kmz?.length ? kmz : dummyKMZ;

  const StatusBadge = ({ missing }) => (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${
        missing ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
      }`}
    >
      {missing ? "Missing" : "Available"}
    </span>
  );

  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");

  const filteredData = useMemo(() => {
    return dataToUse.filter((item) => {
      const combined = `${item.village} ${item.khata} ${item.plot} ${item.file}`.toLowerCase();

      if (!combined.includes(search.toLowerCase())) return false;
      if (filterType === "available") return item.file !== "";
      if (filterType === "missing") return item.file === "";

      return true;
    });
  }, [search, filterType, dataToUse]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <MapPin size={20} /> KMZ Availability Report
      </h2>

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex items-center bg-gray-100 px-3 py-2 rounded-lg w-full sm:w-64">
          <Search size={16} className="text-gray-500 mr-2" />
          <input
            placeholder="Search village, khata, plot..."
            className="bg-transparent outline-none text-sm w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center bg-gray-100 px-3 py-2 rounded-lg">
          <Filter size={16} className="text-gray-500 mr-2" />
          <select
            className="bg-transparent outline-none text-sm"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">All</option>
            <option value="available">KMZ Available</option>
            <option value="missing">KMZ Missing</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl shadow-sm">
        <table className="w-full">
          <thead className="bg-gray-200 text-gray-700 uppercase text-xs font-semibold">
            <tr>
              <th className="p-3 text-left">Village</th>
              <th className="p-3 text-left">Khata</th>
              <th className="p-3 text-left">Plot</th>
              <th className="p-3 text-left">KMZ File</th>
              <th className="p-3 text-left">Status</th>
            </tr>
          </thead>

          <tbody className="text-sm">
            {filteredData.map((k, i) => (
              <tr key={i} className="hover:bg-gray-50 transition-all">
                <td className="p-3">{k.village}</td>
                <td className="p-3">{k.khata}</td>
                <td className="p-3">{k.plot}</td>
                <td className="p-3 text-blue-600 cursor-pointer hover:underline">
                  {k.file || "-"}
                </td>
                <td className="p-3">
                  <StatusBadge missing={!k.file} />
                </td>
              </tr>
            ))}

            {filteredData.length === 0 && (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500">
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default KMZAvailability;
