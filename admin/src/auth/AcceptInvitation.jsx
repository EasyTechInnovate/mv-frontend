import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import GlobalApi from "@/lib/GlobalApi";
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle, User as UserIcon } from "lucide-react";
import { toast } from "sonner";

export default function AcceptInvitation() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  
  const [invitationData, setInvitationData] = useState(null);
  const [passwords, setPasswords] = useState({ password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setError("Invitation token is missing. Please check your email link.");
      setFetching(false);
      return;
    }

    const fetchInvitationDetails = async () => {
      try {
        const res = await GlobalApi.getInvitationDetails(token);
        setInvitationData(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Invalid or expired invitation link.");
      } finally {
        setFetching(false);
      }
    };

    fetchInvitationDetails();
  }, [token]);

  const handleChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (passwords.password !== passwords.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (passwords.password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await GlobalApi.acceptInvitation({
        invitationToken: token,
        password: passwords.password,
        confirmPassword: passwords.confirmPassword
      });
      
      toast.success("Account activated successfully! You can now log in.");
      setTimeout(() => navigate("/admin/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to accept invitation");
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#111A22]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-gray-900 to-black p-4">
      <div className="bg-[#1E293B]/80 backdrop-blur-xl border border-gray-700 shadow-2xl rounded-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-600/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-indigo-500/30">
            <UserIcon className="text-indigo-400" size={32} />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">
            Join the Team
          </h2>
          {invitationData && (
            <p className="text-gray-400 text-sm">
              Hello <span className="text-indigo-400 font-semibold">{invitationData.firstName}</span>, 
              complete your profile to get started as <span className="text-indigo-400 font-semibold">{invitationData.teamRole}</span>.
            </p>
          )}
        </div>

        {error ? (
          <div className="bg-red-500/10 text-red-400 border border-red-500/40 rounded-lg p-4 text-sm mb-6 flex items-start gap-3">
            <AlertCircle className="shrink-0 mt-0.5" size={18} />
            <p>{error}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-gray-300 text-sm mb-2 block">New Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 text-gray-400" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={passwords.password}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-800/70 border border-gray-600 rounded-lg py-2.5 pl-10 pr-10 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
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
              <label className="text-gray-300 text-sm mb-2 block">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 text-gray-400" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={passwords.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-800/70 border border-gray-600 rounded-lg py-2.5 pl-10 pr-10 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="space-y-2">
               <p className="text-[10px] text-gray-500 flex items-center gap-2">
                 <CheckCircle2 size={12} className={passwords.password.length >= 8 ? "text-green-500" : "text-gray-600"} />
                 At least 8 characters required
               </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 text-center bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-all duration-200 disabled:opacity-60 shadow-lg hover:shadow-indigo-500/20 active:scale-[0.98]"
            >
              {loading ? "Activating..." : "Accept Invitation"}
            </button>
          </form>
        )}

        <p className="text-gray-500 text-[10px] text-center mt-8">
          © {new Date().getFullYear()} Maheshwari Visuals — All Rights Reserved
        </p>
      </div>
    </div>
  );
}
