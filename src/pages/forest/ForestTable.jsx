import React, { useMemo, useState } from "react";
import FilterSortHeader from "./FilterSortHeader";
import { useSelector } from "react-redux";

const ForestTable = ({ data = [], onEdit, onDelete }) => {
  const [filters, setFilters] = useState({});
  const [sortConfig, setSortConfig] = useState({
    field: null,
    direction: null,
  });

  const stickyActionHeader =
    "p-3 text-right bg-gradient-to-r from-[#7A69E1] to-[#7A69E1] text-white md:sticky md:right-0 z-[30] shadow-md";
  const stickyActionCell =
    "text-right font-bold md:sticky md:right-0 border-gray-100 shadow-sm bg-white";

  const userRole = useSelector((s) => s.auth.user?.role_name);
  const canEdit = userRole !== "Viewer";
  const canDelete = !(userRole === "Data Entry User" || userRole === "Viewer");

  // Forest Category Mapping
  const mapForestCategory = {
    1: "Revenue Forest",
    2: "Reserved Forest",
    3: "Proposed Reserved Forest",
    4: "Protected Forest",
    5: "Sabik Forest",
    6: "DLC Forest",
    7: "Others Forest",
  };

  // Get unique options for filter dropdowns
  const getUniqueOptions = (field) => {
    if (field === "forest_category_id") {
      return [...new Set(data.map((item) => item[field]).filter(Boolean))].map(
        (id) => ({
          value: id,
          label: mapForestCategory[id],
        })
      );
    }
    return [...new Set(data.map((item) => item[field]).filter(Boolean))];
  };

  // Filter and Sort data
  const filteredAndSortedData = useMemo(() => {
    let result = [...data];

    Object.entries(filters).forEach(([field, values]) => {
      if (values?.length) {
        result = result.filter((row) =>
          field === "forest_category_id"
            ? values.includes(mapForestCategory[row[field]])
            : values.includes(row[field])
        );
      }
    });

    if (sortConfig.field) {
      result.sort((a, b) => {
        const aVal =
          sortConfig.field === "forest_category_id"
            ? mapForestCategory[a[sortConfig.field]]
            : a[sortConfig.field];
        const bVal =
          sortConfig.field === "forest_category_id"
            ? mapForestCategory[b[sortConfig.field]]
            : b[sortConfig.field];

        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, filters, sortConfig]);

  return (
    <div
      className="max-h-[400px] overflow-x-auto bg-base-100 shadow whitespace-nowrap"
      style={{ scrollbarWidth: "thin" }}
    >
      <table className="table w-full">
        <thead className="bg-gradient-to-r from-[#7A69E1] to-[#7A69E1] text-white text-sm sticky top-0 z-20">
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
              options={getUniqueOptions("forest_category_id").map(
                (opt) => opt.label
              )}
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

            <th className={stickyActionHeader}>Actions</th>
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
                <td>{row.district || "No Data"}</td>
                <td>{row.ri_circle || "No Data"}</td>
                <td>{row.forest_division || "No Data"}</td>
                <td>{row.forest_range || "No Data"}</td>
                <td>{row.village || "No Data"}</td>
                <td>{row.khata_no || "No Data"}</td>
                <td>{row.plot_no || "No Data"}</td>
                <td>{row.kisam || "No Data"}</td>
                <td>{row.total_area_ha || "No Data"}</td>
                <td>{mapForestCategory[row.forest_category_id] || "No Data"}</td>
                <td>{row.proposed_acquired_area_ha}</td>
                <td>{row.remarks || "No Data"}</td>
                <td className={stickyActionCell}>
                  <select
                    className="select select-sm bg-gray-100 border border-gray-300 w-[42px]"
                    defaultValue=""
                    onChange={(e) => {
                      const action = e.target.value;
                      e.target.value = "";

                      if (action === "edit" && canEdit) onEdit(row);
                      if (action === "delete" && canDelete) onDelete(row);
                    }}
                  >
                    <option value="" disabled>
                      Actions
                    </option>

                    <option
                      value="edit"
                      disabled={userRole === "Viewer"}
                      className={`text-md text-gray-700 font-bold ${
                        userRole === "Viewer" ? "!text-gray-400" : ""
                      }`}
                    >
                      ✏️ Edit
                    </option>

                    <option
                      value="delete"
                      disabled={!canDelete}
                      className={`text-md text-gray-700 font-bold ${
                        !canDelete ? "!text-gray-400" : ""
                      }`}
                    >
                      🗑 Delete
                    </option>
                  </select>
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
