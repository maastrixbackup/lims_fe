import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import FilterSortHeader from "../FilterSortHeader";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../../shared/Loader";
import Pagination from "../../../shared/Pagination";
import { apiClient } from "../../../utils/apiClient";

const ProjectMasterTable = ({ projects = [], loading, onEdit, onDelete }) => {
  const userRole = useSelector((s) => s.auth.user?.role_name);
  const navigate = useNavigate();
  const { landType } = useParams();

  const canEdit = userRole !== "Viewer";
  const canDelete = !(userRole === "Data Entry User" || userRole === "Viewer");

  const [filters, setFilters] = useState({});
  const [sortConfig, setSortConfig] = useState({
    field: null,
    direction: null,
  });
  const [tableData, setTableData] = useState([]);
  const [internalLoading, setInternalLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const selectedProject = useSelector((state) => state.selectedProject.project);

  const dataSource = projects.length ? projects : tableData;
  const isLoading = typeof loading === "boolean" ? loading : internalLoading;

  const stickyActionHeader =
    "p-3 text-right bg-[#7A69E1] text-white md:sticky md:right-0 z-[30] shadow-md";

  const stickyActionCell =
    "text-right font-bold md:sticky md:right-0 border-gray-100 shadow-sm bg-white";

  const getUniqueOptions = (field) => [
    ...new Set(dataSource.map((item) => item?.[field]).filter(Boolean)),
  ];

  useEffect(() => {
    setPage(1);
  }, [selectedProject?.id]);

  useEffect(() => {
    if (projects.length) return;

    if (!selectedProject?.id) {
      setTableData([]);
      setError("");
      return;
    }

    let cancelled = false;

    const fetchProjectMasterList = async () => {
      setInternalLoading(true);
      setError("");

      try {
        const res = await apiClient(
          `/forestland/forestProjectList?project_id=${selectedProject.id}&page=${page}&limit=${limit}`,
        );

        if (cancelled) return;

        setTableData(Array.isArray(res?.data) ? res.data : []);
        setTotalPages(Number(res?.totalPages || 1));
      } catch {
        if (cancelled) return;

        setTableData([]);
        setTotalPages(1);
        setError("Unable to load project master data.");
      } finally {
        if (!cancelled) {
          setInternalLoading(false);
        }
      }
    };

    fetchProjectMasterList();

    return () => {
      cancelled = true;
    };
  }, [projects.length, selectedProject?.id, page, limit]);

  const handleAction = (action, row) => {
    if (action === "edit") {
      onEdit?.(row);
      navigate(`/${landType}/project-master`, {
        state: { projectMasterRow: row },
      });
      return;
    }

    if (action === "delete") {
      onDelete?.(row);
      return;
    }
  };

  const filteredAndSortedData = useMemo(() => {
    let result = [...dataSource];

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
  }, [dataSource, filters, sortConfig]);

  if (isLoading) return <Loader message="Loading project master data..." />;

  return (
    <>
      <div>
        <h2 className="font-bold text-lg mb-4">Project Master Data List </h2>
      </div>
      {error && selectedProject && (
        <p className="text-sm text-red-500 mb-2">{error}</p>
      )}

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
                add a Project Master Data.
              </p>
            </>
          )}
        </div>
      )}

      {selectedProject && filteredAndSortedData.length > 0 && (
        <div
          className="max-h-[400px] overflow-x-auto"
          style={{ scrollbarWidth: "thin" }}
        >
          <table className="table table-sm w-full">
            <thead className="bg-[#7A69E1] text-white sticky top-0 z-20">
              <tr>
                {[
                  ["ID", "id"],
                  ["Project ID", "project_id"],
                  ["Proposal No", "proposal_no"],
                  ["Project Name", "project_name"],
                  ["Project Category", "project_category"],
                  ["Project Sub Category", "project_sub_category"],
                  ["Project Nature", "project_nature"],
                  ["User Agency", "user_agency"],
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
                    filters={filters}
                    setFilters={setFilters}
                    sortConfig={sortConfig}
                    setSortConfig={setSortConfig}
                  />
                ))}

                <th className={stickyActionHeader}>Action</th>
              </tr>
            </thead>

            <tbody>
              {!filteredAndSortedData.length && (
                <tr>
                  <td colSpan="22" className="text-center py-6">
                    No data found
                  </td>
                </tr>
              )}

              {filteredAndSortedData.map((row) => (
                <tr key={row.id}>
                  <td>{row.id}</td>
                  <td>{row.project_id || "No data found"}</td>
                  <td>{row.proposal_no || "No data found"}</td>
                  <td>{row.project_name || "No data found"}</td>
                  <td>{row.project_category || "No data found"}</td>
                  <td>{row.project_sub_category || "No data found"}</td>
                  <td>{row.project_nature || "No data found"}</td>
                  <td>{row.user_agency || "No data found"}</td>
                  <td>{row.state || "No data found"}</td>
                  <td>{row.district || "No data found"}</td>
                  <td>{row.tahasil || "No data found"}</td>
                  <td>{row.mouza || "No data found"}</td>
                  <td>{row.range_division || "No data found"}</td>
                  <td>{row.forest_type || "No data found"}</td>
                  <td>{row.total_project_area_ha || "No data found"}</td>
                  <td>{row.forest_area_ha || "No data found"}</td>
                  <td>{row.non_forest_area_ha || "No data found"}</td>
                  <td>{row.project_status || "No data found"}</td>
                  <td>{row.current_stage || "No data found"}</td>
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

                  <td className={stickyActionCell}>
                    <select
                      className="select select-sm bg-gray-100 w-[42px]"
                      defaultValue=""
                      onChange={(e) => {
                        const action = e.target.value;
                        e.target.value = "";

                        handleAction(action, row);
                      }}
                    >
                      <option value="" disabled>
                        Actions
                      </option>

                      <option value="edit" disabled={!canEdit}>
                        Edit
                      </option>

                      <option value="delete" disabled={!canDelete}>
                        Delete
                      </option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!!selectedProject && totalPages > 1 && !projects.length && (
        <div className="mt-4">
          <Pagination
            page={page}
            setPage={setPage}
            limit={limit}
            setLimit={setLimit}
            totalPages={totalPages}
          />
        </div>
      )}
    </>
  );
};

export default ProjectMasterTable;
