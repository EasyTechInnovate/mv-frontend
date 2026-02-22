import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import GlobalApi from "@/lib/GlobalApi";

const ESublabelMembershipStatus = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  PENDING: "pending",
  EXPIRED: "expired",
  SUSPENDED: "suspended",
};

export default function CreateSublabelModal({
  isOpen,
  onClose,
  onSaved,     
  editData = null,  
  theme = "dark",
}) {
  if (!isOpen) return null;

  const isEdit = Boolean(editData);

  const [name, setName] = useState("");
  const [membershipStatus, setMembershipStatus] = useState(
    ESublabelMembershipStatus.ACTIVE
  );
  const [contractStartDate, setContractStartDate] = useState("");
  const [contractEndDate, setContractEndDate] = useState("");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  
  useEffect(() => {
    if (!isOpen) return;

    if (isEdit) {
      setName(editData.name || "");
      setMembershipStatus(editData.membershipStatus || ESublabelMembershipStatus.ACTIVE);
      setContractStartDate(editData.contractStartDate ? new Date(editData.contractStartDate).toISOString().split('T')[0] : "");
      setContractEndDate(editData.contractEndDate ? new Date(editData.contractEndDate).toISOString().split('T')[0] : "");
      setDescription(editData.description || "");
      setEmail(editData.contactInfo?.email || editData.email || "");
      setPhone(editData.contactInfo?.phone || editData.phone || "");
    } else {
    
      setName("");
      setMembershipStatus(ESublabelMembershipStatus.ACTIVE);
      setContractStartDate("");
      setContractEndDate("");
      setDescription("");
      setEmail("");
      setPhone("");
    }
  }, [isOpen, editData]);

 const handleSubmit = async () => {
  try {
    setLoading(true);

    const payload = {
      name,
      membershipStatus,
      contractStartDate,
      contractEndDate,
      description,
      contactInfo: {
        email,
        phone,
      },
    };

    let res;

    if (isEdit) {
      res = await GlobalApi.updateSubLabel(editData._id, payload);
    } else {
      res = await GlobalApi.createSubLabel(payload);
    }

    onSaved?.(res.data);
    onClose();
  } catch (err) {
    console.error("Sublabel save failed:", err);
  } finally {
    setLoading(false);
  }
};


  const bg = theme === "dark" ? "bg-[#111A22]" : "bg-white";
  const border = theme === "dark" ? "border-gray-700" : "border-gray-300";
  const text = theme === "dark" ? "text-white" : "text-gray-900";

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className={`w-[650px] rounded-2xl p-6 shadow-xl ${bg} ${text}`}>
        <h2 className="text-xl font-semibold mb-1">
          {isEdit ? "Edit Sublabel" : "Create Sublabel"}
        </h2>
        <p className="text-sm opacity-70 mb-6">
          {isEdit
            ? "Update the sublabel details."
            : "Fill details to add a new sublabel"}
        </p>

      
        <div className="mb-4">
          <label className="text-sm mb-1 block">Sublabel Name</label>
          <Input
            className={`w-full bg-transparent ${border} border rounded-xl`}
            placeholder="Enter sublabel name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

   
        <div className="mb-4">
          <label className="text-sm mb-1 block">Membership Status</label>

          <Select value={membershipStatus} onValueChange={setMembershipStatus}>
            <SelectTrigger
              className={`w-full bg-transparent ${border} border rounded-xl ${text}`}
            >
              <SelectValue placeholder="Select status" />
            </SelectTrigger>

            <SelectContent
              className={`${
                theme === "dark"
                  ? "bg-[#1B2834] text-white"
                  : "bg-white text-gray-900"
              } border`}
            >
              {Object.values(ESublabelMembershipStatus).map((s) => (
                <SelectItem key={s} value={s} className="capitalize">
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

   
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-sm mb-1 block">Contract Start Date</label>
            <Input
              type="date"
              className={`w-full bg-transparent ${border} border rounded-xl`}
              value={contractStartDate}
              onChange={(e) => setContractStartDate(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm mb-1 block">Contract End Date</label>
            <Input
              type="date"
              className={`w-full bg-transparent ${border} border rounded-xl`}
              value={contractEndDate}
              onChange={(e) => setContractEndDate(e.target.value)}
            />
          </div>
        </div>

        
        <div className="mb-4">
          <label className="text-sm mb-1 block">Description</label>
          <Textarea
            className={`w-full bg-transparent ${border} border rounded-xl`}
            rows={3}
            placeholder="Optional description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-sm mb-1 block">Email</label>
            <Input
              type="email"
              className={`w-full bg-transparent ${border} border rounded-xl`}
              placeholder="Contact email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm mb-1 block">Phone</label>
            <Input
              className={`w-full bg-transparent ${border} border rounded-xl`}
              placeholder="Contact phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
        </div>

       
        <div className="flex justify-end gap-3 mt-6">
          <Button
            onClick={onClose}
            variant="outline"
            className="rounded-xl px-6"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="rounded-xl px-6 bg-violet-600 hover:bg-violet-700 text-white"
          >
            {loading ? "Saving..." : isEdit ? "Update" : "Create"}
          </Button>
        </div>
      </div>
    </div>
  );
}
