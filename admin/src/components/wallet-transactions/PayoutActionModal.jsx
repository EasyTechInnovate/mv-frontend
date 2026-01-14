import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function PayoutActionModal({ isOpen, onClose, action, onSubmit, loading, theme }) {
  const [adminNotes, setAdminNotes] = useState('');
  const [reason, setReason] = useState('');
  const isDark = theme === "dark";

  useEffect(() => {
    if (isOpen) {
      setAdminNotes('');
      setReason('');
    }
  }, [isOpen]);

  const handleSubmit = () => {
    onSubmit({ adminNotes, reason });
  };

  const isReject = action === 'reject';
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
          <DialogTitle className={textColor}>{isReject ? 'Reject' : 'Approve'} Payout Request</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {isReject && (
            <div className="space-y-2">
              <Label htmlFor="reason" className={textColor}>Rejection Reason</Label>
              <Textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Provide a reason for rejection..."
                className={inputBg}
              />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="adminNotes" className={textColor}>Admin Notes (Optional)</Label>
            <Textarea
              id="adminNotes"
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Add internal notes..."
              className={inputBg}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose} disabled={loading}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Submitting...' : `Submit ${isReject ? 'Rejection' : 'Approval'}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
