// import React from "react";
// import { ChevronDown } from "lucide-react";

// const forestData = [
//   {
//     district: "Angul",
//     riCircle: "Chhendipada",
//     division: "Angul Forest Division",
//     range: "Handigoda",
//     village: "Sahalia",
//     khataNo: "12",
//     plotNo: "45",
//     kisam: "Jungle",
//     category: "Protected Forest",
//     totalArea: "2.50",
//     acquiredArea: "1.20",
//     remarks: "-",
//   },
//   {
//     district: "Dhenkanal",
//     riCircle: "Chhendipada",
//     division: "Angul Forest Division",
//     range: "Handigoda",
//     village: "Sahalia",
//     khataNo: "12",
//     plotNo: "45",
//     kisam: "Jungle",
//     category: "Protected Forest",
//     totalArea: "2.50",
//     acquiredArea: "1.20",
//     remarks: "-",
//   },
// ];

// const ForestTable = () => {
//   return (
//     <div
//       className="overflow-x-auto bg-base-100 shadow"
//       style={{ scrollbarWidth: "thin" }}
//     >
//       <table className="table w-full">
//         <thead className="font-semibold bg-primary/70 text-white">
//           <tr>
//             <th>Sl/No</th>
//             <th>District</th>
//             <th>RI Circle</th>
//             <th>Forest Division</th>
//             <th>Range</th>
//             <th>Village</th>
//             <th>Khata No</th>
//             <th>Plot No</th>
//             <th>Kisam</th>
//             <th>Total Area (ha)</th>
//             <th>Forest Category</th>
//             <th>Proposed / Acquired Area (ha)</th>
//             <th>Remarks</th>
//             <th className="text-center">Actions</th>
//           </tr>
//         </thead>

//         {/* Body */}
//         <tbody>
//           {forestData.map((row, index) => (
//             <tr key={index} className="hover">
//               <td>{index + 1}</td>
//               <td>{row.district}</td>
//               <td>{row.riCircle}</td>
//               <td>{row.division}</td>
//               <td>{row.range}</td>
//               <td>{row.village}</td>
//               <td>{row.khataNo}</td>
//               <td>{row.plotNo}</td>
//               <td>{row.kisam}</td>
//               <td>{row.totalArea}</td>
//               <td>{row.category}</td>
//               <td>{row.acquiredArea}</td>
//               <td>{row.remarks}</td>

