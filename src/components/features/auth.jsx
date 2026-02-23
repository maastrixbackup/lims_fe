import { API_BASE_URL } from "../../utils/config";

export const forgotPassword = async (email) => {
  const res = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  const data = await res.json();

  if (!res.ok || data?.success === false) {
    throw new Error(data?.message || "Failed to send reset link");
  }

  return data;
};

export const resetPassword = async (token, newPassword) => {
  const res = await fetch(`${API_BASE_URL}/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, newPassword }),
  });
  const data = await res.json();

  if (!res.ok || data?.success === false) {
    throw new Error(data?.message || "Failed to reset password");
  }

  return data;
};
