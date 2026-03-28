import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Calendar, Clock, FileText, ShieldCheck, Loader, AlertCircle } from 'lucide-react';
import { getMySubscription, getPaymentHistory } from '@/services/api.services';
import { useAuthStore } from '@/store/authStore';

const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  return new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(dateStr));
};

const formatAmount = (amount, currency = 'INR') => {
  if (amount == null) return '—';
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);
};

const StatusBadge = ({ status }) => {
  const map = {
    active: 'bg-green-600',
    expired: 'bg-red-600',
    inactive: 'bg-slate-600',
    cancelled: 'bg-yellow-600',
  };
  return <Badge className={`${map[status] || 'bg-slate-600'} text-white capitalize`}>{status || '—'}</Badge>;
};

const Billing = () => {
  const { user } = useAuthStore();
  const isAggregator = user?.userType === 'aggregator';

  const { data: subData, isLoading: subLoading } = useQuery({
    queryKey: ['mySubscription'],
    queryFn: getMySubscription,
    staleTime: 5 * 60 * 1000,
  });

  const { data: txData, isLoading: txLoading } = useQuery({
    queryKey: ['paymentHistory'],
    queryFn: () => getPaymentHistory({ page: 1, limit: 10 }),
    staleTime: 5 * 60 * 1000,
    enabled: !isAggregator,
  });

  if (subLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="w-6 h-6 animate-spin text-purple-600" />
      </div>
    );
  }

  const sub = subData?.data;

  return (
    <div className="space-y-6">

      {/* ── Subscription Status ─────────────────────────────── */}
      {isAggregator ? (
        <Card className="border-slate-700">
          <CardHeader className="flex flex-row items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-purple-500" />
            <CardTitle>Aggregator Subscription</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {sub?.aggregatorSubscription?.startDate ? (
              <>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>Start: {formatDate(sub.aggregatorSubscription.startDate)}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>Expires: {formatDate(sub.aggregatorSubscription.endDate)}</span>
                </div>
                {sub.aggregatorSubscription.isActive && sub.aggregatorSubscription.daysRemaining != null && (
                  <div className="flex items-center gap-2 text-green-500">
                    <Clock className="w-4 h-4" />
                    <span>{sub.aggregatorSubscription.daysRemaining} days remaining</span>
                  </div>
                )}
                <Badge className={sub.aggregatorSubscription.isActive ? 'bg-green-600 text-white' : 'bg-slate-600 text-white'}>
                  {sub.aggregatorSubscription.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </>
            ) : (
              <div className="flex items-center gap-2 text-yellow-500">
                <AlertCircle className="w-4 h-4" />
                <span>No active subscription. Contact your account manager.</span>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card className="border-slate-700">
          <CardHeader className="flex flex-row items-center gap-2">
            <CreditCard className="w-5 h-5 text-purple-500" />
            <CardTitle>Current Subscription</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {sub?.subscription?.planId ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <p className="text-lg font-semibold capitalize">{sub.subscription.planId?.replace(/_/g, ' ')}</p>
                    {sub.plan?.name && <p className="text-sm text-muted-foreground">{sub.plan.name}</p>}
                  </div>
                  <div className="text-right">
                    {sub.plan?.price?.current && (
                      <p className="text-xl font-bold text-purple-600">
                        {formatAmount(sub.plan.price.current)} <span className="text-sm font-normal text-muted-foreground">/ {sub.plan.interval || 'month'}</span>
                      </p>
                    )}
                    <StatusBadge status={sub.subscription.status} />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Started: {formatDate(sub.subscription.validFrom)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Expires: {formatDate(sub.subscription.validUntil)}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-muted-foreground py-4">
                <AlertCircle className="w-4 h-4" />
                <span>No active subscription. <a href="/app/plan" className="text-purple-500 hover:underline">Browse plans →</a></span>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* ── Payment History ─────────────────────────────────── */}
      {!isAggregator && (
        <Card className="border-slate-700">
          <CardHeader className="flex flex-row items-center gap-2">
            <FileText className="w-5 h-5" />
            <CardTitle>Payment History</CardTitle>
          </CardHeader>
          <CardContent>
            {txLoading ? (
              <div className="flex justify-center py-8">
                <Loader className="w-5 h-5 animate-spin text-purple-600" />
              </div>
            ) : (txData?.data?.transactions?.length > 0 || txData?.data?.length > 0) ? (
              <div className="space-y-2">
                {(txData?.data?.transactions || txData?.data || []).map((tx) => (
                  <div
                    key={tx._id}
                    className="flex items-center justify-between py-3 border-b border-slate-800 last:border-0"
                  >
                    <div>
                      <p className="font-medium capitalize">{tx.planId?.replace(/_/g, ' ') || 'Subscription'}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(tx.createdAt)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatAmount(tx.amount, tx.currency)}</p>
                      <Badge className={tx.status === 'completed' ? 'bg-green-600 text-white text-xs' : 'bg-slate-600 text-white text-xs'}>
                        {tx.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">No payment history found.</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Billing;
