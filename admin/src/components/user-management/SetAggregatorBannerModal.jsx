import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import GlobalApi from "@/lib/GlobalApi";

export default function SetAggregatorBannerModal({ isOpen, onClose, user, theme }) {
  const isDark = theme === "dark";
  const [heading, setHeading] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && user) {
      setHeading(user?.aggregatorBanner?.heading || '');
      setDescription(user?.aggregatorBanner?.description || '');
    }
  }, [isOpen, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await GlobalApi.updateAggregatorBanner(user._id, {
        heading,
        description
      });
      toast.success("Aggregator banner updated successfully");
      onClose();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update banner");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div
        className={`w-full max-w-md rounded-xl shadow-2xl overflow-hidden ${
          isDark ? "bg-[#151F28] text-gray-200" : "bg-white text-gray-800"
        }`}
      >
        <div
          className={`px-6 py-4 flex justify-between items-center border-b ${
            isDark ? "border-gray-800" : "border-gray-200"
          }`}
        >
          <h2 className="text-xl font-semibold">Set Aggregator Banner</h2>
          <button
            onClick={onClose}
            className={`text-2xl hover:text-purple-500 transition-colors ${
              isDark ? "text-gray-400" : "text-gray-500"
            }`}
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-sm text-gray-500">
            Configure the banner that will appear at the top of the {user?.firstName}'s dashboard.
          </p>

          <div className="space-y-2">
            <label className="text-sm font-medium">Heading</label>
            <Input
              value={heading}
              onChange={(e) => setHeading(e.target.value)}
              placeholder="E.g., Special Announcement for Aggregators!"
              className={isDark ? "bg-[#111A22] border-gray-700" : "bg-white border-gray-300"}
              maxLength={100}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter brief details for the banner..."
              rows={4}
              className={isDark ? "bg-[#111A22] border-gray-700 resize-none" : "bg-white border-gray-300 resize-none"}
              maxLength={500}
            />
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-gray-200 dark:border-gray-800 mt-4">
            <Button
              type="button"
              variant={isDark ? "outline" : "secondary"}
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Banner"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
