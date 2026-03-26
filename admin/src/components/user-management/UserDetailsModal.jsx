import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X } from 'lucide-react';
import GlobalApi from '@/lib/GlobalApi';
import { toast } from 'sonner';

const DetailItem = ({ label, value, isBadge = false, badgeVariant = "secondary" }) => (
  <div className="flex flex-col">
    <p className="text-sm text-gray-500">{label}</p>
    {isBadge ? (
      <Badge variant={badgeVariant} className="w-fit">{value}</Badge>
    ) : (
      <p className="text-base text-gray-200">{value || "N/A"}</p>
    )}
  </div>
);

const Section = ({ title, children }) => (
  <div className="space-y-4 rounded-lg border border-gray-800 p-4">
    <h3 className="text-md font-semibold text-gray-300">{title}</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {children}
    </div>
  </div>
);

const SocialLink = ({ label, link }) => (
  link ? (
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <a href={link} target="_blank" rel="noopener noreferrer" className="text-base text-purple-400 hover:underline truncate block">
        {link}
      </a>
    </div>
  ) : null
);

export default function UserDetailsModal({ isOpen, onClose, user, theme = 'dark' }) {
  if (!user) return null;

  const isDark = theme === 'dark';
  const bgColor = isDark ? "bg-[#151F28]" : "bg-white";

  const kycStatusVariant = {
    verified: "success",
    pending: "warning",
    unverified: "secondary",
    rejected: "destructive",
  };

  const subscriptionStatusVariant = {
    active: "success",
    inactive: "secondary",
    expired: "destructive",
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`max-w-4xl rounded-2xl border-gray-800 shadow-lg ${bgColor}`}>
        <DialogHeader className="flex flex-row items-center justify-between pr-6 pt-6 pl-6 pb-4 border-b border-gray-800">
          <div>
            <DialogTitle className="text-xl font-bold text-gray-100">
              User Details
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Comprehensive information for {user.firstName} {user.lastName}
            </DialogDescription>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-gray-800 transition-colors">
            <X size={20} />
          </button>
        </DialogHeader>

        <ScrollArea className="max-h-[75vh] p-6">
          <div className="space-y-6">
            <Section title="General Information">
              <DetailItem label="Full Name" value={`${user.firstName} ${user.lastName}`} />
              <DetailItem label="Account ID" value={user.accountId} />
              <DetailItem label="User Type" value={user.userType} isBadge />
              <DetailItem label="Email" value={user.emailAddress} />
              <DetailItem label="Phone Number" value={user.phoneNumber?.internationalNumber} />
              <DetailItem label="Join Date" value={new Date(user.createdAt).toLocaleDateString()} />
            </Section>
            
            <Section title="Address">
              <DetailItem label="Street" value={user.address?.street} />
              <DetailItem label="City" value={user.address?.city} />
              <DetailItem label="State" value={user.address?.state} />
              <DetailItem label="Country" value={user.address?.country} />
              <DetailItem label="PIN Code" value={user.address?.pinCode} />
            </Section>

            <Section title="Account Status">
                <DetailItem label="Account Active" value={user.isActive ? 'Yes' : 'No'} isBadge variant={user.isActive ? 'success' : 'destructive'} />
                <DetailItem label="Email Verified" value={user.isEmailVerified ? 'Yes' : 'No'} isBadge variant={user.isEmailVerified ? 'success' : 'destructive'}/>
            </Section>

            {user.userType === 'artist' && user.artistData && (
              <Section title="Artist Details">
                <DetailItem label="Artist Name" value={user.artistData.artistName} />
                <SocialLink label="YouTube" link={user.artistData.youtubeLink} />
                <SocialLink label="Instagram" link={user.artistData.instagramLink} />
                <SocialLink label="Facebook" link={user.artistData.facebookLink} />
              </Section>
            )}

            {user.userType === 'label' && user.labelData && (
              <Section title="Label Details">
                <DetailItem label="Label Name" value={user.labelData.labelName} />
                <SocialLink label="Website" link={user.labelData.websiteLink} />
                <DetailItem label="Total Releases" value={user.labelData.totalReleases} />
              </Section>
            )}
            
            {user.userType === 'aggregator' && user.aggregatorData && (
              <Section title="Aggregator Details">
                <DetailItem label="Company Name" value={user.aggregatorData.companyName} />
                <SocialLink label="Website" link={user.aggregatorData.websiteLink} />
                <DetailItem label="Associated Labels" value={user.aggregatorData.associatedLabels?.join(', ')} />
              </Section>
            )}

            <Section title="KYC Details">
              <DetailItem label="Status" value={user.kyc?.status} isBadge badgeVariant={kycStatusVariant[user.kyc?.status]} />
              <DetailItem label="Residency" value={user.kyc?.residencyType?.toUpperCase()} />
              {user.kyc?.residencyType === 'indian' ? (
                <>
                  <DetailItem label="Aadhaar" value={user.kyc?.details?.aadhaarNumber} />
                  <DetailItem label="PAN" value={user.kyc?.details?.panNumber} />
                  <DetailItem label="GST/Udhyam" value={user.kyc?.details?.gstUdhyamNumber} />
                </>
              ) : (
                <>
                  <DetailItem label="Passport" value={user.kyc?.details?.passportNumber} />
                  <DetailItem label="VAT" value={user.kyc?.details?.vatNumber} />
                </>
              )}
              <DetailItem label="Bank Account" value={user.kyc?.bankDetails?.accountNumber} />
              <DetailItem label="IFSC" value={user.kyc?.bankDetails?.ifscCode} />
              <DetailItem label="Account Holder" value={user.kyc?.bankDetails?.accountHolderName} />
              <DetailItem label="Bank Name" value={user.kyc?.bankDetails?.bankName} />
              <DetailItem label="UPI ID" value={user.kyc?.upiDetails?.upiId} />
            </Section>

            {user.kyc?.status === 'pending' && (
              <div className="mt-8 pt-6 border-t border-gray-800 space-y-4">
                <h3 className="text-lg font-bold text-gray-100">Review KYC Submission</h3>
                <div className="flex gap-4">
                  <button
                    onClick={async () => {
                      try {
                        await GlobalApi.reviewUserKYC(user._id, { status: 'verified' });
                        toast.success("KYC Approved successfully");
                        onClose();
                      } catch (err) {
                        toast.error(err.response?.data?.message || "Failed to approve KYC");
                      }
                    }}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                  >
                    Approve KYC
                  </button>
                  <button
                    onClick={async () => {
                      const reason = prompt("Enter rejection reason:");
                      if (!reason) return;
                      try {
                        await GlobalApi.reviewUserKYC(user._id, { status: 'rejected', reason });
                        toast.success("KYC Rejected");
                        onClose();
                      } catch (err) {
                        toast.error(err.response?.data?.message || "Failed to reject KYC");
                      }
                    }}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                  >
                    Reject KYC
                  </button>
                </div>
              </div>
            )}

            <Section title="Subscription">
              <DetailItem label="Plan ID" value={user.subscription?.planId} />
              <DetailItem label="Status" value={user.subscription?.status} isBadge badgeVariant={subscriptionStatusVariant[user.subscription?.status]}/>
              <DetailItem label="Valid Until" value={user.subscription?.validUntil ? new Date(user.subscription.validUntil).toLocaleDateString() : 'N/A'} />
              <DetailItem label="Auto-Renewal" value={user.subscription?.autoRenewal ? 'Enabled' : 'Disabled'} />
            </Section>

            <Section title="Social Media">
                <SocialLink label="Spotify" link={user.socialMedia?.spotify} />
                <SocialLink label="Instagram" link={user.socialMedia?.instagram} />
                <SocialLink label="YouTube" link={user.socialMedia?.youtube} />
                <SocialLink label="TikTok" link={user.socialMedia?.tiktok} />
                <SocialLink label="Facebook" link={user.socialMedia?.facebook} />
                <SocialLink label="Twitter" link={user.socialMedia?.twitter} />
                <SocialLink label="Website" link={user.socialMedia?.website} />
            </Section>

          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
