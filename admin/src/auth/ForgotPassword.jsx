import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GlobalApi from "@/lib/GlobalApi";
import { User, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function ForgotPassword() {
  const [emailAddress, setEmailAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // We pass the redirectUrl as the current origin + reset path
      const redirectUrl = `${window.location.origin}/admin/reset-password`;
      const res = await GlobalApi.forgotPassword({ emailAddress, redirectUrl });
      
      if (res.data.success) {
        toast.success(res.data.message || "Reset link sent to your email!");
        setIsSent(true);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-gray-900 to-black p-4">
      <div className="bg-[#1E293B]/80 backdrop-blur-xl border border-gray-700 shadow-2xl rounded-2xl p-10 w-full max-w-md">
        <button
          onClick={() => navigate("/admin/login")}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6 text-sm"
        >
          <ArrowLeft size={16} /> Back to Sign In
        </button>

        <h2 className="text-3xl font-bold text-white mb-2">
          Forgot Password
        </h2>
        <p className="text-gray-400 text-sm mb-8">
          Enter your email address and we'll send you a link to reset your password.
        </p>

        {!isSent ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-gray-300 text-sm mb-2 block">Email Address</label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 text-gray-400" size={18} />
                <input
                  type="email"
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                  required
                  className="w-full bg-gray-800/70 border border-gray-600 rounded-lg py-2.5 pl-10 pr-4 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  placeholder="admin@example.com"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 text-center bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition duration-200 disabled:opacity-60 shadow-md hover:shadow-lg"
            >
              {loading ? "Sending link..." : "Send Reset Link"}
            </button>
          </form>
        ) : (
          <div className="text-center">
            <div className="bg-green-500/10 text-green-400 border border-green-500/40 rounded-lg p-4 text-sm mb-6">
              A password reset link has been sent to your email address. Please check your inbox.
            </div>
            <button
              onClick={() => navigate("/admin/login")}
              className="w-full py-2.5 text-center bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-semibold transition duration-200 shadow-md"
            >
              Return to Sign In
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
