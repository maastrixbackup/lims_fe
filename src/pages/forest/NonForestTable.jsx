import React from "react";
import { ChevronDown } from "lucide-react";

const nonForestData = [
  {
    district: "Angul",
    riCircle: "Chhendipada",
    tahasil: "Handigoda",
    village: "Sahalia",
    khataNo: "15",
    plotNo: "78",
    kisam: "Agricultural",
    ownership: "Private",
    fra: "No",
    totalArea: "3.20",
    acquiredArea: "1.50",
    remarks: "-",
  },
   {
    district: "Cuttack",
    riCircle: "Chhendipada",
    tahasil: "Handigoda",
    village: "Sahalia",
    khataNo: "15",
    plotNo: "78",
    kisam: "Agricultural",
    ownership: "Private",
    fra: "No",
    totalArea: "3.20",
    acquiredArea: "1.50",
    remarks: "-",
  },
];

const NonForestTable = () => {
  return (
    <div className="overflow-x-auto bg-base-100 shadow" style={{scrollbarWidth:"thin"}}>
      <table className="table w-full">
        {/* Header */}
        <thead className="font-semibold bg-primary/70 text-white">
          <tr>
            <th>Sl/No</th>
            <th>District</th>
            <th>RI Circle</th>
            <th>Tahasil</th>
            <th>Village</th>
            <th>Khata No</th>
            <th>Plot No</th>
            <th>Kisam</th>
            <th>Ownership</th>
            <th>Land Allotted Through FRA</th>
            <th>Total Area (ha)</th>
            <th>Proposed / Acquired Area (ha)</th>
            <th>Remarks</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>

        {/* Body */}
        <tbody>
          {nonForestData.map((row, index) => (
            <tr key={index} className="hover">
              <td>{index + 1}</td>
              <td>{row.district}</td>
              <td>{row.riCircle}</td>
              <td>{row.tahasil}</td>
              <td>{row.village}</td>
              <td>{row.khataNo}</td>
              <td>{row.plotNo}</td>
              <td>{row.kisam}</td>
              <td>{row.ownership}</td>
              <td>{row.fra}</td>
              <td>{row.totalArea}</td>
              <td>{row.acquiredArea}</td>
              <td>{row.remarks}</td>

              {/* Actions */}
              <td className="text-center">
                <div className="dropdown dropdown-end">
                  <label tabIndex={0} className="btn btn-sm btn-outline">
                    <ChevronDown size={16} />
                  </label>
                  <ul
                    tabIndex={0}
                    className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-32"
                  >
                    <li><a>View</a></li>
                    <li><a>Edit</a></li>
                    <li><a className="text-error">Delete</a></li>
                  </ul>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default NonForestTable;
