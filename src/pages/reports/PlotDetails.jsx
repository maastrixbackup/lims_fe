import React, { useState } from "react";
import { MapPin, Search } from "lucide-react";

export default function PlotDetails() {
  const mockData = [
    {
      plotNo: "45",
      khataNo: "102/3",
      area: "0.25 Acre",
      landType: "Agriculture",
      coordinates: "21.23123, 85.31231",
      village: "Bhalunki",
      project: "NH-53",
      owner: "Ramesh Pradhan",
      status: "Acquired",
      kmz: "Yes",
    },
  ];

  const [searchPlot, setSearchPlot] = useState("");
  const [searchKhata, setSearchKhata] = useState("");
  const [villageFilter, setVillageFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const filterClass =
    "border border-primary/50 rounded-lg px-3 py-2 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition";

  const filteredData = mockData.filter((row) => {
    return (
      row.plotNo.toLowerCase().includes(searchPlot.toLowerCase()) &&
      row.khataNo.toLowerCase().includes(searchKhata.toLowerCase()) &&
      (villageFilter ? row.village === villageFilter : true) &&
      (statusFilter ? row.status === statusFilter : true)
    );
  });

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
        <MapPin className="text-primary" /> Plot Details
      </h2>
        <div className="grid md:grid-cols-4 grid-cols-1 gap-4 mb-6">

          <div>
            <label className="text-sm font-medium mb-1 block">Plot No</label>
            <input
              type="text"
              placeholder="Search Plot No"
              className={filterClass}
              value={searchPlot}
              onChange={(e) => setSearchPlot(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Khata No</label>
            <input
              type="text"
              placeholder="Search Khata No"
              className={filterClass}
              value={searchKhata}
              onChange={(e) => setSearchKhata(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Village</label>
            <select
              className={filterClass}
              value={villageFilter}
              onChange={(e) => setVillageFilter(e.target.value)}
            >
              <option value="">All Villages</option>
              <option value="Bhalunki">Bhalunki</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Status</label>
            <select
              className={filterClass}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="Acquired">Acquired</option>
              <option value="Pending">Pending</option>
            </select>
          </div>

        </div>
   
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead className="bg-gray-200 text-gray-700 uppercase text-xs">
            <tr>
              <th>Sl/No</th>
              <th>Plot No</th>
              <th>Khata No</th>
              <th>Area</th>
              <th>Land Type</th>
              <th>Coordinates</th>
              <th>Village</th>
              <th>Project</th>
              <th>Owner</th>
              <th>Status</th>
              <th>KMZ</th>
            </tr>
          </thead>

          <tbody>
            {filteredData.map((row, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="py-3 px-4">{i + 1}</td>
                <td className="py-3 px-4">{row.plotNo}</td>
                <td className="py-3 px-4">{row.khataNo}</td>
                <td className="py-3 px-4">{row.area}</td>
                <td className="py-3 px-4">{row.landType}</td>
                <td className="py-3 px-4">{row.coordinates}</td>
                <td className="py-3 px-4">{row.village}</td>
                <td className="py-3 px-4">{row.project}</td>
                <td className="py-3 px-4">{row.owner}</td>
                <td className="py-3 px-4">{row.status}</td>
                <td className="py-3 px-4">{row.kmz}</td>
              </tr>
            ))}

            {filteredData.length === 0 && (
              <tr>
                <td colSpan="11" className="text-center py-4 text-gray-500">
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
