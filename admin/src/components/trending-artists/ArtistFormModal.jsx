import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import GlobalApi from "@/lib/GlobalApi";
import { toast } from "sonner";

export default function ArtistFormModal({
  open,
  onClose,
  artist,
  refreshList,
  theme,
}) {
  const [form, setForm] = useState({
    artistNumber: "",
    artistName: "",
    designation: "",
    profileImageUrl: "",
    catalogUrls: [],
    totalReleases: 0,
    monthlyStreams: 0,
    status: "active",
  });
  const [catalogUrlInput, setCatalogUrlInput] = useState("");
  const [loading, setLoading] = useState(false);

  const isEditMode = !!artist;
  const isDark = theme === "dark";

  useEffect(() => {
    if (isEditMode && artist) {
      setForm({
        artistNumber: artist.artistNumber || "",
        artistName: artist.artistName || "",
        designation: artist.designation || "",
        profileImageUrl: artist.profileImageUrl || "",
        catalogUrls: artist.catalogUrls || [],
        totalReleases: artist.totalReleases || 0,
        monthlyStreams: artist.monthlyStreams || 0,
        status: artist.status || "active",
      });
    } else {
      setForm({
        artistNumber: "",
        artistName: "",
        designation: "",
        profileImageUrl: "",
        catalogUrls: [],
        totalReleases: 0,
        monthlyStreams: 0,
        status: "active",
      });
    }
  }, [artist, isEditMode, open]);

  const handleChange = (field, value) => {
    if (field === "totalReleases" || field === "monthlyStreams") {
      setForm((prev) => ({ ...prev, [field]: Number(value) || 0 }));
    } else {
      setForm((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleAddCatalogUrl = () => {
    if (catalogUrlInput && !form.catalogUrls.includes(catalogUrlInput)) {
      setForm((prev) => ({
        ...prev,
        catalogUrls: [...prev.catalogUrls, catalogUrlInput],
      }));
      setCatalogUrlInput("");
    }
  };

  const handleRemoveCatalogUrl = (urlToRemove) => {
    setForm((prev) => ({
      ...prev,
      catalogUrls: prev.catalogUrls.filter((url) => url !== urlToRemove),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form };
      if (isEditMode) {
        await GlobalApi.updateTrendingArtist(artist._id, payload);
        toast.success("Artist updated successfully!");
      } else {
        await GlobalApi.createTrendingArtist(payload);
        toast.success("Artist created successfully!");
      }
      refreshList();
      onClose();
    } catch (error) {
      console.error("Failed to save artist:", error);
      const msg = error?.response?.data?.message || error?.message || "Failed to save artist";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  const bgClass = isDark ? "bg-[#151F28] text-white" : "bg-white text-black";
  const inputClass = `w-full rounded-lg border px-3 py-2 text-sm focus:outline-none ${
    isDark
      ? "bg-[#0F1620] border-gray-700 placeholder-gray-500 text-white focus:border-purple-500"
      : "bg-gray-50 border-gray-300 placeholder-gray-500 text-black focus:border-purple-600"
  }`;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 120 }} className={`rounded-2xl shadow-[0_0_25px_rgba(0,0,0,0.4)] w-[700px] max-w-[90%] p-6 relative ${bgClass} border ${isDark ? "border-gray-800" : "border-gray-200"}`}>
        
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">{isEditMode ? "Edit Artist" : "Add New Artist"}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Artist Name</label>
              <Input
                name="artistName"
                value={form.artistName}
                onChange={(e) => handleChange("artistName", e.target.value)}
                placeholder="e.g., Arijit Singh"
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Artist Number</label>
              <Input
                name="artistNumber"
                value={form.artistNumber}
                onChange={(e) => handleChange("artistNumber", e.target.value)}
                placeholder="e.g., ART-001"
                className={inputClass}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm mb-1">Designation</label>
            <Input
              name="designation"
              value={form.designation}
              onChange={(e) => handleChange("designation", e.target.value)}
              placeholder="e.g., Playback Singer"
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Profile Image URL</label>
            <Input
              name="profileImageUrl"
              value={form.profileImageUrl}
              onChange={(e) => handleChange("profileImageUrl", e.target.value)}
              placeholder="e.g., https://example.com/profile.jpg"
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm mb-1">Total Releases</label>
              <Input
                name="totalReleases"
                type="number"
                min="0"
                value={form.totalReleases}
                onChange={(e) => handleChange("totalReleases", e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Monthly Streams</label>
              <Input
                name="monthlyStreams"
                type="number"
                min="0"
                value={form.monthlyStreams}
                onChange={(e) => handleChange("monthlyStreams", e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Status</label>
              <Select value={form.status} onValueChange={(val) => handleChange("status", val)}>
                <SelectTrigger className={`w-full ${inputClass} flex justify-between`}>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className={bgClass}>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm mb-1">Catalog URLs</label>
            <div className="flex gap-2">
              <Input
                value={catalogUrlInput}
                onChange={(e) => setCatalogUrlInput(e.target.value)}
                placeholder="https://open.spotify.com/artist/..."
                className={inputClass}
              />
              <Button type="button" onClick={handleAddCatalogUrl} className="bg-purple-600 hover:bg-purple-700 text-white rounded-full px-4">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {form.catalogUrls.map((url) => (
                <div
                  key={url}
                  className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs ${isDark ? "bg-[#0F1620]" : "bg-gray-100"}`}
                >
                  <span>{url}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveCatalogUrl(url)}
                    className="text-red-500 hover:text-red-400"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-end mt-6 gap-3 pt-4">
            <Button type="button" variant="outline" disabled={loading} onClick={onClose} className={`rounded-full px-4 ${isDark ? "bg-transparent border-gray-800 text-gray-300 hover:bg-gray-800" : "border-gray-300 text-gray-700 hover:bg-gray-100"}`}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-purple-600 hover:bg-purple-700 text-white rounded-full px-4 flex items-center gap-2">
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  {isEditMode ? "Updating..." : "Saving..."}
                </>
              ) : isEditMode ? "Update Artist" : "Save Artist"}
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}