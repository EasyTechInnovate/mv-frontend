import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import GlobalApi from "@/lib/GlobalApi";
import {
  genreOptions,
  moodOptions,
  languageOptions,
  themeOptions,
  vocalsPresentOptions,
  storeOptions,
} from "@/constants/options";

const InputWithLabel = ({ id, label, value, onChange, disabled, ...props }) => (
  <div className="space-y-2">
    <Label htmlFor={id}>{label}</Label>
    <Input
      id={id}
      value={value}
      onChange={onChange}
      disabled={disabled}
      {...props}
    />
  </div>
);

const SelectWithLabel = ({ id, label, value, onValueChange, disabled, options, theme }) => {
  const isDark = theme === 'dark';
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Select value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger id={id}>
          <SelectValue placeholder="Select..." />
        </SelectTrigger>
        <SelectContent className={isDark ? "bg-[#111A22] text-gray-200 border-gray-700" : ""}>
          {options.map((option) => (
            <SelectItem key={option.label} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default function EditPlaylistPitchingModal({ isOpen, onClose, data, refreshList, theme }) {
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(false);
  const isDark = theme === "dark";

  useEffect(() => {
    if (data) {
      setFormData({
        ...data,
        genres: Array.isArray(data.genres) ? data.genres[0] : data.genres,
        trackLinks: data.trackLinks || [{ platform: "", url: "" }],
        selectedStore: data.selectedStore === "Select All" ? "select_all" : data.selectedStore,
      });
    }
  }, [data]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value };
      
      if (field === 'selectedStore') {
        if (value === 'select_all') {
          newData.trackLinks = [
            { platform: 'Spotify', url: '' },
            { platform: 'Apple Music', url: '' },
            { platform: 'JioSaavn', url: '' },
            { platform: 'Amazon', url: '' },
          ];
        } else {
          newData.trackLinks = [{ platform: value, url: '' }];
        }
      }
      
      return newData;
    });
  };

    const handleTrackLinkChange = (index, url) => {
    const newTrackLinks = [...formData.trackLinks];
    newTrackLinks[index] = { ...newTrackLinks[index], url };
    setFormData((prev) => ({ ...prev, trackLinks: newTrackLinks }));
  };

  const handleFormSubmit = async () => {
    if (!formData) return;
    setLoading(true);

    const payload = {
        ...formData,
        genres: [formData.genres],
        selectedStore: formData.selectedStore === "select_all" ? "Select All" : formData.selectedStore,
    };

    try {
        await GlobalApi.updatePlayPitching(data._id, payload);
        toast.success("Submission updated successfully!");
        refreshList();
        onClose();
    } catch (error) {
        toast.error(error.response?.data?.message || "Failed to update submission.");
    } finally {
        setLoading(false);
    }
  };

  if (!formData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`sm:max-w-3xl ${isDark ? "bg-[#111A22] text-gray-200 border-gray-700" : "bg-white text-gray-800 border-gray-200"}`}>
        <DialogHeader>
          <DialogTitle>Edit Playlist Pitch</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-6 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputWithLabel
              id="trackName"
              label="Track Name"
              value={formData.trackName}
              onChange={(e) => handleInputChange("trackName", e.target.value)}
            />
            <InputWithLabel
              id="artistName"
              label="Artist Name"
              value={formData.artistName}
              onChange={(e) => handleInputChange("artistName", e.target.value)}
            />
            <InputWithLabel
              id="labelName"
              label="Label Name"
              value={formData.labelName}
              onChange={(e) => handleInputChange("labelName", e.target.value)}
            />
            <InputWithLabel
              id="isrc"
              label="ISRC of the Track"
              value={formData.isrc}
              onChange={(e) => handleInputChange("isrc", e.target.value)}
            />
            <SelectWithLabel
              id="genres"
              label="Genres"
              value={formData.genres}
              onValueChange={(value) => handleInputChange("genres", value)}
              options={genreOptions}
              theme={theme}
            />
            <SelectWithLabel
              id="mood"
              label="Mood"
              value={formData.mood}
              onValueChange={(value) => handleInputChange("mood", value)}
              options={moodOptions}
              theme={theme}
            />
            <SelectWithLabel
              id="isVocalsPresent"
              label="Is Vocals Present?"
              value={formData.isVocalsPresent}
              onValueChange={(value) => handleInputChange("isVocalsPresent", value)}
              options={vocalsPresentOptions}
              theme={theme}
            />
            <SelectWithLabel
              id="language"
              label="Language"
              value={formData.language}
              disabled={!formData.isVocalsPresent}
              onValueChange={(value) => handleInputChange("language", value)}
              options={languageOptions}
              theme={theme}
            />
            <SelectWithLabel
              id="theme"
              label="Theme"
              value={formData.theme}
              onValueChange={(value) => handleInputChange("theme", value)}
              options={themeOptions}
              theme={theme}
            />
            <SelectWithLabel
              id="selectedStore"
              label="Select Store"
              value={formData.selectedStore}
              onValueChange={(value) => handleInputChange("selectedStore", value)}
              options={storeOptions}
              theme={theme}
            />
            <div className="md:col-span-2">
              {formData.selectedStore === 'select_all' ? (
                <div className="space-y-4">
                  {formData.trackLinks.map((trackLink, index) => (
                    <InputWithLabel
                      key={index}
                      id={`trackLink-${index}`}
                      label={`Track Link for ${trackLink.platform}`}
                      placeholder={`Link for ${trackLink.platform}`}
                      value={trackLink.url}
                      onChange={(e) => handleTrackLinkChange(index, e.target.value)}
                    />
                  ))}
                </div>
              ) : (
                <InputWithLabel 
                  id="trackLink" 
                  label="Track Link" 
                  placeholder="Link" 
                  value={formData.trackLinks[0]?.url || ''} 
                  onChange={(e) => handleTrackLinkChange(0, e.target.value)} 
                />
              )}
            </div>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={handleFormSubmit} disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
