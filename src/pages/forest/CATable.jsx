import React, { useState, useMemo } from "react";
import { ChevronDown } from "lucide-react";
import FilterSortHeader from "./FilterSortHeader";

const CATable = ({ data = [], onEdit }) => {
  const [filters, setFilters] = useState({});
  const [sortConfig, setSortConfig] = useState({
    field: null,
    direction: null,
  });

  const getUniqueOptions = (field) => {
    return [...new Set(data.map((item) => item[field]).filter(Boolean))];
  };

  const filteredAndSortedData = useMemo(() => {
    let result = [...data];

    Object.entries(filters).forEach(([field, values]) => {
      if (values?.length) {
        result = result.filter((row) => values.includes(row[field]));
      }
    });


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
      className="max-h-[400px] overflow-x-auto bg-base-100 shadow"
      style={{ scrollbarWidth: "thin" }}
    >
      <table className="table w-full">
        <thead className="bg-gradient-to-r from-[#7A69E1] to-[#4F46E5] text-white text-sm sticky top-0 z-20">
          <tr>
            <th>Sl/No</th>

            {[
              ["district", "District"],
              ["ri_circle", "RI Circle"],
              ["tahasil", "Tahasil"],
              ["village", "Village"],
              ["khata_no", "Khata No"],
              ["plot_no", "Plot No"],
              ["kisam", "Kisam"],
              ["ownership", "Ownership"],
              ["total_area_ha", "Total Area (ha)"],
              ["ca_area_ha", "CA Area"],
              ["patch_name", "Patch Name"],
              ["forest_division", "Forest Division"],
              ["remarks", "Remarks"],
            ].map(([field, label]) => (
              <FilterSortHeader
                key={field}
                label={label}
                field={field}
                options={getUniqueOptions(field)}
                filters={filters}
                setFilters={setFilters}
                sortConfig={sortConfig}
                setSortConfig={setSortConfig}
              />
            ))}

            <th className="text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredAndSortedData.length === 0 ? (
            <tr>
              <td colSpan={14} className="text-center py-6">
                No data found
              </td>
            </tr>
          ) : (
            filteredAndSortedData.map((row, index) => (
              <tr key={row.id ?? index} className="hover">
                <td>{index + 1}</td>
                <td>{row.district}</td>
                <td>{row.ri_circle}</td>
                <td>{row.tahasil}</td>
                <td>{row.village}</td>
                <td>{row.khata_no}</td>
                <td>{row.plot_no}</td>
                <td>{row.kisam}</td>
                <td>{row.ownership}</td>
                <td>{row.total_area_ha}</td>
                <td>{row.ca_area_ha}</td>
                <td>{row.patch_name}</td>
                <td>{row.forest_division}</td>
                <td>{row.remarks}</td>
                <td className="text-center">
                  <div className="dropdown dropdown-end">
                    <label tabIndex={0} className="btn btn-sm btn-outline">
                      <ChevronDown size={16} />
                    </label>
                    <ul className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-32">
                      <li>
                        <button type="button">View</button>
                      </li>
                      <li>
                        <button type="button" onClick={() => onEdit(row)}>
                          Edit
                        </button>
                      </li>
                      <li>
                        <button type="button" className="text-error">
                          Delete
                        </button>
                      </li>
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

export default CATable;
