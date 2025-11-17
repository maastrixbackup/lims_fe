// ProjectDocumentRegister.jsx
import React from "react";
import { FileText, FileArchive } from "lucide-react";

const ProjectDocumentRegister = ({ docs }) => {
  // Dummy data (used when no props passed)
  const dummyDocs = [
    {
      project: "Smart City Development",
      maps: 12,
      pdfs: 8,
      kmz: 5,
    },
    {
      project: "Railway Expansion Project",
      maps: 7,
      pdfs: 4,
      kmz: 3,
    },
    {
      project: "Industrial Corridor",
      maps: 15,
      pdfs: 10,
      kmz: 9,
    },
  ];

  const documents = docs?.length ? docs : dummyDocs;

  return (
    <div >
      {/* <h2 className="text-xl font-bold mb-4">Project Document Register</h2> */}

      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Project</th>
            <th className="p-2 border">Maps</th>
            <th className="p-2 border">PDFs</th>
            <th className="p-2 border">KMZ</th>
            <th className="p-2 border">View</th>
          </tr>
        </thead>

        <tbody>
          {documents.map((d, i) => (
            <tr key={i}>
              <td className="p-2 border">{d.project}</td>
              <td className="p-2 border">{d.maps}</td>
              <td className="p-2 border">{d.pdfs}</td>
              <td className="p-2 border">{d.kmz}</td>
              <td className="p-2 border text-center">
                <button className="text-blue-600">
                  <FileArchive size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectDocumentRegister;
