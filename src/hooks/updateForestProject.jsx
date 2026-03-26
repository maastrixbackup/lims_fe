import { API_BASE_URL } from "../utils/config";

export const updateForestProject = async ({
  id,
  formData,
  token,
  onSuccess,
  onError,
}) => {
  console.log('form data*********', formData)
  try {
    const payload = new FormData();
    const normalizeEdsRow = (row = {}) => ({
      eds_ref_no: row.eds_ref_no || row.edsRefNo || "",
      issuing_authority: row.issuing_authority || row.issuingAuthority || "",
      eds_issue_date: row.eds_issue_date || row.edsIssueDate || "",
      eds_due_date: row.eds_due_date || row.edsDueDate || "",
      total_issues: row.total_issues || row.totalIssues || "",
      issues_closed: row.issues_closed || row.issuesClosed || "",
      issues_pending: row.issues_pending || row.issuesPending || "",
      eds_status: row.eds_status || row.edsStatus || "",
    });

    const edsList = Array.isArray(formData.eds_list) ? formData.eds_list : [];
    const normalizedEdsList = edsList.map(normalizeEdsRow);

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

    edsList.forEach((row) => {
      const file = row?.eds_reply_document || row?.eds_document;
      if (file instanceof File) {
        payload.append("eds_reply_document", file);
      }
    });

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
