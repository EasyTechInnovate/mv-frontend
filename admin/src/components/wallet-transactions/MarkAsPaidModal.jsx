import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function MarkAsPaidModal({ isOpen, onClose, onSubmit, loading, theme }) {
  const [transactionReference, setTransactionReference] = useState('');
  const isDark = theme === "dark";

  useEffect(() => {
    if (isOpen) {
      setTransactionReference('');
    }
  }, [isOpen]);

  const handleSubmit = () => {
    onSubmit({ transactionReference });
  };

  const cardBg = isDark ? "bg-[#151F28]" : "bg-white";
  const borderColor = isDark ? "border-gray-700" : "border-gray-300";
  const textColor = isDark ? "text-gray-300" : "text-[#151F28]";
  const inputBg = isDark
    ? "bg-[#111A22] border-[#12212a] text-slate-300"
    : "bg-white border-gray-300 text-[#111A22]";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`${cardBg} ${borderColor}`}>
        <DialogHeader>
          <DialogTitle className={textColor}>Mark as Paid</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="transactionReference" className={textColor}>Transaction Reference</Label>
            <Input
              id="transactionReference"
              value={transactionReference}
              onChange={(e) => setTransactionReference(e.target.value)}
              placeholder="Enter transaction reference..."
              className={inputBg}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose} disabled={loading}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Submitting...' : 'Mark as Paid'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
