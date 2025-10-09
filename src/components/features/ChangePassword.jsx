import React, { useState } from "react";
import { useSelector } from "react-redux";

const ChangePassword = () => {
  const token = useSelector((state) => state.auth.userToken);
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  // --- Handle input changes ---
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // --- Submit change password form ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Frontend validation
    if (formData.newPassword !== formData.confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setMessage(null);

      // --- API call ---
      const response = await fetch(
        "http://localhost:3000/api/user/changePassword",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            currentPassword: formData.currentPassword,
            newPassword: formData.newPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Failed to change password");
      }

      // --- Success ---
      setMessage(data?.message || "Password changed successfully!");
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-1 flex justify-center items-center bg-gradient-to-br p-6">
      <div className="card w-full max-w-md bg-white shadow-2xl rounded-2xl p-8 border border-gray-100">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          🔒 Change Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Current Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Current Password
            </label>
            <input
              type="password"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              className="input input-bordered w-full rounded-xl focus:ring-2 focus:ring-indigo-400 transition"
              placeholder="Enter current password"
              required
            />
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              New Password
            </label>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className="input input-bordered w-full rounded-xl focus:ring-2 focus:ring-indigo-400 transition"
              placeholder="Enter new password"
              required
              minLength={6}
            />
          </div>

          {/* Confirm New Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="input input-bordered w-full rounded-xl focus:ring-2 focus:ring-indigo-400 transition"
              placeholder="Re-enter new password"
              required
              minLength={6}
            />
          </div>

          {/* Error or Success Message */}
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          {message && (
            <p className="text-green-600 text-sm text-center">{message}</p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary w-full rounded-xl font-semibold text-white tracking-wide shadow-md hover:shadow-lg transition"
            disabled={loading}
          >
            {loading ? "Updating..." : "Change Password"}
          </button>
        </form>
      </div>
    </main>
  );
};

export default ChangePassword;
