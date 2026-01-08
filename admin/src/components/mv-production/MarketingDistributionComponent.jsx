import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function MarketingDistributionPlan({
  theme = "dark",
  className = "",
  data = {}, 
  editMode = false,
  handleInputChange
}) {
  const isDark = theme === "dark";

  
  const containerBg = isDark
    ? "bg-[#151F28] border border-gray-800 text-white"
    : "bg-white text-black";

  const inputBg = isDark ? "bg-[#111A22]" : "bg-gray-50";
  const inputText = isDark
    ? "text-white placeholder-gray-400"
    : "text-black placeholder-gray-500";

  const labelText = isDark ? "text-gray-300" : "text-gray-600";
  const focusBorder = isDark
    ? "focus:border-purple-600"
    : "focus:border-indigo-500";

  
  const yesNo = (val) => (val ? "Yes" : "No");

  return (
    <div className={`w-full rounded-xl p-6 ${containerBg} ${className}`}>
      <h2 className={`text-lg font-semibold mb-6`}>
        Marketing & Distribution Plan
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="flex flex-col gap-2">
          <label className={`text-sm ${labelText}`}>
            Will this be released via MV Distribution?
          </label>
          {editMode ? (
            <Select value={data.willBeReleasedViaMVDistribution} onValueChange={(value) => handleInputChange('willBeReleasedViaMVDistribution', value)}>
                <SelectTrigger><SelectValue/></SelectTrigger>
                <SelectContent className={isDark ? "bg-[#111A22] text-gray-200 border-gray-700" : ""}>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                </SelectContent>
            </Select>
          ) : (
            <input
                type="text"
                value={data.willBeReleasedViaMVDistribution}
                readOnly
                className={`w-full rounded-md px-4 py-2 ${inputText} ${inputBg} border border-transparent ${focusBorder} focus:outline-none`}
            />
          )}
        </div>
        
        <div className="flex flex-col gap-2">
          <label className={`text-sm ${labelText}`}>
            Do you plan to run ads or influencer campaigns?
          </label>
           {editMode ? (
            <Select value={data.planToRunAdsOrInfluencerCampaigns} onValueChange={(value) => handleInputChange('planToRunAdsOrInfluencerCampaigns', value)}>
                <SelectTrigger><SelectValue/></SelectTrigger>
                <SelectContent className={isDark ? "bg-[#111A22] text-gray-200 border-gray-700" : ""}>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                </SelectContent>
            </Select>
          ) : (
            <input
                type="text"
                value={data.planToRunAdsOrInfluencerCampaigns}
                readOnly
                className={`w-full rounded-md px-4 py-2 ${inputText} ${inputBg} border border-transparent ${focusBorder} focus:outline-none`}
            />
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className={`text-sm ${labelText}`}>
            Any brand or merch tie-ins?
          </label>
          {editMode ? (
            <Select value={data.anyBrandOrMerchTieIns} onValueChange={(value) => handleInputChange('anyBrandOrMerchTieIns', value)}>
                <SelectTrigger><SelectValue/></SelectTrigger>
                <SelectContent className={isDark ? "bg-[#111A22] text-gray-200 border-gray-700" : ""}>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                </SelectContent>
            </Select>
          ) : (
            <input
                type="text"
                value={data.anyBrandOrMerchTieIns}
                readOnly
                className={`w-full rounded-md px-4 py-2 ${inputText} ${inputBg} border border-transparent ${focusBorder} focus:outline-none`}
            />
          )}
        </div>

        {data.anyBrandOrMerchTieIns === "yes" && (
            <div className="flex flex-col gap-2">
              <label className={`text-sm ${labelText}`}>If yes, describe</label>
              <input
                type="text"
                value={data.brandOrMerchTieInsDescription || ""}
                readOnly={!editMode}
                onChange={(e) => handleInputChange('brandOrMerchTieInsDescription', e.target.value)}
                className={`w-full rounded-md px-4 py-2 ${inputText} ${inputBg} border border-transparent ${focusBorder} focus:outline-none`}
              />
            </div>
        )}
      </div>
    </div>
  );
}
