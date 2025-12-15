import { useEffect, useState } from "react";
import GlobalApi from "@/lib/GlobalApi";
import {
  Search,
  Download,
  Check,
  X,
  Eye,
  Users,
  Clock,
  CheckCircle,
} from "lucide-react";
import DesignRequestTable from "../../components/merch-store-management/MerchRequestTable";
import MerchStoreViewModal from "@/components/merch-store-management/MerchStoreViewModal";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import ConfirmDialog from "@/components/common/ConfirmDialog";

const statusColors = {
  Pending: "bg-yellow-900/30 text-yellow-400",
  Approved: "bg-green-900/30 text-green-400",
  "Under Review": "bg-blue-900/30 text-blue-400",
  Rejected: "bg-red-900/30 text-red-400",
};

const PRODUCT_LABELS = {
  t_shirt: "T-Shirt",
  hoodie: "Hoodie",
  sipper_bottle: "Sipper Bottle",
  posters: "Posters",
  tote_bags: "Tote Bags",
  stickers: "Stickers",
  other: "Other",
};

const CHANNEL_LABELS = {
  instagram: "Instagram",
  youtube: "YouTube",
  email_newsletter: "Email Newsletter",
  live_events: "Live Events",
  other: "Other",
};

const STATUS_LABELS = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
  design_pending: "Design Pending",
  design_submitted: "Under Review",
  design_approved: "Design Approved",
  design_rejected: "Design Rejected",
};


