import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import GlobalApi from "@/lib/GlobalApi";
import { Lock, Eye, EyeOff, CheckCircle } from "lucide-react";
import { toast } from "sonner";

export default function ResetPassword() {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      toast.error("Invalid or missing reset token.");
      navigate("/admin/login");
    }
  }, [token, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await GlobalApi.resetPassword({
        token,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      if (res.data.success) {
        toast.success(res.data.message || "Password reset successfully!");
        setIsSuccess(true);
        setTimeout(() => {
          navigate("/admin/login");
        }, 3000);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reset password. Link may be expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-gray-900 to-black p-4">
      <div className="bg-[#1E293B]/80 backdrop-blur-xl border border-gray-700 shadow-2xl rounded-2xl p-10 w-full max-w-md">
        <h2 className="text-3xl font-bold text-white mb-2">
          Reset Password
        </h2>
        <p className="text-gray-400 text-sm mb-8">
          Please enter your new password below.
        </p>

        {!isSuccess ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-gray-300 text-sm mb-2 block">New Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 text-gray-400" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  autoComplete="new-password"
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

            <div>
              <label className="text-gray-300 text-sm mb-2 block">Confirm New Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 text-gray-400" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  autoComplete="new-password"
                  className="w-full bg-gray-800/70 border border-gray-600 rounded-lg py-2.5 pl-10 pr-4 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 text-center bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition duration-200 disabled:opacity-60 shadow-md hover:shadow-lg"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        ) : (
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <CheckCircle size={64} className="text-green-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Success!</h3>
            <p className="text-gray-400 text-sm mb-8">
              Your password has been reset successfully. Redirecting you to login...
            </p>
            <button
              onClick={() => navigate("/admin/login")}
              className="w-full py-2.5 text-center bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition duration-200 shadow-md"
            >
              Sign In Now
            </button>
          </div>
        )}

        <p className="text-gray-400 text-xs text-center mt-10">
          © {new Date().getFullYear()} Admin Panel — All Rights Reserved
        </p>
      </div>
    </div>
  );
}
