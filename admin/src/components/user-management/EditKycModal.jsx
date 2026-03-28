import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import GlobalApi from "@/lib/GlobalApi";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function EditKycModal({ isOpen, onClose, user, theme, onSuccess }) {
  const isDark = theme === "dark";
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    residencyType: "indian",
    status: "unverified",
    details: {
      aadhaarNumber: "",
      panNumber: "",
      gstUdhyamNumber: "",
      passportNumber: "",
      vatNumber: "",
    },
  });

  useEffect(() => {
    if (user && user.kyc) {
      setFormData({
        residencyType: user.kyc.residencyType || "indian",
        status: user.kyc.status || "unverified",
        details: {
          aadhaarNumber: user.kyc.details?.aadhaarNumber || "",
          panNumber: user.kyc.details?.panNumber || "",
          gstUdhyamNumber: user.kyc.details?.gstUdhyamNumber || "",
          passportNumber: user.kyc.details?.passportNumber || "",
          vatNumber: user.kyc.details?.vatNumber || "",
        },
      });
    }
  }, [user, isOpen]);

  const handleUpdate = async () => {
    const { residencyType, details } = formData;

    // Validation
    if (residencyType === 'indian') {
      if (!details.aadhaarNumber || !/^\d{12}$/.test(details.aadhaarNumber)) {
        toast.error('Please enter a valid 12-digit Aadhaar Number');
        return;
      }
      if (details.panNumber && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(details.panNumber.toUpperCase())) {
        toast.error('Please enter a valid PAN Number (e.g., ABCDE1234F)');
        return;
      }
    } else {
      if (!details.passportNumber || details.passportNumber.length < 6) {
        toast.error('Please enter a valid Passport Number (min 6 characters)');
        return;
      }
    }

    try {
      setLoading(true);
      await GlobalApi.updateUserKYC(user._id, formData);
      toast.success("KYC updated successfully");
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update KYC");
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (section, field, value) => {
    if (section === "root") {
      setFormData((prev) => ({ ...prev, [field]: value }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value,
        },
      }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={`max-w-2xl rounded-xl focus:ring-0 focus-visible:ring-0 outline-none ${
          isDark
            ? "bg-[#151F28] text-gray-200 border border-gray-700"
            : "bg-white text-gray-800"
        }`}
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Edit KYC Details - {user?.firstName} {user?.lastName}
          </DialogTitle>
          <DialogDescription
            className={`${isDark ? "text-gray-400" : "text-gray-600"}`}
          >
            Manually update user KYC information and status.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Residency Type</label>
                <Select
                  value={formData.residencyType}
                  onValueChange={(val) => handleFieldChange("root", "residencyType", val)}
                >
                  <SelectTrigger className={isDark ? "bg-[#111A22] border-gray-700 focus:ring-purple-600 focus:ring-offset-0" : ""}>
                    <SelectValue placeholder="Select Residency" />
                  </SelectTrigger>
                  <SelectContent className={isDark ? "bg-[#151F28] text-gray-200 border-gray-700" : ""}>
                    <SelectItem value="indian">Indian Resident</SelectItem>
                    <SelectItem value="foreign">Foreign Resident</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">KYC Status</label>
                <Select
                  value={formData.status}
                  onValueChange={(val) => handleFieldChange("root", "status", val)}
                >
                  <SelectTrigger className={isDark ? "bg-[#111A22] border-gray-700 focus:ring-purple-600 focus:ring-offset-0" : ""}>
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent className={isDark ? "bg-[#151F28] text-gray-200 border-gray-700" : ""}>
                    <SelectItem value="unverified">Unverified</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="verified">Verified</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="border-t border-gray-800 pt-4">
              <h4 className="text-sm font-bold mb-4 text-purple-400 uppercase tracking-wider">Document Details</h4>
              <div className="grid grid-cols-2 gap-4">
                {formData.residencyType === "indian" ? (
                  <>
                    <div className="space-y-1">
                      <label className="text-xs">Aadhaar Number</label>
                      <Input
                        value={formData.details.aadhaarNumber}
                        onChange={(e) => handleFieldChange("details", "aadhaarNumber", e.target.value)}
                        className={isDark ? "bg-[#111A22] border-gray-700" : ""}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs">PAN Number</label>
                      <Input
                        value={formData.details.panNumber}
                        onChange={(e) => handleFieldChange("details", "panNumber", e.target.value)}
                        className={isDark ? "bg-[#111A22] border-gray-700" : ""}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs">GST/Udhyam Number</label>
                      <Input
                        value={formData.details.gstUdhyamNumber}
                        onChange={(e) => handleFieldChange("details", "gstUdhyamNumber", e.target.value)}
                        className={isDark ? "bg-[#111A22] border-gray-700" : ""}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-1">
                      <label className="text-xs">Passport Number</label>
                      <Input
                        value={formData.details.passportNumber}
                        onChange={(e) => handleFieldChange("details", "passportNumber", e.target.value)}
                        className={isDark ? "bg-[#111A22] border-gray-700" : ""}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs">VAT Number</label>
                      <Input
                        value={formData.details.vatNumber}
                        onChange={(e) => handleFieldChange("details", "vatNumber", e.target.value)}
                        className={isDark ? "bg-[#111A22] border-gray-700" : ""}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="flex justify-end gap-3 mt-4">
          <Button variant={isDark ? "outline" : "secondary"} onClick={onClose} className="px-6">
            Cancel
          </Button>
          <Button
            onClick={handleUpdate}
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6"
          >
            {loading ? "Updating..." : "Update KYC"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
