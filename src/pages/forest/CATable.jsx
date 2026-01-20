import React from "react";
import { ChevronDown } from "lucide-react";

const caData = [
  {
    district: "Angul",
    riCircle: "Chhendipada",
    tahasil: "Handigoda",
    village: "Sahalia",
    khataNo: "22",
    plotNo: "91",
    kisam: "CA Land",
    ownership: "Government",
    caArea: "5.40",
    patch_name: "Compact",
    forest_range: "Handigoda Range",
    remarks: "-",
    total_area:"3 hect"
  },
  {
    district: "Dhenkanal",
    riCircle: "Chhendipada",
    tahasil: "Handigoda",
    village: "Sahalia",
    khataNo: "22",
    plotNo: "91",
    kisam: "CA Land",
    ownership: "Government",
    caArea: "5.40",
    patch_name: "Compact",
    forest_range: "Handigoda Range",
    remarks: "-",
    total_area:"3 hect"
  },
];

const CATable = () => {
  return (
    <div className="overflow-x-auto bg-base-100 shadow" style={{scrollbarWidth:"thin"}}>
      <table className="table w-full">
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
            <th>Total Area (ha)</th>
            <th>CA Area (ha)</th>
            <th>Patch Name</th>
            <th>Forest Range/Division</th>
            <th>Remarks</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>

        {/* Body */}
        <tbody>
          {caData.map((row, index) => (
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
              <td>{row.total_area}</td>
              <td>{row.caArea}</td>
              <td>{row.patch_name}</td>
              <td>{row.forest_range}</td>
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

export default CATable;
