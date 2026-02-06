import store from "../utils/store";
import { logout } from "../utils/userSlice";
import { API_BASE_URL } from "./config"; 
import { showToast } from "./constants";

export async function apiClient(endpoint, options = {}) {
  try {
    const token = store.getState().auth.userToken;

    const isFormData = options.body instanceof FormData;

    const config = {
      method: options.method || "GET",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
        ...(!isFormData && { "Content-Type": "application/json" }),
        ...(options.headers || {}),
      },
      body: isFormData
        ? options.body
        : options.body
        ? JSON.stringify(options.body)
        : undefined,
    };

    const res = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (res.status === 401) {
      showToast("Your session has expired. Please log in again.", "error");
      store.dispatch(logout());
      // setTimeout(() => (window.location.href = "/"), 1500);
      return;
    }

    if (!res.ok) {
      const text = await res.text();
      // showToast(text || `HTTP Error ${res.status}`, "error");
      throw new Error(text || `HTTP Error ${res.status}`);
    }

    return res.json();
  } catch (err) {
    console.error("API Error:", err);
    // showToast(err.message || "Something went wrong!", "error");
    throw err;
  }
}
