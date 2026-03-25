import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import GlobalApi from "@/lib/GlobalApi";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

export default function ResetPasswordModal({ isOpen, onClose, userData, theme }) {
  const isDark = theme === "dark";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      await GlobalApi.resetUserPassword(userData._id, {
        password: newPassword,
        confirmPassword: confirmPassword,
      });

      toast.success("Password reset successfully");
      onClose();
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={`max-w-md rounded-xl ${
          isDark
            ? "bg-[#151F28] text-gray-200 border border-gray-700"
            : "bg-white text-gray-800"
        }`}
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Reset Password - {userData?.artistData?.artistName ||
              userData?.labelData?.labelName ||
              userData?.aggregatorData?.companyName ||
              userData?.emailAddress || "User"}
          </DialogTitle>
          <DialogDescription
            className={`${isDark ? "text-gray-400" : "text-gray-600"}`}
          >
            Directly set a new password for this user.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-3">
          <div className="flex flex-col gap-1">
            <label className="text-sm">New Password</label>
            <div className="relative">
              <Input
                type={showNewPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={`${isDark ? "bg-[#111A22] border-gray-700" : ""} font-mono pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
              >
                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm">Confirm Password</label>
            <div className="relative">
              <Input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`${isDark ? "bg-[#111A22] border-gray-700" : ""} font-mono pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
        </div>

        
        <div className="flex justify-end gap-3 mt-6">
          <Button
            variant={isDark ? "outline" : "secondary"}
            onClick={onClose}
            className="px-6"
          >
            Cancel
          </Button>

          <Button
            onClick={handleReset}
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
