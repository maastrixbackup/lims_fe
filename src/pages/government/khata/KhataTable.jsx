import React, { useState } from "react";
import {
  GovtKhataColumn,
  stickyActionCell,
  stickyActionHeader,
} from "../../../utils/constants";
import FilterHeader from "../plot/FilterHeader";
import { useDispatch, useSelector } from "react-redux";
import Pagination from "../../../shared/Pagination";
import { LandPlot, MapIcon, Upload } from "lucide-react";
import { setSelectedKhataId } from "../../../utils/khataSlice";

const KhataTable = ({
  khatas,
  onEdit,
  userRole,
  onDelete,
  page,
  setPage,
  limit,
  setLimit,
  totalPages,
  onUpload,
  onMap,
  onViewPlots,
}) => {
  const canEdit = userRole !== "Viewer";
  const canDelete = !(userRole === "Data Entry User" || userRole === "Viewer");
  const [filters, setFilters] = useState({});
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "asc",
  });
  const [activeFilterKey, setActiveFilterKey] = useState(null);
  const selectedProjectId = useSelector(
    (state) => state.selectedProject.project?.id,
  );
  const dispatch = useDispatch();
  const getUniqueValues = (key) => {
    return [...new Set(khatas.map((k) => k[key]).filter(Boolean))];
  };

  const filteredKhatas = khatas
    .filter((k) =>
      Object.entries(filters).every(([key, value]) =>
        value
          ? String(k[key]).toLowerCase().includes(value.toLowerCase())
          : true,
      ),
    )
    .sort((a, b) => {
      if (!sortConfig.key) return 0;

      const aVal = a[sortConfig.key] ?? "";
      const bVal = b[sortConfig.key] ?? "";

      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  console.log("khataa", khatas);
  return (
    <div className="card bg-white shadow-lg">
      {(!selectedProjectId || filteredKhatas.length === 0) && (
        <div className="py-10 text-center text-gray-600">
          {!selectedProjectId ? (
            <>
              <p className="text-lg font-medium">
                Please{" "}
                <span className="text-primary font-semibold">
                  Select a Project
                </span>{" "}
                first.
              </p>
              <p className="text-lg text-gray-500 mt-1">
                A project is required to view Khata list.
              </p>
            </>
          ) : (
            <>
              <p className="text-md font-medium text-red-500">
                No Khata found for the{" "}
                <span className="text-primary font-bold">
                  Selected Project.
                </span>
              </p>
              <p className="text-md text-gray-500 mt-1">
                Try selecting a different{" "}
                <span className="text-gray-700 font-semibold">Project</span> or
                add a new Khata.
              </p>
            </>
          )}
        </div>
      )}
      {selectedProjectId && filteredKhatas.length > 0 && (
        <>
          <div
            className="overflow-x-auto max-h-[400px] overflow-y-auto"
            style={{ scrollbarWidth: "thin" }}
          >
            <table className="table w-full whitespace-nowrap">
              <thead className="bg-gray-200 text-gray-700 sticky top-0 z-10">
                <tr>
                  <th>Sl/No</th>

                  {GovtKhataColumn.map((col) => (
                    <th key={col.key}>
                      <FilterHeader
                        column={col}
                        filters={filters}
                        setFilters={setFilters}
                        sortConfig={sortConfig}
                        setSortConfig={setSortConfig}
                        getUniqueValues={getUniqueValues}
                        activeFilterKey={activeFilterKey}
                        setActiveFilterKey={setActiveFilterKey}
                      />
                    </th>
                  ))}

                  <th className={stickyActionHeader}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {/* {khatas.length > 0 ? ( */}
                {filteredKhatas.map((k, idx) => (
                  <tr key={k.id}>
                    <td>{idx + 1}</td>
                    <td>{k.khata_no || "No Data"}</td>
                    <td>{k.plot_no || "No Data"}</td>
                    <td>{k.village || "No Data"}</td>
                    <td>{k.kissam_of_land || "No Data"}</td>
                    <td>{k.lease_case_no || "No Data"}</td>
                    <td>{k.present_status || "No Data"}</td>
                    <td>{k.case_details || "No Data"}</td>

                    <td>{k.plot_count || "No Data"}</td>
                    <td>{k.unique_id || "No Data"}</td>
                    <td>{k.ror_name || "No Data"}</td>
                    <td>{k.land_category || "No Data"}</td>
                    <td className={stickyActionCell}>
                      <select
                        className="select select-sm bg-gray-100 border w-[42px]"
                        defaultValue=""
                        onChange={(e) => {
                          const action = e.target.value;
                          e.target.value = "";
                          if (action === "viewPlots") {
                            dispatch(setSelectedKhataId(k.id))
                           onViewPlots(k)
                          }

                          if (action === "upload") onUpload(k);
                          if (action === "map") onMap(k);
                          if (action === "edit" && canEdit) onEdit(k);
                          if (action === "delete" && canDelete) onDelete(k);
                        }}
                      >
                        <option value="" disabled>
                          Actions
                        </option>
                        <option
                          value="viewPlots"
                          className="text-md text-gray-700 font-bold"
                        >
                          <LandPlot size={14} />
                          View Plots ({k.plot_count || 0})
                        </option>

                        <option
                          value="upload"
                          disabled={userRole === "Viewer"}
                          className={`text-md text-gray-700 font-bold ${
                            userRole === "Viewer" ? "!text-gray-400" : ""
                          }`}
                        >
                          <Upload size={14} />
                          Upload ({k.khata_document_count || 0})
                        </option>

                        <option
                          value="map"
                          className="text-md text-gray-700 font-bold"
                        >
                          <MapIcon size={14} />
                          Map ({k.khata_map_document_count || 0})
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
          <Pagination
            page={page}
            setPage={setPage}
            limit={limit}
            setLimit={setLimit}
            totalPages={totalPages}
          />
        </>
      )}
    </div>
  );
};

export default KhataTable;
