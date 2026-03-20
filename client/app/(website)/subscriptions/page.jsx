'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getSubscriptionPlans, createPaymentIntent, verifyPayment, getUserProfile } from '@/services/api.services'
import { FaIndianRupeeSign } from 'react-icons/fa6'
import { MdOutlineDone } from 'react-icons/md'
import { PiCrownFill } from "react-icons/pi"
import toast from 'react-hot-toast'
const SubscriptionsPage = () => {
    const router = useRouter()
    const [plans, setPlans] = useState([])
    const [loading, setLoading] = useState(true)
    const [processingPlanId, setProcessingPlanId] = useState(null)

    useEffect(() => {
        // Check if user is logged in
        const accessToken = localStorage.getItem('accessToken')
        if (!accessToken) {
            router.push('/signup')
            return
        }

        fetchPlans()
    }, [router])

    const fetchPlans = async () => {
        try {
            const response = await getSubscriptionPlans()
            if (response.success) {
                setPlans(response.data)
            }
        } catch (error) {
            console.error('Error fetching plans:', error)
            toast.error('Failed to load subscription plans')
        } finally {
            setLoading(false)
        }
    }

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script')
            script.src = 'https://checkout.razorpay.com/v1/checkout.js'
            script.onload = () => resolve(true)
            script.onerror = () => resolve(false)
            document.body.appendChild(script)
        })
    }

    const handleChoosePlan = async (planId) => {
        setProcessingPlanId(planId)

        try {
            // Create payment intent
            const loadingToast = toast.loading('Preparing payment...')

            let paymentIntentResponse
            try {
                paymentIntentResponse = await createPaymentIntent({ planId })
                toast.dismiss(loadingToast)

                if (!paymentIntentResponse.success) {
                    throw new Error('Failed to create payment intent')
                }
            } catch (apiError) {
                toast.dismiss(loadingToast)
                console.error('API Error:', apiError)
                toast.error('Failed to initiate payment. Please try again.')
                setProcessingPlanId(null)
                return
            }

            const checkoutData = paymentIntentResponse.data

            // Razorpay Flow
            const scriptLoaded = await loadRazorpayScript()
                if (!scriptLoaded) {
                    toast.error('Failed to load Razorpay SDK. Please try again.')
                    setProcessingPlanId(null)
                    return
                }

                const profileResponse = await getUserProfile()
                const userProfile = profileResponse.data.user

                const options = {
                    key: checkoutData.razorpayKeyId || 'rzp_test_STPawDcpBFe3oE',
                    amount: checkoutData.amount * 100,
                    currency: checkoutData.currency,
                    name: 'Maheshwari Visuals',
                    description: 'Subscription Payment',
                    order_id: checkoutData.razorpayOrderId,
                    prefill: {
                        name: `${userProfile.firstName} ${userProfile.lastName}`,
                        email: userProfile.emailAddress,
                        contact: ''
                    },
                    theme: {
                        color: '#652CD6'
                    },
                    handler: async function (response) {
                        const verifyToast = toast.loading('Verifying payment...')
                        try {
                            const verificationData = {
                                razorpayPaymentId: response.razorpay_payment_id,
                                razorpayOrderId: response.razorpay_order_id,
                                razorpaySignature: response.razorpay_signature,
                                planId: planId
                            }
                            const verifyResponse = await verifyPayment(verificationData)

                            if (verifyResponse.success) {
                                toast.success('Payment successful! Your subscription is now active.', { id: verifyToast })
                                setTimeout(() => router.push('/app'), 1500)
                            }
                        } catch (error) {
                            console.error('Payment verification error:', error)
                            toast.error('Payment verification failed. Please contact support.', { id: verifyToast })
                        } finally {
                            setProcessingPlanId(null)
                        }
                    },
                    modal: {
                        ondismiss: function () {
                            setProcessingPlanId(null)
                        }
                    }
                }

                const razorpay = new window.Razorpay(options)
                razorpay.open()
        } catch (error) {
            console.error('Payment initiation error:', error)
            const errorMessage = error.response?.data?.message || 'Failed to initiate payment. Please try again.'
            toast.error(errorMessage)
            setProcessingPlanId(null)
        }
    }

    const renderFeatureValue = (value) => {
        if (typeof value === 'boolean') {
            return value ? <MdOutlineDone className="text-[#0099FF] w-5 h-5 mx-auto" /> : '-'
        }
        if (value === null || value === undefined) {
            return '-'
        }
        return value
    }

    const getFeaturesList = (plan) => {
        const features = []
        const f = plan.features

        if (f.revenueShare?.description) features.push({ title: f.revenueShare.description, enabled: true })
        if (f.unlimitedReleases) features.push({ title: 'Unlimited Release', enabled: true })
        if (f.artistProfile) features.push({ title: 'Artist Profile', enabled: true })
        if (f.collaborateWithOthers) features.push({ title: 'Collaborate with Others', enabled: true })
        if (f.metaContentId) features.push({ title: 'Meta Content ID', enabled: true })
        if (f.youtubeContentId) features.push({ title: 'YouTube Content ID', enabled: true })
        if (f.analyticsDemo) features.push({ title: 'Analytics Centre', enabled: true })
        if (f.spotifyDiscoveryMode) features.push({ title: 'Spotify Discovery Mode', enabled: true })
        if (f.assistedPlaylists) features.push({ title: 'Assisted Playlists', enabled: true })
        if (f.preReleasePromo) features.push({ title: 'Pre-Release Promo', enabled: true })
        if (f.freeUpcCode) features.push({ title: 'Free UPC Code', enabled: true })
        if (f.freeIsrcCode) features.push({ title: 'Free ISRC Code', enabled: true })
        if (f.lifetimeAvailability) features.push({ title: 'Lifetime Availability', enabled: true })
        if (f.supportHours) features.push({ title: `Support Time ${f.supportHours.replace('_', ' ')}`, enabled: true })
        if (f.worldwideAvailability) features.push({ title: 'Worldwide Availability', enabled: true })
        if (f.dailyArtistDistribution) features.push({ title: 'Daily Artist Distribution', enabled: true })

        return features
    }

    if (loading) {
        return (
            <div className="bg-[#151A27] min-h-screen flex items-center justify-center">
                <div className="text-white text-xl">Loading subscription plans...</div>
            </div>
        )
    }

    return (
        <div className="bg-[#151A27] min-h-screen w-full overflow-hidden py-10 pt-[120px]">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
                        Pick the Perfect Plan for You
                    </h1>
                    <p className="text-gray-400 text-lg">
                        Choose a subscription plan that fits your needs
                    </p>
                </div>

                {/* Plans Grid */}
                <div className="flex flex-wrap justify-center gap-8 mb-16">
                    {plans.map((plan) => (
                        <div
                            key={plan.planId}
                            className={`w-[350px] p-6 bg-[#0F0F0F] rounded-xl relative ${plan.isBestValue ? 'border-2 border-yellow-400' : ''
                                }`}>
                            {plan.isBestValue && (
                                <PiCrownFill className='text-yellow-300 absolute right-[-20px] top-[-20px] rotate-[35deg] text-[60px]' />
                            )}
                            {plan.isPopular && !plan.isBestValue && (
                                <div className="absolute top-[-12px] right-4 bg-[#652CD6] text-white px-4 py-1 rounded-full text-sm">
                                    Popular
                                </div>
                            )}

                            {/* Plan Header */}
                            <h2 className="text-2xl font-bold text-white uppercase mb-4">
                                {plan.name}
                            </h2>

                            {/* Pricing */}
                            <div className="flex flex-wrap items-center gap-2 border-b border-gray-600 pb-6 mb-6">
                                <h3 className="text-[#652CD6] font-semibold text-4xl flex items-center">
                                    <FaIndianRupeeSign />
                                    {plan.price.current}
                                </h3>
                                {plan.price.original > plan.price.current && (
                                    <h3 className="text-gray-300 opacity-70 text-2xl relative">
                                        <div className="w-full h-[2px] bg-gray-300 absolute top-[16px] left-0"></div>
                                        <FaIndianRupeeSign className="inline-block" />
                                        {plan.price.original}
                                    </h3>
                                )}
                                <h3 className="text-gray-300 opacity-70 text-sm">
                                    /{plan.interval.toUpperCase()}
                                </h3>
                            </div>

                            {/* Description */}
                            {plan.description && (
                                <p className="text-gray-400 text-sm mb-4">{plan.description}</p>
                            )}

                            {/* Features */}
                            <div className="space-y-3 mb-8">
                                {getFeaturesList(plan).map((feature, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <MdOutlineDone
                                            className={`${plan.isBestValue
                                                ? 'text-[#FFC727] bg-[#FFC727]/10'
                                                : plan.isPopular
                                                    ? 'text-[#652CD6] bg-[#652CD6]/10'
                                                    : 'text-[#0099FF] bg-[#0099FF]/10'
                                                } w-6 h-6 p-1 rounded-full flex-shrink-0`}
                                        />
                                        <span className="text-gray-300 text-sm">{feature.title}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Choose Button */}
                            <button
                                onClick={() => handleChoosePlan(plan.planId)}
                                disabled={processingPlanId === plan.planId}
                                className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 ${plan.isBestValue
                                    ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black'
                                    : plan.isPopular
                                        ? 'bg-gradient-to-r from-[#652CD6] to-[#0466C7] hover:from-[#7340e0] hover:to-[#0577d8] text-white'
                                        : 'bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white'
                                    } ${processingPlanId === plan.planId ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                                    }`}>
                                {processingPlanId === plan.planId ? 'Processing...' : 'Choose Plan'}
                            </button>
                        </div>
                    ))}
                </div>

                {/* Help Text */}
                <div className="text-center mb-10">
                    <p className="text-gray-400 text-sm">
                        Need help choosing? <a href="/contact" className="text-[#652CD6] hover:underline">Contact us</a>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default SubscriptionsPage
