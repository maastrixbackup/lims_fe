import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

export default function LandingPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    login("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Miwicm9sZV9pZCI6MSwicm9sZV9uYW1lIjoiU3VwZXIgQWRtaW4iLCJpYXQiOjE3NTc1NzIzNjYsImV4cCI6MTc1NzU3NTk2Nn0.XAfDZ_tQOerqcDqw0ZTDoTKb2h1Z14segSO5U6MZjBU")
    // try {
    //   const res = await fetch("http://localhost:5000/api/login", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({ email, password }),
    //   });

    //   if (!res.ok) {
    //     const msg = await res.json();
    //     setError(msg.error || "Login failed");
    //     return;
    //   }

    //   const data = await res.json();
    //   login(data.token);
    // } catch (err) {
    //   console.error(err);
    //   setError("Something went wrong");
    // }
  };

  return (
    <div className="h-screen flex flex-col lg:flex-row overflow-hidden">
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
                <div className="relative">
                  <input
                    type="email"
                    placeholder="you@example.com"
                    className="input input-bordered focus:input-primary transition w-full pr-10"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-control">
                <label className="label pb-1">
                  <span className="label-text">Password</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="input input-bordered w-full pr-10 focus:input-primary transition"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-primary transition"
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center text-sm">
                <label className="cursor-pointer flex items-center space-x-2">
                  <input type="checkbox" className="checkbox checkbox-sm" />
                  <span>Remember me</span>
                </label>
                <a href="#" className="link link-primary">
                  Forgot password?
                </a>
              </div>

              <div className="form-control mt-4">
                <button
                  // onClick={() => navigate("/dashboard")}
                  className="btn btn-primary w-full transition-transform hover:scale-105"
                >
                  Sign In
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
