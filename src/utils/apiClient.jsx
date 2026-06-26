import store from "../utils/store";
import { logout } from "../utils/userSlice";
import { API_BASE_URL } from "./config"; 
import { showToast } from "./constants";

const normalizeApiErrorMessage = (rawMessage = "", status) => {
  const message = String(rawMessage || "").trim();

  if (!message) {
    return status ? `HTTP Error ${status}` : "Something went wrong";
  }

  try {
    const parsed = JSON.parse(message);
    if (parsed?.message) {
      return normalizeApiErrorMessage(parsed.message, status);
    }
  } catch {
    // Response is not JSON. Continue with text checks below.
  }

  if (
    /multererror/i.test(message) ||
    /file too large/i.test(message)
  ) {
    return "Document size is too large";
  }

  const htmlMessageMatch = message.match(/<pre>([\s\S]*?)<\/pre>/i);
  if (htmlMessageMatch?.[1]) {
    const cleanedMessage = htmlMessageMatch[1]
      .replace(/<br\s*\/?>/gi, " ")
      .replace(/&nbsp;/gi, " ")
      .replace(/\s+/g, " ")
      .trim();

    if (/multererror/i.test(cleanedMessage) || /file too large/i.test(cleanedMessage)) {
      return "Document size is too large";
    }

    if (cleanedMessage) return cleanedMessage;
  }

  return message;
};

const getFriendlyNetworkErrorMessage = (error) => {
  if (!error) return "Unable to connect to the server";

  if (
    error instanceof TypeError &&
    /failed to fetch|load failed|networkerror/i.test(error.message || "")
  ) {
    if (typeof navigator !== "undefined" && navigator.onLine === false) {
      return "No internet connection. Please check your network and try again.";
    }

    return "Unable to reach the server. Please check your connection and try again.";
  }

  return error.message || "Something went wrong";
};

export async function safeFetch(input, init) {
  try {
    return await fetch(input, init);
  } catch (err) {
    err.message = getFriendlyNetworkErrorMessage(err);
    throw err;
  }
}

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

    const res = await safeFetch(`${API_BASE_URL}${endpoint}`, config);

    if (res.status === 401) {
      showToast("Your session has expired. Please log in again.", "error");
      store.dispatch(logout());
      // setTimeout(() => (window.location.href = "/"), 1500);
      return;
    }

    if (!res.ok) {
      const text = await res.text();
      throw new Error(normalizeApiErrorMessage(text, res.status));
    }

    return res.json();
  } catch (err) {
    err.message = getFriendlyNetworkErrorMessage(err);
    console.error("API Error:", err);
    // showToast(err.message || "Something went wrong!", "error");
    throw err;
  }
}
