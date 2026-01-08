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
import { Checkbox } from "@/components/ui/checkbox";
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
  syncClearedOptions,
  masterRightsOptions,
  publishingRightsOptions,
} from "@/constants/options";

const initialSyncFormData = {
    projectSuitability: { ad_campaigns: false, ott_web_series: false, tv_film_score: false, trailers: false, podcasts: false, corporate_films: false, fashion_or_product_launch: false, gaming_animation: false, festival_documentaries: false, short_films_student_projects: false },
};

const InputWithLabel = ({ id, label, value, onChange, disabled, ...props }) => (
    <div className="space-y-2">
        <Label htmlFor={id}>{label}</Label>
        <Input id={id} value={value} onChange={onChange} disabled={disabled} {...props} />
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
                    {options.map(option => <SelectItem key={option.label} value={option.value}>{option.label}</SelectItem>)}
                </SelectContent>
            </Select>
        </div>
    );
};

const CheckboxWithLabel = ({ id, label, checked, onCheckedChange, disabled }) => (
    <div className="flex items-center space-x-2">
        <Checkbox id={id} checked={checked} onCheckedChange={onCheckedChange} disabled={disabled} />
        <label htmlFor={id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {label}
        </label>
    </div>
);

export default function EditSyncLicenseModal({ isOpen, onClose, data, refreshList, theme }) {
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(false);
  const isDark = theme === "dark";

  useEffect(() => {
    if (data) {
        let projectSuitability = {};
        Object.keys(initialSyncFormData.projectSuitability).forEach(key => {
            projectSuitability[key] = data.projectSuitability?.includes(key) || false;
        });

        setFormData({
            ...data,
            genres: Array.isArray(data.genres) ? data.genres[0] : data.genres,
            trackLinks: data.trackLinks?.[0]?.url || '',
            projectSuitability,
        });
    }
  }, [data]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (field, checked) => {
    setFormData(prev => ({
        ...prev,
        projectSuitability: { ...prev.projectSuitability, [field]: checked }
    }));
  };

  const handleFormSubmit = async () => {
    if (!formData) return;
    setLoading(true);

    const payload = {
      ...formData,
      genres: [formData.genres],
      projectSuitability: Object.keys(formData.projectSuitability).filter(key => formData.projectSuitability[key]),
      trackLinks: [{ platform: "Spotify", url: formData.trackLinks }]
    };

    try {
      await GlobalApi.updateSyncSubmission(data._id, payload);
      toast.success("Sync submission updated successfully!");
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
          <DialogTitle>Edit Sync License Submission</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-8 max-h-[70vh] overflow-y-auto">
            <div>
                <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputWithLabel id="trackName" label="Track Name" value={formData.trackName} onChange={(e) => handleInputChange('trackName', e.target.value)} />
                    <InputWithLabel id="artistName" label="Artist Name" value={formData.artistName} onChange={(e) => handleInputChange('artistName', e.target.value)} />
                    <InputWithLabel id="labelName" label="Label Name" value={formData.labelName} onChange={(e) => handleInputChange('labelName', e.target.value)} />
                    <InputWithLabel id="isrc" label="ISRC of the Track" value={formData.isrc} onChange={(e) => handleInputChange('isrc', e.target.value)} />
                    <SelectWithLabel id="genres" label="Genres" value={formData.genres} onValueChange={(value) => handleInputChange('genres', value)} options={genreOptions} theme={theme} />
                    <SelectWithLabel id="mood" label="Mood" value={formData.mood} onValueChange={(value) => handleInputChange('mood', value)} options={moodOptions} theme={theme} />
                    <SelectWithLabel id="isVocalsPresent" label="Is Vocals Present?" value={formData.isVocalsPresent} onValueChange={(value) => handleInputChange('isVocalsPresent', value)} options={vocalsPresentOptions} theme={theme} />
                    <SelectWithLabel id="language" label="Language" value={formData.language} disabled={!formData.isVocalsPresent} onValueChange={(value) => handleInputChange('language', value)} options={languageOptions} theme={theme} />
                    <div className="md:col-span-2">
                        <SelectWithLabel id="theme" label="Theme" value={formData.theme} onValueChange={(value) => handleInputChange('theme', value)} options={themeOptions} theme={theme} />
                    </div>
                    <InputWithLabel id="tempoBPM" label="Tempo/BPM" value={formData.tempoBPM} onChange={(e) => handleInputChange('tempoBPM', e.target.value)} />
                </div>
            </div>

            <div>
                <h3 className="text-lg font-semibold mb-4">Rights Ownership and Clearance</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SelectWithLabel id="masterRightsOwner" label="Who owns the Master Rights?" value={formData.masterRightsOwner} onValueChange={(value) => handleInputChange('masterRightsOwner', value)} options={masterRightsOptions} theme={theme} />
                    <SelectWithLabel id="publishingRightsOwner" label="Who owns the Publishing Rights?" value={formData.publishingRightsOwner} onValueChange={(value) => handleInputChange('publishingRightsOwner', value)} options={publishingRightsOptions} theme={theme} />
                    <div className="md:col-span-2">
                        <SelectWithLabel id="isFullyClearedForSync" label="Is the Track fully cleared for sync use?" value={formData.isFullyClearedForSync} onValueChange={(value) => handleInputChange('isFullyClearedForSync', value)} options={syncClearedOptions} theme={theme} />
                    </div>
                    <InputWithLabel id="proAffiliation" label="PRO affiliation (e.g. BMI, IPRS, ASCAP)" value={formData.proAffiliation} onChange={(e) => handleInputChange('proAffiliation', e.target.value)} />
                </div>
            </div>

            <div>
                <Label className="text-base font-semibold">Project Suitability</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-3">
                    {Object.keys(initialSyncFormData.projectSuitability).map((key) => {
                        const label = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                        return <CheckboxWithLabel key={key} id={key} label={label} checked={formData.projectSuitability[key]} onCheckedChange={(checked) => handleCheckboxChange(key, checked)} />
                    })}
                </div>
            </div>

            <div>
                <InputWithLabel id="trackLinks" label="Track Link (Any Store)" value={formData.trackLinks} onChange={(e) => handleInputChange('trackLinks', e.target.value)} />
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
