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

    Object.keys(formData).forEach((key) => {
      if (
        key !== "project_id" &&
        key !== "project_name" &&
        formData[key] !== null &&
        formData[key] !== ""
      ) {
        payload.append(key, formData[key]);
      }
    });

    const response = await fetch(
      `${API_BASE_URL}/forestland/addForestProject`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: payload,
      }
    );

    const result = await response.json();
 console.log("Add Forest Project Response:", result);
    if (!response.ok) throw result;

    onSuccess(result);
  } catch (err) {
    onError(err);
  }
};
