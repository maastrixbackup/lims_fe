import React from "react";
import { ChevronDown } from "lucide-react";

const forestData = [
  {
    district: "Angul",
    riCircle: "Chhendipada",
    division: "Angul Forest Division",
    range: "Handigoda",
    village: "Sahalia",
    khataNo: "12",
    plotNo: "45",
    kisam: "Jungle",
    category: "Protected Forest",
    totalArea: "2.50",
    acquiredArea: "1.20",
    remarks: "-",
  },
    {
    district: "Dhenkanal",
    riCircle: "Chhendipada",
    division: "Angul Forest Division",
    range: "Handigoda",
    village: "Sahalia",
    khataNo: "12",
    plotNo: "45",
    kisam: "Jungle",
    category: "Protected Forest",
    totalArea: "2.50",
    acquiredArea: "1.20",
    remarks: "-",
  },
];

const ForestTable = () => {
  return (
    <div className="overflow-x-auto bg-base-100 shadow" style={{scrollbarWidth:"thin"}}>
      <table className="table w-full">
        <thead className="font-semibold bg-primary/70 text-white">
          <tr>
            <th>Sl/No</th>
            <th>District</th>
            <th>RI Circle</th>
            <th>Forest Division</th>
            <th>Range</th>
            <th>Village</th>
            <th>Khata No</th>
            <th>Plot No</th>
            <th>Kisam</th>
            <th>Forest Category</th>
            <th>Total Area (ha)</th>
            <th>Proposed / Acquired Area (ha)</th>
            <th>Remarks</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>

        {/* Body */}
        <tbody>
          {forestData.map((row, index) => (
            <tr key={index} className="hover">
              <td>{index + 1}</td>
              <td>{row.district}</td>
              <td>{row.riCircle}</td>
              <td>{row.division}</td>
              <td>{row.range}</td>
              <td>{row.village}</td>
              <td>{row.khataNo}</td>
              <td>{row.plotNo}</td>
              <td>{row.kisam}</td>
              <td>{row.category}</td>
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

export default ForestTable;

