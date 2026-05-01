import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../utils/userSlice";
import { API_BASE_URL } from "../../utils/config";
import logo from "../../assets/logo.jpeg";

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
      // console.log("Login response data^^^^^^^^^^^^^^:", data);
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Invalid email or password");
      }

      localStorage.removeItem("authToken");
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
          <div className="mb-6 flex flex-col items-center">
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
              {/* <p className="text-sm font-medium uppercase tracking-wide text-gray-500">
                Land Management System
              </p> */}
            </div>
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
            <div className="mb-6 flex flex-col items-center">
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
              <p className="text-sm font-medium uppercase tracking-wide text-gray-500">
                LAND INFORMATION MANAGEMENT SYSTEM
              </p>
            </div>
            <h2 className="mb-2 text-center text-3xl font-bold text-emerald-900">
              Welcome Back
            </h2>
            <p className="mb-6 text-center text-sm text-gray-600">
              Sign in with your registered email and password to continue.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your registered email"
                  className="w-full rounded-xl border border-emerald-100 bg-white/90 p-3 text-gray-800 shadow-sm outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-200"
                  required
                  value={email}
                  onChange={handleChangeInput}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
                    className="w-full rounded-xl border border-emerald-100 bg-white/90 p-3 pr-16 text-gray-800 shadow-sm outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-200"
                    required
                    value={password}
                    onChange={handleChangeInput}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-3 cursor-pointer text-sm font-medium text-emerald-700 transition hover:text-emerald-900"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end text-sm">
                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="cursor-pointer font-medium text-emerald-700 transition hover:text-emerald-900"
                >
                  Forgot Password?
                </button>
              </div>

              <button
                type="submit"
                className="w-full cursor-pointer rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 py-3 font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:from-emerald-700 hover:to-teal-600 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={loading}
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>
            </form>

            {error && (
              <p className="rounded-xl bg-red-50 px-4 py-3 text-center text-sm text-red-700">
                {error}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
