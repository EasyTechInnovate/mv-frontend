import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import GlobalApi from "@/lib/GlobalApi";

const toTitleCase = (str) =>
  str
    ? String(str)
        .toLowerCase()
        .split("_")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ")
    : "—";

export default function PlaylistPitchingReviewModal({
  isOpen,
  onClose,
  data,
  theme,
  refreshList,
}) {
  const [notes, setNotes] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [loading, setLoading] = useState(false);
  const isDark = theme === "dark";

  useEffect(() => {
    if (isOpen && data) {
      setNotes(data?.adminNotes || "");
      setRejectionReason(data?.rejectionReason || "");
    }
  }, [data, isOpen]);

  if (!isOpen || !data) return null;

  const bg = isDark ? "bg-[#111A22]" : "bg-white";
  const border = isDark ? "border-gray-700" : "border-gray-200";
  const text = isDark ? "text-gray-200" : "text-gray-800";
  const subtext = isDark ? "text-gray-400" : "text-gray-600";

  const Info = ({ label, value }) =>
    value ? (
      <div>
        <div className="text-xs text-gray-400 mb-1">{label}</div>
        <div className="text-sm font-medium break-words">{value}</div>
      </div>
    ) : null;

  const handleReview = async (action) => {
    if (loading) return;
    if (action === "reject" && !rejectionReason.trim()) {
      toast.warning("Please provide a rejection reason before rejecting.");
      return;
    }

    try {
      setLoading(true);

      await GlobalApi.reviewPlayPitching(data._id, {
        action,
        adminNotes: notes?.trim() || "",
        rejectionReason: action === "reject" ? rejectionReason.trim() : undefined,
      });

      toast.success(
        `Playlist pitching submission ${
          action === "approve" ? "approved" : "rejected"
        } successfully.`
      );

      refreshList?.();
      setNotes("");
      setRejectionReason("");
      onClose();
    } catch (err) {
      console.error("❌ Error submitting review:", err);
      toast.error(
        err?.response?.data?.message ||
          "Error submitting review. Check console for details."
      );
    } finally {
      setLoading(false);
    }
  };

  const statusColors = {
    approved: "bg-green-100 text-green-700 border-green-300",
    rejected: "bg-red-100 text-red-700 border-red-300",
    pending: "bg-yellow-100 text-yellow-700 border-yellow-300",
  };

  const statusLabel = data?.status ? toTitleCase(data.status) : "Pending";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        className={`relative z-10 w-full max-w-3xl rounded-xl border shadow-xl overflow-hidden ${bg} ${border}`}
      >
        
        <div className={`flex items-start justify-between px-6 py-4 border-b ${border}`}>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg font-semibold">
                Playlist Pitch Review — {toTitleCase(data?.trackName)}
              </h2>
              {data?.status && (
                <span
                  className={`text-xs px-2 py-1 rounded-full border font-medium ${
                    statusColors[data.status] || statusColors.pending
                  }`}
                >
                  {statusLabel}
                </span>
              )}
            </div>
            <p className={`text-sm ${subtext}`}>
              Review details carefully before approving or rejecting this submission.
            </p>
          </div>
          <button
            onClick={() => {
              setNotes("");
              setRejectionReason("");
              onClose();
            }}
            className={`rounded-md p-1 hover:bg-gray-700/20 ${
              isDark ? "text-gray-300" : "text-gray-600"
            }`}
          >
            <X size={18} />
          </button>
        </div>

        
        <div className={`px-6 py-5 max-h-[70vh] overflow-y-auto ${text}`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 mb-6">
            <Info label="Track Name" value={data?.trackName} />
            <Info label="Artist Name" value={data?.artistName} />
            <Info label="Label Name" value={data?.labelName} />
            <Info label="ISRC" value={data?.isrc} />
            <Info label="Genres" value={data?.genres?.join(", ")} />
            <Info label="Mood" value={data?.mood} />
            <Info label="Language" value={data?.language} />
            <Info label="Theme" value={data?.theme} />
            <Info label="Vocals Present" value={data?.isVocalsPresent ? "Yes" : "No"} />
            <Info label="Store" value={data?.selectedStore} />
            <Info
              label="Track Links"
              value={
                data?.trackLinks?.length > 0 ? (
                  <div className="flex flex-col space-y-1">
                    {data.trackLinks.map((link, index) => (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 underline flex items-center gap-1"
                      >
                        {link.platform || "Link"}: {link.url}
                      </a>
                    ))}
                  </div>
                ) : (
                  "—"
                )
              }
            />
            <Info label="Account ID" value={data?.userId?.accountId} />
          </div>

          
          <div className="pt-2">
            <label
              className={`block mb-2 text-sm font-medium ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Admin Review Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter your review notes..."
              disabled={data?.status !== "pending"}
              className={`w-full resize-none min-h-[80px] rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
                isDark
                  ? "bg-[#0E141B] border-gray-700 text-gray-100 focus:ring-cyan-500"
                  : "bg-white border-gray-300 text-gray-800 focus:ring-blue-500"
              } ${data?.status !== "pending" ? "opacity-70 cursor-not-allowed" : ""}`}
            />
          </div>

          
          {data?.status === "pending" && (
            <div className="pt-4">
              <label
                className={`block mb-2 text-sm font-medium ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Rejection Reason (required if rejecting)
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Enter reason for rejection..."
                className={`w-full resize-none min-h-[80px] rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
                  isDark
                    ? "bg-[#0E141B] border-gray-700 text-gray-100 focus:ring-red-500"
                    : "bg-white border-gray-300 text-gray-800 focus:ring-red-500"
                }`}
              />
            </div>
          )}

          
          {data?.status === "rejected" && data?.rejectionReason && (
            <div className="pt-4">
              <label
                className={`block mb-2 text-sm font-medium ${
                  isDark ? "text-red-400" : "text-red-600"
                }`}
              >
                Rejection Reason
              </label>
              <div
                className={`p-3 rounded-md text-sm border ${
                  isDark
                    ? "bg-[#1B252E] border-red-800 text-red-200"
                    : "bg-red-50 border-red-200 text-red-700"
                }`}
              >
                {data.rejectionReason}
              </div>
            </div>
          )}
        </div>

        
        {data?.status === "pending" ? (
          <div className={`flex gap-3 px-6 py-4 border-t ${border}`}>
            <button
              disabled={loading}
              onClick={() => handleReview("approve")}
              className="flex-1 rounded-md bg-green-600 hover:bg-green-700 text-white font-medium py-2 transition-colors disabled:opacity-50"
            >
              ✓ {loading ? "Processing..." : "Approve"}
            </button>
            <button
              disabled={loading}
              onClick={() => handleReview("reject")}
              className="flex-1 rounded-md bg-red-600 hover:bg-red-700 text-white font-medium py-2 transition-colors disabled:opacity-50"
            >
              ✕ {loading ? "Processing..." : "Reject"}
            </button>
          </div>
        ) : (
          <div
            className={`px-6 py-3 border-t ${border} text-sm text-gray-500 italic text-center`}
          >
            This submission has already been {data?.status}.
          </div>
        )}
      </div>
    </div>
  );
}
