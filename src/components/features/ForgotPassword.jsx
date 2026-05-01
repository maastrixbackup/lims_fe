import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../features/auth";
import logo from "../../assets/logo.jpeg";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const data = await forgotPassword(email);
      if (data.success) {
        setMessage("Password reset link sent to your email.");
      } else {
        setMessage(data.message || "Failed to send reset link.");
      }
    } catch (error) {
      setMessage(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden bg-emerald-300/30 px-4">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-200/60 via-white/40 to-teal-200/50" />
      <div className="absolute top-16 left-10 h-32 w-32 rounded-full bg-white/40 blur-3xl" />
      <div className="absolute bottom-12 right-10 h-40 w-40 rounded-full bg-emerald-500/20 blur-3xl" />

      <div className="relative w-full max-w-md rounded-3xl border border-white/60 bg-white/85 p-8 shadow-2xl backdrop-blur-md">
        <div className="flex flex-col items-center mb-6">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="mb-4 cursor-pointer rounded-full bg-white p-2 shadow-lg ring-4 ring-emerald-100 transition hover:scale-105"
            aria-label="Go to login"
          >
            <img
              src={logo}
              alt="App logo"
              className="h-20 w-20 rounded-full object-cover"
            />
          </button>
          <p className="text-sm font-medium text-gray-500 tracking-wide uppercase">
            LAND INFORMATION MANAGEMENT SYSTEM
          </p>
        </div>
        <h2 className="mb-2 text-center text-3xl font-bold text-emerald-900">
          Forgot Password
        </h2>
        <p className="mb-6 text-center text-sm text-gray-600">
          Enter your registered email and we&apos;ll send you a reset link.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-xl border border-emerald-100 bg-white/90 p-3 text-gray-800 shadow-sm outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-200"
              placeholder="Enter your registered email"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full cursor-pointer rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 py-3 font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:from-emerald-700 hover:to-teal-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="cursor-pointer text-sm font-medium text-emerald-700 transition hover:text-emerald-900"
          >
            Back to login
          </button>
        </div>
        {message && (
          <p className="mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-center text-sm text-emerald-800">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
