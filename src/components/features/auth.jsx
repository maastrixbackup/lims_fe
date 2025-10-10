
export const forgotPassword = async (email) => {
  const res = await fetch(
    // "http://localhost:3000/api/auth/forgot-password"
    `${API_BASE_URL}/auth/forgot-password`, 
    {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  return res.json();
};

// Reset password
export const resetPassword = async (token, password) => {
  const res = await fetch(
    // "http://localhost:3000/api/auth/reset-password",
    `${API_BASE_URL}/auth/reset-password`,
     {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, password }),
  });
  return res.json();
};
