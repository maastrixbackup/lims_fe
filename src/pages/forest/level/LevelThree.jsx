import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import LevelThreeForm from "./form/LevelThreeForm";
import FilterSortHeader from "../FilterSortHeader";

const Level3Stage2Compliance = () => {
  const [rows, setRows] = useState([
    {
      project_id: "ertret",
      compliance_type: "eter",
      document_submitted: "vb vc",
      submission_date: "cvbvc",
      verified_by: "cvbdf",
      verification_date: "fdgw",
      compliance_status: "sdf",
      document_submitted_attached:"url"
    },
  ]);

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
        <h2 className="font-bold text-lg">
          LEVEL – 3 : STAGE II COMPLIANCE DETAILS
        </h2>

        <button
          className="btn btn-primary btn-sm"
          onClick={() => setShowModal(true)}
        >
          + Add Level 3
        </button>
      </div>

      <div className="overflow-x-auto" style={{ scrollbarWidth: "thin" }}>
        <table className="table table-sm w-full">
          <thead className="bg-gray-500 text-white text-sm sticky top-0 z-20">
            <tr>
              {[
                ["Project ID", "project_id"],
                ["Compliance Type", "compliance_type"],
                ["Document Submitted", "document_submitted"],
                 ["Sumitted Attached Docs", "document_submitted_attached"],
                ["Submission Date", "submission_date"],
                ["Verified By", "verified_by"],
                ["Verification Date", "verification_date"],
                ["Compliance Status", "compliance_status"],
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
            {filteredAndSortedData.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center">
                  No data found
                </td>
              </tr>
            )}

            {filteredAndSortedData.map((r, i) => (
              <tr key={i}>
                <td>{r.project_id}</td>
                <td>{r.compliance_type}</td>
                <td>{r.document_submitted}</td>
                 <td>{r.document_submitted_attached}</td>
                <td>{r.submission_date}</td>
                <td>{r.verified_by}</td>
                <td>{r.verification_date}</td>
                <td>{r.compliance_status}</td>

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

      {showModal && (
        <LevelThreeForm setRows={setRows} setShowModal={setShowModal} />
      )}
    </div>
  );
};

export default Level3Stage2Compliance;

