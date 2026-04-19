import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import GlobalApi from "@/lib/GlobalApi";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const DetailItem = ({ label, value }) => (
  <div>
    <p className="text-sm text-gray-400">{label}</p>
    <p className="font-medium text-gray-200">{value || "N/A"}</p>
  </div>
);

export default function AggregatorRequestReviewModal({
  isOpen,
  onClose,
  applicationId,
  onReviewed,
}) {
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && applicationId) {
      const fetchApplication = async () => {
        setLoading(true);
        try {
          const res = await GlobalApi.getAggregatorApplicationById(
            applicationId
          );
          setApplication(res.data.data.application);
          // Set admin notes if already exists
          if (res.data.data.application.adminNotes) {
            setAdminNotes(res.data.data.application.adminNotes);
          }
        } catch (error) {
          toast.error("Failed to fetch application details.");
          console.error(error);
        } finally {
          setLoading(false);
        }
      };
      fetchApplication();
    }
  }, [isOpen, applicationId]);

  const handleReview = async (status) => {
    setIsSubmitting(true);
    try {
      await GlobalApi.reviewAggregatorApplication(applicationId, {
        applicationStatus: status,
        adminNotes,
      });
      toast.success(`Application ${status} successfully.`);
      onReviewed();
      onClose();
    } catch (error) {
      console.error(`Error ${status} application:`, error);
      let errorMessage =
        error.response?.data?.message ||
        error.message ||
        `Failed to ${status} application.`;

      // Check for detailed validation errors
      if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        const detailMessages = error.response.data.errors.map(err => err.message);
        if (detailMessages.length > 0) {
          errorMessage = detailMessages.join(" | ");
        }
      }
      toast.error(`Error: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExportCSV = () => {
    if (!application) return;

    const headers = [
      "NO.", "Name", "Email", "Phone", "Address", "Pincode", "State", "Country", "Company", "Application Status", "Submission Date", 
      "Website", "YouTube", "Instagram", "Facebook", "LinkedIn", "Total Releases", "Release Frequency", "Monthly Plans", "Popular Release Links", "Popular Artist Links", "Associated Labels",
      "Brief Info", "Additional Services", 
      "How Did You Know?", "Other Source", "Admin Notes", "Reviewed At", "Reviewed By", "Account Created"
    ];

    const dataRow = [
      1, 
      `${application.firstName || ""} ${application.lastName || ""}`,
      application.emailAddress || "",
      application.phoneNumber || "",
      application.address || "",
      application.pincode || "",
      application.state || "",
      application.country || "",
      application.companyName || "",
      application.applicationStatus || "",
      application.createdAt ? new Date(application.createdAt).toLocaleDateString() : "",
      application.websiteLink || "",
      application.youtubeLink || "",
      application.instagramUrl || "",
      application.facebookUrl || "",
      application.linkedinUrl || "",
      application.totalReleases || "",
      application.releaseFrequency || "",
      application.monthlyReleasePlans || "",
      Array.isArray(application.popularReleaseLinks) ? application.popularReleaseLinks.join("; ") : "",
      Array.isArray(application.popularArtistLinks) ? application.popularArtistLinks.join("; ") : "",
      Array.isArray(application.associatedLabels) ? application.associatedLabels.join("; ") : "",
      application.briefInfo || "",
      Array.isArray(application.additionalServices) ? application.additionalServices.join("; ") : "",
      application.howDidYouKnow || "",
      application.howDidYouKnowOther || "",
      application.adminNotes || adminNotes || "",
      application.reviewedAt ? new Date(application.reviewedAt).toLocaleDateString() : "",
      application.reviewedBy ? `${application.reviewedBy.firstName || ""} ${application.reviewedBy.lastName || ""}` : "",
      application.isAccountCreated ? "Yes" : "No"
    ];

    const csvContent = [
      headers.join(","),
      dataRow.map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `aggregator_application_${applicationId}.csv`;
    link.click();
    toast.success("Application details exported!");
  };

  const isPending = application?.applicationStatus === "pending";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-[#111A22] border-gray-800 text-white">
        <DialogHeader className="flex flex-row items-center justify-between border-b border-gray-800 pb-4 mb-4">
          <div className="flex-1">
            <DialogTitle>Aggregator Application Review</DialogTitle>
            <DialogDescription>
              Review the details of the aggregator application below.
            </DialogDescription>
          </div>
          {application && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCSV}
              className="mr-6 border-gray-700 hover:bg-gray-800 text-gray-200 transition-all h-9"
            >
              Export as CSV
            </Button>
          )}
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : !application ? (
          <div className="text-center py-10">No application data found.</div>
        ) : (
          <div className="max-h-[70vh] overflow-y-auto p-1">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <DetailItem
                label="Name"
                value={`${application.firstName} ${application.lastName}`}
              />
              <DetailItem label="Email" value={application.emailAddress} />
              <DetailItem label="Phone" value={application.phoneNumber} />
              <DetailItem label="Company" value={application.companyName} />
              <DetailItem
                label="Application Status"
                value={application.applicationStatus}
              />
              <DetailItem
                label="Submission Date"
                value={new Date(application.createdAt).toLocaleDateString()}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <DetailItem label="Address" value={application.address} />
              <DetailItem label="Pincode" value={application.pincode} />
              <DetailItem label="State" value={application.state} />
              <DetailItem label="Country" value={application.country} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <DetailItem label="Website" value={application.websiteLink} />
              <DetailItem label="YouTube" value={application.youtubeLink} />
              <DetailItem label="Instagram" value={application.instagramUrl} />
              <DetailItem label="Facebook" value={application.facebookUrl} />
              <DetailItem label="LinkedIn" value={application.linkedinUrl} />
              <DetailItem label="Total Releases" value={application.totalReleases} />
              <DetailItem label="Release Frequency" value={application.releaseFrequency} />
              <DetailItem label="Monthly Plans" value={application.monthlyReleasePlans} />
            </div>
            <div className="space-y-4 mb-6">
              <DetailItem
                label="Popular Release Links"
                value={application.popularReleaseLinks?.join(", ")}
              />
              <DetailItem
                label="Popular Artist Links"
                value={application.popularArtistLinks?.join(", ")}
              />
              <DetailItem
                label="Associated Labels"
                value={application.associatedLabels?.join(", ")}
              />
              <DetailItem
                label="Brief Info"
                value={application.briefInfo}
              />
              <DetailItem
                label="Additional Services"
                value={application.additionalServices?.join(", ")}
              />
               <DetailItem
                label="How did you know about us?"
                value={application.howDidYouKnow}
              />
              {application.howDidYouKnow === "other" && (
                <DetailItem
                  label="Other Source"
                  value={application.howDidYouKnowOther}
                />
              )}
            </div>

            {(application.reviewedAt || application.reviewedBy || application.isAccountCreated) && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 pt-4 border-t border-gray-800">
                <DetailItem label="Account Created" value={application.isAccountCreated ? "Yes" : "No"} />
                {application.reviewedAt && (
                  <DetailItem label="Reviewed Date" value={new Date(application.reviewedAt).toLocaleDateString()} />
                )}
                {application.reviewedBy && (
                  <DetailItem label="Reviewed By" value={`${application.reviewedBy.firstName || ""} ${application.reviewedBy.lastName || ""}`} />
                )}
              </div>
            )}

            {isPending && (
              <div className="space-y-2">
                <label htmlFor="adminNotes" className="text-sm font-medium">
                  Admin Notes
                </label>
                <Textarea
                  id="adminNotes"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add internal notes for this application..."
                  className="bg-[#1A242C] border-gray-700 text-gray-200"
                />
              </div>
            )}

            {!isPending && application.adminNotes && (
              <div className="space-y-2 mt-4">
                <label className="text-sm font-medium">
                  Admin Notes (Read-only)
                </label>
                <Textarea
                  value={application.adminNotes}
                  readOnly
                  className="bg-[#1A242C] border-gray-700 text-gray-200"
                />
              </div>
            )}

            {isPending && (
              <div className="flex justify-end gap-4 mt-6">
                <Button
                  variant="outline"
                  onClick={() => handleReview("rejected")}
                  disabled={isSubmitting}
                  className="border-red-500 text-red-500 hover:bg-red-500/10 hover:text-red-400"
                >
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Reject'}
                </Button>
                <Button
                  onClick={() => handleReview("approved")}
                  disabled={isSubmitting}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Approve'}
                </Button>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
