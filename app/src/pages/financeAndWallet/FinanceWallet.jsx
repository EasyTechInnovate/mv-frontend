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
} from "lucide-react";
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
  Tooltip,
} from "recharts";
import { getMyWallet, getMyPayoutRequests, cancelPayoutRequest } from "@/services/api.services";
import ExportCsvDialog from "@/components/common/ExportCsvDialog";
import jsonToCsv, { exportToCsv } from "@/lib/csv";

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
  const [tab, setTab] = useState("overview");
  const [wallet, setWallet] = useState(null);
  const [loadingWallet, setLoadingWallet] = useState(true);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [isDownloadingStatement, setIsDownloadingStatement] = useState(false);

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

  useEffect(() => {
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
                  showToast.error("An error occurred while fetching wallet data.");        console.error(error);
      } finally {
        setLoadingWallet(false);
      }
    };
    fetchWallet();
  }, []);

  const statCards = useMemo(() => [
    { title: "Available Balance", value: wallet?.availableBalance || 0, icon: Wallet, color: "text-green-500" },
    { title: "Pending Payout", value: wallet?.pendingPayout || 0, icon: Clock, color: "text-yellow-500" },
    { title: "Total Earnings", value: wallet?.totalEarnings || 0, icon: TrendingUp, color: "text-emerald-400" },
    { title: "Total Withdrawn", value: wallet?.totalPaidOut || 0, icon: ArrowDownLeft, color: "text-purple-400" },
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

  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [cancelReason, setCancelReason] = useState("");

  const fetchTransactions = async () => {
    try {
      setLoadingTransactions(true);
      const response = await getMyPayoutRequests({ page: currentPage, limit: itemsPerPage });
      if (response.success) {
        setTransactions(response.data.requests);
        setPagination(response.data.pagination);
      } else {
        showToast.error(response.message || "Failed to fetch transactions.");
      }
    } catch (error) {
              showToast.error("An error occurred while fetching transactions.");      console.error(error);
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
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">Finance & Wallet</h1>
          <p className="text-muted-foreground">
            Manage your payments, transactions, and wallet balance
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => setIsExportModalOpen(true)}>
            <Download className="mr-2 h-4 w-4" />
            Export Payout History
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
      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
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
          statCards.map(({ title, value, icon: Icon, color }) => (
            <Card key={title} className='gap-2'>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 ">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className={`h-4 w-4 ${color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{INR.format(value)}</div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Tabs */}
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="mb-6 grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="payouts">Payout Methods</TabsTrigger>
          <TabsTrigger value="statements">Statements</TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview">
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
                      <Tooltip
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
        </TabsContent>

        {/* Transactions */}
        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Payout History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground">Request ID</th>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground">Amount</th>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground">Method</th>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground">Date</th>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loadingTransactions ? (
                      <tr><td colSpan="6" className="p-6 text-center">Loading...</td></tr>
                    ) : transactions.length > 0 ? (
                      transactions.map((t) => (
                        <tr key={t.requestId} className="border-b">
                          <td className="px-4 py-3 font-mono text-xs">{t.requestId}</td>
                          <td className="px-4 py-3">₹{INR.format(t.amount)}</td>
                          <td className="px-4 py-3 capitalize">{t.payoutMethod.replace("_", " ")}</td>
                          <td className="px-4 py-3">
                            <StatusBadge status={t.status} />
                          </td>
                          <td className="px-4 py-3">{new Date(t.requestedAt).toLocaleString()}</td>
                          <td className="px-4 py-3">
                            {t.status === 'pending' && (
                              <Button variant="destructive" size="sm" onClick={() => openCancelDialog(t)}>
                                Cancel
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan="6" className="p-6 text-center text-muted-foreground">No transactions found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
              {pagination && pagination.totalPages > 1 && (
                <div className="mt-6 flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={!pagination.hasPrev}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={!pagination.hasNext}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payout Methods */}
        <TabsContent value="payouts">
          <Card>
            <CardHeader>
              <CardTitle>Payout Methods</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {payoutMethods.map((m) => (
                <div key={m.id} className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <p className="font-medium">{m.kind}</p>
                    <p className="text-xs text-muted-foreground">{m.sub}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {m.default && <Badge className="bg-primary/15 text-primary">Default</Badge>}
                    <Badge className={m.active ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"}>
                      {m.active ? "Active" : "Inactive"}
                    </Badge>
                    <Button variant="outline" size="sm">
                      <Edit3 className="mr-2 h-4 w-4" /> Edit
                    </Button>
                  </div>
                </div>
              ))}
              <button className="mx-auto block w-full rounded-md border border-dashed py-3 text-center text-sm text-muted-foreground hover:bg-muted/20">
                + Add New Payout Method
              </button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Statements */}
        <TabsContent value="statements">
            <Card>
                <CardHeader>
                    <CardTitle>Download Monthly Statements</CardTitle>
                    <CardDescription>Select a month and year to download your payout statement.</CardDescription>
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
        totalItems={pagination?.totalCount || 0}
        headers={[
            { key: 'requestId', label: 'Request ID' },
            { key: 'amount', label: 'Amount' },
            { key: 'payoutMethod', label: 'Method' },
            { key: 'status', label: 'Status' },
            { key: 'requestedAt', label: 'Date' },
        ]}
        fetchData={async (page, limit) => {
            const response = await getMyPayoutRequests({ page, limit });
            return response.data.requests;
        }}
        filename="payout_history.csv"
        title="Export Payout History"
        description="Select a data range to export as a CSV file."
      />
    </div>
  );
}
