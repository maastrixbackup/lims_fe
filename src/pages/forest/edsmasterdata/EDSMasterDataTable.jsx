import React from "react";

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
  };

  
  return (
    <div className="overflow-x-auto" style={{scrollbarWidth:"thin"}}>

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
          </tr>
        </tbody>

      </table>

    </div>
  );
};

export default EDSMasterDataTable;
