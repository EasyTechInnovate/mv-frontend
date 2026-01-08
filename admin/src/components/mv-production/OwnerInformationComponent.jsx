import React from "react";

export default function OwnerInformation({
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
  const focusBorder = isDark ? "focus:border-purple-600" : "focus:border-indigo-500";

  return (
    <div className={`w-full rounded-xl p-6 ${containerBg} ${className}`}>
      <h2
        className={`text-lg font-semibold ${
          isDark ? "text-white" : "text-black"
        } mb-6`}
      >
        Owner Information
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="flex flex-col gap-2">
          <label className={`text-sm ${labelText}`}>
            Copyright Owner Name
          </label>
          <input
            type="text"
            value={data?.copyrightOwnerName || ""}
            readOnly={!editMode}
            onChange={(e) => handleInputChange('copyrightOwnerName', e.target.value)}
            placeholder="Artist"
            className={`w-full rounded-md px-4 py-2 ${inputText} ${inputBg} border border-transparent ${focusBorder} focus:outline-none`}
          />
        </div>

        
        <div className="flex flex-col gap-2">
          <label className={`text-sm ${labelText}`}>
            Mobile No. Of the Copyright Holder
          </label>
          <input
            type="text"
            value={data?.mobileNumber || ""}
            readOnly={!editMode}
            onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
            placeholder="Mobile number"
            className={`w-full rounded-md px-4 py-2 ${inputText} ${inputBg} border border-transparent ${focusBorder} focus:outline-none`}
          />
        </div>

        
        <div className="flex flex-col gap-2 md:col-span-2">
          <label className={`text-sm ${labelText}`}>
            Email Of the Copyright Holder
          </label>
          <input
            type="email"
            value={data?.emailOfCopyrightHolder || ""}
            readOnly={!editMode}
            onChange={(e) => handleInputChange('emailOfCopyrightHolder', e.target.value)}
            placeholder="artist@example.com"
            className={`w-full rounded-md px-4 py-2 ${inputText} ${inputBg} border border-transparent ${focusBorder} focus:outline-none`}
          />
        </div>
      </div>
    </div>
  );
}
