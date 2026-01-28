import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import LevelFourForm from "./form/LevelFourForm";
import FilterSortHeader from "../FilterSortHeader";

const Level4Stage2Clearance = () => {
  const [rows, setRows] = useState([
    {
      projectId: "fdgfd",
      finalApprovalNo: "dfgfd",
      finalApprovalDate: "fdgfd",
      divertedArea: "dfgdf",
      landHandover: "dfgdfg",
      handoverDate: "dfgfdg",
      projectClosed: "bvcn",
      closureDate: "cbnfg",
    },
  ]);

  const [showModal, setShowModal] = useState(false);

  const stickyActionHeader =
    "text-right bg-gray-500 text-white md:sticky md:right-0 z-[30] shadow-md";
  const stickyActionCell =
    "text-right bg-white font-bold md:sticky md:right-0 border-gray-100 shadow-sm";

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
          LEVEL – 4 : STAGE II CLEARANCE FROM MOEF&CC
        </h2>

        <button
          className="btn btn-primary btn-sm"
          onClick={() => setShowModal(true)}
        >
          + Add Level 4
        </button>
      </div>

      <div className="overflow-x-auto" style={{ scrollbarWidth: "thin" }}>
        <table className="table w-full">
          <thead className="bg-gray-500 text-white text-sm sticky top-0 z-20">
            <tr>
              {[
                ["Project ID", "projectId"],
                ["Final Approval No", "finalApprovalNo"],
                ["Final Approval Date", "finalApprovalDate"],
                ["Diverted Area (ha)", "divertedArea"],
                ["Land Handover", "landHandover"],
                ["Handover Date", "handoverDate"],
                ["Project Closed", "projectClosed"],
                ["Closure Date", "closureDate"],
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
                <td colSpan="8" className="text-center">
                  No Data
                </td>
              </tr>
            )}

            {filteredAndSortedData.map((r, i) => (
              <tr key={i}>
                <td>{r.projectId}</td>
                <td>{r.finalApprovalNo}</td>
                <td>{r.finalApprovalDate}</td>
                <td>{r.divertedArea}</td>
                <td>{r.landHandover}</td>
                <td>{r.handoverDate}</td>
                <td>{r.projectClosed}</td>
                <td>{r.closureDate}</td>

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

      {showModal && <LevelFourForm setRows={setRows} setShowModal={setShowModal} />}
    </div>
  );
};

export default Level4Stage2Clearance;
