import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import LevelZeroForm from "./form/LevelZeroForm";
import Pagination from "../../../shared/Pagination";
import FilterSortHeader from "../FilterSortHeader";

const Level0PreProposal = () => {
  const rows = [
    {
      projectId: "fghdfh",
      stageStatus: "rtyrty",
      landSchedule: "ryttry",
      forestLand: "rytrty",
      gis: "rtyrty",
      dgps: "rtyrty",
      verification: "yrrtyt",
      remarks: "rtytryt",
      completionDate: "tytyt",
      others:"yes",
      others_docs:"url"
    },
  ];
  const [showModal, setShowModal] = useState(false);
  const stickyActionHeader =
    "p-3 text-right bg-gray-500 text-white md:sticky md:right-0 z-[30] shadow-md";
  const stickyActionCell =
    "text-right font-bold md:sticky md:right-0 border-gray-100 shadow-sm bg-white";
  const userRole = useSelector((s) => s.auth.user?.role_name);
  const canEdit = userRole !== "Viewer";
  const canDelete = !(userRole === "Data Entry User" || userRole === "Viewer");
  const [filters, setFilters] = useState({});
  const [sortConfig, setSortConfig] = useState({
    field: null,
    direction: null,
  });
  const getUniqueOptions = (field) => {
    return [...new Set(rows.map((item) => item[field]).filter(Boolean))];
  };

  const filteredAndSortedData = useMemo(() => {
    let result = [...rows];

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
  }, [rows, filters, sortConfig]);

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h2 className="text-lg font-bold">LEVEL - 0 PRE PROPOSAL</h2>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => setShowModal(true)}
        >
          + Add Level 0
        </button>
      </div>
      <div className="overflow-x-auto" style={{ scrollbarWidth: "thin" }}>
        <table className="table table-sm w-full">
          <thead className="bg-gray-500 text-white text-sm sticky top-0 z-20">
            <tr>
              <FilterSortHeader
                label="Project ID"
                field="projectId"
                options={getUniqueOptions("projectId")}
                filters={filters}
                setFilters={setFilters}
                sortConfig={sortConfig}
                setSortConfig={setSortConfig}
              />

              <FilterSortHeader
                label="Stage Status"
                field="stageStatus"
                options={getUniqueOptions("stageStatus")}
                filters={filters}
                setFilters={setFilters}
                sortConfig={sortConfig}
                setSortConfig={setSortConfig}
              />

              <FilterSortHeader
                label="Land Schedule"
                field="landSchedule"
                options={getUniqueOptions("landSchedule")}
                filters={filters}
                setFilters={setFilters}
                sortConfig={sortConfig}
                setSortConfig={setSortConfig}
              />

              <FilterSortHeader
                label="Forest Land"
                field="forestLand"
                options={getUniqueOptions("forestLand")}
                filters={filters}
                setFilters={setFilters}
                sortConfig={sortConfig}
                setSortConfig={setSortConfig}
              />

              <FilterSortHeader
                label="Preliminary GIS"
                field="gis"
                options={getUniqueOptions("gis")}
                filters={filters}
                setFilters={setFilters}
                sortConfig={sortConfig}
                setSortConfig={setSortConfig}
              />

              <FilterSortHeader
                label="DGPS Planned"
                field="dgps"
                options={getUniqueOptions("dgps")}
                filters={filters}
                setFilters={setFilters}
                sortConfig={sortConfig}
                setSortConfig={setSortConfig}
              />

              <FilterSortHeader
                label="Internal Verification"
                field="verification"
                options={getUniqueOptions("verification")}
                filters={filters}
                setFilters={setFilters}
                sortConfig={sortConfig}
                setSortConfig={setSortConfig}
              />
               <FilterSortHeader
                label="Others/ miscellaneous"
                field="others"
                options={getUniqueOptions("others")}
                filters={filters}
                setFilters={setFilters}
                sortConfig={sortConfig}
                setSortConfig={setSortConfig}
              />
              <FilterSortHeader
                label="Others/ miscellaneous Docs"
                field="others_docs"
                options={getUniqueOptions("others_docs")}
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

              <FilterSortHeader
                label="Completion Date"
                field="completionDate"
                options={getUniqueOptions("completionDate")}
                filters={filters}
                setFilters={setFilters}
                sortConfig={sortConfig}
                setSortConfig={setSortConfig}
              />

              <th className={stickyActionHeader}>Action</th>
            </tr>
          </thead>

          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan="9" className="text-center">
                  No Data
                </td>
              </tr>
            )}

            {filteredAndSortedData.map((r, i) => (
              <tr key={i}>
                <td>{r.projectId}</td>
                <td>{r.stageStatus}</td>
                <td>{r.landSchedule}</td>
                <td>{r.forestLand}</td>
                <td>{r.gis}</td>
                <td>{r.dgps}</td>
                <td>{r.verification}</td>
                <td>{r.others}</td>
                <td>{r.others_docs}</td>
                <td>{r.remarks}</td>
                <td>{r.completionDate}</td>
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
            ))}
          </tbody>
        </table>
        {/* <Pagination 
        
        /> */}
      </div>
      {showModal && <LevelZeroForm setShowModal={setShowModal} />}
    </div>
  );
};

export default Level0PreProposal;
