import { API_BASE_URL } from "../../utils/config";

export const addForestProject = async ({ formData, onSuccess, onError,token,  selectedProject, }) => {
  try {
    const payload = new FormData();

    payload.append("project_id", 1);

    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null && formData[key] !== "") {
        payload.append(key, formData[key]);
      }
    });

    const response = await fetch(
      `${API_BASE_URL}/forestland/addForestProject`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, //
        
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
