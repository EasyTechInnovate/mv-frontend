import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Search, Info, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import WithdrawalRow from "./WalletRequestTab";
import GlobalApi from "@/lib/GlobalApi";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import TransactionDetailsModal from "@/components/wallet-transactions/TransactionDetailsModal";
import ExportCsvDialog from "@/components/common/ExportCsvDialog";
import PayoutActionModal from "@/components/wallet-transactions/PayoutActionModal";
import MarkAsPaidModal from "@/components/wallet-transactions/MarkAsPaidModal";

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
  const [currentPage, setCurrentPage] = useState(1);

  const [activeTab, setActiveTab] = useState("history");
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
      if(currentPage !== 1) setCurrentPage(1);
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

      const res = activeTab === 'history' 
        ? await GlobalApi.getAdminPayoutRequests(params)
        : await GlobalApi.getAdminPendingPayoutRequests(params);
        
      const apiData = res?.data?.data;
      setRows(apiData?.requests || []);
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
          className={`inline-flex rounded-full overflow-hidden border ${isDark ? "border-gray-700" : "border-gray-300"} w-[500px]`}
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
        ) : activeTab === 'history' ? (
          <table className="w-full text-sm min-w-[900px]">
            <thead className={`${isDark ? "text-gray-400" : "text-gray-600"} text-left`}>
              <tr>
                {["Request ID", "Account ID", "User", "Amount", "Method", "Status", "Date", "Actions"].map((h) => (
                  <th key={h} className="px-5 py-3 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.requestId} className={`border-t ${isDark ? "border-gray-700" : "border-gray-200"}`}>
                  <td className="px-5 py-3 font-mono text-xs">{r.requestId}</td>
                  <td className="px-5 py-3">{r.accountId}</td>
                  <td className="px-5 py-3">{r.userId?.firstName} {r.userId?.lastName}</td>
                  <td className="px-5 py-3">{formatINR(r.amount)}</td>
                  <td className="px-5 py-3 capitalize">{r.payoutMethod.replace("_", " ")}</td>
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
                      user: `${req.userId.firstName} ${req.userId.lastName}`,
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
      <PaginationControls pagination={pagination} onPageChange={setCurrentPage} isDark={isDark} />
      <TransactionDetailsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} transaction={selectedTransaction} theme={theme} />
        <ExportCsvDialog
            isOpen={isExportModalOpen}
            onClose={() => setIsExportModalOpen(false)}
            theme={theme}
            totalItems={pagination?.totalCount || 0}
            headers={[
                { label: "Request ID", key: "requestId" },
                { label: "Account ID", key: "accountId" },
                { label: "User", key: "user" },
                { label: "Amount", key: "amount" },
                { label: "Method", key: "payoutMethod" },
                { label: "Status", key: "status" },
                { label: "Date", key: "requestedAt" },
            ]}
            fetchData={async (page, limit) => {
            const params = { page, limit, status: statusFilter || undefined, search: debouncedSearch || undefined };
            const res = activeTab === 'history'
                ? await GlobalApi.getAdminPayoutRequests(params)
                : await GlobalApi.getAdminPendingPayoutRequests(params);
            const data = res?.data?.data;
            const rows = data?.requests || [];
            return rows.map(row => ({
                ...row,
                user: `${row.userId?.firstName || ''} ${row.userId?.lastName || ''}`,
                requestedAt: new Date(row.requestedAt).toLocaleString(),
            }));
            }}
            filename={activeTab === 'history' ? 'transaction_history' : 'payout_requests'}
            title={activeTab === 'history' ? 'Export Transaction History' : 'Export Payout Requests'}
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
