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

const ForestTable = ({ data = [] }) => {
  const [filters, setFilters] = useState({});
  const [sortConfig, setSortConfig] = useState({
    field: null,
    direction: null,
  });

  // 🔹 Utility for dropdown options
  const getUniqueOptions = (field) => {
    return [...new Set(data.map((item) => item[field]).filter(Boolean))];
  };

  // 🔹 Filter + Sort
  const filteredAndSortedData = useMemo(() => {
    let result = [...data];

    // Filters
    Object.entries(filters).forEach(([field, values]) => {
      if (values?.length) {
        result = result.filter((row) =>
          values.includes(row[field])
        );
      }
    });

    // Sorting
    if (sortConfig.field) {
      result.sort((a, b) => {
        const aVal = a[sortConfig.field];
        const bVal = b[sortConfig.field];

        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, filters, sortConfig]);

  return (
    <div
      className="overflow-x-auto bg-base-100 shadow"
      style={{ scrollbarWidth: "thin" }}
    >
      <table className="table w-full">
        <thead className="bg-primary/70 text-white text-sm">
          <tr>
            <th>Sl/No</th>

            <FilterSortHeader
              label="District"
              field="district"
              options={getUniqueOptions("district")}
              filters={filters}
              setFilters={setFilters}
              sortConfig={sortConfig}
              setSortConfig={setSortConfig}
            />

            <FilterSortHeader
              label="RI Circle"
              field="ri_circle"
              options={getUniqueOptions("ri_circle")}
              filters={filters}
              setFilters={setFilters}
              sortConfig={sortConfig}
              setSortConfig={setSortConfig}
            />

            <FilterSortHeader
              label="Forest Division"
              field="forest_division"
              options={getUniqueOptions("forest_division")}
              filters={filters}
              setFilters={setFilters}
              sortConfig={sortConfig}
              setSortConfig={setSortConfig}
            />

            <FilterSortHeader
              label="Range"
              field="forest_range"
              options={getUniqueOptions("forest_range")}
              filters={filters}
              setFilters={setFilters}
              sortConfig={sortConfig}
              setSortConfig={setSortConfig}
            />

            <FilterSortHeader
              label="Village"
              field="village"
              options={getUniqueOptions("village")}
              filters={filters}
              setFilters={setFilters}
              sortConfig={sortConfig}
              setSortConfig={setSortConfig}
            />

            <FilterSortHeader
              label="Khata No"
              field="khata_no"
              options={getUniqueOptions("khata_no")}
              filters={filters}
              setFilters={setFilters}
              sortConfig={sortConfig}
              setSortConfig={setSortConfig}
            />

            <FilterSortHeader
              label="Plot No"
              field="plot_no"
              options={getUniqueOptions("plot_no")}
              filters={filters}
              setFilters={setFilters}
              sortConfig={sortConfig}
              setSortConfig={setSortConfig}
            />

            <FilterSortHeader
              label="Kisam"
              field="kisam"
              options={getUniqueOptions("kisam")}
              filters={filters}
              setFilters={setFilters}
              sortConfig={sortConfig}
              setSortConfig={setSortConfig}
            />

            <FilterSortHeader
              label="Total Area (ha)"
              field="total_area_ha"
              options={getUniqueOptions("total_area_ha")}
              filters={filters}
              setFilters={setFilters}
              sortConfig={sortConfig}
              setSortConfig={setSortConfig}
            />

            <FilterSortHeader
              label="Forest Category"
              field="forest_category_id"
              options={getUniqueOptions("forest_category_id")}
              filters={filters}
              setFilters={setFilters}
              sortConfig={sortConfig}
              setSortConfig={setSortConfig}
            />

            <FilterSortHeader
              label="Proposed Area (ha)"
              field="proposed_acquired_area_ha"
              options={getUniqueOptions("proposed_acquired_area_ha")}
              filters={filters}
              setFilters={setFilters}
              sortConfig={sortConfig}
              setSortConfig={setSortConfig}
            />

            <FilterSortHeader
              label="Remarks"
              field="remarks"
              options={getUniqueOptions("remarks")}
              filters={filters}
              setFilters={setFilters}
              sortConfig={sortConfig}
              setSortConfig={setSortConfig}
            />

            <th className="text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredAndSortedData.length === 0 ? (
            <tr>
              <td colSpan="14" className="text-center py-6">
                No data found
              </td>
            </tr>
          ) : (
            filteredAndSortedData.map((row, index) => (
              <tr key={row.id} className="hover">
                <td>{index + 1}</td>
                <td>{row.district}</td>
                <td>{row.ri_circle}</td>
                <td>{row.forest_division}</td>
                <td>{row.forest_range}</td>
                <td>{row.village}</td>
                <td>{row.khata_no}</td>
                <td>{row.plot_no}</td>
                <td>{row.kisam}</td>
                <td>{row.total_area_ha}</td>
                <td>{row.forest_category_id}</td>
                <td>{row.proposed_acquired_area_ha}</td>
                <td>{row.remarks || "-"}</td>

                <td className="text-center">
                  <div className="dropdown dropdown-end">
                    <label tabIndex={0} className="btn btn-sm btn-outline">
                      <ChevronDown size={16} />
                    </label>
                    <ul className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-32">
                      <li><a>View</a></li>
                      <li><a>Edit</a></li>
                      <li><a className="text-error">Delete</a></li>
                    </ul>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ForestTable;

