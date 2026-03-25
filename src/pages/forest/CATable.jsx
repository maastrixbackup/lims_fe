import React, { useState, useMemo } from "react";
import { ChevronDown } from "lucide-react";
import FilterSortHeader from "./FilterSortHeader";
import { useSelector } from "react-redux";

const CATable = ({ data = [], onEdit, onDelete }) => {
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
  const selectedProject = useSelector((state) => state.selectedProject.project);

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
    <>
      {(!selectedProject || filteredAndSortedData.length === 0) && (
        <div className="py-10 text-center text-gray-600">
          {!selectedProject ? (
            <>
              <p className="text-lg font-medium">
                Please{" "}
                <span className="text-primary font-semibold">
                  Select a Project
                </span>{" "}
                first.
              </p>
              <p className="text-lg text-gray-500 mt-1">
                A project is required to view CA/ACA Land Schedule list.
              </p>
            </>
          ) : (
            <>
              <p className="text-md font-medium text-red-500">
                No CA/ACA Land Schedule found for the{" "}
                <span className="text-primary font-bold">
                  Selected Project.
                </span>
              </p>
              <p className="text-md text-gray-500 mt-1">
                Try selecting a different{" "}
                <span className="text-gray-700 font-semibold">Project</span> or
                add a CA/ACA Land Schedule .
              </p>
            </>
          )}
        </div>
      )}
      {selectedProject && filteredAndSortedData.length > 0 && (
        <div
          className="max-h-[400px] overflow-x-auto bg-base-100 shadow"
          style={{ scrollbarWidth: "thin" }}
        >
          <table className="table w-full">
            <thead className="bg-gradient-to-r from-[#7A69E1] to-[#7A69E1] text-white text-sm sticky top-0 z-20">
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

                <th className={stickyActionHeader}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredAndSortedData.length === 0 ? (
                <tr>
                  <td colSpan={15} className="text-center py-6 text-gray-500">
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
                  <td className={stickyActionCell}>
                    <select
                      className="select select-sm bg-gray-100 border border-gray-300 w-[42px]"
                      defaultValue=""
                      onChange={(e) => {
                        const action = e.target.value;
                        e.target.value = "";

                        if (action === "edit" && canEdit) {
                          onEdit(row);
                        }

                        if (action === "delete" && canDelete) {
                          onDelete(row);
                        }
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
      )}
    </>
  );
};

export default CATable;
