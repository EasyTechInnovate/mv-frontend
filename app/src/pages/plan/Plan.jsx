import React, { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Check, X, CreditCard, Calendar, Clock, Loader, ShieldCheck, ArrowUp, Tag } from 'lucide-react'
import { getMySubscription, getAllSubscriptionPlans, createPaymentIntent, verifyPayment } from '@/services/api.services'
import { useAuthStore } from '@/store/authStore'
import toast from 'react-hot-toast'

const FEATURE_LABELS = {
  unlimitedReleases: "Unlimited Release",
  unlimitedArtists: "Unlimited Artists",
  singleLabel: "Single Label (100% Ownership)",
  revenueShare: "Net Revenue Share",
  youtubeContentId: "YouTube Content ID",
  metaContentId: "Meta Content ID",
  tiktokContentId: "TikTok Content ID",
  youtubeOac: "YouTube OAC",
  analyticsCenter: "Analytics Centre",
  royaltyClaimCentre: "Royalty Claim Centre",
  merchandisePanel: "Merchandise Distribution Panel",
  dolbyAtmos: "Dolby Atmos Distribution",
  spotifyDiscoveryMode: "Spotify Discovery Mode",
  playlistPitching: "Playlist Pitching",
  synchronization: "Synchronization",
  fanLinksBuilder: "Fan Links Builder",
  mahiAi: "Mahi AI",
  youtubeMcnAccess: "YouTube MCN Access",
  available150Stores: "Available to all 150 stores",
  worldwideAvailability: "Worldwide Availability",
  freeUpcCode: "Free UPC Code",
  freeIsrcCode: "Free ISRC Code",
  lifetimeAvailability: "Lifetime Availability",
  supportHours: "Support Time",
  liveSupportTime: "Live Processing Time",
};

const SUPPORT_HOURS_LABELS = {
  "24_business_hours": "24 Business Hours",
  "48_business_hours": "48 Business Hours",
  "72_business_hours": "72 Business Hours",
  "24_hours": "24 Hours",
  "48_hours": "48 Hours",
  "72_hours": "72 Hours",
};

const LIVE_PROCESS_LABELS = {
  "48_to_72_business_hours": "48 to 72 Business Hours",
  "24_to_48_business_hours": "24 to 48 Business Hours",
  "instant": "Instant",
};

