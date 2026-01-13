"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import GlobalApi from "@/lib/GlobalApi";
import { toast } from "sonner";

export default function AddMonthModal({
  theme,
  onClose,
  onSuccess,
  mode = "add",
  initialData = null,
}) {
  const isDark = theme === "dark";

  const [month, setMonth] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [type, setType] = useState("analytics");
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setMonth(initialData.month);
      setDisplayName(initialData.displayName);
      setType(initialData.type);
      setIsActive(initialData.isActive);
    }
  }, [mode, initialData]);

  const validateMonth = (m) => /^[A-Za-z]{3}-\d{2}$/.test(m);

  const submit = async () => {
    if (!month.trim() || !displayName.trim()) {
      return toast.error("All fields are required");
    }

    if (!validateMonth(month.trim())) {
      return toast.error("Month must be in format MMM-YY (e.g., Jan-25)");
    }

    const payload = {
      month: month.trim(),
      displayName: displayName.trim(),
      type,
      isActive,
    };

    try {
      setLoading(true);

      if (mode === "add") {
        await GlobalApi.createMonth(payload);
        toast.success("Month created successfully");
      } else {
        await GlobalApi.updateMonth(initialData._id, payload);
        toast.success("Month updated successfully");
      }

      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to submit");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`w-[92%] max-w-[650px] rounded-xl p-6 shadow-lg ${
          isDark ? "bg-[#111A22] text-gray-100" : "bg-white text-[#151F28]"
        }`}
      >
        <h2 className="text-xl font-semibold">
          {mode === "add" ? "Add New Month" : "Edit Month"}
        </h2>

        <p className="text-sm opacity-70 mb-5">
          {mode === "add"
            ? "Add New Month For Analytics Management"
            : "Update Existing Month"}
        </p>

        <div className="space-y-4">
          <div>
            <label className="text-sm opacity-80">Type Month (MMM-YY)</label>
            <Input
              placeholder="Jan-25"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className={`mt-1 ${
                isDark ? "bg-[#151F28] border-gray-700 text-gray-200" : ""
              }`}
            />
          </div>

          <div>
            <label className="text-sm opacity-80">Display Name</label>
            <Input
              placeholder="January 2025"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className={`mt-1 ${
                isDark ? "bg-[#151F28] border-gray-700 text-gray-200" : ""
              }`}
            />
          </div>

          <div>
            <label className="text-sm opacity-80">Month Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className={`w-full p-2 rounded-md text-sm mt-1 ${
                isDark
                  ? "bg-[#151F28] border border-gray-700 text-gray-200"
                  : "bg-gray-100"
              }`}
            >
              <option value="analytics">Analytics</option>
              <option value="royalty">Royalty</option>
              <option value="bonus">Bonus</option>
              <option value="mcn">MCN Royalty</option>
            </select>
          </div>

          <div className="flex items-center gap-3 mt-2">
            <label className="text-sm opacity-80">Display</label>
            <Switch checked={isActive} onCheckedChange={setIsActive} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-8">
          <Button
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
            onClick={submit}
          >
            {loading
              ? mode === "add"
                ? "Creating..."
                : "Updating..."
              : mode === "add"
              ? "Create"
              : "Update"}
          </Button>

          <Button
            variant="outline"
            className={`rounded-lg ${
              isDark
                ? "border-gray-700 text-gray-300 hover:bg-[#151F28]"
                : "border-gray-300"
            }`}
            onClick={onClose}
          >
            Cancel
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
