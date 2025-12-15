import { useEffect, useState } from "react";
import GlobalApi from "@/lib/GlobalApi";
import {
  X,
  Check,
  XCircle,
  Instagram,
  Facebook,
  Music,
  Youtube,
  Loader2,
} from "lucide-react";


const PRODUCT_LABELS = {
  t_shirt: "T-Shirt",
  hoodie: "Hoodie",
  sipper_bottle: "Sipper Bottle",
  posters: "Posters",
  tote_bags: "Tote Bags",
  stickers: "Stickers",
  other: "Other",
};

const STATUS_LABELS = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
  design_pending: "Design Pending",
  design_submitted: "Design Submitted",
  design_approved: "Design Approved",
  design_rejected: "Design Rejected",
};

const STATUS_STYLES = {
  pending: "bg-yellow-500/20 text-yellow-400",
  approved: "bg-green-500/20 text-green-400",
  rejected: "bg-red-500/20 text-red-400",
  design_pending: "bg-blue-500/20 text-blue-400",
  design_submitted: "bg-purple-500/20 text-purple-400",
  design_approved: "bg-green-500/20 text-green-400",
  design_rejected: "bg-red-500/20 text-red-400",
};



export default function MerchStoreViewModal({
  open,
  onClose,
  storeId,
  theme,
}) {
  const [loading, setLoading] = useState(false);
  const [store, setStore] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [actionType, setActionType] = useState(null);

  useEffect(() => {
    if (!open || !storeId) return;

    const fetchStore = async () => {
      try {
        setLoading(true);
        const res = await GlobalApi.getMerchStoreById(storeId);
        setStore(res.data.data);
      } catch (err) {
        console.error("Failed to fetch merch store", err);
      } finally {
        setLoading(false);
      }
    };

    setAdminNotes("");
    setRejectionReason("");
    setActionType(null);

    fetchStore();
  }, [open, storeId]);

  if (!open) return null;


  const modalBg =
    theme === "dark" ? "bg-[#151F28] text-white" : "bg-white text-black";

  const sectionBg =
    theme === "dark"
      ? "bg-[#111A22] border-gray-700"
      : "bg-gray-100 border-gray-300";

  const mutedText =
    theme === "dark" ? "text-gray-400" : "text-gray-500";

  const borderColor =
    theme === "dark" ? "border-gray-700" : "border-gray-300";

  const infoBox = `rounded-xl p-4 border ${sectionBg}`;

  const isPending = store?.status === "pending";

  const handleStatusUpdate = async (status) => {
    try {
      setActionLoading(true);

      await GlobalApi.updateMerchStoreStatus(store._id, {
        status,
        adminNotes: status === "approved" ? adminNotes : null,
        rejectionReason: status === "rejected" ? rejectionReason : null,
      });

      onClose();
    } catch (err) {
      console.error("Failed to update merch store status", err);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4">
      <div
        className={`w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-xl ${modalBg} flex flex-col`}
      >
        <div className="px-6 py-4 border-b flex justify-between items-start">
          <div>
            <h2 className="text-xl font-semibold">Merch Store Request</h2>

            {store?.status && (
              <span
                className={`inline-block mt-2 px-3 py-1 text-xs rounded-full ${STATUS_STYLES[store.status]}`}
              >
                {STATUS_LABELS[store.status]}
              </span>
            )}
          </div>

          <button onClick={onClose} className={`${mutedText}`}>
            <X />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6 text-sm custom-scrollbar">
          {loading && (
            <p className={`${mutedText}`}>Loading details…</p>
          )}

          {!loading && store && (
            <>
            
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className={infoBox}>
                  <p className={`${mutedText} text-xs mb-1`}>Artist Name</p>
                  <p className="font-medium">
                    {store.artistInfo?.artistName}
                  </p>
                </div>

                <div className={infoBox}>
                  <p className={`${mutedText} text-xs mb-1`}>Account ID</p>
                  <p className="font-medium">{store.accountId}</p>
                </div>

                <div className={infoBox}>
                  <p className={`${mutedText} text-xs mb-1`}>User Name</p>
                  <p className="font-medium">
                    {store.userId?.firstName} {store.userId?.lastName}
                  </p>
                </div>

                <div className={infoBox}>
                  <p className={`${mutedText} text-xs mb-1`}>Email</p>
                  <p className="font-medium">
                    {store.userId?.emailAddress}
                  </p>
                </div>
              </div>

              <div className={infoBox}>
                <p className={`${mutedText} text-xs mb-2`}>Artist Links</p>

                <div className="flex flex-wrap gap-4">
                  {store.artistInfo?.instagramLink && (
                    <a
                      href={store.artistInfo.instagramLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-pink-500"
                    >
                      <Instagram size={16} /> Instagram
                    </a>
                  )}

                  {store.artistInfo?.facebookLink && (
                    <a
                      href={store.artistInfo.facebookLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-500"
                    >
                      <Facebook size={16} /> Facebook
                    </a>
                  )}

                  {store.artistInfo?.spotifyProfileLink && (
                    <a
                      href={store.artistInfo.spotifyProfileLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-green-500"
                    >
                      <Music size={16} /> Spotify
                    </a>
                  )}

                  {store.artistInfo?.youtubeMusicProfileLink && (
                    <a
                      href={store.artistInfo.youtubeMusicProfileLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-red-500"
                    >
                      <Youtube size={16} /> YouTube Music
                    </a>
                  )}
                </div>
              </div>

              <div className={infoBox}>
                <p className={`${mutedText} text-xs mb-2`}>
                  Product Preferences
                </p>

                <div className="flex flex-wrap gap-2">
                  {store.productPreferences?.selectedProducts?.length
                    ? store.productPreferences.selectedProducts.map((p) => (
                        <span
                          key={p}
                          className="px-3 py-1 text-xs rounded-full bg-gray-800/30"
                        >
                          {PRODUCT_LABELS[p] || p}
                        </span>
                      ))
                    : "—"}
                </div>
              </div>

              {isPending && (
                <div className={infoBox}>
                  <p className={`${mutedText} text-xs mb-2`}>
                    {actionType === "reject"
                      ? "Rejection Reason"
                      : "Admin Notes"}
                  </p>

                  <textarea
                    rows={4}
                    value={
                      actionType === "reject"
                        ? rejectionReason
                        : adminNotes
                    }
                    onChange={(e) =>
                      actionType === "reject"
                        ? setRejectionReason(e.target.value)
                        : setAdminNotes(e.target.value)
                    }
                    placeholder={
                      actionType === "reject"
                        ? "Explain why this request is being rejected"
                        : "Internal notes or next steps for the artist"
                    }
                    className={`w-full rounded-lg p-3 resize-none outline-none ${
                      theme === "dark"
                        ? "bg-[#0F172A] text-white"
                        : "bg-white border"
                    }`}
                  />
                </div>
              )}
            </>
          )}
        </div>

        {isPending && (
          <div
            className={`px-6 py-4 border-t ${borderColor} flex justify-end gap-3`}
          >
            <button
              disabled={actionLoading}
              onClick={() => {
                setActionType("reject");
                handleStatusUpdate("rejected");
              }}
              className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              {actionLoading && actionType === "reject" ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <XCircle size={16} />
              )}
              Reject
            </button>

            <button
              disabled={actionLoading}
              onClick={() => {
                setActionType("approve");
                handleStatusUpdate("approved");
              }}
              className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              {actionLoading && actionType === "approve" ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Check size={16} />
              )}
              Approve
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
