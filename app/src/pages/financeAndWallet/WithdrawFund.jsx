import React, { useState, useMemo, useEffect } from "react";
import { ArrowLeft, IndianRupee, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { showToast } from '../../utils/toast';

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { getMyWallet, createPayoutRequest, getMyPayoutRequests } from "@/services/api.services";

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

const PAYOUT_METHODS = [
  { value: "bank_transfer", label: "Bank Transfer" },
  { value: "upi", label: "UPI" },
  { value: "cheque", label: "Cheque" },
];

export default function WithdrawFund() {
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");
  const [payoutMethod, setPayoutMethod] = useState(PAYOUT_METHODS[0].value);
  const [wallet, setWallet] = useState(null);
  const [loadingWallet, setLoadingWallet] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recentWithdrawals, setRecentWithdrawals] = useState([]);
  const [loadingRecentWithdrawals, setLoadingRecentWithdrawals] = useState(true);

  const min = 1000;
  const max = useMemo(() => wallet?.withdrawableBalance || 0, [wallet]);

  useEffect(() => {
    const fetchWalletAndRecentWithdrawals = async () => {
      try {
        setLoadingWallet(true);
        setLoadingRecentWithdrawals(true);

        const [walletResponse, recentWithdrawalsResponse] = await Promise.all([
          getMyWallet(),
          getMyPayoutRequests({ page: 1, limit: 5 })
        ]);
        
        if (walletResponse.success) {
          setWallet(walletResponse.data.wallet);
        } else {
          showToast.error(walletResponse.message || "Failed to fetch wallet data.");
        }

        if (recentWithdrawalsResponse.success) {
          setRecentWithdrawals(recentWithdrawalsResponse.data.requests);
        } else {
          showToast.error(recentWithdrawalsResponse.message || "Failed to fetch recent withdrawals.");
        }

      } catch (error) {
        showToast.error("An error occurred while fetching data.");
        console.error(error);
      } finally {
        setLoadingWallet(false);
        setLoadingRecentWithdrawals(false);
      }
    };
    fetchWalletAndRecentWithdrawals();
  }, []);
  
  const valid = useMemo(() => {
    const n = Number(amount);
    return Number.isFinite(n) && n >= min && n <= max;
  }, [amount, min, max]);

  const onSubmit = async () => {
    if (!valid) return;
    setIsSubmitting(true);
    try {
      const response = await createPayoutRequest({
        amount: Number(amount),
        payoutMethod,
      });
      if (response.success) {
        showToast.success("Withdrawal request submitted successfully!");
        navigate("/app/finance-and-wallet");
      } else {
        showToast.error(response.message || "Failed to submit withdrawal request.");
      }
    } catch (error) {
      showToast.error("An error occurred while submitting the request.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6 text-foreground">
      <div className="mb-6 flex items-start gap-3">
        <Button
          variant="outline"
          size="icon"
          className='mt-2'
          onClick={() => navigate("/app/finance-and-wallet")}
        >
            <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Withdraw Funds</h1>
          <p className="text-sm text-muted-foreground">
            Transfer your earnings to your preferred payment method
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Available Balance</CardTitle>
            </CardHeader>
            <CardContent className="rounded-lg border bg-muted/30 p-10 text-center">
              {loadingWallet ? (
                <div className="animate-pulse">
                  <div className="mx-auto h-10 w-10 rounded-full bg-muted-foreground/20"></div>
                  <div className="mt-4 h-8 w-1/2 mx-auto rounded bg-muted-foreground/20"></div>
                  <div className="mt-2 h-4 w-1/3 mx-auto rounded bg-muted-foreground/20"></div>
                </div>
              ) : (
                <>
                  <IndianRupee size='40' className="text-[#711CE9] w-full"/>
                  <div className="text-3xl font-bold">₹{INR.format(wallet?.withdrawableBalance || 0)}</div>
                  <p className="text-sm text-muted-foreground">Available for withdrawal</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Withdrawal Details</CardTitle>
              <CardDescription>Enter the amount and select a payout method</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Withdrawal Amount (₹)
                </label>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  disabled={loadingWallet}
                />
                <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                  <span>Minimum: ₹{min}</span>
                  <span>Maximum: ₹{INR.format(max)}</span>
                </div>
              </div>
              
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Payout Method
                </label>
                <Select value={payoutMethod} onValueChange={setPayoutMethod}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a method" />
                  </SelectTrigger>
                  <SelectContent>
                    {PAYOUT_METHODS.map(method => (
                      <SelectItem key={method.value} value={method.value}>
                        {method.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-start gap-2 rounded-md border p-3 text-sm">
                <Info className="h-4 w-4 text-muted-foreground" />
                <span>
                  Withdrawal must be between ₹{min} and ₹{INR.format(max)}. Fees may apply.
                </span>
              </div>

              <div className="flex items-start gap-2 rounded-md border p-3 text-sm">
                <Info className="h-4 w-4 text-muted-foreground" />
                <span>Your withdrawal will be sent to admin for approval.</span>
              </div>

              <div className="flex gap-3 w-full">
                <Button className="w-[80%] bg-[#711CE9] text-white hover:bg-[#6f14ef]" disabled={!valid || isSubmitting} onClick={onSubmit}>
                  {isSubmitting ? "Submitting..." : `Send Request ₹${INR.format(Number(amount || 0))}`}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/app/finance-and-wallet")}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Recent Withdrawals</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {loadingRecentWithdrawals ? (
                <p className="text-center text-muted-foreground">Loading recent withdrawals...</p>
              ) : recentWithdrawals.length > 0 ? (
                recentWithdrawals.map((r) => (
                  <div key={r.requestId} className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                      <p className="font-medium">
                        ₹{INR.format(r.amount)} • {r.payoutMethod.replace("_", " ")}
                      </p>
                      <p className="text-xs text-muted-foreground">{new Date(r.requestedAt).toLocaleDateString()}</p>
                      <p className="text-xs text-muted-foreground">Ref: {r.requestId}</p>
                    </div>
                    <StatusBadge status={r.status} />
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground">No recent withdrawals.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
