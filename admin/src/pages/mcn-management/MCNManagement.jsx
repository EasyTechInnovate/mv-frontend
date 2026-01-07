import React, { useMemo, useState, useEffect } from "react";
import { Upload, Download, Search, Info, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import ActiveChannelTable from "../../components/mcn-management/MCNActiveChannel";
import { motion, AnimatePresence } from "framer-motion";
import MCNInfoForm from "../../components/mcn-management/MCNUserForm";
import GlobalApi from "@/lib/GlobalApi";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import MCNRequestViewModal from "../../components/mcn-management/MCNReviewModal";
import UpdateMCNChannelStatusModal from "../../components/mcn-management/UpdateMCNChannelStatusModal";
import CreateMCNChannelModal from "../../components/mcn-management/CreateMCNChannel"; // Import CreateMCNChannelModal
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

const StatusBadge = ({ status }) => {
  const statusConfig = {
    pending: "bg-yellow-500/20 text-yellow-500",
    approved: "bg-green-500/20 text-green-500",
    active: "bg-green-500/20 text-green-500",
    rejected: "bg-red-500/20 text-red-500",
    removal_requested: "bg-orange-500/20 text-orange-500",
    removal_approved: "bg-purple-500/20 text-purple-400",
    inactive: "bg-gray-500/20 text-gray-400",
    suspended: "bg-red-700/20 text-red-500",
  };
  const normalizedStatus = status?.toLowerCase().replace(/ /g, '_');
  const className = statusConfig[normalizedStatus] || "bg-gray-500/20 text-gray-400";
  
  return (
    <Badge className={className}>
      {status?.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
    </Badge>
  );
};

const PaginationControls = ({ pagination, onPageChange, isDark }) => {
    if (!pagination || !pagination.totalPages || pagination.totalPages <= 1) {
        return null;
    }

    const { currentPage, totalPages, totalCount } = pagination;
    const itemsPerPage = 10; // Assuming limit is 10

    return (
        <div className="flex items-center justify-between mt-6">
          <div className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount} results
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`${isDark ? "bg-[#151F28] border-gray-700" : ""}`}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>
            <div className="flex gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <Button
                    key={pageNum}
                    variant={pageNum === currentPage ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onPageChange(pageNum)}
                    className={pageNum === currentPage ? `bg-purple-600 hover:bg-purple-700 ${isDark ? "text-white" : ""}` : (isDark ? "text-white bg-[#151F28] border-gray-700" : "")}
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`${isDark ? "bg-[#151F28] border-gray-700" : ""}`}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
    );
};

const ChannelDetailsModal = ({ channel, open, onClose, theme }) => {
  if (!channel) return null;
  const isDark = theme === "dark";
  const cardBg = isDark ? "bg-[#151F28]" : "bg-white";
  const borderColor = isDark ? "border-[#12212a]" : "border-gray-300";
  const textColor = isDark ? "text-gray-300" : "text-[#151F28]";
  const textMuted = isDark ? "text-gray-400" : "text-gray-600";

  const DetailItem = ({ label, value }) => (
    <div>
      <p className={`text-sm ${textMuted}`}>{label}</p>
      <p className={`font-medium ${textColor}`}>{value ?? "N/A"}</p>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className={`max-w-4xl rounded-xl ${cardBg} border ${borderColor} p-6`}>
        <DialogHeader>
          <DialogTitle className={`text-lg font-semibold ${textColor}`}>
            Channel Details
          </DialogTitle>
          <DialogDescription className={textMuted}>
            Details for active channel: {channel?.channelName}
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6 py-4 max-h-[70vh] overflow-y-auto">
          <DetailItem label="Channel Name" value={channel?.channelName} />
          <DetailItem label="Account ID" value={channel?.userAccountId} />
          <DetailItem label="Account Name" value={`${channel?.userId?.firstName || ''} ${channel?.userId?.lastName || ''}`} />
          
          <div>
            <p className={`text-sm ${textMuted}`}>Channel Link</p>
            <a 
              href={channel?.channelLink } 
              target="_blank" 
              rel="noopener noreferrer" 
              title={channel?.channelLink }
              className={`font-medium text-purple-400 hover:underline truncate block`}
            >
              {channel?.channelLink  || "N/A"}
            </a>
          </div>
          <div>
            <p className={`text-sm ${textMuted}`}>Channel Id</p>
            <a 
              href={ channel?.youtubeChannelId} 
              target="_blank" 
              rel="noopener noreferrer" 
              title={ channel?.youtubeChannelId}
              className={`font-medium text-purple-400 hover:underline truncate block`}
            >
              { channel?.youtubeChannelId || "N/A"}
            </a>
          </div>

          <DetailItem label="Revenue Share" value={channel?.revenueShare ? `${channel.revenueShare}%` : "N/A"} />
          <DetailItem label="Channel Manager" value={channel?.channelManager} />
          <DetailItem label="Status" value={channel?.status} />
          <DetailItem label="Monthly Revenue" value={channel?.monthlyRevenue ? `$${channel.monthlyRevenue}`: "$0"} />
          <DetailItem label="Total Revenue" value={channel?.totalRevenue ? `$${channel.totalRevenue}`: "$0"} />
          <DetailItem label="Joined Date" value={channel?.joinedDate ? new Date(channel.joinedDate).toLocaleDateString() : 'N/A'} />
          
          {channel?.lastRevenueUpdate && <DetailItem label="Last Revenue Update" value={new Date(channel.lastRevenueUpdate).toLocaleDateString()} />}
          {channel?.notes && <DetailItem label="Notes" value={channel.notes} />}
          {channel?.suspendedAt && <DetailItem label="Suspended At" value={new Date(channel.suspendedAt).toLocaleDateString()} />}
          {channel?.suspensionReason && <DetailItem label="Suspension Reason" value={channel.suspensionReason} />}
          {channel?.reactivatedAt && <DetailItem label="Reactivated At" value={new Date(channel.reactivatedAt).toLocaleDateString()} />}
        </div>
      </DialogContent>
    </Dialog>
  );
};


