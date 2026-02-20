import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../utils/userSlice";
import { API_BASE_URL } from "../../utils/config";

export default function LandingPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  // const { userToken } =useSelector((state) => state.auth);

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    if (name === "email") setEmail(value);
    if (name === "password") setPassword(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("Login response data^^^^^^^^^^^^^^:", data);
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Invalid email or password");
      }

      localStorage.setItem("authToken", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      dispatch(
        login({
          user: data.user,
          token: data.token,
          accessed_projects: data.accessed_projects || [],
        }),
      );
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Redirect if already logged in
  // useEffect(() => {
  //   if (userToken) {
  //     navigate("/dashboard", { replace: true });
  //   }
  // }, [userToken, navigate]);
  return (
    <div
      data-theme="light"
      className="h-screen flex flex-col lg:flex-row overflow-hidden"
    >
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-green-700 via-emerald-500 to-teal-400 items-center justify-center relative">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-emerald-300/30 rounded-full blur-2xl animate-bounce"></div>

        <div className="text-white max-w-lg text-center z-10 px-6">
          <h1 className="text-5xl font-extrabold mb-6 drop-shadow-lg">
            Land Information <br /> Management System
          </h1>
          <p className="text-lg opacity-90 leading-relaxed">
            Manage projects, villages, plots, and sub-plots seamlessly with
            real-time visualization and analytics.
          </p>
        </div>
      </div>
      <div className="flex flex-1 items-center justify-center bg-base-200 relative">
        <div className="card w-full max-w-md shadow-2xl bg-white/80 backdrop-blur-md">
          <div className="card-body">
            <h2 className="text-center text-3xl font-bold text-primary mb-6">
              Welcome Back
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-control">
                <label className="label pb-1">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  className="input input-bordered focus:input-primary transition w-full"
                  required
                  value={email}
                  onChange={handleChangeInput}
                />
              </div>
              <div className="form-control">
                <label className="label pb-1">
                  <span className="label-text">Password</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="••••••••"
                    className="input input-bordered w-full focus:input-primary transition"
                    required
                    value={password}
                    onChange={handleChangeInput}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-primary transition"
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>
              {error && (
                <p className="text-error text-sm text-center">{error}</p>
              )}

              <div className="flex justify-between items-center text-sm">
                <label className="cursor-pointer flex items-center space-x-2">
                  <input type="checkbox" className="checkbox checkbox-sm" />
                  <span>Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="link link-primary"
                >
                  Forgot password?
                </button>
              </div>
              <div className="form-control mt-4">
                <button
                  type="submit"
                  className="btn btn-primary w-full flex justify-center items-center gap-2 transition-transform hover:scale-105"
                  disabled={loading}
                >
                  {loading && <span className="loading loading-spinner"></span>}
                  {loading ? "Signing In..." : "Sign In"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
