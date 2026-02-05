import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import LevelOneForm from "./form/LevelOneForm";
import FilterSortHeader from "../FilterSortHeader";
import { levelOne} from "../../../utils/constants";
import AttachmentModal from "./AttachmentModal";


const attachmentFields = levelOne
  .map(([, f]) => f)
  .filter((f) => f.endsWith("_attachment"));

const dummyRows = [
  {
    project_id: "PRJ-001",
    dgps_survey: "Yes",
    dgps_survey_attachment: [
      { name: "DGPS_Report.pdf", url: "#" },
      { name: "Survey_Map.jpg", url: "#" },
    ],
    dgps_area: "12.5 Ha",
    orsac_auth_no: "ORSAC-123",
    orsac_auth_date: "2025-01-10",
    tree_enumeration_done: "Yes",
    tree_enumeration_docs: "Completed",
    total_trees: 245,
    admin_docs: "Completed",
    admin_docs_attachment: [{ name: "Checklist.pdf", url: "#" }],
    legal_lease_docs: "Available",
    legal_lease_docs_attachment: [{ name: "Lease_Deed.pdf", url: "#" }],
    technical_data: "Uploaded",
    technical_data_attachment: [{ name: "DPR.pdf", url: "#" }],
    forest_land_details: "Provided",
    forest_land_details_attachment: [{ name: "Forest_Map.pdf", url: "#" }],
    ca_aca_planning: "Yes",
    ca_aca_planning_attachment: [{ name: "CA_Plan.pdf", url: "#" }],
    fra_community_records: "Yes",
    fra_community_records_attachment: [{ name: "FRA_Record.pdf", url: "#" }],
    env_statutory: "Done",
    env_statutory_attachment: [{ name: "Env_Clearance.pdf", url: "#" }],
    wildlife: "NA",
    wildlife_attachment: [{ name: "Wildlife_Report.pdf", url: "#" }],
    maps_spatial_evidence: "Available",
    maps_spatial_evidence_attachment: [{ name: "Topo_Map.jpg", url: "#" }],
    finance_undertaking: "Submitted",
    finance_undertaking_attachment: [{ name: "Undertaking.pdf", url: "#" }],
    proposal_submitted: "Yes",
    proposal_submitted_attachment: [{ name: "Proposal.pdf", url: "#" }],
    parivesh_proposal: "PRV-7788",
    submissionDate: "2025-01-20",
    stage1Status: "Pending",
    others:"yes",
    others_docs:"url"
  },
  {
    project_id: "PRJ-002",
    dgps_survey: "No",
    dgps_survey_attachment: [],
    dgps_area: "8.2 Ha",
    orsac_auth_no: "ORSAC-456",
    orsac_auth_date: "2025-01-15",
    tree_enumeration_done: "No",
    tree_enumeration_docs: "Pending",
    total_trees: 0,
    admin_docs: "Pending",
    admin_docs_attachment: [],
    legal_lease_docs: "Pending",
    legal_lease_docs_attachment: [],
    technical_data: "Pending",
    technical_data_attachment: [],
    forest_land_details: "Pending",
    forest_land_details_attachment: [],
    ca_aca_planning: "No",
    ca_aca_planning_attachment: [],
    fra_community_records: "No",
    fra_community_records_attachment: [],
    env_statutory: "No",
    env_statutory_attachment: [],
    wildlife: "No",
    wildlife_attachment: [],
    maps_spatial_evidence: "No",
    maps_spatial_evidence_attachment: [],
    finance_undertaking: "No",
    finance_undertaking_attachment: [],
    proposal_submitted: "No",
    proposal_submitted_attachment: [],
    parivesh_proposal: "",
    submissionDate: "",
    stage1Status: "Draft",
    others:"yes",
    others_docs:"url"
  },
];

const Level1FDProposal = () => {
  const [rows, setRows] = useState(dummyRows);
  const [showModal, setShowModal] = useState(false);

  const [attachmentModal, setAttachmentModal] = useState({
    open: false,
    files: [],
  });

  const userRole = useSelector((s) => s.auth.user?.role_name);
  const canEdit = userRole !== "Viewer";
  const canDelete = !(userRole === "Data Entry User" || userRole === "Viewer");

  const [filters, setFilters] = useState({});
  const [sortConfig, setSortConfig] = useState({ field: null, direction: null });

  const getUniqueOptions = (field) =>
    [...new Set(rows.map((r) => r[field]).filter(Boolean))];

  const filteredAndSortedData = useMemo(() => {
    let result = [...rows];

    Object.entries(filters).forEach(([field, values]) => {
      if (values?.length) result = result.filter((r) => values.includes(r[field]));
    });

    if (sortConfig.field) {
      result.sort((a, b) =>
        sortConfig.direction === "asc"
          ? a[sortConfig.field] > b[sortConfig.field]
            ? 1
            : -1
          : a[sortConfig.field] < b[sortConfig.field]
          ? 1
          : -1
      );
    }

    return result;
  }, [rows, filters, sortConfig]);

    const stickyActionHeader =
    "text-right bg-gray-500 text-white md:sticky md:right-0 z-[30] shadow-md";
  const stickyActionCell =
    "text-right bg-white font-bold md:sticky md:right-0 border-gray-100 shadow-sm";

  return (
    <div>
      <div className="flex justify-between mb-3">
        <h2 className="font-bold text-lg">LEVEL – 1 FD PROPOSAL</h2>

        <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>
          + Add Level 1
        </button>
      </div>

      <div className="overflow-x-auto" style={{scrollbarWidth:"thin"}}>
        <table className="table table-sm w-full">
          <thead className="bg-gray-500 text-white">
            <tr>
              {levelOne.map(([label, field]) => (
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
            {filteredAndSortedData.map((r, i) => (
              <tr key={i}>
                {levelOne.map(([, k]) => (
                  <td key={k}>
                    {attachmentFields.includes(k) ? (
                      <button
                        className="btn btn-xs btn-info"
                        disabled={!r[k]?.length}
                        onClick={() =>
                          setAttachmentModal({
                            open: true,
                            files: r[k] || [],
                          })
                        }
                      >
                        View ({r[k]?.length || 0})
                      </button>
                    ) : (
                      r[k] || "—"
                    )}
                  </td>
                ))}

                <td className={stickyActionCell}>
                  <select
                    className="select select-sm w-[42px]"
                    defaultValue=""
                    onChange={(e) => {
                      const v = e.target.value;
                      e.target.value = "";
                      if (v === "edit" && canEdit) console.log("edit", r);
                      if (v === "delete" && canDelete) console.log("delete", r);
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

      {attachmentModal.open && (
        <AttachmentModal
          files={attachmentModal.files}
          onClose={() => setAttachmentModal({ open: false, files: [] })}
        />
      )}
    </div>
  );
};

export default Level1FDProposal;
