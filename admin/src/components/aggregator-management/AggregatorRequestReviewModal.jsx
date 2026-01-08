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
      toast.error(`Failed to ${status} application.`);
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isPending = application?.applicationStatus === "pending";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-[#111A22] border-gray-800 text-white">
        <DialogHeader>
          <DialogTitle>Aggregator Application Review</DialogTitle>
          <DialogDescription>
            Review the details of the aggregator application below.
          </DialogDescription>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <DetailItem label="Website" value={application.websiteLink} />
              <DetailItem label="YouTube" value={application.youtubeLink} />
              <DetailItem label="Instagram" value={application.instagramUrl} />
              <DetailItem label="Facebook" value={application.facebookUrl} />
            </div>
            <div className="space-y-4 mb-6">
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
            </div>

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
