import { API_BASE_URL } from "../utils/config";

export const updateForestProject = async ({
  id,
  formData,
  token,
  onSuccess,
  onError,
}) => {
  console.log("form data*********", formData);
  try {
    const payload = new FormData();

    const edsList = Array.isArray(formData.eds_list) ? formData.eds_list : [];

    let fileCounter = 0;

    // Normalize EDS rows while preserving existing filenames and linking new File indexes
    const normalizedEdsList = edsList.map((row) => {
      const fileObj = row.eds_reply_document || row.eds_document;
      const isNewFile = fileObj instanceof File;

      const rowData = {
        eds_ref_no: row.eds_ref_no || row.edsRefNo || "",
        issuing_authority: row.issuing_authority || row.issuingAuthority || "",
        eds_issue_date: row.eds_issue_date || row.edsIssueDate || "",
        eds_due_date: row.eds_due_date || row.edsDueDate || "",
        total_issues: row.total_issues || row.totalIssues || "",
        issues_closed: row.issues_closed || row.issuesClosed || "",
        issues_pending: row.issues_pending || row.issuesPending || "",
        eds_status: row.eds_status || row.edsStatus || "",
        // Preserve existing filename string if no new file selected
        eds_reply_document: typeof fileObj === "string" ? fileObj : null,
        // Send index map so backend associates file accurately
        fileIndex: isNewFile ? fileCounter++ : null,
      };

      // Append actual File objects to FormData in order
      if (isNewFile) {
        payload.append("eds_reply_document", fileObj);
      }

      return rowData;
    });

    // Append standard fields
    Object.keys(formData).forEach((key) => {
      if (
        key !== "eds_list" &&
        key !== "eds_document" &&
        formData[key] !== null &&
        formData[key] !== ""
      ) {
        payload.append(key, formData[key]);
      }
    });

    payload.append("eds_list", JSON.stringify(normalizedEdsList));

    if (formData.eds_document instanceof File) {
      payload.append("eds_reply_document", formData.eds_document);
    }

    const response = await fetch(
      `${API_BASE_URL}/forestland/updateForestProject/${id}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: payload,
      }
    );

    const result = await response.json();

    if (!response.ok) throw result;

    onSuccess(result);
  } catch (err) {
    onError(err);
  }
};