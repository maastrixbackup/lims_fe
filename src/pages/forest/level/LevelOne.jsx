import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import LevelOneForm from "./form/LevelOneForm";
import FilterSortHeader from "../FilterSortHeader";

const Level1FDProposal = () => {
  const [rows, setRows] = useState([
    {
      projectId: "fghgfh",
      dgpsSurvey: "fghfg",
      dgpsArea: "fghfgh",
      orsacAuthNo: "fghfgh",
      orsacAuthDate: "fghfghg",
      treeEnum: "fghfg",
      totalTrees: "rtreter",
      adminDocs: "yutuyt",
      legalDocs: "tyuyt",
      technicalData: "567u6",
      forestLand: "jghj ",
      caPlanning: "g jggh",
      fraRecords: "hgjgh",
      envStatutory: "jhhjh",
      wildlife: "hgjghj",
      maps: "ujyuj",
      finance: "gjghj",
      proposalSubmitted: "ghjgh",
      submissionDate: "ghjghj",
      stageStatus: "ghjghjgh",
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
        <h2 className="font-bold text-lg">LEVEL – 1 FD PROPOSAL</h2>

        <button
          className="btn btn-primary btn-sm"
          onClick={() => setShowModal(true)}
        >
          + Add Level 1
        </button>
      </div>

      <div className="overflow-x-auto" style={{ scrollbarWidth: "thin" }}>
        <table className="table table-sm w-full">
          <thead className="bg-gray-500 text-white sticky top-0 z-20">
            <tr>
              {[
                ["Project ID", "projectId"],
                ["DGPS Survey", "dgpsSurvey"],
                ["DGPS Area", "dgpsArea"],
                ["ORSAC Auth No", "orsacAuthNo"],
                ["ORSAC Date", "orsacAuthDate"],
                ["Tree Enum", "treeEnum"],
                ["Total Trees", "totalTrees"],
                ["Admin Docs", "adminDocs"],
                ["Legal Docs", "legalDocs"],
                ["Technical", "technicalData"],
                ["Forest & Land", "forestLand"],
                ["CA Planning", "caPlanning"],
                ["FRA", "fraRecords"],
                ["Env", "envStatutory"],
                ["Wildlife", "wildlife"],
                ["Maps", "maps"],
                ["Finance", "finance"],
                ["Proposal", "proposalSubmitted"],
                ["Submission", "submissionDate"],
                ["Status", "stageStatus"],
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
                <td colSpan="20" className="text-center">
                  No Data
                </td>
              </tr>
            )}

            {filteredAndSortedData.map((r, i) => (
              <tr key={i}>
                {Object.keys(r).map((k) => (
                  <td key={k}>{r[k]}</td>
                ))}

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

      {showModal && <LevelOneForm setRows={setRows} setShowModal={setShowModal} />}
    </div>
  );
};

export default Level1FDProposal;
