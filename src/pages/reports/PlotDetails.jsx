import React from "react";
import { MapPin } from "lucide-react";

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

  return (
    <div>
      {/* <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
        <MapPin className="text-primary" /> Plot Details Report
      </h2> */}

      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead className="bg-gray-100">
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
            {mockData.map((row, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td>{i + 1}</td>
                <td>{row.plotNo}</td>
                <td>{row.khataNo}</td>
                <td>{row.area}</td>
                <td>{row.landType}</td>
                <td>{row.coordinates}</td>
                <td>{row.village}</td>
                <td>{row.project}</td>
                <td>{row.owner}</td>
                <td>{row.status}</td>
                <td>{row.kmz}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
