"use client";
import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import GlobalApi from "@/lib/GlobalApi";
import { toast } from "sonner";


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

  const EModuleAccess = {
    USER_MANAGEMENT: "User Management",
    ROYALTY_MANAGEMENT: "Royalty Management",
    ANALYTICS: "Analytics",
    FINANCIAL_REPORTS: "Financial Reports",
    BLOG_MANAGEMENT: "Blog Management",
    TEAM_MANAGEMENT: "Team Management",
    RELEASE_MANAGEMENT: "Release Management",
    MCN_MANAGEMENT: "MCN Management",
    CONTENT_MANAGEMENT: "Content Management",
    SUPPORT_TICKETS: "Support Tickets",
    SYSTEM_SETTINGS: "System Settings",
    MERCH_MANAGEMENT: "Merch Management",
    AGGREGATOR_MANAGEMENT: "Aggregator Management",
    NEWS_MANAGEMENT: "News Management",
  };

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
            moduleAccess: Array.isArray(data.moduleAccess)
              ? data.moduleAccess
              : [],
            isActive: data.isActive ?? true,
          });
        } else if (memberData) {
          setForm({
            firstName: memberData.firstName || "",
            lastName: memberData.lastName || "",
            emailAddress: memberData.emailAddress || "",
            teamRole: memberData.teamRole || "",
            mobileNumber: memberData.mobileNumber || "",
            moduleAccess: Array.isArray(memberData.moduleAccess)
              ? memberData.moduleAccess
              : [],
            isActive:
              typeof memberData.isActive === "boolean"
                ? memberData.isActive
                : true,
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


  const handleSubmit = async (type = "invite") => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      if (memberId) {

        const { firstName, lastName, teamRole, mobileNumber, moduleAccess, isActive } = form;

        const updatePayload = {
          firstName,
          lastName,
          teamRole,
          mobileNumber,
          moduleAccess,
        };


        await GlobalApi.updateTeamMember(memberId, updatePayload);


        if (typeof isActive === "boolean") {
          await GlobalApi.updateTeamMemberStatus(memberId, { isActive });
        }

        toast.success("Team member updated successfully");
      } else {

        const { firstName, lastName, emailAddress, teamRole, mobileNumber, moduleAccess } = form;

        const createPayload = {
          firstName,
          lastName,
          emailAddress,
          teamRole,
          mobileNumber,
          moduleAccess,
        };

        await GlobalApi.createTeamMember(createPayload);
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
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 custom-scrollbar">
      <div
        className={`w-full max-w-2xl rounded-xl shadow-lg overflow-y-auto max-h-[90vh] custom-scrollbar ${isDark ? "bg-[#111A22] text-gray-200" : "bg-white text-gray-900"
          }`}
      >

        <div className="flex justify-between items-center border-b border-gray-700 p-4">
          <div>
            <h2 className="text-lg font-semibold">
              {memberId ? "Edit Team Member" : "Add New Team Member"}
            </h2>
            <p className="text-sm text-gray-400">
              {memberId
                ? "Update member details and permissions"
                : "Invite a new member to join your team and configure their access"}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>


        <div className="p-6 space-y-6">

          <div>
            <h3 className="text-sm font-medium mb-2 text-gray-400">
              Basic Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <Input
                name="firstName"
                placeholder="Enter first name"
                value={form.firstName}
                onChange={handleChange}
                className={`${isDark
                  ? "bg-[#151F28] border-gray-700 text-gray-200"
                  : "bg-white"
                  }`}
              />
              <Input
                name="lastName"
                placeholder="Enter last name"
                value={form.lastName}
                onChange={handleChange}
                className={`${isDark
                  ? "bg-[#151F28] border-gray-700 text-gray-200"
                  : "bg-white"
                  }`}
              />
              <Input
                name="emailAddress"
                placeholder="Enter email address"
                value={form.emailAddress}
                onChange={handleChange}
                className={`col-span-2 ${isDark
                  ? "bg-[#151F28] border-gray-700 text-gray-200"
                  : "bg-white"
                  }`}
              />

              <select
                name="teamRole"
                value={form.teamRole}
                onChange={handleChange}
                className={`rounded-md px-3 py-2 text-sm col-span-1 ${isDark
                  ? "bg-[#151F28] border border-gray-700 text-gray-200"
                  : "bg-white border border-gray-300"
                  }`}
              >
                <option value="">Select role</option>
                {Object.values(ETeamRole).map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>

              <Input
                name="mobileNumber"
                placeholder="Enter mobile number"
                value={form.mobileNumber}
                onChange={handleChange}
                className={`col-span-1 ${isDark
                  ? "bg-[#151F28] border-gray-700 text-gray-200"
                  : "bg-white"
                  }`}
              />
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2 text-gray-400">
              Status & Access
            </h3>
            <div className="flex items-center gap-3">
              <label
                htmlFor="isActive"
                className={`${isDark ? "text-gray-300" : "text-gray-700"} text-sm`}
              >
                Active Status
              </label>
              <select
                id="isActive"
                name="isActive"
                value={form.isActive ? "true" : "false"}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    isActive: e.target.value === "true",
                  }))
                }
                className={`rounded-md px-3 py-2 text-sm ${isDark
                  ? "bg-[#151F28] border border-gray-700 text-gray-200"
                  : "bg-white border border-gray-300"
                  }`}
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
          </div>


          <div>
            <h3 className="text-sm font-medium mb-3 text-gray-400">
              Module Access Permissions
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {Object.values(EModuleAccess).map((mod) => (
                <label
                  key={mod}
                  className={`flex items-center gap-2 text-sm cursor-pointer ${isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                >
                  <input
                    type="checkbox"
                    checked={form.moduleAccess.includes(mod)}
                    onChange={() => handleCheckbox(mod)}
                    className="accent-purple-600"
                  />
                  {mod}
                </label>
              ))}
            </div>
          </div>

          {submitError && (
            <div className="text-sm text-red-500">{submitError}</div>
          )}
        </div>


        <div className="flex justify-between items-center border-t border-gray-700 p-4">
          <Button
            variant="outline"
            onClick={() => handleSubmit("draft")}
            className={`${isDark
              ? "border-gray-600 text-gray-300 hover:bg-[#151F28]"
              : "border-gray-300 text-gray-800"
              }`}
            disabled={isSubmitting}
          >
            Save as Draft
          </Button>

          <div className="flex gap-2">
            <Button
              variant="ghost"
              onClick={onClose}
              className={`${isDark ? "text-gray-300" : "text-gray-700"}`}
              disabled={isSubmitting}
            >
              Cancel
            </Button>

            <Button
              onClick={() => handleSubmit("invite")}
              className="bg-purple-600 hover:bg-purple-700 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? memberId
                  ? "Updating..."
                  : "Sending..."
                : memberId
                  ? "Update Member"
                  : "Send Invitation"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
