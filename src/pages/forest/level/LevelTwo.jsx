import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import LevelTwoForm from "./form/LevelTwoForm";
import FilterSortHeader from "../FilterSortHeader";

const Level2Stage1Approval = () => {
  const rows = [
    {
      projectId: "hjku",
      stage1ApprovalNo: "ghjgh",
      approvalDate: "ghjgh",
      npvAmount: "dgdfgd",
      caLand: "dfgdfg",
      acaLand: "ddfggdf",
      stage2Status: "ghh",
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

  const getUniqueOptions = (field) =>
    [...new Set(rows.map((r) => r[field]).filter(Boolean))];

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
      <div className="flex justify-between mb-3">
        <h2 className="font-bold text-lg">LEVEL – 2 : STAGE I APPROVAL</h2>

        <button
          className="btn btn-primary btn-sm"
          onClick={() => setShowModal(true)}
        >
          + Add Level 2
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
                label="Stage I Approval No"
                field="stage1ApprovalNo"
                options={getUniqueOptions("stage1ApprovalNo")}
                filters={filters}
                setFilters={setFilters}
                sortConfig={sortConfig}
                setSortConfig={setSortConfig}
              />

              <FilterSortHeader
                label="Approval Date"
                field="approvalDate"
                options={getUniqueOptions("approvalDate")}
                filters={filters}
                setFilters={setFilters}
                sortConfig={sortConfig}
                setSortConfig={setSortConfig}
              />

              <FilterSortHeader
                label="NPV Amount"
                field="npvAmount"
                options={getUniqueOptions("npvAmount")}
                filters={filters}
                setFilters={setFilters}
                sortConfig={sortConfig}
                setSortConfig={setSortConfig}
              />

              <FilterSortHeader
                label="CA Land Area (ha)"
                field="caLand"
                options={getUniqueOptions("caLand")}
                filters={filters}
                setFilters={setFilters}
                sortConfig={sortConfig}
                setSortConfig={setSortConfig}
              />

              <FilterSortHeader
                label="ACA Land Area (ha)"
                field="acaLand"
                options={getUniqueOptions("acaLand")}
                filters={filters}
                setFilters={setFilters}
                sortConfig={sortConfig}
                setSortConfig={setSortConfig}
              />

              <FilterSortHeader
                label="Stage 2 Status"
                field="stage2Status"
                options={getUniqueOptions("stage2Status")}
                filters={filters}
                setFilters={setFilters}
                sortConfig={sortConfig}
                setSortConfig={setSortConfig}
              />

              <th className={stickyActionHeader}>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredAndSortedData.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center">
                  No Data
                </td>
              </tr>
            )}

            {filteredAndSortedData.map((r, i) => (
              <tr key={i}>
                <td>{r.projectId}</td>
                <td>{r.stage1ApprovalNo}</td>
                <td>{r.approvalDate}</td>
                <td>{r.npvAmount}</td>
                <td>{r.caLand}</td>
                <td>{r.acaLand}</td>
                <td>{r.stage2Status}</td>

                <td className={stickyActionCell}>
                  <select
                    className="select select-sm bg-gray-100 border border-gray-300 w-[42px]"
                    defaultValue=""
                    onChange={(e) => {
                      const action = e.target.value;
                      e.target.value = "";

                      if (action === "edit" && canEdit) console.log("edit", r);
                      if (action === "delete" && canDelete) console.log("delete", r);
                    }}
                  >
                    <option value="" disabled>
                      Actions
                    </option>

                    <option value="edit" disabled={userRole === "Viewer"}>
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

      {showModal && <LevelTwoForm setShowModal={setShowModal} />}
    </div>
  );
};

export default Level2Stage1Approval;
