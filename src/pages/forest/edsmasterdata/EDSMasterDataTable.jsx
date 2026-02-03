import React from "react";
import { useSelector } from "react-redux";

const EDSMasterDataTable = () => {
  const edsData = {
    projectId: "PRJ-001",
    edsRefNo: "EDS-2026-45",
    issuingAuthority: "Forest Dept",
    edsIssueDate: "2026-01-20",
    edsDueDate: "2026-02-10",
    totalIssues: 5,
    issuesClosed: 3,
    issuesPending: 2,
    edsStatus: "Pending",
    eds_doc: "url",
  };

  const userRole = useSelector((s) => s.auth.user?.role_name);
  const canEdit = userRole !== "Viewer";
  const canDelete = !(userRole === "Data Entry User" || userRole === "Viewer");
 const stickyActionHeader =
  "p-3 text-right bg-gradient-to-r from-[#7A69E1] to-[#7A69E1] text-white font-bold text-sm text-gray-700 md:sticky md:right-0 z-[30] shadow-md";

 const stickyActionCell =
  "text-right font-bold md:sticky md:right-0 border-gray-100 shadow-sm bg-white";
  return (
    <div className="overflow-x-auto" style={{ scrollbarWidth: "thin" }}>
      <table className="table table-bordered w-full">
        <thead className="bg-gradient-to-r from-[#7A69E1] to-[#7A69E1] text-white text-sm sticky top-0 z-20">
          <tr>
            <th>Project ID</th>
            <th>EDS Ref No</th>
            <th>Issuing Authority</th>
            <th>EDS Issue Date</th>
            <th>EDS Due Date</th>
            <th>Total Issues</th>
            <th>Issues Closed</th>
            <th>Issues Pending</th>
            <th>EDS Status</th>
            <th>EDS Document</th>
            <th className={stickyActionHeader}>Action</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>{edsData.projectId}</td>
            <td>{edsData.edsRefNo}</td>
            <td>{edsData.issuingAuthority}</td>
            <td>{edsData.edsIssueDate}</td>
            <td>{edsData.edsDueDate}</td>
            <td>{edsData.totalIssues}</td>
            <td>{edsData.issuesClosed}</td>
            <td>{edsData.issuesPending}</td>
            <td>{edsData.edsStatus}</td>
            <td>{edsData.eds_doc}</td>
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
        </tbody>
      </table>
    </div>
  );
};

export default EDSMasterDataTable;
