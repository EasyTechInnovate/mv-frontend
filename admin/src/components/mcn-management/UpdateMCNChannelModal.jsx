"use client";
import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import GlobalApi from "@/lib/GlobalApi";

export default function UpdateMCNChannelModal({ isOpen, onClose, channel, theme = 'dark' }) {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const isDark = theme === "dark";

  useEffect(() => {
    if (channel) {
      setFormData({
        channelName: channel.channelName || "",
        channelLink: channel.channelLink || "",
        revenueShare: channel.revenueShare || 0,
        channelManager: channel.channelManager || "",
        notes: channel.notes || "",
      });
    }
  }, [channel]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'revenueShare' ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await GlobalApi.updateMcnChannel(channel._id, formData);
      toast.success("Channel details updated successfully!");
      onClose(true); // pass true to indicate a refresh is needed
    } catch (err) {
      console.error("❌ Error updating channel details:", err);
      toast.error(err.response?.data?.message || "Failed to update channel details");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;
  
  const bgMain = isDark ? "bg-[#111A22] text-slate-300" : "bg-gray-50 text-[#151F28]";
  const cardBg = isDark ? "bg-[#151F28]" : "bg-white";
  const borderColor = isDark ? "border-[#12212a]" : "border-gray-300";
  const textColor = isDark ? "text-gray-300" : "text-[#151F28]";
  const textMuted = isDark ? "text-gray-400" : "text-gray-600";
  const inputBg = isDark
    ? "bg-[#111A22] border-[#12212a] text-slate-300"
    : "bg-white border-gray-300 text-[#111A22]";
  const tabActive = isDark ? "bg-gray-800 text-white" : "bg-gray-100 text-black";
  const tabInactive = isDark ? "bg-[#151F28] text-gray-300" : "bg-gray-200 text-gray-600";

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className={`${cardBg} border ${borderColor} rounded-2xl w-full max-w-lg p-6`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className={`text-lg font-semibold ${textColor}`}>Edit Channel Details</h2>
          <button onClick={() => onClose(false)} className={`${textMuted} hover:${textColor}`}>
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          <div>
            <label className={`block text-sm ${textMuted} mb-2`}>Channel Name</label>
            <Input
              name="channelName"
              value={formData.channelName}
              onChange={handleChange}
              className={inputBg}
            />
          </div>
          <div>
            <label className={`block text-sm ${textMuted} mb-2`}>Channel Link</label>
            <Input
              name="channelLink"
              value={formData.channelLink}
              onChange={handleChange}
              className={inputBg}
            />
          </div>
          <div>
            <label className={`block text-sm ${textMuted} mb-2`}>Revenue Share (%)</label>
            <Input
              name="revenueShare"
              type="number"
              value={formData.revenueShare}
              onChange={handleChange}
              className={inputBg}
            />
          </div>
          <div>
            <label className={`block text-sm ${textMuted} mb-2`}>Channel Manager</label>
            <Input
              name="channelManager"
              value={formData.channelManager}
              onChange={handleChange}
              className={inputBg}
            />
          </div>
          <div>
            <label className={`block text-sm ${textMuted} mb-2`}>Notes</label>
            <Textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className={inputBg}
              rows={4}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={() => onClose(false)} className={`border-gray-700 ${textMuted}`}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            {loading ? "Updating..." : "Update Channel"}
          </Button>
        </div>
      </div>
    </div>
  );
}