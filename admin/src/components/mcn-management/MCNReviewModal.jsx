import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";

const DetailItem = ({ label, value, theme }) => {
    const mutedText = theme === "dark" ? "text-gray-400" : "text-gray-500";
    const textColor = theme === "dark" ? "text-white" : "text-gray-800";
    return (
        <div>
            <p className={`text-sm ${mutedText}`}>{label}</p>
            <p className={`font-medium ${textColor}`}>{value ?? "N/A"}</p>
        </div>
    )
};

export default function MCNRequestViewModal({
  open,
  onClose,
  data,
  theme = "dark",
  onApprove,
  onReject,
  processing,
}) {
  const [adminNotes, setAdminNotes] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    if (data) {
      setAdminNotes(data.adminNotes || "");
      setRejectionReason(data.rejectionReason || "");
    } else {
      setAdminNotes("");
      setRejectionReason("");
    }
  }, [data]);

  if (!data) return null;

 
  const status = (data.status || "").toLowerCase();
  const isPending = status === "pending";
  const isApproved = status === "approve" || status === "approved";
  const isRejected = status === "reject" || status === "rejected";

  const isApproveMode = data.mode === "approve";
  const isRejectMode = data.mode === "reject";

  const bgColor = theme === "dark" ? "bg-[#151F28]" : "bg-white";
  const textColor = theme === "dark" ? "text-white" : "text-gray-800";
  const borderColor = theme === "dark" ? "border-gray-700" : "border-gray-200";
  const mutedText = theme === "dark" ? "text-gray-400" : "text-gray-500";

  const handleApproveClick = () => {
    if (onApprove && data._id) {
      onApprove(data._id, adminNotes);
    }
  };

  const handleRejectClick = () => {
    if (onReject && data._id) {
      onReject(data._id, adminNotes, rejectionReason);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className={`max-w-5xl max-h-[90%] overflow-y-auto rounded-xl ${bgColor} border ${borderColor} p-6`}
      >
        <DialogHeader>
          <DialogTitle
            className={`text-lg font-semibold ${
              isApproved
                ? "text-green-400"
                : isRejected
                ? "text-red-400"
                : "text-yellow-400"
            }`}
          >
            {isApproved
              ? "Approved MCN Request"
              : isRejected
              ? "Rejected MCN Request"
              : isApproveMode
              ? "Approve MCN Request"
              : isRejectMode
              ? "Reject MCN Request"
              : "MCN Request Details"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6 py-4  ">
          <DetailItem label="Channel Name" value={data.youtubeChannelName} theme={theme} />
          <div>
            <p className={`text-sm ${mutedText}`}>Channel ID or Link</p>
            <p className={`font-medium ${textColor} truncate`} title={data.youtubeChannelId}>
              {data.youtubeChannelId ?? "N/A"}
            </p>
          </div>
          <DetailItem label="Account ID" value={data.userAccountId} theme={theme} />
          <DetailItem label="Account Name" value={data.userId ? `${data.userId.firstName} ${data.userId.lastName}`: 'N/A'} theme={theme} />
          <DetailItem label="Subscribers" value={data.subscriberCount?.toLocaleString()} theme={theme} />
          <DetailItem label="Views (28 days)" value={data.totalViewsCountsIn28Days?.toLocaleString()} theme={theme} />
          <DetailItem label="Status" value={<Badge className={
            status === "pending" ? "bg-yellow-500/20 text-yellow-500" :
            status === "approved" ? "bg-green-500/20 text-green-500" :
            status === "rejected" ? "bg-red-500/20 text-red-500" :
            "bg-gray-500/20 text-gray-400"
          }>
            {status?.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
          </Badge>} theme={theme} />
          <DetailItem label="Monetization Eligible" value={data.monetizationEligibility ? "Yes" : "No"} theme={theme} />
          <DetailItem label="AdSense Enabled" value={data.isAdSenseEnabled ? "Yes" : "No"} theme={theme} />
          <DetailItem label="Copyright Strikes" value={data.hasCopyrightStrikes ? "Yes" : "No"} theme={theme} />
          <DetailItem label="Original Content" value={data.isContentOriginal ? "Yes" : "No"} theme={theme} />
          <DetailItem label="Part of Another MCN" value={data.isPartOfAnotherMCN ? "Yes" : "No"} theme={theme} />
          {data.isPartOfAnotherMCN && <DetailItem label="Other MCN Details" value={data.otherMCNDetails} theme={theme} />}
          <DetailItem label="Channel Revenue (Last Month)" value={`$${data.channelRevenueLastMonth}`} theme={theme} />
          <DetailItem label="Submitted At" value={new Date(data.createdAt).toLocaleDateString()} theme={theme} />
          <DetailItem label="Legal Owner" value={data.isLegalOwner ? "Yes" : "No"} theme={theme} />
          <DetailItem label="Agrees To Terms" value={data.agreesToTerms ? "Yes" : "No"} theme={theme} />
          <DetailItem label="Understands Ownership" value={data.understandsOwnership ? "Yes" : "No"} theme={theme} />
          <DetailItem label="Consents To Contact" value={data.consentsToContact ? "Yes" : "No"} theme={theme} />

          {(data.analyticsScreenshotUrl || data.revenueScreenshotUrl) && (
            <div className="md:col-span-2 lg:col-span-3 flex flex-wrap gap-4">
              {data.analyticsScreenshotUrl && (
                <div>
                  <p className={`text-sm ${mutedText}`}>Analytics Screenshot</p>
                  <a href={data.analyticsScreenshotUrl} target="_blank" rel="noopener noreferrer">
                    <img src={data.analyticsScreenshotUrl} alt="Analytics Screenshot" className="max-w-xs h-auto rounded-md border" />
                  </a>
                </div>
              )}
              {data.revenueScreenshotUrl && (
                <div>
                  <p className={`text-sm ${mutedText}`}>Revenue Screenshot</p>
                  <a href={data.revenueScreenshotUrl} target="_blank" rel="noopener noreferrer">
                    <img src={data.revenueScreenshotUrl} alt="Revenue Screenshot" className="max-w-xs h-auto rounded-md border" />
                  </a>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-5 space-y-4">
          <div>
            <label className={`block text-sm mb-1 ${mutedText}`}>
              Admin Notes
            </label>
            <Textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              disabled={isApproved || isRejected || processing}
              placeholder="Enter admin notes..."
              className={`${bgColor} ${textColor} border ${borderColor}`}
            />
          </div>

          {(isRejectMode || isRejected) && (
            <div>
              <label className={`block text-sm mb-1 ${mutedText}`}>
                Rejection Reason
              </label>
              <Textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                disabled={isApproved || isRejected || processing}
                placeholder="Enter reason for rejection..."
                className={`${bgColor} ${textColor} border ${borderColor}`}
              />
            </div>
          )}
        </div>

        
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={processing}>
            Close
          </Button>

         
          {isApproveMode && (
            <Button
              className="bg-green-600 text-white hover:bg-green-700"
              onClick={handleApproveClick}
              disabled={processing}
            >
              {processing ? "Processing..." : "Approve"}
            </Button>
          )}

          
          {isRejectMode && (
            <Button
              className="bg-red-600 text-white hover:bg-red-700"
              onClick={handleRejectClick}
              disabled={processing}
            >
              {processing ? "Processing..." : "Reject"}
            </Button>
          )}

          
          {!isApproveMode && !isRejectMode && isPending && (
            <>
              <Button
                className="bg-green-600 text-white hover:bg-green-700"
                onClick={handleApproveClick}
                disabled={processing}
              >
                {processing ? "Processing..." : "Approve"}
              </Button>
              <Button
                className="bg-red-600 text-white hover:bg-red-700"
                onClick={handleRejectClick}
                disabled={processing}
              >
                {processing ? "Processing..." : "Reject"}
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
