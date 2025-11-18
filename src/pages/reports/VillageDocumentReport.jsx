// VillageDocumentReport.jsx
import React from "react";
import { CheckCircle, XCircle } from "lucide-react";

const dummyDocuments = [
  {
    village: "Kalinga",
    ror: true,
    maps: true,
    survey: false,
  },
  {
    village: "Badamba",
    ror: true,
    maps: false,
    survey: true,
  },
  {
    village: "Nuagaon",
    ror: false,
    maps: false,
    survey: false,
  },
  {
    village: "Gopinathpur",
    ror: true,
    maps: true,
    survey: true,
  },
];

const VillageDocumentReport = ({ documents = dummyDocuments }) => {
  const ok = <CheckCircle className="text-green-600 mx-auto" />;
  const no = <XCircle className="text-red-600 mx-auto" />;

  return (
    <div>
      {/* <h2 className="text-xl font-bold mb-4">Village Document Report</h2> */}

      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Village</th>
            <th className="p-2 border">ROR</th>
            <th className="p-2 border">Maps</th>
            <th className="p-2 border">Survey Documents</th>
          </tr>
        </thead>

        <tbody>
          {documents.map((item, i) => (
            <tr key={i}>
              <td className="p-2 border">{item.village}</td>
              <td className="p-2 border text-center">{item.ror ? ok : no}</td>
              <td className="p-2 border text-center">{item.maps ? ok : no}</td>
              <td className="p-2 border text-center">{item.survey ? ok : no}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VillageDocumentReport;
