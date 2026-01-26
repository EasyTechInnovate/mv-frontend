import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  genreOptions,
  moodOptions,
  languageOptions,
  themeOptions,
} from "@/constants/options";

const locationMap = {
  indoor_studio: "Indoor Studio",
  outdoor_natural: "Outdoor / Natural",
  urban_and_street: "Urban / Street",
  other: "Other",
};

export default function ProjectOverview({
  theme = "dark",
  className = "",
  data = {},
  editMode = false,
  handleInputChange,
  handleCheckboxChange,
}) {
  const isDark = theme === "dark";
  const cardBg = isDark ? "#151F28" : "#ffffff";
  const textColor = isDark ? "text-white" : "text-black";

  return (
    <div
      className={`w-full rounded-xl p-6 mt-8 ${textColor} ${className} ${
        isDark ? "text-white border border-gray-800" : "text-black"
      }`}
      style={{ backgroundColor: cardBg }}
    >
      <h2 className="text-lg font-semibold mb-6">Project Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
            <Label>Project Title</Label>
            <Input value={data.projectTitle} readOnly={!editMode} onChange={(e) => handleInputChange('projectTitle', e.target.value)} />
        </div>
        <div className="space-y-2">
            <Label>Artist Name</Label>
            <Input value={data.artistName} readOnly={!editMode} onChange={(e) => handleInputChange('artistName', e.target.value)} />
        </div>
        <div className="space-y-2">
            <Label>Label Name</Label>
            <Input value={data.labelName} readOnly={!editMode} onChange={(e) => handleInputChange('labelName', e.target.value)} />
        </div>
        <div className="space-y-2">
            <Label>Release Timeline</Label>
            <Input value={data.releaseTimeline} readOnly={!editMode} onChange={(e) => handleInputChange('releaseTimeline', e.target.value)} />
        </div>

        <div className="space-y-2">
            <Label>Genre</Label>
            {editMode ? (
                <Select value={data.genres} onValueChange={(value) => handleInputChange('genres', value)}>
                    <SelectTrigger><SelectValue placeholder="Select genre" /></SelectTrigger>
                    <SelectContent className={`max-h-[300px] overflow-y-auto ${isDark ? "bg-[#111A22] text-gray-200 border-gray-700" : ""}`}>
                        {genreOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                    </SelectContent>
                </Select>
            ) : (<Input value={data.genres} readOnly />)}
        </div>
        <div className="space-y-2">
            <Label>Mood</Label>
            {editMode ? (
                <Select value={data.mood} onValueChange={(value) => handleInputChange('mood', value)}>
                    <SelectTrigger><SelectValue placeholder="Select mood" /></SelectTrigger>
                    <SelectContent className={`max-h-[300px] overflow-y-auto ${isDark ? "bg-[#111A22] text-gray-200 border-gray-700" : ""}`}>
                        {moodOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                    </SelectContent>
                </Select>
            ) : (<Input value={data.mood} readOnly />)}
        </div>
        <div className="space-y-2">
            <Label>Is this part of an album or EP?</Label>
             {editMode ? (
                <Select value={data.isPartOfAlbumOrEP} onValueChange={(value) => handleInputChange('isPartOfAlbumOrEP', value)}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent className={isDark ? "bg-[#111A22] text-gray-200 border-gray-700" : ""}>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                </Select>
            ) : (<Input value={data.isPartOfAlbumOrEP} readOnly />)}
        </div>
        <div className="space-y-2">
            <Label>Language</Label>
            {editMode ? (
                <Select value={data.language} onValueChange={(value) => handleInputChange('language', value)}>
                    <SelectTrigger><SelectValue placeholder="Select language" /></SelectTrigger>
                    <SelectContent className={`max-h-[300px] overflow-y-auto ${isDark ? "bg-[#111A22] text-gray-200 border-gray-700" : ""}`}>
                        {languageOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                    </SelectContent>
                </Select>
            ) : (<Input value={data.language} readOnly />)}
        </div>
        <div className="space-y-2 md:col-span-2">
            <Label>Theme</Label>
            {editMode ? (
                <Select value={data.theme} onValueChange={(value) => handleInputChange('theme', value)}>
                    <SelectTrigger><SelectValue placeholder="Select theme" /></SelectTrigger>
                    <SelectContent className={`max-h-[300px] overflow-y-auto ${isDark ? "bg-[#111A22] text-gray-200 border-gray-700" : ""}`}>
                        {themeOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                    </SelectContent>
                </Select>
            ) : (<Input value={data.theme} readOnly />)}
        </div>
        
        <div className="md:col-span-2 flex flex-col gap-3 mt-2">
          <Label>Location Preference</Label>
          <div className="flex items-center gap-6 flex-wrap">
            {Object.entries(locationMap).map(([apiValue, label]) => (
              <div key={apiValue} className="flex items-center gap-2">
                <Checkbox
                  id={apiValue}
                  checked={data.locationPreference[apiValue]}
                  disabled={!editMode}
                  onCheckedChange={(checked) => handleCheckboxChange('locationPreference', apiValue, checked)}
                />
                <Label htmlFor={apiValue} className="text-sm cursor-pointer">{label}</Label>
              </div>
            ))}
          </div>
          {data.locationPreference?.other && (
            <div className="mt-3">
              <Input
                id="customLocation"
                placeholder="Specify custom location..."
                value={data.customLocation || ""}
                readOnly={!editMode}
                onChange={(e) => handleInputChange('customLocation', e.target.value)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

