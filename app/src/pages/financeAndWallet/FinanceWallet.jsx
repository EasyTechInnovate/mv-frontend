import React, { useMemo, useState, useEffect } from "react";
import {
  ArrowLeft,
  Download,
  Wallet,
  Clock,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  Edit3,
  FileDown,
  IndianRupee,
  ArrowDownLeft,
  Info
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useNavigate } from "react-router-dom";
import { showToast } from '../../utils/toast';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
} from "recharts";
import { 
  getMyWallet, 
  getMyWalletDetails, 
  getMyPayoutRequests, 
  cancelPayoutRequest, 
  getMyWalletTransactions,
  getProfile,
  updatePayoutMethods
} from "@/services/api.services";
import ExportCsvDialog from "@/components/common/ExportCsvDialog";
import jsonToCsv, { exportToCsv } from "@/lib/csv";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const INR = new Intl.NumberFormat("en-IN");

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
    <Badge className={className} variant="outline">
      {status?.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
    </Badge>
  );
};

export default function FinanceWallet() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("transactions");
  const [wallet, setWallet] = useState(null);
  const [loadingWallet, setLoadingWallet] = useState(true);
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [isDownloadingStatement, setIsDownloadingStatement] = useState(false);

  const fetchWallet = async () => {
    try {
      setLoadingWallet(true);
      const response = await getMyWallet();
      if (response.success) {
        setWallet(response.data.wallet);
      } else {
        showToast.error(response.message || "Failed to fetch wallet data.");
      }
    } catch (error) {
      showToast.error("An error occurred while fetching wallet data.");
      console.error(error);
    } finally {
      setLoadingWallet(false);
    }
  };

  const fetchUser = async () => {
    try {
      setLoadingUser(true);
      const response = await getProfile();
      if (response.success) {
        setUser(response.data.user);
      } else {
        showToast.error(response.message || "Failed to fetch profile details.");
      }
    } catch (error) {
      showToast.error("An error occurred while fetching profile details.");
      console.error(error);
    } finally {
      setLoadingUser(false);
    }
  };

  const handleDownloadStatement = async () => {
    setIsDownloadingStatement(true);
    try {
      const response = await getMyPayoutRequests({ year: selectedYear, month: selectedMonth, limit: 10000 });
      if (response.success && response.data.requests.length > 0) {
        const headers = [
          { key: 'requestId', label: 'Request ID' },
          { key: 'amount', label: 'Amount' },
          { key: 'payoutMethod', label: 'Method' },
          { key: 'status', label: 'Status' },
          { key: 'requestedAt', label: 'Date' },
        ];
        const csvString = jsonToCsv(response.data.requests, headers);
        exportToCsv(`payout-statement-${selectedYear}-${selectedMonth}.csv`, csvString);
        showToast.success("Statement downloaded successfully.");
      } else if (response.success && response.data.requests.length === 0) {
        showToast.info("No data available for the selected period.");
      }
      else {
        showToast.error(response.message || "Failed to download statement.");
      }
    } catch (error) {
      showToast.error("An error occurred while downloading the statement.");
      console.error(error);
    } finally {
      setIsDownloadingStatement(false);
    }
  };

  const [editMethod, setEditMethod] = useState(null); // 'bank', 'upi', 'paypal'
  const [editData, setEditData] = useState({});
  const [isSubmittingPayout, setIsSubmittingPayout] = useState(false);

  const handleUpdatePayout = async (method, data) => {
    try {
      setIsSubmittingPayout(true);
      const response = await updatePayoutMethods({ [method]: data });
      if (response.success) {
        showToast.success(`${method.toUpperCase()} details updated successfully.`);
        fetchUser(); // Refresh user data
        setEditMethod(null);
      } else {
        showToast.error(response.message || "Failed to update payout details.");
      }
    } catch (error) {
      showToast.error("An error occurred while updating payout details.");
    } finally {
      setIsSubmittingPayout(false);
    }
  };

  const handleSetPrimary = async (method) => {
    try {
        const response = await updatePayoutMethods({ primaryMethod: method });
        if (response.success) {
            showToast.success(`${method.replace('_', ' ').toUpperCase()} set as primary.`);
            fetchUser();
        } else {
            showToast.error(response.message || "Failed to update primary method.");
        }
    } catch (error) {
        showToast.error("An error occurred while updating primary method.");
    }
  };

  useEffect(() => {
    fetchWallet();
    fetchUser();
  }, []);

  const statCards = useMemo(() => [
    // { title: "Total Earnings (Gross)", value: wallet?.totalEarnings || 0, icon: TrendingUp, color: "text-emerald-400" },
    { title: "Net Earnings", value: wallet?.availableBalance || 0, icon: TrendingUp, color: "text-emerald-500" },
    { title: "Total Withdrawn", value: wallet?.totalPaidOut || 0, icon: ArrowDownLeft, color: "text-red-400" },
    { title: "Pending Payout", value: wallet?.pendingPayout || 0, icon: Clock, color: "text-yellow-500" },
    { title: "Withdrawable Balance", value: wallet?.withdrawableBalance || 0, icon: Wallet, color: "text-purple-500", highlight: true },
  ], [wallet]);

  const earningsData = [
    { month: "Oct", value: 15000 },
    { month: "Nov", value: 17000 },
    { month: "Dec", value: 21000 },
    { month: "Jan", value: 23500 },
    { month: "Feb", value: 18000 },
    { month: "Mar", value: 28000 },
  ];

  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loadingTransactions, setLoadingTransactions] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const [adjustments, setAdjustments] = useState([]);
  const [loadingAdjustments, setLoadingAdjustments] = useState(true);

  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [cancelReason, setCancelReason] = useState("");

  const fetchTransactions = async () => {
    try {
      setLoadingTransactions(true);
      const response = await getMyWalletTransactions({ page: currentPage, limit: itemsPerPage });
      if (response.success) {
        setTransactions(response.data.transactions);
        setPagination(response.data.pagination);
      } else {
        showToast.error(response.message || "Failed to fetch transactions.");
      }
    } catch (error) {
      showToast.error("An error occurred while fetching transactions.");
      console.error(error);
    } finally {
      setLoadingTransactions(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= (pagination?.totalPages || 1)) {
      setCurrentPage(newPage);
    }
  };

  const openCancelDialog = (request) => {
    setSelectedRequest(request);
    setCancelDialogOpen(true);
  };

  const handleCancelRequest = async () => {
    if (!selectedRequest || !cancelReason) {
      showToast.error("Cancellation reason is required.");
      return;
    }
    try {
      const response = await cancelPayoutRequest(selectedRequest.requestId, { reason: cancelReason });
      if (response.success) {
        showToast.success("Payout request cancelled successfully.");
        fetchTransactions(); // Refresh the list
      } else {
        showToast.error(response.message || "Failed to cancel request.");
      }
    } catch (error) {
      showToast.error("An error occurred while cancelling the request.");
    } finally {
      setCancelDialogOpen(false);
      setSelectedRequest(null);
      setCancelReason("");
    }
  };

  const payoutMethods = [
    { id: 1, kind: "Bank Transfer", sub: "HDFC Bank ****2345", default: true, active: true },
    { id: 2, kind: "UPI", sub: "artist@paytm", default: false, active: true },
    { id: 3, kind: "PayPal", sub: "artist@email.com", default: false, active: false },
  ];

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);
  const months = [
    { value: 1, label: 'January' }, { value: 2, label: 'February' }, { value: 3, label: 'March' },
    { value: 4, label: 'April' }, { value: 5, label: 'May' }, { value: 6, label: 'June' },
    { value: 7, label: 'July' }, { value: 8, label: 'August' }, { value: 9, label: 'September' },
    { value: 10, label: 'October' }, { value: 11, label: 'November' }, { value: 12, label: 'December' },
  ];

  const nextPayoutPercent = useMemo(() => (15 / 30) * 100, []);

  return (
    <div className="min-h-screen bg-background p-6 text-foreground">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">Finance & Wallet</h1>
          <p className="text-muted-foreground">
            Manage your payments, transactions, and wallet balance
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => setIsExportModalOpen(true)}>
            <Download className="mr-2 h-4 w-4" />
            Export Statement
          </Button>
          <Button
            className="gap-2 bg-[#711CE9] text-white hover:bg-[#6f14ef]"
            onClick={() => navigate("/app/finance-and-wallet/withdraw-fund")}
          >
            <ArrowDownLeft className="h-4 w-4 " />
            Withdraw Funds
          </Button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
        {loadingWallet ? (
          Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className='animate-pulse bg-muted/50'>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 ">
                <div className="h-4 w-2/3 rounded bg-muted-foreground/20"></div>
                <div className="h-4 w-4 rounded-full bg-muted-foreground/20"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 w-1/2 rounded bg-muted-foreground/20"></div>
              </CardContent>
            </Card>
          ))
        ) : (
          statCards.map(({ title, value, icon: Icon, color, highlight }) => (
            <Card key={title} className={`gap-2 ${highlight ? 'bg-purple-900/10 border-purple-500/30' : ''}`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 ">
                <CardTitle className={`text-sm font-medium ${highlight ? 'text-purple-500 font-semibold' : 'text-muted-foreground'}`}>{title}</CardTitle>
                <Icon className={`h-4 w-4 ${color}`} />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${highlight ? 'text-purple-500' : ''}`}>₹{INR.format(value)}</div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Tabs */}
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="mb-6 grid w-full grid-cols-3">
          {/* <TabsTrigger value="overview">Overview</TabsTrigger> */}
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="payouts">Payout Methods</TabsTrigger>
          <TabsTrigger value="statements">Statements</TabsTrigger>
        </TabsList>

        {/* Overview */}
        {/* <TabsContent value="overview">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Earnings Trend</CardTitle>
                <CardDescription>Your earnings over the last 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={earningsData}>
                      <XAxis dataKey="month" />
                      <YAxis />
                      <RechartsTooltip
                        contentStyle={{
                          backgroundColor: "var(--popover)",
                          color: "var(--popover-foreground)",
                          border: "1px solid var(--border)",
                          borderRadius: 8,
                          fontSize: 12,
                        }}
                        labelStyle={{
                          color: "var(--muted-foreground)",
                        }}
                        itemStyle={{
                          color: "var(--foreground)",
                        }}
                        formatter={(v) => [`₹${INR.format(v)}`, "Earnings"]}
                      />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#711CE9"
                        strokeWidth={3}
                        dot={{ r: 3 }}
                        activeDot={{ r: 5 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Next Payout</CardTitle>
                <CardDescription>Scheduled payout information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="rounded-lg border bg-muted/30 p-8 text-center">
                  <IndianRupee size='40' className="text-[#711CE9] w-full"/>
                  <div className="text-2xl font-bold">₹18,750</div>
                  <p className="text-sm text-muted-foreground">Expected payout amount</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Payout Progress</span>
                    <span>15/30 days</span>
                  </div>
                  <Progress value={nextPayoutPercent} className='bg-muted-foreground/10 [&>div]:bg-[#711CE9]'/>
                  <p className="text-xs text-muted-foreground">
                    Next payout on April 1st, 2024
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent> */}

        {/* Transactions & Adjustments */}
        <TabsContent value="transactions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>Your unified history for earnings, adjustments, and payouts.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground w-1/4">Date</th>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground">Description</th>
                      <th className="px-4 py-3 text-right font-medium text-muted-foreground w-32">Amount</th>
                      <th className="px-4 py-3 text-center font-medium text-muted-foreground">Status / Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loadingTransactions ? (
                      <tr><td colSpan="4" className="p-6 text-center">Loading...</td></tr>
                    ) : transactions.length > 0 ? (
                      transactions.map((t) => (
                        <tr key={t.id} className="border-b">
                          <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                            {new Date(t.date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex flex-col">
                              <span className="font-medium text-foreground flex items-center gap-1">
                                {t.type === 'admin_adjustment' ? 'Manual Adjustment' : t.description}
                                {t.type === 'admin_adjustment' && t.description && t.description.length > 30 && (
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Info className="w-4 h-4 text-muted-foreground cursor-pointer" />
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-md">
                                      <DialogHeader>
                                        <DialogTitle>Adjustment Reason</DialogTitle>
                                        <DialogDescription className="whitespace-pre-wrap mt-2">
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
                                      <span className="text-xs font-mono text-green-600 mt-0.5 truncate max-w-[150px] inline-block cursor-help">Ref: {t.transactionReference}</span>
                                    </TooltipTrigger>
                                    <TooltipContent className="dark:bg-[#111A22] dark:text-white dark:border-gray-800">
                                      <p className="font-mono text-xs">{t.transactionReference}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right font-medium">
                            {t.direction === 'credit' ? (
                              <span className="text-green-600">+₹{INR.format(t.amount)}</span>
                            ) : (
                              <span className="text-red-500">-₹{INR.format(t.amount)}</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-center">
                            {t.type === 'withdrawal' ? (
                              <div className="flex flex-col items-center gap-2">
                                <span className="flex items-center gap-1">
                                  <StatusBadge status={t.status} />
                                  {t.status === 'rejected' && t.description && (
                                    <Dialog>
                                      <DialogTrigger asChild>
                                          <Info className="w-4 h-4 text-destructive cursor-pointer" />
                                      </DialogTrigger>
                                      <DialogContent className="sm:max-w-md">
                                        <DialogHeader>
                                          <DialogTitle>Reason for Rejection</DialogTitle>
                                          <DialogDescription className="whitespace-pre-wrap mt-2">
                                            {t.rejectionReason || t.description.split(' - ')[1] || t.description}
                                          </DialogDescription>
                                        </DialogHeader>
                                      </DialogContent>
                                    </Dialog>
                                  )}
                                </span>
                                {t.status === 'pending' && (
                                  <Button variant="ghost" size="sm" onClick={() => openCancelDialog(t)} className="h-6 text-xs text-red-500 hover:text-red-600 hover:bg-red-500/10 px-2 mt-1">
                                    Cancel
                                  </Button>
                                )}
                              </div>
                            ) : (
                              <Badge variant="outline" className={t.direction === 'credit' ? 'border-green-500 text-green-500 bg-green-500/10' : 'border-red-500 text-red-500 bg-red-500/10'}>
                                {t.direction === 'credit' ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                                {t.direction === 'credit' ? 'Credit' : 'Debit'}
                              </Badge>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan="4" className="p-6 text-center text-muted-foreground">No transactions found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>

              {pagination && pagination.totalPages > 1 && (
                <div className="mt-6 flex items-center justify-between border-t pt-4">
                  <div className="text-sm text-muted-foreground">
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === pagination.totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payouts">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Payout Methods</CardTitle>
                <CardDescription>Manage your preferred methods for receiving payments.</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {loadingUser ? (
                <div className="space-y-3">
                   {[1,2,3].map(i => <div key={i} className="h-20 w-full animate-pulse rounded-lg bg-muted/50" />)}
                </div>
              ) : (
                <>
                  {/* Bank Transfer */}
                  <div className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/5">
                    <div className="flex items-center gap-4">
                      <div className="rounded-full bg-blue-500/10 p-2">
                        <CreditCard className="h-5 w-5 text-blue-500" />
                      </div>
                      <div>
                        <p className="font-medium">Bank Transfer</p>
                        <p className="text-xs text-muted-foreground">
                          {user?.payoutMethods?.bank?.accountNumber 
                            ? `${user.payoutMethods.bank.bankName} • ****${user.payoutMethods.bank.accountNumber.slice(-4)}`
                            : "Not configured"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {user?.payoutMethods?.primaryMethod === 'bank' && <Badge className="bg-[#711CE9]/10 text-[#711CE9]">Primary</Badge>}
                      {user?.payoutMethods?.bank?.verified ? <Badge className="bg-green-500/10 text-green-500">Verified</Badge> : <Badge variant="outline" className="text-muted-foreground">Unverified</Badge>}
                      <Button variant="ghost" size="sm" onClick={() => { setEditMethod('bank'); setEditData(user?.payoutMethods?.bank || {}); }}>
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      {user?.payoutMethods?.primaryMethod !== 'bank' && user?.payoutMethods?.bank?.accountNumber && (
                        <Button variant="outline" size="sm" onClick={() => handleSetPrimary('bank')}>Set Primary</Button>
                      )}
                    </div>
                  </div>

                  {/* UPI */}
                  <div className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/5">
                    <div className="flex items-center gap-4">
                      <div className="rounded-full bg-purple-500/10 p-2">
                        <IndianRupee className="h-5 w-5 text-purple-500" />
                      </div>
                      <div>
                        <p className="font-medium">UPI ID</p>
                        <p className="text-xs text-muted-foreground">
                          {user?.payoutMethods?.upi?.upiId || "Not configured"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {user?.payoutMethods?.primaryMethod === 'upi' && <Badge className="bg-[#711CE9]/10 text-[#711CE9]">Primary</Badge>}
                      {user?.payoutMethods?.upi?.verified ? <Badge className="bg-green-500/10 text-green-500">Verified</Badge> : <Badge variant="outline" className="text-muted-foreground">Unverified</Badge>}
                      <Button variant="ghost" size="sm" onClick={() => { setEditMethod('upi'); setEditData(user?.payoutMethods?.upi || {}); }}>
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      {user?.payoutMethods?.primaryMethod !== 'upi' && user?.payoutMethods?.upi?.upiId && (
                        <Button variant="outline" size="sm" onClick={() => handleSetPrimary('upi')}>Set Primary</Button>
                      )}
                    </div>
                  </div>

                  {/* PayPal */}
                  <div className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/5">
                    <div className="flex items-center gap-4">
                      <div className="rounded-full bg-blue-600/10 p-2">
                        <Wallet className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">PayPal</p>
                        <p className="text-xs text-muted-foreground">
                          {user?.payoutMethods?.paypal?.paypalEmail || "Not configured"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {user?.payoutMethods?.primaryMethod === 'paypal' && <Badge className="bg-[#711CE9]/10 text-[#711CE9]">Primary</Badge>}
                      {user?.payoutMethods?.paypal?.verified ? <Badge className="bg-green-500/10 text-green-500">Verified</Badge> : <Badge variant="outline" className="text-muted-foreground">Unverified</Badge>}
                      <Button variant="ghost" size="sm" onClick={() => { setEditMethod('paypal'); setEditData(user?.payoutMethods?.paypal || {}); }}>
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      {user?.payoutMethods?.primaryMethod !== 'paypal' && user?.payoutMethods?.paypal?.paypalEmail && (
                        <Button variant="outline" size="sm" onClick={() => handleSetPrimary('paypal')}>Set Primary</Button>
                      )}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="statements" className="space-y-6">
            <h2 className="text-xl font-bold mb-4">Download Reports</h2>
            <Card>
                <CardHeader>
                    <CardTitle>Download Monthly Payout Statements</CardTitle>
                    <CardDescription>Select a year and month to download your payout history CSV statement.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex gap-4">
                        <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
                            <SelectTrigger>
                                <SelectValue placeholder="Year" />
                            </SelectTrigger>
                            <SelectContent>
                                {years.map(year => <SelectItem key={year} value={year.toString()}>{year}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <Select value={selectedMonth.toString()} onValueChange={(value) => setSelectedMonth(parseInt(value))}>
                            <SelectTrigger>
                                <SelectValue placeholder="Month" />
                            </SelectTrigger>
                            <SelectContent>
                                {months.map(month => <SelectItem key={month.value} value={month.value.toString()}>{month.label}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <Button onClick={handleDownloadStatement} disabled={isDownloadingStatement} className="w-full">
                        <Download className="mr-2 h-4 w-4" />
                        {isDownloadingStatement ? 'Downloading...' : 'Download Statement'}
                    </Button>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
      
      {/* Cancel Dialog */}
      {cancelDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-background p-6 shadow-lg">
            <h2 className="text-lg font-semibold">Cancel Payout Request</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Are you sure you want to cancel this payout request? This action cannot be undone.
            </p>
            <div className="mt-4">
              <label htmlFor="cancelReason" className="text-sm font-medium">Reason for cancellation</label>
              <textarea
                id="cancelReason"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="mt-1 block w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                rows="3"
                placeholder="e.g., Changed my mind"
              ></textarea>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setCancelDialogOpen(false)}>Go Back</Button>
              <Button variant="destructive" onClick={handleCancelRequest}>Confirm Cancellation</Button>
            </div>
          </div>
        </div>
      )}
      <ExportCsvDialog
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        totalItems={pagination?.totalItems || 0}
        headers={[
            { key: 'formattedDate', label: 'Date' },
            { key: 'type', label: 'Transaction Type' },
            { key: 'description', label: 'Details' },
            { key: 'direction', label: 'Direction' },
            { key: 'amount', label: 'Amount' },
            { key: 'streams', label: 'Streams' },
            { key: 'status', label: 'Status' },
            { key: 'requestId', label: 'Request ID' },
            { key: 'transactionReference', label: 'Payment Ref' },
            { key: 'rejectionReason', label: 'Reason' }
        ]}
        fetchData={async (page, limit) => {
            const response = await getMyWalletTransactions({ page, limit });
            const dataToFormat = response.data.transactions || [];
            return dataToFormat.map(t => ({
              ...t,
              formattedDate: new Date(t.date).toLocaleString(),
              type: t.type?.replace(/_/g, " "),
              direction: t.direction?.toUpperCase(),
              streams: t.streams || 0,
              status: t.status || 'Completed',
              requestId: t.requestId || '-',
              transactionReference: t.transactionReference || '-',
              rejectionReason: t.rejectionReason || '-'
            }));
        }}
        filename="transaction_history.csv"
        title="Export Transaction History"
        description="Select a data range to export as a CSV file."
      />
      {/* Edit Payout Modals */}
      <Dialog open={!!editMethod} onOpenChange={(open) => !open && setEditMethod(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update {editMethod?.toUpperCase()} Details</DialogTitle>
            <DialogDescription>
              Changes will reset verification status. Admin review required.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {editMethod === 'bank' && (
              <>
                <div className="space-y-2">
                  <Label>Account Holder Name</Label>
                  <Input 
                    value={editData.accountHolderName || ""} 
                    onChange={(e) => setEditData({...editData, accountHolderName: e.target.value})}
                    placeholder="As per bank records"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Bank Name</Label>
                  <Input 
                    value={editData.bankName || ""} 
                    onChange={(e) => setEditData({...editData, bankName: e.target.value})}
                    placeholder="e.g. HDFC Bank"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Account Number</Label>
                  <Input 
                    value={editData.accountNumber || ""} 
                    onChange={(e) => setEditData({...editData, accountNumber: e.target.value})}
                    placeholder="9-18 digits"
                  />
                </div>
                <div className="space-y-2">
                  <Label>IFSC / SWIFT Code</Label>
                  <Input 
                    value={editData.ifscSwiftCode || ""} 
                    onChange={(e) => setEditData({...editData, ifscSwiftCode: e.target.value})}
                    placeholder="e.g. HDFC0001234"
                  />
                </div>
              </>
            )}

            {editMethod === 'upi' && (
              <>
                <div className="space-y-2">
                  <Label>UPI ID</Label>
                  <Input 
                    value={editData.upiId || ""} 
                    onChange={(e) => setEditData({...editData, upiId: e.target.value})}
                    placeholder="username@bank"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Account Holder Name</Label>
                  <Input 
                    value={editData.accountHolderName || ""} 
                    onChange={(e) => setEditData({...editData, accountHolderName: e.target.value})}
                    placeholder="As per bank records"
                  />
                </div>
              </>
            )}

            {editMethod === 'paypal' && (
              <>
                <div className="space-y-2">
                  <Label>PayPal Email</Label>
                  <Input 
                    type="email"
                    value={editData.paypalEmail || ""} 
                    onChange={(e) => setEditData({...editData, paypalEmail: e.target.value})}
                    placeholder="yourname@email.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Account Name</Label>
                  <Input 
                    value={editData.accountName || ""} 
                    onChange={(e) => setEditData({...editData, accountName: e.target.value})}
                    placeholder="As per PayPal records"
                  />
                </div>
              </>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setEditMethod(null)}>Cancel</Button>
            <Button 
                className="bg-[#711CE9] text-white hover:bg-[#6f14ef]"
                disabled={isSubmittingPayout}
                onClick={() => handleUpdatePayout(editMethod, editData)}
            >
                {isSubmittingPayout ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
