import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import FilterSortHeader from "../FilterSortHeader";
import { useNavigate, useParams } from "react-router-dom";


const ProjectMasterTable = ({ projects = [], loading, onEdit, onDelete }) => {
  const userRole = useSelector((s) => s.auth.user?.role_name);
const navigate = useNavigate();
  const { landType } = useParams();
  // const typeParam = useLandTypeParam();

  const canEdit = userRole !== "Viewer";
  const canDelete = !(userRole === "Data Entry User" || userRole === "Viewer");

  const [filters, setFilters] = React.useState({});
  const [sortConfig, setSortConfig] = React.useState({ field: null, direction: null });
  const selectedProject = useSelector((state) => state.selectedProject.project);

  const stickyActionHeader =
    "p-3 text-right bg-[#7A69E1] text-white md:sticky md:right-0 z-[30] shadow-md";

  const stickyActionCell =
    "text-right font-bold md:sticky md:right-0 border-gray-100 shadow-sm bg-white";

  const getUniqueOptions = (field) =>
    [...new Set(projects.map((i) => i?.[field]).filter(Boolean))];

  const filteredAndSortedData = useMemo(() => {
    let result = [...projects];

    Object.entries(filters).forEach(([field, values]) => {
      if (values?.length) {
        result = result.filter((row) => values.includes(row[field]));
      }
    });

    if (sortConfig.field) {
      result.sort((a, b) => {
        const aVal = a?.[sortConfig.field];
        const bVal = b?.[sortConfig.field];

        if (typeof aVal === "number" && typeof bVal === "number") {
          return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal;
        }

        return sortConfig.direction === "asc"
          ? String(aVal || "").localeCompare(String(bVal || ""))
          : String(bVal || "").localeCompare(String(aVal || ""));
      });
    }

    return result;
  }, [projects, filters, sortConfig]);

  if (loading) return <p className="p-4">Loading...</p>;

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
                A project is required to view Project Master Data list.
              </p>
            </>
          ) : (
            <>
              <p className="text-md font-medium text-red-500">
                No Project Master Data found for the{" "}
                <span className="text-primary font-bold">
                  Selected Project.
                </span>
              </p>
              <p className="text-md text-gray-500 mt-1">
                Try selecting a different{" "}
                <span className="text-gray-700 font-semibold">Project</span> or
                add a Project Master Data .
              </p>
            </>
          )}
        </div>
      )}
      {selectedProject && filteredAndSortedData.length > 0 && (
          <div className="max-h-[400px] overflow-x-auto" style={{ scrollbarWidth: "thin" }}>
      <table className="table table-sm w-full">
        <thead className="bg-[#7A69E1] text-white sticky top-0 z-20">
          <tr>
            {[
              ["Project ID", "id"],
              ["Proposal No", "proposal_no"],
              ["Project Name", "project_name"],
              ["User Agency", "user_agency"],
              ["Sector", "sector"],
              ["State", "state"],
              ["District", "district"],
              ["Tahasil", "tahasil"],
              ["Mouza", "mouza"],
              ["Range / Division", "range_division"],
              ["Forest Type", "forest_type"],
              ["Total Area", "total_project_area_ha"],
              ["Forest Area", "forest_area_ha"],
              ["Non Forest Area", "non_forest_area_ha"],
              ["Project Status", "project_status"],
              ["Current Stage", "current_stage"],
              ["EDS Flag", "eds_flag"],
            ].map(([label, field]) => (
              <FilterSortHeader
                key={field}
                label={label}
                field={field}
                options={getUniqueOptions(field)}
                {...{ filters, setFilters, sortConfig, setSortConfig }}
              />
            ))}

            {/* <th>EDS Doc</th> */}
            <th className={stickyActionHeader}>Action</th>
          </tr>
        </thead>

        <tbody>
          {!filteredAndSortedData.length && (
            <tr>
              <td colSpan="20" className="text-center py-6">
                No records found
              </td>
            </tr>
          )}

          {filteredAndSortedData.map((row) => (
            <tr key={row.id}>
              <td>{row.id}</td>
              <td>{row.proposal_no || "No Data"}</td>
              <td>{row.project_name || "No Data"}</td>
              <td>{row.user_agency || "No Data"}</td>
              <td>{row.sector || "No Data"}</td>
              <td>{row.state || "No Data"}</td>
              <td>{row.district || "No Data"}</td>
              <td>{row.tahasil || "No Data"}</td>
              <td>{row.mouza || "No Data"}</td>
              <td>{row.range_division || "No Data"}</td>
              <td>{row.forest_type || "No Data"}</td>
              <td>{row.total_project_area_ha || "No Data"}</td>
              <td>{row.forest_area_ha || "No Data"}</td>
              <td>{row.non_forest_area_ha || "No Data"}</td>
              <td>{row.project_status || "No Data"}</td>
              <td>{row.current_stage || "No Data"}</td>
              <td>
  {Number(row.eds_flag) === 1 ? (
    <span
      className="text-blue-600 underline cursor-pointer font-medium"
      onClick={() =>
        navigate(`/${landType}/eds-master-data`, {
          state: { project: row },
        })
      }
    >
      Yes
    </span>
  ) : (
    "No"
  )}
</td>

{/* 
              <td>
                {row.eds_document_url ? (
                  <a
                    href={row.eds_document_url}
                    target="_blank"
                    // rel="noreferrer"
                    className="text-blue-600 underline"
                  >
                    View
                  </a>
                ) : (
                  "No Data"
                )}
              </td> */}

              <td className={stickyActionCell}>
                <select
                  className="select select-sm bg-gray-100 w-[42px]"
                  defaultValue=""
                  onChange={(e) => {
                    const action = e.target.value;
                    e.target.value = "";

                    if (action === "edit") onEdit?.(row);
                    if (action === "delete") onDelete?.(row);
                  }}
                >
                  <option value="" disabled>
                    Actions
                  </option>

                  <option value="edit" disabled={!canEdit}>
                    ✏️ Edit
                  </option>

                  <option value="delete" disabled={!canDelete}>
                    🗑 Delete
                  </option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>)}
    </>
  
  );
};

export default ProjectMasterTable;
