import React from "react";

const ProjectMasterTable = () => {
  const headers = [
    "Project ID",
    "Proposal Number",
    "Project Name",
    "User Agency",
    "Sector",
    "State",
    "District",
    "Tahasil",
    "Mouza",
    "Range / Division",
    "Forest Type",
    "Total Project Area (ha)",
    "Forest Area (ha)",
    "Non Forest Area (ha)",
    "Project Status",
  ];

  return (
    <div className="overflow-x-auto p-4" style={{scrollbarWidth:"thin"}}>
      <table className="table table-bordered table-sm w-full">
        <thead className="bg-gradient-to-r from-[#7A69E1] to-[#7A69E1] text-white text-sm sticky top-0 z-20">
          <tr>
            {headers.map((header, index) => (
              <th key={index} className="text-center whitespace-nowrap">
                {header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {/* sample empty row */}
          <tr>
            {headers.map((_, index) => (
              <td key={index} className="text-center text-gray-400">
                —
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ProjectMasterTable;
