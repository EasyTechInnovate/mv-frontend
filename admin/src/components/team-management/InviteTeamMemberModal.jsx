"use client";
import React, { useState, useEffect } from "react";
import { X, CheckSquare, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import GlobalApi from "@/lib/GlobalApi";
import { toast } from "sonner";

const ETeamRole = {
  GENERAL: 'General',
  CONTENT: 'Content',
  MARKETING: 'Marketing',
  USER_ACCOUNTS: 'User Accounts & Membership',
  FINANCE_ROYALTY: 'Finance - Royalty',
  FINANCE_MEMBERSHIP: 'Finance - Membership',
  COPYRIGHTS: 'Copyrights',
  OTHER: 'Other'
};

// Must stay in sync with backend EModuleAccess constant in application.js
const EModuleAccess = {
  USER_MANAGEMENT: "User Management",
  RELEASE_MANAGEMENT: "Release Management",
  AGGREGATOR_MANAGEMENT: "Aggregator Management",
  ANALYTICS: "Analytics",
  ROYALTY_MANAGEMENT: "Royalty Management",
  FINANCIAL_REPORTS: "Financial Reports",
  MCN_MANAGEMENT: "MCN Management",
  TEAM_MANAGEMENT: "Team Management",
  CONTENT_MANAGEMENT: "Content Management",
  MERCH_MANAGEMENT: "Merch Management",
  SUPPORT_TICKETS: "Support Tickets",
  SYSTEM_SETTINGS: "System Settings",
  NEWS_MANAGEMENT: "News Management",
};

// Each group mirrors the sidebar sections so admin knows exactly what access they're granting
const MODULE_GROUPS = [
  {
    group: "User & Release",
    modules: [
      {
        value: EModuleAccess.USER_MANAGEMENT,
        label: "User Management",
        desc: "Manage user accounts, KYC verification, subscriptions, and send notifications",
        pages: ["User Management", "Notifications"],
      },
      {
        value: EModuleAccess.RELEASE_MANAGEMENT,
        label: "Release Management",
        desc: "Review, approve, reject, publish, and manage all music releases",
        pages: ["Release Management"],
      },
      {
        value: EModuleAccess.AGGREGATOR_MANAGEMENT,
        label: "Aggregator Management",
        desc: "Review and approve aggregator account applications",
        pages: ["Aggregator Management"],
      },
    ],
  },
  {
    group: "Data & Analytics",
    modules: [
      {
        value: EModuleAccess.ANALYTICS,
        label: "Analytics",
        desc: "View platform-wide analytics, stats dashboards, and performance data",
        pages: ["Analytics Management"],
      },
      {
        value: EModuleAccess.ROYALTY_MANAGEMENT,
        label: "Royalty Management",
        desc: "Manage royalty payments, bonus royalties, and wallet adjustments",
        pages: ["Royalty Management", "Bonus Management", "Wallet & Transactions"],
      },
      {
        value: EModuleAccess.FINANCIAL_REPORTS,
        label: "Financial Reports",
        desc: "Upload royalty/bonus reports, manage months, and handle payout requests",
        pages: ["Month Management", "Financial Reports Upload", "Payout Requests"],
      },
    ],
  },
  {
    group: "MCN & Business",
    modules: [
      {
        value: EModuleAccess.MCN_MANAGEMENT,
        label: "MCN Management",
        desc: "Manage MCN channels, review MCN requests, and process MCN royalties",
        pages: ["MCN Management", "MCN Royalty"],
      },
      {
        value: EModuleAccess.TEAM_MANAGEMENT,
        label: "Team Management",
        desc: "Invite, update permissions, and manage admin team members",
        pages: ["Team Management"],
      },
    ],
  },
  {
    group: "Marketing & Content",
    modules: [
      {
        value: EModuleAccess.CONTENT_MANAGEMENT,
        label: "Content Management",
        desc: "Manage marketing services (pitching, MV, SYNC) and website content",
        pages: ["Playlist Pitching", "MV Production", "Synchronization (SYNC)", "Testimonials", "Trending Artists", "Trending Labels", "FAQ Management"],
      },
      {
        value: EModuleAccess.MERCH_MANAGEMENT,
        label: "Merch Management",
        desc: "Manage merchandise store products and customer orders",
        pages: ["Merch Store Management"],
      },
    ],
  },
  {
    group: "Communications",
    modules: [
      {
        value: EModuleAccess.SUPPORT_TICKETS,
        label: "Support Tickets",
        desc: "View, assign, respond to, and escalate user support tickets",
        pages: ["Help & Support"],
      },
    ],
  },
  {
    group: "Configuration",
    modules: [
      {
        value: EModuleAccess.SYSTEM_SETTINGS,
        label: "System Settings",
        desc: "Configure company settings and manage subscription plans",
        pages: ["Company Settings", "Subscription Plans"],
      },
      {
        value: EModuleAccess.NEWS_MANAGEMENT,
        label: "News Management",
        desc: "Create, edit, and publish press releases and news articles",
        pages: ["Press Management"],
      },
    ],
  },
];

export default function InviteTeamMemberModal({
  isOpen,
  onClose,
  theme,
  memberId = null,
  memberData = null,
  onSuccess = () => { },
}) {
  if (!isOpen) return null;

  const isDark = theme === "dark";

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    emailAddress: "",
    teamRole: "",
    mobileNumber: "",
    moduleAccess: [],
    isActive: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (memberId && !memberData) {
          const res = await GlobalApi.getTeamMemberById(memberId);
          const data = res.data?.data || res.data;
          setForm({
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            emailAddress: data.emailAddress || "",
            teamRole: data.teamRole || "",
            mobileNumber: data.mobileNumber || "",
            moduleAccess: Array.isArray(data.moduleAccess) ? data.moduleAccess : [],
            isActive: data.isActive ?? true,
          });
        } else if (memberData) {
          setForm({
            firstName: memberData.firstName || "",
            lastName: memberData.lastName || "",
            emailAddress: memberData.emailAddress || "",
            teamRole: memberData.teamRole || "",
            mobileNumber: memberData.mobileNumber || "",
            moduleAccess: Array.isArray(memberData.moduleAccess) ? memberData.moduleAccess : [],
            isActive: typeof memberData.isActive === "boolean" ? memberData.isActive : true,
          });
        } else {
          setForm({
            firstName: "",
            lastName: "",
            emailAddress: "",
            teamRole: "",
            mobileNumber: "",
            moduleAccess: [],
            isActive: true,
          });
        }
      } catch (err) {
        console.error("Error loading member:", err);
        toast.error("Failed to load member details");
      }
    };

    if (isOpen) fetchData();
    setSubmitError(null);
  }, [memberId, memberData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckbox = (value) => {
    setForm((prev) => ({
      ...prev,
      moduleAccess: prev.moduleAccess.includes(value)
        ? prev.moduleAccess.filter((m) => m !== value)
        : [...prev.moduleAccess, value],
    }));
  };

  const handleGroupToggle = (groupModules) => {
    const groupValues = groupModules.map((m) => m.value);
    const allSelected = groupValues.every((v) => form.moduleAccess.includes(v));
    if (allSelected) {
      // Deselect all in group
      setForm((prev) => ({
        ...prev,
        moduleAccess: prev.moduleAccess.filter((m) => !groupValues.includes(m)),
      }));
    } else {
      // Select all in group
      setForm((prev) => ({
        ...prev,
        moduleAccess: [...new Set([...prev.moduleAccess, ...groupValues])],
      }));
    }
  };

  const handleSelectAll = () => {
    const allValues = MODULE_GROUPS.flatMap((g) => g.modules.map((m) => m.value));
    const allSelected = allValues.every((v) => form.moduleAccess.includes(v));
    setForm((prev) => ({
      ...prev,
      moduleAccess: allSelected ? [] : allValues,
    }));
  };

  const totalModules = MODULE_GROUPS.flatMap((g) => g.modules).length;
  const selectedCount = form.moduleAccess.length;

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      if (memberId) {
        const { firstName, lastName, teamRole, mobileNumber, moduleAccess, isActive } = form;

        await GlobalApi.updateTeamMember(memberId, {
          firstName,
          lastName,
          teamRole,
          mobileNumber,
          moduleAccess,
        });

        if (typeof isActive === "boolean") {
          await GlobalApi.updateTeamMemberStatus(memberId, { isActive });
        }

        toast.success("Team member updated successfully");
      } else {
        const { firstName, lastName, emailAddress, teamRole, mobileNumber, moduleAccess } = form;

        await GlobalApi.createTeamMember({
          firstName,
          lastName,
          emailAddress,
          teamRole,
          mobileNumber,
          moduleAccess,
        });

        toast.success("Invitation sent successfully");
      }

      onSuccess?.();
      onClose();
    } catch (err) {
      console.error("Submit failed:", err);
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.errors?.[0]?.message ||
        err?.message ||
        "Failed to submit team member";
      setSubmitError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div
        className={`w-full max-w-2xl rounded-xl shadow-2xl overflow-y-auto max-h-[92vh] custom-scrollbar ${
          isDark ? "bg-[#111A22] text-gray-200" : "bg-white text-gray-900"
        }`}
      >
        {/* Header */}
        <div className={`flex justify-between items-center p-5 border-b ${isDark ? "border-gray-700/60" : "border-gray-200"}`}>
          <div>
            <h2 className="text-base font-semibold">
              {memberId ? "Edit Team Member" : "Add New Team Member"}
            </h2>
            <p className={`text-xs mt-0.5 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
              {memberId
                ? "Update member details and permissions"
                : "Invite a new member and configure their access"}
            </p>
          </div>
          <button onClick={onClose} className={`p-1.5 rounded-lg transition ${isDark ? "text-gray-400 hover:text-white hover:bg-gray-700" : "text-gray-400 hover:text-gray-700 hover:bg-gray-100"}`}>
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-6">

          {/* Basic Information */}
          <div>
            <h3 className={`text-xs font-semibold uppercase tracking-wider mb-3 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
              Basic Information
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <Input
                name="firstName"
                placeholder="First name"
                value={form.firstName}
                onChange={handleChange}
                className={`${isDark ? "bg-[#151F28] border-gray-700 text-gray-200 placeholder:text-gray-500" : "bg-white"}`}
              />
              <Input
                name="lastName"
                placeholder="Last name"
                value={form.lastName}
                onChange={handleChange}
                className={`${isDark ? "bg-[#151F28] border-gray-700 text-gray-200 placeholder:text-gray-500" : "bg-white"}`}
              />
              <Input
                name="emailAddress"
                placeholder="Email address"
                value={form.emailAddress}
                onChange={handleChange}
                disabled={!!memberId}
                className={`col-span-2 ${isDark ? "bg-[#151F28] border-gray-700 text-gray-200 placeholder:text-gray-500 disabled:opacity-50" : "bg-white disabled:bg-gray-50"}`}
              />
              <select
                name="teamRole"
                value={form.teamRole}
                onChange={handleChange}
                className={`rounded-md px-3 py-2 text-sm ${isDark ? "bg-[#151F28] border border-gray-700 text-gray-200" : "bg-white border border-gray-300 text-gray-900"}`}
              >
                <option value="">Select role</option>
                {Object.values(ETeamRole).map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
              <Input
                name="mobileNumber"
                placeholder="Mobile number"
                value={form.mobileNumber}
                onChange={handleChange}
                className={`${isDark ? "bg-[#151F28] border-gray-700 text-gray-200 placeholder:text-gray-500" : "bg-white"}`}
              />
            </div>
          </div>

          {/* Active Status */}
          <div className={`flex items-center justify-between p-3 rounded-lg ${isDark ? "bg-[#151F28] border border-gray-700/60" : "bg-gray-50 border border-gray-200"}`}>
            <div>
              <p className={`text-sm font-medium ${isDark ? "text-gray-200" : "text-gray-700"}`}>Account Status</p>
              <p className={`text-xs mt-0.5 ${isDark ? "text-gray-500" : "text-gray-400"}`}>Inactive members cannot log in</p>
            </div>
            <select
              id="isActive"
              name="isActive"
              value={form.isActive ? "true" : "false"}
              onChange={(e) => setForm((prev) => ({ ...prev, isActive: e.target.value === "true" }))}
              className={`rounded-md px-3 py-1.5 text-sm ${isDark ? "bg-[#1a2532] border border-gray-600 text-gray-200" : "bg-white border border-gray-300 text-gray-900"}`}
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>

          {/* Module Access Permissions */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className={`text-xs font-semibold uppercase tracking-wider ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                  Module Access Permissions
                </h3>
                <p className={`text-xs mt-0.5 ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                  {selectedCount === 0
                    ? "No modules selected — member will have no access"
                    : `${selectedCount} of ${totalModules} modules selected`}
                </p>
              </div>
              <button
                onClick={handleSelectAll}
                className={`text-xs px-3 py-1.5 rounded-md font-medium transition ${
                  isDark
                    ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {selectedCount === totalModules ? "Deselect All" : "Select All"}
              </button>
            </div>

            <div className="space-y-4">
              {MODULE_GROUPS.map((group) => {
                const groupValues = group.modules.map((m) => m.value);
                const allGroupSelected = groupValues.every((v) => form.moduleAccess.includes(v));
                const someGroupSelected = groupValues.some((v) => form.moduleAccess.includes(v));

                return (
                  <div key={group.group}>
                    {/* Group Header */}
                    <div className="flex items-center gap-2 mb-2">
                      <button
                        onClick={() => handleGroupToggle(group.modules)}
                        className={`flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider transition ${
                          allGroupSelected
                            ? "text-purple-500"
                            : someGroupSelected
                            ? isDark ? "text-gray-300" : "text-gray-600"
                            : isDark ? "text-gray-500" : "text-gray-400"
                        }`}
                      >
                        {allGroupSelected ? (
                          <CheckSquare size={13} className="text-purple-500" />
                        ) : (
                          <Square size={13} />
                        )}
                        {group.group}
                      </button>
                      <div className={`flex-1 h-px ${isDark ? "bg-gray-700/60" : "bg-gray-200"}`} />
                    </div>

                    {/* Module Cards */}
                    <div className="grid grid-cols-1 gap-2 pl-1">
                      {group.modules.map((mod) => {
                        const isChecked = form.moduleAccess.includes(mod.value);
                        return (
                          <label
                            key={mod.value}
                            className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all border ${
                              isChecked
                                ? isDark
                                  ? "bg-purple-900/20 border-purple-700/50"
                                  : "bg-purple-50 border-purple-200"
                                : isDark
                                ? "bg-[#151F28]/50 border-gray-700/40 hover:border-gray-600"
                                : "bg-gray-50/50 border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <div className="mt-0.5">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => handleCheckbox(mod.value)}
                                className="accent-purple-600 w-4 h-4"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm font-medium ${isChecked ? "text-purple-500" : isDark ? "text-gray-200" : "text-gray-700"}`}>
                                {mod.label}
                              </p>
                              <p className={`text-xs mt-0.5 ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                                {mod.desc}
                              </p>
                              {/* Pages unlocked by this module */}
                              <div className="flex flex-wrap gap-1 mt-1.5">
                                {mod.pages.map((page) => (
                                  <span
                                    key={page}
                                    className={`inline-block text-[10px] px-1.5 py-0.5 rounded font-medium ${
                                      isChecked
                                        ? isDark
                                          ? "bg-purple-900/40 text-purple-300"
                                          : "bg-purple-100 text-purple-600"
                                        : isDark
                                        ? "bg-gray-700/50 text-gray-400"
                                        : "bg-gray-200 text-gray-500"
                                    }`}
                                  >
                                    {page}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {submitError && (
            <div className={`text-sm px-3 py-2 rounded-lg ${isDark ? "bg-red-900/30 text-red-400 border border-red-800/50" : "bg-red-50 text-red-600 border border-red-200"}`}>
              {submitError}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`flex justify-end items-center gap-2 p-4 border-t ${isDark ? "border-gray-700/60" : "border-gray-200"}`}>
          <Button
            variant="ghost"
            onClick={onClose}
            className={`text-sm ${isDark ? "text-gray-300 hover:bg-gray-700" : "text-gray-700"}`}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-purple-600 hover:bg-purple-700 text-white text-sm"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? memberId ? "Updating..." : "Sending..."
              : memberId ? "Update Member" : "Send Invitation"}
          </Button>
        </div>
      </div>
    </div>
  );
}