export default function MerchStoreManagement({ theme }) {
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState("approval");
  const [selectedRequest, setSelectedRequest] = useState(null);
const [isViewModalOpen, setIsViewModalOpen] = useState(false);
const [deleteId, setDeleteId] = useState(null);
const [isDeleting, setIsDeleting] = useState(false);



  const [page, setPage] = useState(1);
  const limit = 10;

  const boxBg =
    theme === "dark"
      ? "bg-[#151F28] border border-gray-800"
      : "bg-white border border-gray-200";
  const inputBg =
    theme === "dark"
      ? "bg-[#151F28] text-gray-200 border border-gray-700"
      : "bg-white text-gray-800 border border-gray-300";
  const softBtn =
    theme === "dark"
      ? "bg-gray-800 hover:bg-gray-700 text-white"
      : "bg-gray-200 hover:bg-gray-300 text-[#111A22]";

  
const fetchData = async () => {
  try {
    const res = await GlobalApi.getAllMerchStores(page, limit);
    const merch = res.data.data.merchStores || [];

    const formatted = {
      stats: {
        totalRequests: merch.length,
        pending: merch.filter((m) => m.status === "pending").length,
        approved: merch.filter((m) => m.status === "approved").length,
        underReview: merch.filter((m) => m.status === "design_submitted").length,
      },

      approvalRequests: merch.map((item) => {
        // ⭐ FIX → show only ONE product
        const formattedProducts =
          PRODUCT_LABELS[item.productPreferences?.selectedProducts?.[0]] ||
          item.productPreferences?.selectedProducts?.[0] ||
          "—";

        // Channels also keep SINGLE value (first)
        const formattedChannels =
          CHANNEL_LABELS[item.marketingPlan?.promotionChannels?.[0]] ||
          item.marketingPlan?.promotionChannels?.[0] ||
          "—";

        const statusMap = {
          pending: "Pending",
          approved: "Approved",
          rejected: "Rejected",
          design_pending: "Design Pending",
          design_submitted: "Under Review",
          design_approved: "Design Approved",
          design_rejected: "Design Rejected",
        };

        return {
          id: item._id,
          artist: item.artistInfo?.artistName ?? "N/A",
          product: formattedProducts,
          marketingPlan: item.marketingPlan?.planToPromote
            ? "True"
            : "False",
          channel: formattedChannels,
          mmcAssist: item.marketingPlan?.mmcMarketingAssistance ? "Yes" : "No",
          status: statusMap[item.status] || item.status,
          date: new Date(item.createdAt).toLocaleDateString(),
        };
      }),

      designRequests: merch
        .filter((m) => m.status === "design_submitted")
        .map((item) => ({
          id: item._id,
          artist: item.artistInfo?.artistName,
          accountId: item.accountId,
          designs: item.designs,
          submittedAt: item.designsSubmittedAt,
          notes: item.adminNotes ?? "",
        })),
    };

    setData(formatted);
  } catch (err) {
    console.error("Failed to load merch stores", err);
  }
};



  useEffect(() => {
    fetchData();
  }, [page]);

  if (!data)
    return (
      <div
        className={`${
          theme === "dark"
            ? "text-gray-400 bg-gray-950"
            : "text-gray-700 bg-gray-100"
        } text-center p-10`}
      >
        Loading Merch Store Management...
      </div>
    );

    const handleDelete = async () => {
  if (!deleteId) return;

  try {
    setIsDeleting(true);
    await GlobalApi.deleteMerchStore(deleteId);

    toast.success("Merch store deleted successfully");

    setData((prev) => ({
      ...prev,
      approvalRequests: prev.approvalRequests.filter(
        (item) => item.id !== deleteId
      ),
      stats: {
        ...prev.stats,
        totalRequests: prev.stats.totalRequests - 1,
      },
    }));
  } catch (error) {
    console.error("Delete failed", error);
    toast.error("Failed to delete merch store");
  } finally {
    setIsDeleting(false);
    setDeleteId(null);
  }
};


  return (
    <div
      className={`${
        theme === "dark"
          ? "bg-[#111A22] text-white"
          : "bg-gray-100 text-black"
      } min-h-screen p-4 sm:p-6 rounded-2xl`}
    >
      <h1 className="text-2xl font-semibold mb-1">Merch Store Management</h1>
      <p className="text-gray-400 text-xs sm:text-sm mb-6">
        Manage merchandise store requests and approvals from users
      </p>

      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className={`${boxBg} p-4 rounded-2xl shadow relative`}>
          <span className="absolute top-4 right-4 text-gray-400">
            <Users className="h-5 w-5" />
          </span>
          <p className="text-gray-400 text-sm">Total Requests</p>
          <p className="text-2xl font-bold">{data.stats.totalRequests}</p>
        </div>

        <div className={`${boxBg} p-4 rounded-2xl shadow relative`}>
          <span className="absolute top-4 right-4 text-yellow-400">
            <Clock className="h-5 w-5" />
          </span>
          <p className="text-gray-400 text-sm">Pending</p>
          <p className="text-2xl font-bold text-yellow-400">{data.stats.pending}</p>
        </div>

        <div className={`${boxBg} p-4 rounded-2xl shadow relative`}>
          <span className="absolute top-4 right-4 text-green-400">
            <CheckCircle className="h-5 w-5" />
          </span>
          <p className="text-gray-400 text-sm">Approved</p>
          <p className="text-2xl font-bold text-green-400">{data.stats.approved}</p>
        </div>

        <div className={`${boxBg} p-4 rounded-2xl shadow relative`}>
          <span className="absolute top-4 right-4 text-blue-400">
            <Search className="h-5 w-5" />
          </span>
          <p className="text-gray-400 text-sm">Under Review</p>
          <p className="text-2xl font-bold text-blue-400">
            {data.stats.underReview}
          </p>
        </div>
      </div>

      
      <div className={`flex ${theme === "dark" ? "border-gray-700" : "border-gray-300"} border-b mb-4`}>
        {["approval", "design", "listed"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === tab
                ? "border-b-2 border-purple-500 text-purple-500"
                : "text-gray-400"
            }`}
          >
            {tab === "approval"
              ? "Approval Request"
              : tab === "design"
              ? "Design Request"
              : "Listed Product"}
          </button>
        ))}
      </div>

      
      {activeTab === "approval" && (
        <div className={`${boxBg} overflow-x-auto rounded-2xl shadow`}>
          <table className="w-full text-sm">
            <thead
              className={`${
                theme === "dark" ? "bg-[#151F28]" : "bg-gray-100"
              } ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
            >
              <tr>
                <th className="px-4 py-3 text-left">Artist’s Label Name</th>
                <th className="px-4 py-3 text-left">Product Preferences</th>
                <th className="px-4 py-3 text-left">Marketing & Launch Plan</th>
                <th className="px-4 py-3 text-left">Channel</th>
                <th className="px-4 py-3 text-left">MMC Assist</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Submit Date</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {data.approvalRequests.map((req) => (
                <tr
                  key={req.id}
                  className={`${
                    theme === "dark" ? "border-gray-800" : "border-gray-200"
                  } border-t ${theme === "dark" ? "hover:bg-gray-800/40" : "hover:bg-gray-50"}`}
                >
                  <td className="px-4 py-3">{req.artist}</td>
                  <td className="px-4 py-3">{req.product}</td>
                  <td className="px-4 py-3">{req.marketingPlan}</td>
                  <td className="px-4 py-3">{req.channel}</td>
                  <td className="px-4 py-3">{req.mmcAssist}</td>

                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${statusColors[req.status]}`}>
                      {req.status}
                    </span>
                  </td>

                  <td className="px-4 py-3">{req.date}</td>

                <td className="px-4 py-3 flex gap-2">
  <button
    onClick={() => {
      setSelectedRequest(req.id);
      setIsViewModalOpen(true);
    }}
    className={`${softBtn} px-2 py-1 rounded flex items-center gap-1 text-xs`}
  >
    <Eye size={12} /> View
  </button>

  <button
    onClick={() => setDeleteId(req.id)}
    className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded flex items-center gap-1 text-xs"
  >
    <Trash2 size={12} /> Delete
  </button>
</td>

                </tr>
              ))}
            </tbody>
          </table>

          
          <div className="flex justify-between items-center px-4 py-3">
            <button
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              className={`px-3 py-1 rounded ${
                page <= 1 ? "opacity-50 cursor-not-allowed" : softBtn
              }`}
            >
              Previous
            </button>

            <span className="text-sm text-gray-400">Page {page}</span>

            <button
              onClick={() => setPage(page + 1)}
              className={`${softBtn} px-3 py-1 rounded`}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* DESIGN REQUEST TABLE */}
      {activeTab === "design" && (
        <DesignRequestTable theme={theme} data={data.designRequests} />
      )}

      {/* LISTED PRODUCTS PLACEHOLDER */}
      {activeTab === "listed" && (
        <div
          className={`${boxBg} rounded-2xl p-6 text-center ${
            theme === "dark" ? "text-gray-400" : "text-gray-500"
          }`}
        >
          Listed Product Section (Coming Soon)
        </div>
      )}

      <MerchStoreViewModal
  open={isViewModalOpen}
  onClose={() => {
    setIsViewModalOpen(false);
    setSelectedRequest(null);
  }}
  storeId={selectedRequest}
  theme={theme}
/>

{deleteId && (
  <ConfirmDialog
    title="Delete Merch Store"
    message="Are you sure you want to delete this merch store request? This action cannot be undone."
    confirmLabel="Delete"
    cancelLabel="Cancel"
    loading={isDeleting}
    theme={theme}
    onCancel={() => setDeleteId(null)}
    onConfirm={handleDelete}
  />
)}


    </div>
  );
}
