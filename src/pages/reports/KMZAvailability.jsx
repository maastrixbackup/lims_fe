// KMZAvailability.jsx
import React from "react";
import { MapPin } from "lucide-react";

const KMZAvailability = ({ kmz }) => {
  // Dummy data (only when no KMZ data is passed)
  const dummyKMZ = [
    {
      village: "Village A",
      khata: "12",
      plot: "101",
      file: "villageA_plot101.kmz",
    },
    {
      village: "Village B",
      khata: "45",
      plot: "202",
      file: "villageB_plot202.kmz",
    },
    {
      village: "Village C",
      khata: "78",
      plot: "303",
      file: "villageC_plot303.kmz",
    },
  ];

  const dataToUse = kmz?.length ? kmz : dummyKMZ;

  return (
    <div>
      {/* <h2 className="text-xl font-bold mb-4">KMZ Availability Report</h2> */}

      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Village</th>
            <th className="p-2 border">Khata</th>
            <th className="p-2 border">Plot</th>
            <th className="p-2 border">KMZ File</th>
          </tr>
        </thead>

        <tbody>
          {dataToUse.map((k, i) => (
            <tr key={i}>
              <td className="p-2 border">{k.village}</td>
              <td className="p-2 border">{k.khata}</td>
              <td className="p-2 border">{k.plot}</td>
              <td className="p-2 border text-blue-600 cursor-pointer">
                {k.file}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default KMZAvailability;