//               {/* Actions */}
//               <td className="text-center">
//                 <div className="dropdown dropdown-end">
//                   <label tabIndex={0} className="btn btn-sm btn-outline">
//                     <ChevronDown size={16} />
//                   </label>
//                   <ul
//                     tabIndex={0}
//                     className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-32"
//                   >
//                     <li>
//                       <a>View</a>
//                     </li>
//                     <li>
//                       <a>Edit</a>
//                     </li>
//                     <li>
//                       <a className="text-error">Delete</a>
//                     </li>
//                   </ul>
//                 </div>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default ForestTable;
import React, { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import FilterSortHeader from "./FilterSortHeader";

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
  const getUniqueOptions = (data, field) => {
    return [...new Set(data.map((item) => item[field]).filter(Boolean))];
  };

  const [filters, setFilters] = useState({});
  const [sortConfig, setSortConfig] = useState({
    field: null,
    direction: null,
  });

  const filteredAndSortedData = useMemo(() => {
    let data = [...forestData];

    // Apply dropdown filters
    Object.entries(filters).forEach(([field, values]) => {
      if (values?.length) {
        data = data.filter((row) => values.includes(row[field]));
      }
    });

    // Apply sorting
    if (sortConfig.field) {
      data.sort((a, b) => {
        const aVal = a[sortConfig.field];
        const bVal = b[sortConfig.field];

        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return data;
  }, [filters, sortConfig]);

  return (
    <div className="overflow-x-auto bg-base-100 shadow">
      <table className="table w-full">
        <thead className="bg-primary/70 text-white text-sm">
          <tr>
            <th>Sl/No</th>

            <FilterSortHeader
              label="District"
              field="district"
              options={getUniqueOptions(forestData, "district")}
              filters={filters}
              setFilters={setFilters}
              sortConfig={sortConfig}
              setSortConfig={setSortConfig}
            />

            <FilterSortHeader
              label="RI Circle"
              field="riCircle"
               options={getUniqueOptions(forestData, "riCircle")}
              filters={filters}
              setFilters={setFilters}
              sortConfig={sortConfig}
              setSortConfig={setSortConfig}
            />

            <FilterSortHeader
              label="Forest Division"
              field="division"
               options={getUniqueOptions(forestData, "division")}
              filters={filters}
              setFilters={setFilters}
              sortConfig={sortConfig}
              setSortConfig={setSortConfig}
            />

            <FilterSortHeader
              label="Range"
              field="range"
               options={getUniqueOptions(forestData, "range")}
              filters={filters}
              setFilters={setFilters}
              sortConfig={sortConfig}
              setSortConfig={setSortConfig}
            />

            <FilterSortHeader
              label="Village"
              field="village"
               options={getUniqueOptions(forestData, "village")}
              filters={filters}
              setFilters={setFilters}
              sortConfig={sortConfig}
              setSortConfig={setSortConfig}
            />

            <FilterSortHeader
              label="Khata No"
              field="khataNo"
               options={getUniqueOptions(forestData, "khataNo")}
              filters={filters}
              setFilters={setFilters}
              sortConfig={sortConfig}
              setSortConfig={setSortConfig}
            />

            <FilterSortHeader
              label="Plot No"
              field="plotNo"
               options={getUniqueOptions(forestData, "plotNo")}
              filters={filters}
              setFilters={setFilters}
              sortConfig={sortConfig}
              setSortConfig={setSortConfig}
            />

            <FilterSortHeader
              label="Kisam"
              field="kisam"
               options={getUniqueOptions(forestData, "kisam")}
              filters={filters}
              setFilters={setFilters}
              sortConfig={sortConfig}
              setSortConfig={setSortConfig}
            />

            <FilterSortHeader
              label="Total Area (ha)"
              field="totalArea"
               options={getUniqueOptions(forestData, "totalArea")}
              filters={filters}
              setFilters={setFilters}
              sortConfig={sortConfig}
              setSortConfig={setSortConfig}
            />

            <FilterSortHeader
              label="Forest Category"
              field="category"
              options={getUniqueOptions(forestData, "category")}
              filters={filters}
              setFilters={setFilters}
              sortConfig={sortConfig}
              setSortConfig={setSortConfig}
            />

            <FilterSortHeader
              label="Proposed Area (ha)"
              field="acquiredArea"
               options={getUniqueOptions(forestData, "acquiredArea")}
              filters={filters}
              setFilters={setFilters}
              sortConfig={sortConfig}
              setSortConfig={setSortConfig}
            />

            <FilterSortHeader
              label="Remarks"
              field="remarks"
              options={getUniqueOptions(forestData, "remarks")}
              filters={filters}
              setFilters={setFilters}
              sortConfig={sortConfig}
              setSortConfig={setSortConfig}
            />

            <th className="text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredAndSortedData.map((row, index) => (
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
              <td>{row.totalArea}</td>
              <td>{row.category}</td>
              <td>{row.acquiredArea}</td>
              <td>{row.remarks}</td>

              <td className="text-center">
                <div className="dropdown dropdown-end">
                  <label tabIndex={0} className="btn btn-sm btn-outline">
                    <ChevronDown size={16} />
                  </label>
                  <ul className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-32">
                    <li>
                      <a>View</a>
                    </li>
                    <li>
                      <a>Edit</a>
                    </li>
                    <li>
                      <a className="text-error">Delete</a>
                    </li>
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
