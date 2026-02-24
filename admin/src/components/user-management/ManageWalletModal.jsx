import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import GlobalApi from "@/lib/GlobalApi";
import { toast } from "sonner";
import { ArrowDownRight, ArrowUpRight, Wallet } from "lucide-react";

export default function ManageWalletModal({ isOpen, onClose, user, theme }) {
  const isDark = theme === "dark";
  const [loading, setLoading] = useState(false);
  const [walletData, setWalletData] = useState(null);
  const [history, setHistory] = useState([]);
  
  // Form State
  const [adjustmentType, setAdjustmentType] = useState("credit");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && user?._id) {
      fetchWallet();
      resetForm();
    }
  }, [isOpen, user]);

  const fetchWallet = async () => {
    setLoading(true);
    try {
      const res = await GlobalApi.getUserWallet(user._id);
      if (res.data?.data) {
        setWalletData(res.data.data.wallet);
        setHistory(res.data.data.adminAdjustments || []);
      }
    } catch (error) {
      console.error("Failed to fetch wallet:", error);
      toast.error("Failed to load wallet details");
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setAdjustmentType("credit");
    setAmount("");
    setReason("");
  };

  const handleAdjust = async () => {
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      toast.error("Please enter a valid amount greater than 0");
      return;
    }
    if (!reason.trim()) {
      toast.error("Please provide a reason for the adjustment");
      return;
    }

    // Debit Guard
    if (adjustmentType === "debit" && walletData) {
      if (Number(amount) > walletData.availableBalance) {
        toast.error("Insufficient available balance for this debit amount.");
        return;
      }
    }

    setIsSubmitting(true);
    try {
      await GlobalApi.adjustUserWallet(user._id, {
        type: adjustmentType,
        amount: Number(amount),
        reason: reason.trim(),
      });
      toast.success(`Successfully ${adjustmentType}ed ₹${amount}`);
      resetForm();
      fetchWallet(); // Refresh data to show new balance and history
    } catch (error) {
      console.error("Failed to adjust wallet:", error);
      toast.error(error.response?.data?.message || "Failed to adjust wallet");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatNumber = (num) => (typeof num === "number" ? num.toLocaleString("en-IN") : num);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={`max-w-4xl max-h-[90vh] flex flex-col overflow-hidden ${
          isDark ? "bg-[#151F28] text-white border-gray-800" : "bg-white text-gray-900"
        }`}
      >
        <DialogHeader className="flex-none">
          <DialogTitle className="flex items-center gap-2 text-xl border-b pb-4 border-gray-700/50">
            <Wallet className="h-5 w-5 text-purple-500" />
            Manage Wallet: {user?.firstName} {user?.lastName} <span className="text-sm font-normal text-muted-foreground ml-2">({user?.accountId})</span>
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex-1 flex items-center justify-center p-8">Loading wallet details...</div>
        ) : !walletData ? (
          <div className="flex-1 flex items-center justify-center p-8 text-red-400">Failed to load wallet data.</div>
        ) : (
          <div className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar p-1">
            
            {/* Wallet Overview Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className={`p-4 rounded-xl border ${isDark ? "bg-[#111A22] border-gray-800" : "bg-gray-50 border-gray-200"}`}>
                <p className="text-xs text-muted-foreground mb-1">Total Earnings</p>
                <p className="text-xl font-bold">₹{formatNumber(walletData.totalEarnings)}</p>
              </div>
              <div className={`p-4 rounded-xl border ${isDark ? "bg-[#111A22] border-gray-800" : "bg-gray-50 border-gray-200"}`}>
                <p className="text-xs text-muted-foreground mb-1">Available Gross</p>
                <p className="text-xl font-bold">₹{formatNumber(walletData.availableBalance)}</p>
              </div>
              <div className={`p-4 rounded-xl border ${isDark ? "bg-[#111A22] border-gray-800" : "bg-gray-50 border-gray-200"}`}>
                <p className="text-xs text-muted-foreground mb-1">Pending Payouts</p>
                <p className="text-xl font-bold">₹{formatNumber(walletData.pendingPayout)}</p>
              </div>
              <div className={`p-4 rounded-xl border ${isDark ? "bg-purple-900/20 border-purple-500/30" : "bg-purple-50 border-purple-200"}`}>
                <p className="text-xs text-purple-500 mb-1 font-semibold">Withdrawable</p>
                <p className="text-2xl font-bold text-purple-500">₹{formatNumber(walletData.withdrawableBalance)}</p>
              </div>
            </div>

            {/* Adjustment Form */}
            <div className={`p-5 rounded-xl border ${isDark ? "bg-[#111A22] border-gray-800" : "bg-gray-50 border-gray-200"}`}>
              <h3 className="text-sm font-semibold mb-4">Make Adjustment</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-muted-foreground mb-2 block">Action</label>
                    <div className="flex gap-2">
                      <Button
                        variant={adjustmentType === "credit" ? "default" : "outline"}
                        className={adjustmentType === "credit" ? "bg-green-600 hover:bg-green-700 text-white flex-1" : "flex-1"}
                        onClick={() => setAdjustmentType("credit")}
                      >
                        <ArrowUpRight className="w-4 h-4 mr-1" /> Credit
                      </Button>
                      <Button
                        variant={adjustmentType === "debit" ? "default" : "outline"}
                        className={adjustmentType === "debit" ? "bg-red-600 hover:bg-red-700 text-white flex-1" : "flex-1"}
                        onClick={() => setAdjustmentType("debit")}
                      >
                        <ArrowDownRight className="w-4 h-4 mr-1" /> Debit
                      </Button>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Amount (INR)</label>
                    <Input 
                      type="number" 
                      placeholder="e.g. 5000" 
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className={isDark ? "bg-[#151F28] border-gray-700" : "bg-white"}
                    />
                  </div>
                </div>

                <div className="space-y-4 flex flex-col">
                  <div className="flex-1">
                    <label className="text-xs text-muted-foreground mb-1 block">Reason (Required for Audit)</label>
                    <Textarea 
                      placeholder="e.g. Bonus payment for top performer" 
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      className={`h-[100px] resize-none ${isDark ? "bg-[#151F28] border-gray-700" : "bg-white"}`}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <Button 
                  onClick={handleAdjust} 
                  disabled={isSubmitting}
                  className={adjustmentType === "credit" ? "bg-green-600 hover:bg-green-700 text-white" : "bg-red-600 hover:bg-red-700 text-white"}
                >
                  {isSubmitting ? "Processing..." : `Apply ${adjustmentType === "credit" ? "Credit" : "Debit"} Adjustment`}
                </Button>
              </div>
            </div>

            {/* History Table */}
            <div>
              <h3 className="text-sm font-semibold mb-3">Adjustment History</h3>
              <div className={`rounded-lg border overflow-hidden ${isDark ? "border-gray-800" : "border-gray-200"}`}>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className={`text-left ${isDark ? "bg-[#111A22] text-gray-400" : "bg-gray-50 text-gray-600"}`}>
                      <tr>
                        <th className="px-4 py-3 font-medium">Date & Time</th>
                        <th className="px-4 py-3 font-medium">Type</th>
                        <th className="px-4 py-3 font-medium">Amount</th>
                        <th className="px-4 py-3 font-medium">Before → After</th>
                        <th className="px-4 py-3 font-medium">Reason</th>
                        <th className="px-4 py-3 font-medium">Done By</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800/50">
                      {history.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="p-4 text-center text-muted-foreground">No manual adjustments found.</td>
                        </tr>
                      ) : (
                        history.map((record, idx) => (
                          <tr key={idx} className={isDark ? "hover:bg-[#111A22]/50" : "hover:bg-gray-50/50"}>
                            <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                              {new Date(record.adjustedAt).toLocaleString('en-IN', {
                                day: '2-digit', month: 'short', year: 'numeric',
                                hour: '2-digit', minute: '2-digit'
                              })}
                            </td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                record.type === 'credit' ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500"
                              }`}>
                                {record.type === 'credit' ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                                {record.type.charAt(0).toUpperCase() + record.type.slice(1)}
                              </span>
                            </td>
                            <td className="px-4 py-3 font-medium">₹{formatNumber(record.amount)}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                              ₹{formatNumber(record.balanceBefore)} <span className="mx-1">→</span> ₹{formatNumber(record.balanceAfter)}
                            </td>
                            <td className="px-4 py-3 max-w-[200px] truncate" title={record.reason}>{record.reason}</td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              {record.adjustedBy?.firstName} {record.adjustedBy?.lastName}
                              <div className="text-[10px] text-muted-foreground">{record.adjustedBy?.emailAddress}</div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
