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
import { Checkbox } from "@/components/ui/checkbox";
import GlobalApi from "@/lib/GlobalApi";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CreditCard, IndianRupee, Wallet } from "lucide-react";

export default function EditPayoutMethodsModal({ isOpen, onClose, user, theme, onSuccess }) {
  const isDark = theme === "dark";
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    bank: {
      accountNumber: "",
      ifscSwiftCode: "",
      accountHolderName: "",
      bankName: "",
      verified: false
    },
    upi: {
      upiId: "",
      accountHolderName: "",
      verified: false
    },
    paypal: {
      paypalEmail: "",
      accountName: "",
      verified: false
    },
    primaryMethod: "bank"
  });

  useEffect(() => {
    if (user && user.payoutMethods) {
      setFormData({
        bank: {
          accountNumber: user.payoutMethods.bank?.accountNumber || "",
          ifscSwiftCode: user.payoutMethods.bank?.ifscSwiftCode || "",
          accountHolderName: user.payoutMethods.bank?.accountHolderName || "",
          bankName: user.payoutMethods.bank?.bankName || "",
          verified: user.payoutMethods.bank?.verified || false
        },
        upi: {
          upiId: user.payoutMethods.upi?.upiId || "",
          accountHolderName: user.payoutMethods.upi?.accountHolderName || "",
          verified: user.payoutMethods.upi?.verified || false
        },
        paypal: {
          paypalEmail: user.payoutMethods.paypal?.paypalEmail || "",
          accountName: user.payoutMethods.paypal?.accountName || "",
          verified: user.payoutMethods.paypal?.verified || false
        },
        primaryMethod: user.payoutMethods.primaryMethod || "bank"
      });
    }
  }, [user, isOpen]);

  const handleUpdate = async () => {
    try {
      setLoading(true);
      await GlobalApi.adminUpdateUserPayoutMethods(user._id, formData);
      toast.success("Payout methods updated successfully");
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update Payout methods");
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (method, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [method]: {
        ...prev[method],
        [field]: value,
      },
    }));
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
            Edit Payout Methods - {user?.firstName} {user?.lastName}
          </DialogTitle>
          <DialogDescription
            className={`${isDark ? "text-gray-400" : "text-gray-600"}`}
          >
            Update payment destination details and verification status.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[65vh] pr-4">
          <div className="space-y-8 py-4">
            {/* Bank Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-blue-400 uppercase tracking-wider flex items-center gap-2">
                        <CreditCard className="w-4 h-4" /> Bank Transfer
                    </h4>
                    <div className="flex items-center gap-2">
                        <label className="text-xs">Verified</label>
                        <Checkbox 
                            checked={formData.bank.verified} 
                            onCheckedChange={(checked) => handleFieldChange("bank", "verified", !!checked)}
                        />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs">Account Holder Name</label>
                        <Input
                            value={formData.bank.accountHolderName}
                            onChange={(e) => handleFieldChange("bank", "accountHolderName", e.target.value)}
                            className={isDark ? "bg-[#111A22] border-gray-700" : ""}
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs">Bank Name</label>
                        <Input
                            value={formData.bank.bankName}
                            onChange={(e) => handleFieldChange("bank", "bankName", e.target.value)}
                            className={isDark ? "bg-[#111A22] border-gray-700" : ""}
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs">Account Number</label>
                        <Input
                            value={formData.bank.accountNumber}
                            onChange={(e) => handleFieldChange("bank", "accountNumber", e.target.value)}
                            className={isDark ? "bg-[#111A22] border-gray-700" : ""}
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs">IFSC / SWIFT Code</label>
                        <Input
                            value={formData.bank.ifscSwiftCode}
                            onChange={(e) => handleFieldChange("bank", "ifscSwiftCode", e.target.value)}
                            className={isDark ? "bg-[#111A22] border-gray-700" : ""}
                        />
                    </div>
                </div>
            </div>

            {/* UPI Section */}
            <div className="space-y-4 pt-4 border-t border-gray-800">
                <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-purple-400 uppercase tracking-wider flex items-center gap-2">
                        <IndianRupee className="w-4 h-4" /> UPI
                    </h4>
                    <div className="flex items-center gap-2">
                        <label className="text-xs">Verified</label>
                        <Checkbox 
                            checked={formData.upi.verified} 
                            onCheckedChange={(checked) => handleFieldChange("upi", "verified", !!checked)}
                        />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs">UPI ID</label>
                        <Input
                            value={formData.upi.upiId}
                            onChange={(e) => handleFieldChange("upi", "upiId", e.target.value)}
                            className={isDark ? "bg-[#111A22] border-gray-700" : ""}
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs">Account Holder Name</label>
                        <Input
                            value={formData.upi.accountHolderName}
                            onChange={(e) => handleFieldChange("upi", "accountHolderName", e.target.value)}
                            className={isDark ? "bg-[#111A22] border-gray-700" : ""}
                        />
                    </div>
                </div>
            </div>

            {/* PayPal Section */}
            <div className="space-y-4 pt-4 border-t border-gray-800">
                <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-blue-600 uppercase tracking-wider flex items-center gap-2">
                        <Wallet className="w-4 h-4" /> PayPal
                    </h4>
                    <div className="flex items-center gap-2">
                        <label className="text-xs">Verified</label>
                        <Checkbox 
                            checked={formData.paypal.verified} 
                            onCheckedChange={(checked) => handleFieldChange("paypal", "verified", !!checked)}
                        />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs">PayPal Email</label>
                        <Input
                            value={formData.paypal.paypalEmail}
                            onChange={(e) => handleFieldChange("paypal", "paypalEmail", e.target.value)}
                            className={isDark ? "bg-[#111A22] border-gray-700" : ""}
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs">Account Name</label>
                        <Input
                            value={formData.paypal.accountName}
                            onChange={(e) => handleFieldChange("paypal", "accountName", e.target.value)}
                            className={isDark ? "bg-[#111A22] border-gray-700" : ""}
                        />
                    </div>
                </div>
            </div>

            {/* Primary Method */}
            <div className="space-y-2 pt-4 border-t border-gray-800">
                <label className="text-sm font-medium">Primary Payout Method</label>
                <div className="flex gap-4">
                    {["bank", "upi", "paypal"].map((method) => (
                        <div key={method} className="flex items-center gap-1">
                            <input 
                                type="radio" 
                                name="primaryMethod" 
                                value={method}
                                checked={formData.primaryMethod === method}
                                onChange={(e) => setFormData(prev => ({ ...prev, primaryMethod: e.target.value }))}
                            />
                            <label className="text-xs capitalize">{method}</label>
                        </div>
                    ))}
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
            {loading ? "Updating..." : "Update Payouts"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
