import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, CalendarDays, Loader2 } from 'lucide-react';
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

export default function UserDetailsModal({ isOpen, onClose, user, theme = 'dark', onUserUpdated }) {
  if (!user) return null;

  const isDark = theme === 'dark';
  const bgColor = isDark ? "bg-[#151F28]" : "bg-white";

  const toDateInput = (isoStr) => {
    if (!isoStr) return '';
    return new Date(isoStr).toISOString().slice(0, 10);
  };

  const [aggSub, setAggSub] = useState({
    startDate: toDateInput(user.aggregatorSubscription?.startDate),
    endDate: toDateInput(user.aggregatorSubscription?.endDate),
    notes: user.aggregatorSubscription?.notes || '',
  });
  const [aggLoading, setAggLoading] = useState(false);

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

            <Section title="KYC (Identity Verification)">
              <DetailItem label="Status" value={user.kyc?.status} isBadge badgeVariant={kycStatusVariant[user.kyc?.status]} />
              <DetailItem label="Residency" value={user.kyc?.residencyType?.toUpperCase() || "NOT SET"} />
              {user.kyc?.residencyType === 'indian' ? (
                <>
                  <DetailItem label="Aadhaar Number" value={user.kyc?.details?.aadhaarNumber} />
                  <DetailItem label="PAN Number" value={user.kyc?.details?.panNumber} />
                  <DetailItem label="GST/Udhyam" value={user.kyc?.details?.gstUdhyamNumber} />
                </>
              ) : (
                <>
                  <DetailItem label="Passport Number" value={user.kyc?.details?.passportNumber} />
                  <DetailItem label="VAT Number" value={user.kyc?.details?.vatNumber} />
                </>
              )}
              {user.kyc?.rejectionReason && (
                <div className="md:col-span-2 lg:col-span-3 p-2 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-sm">
                  <strong>Rejection Reason:</strong> {user.kyc.rejectionReason}
                </div>
              )}
            </Section>

            <Section title="Payout Methods">
              <DetailItem label="Primary Method" value={user.payoutMethods?.primaryMethod?.toUpperCase()} isBadge />
              
              {/* Bank */}
              <div className="md:col-span-2 lg:col-span-3 mt-2 pt-2 border-t border-gray-800">
                <p className="text-sm font-bold text-blue-400 mb-2">Bank Transfer {user.payoutMethods?.bank?.verified && <Badge variant="success" className="ml-2">Verified</Badge>}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <DetailItem label="Account Holder" value={user.payoutMethods?.bank?.accountHolderName} />
                  <DetailItem label="Bank Name" value={user.payoutMethods?.bank?.bankName} />
                  <DetailItem label="Account Number" value={user.payoutMethods?.bank?.accountNumber} />
                  <DetailItem label="IFSC / SWIFT" value={user.payoutMethods?.bank?.ifscSwiftCode} />
                </div>
              </div>

              {/* UPI */}
              <div className="md:col-span-2 lg:col-span-3 mt-4 pt-2 border-t border-gray-800">
                <p className="text-sm font-bold text-purple-400 mb-2">UPI {user.payoutMethods?.upi?.verified && <Badge variant="success" className="ml-2">Verified</Badge>}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <DetailItem label="UPI ID" value={user.payoutMethods?.upi?.upiId} />
                  <DetailItem label="Account Holder" value={user.payoutMethods?.upi?.accountHolderName} />
                </div>
              </div>

              {/* PayPal */}
              <div className="md:col-span-2 lg:col-span-3 mt-4 pt-2 border-t border-gray-800">
                <p className="text-sm font-bold text-blue-600 mb-2">PayPal {user.payoutMethods?.paypal?.verified && <Badge variant="success" className="ml-2">Verified</Badge>}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <DetailItem label="PayPal Email" value={user.payoutMethods?.paypal?.paypalEmail} />
                  <DetailItem label="Account Name" value={user.payoutMethods?.paypal?.accountName} />
                </div>
              </div>

              {user.payoutMethods?.primaryMethod === 'upi' && !user.payoutMethods?.upi?.upiId && (
                <div className="col-span-full mt-2 p-2 bg-yellow-500/10 border border-yellow-500/20 rounded text-yellow-500 text-xs">
                  Primary method is UPI but details are missing.
                </div>
              )}
            </Section>

           

            {user.userType !== 'aggregator' && (
              <Section title="Subscription">
                <DetailItem label="Plan ID" value={user.subscription?.planId} />
                <DetailItem label="Status" value={user.subscription?.status} isBadge badgeVariant={subscriptionStatusVariant[user.subscription?.status]}/>
                <DetailItem label="Valid Until" value={user.subscription?.validUntil ? new Date(user.subscription.validUntil).toLocaleDateString() : 'N/A'} />
                <DetailItem label="Auto-Renewal" value={user.subscription?.autoRenewal ? 'Enabled' : 'Disabled'} />
              </Section>
            )}

            {user.userType === 'aggregator' && (
              <div className="space-y-4 rounded-lg border border-gray-800 p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-md font-semibold text-gray-300 flex items-center gap-2">
                    <CalendarDays className="w-4 h-4" /> Aggregator Subscription
                  </h3>
                  {user.aggregatorSubscription?.startDate && user.aggregatorSubscription?.endDate && (
                    <Badge
                      className={
                        new Date() >= new Date(user.aggregatorSubscription.startDate) &&
                        new Date() <= new Date(user.aggregatorSubscription.endDate)
                          ? "bg-green-600 text-white"
                          : "bg-gray-600 text-white"
                      }
                    >
                      {new Date() >= new Date(user.aggregatorSubscription.startDate) &&
                      new Date() <= new Date(user.aggregatorSubscription.endDate)
                        ? "Active"
                        : "Inactive"}
                    </Badge>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Start Date</p>
                    <Input
                      type="date"
                      value={aggSub.startDate}
                      onChange={(e) => setAggSub(p => ({ ...p, startDate: e.target.value }))}
                      className="h-9 bg-transparent border-gray-700 text-gray-200"
                    />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">End Date</p>
                    <Input
                      type="date"
                      value={aggSub.endDate}
                      onChange={(e) => setAggSub(p => ({ ...p, endDate: e.target.value }))}
                      className="h-9 bg-transparent border-gray-700 text-gray-200"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-xs text-gray-500 mb-1">Notes (optional)</p>
                    <Input
                      value={aggSub.notes}
                      onChange={(e) => setAggSub(p => ({ ...p, notes: e.target.value }))}
                      placeholder="e.g. Renewal discussed, paid via bank"
                      className="h-9 bg-transparent border-gray-700 text-gray-200"
                    />
                  </div>
                </div>
                <Button
                  disabled={aggLoading || !aggSub.startDate || !aggSub.endDate}
                  onClick={async () => {
                    setAggLoading(true);
                    try {
                      await GlobalApi.updateAggregatorSubscription(user._id, {
                        startDate: aggSub.startDate,
                        endDate: aggSub.endDate,
                        notes: aggSub.notes || undefined,
                      });
                      toast.success("Aggregator subscription updated");
                      onUserUpdated?.();
                    } catch (err) {
                      toast.error(err.response?.data?.message || "Failed to update subscription");
                    } finally {
                      setAggLoading(false);
                    }
                  }}
                  className="bg-purple-600 hover:bg-purple-700 text-white text-sm"
                >
                  {aggLoading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Saving...</> : "Save Subscription Dates"}
                </Button>
              </div>
            )}

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
