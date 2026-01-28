import { API_BASE_URL } from "../utils/config";

export const updateForestProject = async ({
  id,
  formData,
  token,
  onSuccess,
  onError,
}) => {
  try {
    const payload = new FormData();

    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null && formData[key] !== "") {
        payload.append(key, formData[key]);
      }
    });

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
