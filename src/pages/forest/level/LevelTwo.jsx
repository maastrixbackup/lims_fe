import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import LevelTwoForm from "./form/LevelTwoForm";
import FilterSortHeader from "../FilterSortHeader";

const Level2Stage1Approval = () => {
  const rows = [
    {
      project_id: "hjku",
      stage1_approval_no: "ghjgh",
      approval_date: "ghjgh",
      npv_amount: "dgdfgd",
      ca_land: "dfgdfg",
      aca_land: "ddfggdf",
      stage2_status: "ghh",
      npv_attached_doc: "url",
      stage1_attached_doc: "url",
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

  const getUniqueOptions = (field) => [
    ...new Set(rows.map((r) => r[field]).filter(Boolean)),
  ];

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
                field="project_id"
                options={getUniqueOptions("project_id")}
                filters={filters}
                setFilters={setFilters}
                sortConfig={sortConfig}
                setSortConfig={setSortConfig}
              />

              <FilterSortHeader
                label="Stage I Approval No"
                field="stage1_approval_no"
                options={getUniqueOptions("stage1_approval_no")}
                filters={filters}
                setFilters={setFilters}
                sortConfig={sortConfig}
                setSortConfig={setSortConfig}
              />

              <FilterSortHeader
                label="Stage I Attached Document"
                field="stage1_attached_doc"
                options={getUniqueOptions("stage1_attached_doc")}
                filters={filters}
                setFilters={setFilters}
                sortConfig={sortConfig}
                setSortConfig={setSortConfig}
              />
              <FilterSortHeader
                label="Approval Date"
                field="approval_date"
                options={getUniqueOptions("approval_date")}
                filters={filters}
                setFilters={setFilters}
                sortConfig={sortConfig}
                setSortConfig={setSortConfig}
              />

              <FilterSortHeader
                label="NPV Amount"
                field="npv_amount"
                options={getUniqueOptions("npv_amount")}
                filters={filters}
                setFilters={setFilters}
                sortConfig={sortConfig}
                setSortConfig={setSortConfig}
              />
              <FilterSortHeader
                label="NPV Attached Document"
                field="npv_attached_doc"
                options={getUniqueOptions("npv_amount")}
                filters={filters}
                setFilters={setFilters}
                sortConfig={sortConfig}
                setSortConfig={setSortConfig}
              />

              <FilterSortHeader
                label="CA Land Area (ha)"
                field="ca_land"
                options={getUniqueOptions("ca_land")}
                filters={filters}
                setFilters={setFilters}
                sortConfig={sortConfig}
                setSortConfig={setSortConfig}
              />

              <FilterSortHeader
                label="ACA Land Area (ha)"
                field="aca_land"
                options={getUniqueOptions("aca_land")}
                filters={filters}
                setFilters={setFilters}
                sortConfig={sortConfig}
                setSortConfig={setSortConfig}
              />

              <FilterSortHeader
                label="Stage 2 Status"
                field="stage2_status"
                options={getUniqueOptions("stage2_status")}
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
                <td>{r.project_id}</td>
                <td>{r.stage1_approval_no}</td>
                <td>{r.stage1_attached_doc}</td>
                <td>{r.approval_date}</td>
                <td>{r.npv_amount}</td>
                <td>{r.npv_attached_doc}</td>
                <td>{r.ca_land}</td>
                <td>{r.aca_land}</td>
                <td>{r.stage2_status}</td>
                <td className={stickyActionCell}>
                  <select
                    className="select select-sm bg-gray-100 border border-gray-300 w-[42px]"
                    defaultValue=""
                    onChange={(e) => {
                      const action = e.target.value;
                      e.target.value = "";

                      if (action === "edit" && canEdit) console.log("edit", r);
                      if (action === "delete" && canDelete)
                        console.log("delete", r);
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
