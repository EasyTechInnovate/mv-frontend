import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GlobalApi from "@/lib/GlobalApi";
import { Lock, User, Eye, EyeOff } from "lucide-react";

export default function AdminLogin() {
  const [credentials, setCredentials] = useState({ emailAddress: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await GlobalApi.login(credentials);

localStorage.setItem("adminAccessToken", res.data.data.tokens.accessToken);
localStorage.setItem("adminRefreshToken", res.data.data.tokens.refreshToken);
localStorage.setItem("adminUser", JSON.stringify(res.data.data.user));

      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-gray-900 to-black">
      <div className="bg-[#1E293B]/80 backdrop-blur-xl border border-gray-700 shadow-2xl rounded-2xl p-10 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-white mb-8">
          Admin Sign In
        </h2>

        {error && (
          <div className="bg-red-500/10 text-red-400 border border-red-500/40 rounded-lg p-3 text-sm mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
       
          <div>
            <label className="text-gray-300 text-sm mb-2 block">Email</label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <input
                type="email"
                name="emailAddress"
                value={credentials.emailAddress}
                onChange={handleChange}
                required
                className="w-full bg-gray-800/70 border border-gray-600 rounded-lg py-2.5 pl-10 pr-4 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                placeholder="admin@example.com"
              />
            </div>
          </div>

         
          <div>
            <label className="text-gray-300 text-sm mb-2 block">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={credentials.password}
                onChange={handleChange}
                required
                className="w-full bg-gray-800/70 border border-gray-600 rounded-lg py-2.5 pl-10 pr-10 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-200 focus:outline-none"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 text-center bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition duration-200 disabled:opacity-60 shadow-md hover:shadow-lg"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <p className="text-gray-400 text-xs text-center mt-6">
          © {new Date().getFullYear()} Admin Panel — All Rights Reserved
        </p>
      </div>
    </div>
  );
}
