import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Search, Info, Loader2, ChevronLeft, ChevronRight, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import WithdrawalRow from "./WalletRequestTab";
import GlobalApi from "@/lib/GlobalApi";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import TransactionDetailsModal from "@/components/wallet-transactions/TransactionDetailsModal";
import ExportCsvDialog from "@/components/common/ExportCsvDialog";
import PayoutActionModal from "@/components/wallet-transactions/PayoutActionModal";
import MarkAsPaidModal from "@/components/wallet-transactions/MarkAsPaidModal";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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

const PaginationControls = ({ pagination, onPageChange, isDark }) => {
    if (!pagination || !pagination.totalPages || pagination.totalPages <= 1) {
        return null;
    }

    const { currentPage, totalPages, totalCount } = pagination;
    const itemsPerPage = 10;

    return (
        <div className="flex items-center justify-between mt-6">
          <div className={`text-sm font-medium ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            Page {currentPage} of {totalPages}
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


export default function WalletTransactions({ theme }) {
  const isDark = theme === "dark";

  // Refactored State
  const [stats, setStats] = useState(null);
  const [rows, setRows] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState(""); // "" for 'All Status'
  const [pages, setPages] = useState({ requests: 1, history: 1, unified: 1 });
  
  const [activeTab, setActiveTab] = useState("history");
  
  const currentPage = pages[activeTab] || 1;
  const handlePageChange = (newPage) => {
      setPages(prev => ({ ...prev, [activeTab]: newPage }));
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [payoutActionModalOpen, setPayoutActionModalOpen] = useState(false);
  const [selectedPayoutRequest, setSelectedPayoutRequest] = useState(null);
  const [payoutAction, setPayoutAction] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [isMarkAsPaidModalOpen, setIsMarkAsPaidModalOpen] = useState(false);
  
  const handleViewDetails = (transaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleApprove = (request) => {
    setSelectedPayoutRequest(request);
    setPayoutAction('approve');
    setPayoutActionModalOpen(true);
  };

  const handleReject = (request) => {
    setSelectedPayoutRequest(request);
    setPayoutAction('reject');
    setPayoutActionModalOpen(true);
  };
  
  const handleOpenMarkAsPaidModal = (request) => {
    setSelectedPayoutRequest(request);
    setIsMarkAsPaidModalOpen(true);
  };

  const handlePayoutActionSubmit = async (data) => {
    setActionLoading(true);
    try {
      let res;
      if (payoutAction === 'approve') {
        res = await GlobalApi.approvePayoutRequest(selectedPayoutRequest.requestId, { adminNotes: data.adminNotes });
      } else {
        res = await GlobalApi.rejectPayoutRequest(selectedPayoutRequest.requestId, data);
      }

      if (res.data && res.data.success) {
        toast.success(`Request ${payoutAction}ed successfully.`);
        fetchData();
        fetchStats();
        setPayoutActionModalOpen(false);
      } else {
        toast.error(res.data.message || `Failed to ${payoutAction} request.`);
      }
    } catch (error) {
      toast.error(`An error occurred while ${payoutAction}ing the request.`);
      console.error(error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleMarkAsPaidSubmit = async (data) => {
    setActionLoading(true);
    try {
      const res = await GlobalApi.markPayoutRequestAsPaid(selectedPayoutRequest.requestId, data);
      if (res.data && res.data.success) {
        toast.success("Request marked as paid successfully.");
        fetchData();
        fetchStats();
        setIsMarkAsPaidModalOpen(false);
      } else {
        toast.error(res.data.message || "Failed to mark request as paid.");
      }
    } catch (error) {
      toast.error("An error occurred while marking the request as paid.");
    } finally {
      setActionLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      if(currentPage !== 1) handlePageChange(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchStats = async () => {
    try {
      const res = await GlobalApi.getAdminPayoutStats();
      if (res.data && res.data.success) {
        setStats(res.data.data.stats);
      } else {
        toast.error("Failed to fetch stats.");
      }
    } catch (error) {
      toast.error("An error occurred while fetching stats.");
      console.error(error);
    }
  };
  
  const fetchData = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: 10,
        status: statusFilter || undefined,
        search: debouncedSearch || undefined,
      };

      let res;
      let apiData;
      if (activeTab === 'unified') {
          res = await GlobalApi.getAllTransactions(params);
          apiData = res?.data?.data;
          setRows(apiData?.transactions || []);
      } else if (activeTab === 'history') {
          res = await GlobalApi.getAdminPayoutRequests(params);
          apiData = res?.data?.data;
          setRows(apiData?.requests || []);
      } else {
          res = await GlobalApi.getAdminPendingPayoutRequests(params);
          apiData = res?.data?.data;
          setRows(apiData?.requests || []);
      }

      setPagination(apiData?.pagination || null);

    } catch (err) {
      console.error("❌ Error fetching data:", err);
      toast.error(err.response?.data?.message || err.message || "Failed to fetch data");
      setRows([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab, currentPage, debouncedSearch, statusFilter]);

  useEffect(() => {
    fetchStats();
  }, []);

  const formatINR = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

  const statCards = useMemo(() => {
    if (!stats) return [
        { label: "Pending Requests", value: 0 },
        { label: "Pending Amount", value: formatINR(0) },
        { label: "Approved", value: 0 },
        { label: "Paid", value: 0 },
    ];
    const { byStatus, pendingSummary } = stats;

    const approved = byStatus.find(s => s._id === 'approved')?.count || 0;
    const paid = byStatus.find(s => s._id === 'paid')?.count || 0;

    return [
      { label: "Pending Requests", value: pendingSummary?.count || 0 },
      { label: "Pending Amount", value: formatINR(pendingSummary?.totalAmount || 0) },
      { label: "Approved", value: approved },
      { label: "Paid", value: paid },
    ];
  }, [stats]);
  
  return (
    <div
      className={`p-4 md:p-6 space-y-6 transition-colors duration-300 ${isDark ? "bg-[#111A22] text-gray-200" : "bg-gray-50 text-[#151F28]"}`}
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-3">
        <div>
          <h1 className="text-xl font-semibold">Wallet & Transactions</h1>
          <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            Manage user wallets, transaction history, and payment processing
          </p>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <Button onClick={() => setIsExportModalOpen(true)} className="bg-purple-600 hover:bg-purple-700 text-white rounded-full px-5">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {statCards.map((c) => (
          <div
            key={c.label}
            className={`rounded-lg p-4 shadow-md ${isDark ? "bg-[#151F28]" : "bg-white"}`}
          >
            <div className="flex items-center justify-between">
              <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>{c.label}</p>
              <Info className="h-4 w-4 opacity-50" />
            </div>
            <p className="text-2xl font-semibold mt-1">{c.value}</p>
          </div>
        ))}
      </div>
      
      {/* Tabs */}
      <div className="w-full flex justify-center">
        <div
          className={`inline-flex rounded-full overflow-hidden border ${isDark ? "border-gray-700" : "border-gray-300"} w-[600px]`}
        >
          <button
            onClick={() => setActiveTab("history")}
            className={`flex-1 py-2 text-sm font-medium text-center transition-colors duration-200 ${activeTab === "history" ? (isDark ? "bg-gray-800 text-white" : "bg-gray-100 text-black") : (isDark ? "bg-[#151F28] text-gray-300" : "bg-gray-200 text-gray-600")}`}
          >
            Transaction History
          </button>
          <button
            onClick={() => setActiveTab("request")}
            className={`flex-1 py-2 text-sm font-medium text-center transition-colors duration-200 ${activeTab === "request" ? (isDark ? "bg-gray-800 text-white" : "bg-gray-100 text-black") : (isDark ? "bg-[#151F28] text-gray-300" : "bg-gray-200 text-gray-600")}`}
          >
            Requests
          </button>
          <button
            onClick={() => setActiveTab("unified")}
            className={`flex-1 py-2 text-sm font-medium text-center transition-colors duration-200 ${activeTab === "unified" ? (isDark ? "bg-gray-800 text-white" : "bg-gray-100 text-black") : (isDark ? "bg-[#151F28] text-gray-300" : "bg-gray-200 text-gray-600")}`}
          >
            Unified Transactions
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 opacity-70" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by user, email, or request ID..."
            className={`pl-9 ${isDark ? "bg-[#151F28] border-gray-700 text-gray-200" : "bg-white"}`}
          />
        </div>
        {activeTab === 'history' && (
            <div className="flex flex-wrap gap-2">
            <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={`px-3 py-2 text-sm rounded-md ${isDark ? "bg-[#151F28] border border-gray-700 text-gray-200" : "bg-white border border-gray-300"}`}
            >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="paid">Paid</option>
                <option value="rejected">Rejected</option>
                <option value="cancelled">Cancelled</option>
            </select>
            </div>
        )}
      </div>

      {/* Table */}
      <div className={`rounded-lg overflow-x-auto shadow-md ${isDark ? "bg-[#151F28]" : "bg-white"}`}>
        {loading ? (
            <div className="flex justify-center items-center py-12">
                <Loader2 className="animate-spin h-6 w-6 mr-2" />
                <p>Loading...</p>
            </div>
        ) : activeTab === 'unified' ? (
          <table className="w-full text-sm min-w-[900px]">
            <thead className={`${isDark ? "text-gray-400" : "text-gray-600"} text-left`}>
              <tr>
                {["Date", "User", "Transaction Details", "Amount", "Method"].map((h) => (
                  <th key={h} className="px-5 py-3 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((t, idx) => (
                <tr key={t.id || idx} className={`border-t ${isDark ? "border-gray-700" : "border-gray-200"}`}>
                  <td className="px-5 py-3 font-mono text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(t.date).toLocaleString('en-IN', {
                          day: '2-digit', month: 'short', year: 'numeric',
                          hour: '2-digit', minute: '2-digit'
                      })}
                  </td>
                  <td className="px-5 py-3">
                      {t.user ? (
                          <div className="flex flex-col">
                              <span className="font-medium text-sm">{t.user.name}</span>
                              <span className="text-xs text-muted-foreground">{t.user.accountId}</span>
                          </div>
                      ) : (
                          <span className="text-muted-foreground">Unknown</span>
                      )}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex flex-col">
                        <span className={`font-medium flex items-center gap-1 ${isDark ? "text-gray-200" : "text-gray-900"}`}>
                        {t.type === 'admin_adjustment' ? 'Manual Adjustment' : t.description}
                        {t.type === 'admin_adjustment' && t.description && t.description.length > 30 && (
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Info className="w-4 h-4 text-muted-foreground cursor-pointer" />
                                </DialogTrigger>
                                <DialogContent className={`sm:max-w-md ${isDark ? "bg-[#111A22] text-white border-gray-800" : "bg-white text-gray-900 border-gray-200"}`}>
                                    <DialogHeader>
                                        <DialogTitle>Adjustment Reason</DialogTitle>
                                        <DialogDescription className={`whitespace-pre-wrap mt-2 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                                            {t.description}
                                        </DialogDescription>
                                    </DialogHeader>
                                </DialogContent>
                            </Dialog>
                        )}
                        </span>
                        {t.type === 'admin_adjustment' && t.description && t.description.length <= 30 && (
                        <span className="text-xs text-muted-foreground">{t.description}</span>
                        )}
                        {(t.type === 'regular_royalty' || t.type === 'bonus_royalty') && t.streams && (
                        <span className="text-xs text-muted-foreground mt-0.5">{t.streams.toLocaleString()} streams</span>
                        )}
                        {t.type === 'admin_adjustment' && t.adjustedBy && (
                        <span className="text-xs text-muted-foreground mt-0.5">By: {t.adjustedBy}</span>
                        )}
                        {t.type === 'withdrawal' && t.requestId && (
                        <span className="text-xs font-mono text-muted-foreground mt-0.5">Req ID: {t.requestId}</span>
                        )}
                        {t.type === 'withdrawal' && t.status?.toLowerCase() === 'paid' && t.transactionReference && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="text-xs font-mono text-green-500 mt-0.5 truncate max-w-[150px] inline-block cursor-help">Ref: {t.transactionReference}</span>
                              </TooltipTrigger>
                              <TooltipContent className={isDark ? "bg-[#111A22] text-white border-gray-800" : ""}>
                                <p className="font-mono text-xs">{t.transactionReference}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                    </div>
                  </td>
                  <td className="px-5 py-3 font-medium">
                      <span className={t.direction === 'credit' ? "text-green-500" : "text-red-500"}>
                          {t.direction === 'credit' ? '+' : '-'}{formatINR(t.amount)}
                      </span>
                  </td>
                  <td className="px-5 py-3">
                    {t.type === 'withdrawal' ? (
                        <div className="flex items-center gap-2">
                            <StatusBadge status={t.status} />
                            {(t.status === 'rejected' || t.adminNotes) && t.description && (
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Info className={`w-4 h-4 cursor-pointer ${t.status === 'rejected' ? 'text-red-500' : 'text-blue-500'}`} />
                                    </DialogTrigger>
                                    <DialogContent className={`sm:max-w-md ${isDark ? "bg-[#111A22] text-white border-gray-800" : "bg-white text-gray-900 border-gray-200"}`}>
                                        <DialogHeader>
                                            <DialogTitle>Details / Notes</DialogTitle>
                                            <DialogDescription className={`whitespace-pre-wrap mt-2 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                                              <div className="flex flex-col gap-3 text-left w-full mt-2">
                                                {t.rejectionReason && (
                                                  <div>
                                                    <span className={`block font-semibold mb-1 ${isDark ? "text-gray-200" : "text-gray-900"}`}>Rejection Reason:</span>
                                                    <p>{t.rejectionReason}</p>
                                                  </div>
                                                )}
                                                {t.adminNotes && (
                                                  <div className="w-full">
                                                    <span className={`block font-semibold mb-1 ${isDark ? "text-gray-200" : "text-gray-900"}`}>Admin Notes:</span>
                                                    <p>{t.adminNotes}</p>
                                                  </div>
                                                )}
                                                {!(t.rejectionReason || t.adminNotes) && (
                                                  <p>{t.description.split(' - ')[1] || t.description}</p>
                                                )}
                                              </div>
                                            </DialogDescription>
                                        </DialogHeader>
                                    </DialogContent>
                                </Dialog>
                            )}
                        </div>
                    ) : (
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium justify-center ${
                        t.direction === 'credit' ? "bg-green-500/20 text-green-500 border border-green-500/30" : "bg-red-500/20 text-red-500 border border-red-500/30"
                        }`}>
                        {t.direction === 'credit' ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                        {t.direction === 'credit' ? 'Credit' : 'Debit'}
                        </span>
                    )}
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                    <td colSpan={5} className="text-center py-10">No records found.</td>
                </tr>
              )}
            </tbody>
          </table>
        ) : activeTab === 'history' ? (
          <table className="w-full text-sm min-w-[900px]">
            <thead className={`${isDark ? "text-gray-400" : "text-gray-600"} text-left`}>
              <tr>
                {["Request / Ref ID", "Account ID", "User", "Amount", "Method", "Status", "Date", "Actions"].map((h) => (
                  <th key={h} className="px-5 py-3 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, index) => (
                <tr key={r.requestId || r._id || `req-${index}`} className={`border-t ${isDark ? "border-gray-700" : "border-gray-200"}`}>
                  <td className="px-5 py-3 font-mono text-xs">
                    <div>{r.requestId}</div>
                    {r.status?.toLowerCase() === 'paid' && r.transactionReference && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="text-green-500 mt-1 truncate max-w-[150px] cursor-help">Ref: {r.transactionReference}</div>
                          </TooltipTrigger>
                          <TooltipContent className={isDark ? "bg-[#111A22] text-white border-gray-800" : ""}>
                            <p className="font-mono text-xs">{r.transactionReference}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </td>
                  <td className="px-5 py-3">{r.accountId}</td>
                  <td className="px-5 py-3">{r.userId?.firstName} {r.userId?.lastName}</td>
                  <td className="px-5 py-3">{formatINR(r.amount)}</td>
                  <td className="px-5 py-3 capitalize">{r.payoutMethod?.replace("_", " ") || "Unknown"}</td>
                  <td className="px-5 py-3"><StatusBadge status={r.status} /></td>
                  <td className="px-5 py-3">{new Date(r.requestedAt).toLocaleString()}</td>
                  <td className="px-5 py-3">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant={isDark ? "outline" : "secondary"}
                        className="rounded-full px-3"
                        onClick={() => handleViewDetails(r)}
                      >
                        View
                      </Button>
                      {r.status === 'approved' && (
                        <Button
                            size="sm"
                            className="bg-green-600 text-white"
                            onClick={() => handleOpenMarkAsPaidModal(r)}
                        >
                            Mark as Paid
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                    <td colSpan={8} className="text-center py-10">No records found.</td>
                </tr>
              )}
            </tbody>
          </table>
        ) : (
          <table className="w-full text-sm min-w-[800px]">
            <thead className={`${isDark ? "text-gray-400" : "text-gray-600"} text-left`}>
              <tr>
                {["Account ID", "User", "Withdrawal Amount", "Description", "Date", "Status", "Actions"].map((h) => (
                  <th key={h} className="px-5 py-3 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-5 text-gray-500">
                  No withdrawal requests found
                </td>
              </tr>
            ) : (
              rows.map((req) => (
                <WithdrawalRow
                  key={req._id}
                  withdrawal={{
                      id: req._id,
                      accountId: req.accountId,
                      user: req.userId ? `${req.userId.firstName || ''} ${req.userId.lastName || ''}` : 'Unknown User',
                      amount: req.amount,
                      description: req.payoutMethod,
                      date: new Date(req.requestedAt).toLocaleDateString(),
                      status: req.status
                  }}
                  onView={() => handleViewDetails(req)}
                  onApprove={() => handleApprove(req)}
                  onReject={() => handleReject(req)}
                  theme={theme}
                />
              ))
            )}
          </tbody>
          </table>
        )}
      </div>
      <PaginationControls pagination={pagination} onPageChange={handlePageChange} isDark={isDark} />
      <TransactionDetailsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} transaction={selectedTransaction} theme={theme} />
        <ExportCsvDialog
            isOpen={isExportModalOpen}
            onClose={() => setIsExportModalOpen(false)}
            theme={theme}
            totalItems={pagination?.totalItems || pagination?.totalCount || 0}
            headers={activeTab === 'unified' ? [
                { label: "Date", key: "formattedDate" },
                { label: "User", key: "user" },
                { label: "Account ID", key: "accountId" },
                { label: "Type", key: "type" },
                { label: "Direction", key: "direction" },
                { label: "Amount", key: "amount" },
                { label: "Details", key: "description" },
                { label: "Streams", key: "streams" },
                { label: "Status", key: "status" },
                { label: "Request ID", key: "requestId" },
                { label: "Payment Ref", key: "transactionReference" },
                { label: "Admin Notes", key: "adminNotes" },
                { label: "Rejection Reason", key: "rejectionReason" },
            ] : [
                { label: "Request ID", key: "requestId" },
                { label: "Account ID", key: "accountId" },
                { label: "User", key: "user" },
                { label: "Amount", key: "amount" },
                { label: "Method", key: "payoutMethod" },
                { label: "Status", key: "status" },
                { label: "Payment Ref", key: "transactionReference" },
                { label: "Date", key: "requestedAt" },
            ]}
            fetchData={async (page, limit) => {
            const params = { page, limit, status: statusFilter || undefined, search: debouncedSearch || undefined };
            let data, rows;
            if (activeTab === 'unified') {
                const res = await GlobalApi.getAllTransactions(params);
                data = res?.data?.data;
                rows = data?.transactions || [];
                return rows.map(row => ({
                    ...row,
                    formattedDate: new Date(row.date).toLocaleString(),
                    user: row.user ? `${row.user.name}` : 'Unknown',
                    accountId: row.user ? row.user.accountId : 'N/A',
                    type: row.type?.replace(/_/g, " "),
                    direction: row.direction?.toUpperCase(),
                    streams: row.streams || 0,
                    status: row.status || 'Completed',
                    requestId: row.requestId || '-',
                    transactionReference: row.transactionReference || '-',
                    adminNotes: row.adminNotes || '',
                    rejectionReason: row.rejectionReason || ''
                }));
            } else {
                const res = activeTab === 'history'
                    ? await GlobalApi.getAdminPayoutRequests(params)
                    : await GlobalApi.getAdminPendingPayoutRequests(params);
                data = res?.data?.data;
                rows = data?.requests || [];
                return rows.map(row => ({
                    ...row,
                    user: `${row.userId?.firstName || ''} ${row.userId?.lastName || ''}`,
                    requestedAt: new Date(row.requestedAt).toLocaleString(),
                }));
            }
            }}
            filename={activeTab === 'unified' ? 'unified_transactions' : activeTab === 'history' ? 'transaction_history' : 'payout_requests'}
            title={activeTab === 'unified' ? 'Export Unified Transactions' : activeTab === 'history' ? 'Export Transaction History' : 'Export Payout Requests'}
            description={`Select a data range to export as a CSV file.`}
        />
        <PayoutActionModal 
            isOpen={payoutActionModalOpen}
            onClose={() => setPayoutActionModalOpen(false)}
            action={payoutAction}
            onSubmit={handlePayoutActionSubmit}
            loading={actionLoading}
            theme={theme}
        />
        <MarkAsPaidModal
            isOpen={isMarkAsPaidModalOpen}
            onClose={() => setIsMarkAsPaidModalOpen(false)}
            onSubmit={handleMarkAsPaidSubmit}
            loading={actionLoading}
            theme={theme}
        />
    </div>
  );
}