export default function MCNManagement({ theme = "dark" }) {
  const isDark = theme === "dark";
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("request");
  
  // New state for filters and pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState(""); // "" for all
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  // State for modals and side effects
  const [selectedUser, setSelectedUser] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [isChannelModalOpen, setIsChannelModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  // States for CreateMCNChannelModal
  const [isCreateChannelModalOpen, setIsCreateChannelModalOpen] = useState(false);
  const [newChannel, setNewChannel] = useState(null);
  
  // State for stats cards
  const [stats, setStats] = useState(null);
  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      if(currentPage !== 1) setCurrentPage(1); // Reset page on new search, only if not already 1
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchStats = async () => {
    try {
      const res = await GlobalApi.getMcnStats();
      setStats(res?.data?.data || null);
    } catch (err) {
      console.error("❌ Error fetching MCN stats:", err);
      toast.error(err?.response?.data?.message || err?.message || "Failed to fetch stats");
      setStats(null);
    }
  };

  const fetchRequests = async () => {
    setLoading(true);
    setProcessing(false);
    try {
      const params = {
        page: currentPage,
        limit: 10,
        status: status || undefined,
        search: debouncedSearch || undefined,
      };
      const res = await GlobalApi.getMcnRequests(params);
      const apiData = res?.data?.data;
      setRows(apiData?.requests || []);
      setPagination(apiData?.pagination || null);
    } catch (err) {
      console.error("❌ Error fetching MCN requests:", err);
      toast.error(err.response?.data?.message || err.message || "Failed to fetch requests");
      setRows([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchChannels = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: 10,
        status: status || undefined,
        search: debouncedSearch || undefined,
      };
      const res = await GlobalApi.getMcnChannels(params);
      const apiData = res?.data?.data;
      setRows(apiData?.channels || []);
      setPagination(apiData?.pagination || null);
    } catch (err) {
      console.error("❌ Error fetching MCN channels:", err);
      toast.error(err.response?.data?.message || "Failed to fetch channels");
      setRows([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  };

  // Main data fetching effect
  useEffect(() => {
    if (activeTab === 'request') {
      fetchRequests();
    } else if (activeTab === 'active') {
      fetchChannels();
    }
  }, [activeTab, currentPage, debouncedSearch, status]);

  // Effect to reset filters and fetch stats on tab change
  useEffect(() => {
    setCurrentPage(1);
    setStatus("");
    setSearchTerm("");
    setPagination(null);
    setRows([]);
    fetchStats();
  }, [activeTab]);

  // Effect to handle new channel creation
  useEffect(() => {
    if (newChannel) {
      toast.success("MCN Channel added successfully!");
      fetchChannels(); // Refresh the list to include the new channel
      setNewChannel(null); // Clear newChannel state
    }
  }, [newChannel, activeTab]); // Added activeTab to dependencies, as fetchChannels depends on it

  const handleApprove = async (id, adminNotes) => {
    try {
      setProcessing(true);
      await GlobalApi.reviewMcnRequest(id, { action: "approve", adminNotes });
      toast.success("Request approved");
      await fetchRequests();
      setIsViewOpen(false);
    } catch (err) {
      console.error("❌ Approve error:", err);
      toast.error(err.response?.data?.message || "Failed to approve request");
      setProcessing(false);
    }
  };

  const handleReject = async (id, adminNotes, rejectionReason) => {
    if (!rejectionReason?.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }
    try {
      setProcessing(true);
      await GlobalApi.reviewMcnRequest(id, { action: "reject", adminNotes, rejectionReason });
      toast.success("Request rejected");
      await fetchRequests();
      setIsViewOpen(false);
    } catch (err) {
      console.error("❌ Reject error:", err);
      toast.error(err.response?.data?.message || "Failed to reject request");
      setProcessing(false);
    }
  };

  const handleViewChannel = (channel) => {
    setSelectedChannel(channel);
    setIsChannelModalOpen(true);
  };

  const formatINR = (n) =>
    typeof n === "number" ? `₹${n.toLocaleString("en-IN")}` : String(n || "-");





  const getTopStats = () => {

    const s = stats || {};
    const revenueFromRequests = s.revenue?.totalRevenue ?? 0;
    const requestsObj = s.requests || {};
    const channelsActive = s.channels?.active || {};
    const revenueChannelsActive = channelsActive.totalRevenue ?? 0;
    const countChannelsActive = channelsActive.count ?? 0;
    const avgRevenueShare = channelsActive.avgRevenueShare ?? 0;
    const totalChannels = s.revenue?.totalChannels ?? 0;

    if (activeTab === "active") {
      return [
        { label: "Active Channels", value: countChannelsActive },
        { label: "Total Revenue", value: revenueChannelsActive, highlight: true },
        { label: "Avg Revenue Share", value: `${avgRevenueShare !== null ? String(avgRevenueShare) : "-"}%` },
        { label: "Total Channels", value: totalChannels },
      ];
    }


    return [
      { label: "Approved", value: requestsObj.approved ?? 0 },
      { label: "Pending", value: requestsObj.pending ?? 0 },
      { label: "Rejected", value: requestsObj.rejected ?? 0 },
      { label: "Total Revenue", value: revenueFromRequests, highlight: true },
    ];
  };

  const topStats = getTopStats();

  const bgMain = isDark ? "bg-[#111A22] text-slate-300" : "bg-gray-50 text-[#151F28]";
  const cardBg = isDark ? "bg-[#151F28]" : "bg-white";
  const borderColor = isDark ? "border-[#12212a]" : "border-gray-300";
  const textColor = isDark ? "text-gray-300" : "text-[#151F28]";
  const textMuted = isDark ? "text-gray-400" : "text-gray-600";
  const inputBg = isDark
    ? "bg-[#111A22] border-[#12212a] text-slate-300"
    : "bg-white border-gray-300 text-[#111A22]";
  const tabActive = isDark ? "bg-gray-800 text-white" : "bg-gray-100 text-black";
  const tabInactive = isDark ? "bg-[#151F28] text-gray-300" : "bg-gray-200 text-gray-600";
  const rowHover = isDark ? "hover:bg-gray-800" : "hover:bg-gray-100";

  if (selectedUser) {
    return (
      <MCNInfoForm user={selectedUser} theme={theme} onBack={() => setSelectedUser(null)} />
    );
  }

  return (
    <div className={`${bgMain} min-h-screen p-4 md:p-6`}>
      <div className="max-w-[1200px] mx-auto space-y-6">

        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">MCN Management</h1>
            <p className={`text-sm ${textMuted}`}>
              Manage and analyze MCN requests and active channels
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => alert("Import CSV/Excel (mock)")}
              className={`px-3 py-2 rounded-md border ${borderColor} ${isDark ? "bg-transparent" : "bg-white"
                } text-sm inline-flex items-center gap-2`}
            >
              <Upload className="w-4 h-4" /> Import CSV/Excel
            </button>
            <button
              onClick={() => alert("Export Analytics (mock)")}
              className="px-4 py-2 rounded-full bg-gradient-to-r from-[#7c3aed] to-[#6d28d9] text-white text-sm inline-flex items-center gap-2 shadow"
            >
              <Download className="w-4 h-4" /> Export Analytics
            </button>
          </div>
        </div>


        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {topStats.map((item, idx) => {

            const isRevenueLabel = item.label.toLowerCase().includes("revenue");
            let displayValue = item.value;
            if (isRevenueLabel) {
              displayValue =
                typeof item.value === "number" ? formatINR(item.value) : String(item.value || "-");
            } else {

              if (typeof item.value === "number") {
                displayValue = item.value.toLocaleString("en-IN");
              } else {
                displayValue = String(item.value ?? "-");
              }
            }

            return (
              <div
                key={idx}
                className={`rounded-lg p-4 ${cardBg} border ${borderColor} shadow-sm`}
              >
                <div className="flex items-center justify-between">
                  <p className={`text-sm ${textMuted}`}>{item.label}</p>
                  {item.label === "Total Revenue" && (
                    <Info className="w-4 h-4 opacity-60" />
                  )}
                </div>
                <p
                  className={`text-2xl font-semibold mt-2 ${item.highlight ? "text-emerald-400" : textColor
                    }`}
                >
                  {displayValue}
                </p>
              </div>
            );
          })}
        </div>

        <div className={`rounded-md p-4 ${cardBg} border ${borderColor}`}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">

            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 opacity-60" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by channel, name, ID..."
                className={`pl-10 pr-3 py-2 w-full rounded-md text-sm border ${inputBg}`}
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  setCurrentPage(1);
                }}
                className={`text-sm px-3 py-2 rounded-md border ${inputBg}`}
              >
                <option value="">All Status</option>
                {activeTab === 'request' ? (
                  <>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="removal_requested">Removal Requested</option>
                    <option value="removal_approved">Removal Approved</option>
                  </>
                ) : (
                  <>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                  </>
                )}
              </select>

              <select className={`text-sm px-3 py-2 rounded-md border ${inputBg}`} defaultValue="">
                <option value="">Bulk Action</option>
                <option value="approve">Approve Selected</option>
                <option value="reject">Reject Selected</option>
                <option value="export">Export Selected</option>
              </select>
            </div>
          </div>
        </div>

        <div className="w-full flex justify-center">
          <div
            className={`inline-flex rounded-full overflow-hidden border ${borderColor} w-[500px]`}
          >
            <button
              onClick={() => setActiveTab("request")}
              className={`flex-1 py-2 text-sm font-medium ${activeTab === "request" ? tabActive : tabInactive
                }`}
            >
              Request
            </button>
            <button
              onClick={() => setActiveTab("active")}
              className={`flex-1 py-2 text-sm font-medium ${activeTab === "active" ? tabActive : tabInactive
                }`}
            >
              Active Channel
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "active" && (
            <motion.div
              key="active"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className={`rounded-xl p-6 ${cardBg} border ${borderColor} shadow-md`}
            >
              <div className="flex justify-end mb-4">
                <Button 
                  onClick={() => setIsCreateChannelModalOpen(true)} 
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  + Create MCN Channel
                </Button>
              </div>
              {loading ? (
                <div className="flex justify-center items-center py-12">
                    <Loader2 className="animate-spin h-6 w-6 mr-2" />
                    <p>Loading channels...</p>
                </div>
              ) : (
                <>
                  <ActiveChannelTable 
                    theme={theme} 
                    channels={rows}
                    onViewChannel={handleViewChannel}
                    onEditStatus={(channel) => {
                        setSelectedChannel(channel);
                        setIsStatusModalOpen(true);
                    }}
                  />
                  <PaginationControls pagination={pagination} onPageChange={setCurrentPage} isDark={isDark} />
                </>
              )}
            </motion.div>
          )}

          {activeTab === "request" && (
            <motion.div
              key="request"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className={`rounded-xl p-6 ${cardBg} border ${borderColor} shadow-md`}
            >
              {loading ? (
                <div className="flex justify-center items-center py-12">
                    <Loader2 className="animate-spin h-6 w-6 mr-2" />
                    <p>Loading requests...</p>
                </div>
              ) : (
                <>
                <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400">
                  <table className="min-w-[1000px] w-full text-sm table-auto border-collapse">
                    <thead className="text-gray-500">
                      <tr>
                        {[
                          "YouTube Channel Name",
                          "Account ID",
                          "Account Name",
                          "Subscribers",
                          "Submitted On",
                          "Total Views (28d)",
                          "AdSense Enabled?",
                          "Copyright Strikes?",
                          "100% Original",
                          "Another MCN?",
                          "Last Month Revenue",
                          "Monetization Eligibility",
                          "Status",
                          "Actions",
                        ].map((th, idx) => (
                          <th key={idx} className="text-left px-4 py-3 whitespace-nowrap">
                            {th}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {rows.length > 0 ? rows.map((r) => {
                        const fullName = r.userId ? `${r.userId.firstName} ${r.userId.lastName}`.trim() : "-";
                        return (
                        <tr key={r._id} className={`border-t ${borderColor} ${rowHover}`}>
                          <td className="px-4 py-3">{r.youtubeChannelName}</td>
                          <td className="px-4 py-3">{r.userAccountId || "-"}</td>
                          <td className="px-4 py-3">{fullName}</td>
                          <td className="px-4 py-3">{r.subscriberCount?.toLocaleString("en-IN")}</td>
                          <td className="px-4 py-3">{new Date(r.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</td>
                          <td className="px-4 py-3 text-center">{r.totalViewsCountsIn28Days?.toLocaleString("en-IN")}</td>
                          <td className="px-4 py-3 text-center">{r.isAdSenseEnabled ? "Yes" : "No"}</td>
                          <td className="px-4 py-3 text-center">{r.hasCopyrightStrikes ? "Yes" : "No"}</td>
                          <td className="px-4 py-3 text-center">{r.isContentOriginal ? "Yes" : "No"}</td>
                          <td className="px-4 py-3 text-center">{r.isPartOfAnotherMCN ? "Yes" : "No"}</td>
                          <td className="px-4 py-3 text-center">{r.channelRevenueLastMonth?.toLocaleString("en-IN")}</td>
                          <td className="px-4 py-3 text-center">
                            <span
                              className={`inline-block px-3 py-1 rounded-full text-xs ${r.monetizationEligibility
                                ? "bg-emerald-700/20 text-emerald-400"
                                : "bg-gray-300 text-gray-700"
                                }`}
                            >
                              {r.monetizationEligibility ? "Eligible" : "Not Eligible"}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <StatusBadge status={r.status} />
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              {r.status === "pending" ? (
                                <>
                                  <Button
                                    size="sm"
                                    className="bg-emerald-700 text-white"
                                    onClick={() => {
                                      setViewData({ ...r, mode: "approve" });
                                      setIsViewOpen(true);
                                    }}
                                  >
                                    Approve
                                  </Button>
                                  <Button
                                    size="sm"
                                    className="bg-red-700 text-white"
                                    onClick={() => {
                                      setViewData({ ...r, mode: "reject" });
                                      setIsViewOpen(true);
                                    }}
                                  >
                                    Reject
                                  </Button>
                                </>
                              ) : (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setViewData(r);
                                    setIsViewOpen(true);
                                  }}
                                >
                                  View
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}) : (
                        <tr>
                            <td colSpan={14} className="text-center py-10 text-gray-400">No requests found.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <PaginationControls pagination={pagination} onPageChange={setCurrentPage} isDark={isDark} />
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <MCNRequestViewModal
        open={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        data={viewData}
        theme={theme}
        onApprove={handleApprove}
        onReject={handleReject}
        processing={processing}
      />
      <ChannelDetailsModal 
        channel={selectedChannel}
        open={isChannelModalOpen}
        onClose={() => setIsChannelModalOpen(false)}
        theme={theme}
      />
      <UpdateMCNChannelStatusModal
        isOpen={isStatusModalOpen}
        onClose={(shouldRefresh) => {
          setIsStatusModalOpen(false);
          if (shouldRefresh) fetchChannels();
        }}
        channelId={selectedChannel?._id}
        currentStatus={selectedChannel?.status?.toLowerCase()}
      />
      {/* CreateMCNChannelModal */}
      <CreateMCNChannelModal
        isOpen={isCreateChannelModalOpen}
        onClose={(created) => {
          setIsCreateChannelModalOpen(false);
          if (created) setNewChannel(created);
        }}
        theme={theme}
        // channelTypes are likely defined elsewhere or fetched
        // Placeholder types for now if not available globally
        channelTypes={[
          { id: 1, name: "Entertainment" },
          { id: 2, name: "Education" },
          { id: 3, name: "Music" },
        ]}
      />
    </div>
  );
}
