import React, { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import FilterSortHeader from "../FilterSortHeader";
import { apiClient } from "../../../utils/apiClient";

const ProjectMasterTable = ({ onEdit, onDelete }) => {
  const selectedProject = useSelector((s) => s.selectedProject.project);
  const userRole = useSelector((s) => s.auth.user?.role_name);

  const canEdit = userRole !== "Viewer";
  const canDelete = !(userRole === "Data Entry User" || userRole === "Viewer");

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({});
  const [sortConfig, setSortConfig] = useState({ field: null, direction: null });

  const stickyActionHeader =
    "p-3 text-right bg-[#7A69E1] text-white md:sticky md:right-0 z-[30] shadow-md";

  const stickyActionCell =
    "text-right font-bold md:sticky md:right-0 border-gray-100 shadow-sm bg-white";

  useEffect(() => {
    if (!selectedProject?.id) return;
    fetchProjects();
  }, [selectedProject?.id]);

 const fetchProjects = async () => {
  try {
    setLoading(true);

    const res = await apiClient(
      `/forestland/forestProjectList?project_id=${selectedProject.id}`,
      { method: "GET" }
    );

    console.log("API RESPONSE:", res);

    const apiData = res?.data?.data?.data || res?.data?.data;

    // backend returns:
    // { total, totalPages, data: [...] }

    setProjects(Array.isArray(apiData) ? apiData : []);

  } catch (err) {
    console.error("Failed to load projects", err);
    setProjects([]);
  } finally {
    setLoading(false);
  }
};


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
    <div className="overflow-x-auto">
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

            <th>EDS Doc</th>
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
              <td>{row.proposal_no || "—"}</td>
              <td>{row.project_name || "—"}</td>
              <td>{row.user_agency || "—"}</td>
              <td>{row.sector || "—"}</td>
              <td>{row.state || "—"}</td>
              <td>{row.district || "—"}</td>
              <td>{row.tahasil || "—"}</td>
              <td>{row.mouza || "—"}</td>
              <td>{row.range_division || "—"}</td>
              <td>{row.forest_type || "—"}</td>
              <td>{row.total_project_area_ha}</td>
              <td>{row.forest_area_ha}</td>
              <td>{row.non_forest_area_ha}</td>
              <td>{row.project_status || "—"}</td>
              <td>{row.current_stage || "—"}</td>
              <td>{Number(row.eds_flag) === 1 ? "Yes" : "No"}</td>

              <td>
                {row.eds_document_path ? (
                  <a
                    href={row.eds_document_path}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 underline"
                  >
                    View
                  </a>
                ) : (
                  "—"
                )}
              </td>

              <td className={stickyActionCell}>
                <select
                  className="select select-sm bg-gray-100"
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
    </div>
  );
};

export default ProjectMasterTable;