const Plan = () => {
  const { user } = useAuthStore()
  const queryClient = useQueryClient()
  const userType = user?.userType
  const [buyingPlanId, setBuyingPlanId] = useState(null)
  const [upgradeDialog, setUpgradeDialog] = useState(null)

  // Fetch current subscription
  const { data: currentSubData, isLoading: currentSubLoading } = useQuery({
    queryKey: ['mySubscription'],
    queryFn: getMySubscription,
    staleTime: 5 * 60 * 1000,
  })

  // Fetch plans filtered by user type
  const { data: allPlansData, isLoading: allPlansLoading } = useQuery({
    queryKey: ['subscriptionPlans', userType],
    queryFn: () => getAllSubscriptionPlans(userType === 'artist' ? 'artist' : userType === 'label' ? 'label' : null),
    staleTime: 5 * 60 * 1000,
    enabled: userType !== 'aggregator',
  })

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    try {
      return new Intl.DateTimeFormat('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(dateString))
    } catch {
      return dateString
    }
  }

  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      if (window.Razorpay) return resolve(true)
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })

  const openRazorpay = async (checkoutData, planId) => {
    const loaded = await loadRazorpayScript()
    if (!loaded) {
      toast.error('Failed to load payment SDK. Please try again.')
      setBuyingPlanId(null)
      return
    }
    const options = {
      key: checkoutData.keyId || checkoutData.razorpayKeyId,
      amount: checkoutData.chargeAmount * 100,
      currency: checkoutData.currency || 'INR',
      name: 'Maheshwari Visuals',
      description: checkoutData.isUpgrade
        ? `Upgrade to ${checkoutData.planName} (₹${checkoutData.prorationCredit} credit applied)`
        : `Subscription to ${checkoutData.planName}`,
      order_id: checkoutData.razorpayOrderId,
      prefill: {
        name: user ? `${user.firstName} ${user.lastName}` : '',
        email: user?.emailAddress || '',
      },
      theme: { color: '#652CD6' },
      handler: async (rzpResponse) => {
        try {
          await verifyPayment({
            razorpayPaymentId: rzpResponse.razorpay_payment_id,
            razorpayOrderId: rzpResponse.razorpay_order_id,
            razorpaySignature: rzpResponse.razorpay_signature,
            planId,
          })
          toast.success('Subscription activated!')
          queryClient.invalidateQueries({ queryKey: ['mySubscription'] })
          queryClient.invalidateQueries({ queryKey: ['subscriptionPlans'] })
        } catch {
          toast.error('Payment verification failed. Contact support.')
        }
      },
      modal: { ondismiss: () => setBuyingPlanId(null) },
    }
    new window.Razorpay(options).open()
  }

  const handleBuyPlan = async (planId) => {
    try {
      setBuyingPlanId(planId)
      const res = await createPaymentIntent({ planId })
      if (!res.success) {
        toast.error(res.message || 'Failed to initiate payment')
        setBuyingPlanId(null)
        return
      }
      const checkoutData = res.data
      if (checkoutData.isUpgrade && checkoutData.prorationCredit > 0) {
        setUpgradeDialog({ checkoutData, planId })
        setBuyingPlanId(null)
        return
      }
      await openRazorpay(checkoutData, planId)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to initiate payment')
      setBuyingPlanId(null)
    }
  }

  const handleUpgradeConfirm = async () => {
    const { checkoutData, planId } = upgradeDialog
    setUpgradeDialog(null)
    setBuyingPlanId(planId)
    await openRazorpay(checkoutData, planId)
  }

  if (currentSubLoading || allPlansLoading) {
    return (
      <div className="flex items-center justify-center p-6 min-h-screen">
        <Loader className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    )
  }

  // ── Aggregator View ─────────────────────────────────────────────────────────
  if (userType === 'aggregator') {
    const aggSub = currentSubData?.data?.aggregatorSubscription
    const isActive = aggSub?.isActive
    const daysRemaining = aggSub?.daysRemaining ?? 0

    return (
      <div className="p-6 max-w-xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Your Subscription</h1>
          <p className="text-muted-foreground">Aggregator subscriptions are managed by admin.</p>
        </div>

        <Card className={isActive ? 'border-green-600' : 'border-slate-700'}>
          <CardHeader>
            <div className="flex items-center gap-3">
              <ShieldCheck className={`w-6 h-6 ${isActive ? 'text-green-500' : 'text-gray-400'}`} />
              <CardTitle>Aggregator Plan</CardTitle>
              <Badge className={isActive ? 'bg-green-600 text-white' : 'bg-slate-600 text-white'}>
                {isActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {aggSub?.startDate ? (
              <>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>Start: {formatDate(aggSub.startDate)}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>Expires: {formatDate(aggSub.endDate)}</span>
                </div>
                {isActive && (
                  <div className="flex items-center gap-2 text-green-500">
                    <Clock className="w-4 h-4" />
                    <span>{daysRemaining} day{daysRemaining !== 1 ? 's' : ''} remaining</span>
                  </div>
                )}
                {aggSub?.notes && (
                  <div className="mt-4 p-3 rounded-lg bg-muted/50 border border-slate-700/50">
                    <p className="text-xs font-semibold text-purple-400 mb-1 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> Admin Note
                    </p>
                    <p className="text-gray-300 italic">"{aggSub.notes}"</p>
                  </div>
                )}
              </>
            ) : (
              <p className="text-muted-foreground">No active subscription. Please contact your account manager.</p>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  // ── Artist / Label View ─────────────────────────────────────────────────────
  const currentSub = currentSubData?.data?.subscription
  const currentPlanId = currentSub?.planId
  const currentPrice = currentSubData?.data?.plan?.price?.current ?? 0
  const allPlans = allPlansData?.data || []

  return (
    <div className="p-6 space-y-8">
      {/* Upgrade Confirmation Dialog */}
      <Dialog open={!!upgradeDialog} onOpenChange={(open) => { if (!open) setUpgradeDialog(null) }}>
        <DialogContent className="sm:max-w-md border-slate-700 bg-[#0f1117]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-white">
              <ArrowUp className="w-5 h-5 text-purple-500" />
              Confirm Plan Upgrade
            </DialogTitle>
          </DialogHeader>
          {upgradeDialog && (
            <div className="space-y-4 py-2">
              <div className="rounded-lg border border-slate-700 bg-slate-900 p-4 space-y-3 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>New plan price</span>
                  <span className="text-white font-medium">₹{upgradeDialog.checkoutData.originalAmount}</span>
                </div>
                <div className="flex justify-between text-green-500">
                  <span className="flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    Credit from current plan
                  </span>
                  <span className="font-medium">−₹{upgradeDialog.checkoutData.prorationCredit}</span>
                </div>
                <div className="border-t border-slate-700 pt-3 flex justify-between text-white font-semibold text-base">
                  <span>You pay today</span>
                  <span className="text-purple-400">₹{upgradeDialog.checkoutData.chargeAmount}</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Your new plan activates immediately and runs for a fresh billing period.
                Unused days from your current plan are credited above.
              </p>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button variant="outline" className="border-slate-600" onClick={() => setUpgradeDialog(null)}>
              Cancel
            </Button>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white" onClick={handleUpgradeConfirm}>
              Proceed to Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold">Choose Your Plan</h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          {userType === 'artist' ? 'Plans for Artists' : userType === 'label' ? 'Plans for Labels' : 'All Plans'}
        </p>
      </div>

      {/* Current Plan Banner */}
      {currentSub && currentSub.status === 'active' && (
        <Card className="border-purple-600 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="font-semibold">Current Plan: <span className="text-purple-600">{currentSub.planId}</span></p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Valid until {formatDate(currentSub.validUntil)}
                  </p>
                </div>
              </div>
              <Badge className="bg-green-600 text-white">Active</Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Plans Grid */}
      {allPlans.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground">
            No plans available. Please contact support.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {allPlans.map((plan) => {
            const isCurrent = currentPlanId === plan.planId
            const isDowngrade = !isCurrent && !!currentPlanId && currentSub?.status === 'active' && plan.price.current <= currentPrice
            const getFeatureLabel = (key, value) => {
              let label = FEATURE_LABELS[key] || key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
              if (key === "supportHours") label = `${FEATURE_LABELS[key]}: ${SUPPORT_HOURS_LABELS[value] || value}`;
              if (key === "liveSupportTime") label = `${FEATURE_LABELS[key]}: ${LIVE_PROCESS_LABELS[value] || value}`;
              if (key === "revenueShare" && value?.percentage) label = `${value.percentage}% of the Net Revenue`;
              return label;
            }

            const features = Object.entries(plan.features || {})
              .filter(([, v]) => !!v)
              .map(([k, v]) => ({ text: getFeatureLabel(k, v), included: true }))
            const displayPrice = plan.discountedPrice || plan.price?.current
            const originalPrice = plan.price?.original

            return (
              <Card
                key={plan.planId}
                className={`relative flex flex-col ${
                  plan.isPopular ? 'border-2 border-purple-600 shadow-lg' : 'border border-slate-200 dark:border-slate-700'
                } ${isCurrent ? 'ring-2 ring-green-500' : ''}`}
              >
                {plan.isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-purple-600 text-white px-3">Most Popular</Badge>
                  </div>
                )}
                {plan.isBestValue && (
                  <div className="absolute -top-3 right-4">
                    <Badge className="bg-amber-500 text-white px-3">Best Value</Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-3">
                  <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
                  <div className="mt-1">
                    <span className="text-3xl font-bold text-purple-600">₹{displayPrice}</span>
                    <span className="text-sm text-muted-foreground ml-1">
                      / {plan.intervalCount > 1 ? `${plan.intervalCount} ` : ''}{plan.interval}
                    </span>
                  </div>
                  {originalPrice && originalPrice > displayPrice && (
                    <p className="text-xs text-green-600 font-medium">
                      Save ₹{originalPrice - displayPrice} <span className="text-muted-foreground line-through">₹{originalPrice}</span>
                    </p>
                  )}
                  {plan.description && (
                    <p className="text-xs text-muted-foreground mt-1">{plan.description}</p>
                  )}
                </CardHeader>

                <CardContent className="space-y-3 flex-1 flex flex-col">
                  <ul className="space-y-2 flex-1">
                    {features.map((f, i) => {
                      const text = typeof f === 'string' ? f : f.text
                      const included = typeof f === 'object' ? f.included !== false : true
                      return (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          {included
                            ? <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                            : <X className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                          }
                          <span className={included ? '' : 'text-muted-foreground line-through'}>{text}</span>
                        </li>
                      )
                    })}
                  </ul>

                  {isCurrent ? (
                    <Button className="w-full mt-4 bg-slate-600 cursor-not-allowed text-white" disabled>
                      Current Plan
                    </Button>
                  ) : isDowngrade ? null : (
                    <Button
                      className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white"
                      disabled={buyingPlanId === plan.planId}
                      onClick={() => handleBuyPlan(plan.planId)}
                    >
                      {buyingPlanId === plan.planId
                        ? <><Loader className="w-4 h-4 animate-spin mr-2" /> Processing...</>
                        : currentPlanId ? 'Upgrade' : `Get ${plan.name}`
                      }
                    </Button>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Plan
