import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

const StatusBadge = ({ status }) => {
  const statusConfig = {
    pending: "bg-yellow-500/20 text-yellow-500",
    approved: "bg-blue-500/20 text-blue-400",
    paid: "bg-green-500/20 text-green-500",
    rejected: "bg-red-500/20 text-red-500",
    cancelled: "bg-gray-500/20 text-gray-400",
  };
  const normalizedStatus = status?.toLowerCase().replace(/ /g, '_');
  const className = statusConfig[normalizedStatus] || "bg-gray-500/20 text-gray-400";
  
  return (
    <Badge className={className}>
      {status?.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
    </Badge>
  );
};


const DetailItem = ({ label, value, isLink = false, isStatus = false }) => {
  const textColor = "text-gray-300"; // Assuming always dark for these texts

  return (
    <div>
      <p className="text-sm text-gray-400">{label}</p>
      {isLink ? (
        <a href={value} target="_blank" rel="noopener noreferrer" className="font-medium text-purple-400 hover:underline truncate block">
          {value || "N/A"}
        </a>
      ) : isStatus ? (
        <StatusBadge status={value} />
      ) : (
        <p className={`font-medium ${textColor}`}>{value ?? "N/A"}</p>
      )}
    </div>
  );
};

export default function TransactionDetailsModal({ isOpen, onClose, transaction, theme }) {
  if (!transaction) return null;
  const isDark = theme === "dark";
  const cardBg = isDark ? "bg-[#151F28]" : "bg-white";
  const borderColor = isDark ? "border-gray-700" : "border-gray-300";
  const textColor = isDark ? "text-gray-300" : "text-[#151F28]";


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`max-w-4xl rounded-xl ${cardBg} border ${borderColor} p-6`}>
        <DialogHeader>
          <DialogTitle className={textColor}>
            Transaction Details
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Details for Request ID: {transaction.requestId}
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6 py-4 max-h-[70vh] overflow-y-auto">
            <DetailItem label="Request ID" value={transaction.requestId} />
            <DetailItem label="Account ID" value={transaction.accountId} />
            <DetailItem label="User Name" value={`${transaction.userId?.firstName || ''} ${transaction.userId?.lastName || ''}`} />
            <DetailItem label="User Email" value={transaction.userId?.emailAddress} />
            <DetailItem label="Amount" value={`₹${Number(transaction.amount || 0).toLocaleString("en-IN")}`} />
            <DetailItem label="Method" value={transaction.payoutMethod?.replace(/_/g, " ")} />
            <DetailItem label="Status" value={transaction.status} isStatus={true}/>
            <DetailItem label="Requested At" value={new Date(transaction.requestedAt).toLocaleString()} />
            {transaction.processedAt && <DetailItem label="Processed At" value={new Date(transaction.processedAt).toLocaleString()} />}
            {transaction.paidAt && <DetailItem label="Paid At" value={new Date(transaction.paidAt).toLocaleString()} />}
            {transaction.rejectedAt && <DetailItem label="Rejected At" value={new Date(transaction.rejectedAt).toLocaleString()} />}
            {transaction.rejectionReason && <DetailItem label="Rejection Reason" value={transaction.rejectionReason} />}
            {transaction.adminNotes && <DetailItem label="Admin Notes" value={transaction.adminNotes} />}
            {transaction.transactionReference && <DetailItem label="Transaction Reference" value={transaction.transactionReference} />}
            <hr className="col-span-full border-gray-700 my-2" />
            <h3 className={`col-span-full text-md font-semibold ${textColor} mb-2`}>Bank Details</h3>
            <DetailItem label="Account Holder" value={transaction.userId?.kyc?.bankDetails?.accountHolderName} />
            <DetailItem label="Account Number" value={transaction.userId?.kyc?.bankDetails?.accountNumber} />
            <DetailItem label="IFSC Code" value={transaction.userId?.kyc?.bankDetails?.ifscCode} />
            <DetailItem label="Bank Name" value={transaction.userId?.kyc?.bankDetails?.bankName} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
