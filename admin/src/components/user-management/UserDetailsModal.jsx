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
    <p className="text-sm text-gray-400">{label}</p>
    {isBadge ? (
      <Badge variant={badgeVariant} className="w-fit text-white border-none">{value}</Badge>
    ) : (
      <p className="text-base text-gray-100">{value || "N/A"}</p>
    )}
  </div>
);

const Section = ({ title, children }) => (
  <div className="space-y-4 rounded-xl border border-gray-800/50 p-5 bg-gray-900/20">
    <h3 className="text-md font-bold text-gray-300 border-l-4 border-purple-500 pl-3">{title}</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {children}
    </div>
  </div>
);

const SocialLink = ({ label, link }) => (
  link ? (
    <div>
      <p className="text-sm text-gray-400">{label}</p>
      <a href={link} target="_blank" rel="noopener noreferrer" className="text-base text-purple-400 hover:text-purple-300 hover:underline truncate block transition-colors">
        {link}
      </a>
    </div>
  ) : null
);

export default function UserDetailsModal({ isOpen, onClose, user, theme = 'dark', onUserUpdated }) {
  if (!user) return null;

  const isDark = theme === 'dark';
  const bgColor = isDark ? "bg-[#151F28] text-gray-100" : "bg-white text-gray-900";
  const borderColor = isDark ? "border-gray-800" : "border-gray-200";

  const handleIndividualExport = () => {
    const stageName =
      user.userType === 'artist' 
        ? user?.artistData?.artistName || "" 
        : user.userType === 'label' 
        ? user?.labelData?.labelName || "" 
        : user.userType === 'aggregator' 
        ? user?.aggregatorData?.companyName || "" 
        : "";

    const joinArr = (arr) => Array.isArray(arr) ? arr.filter(Boolean).join('; ') : (arr || "");
    const formatBool = (val) => val ? "Yes" : "No";
    const dateOptions = { day: '2-digit', month: 'short', year: 'numeric' };
    const formatDate = (date) => date ? new Intl.DateTimeFormat('en-GB', dateOptions).format(new Date(date)) : "";

    const headers = [
      "NO.", "First Name", "Last Name", "Account_id", "User Email", "Mobile Number", "Address", "Pincode", "State", "Country", 
      "User Type", "Account Name", "Youtube", "Facebook", "Instagram", "Spotify", "Apple", "Saavn", "Amazon", "How Did You Know", 
      "LinkedIn", "TikTok", "Twitter", "Website", "Label Name", "Label YT", "Label IG", "Label FB", "Label Website", "Label Popular Links", 
      "Label Freq", "Monthly Plans", "Label Info", "Bank Holder", "Bank Name", "Account Number", "IFSC", "Paypal Email", "Join Date", 
      "KYC Status", "KYC Residency", "Aadhaar No", "PAN No", "GST No", "Passport No", "VAT No", "UPI ID", "UPI Holder", 
      "Services", "Associated Labels", "Email Verified", "Bank Verified", "Account Status", "Plan", "Membership Status", "Start Date", "End Date", "Net Revenue Share"
    ];

    const dataRow = [
      1, user.firstName || "", user.lastName || "", user.accountId || "", user.emailAddress || "", user.phoneNumber?.internationalNumber || "", 
      user.address?.street || "", user.address?.pinCode || "", user.address?.state || "", user.address?.country || "", 
      user.userType || "", stageName, user.socialMedia?.youtube || user.artistData?.youtubeLink || "", user.socialMedia?.facebook || "", 
      user.socialMedia?.instagram || "", user.socialMedia?.spotify || "", user.socialMedia?.appleMusic || "", user.socialMedia?.saavn || "", 
      user.socialMedia?.amazon || "", user.aggregatorData?.howDidYouKnow || "", user.aggregatorData?.linkedinUrl || user.socialMedia?.linkedin || "", 
      user.socialMedia?.tiktok || "", user.socialMedia?.twitter || "", user.socialMedia?.website || "", user.labelData?.labelName || "", 
      user.labelData?.youtubeLink || "", user.labelData?.instagramLink || "", user.labelData?.facebookLink || "", user.labelData?.websiteLink || "", 
      joinArr(user.labelData?.popularArtistLinks), user.labelData?.releaseFrequency || "", user.labelData?.monthlyReleasePlans || "", 
      user.labelData?.briefInfo || "", user.payoutMethods?.bank?.accountHolderName || "", user.payoutMethods?.bank?.bankName || "", 
      user.payoutMethods?.bank?.accountNumber || "", user.payoutMethods?.bank?.ifscSwiftCode || "", user.payoutMethods?.paypal?.paypalEmail || "", 
      formatDate(user.createdAt), user.kyc?.status || "unverified", user.kyc?.residencyType || "", user.kyc?.details?.aadhaarNumber || "", 
      user.kyc?.details?.panNumber || "", user.kyc?.details?.gstUdhyamNumber || "", user.kyc?.details?.passportNumber || "", 
      user.kyc?.details?.vatNumber || "", user.payoutMethods?.upi?.upiId || "", user.payoutMethods?.upi?.accountHolderName || "", 
      joinArr(user.aggregatorData?.additionalServices), joinArr(user.aggregatorData?.associatedLabels), formatBool(user.isEmailVerified), 
      formatBool(user.payoutMethods?.bank?.verified), user.isActive ? "Active" : "Inactive", user.subscription?.planId || "Free", 
      user.subscription?.status || "Inactive", formatDate(user.subscription?.validFrom), formatDate(user.subscription?.validUntil),
      user.subscription?.netRevenueShare !== undefined ? `${user.subscription.netRevenueShare}%` : "0%"
    ];

    const csvContent = [headers.join(","), dataRow.map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `user_${user.accountId}_details.csv`;
    link.click();
    toast.success("Individual details exported!");
  };

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
      <DialogContent className={`max-w-4xl rounded-2xl border ${borderColor} shadow-2xl overflow-hidden p-0 ${bgColor}`}>
        <div className={`flex flex-row items-center justify-between px-6 py-5 border-b ${borderColor} ${isDark ? "bg-gray-900/40" : "bg-gray-50"}`}>
          <div className="flex-1">
            <h2 className="text-xl font-bold flex items-center gap-3">
              User Profile Details
              <Badge variant="outline" className={`text-[10px] font-normal ${isDark ? "border-gray-700 text-gray-400" : "border-gray-300 text-gray-500"}`}>{user.accountId}</Badge>
            </h2>
            <p className={`text-sm mt-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
              Complete profile and administrative information for {user.firstName}
            </p>
          </div>
          <div className="flex items-center gap-4 mr-6">
            <Button 
                variant="outline" 
                size="sm"
                onClick={handleIndividualExport}
                className={`h-9 border ${isDark ? "border-gray-700 hover:bg-gray-800 text-gray-200" : "border-gray-300 hover:bg-gray-100 text-gray-700"} transition-all`}
            >
                Export as CSV
            </Button>
            {/* <button 
              onClick={onClose} 
              className={`p-2 rounded-lg transition-colors ${isDark ? "hover:bg-gray-800 text-gray-100" : "hover:bg-gray-100 text-gray-900"}`}
            >
              <X size={20} />
            </button> */}
          </div>
        </div>

        <ScrollArea className="max-h-[75vh] p-6 focus:outline-none">
          <div className="space-y-6">
            <Section title="Basic Profile">
              <DetailItem label="Full Name" value={`${user.firstName} ${user.lastName}`} />
              <DetailItem label="User Type" value={user.userType?.toUpperCase()} isBadge />
              <DetailItem label="Email Address" value={user.emailAddress} />
              <DetailItem label="Phone Number" value={user.phoneNumber?.internationalNumber} />
              <DetailItem label="Join Date" value={new Date(user.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} />
            </Section>
            
            <Section title="Account & Verification">
                <DetailItem label="Account Status" value={user.isActive ? 'Active' : 'Inactive'} isBadge variant={user.isActive ? 'success' : 'destructive'} />
                <DetailItem label="Email Verified" value={user.isEmailVerified ? 'Verified' : 'Unverified'} isBadge variant={user.isEmailVerified ? 'success' : 'destructive'}/>
            </Section>

            <Section title="Primary Address">
              <DetailItem label="Street" value={user.address?.street} />
              <DetailItem label="City" value={user.address?.city} />
              <DetailItem label="State" value={user.address?.state} />
              <DetailItem label="Country" value={user.address?.country} />
              <DetailItem label="PIN Code" value={user.address?.pinCode} />
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
                <DetailItem label="Total Releases" value={user.labelData.totalReleases} />
                <DetailItem label="Release Frequency" value={user.labelData.releaseFrequency} />
                <DetailItem label="Monthly Release Plans" value={user.labelData.monthlyReleasePlans} />
                <DetailItem label="Popular Release Link" value={user.labelData.popularReleaseLink} />
                <div className="col-span-full">
                  <p className="text-sm text-gray-500 mb-1">Popular Artist Links</p>
                  <div className="flex flex-wrap gap-2">
                    {user.labelData.popularArtistLinks?.map((l, i) => (
                      <a key={i} href={l} target="_blank" rel="noopener noreferrer" className="text-xs text-purple-400 bg-purple-400/10 px-2 py-1 rounded hover:underline hover:text-purple-300">
                        {l}
                      </a>
                    ))}
                  </div>
                </div>
                <div className="col-span-full">
                   <p className="text-sm text-gray-500">Label Info</p>
                   <p className={`text-sm mt-1 ${isDark ? "text-gray-300" : "text-gray-600"}`}>{user.labelData.briefInfo || "N/A"}</p>
                </div>
              </Section>
            )}
            
            {user.userType === 'aggregator' && user.aggregatorData && (
              <Section title="Aggregator Details">
                <DetailItem label="Company Name" value={user.aggregatorData.companyName} />
                <DetailItem label="Total Releases" value={user.aggregatorData.totalReleases} />
                <DetailItem label="Release Frequency" value={user.aggregatorData.releaseFrequency} />
                <DetailItem label="Monthly Plans" value={user.aggregatorData.monthlyReleasePlans} />
                
                <div className="col-span-full space-y-3">
                   <div>
                     <p className="text-sm text-gray-400 mb-1">Associated Labels</p>
                     <div className="flex flex-wrap gap-2">
                       {user.aggregatorData.associatedLabels?.map((l, i) => (
                         <Badge key={i} variant="outline" className={`border-gray-700 ${isDark ? "text-gray-100" : "text-gray-800"}`}>{l}</Badge>
                       ))}
                     </div>
                   </div>
                   <div>
                     <p className="text-sm text-gray-500 mb-1">Popular Release Links</p>
                     <div className="flex flex-col gap-1">
                       {user.aggregatorData.popularReleaseLinks?.map((l, i) => (
                         <a key={i} href={l} target="_blank" rel="noopener noreferrer" className="text-sm text-purple-400 hover:underline">{l}</a>
                       ))}
                     </div>
                   </div>
                   <div>
                     <p className="text-sm text-gray-500 mb-1">Popular Artist Links</p>
                     <div className="flex flex-col gap-1">
                       {user.aggregatorData.popularArtistLinks?.map((l, i) => (
                         <a key={i} href={l} target="_blank" rel="noopener noreferrer" className="text-sm text-purple-400 hover:underline">{l}</a>
                       ))}
                     </div>
                   </div>
                </div>

                <div className="col-span-full">
                   <p className="text-sm text-gray-500">Brief Info</p>
                   <p className="text-sm text-gray-300 mt-1">{user.aggregatorData.briefInfo || "N/A"}</p>
                </div>
              </Section>
            )}

            {user.userType === 'aggregator' && user.aggregatorData && (
               <Section title="Additional Info & Marketing">
                  <div className="col-span-full mb-2">
                    <p className="text-sm text-gray-500 mb-1">Services Interested In</p>
                    <div className="flex flex-wrap gap-2">
                      {user.aggregatorData.additionalServices?.map((s, i) => (
                        <Badge key={i} className="bg-blue-500/20 text-blue-400 border-none capitalize">{s.replace('_', ' ')}</Badge>
                      ))}
                    </div>
                  </div>
                  <DetailItem label="How Did You Know?" value={user.aggregatorData.howDidYouKnow?.replace('_', ' ')} />
                  {user.aggregatorData.howDidYouKnow === 'other' && (
                    <DetailItem label="Marketing (Other)" value={user.aggregatorData.howDidYouKnowOther} />
                  )}
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
                <DetailItem label="Net Revenue Share" value={user.subscription?.netRevenueShare ? `${user.subscription.netRevenueShare}%` : '0%'} />
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
                    <p className="text-xs text-gray-500 mb-1">Notes For Aggregator (optional)</p>
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
                {/* Check both top-level and type-specific social links */}
                <SocialLink label="Website" link={user.socialMedia?.website || user.labelData?.websiteLink || user.aggregatorData?.websiteLink} />
                <SocialLink label="YouTube" link={user.socialMedia?.youtube || user.artistData?.youtubeLink || user.labelData?.youtubeLink || user.aggregatorData?.youtubeLink} />
                <SocialLink label="Instagram" link={user.socialMedia?.instagram || user.artistData?.instagramLink || user.aggregatorData?.instagramUrl} />
                <SocialLink label="Facebook" link={user.socialMedia?.facebook || user.artistData?.facebookLink || user.aggregatorData?.facebookUrl} />
                <SocialLink label="LinkedIn" link={user.socialMedia?.linkedin || user.aggregatorData?.linkedinUrl} />
                <SocialLink label="Twitter" link={user.socialMedia?.twitter} />
                <SocialLink label="Spotify" link={user.socialMedia?.spotify} />
                <SocialLink label="TikTok" link={user.socialMedia?.tiktok} />
            </Section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
