import { API_BASE_URL } from "../../utils/config";

export const addForestProject = async ({
  formData,
  token,
  selectedProject,
  onSuccess,
  onError,
}) => {
  try {
    const payload = new FormData();
    const projectId = formData.project_id || selectedProject?.id;

    const projectName =
      formData.project_name ||
      selectedProject?.project_name ||
      selectedProject?.name ||
      "";

    if (!projectId || !projectName) {
      throw { message: "Project ID or Project Name missing" };
    }

    payload.append("project_id", projectId);
    payload.append("project_name", projectName);

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
        key !== "project_id" &&
        key !== "project_name" &&
        key !== "eds_flag" &&
        key !== "eds_list" &&
        key !== "eds_document" &&
        formData[key] !== null &&
        formData[key] !== ""
      ) {
        payload.append(key, formData[key]);
      }
    });

    payload.append("eds_flag", Number(formData.eds_flag || 0));
    payload.append("eds_list", JSON.stringify(normalizedEdsList));

    // Supports repeated file key: eds_reply_document, one per EDS row/file.
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
      `${API_BASE_URL}/forestland/addForestProject`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: payload,
      },
    );

    const result = await response.json();
    console.log("Add Forest Project Response:", result);
    if (!response.ok) throw result;

    onSuccess(result);
  } catch (err) {
    onError(err);
  }
};
