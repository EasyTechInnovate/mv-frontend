'use client'
import Faq from '@/components/website/Faq'
import LetTheWorld from '@/components/website/LetTheWorld'
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import herobg from '@/public/images/mvadvertisement/herobg.png'
import { HeadingText, MainHeadingText } from '@/components/FixedUiComponents'
import { Button } from '@/components/ui/button'
import { FaIndianRupeeSign } from 'react-icons/fa6'
import { MdOutlineDone } from 'react-icons/md'
import { IoMdInformationCircleOutline } from 'react-icons/io'
import { PiCrownFill } from "react-icons/pi";
import { GiQueenCrown } from "react-icons/gi";


import { Anton } from 'next/font/google'
import Link from 'next/link'
import { createPaymentIntent, verifyPayment, getSubscriptionPlans, getUserProfile } from '@/services/api.services.js'
import ApplyToJoin from '@/components/website/ApplyToJoin'

const anton = Anton({
    weight: ['400'],
    subsets: ['latin']
})

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

const FEATURE_ORDER = Object.keys(FEATURE_LABELS);

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

const PageForArtists = () => {
    const [hoveredItem, setHoveredItem] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [dynamicPlans, setDynamicPlans] = useState({})
    const [plansList, setPlansList] = useState([]);
    const [comparisonFeatures, setComparisonFeatures] = useState([]);

    const getFeatureLabel = (key, value) => {
        let label = FEATURE_LABELS[key] || key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
        if (key === "supportHours") label = `${FEATURE_LABELS[key]}: ${SUPPORT_HOURS_LABELS[value] || value}`;
        if (key === "liveSupportTime") label = `${FEATURE_LABELS[key]}: ${LIVE_PROCESS_LABELS[value] || value}`;
        if (key === "revenueShare" && value?.percentage) label = `${value.percentage}% of the Net Revenue`;
        return label;
    }

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const response = await getSubscriptionPlans('artist')
                if (response?.data) {
                    const plansMap = {}
                    response.data.forEach(plan => {
                        plansMap[plan.planId] = plan
                    })
                    setDynamicPlans(plansMap)
                    setPlansList(response.data);

                    // Filter and order features for comparison
                    setComparisonFeatures(FEATURE_ORDER);
                }
            } catch (error) {
                console.error("Failed to fetch plans", error)
            }
        }
        fetchPlans()
    }, [])

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script')
            script.src = 'https://checkout.razorpay.com/v1/checkout.js'
            script.onload = () => resolve(true)
            script.onerror = () => resolve(false)
            document.body.appendChild(script)
        })
    }

    const handleSubscribe = async (planId) => {
        try {
            setIsLoading(true)
            const response = await createPaymentIntent({ planId })
            
            if (response.success) {
                const checkoutData = response.data
                const scriptLoaded = await loadRazorpayScript()
                if (!scriptLoaded) {
                    alert('Failed to load Razorpay SDK. Please try again.')
                    return
                }

                let userProfile = {}
                try {
                    const profileResponse = await getUserProfile()
                    if (profileResponse?.data?.user) {
                        userProfile = profileResponse.data.user
                    }
                } catch (e) {
                    console.log('User not logged in or profile fetch failed')
                }

                const options = {
                    key: checkoutData.razorpayKeyId || 'rzp_test_STPawDcpBFe3oE',
                    amount: checkoutData.amount * 100,
                    currency: checkoutData.currency,
                    name: 'Maheshwari Visuals',
                    description: 'Subscription Payment',
                    order_id: checkoutData.razorpayOrderId,
                    prefill: {
                        name: userProfile.firstName ? `${userProfile.firstName} ${userProfile.lastName}` : '',
                        email: userProfile.emailAddress || '',
                        contact: ''
                    },
                    theme: {
                        color: '#652CD6'
                    },
                    handler: async function (response) {
                        try {
                            await verifyPayment({
                                razorpayPaymentId: response.razorpay_payment_id,
                                razorpayOrderId: response.razorpay_order_id,
                                razorpaySignature: response.razorpay_signature,
                                planId: planId
                            })
                            alert('Payment successful and subscription activated! Please log in to your dashboard.')
                            window.location.href = '/signin'
                        } catch (err) {
                            console.error("Verification error", err)
                            alert('Payment verification failed. Please contact support.')
                        }
                    }
                }

                const razorpay = new window.Razorpay(options)
                razorpay.open()
            } else {
                alert(response.message || 'Failed to initiate payment')
            }
        } catch (err) {
            console.error("Subscription error", err)
            // If user is not authenticated, API might return 401. Handled by generic error for now.
            alert(err.response?.data?.message || err.message || "Failed to initiate subscription.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="overflow-x-hidden">
            <div className="min-h-screen overflow-x-hidden relative pt-1 ">
                <div
                    style={{ backgroundImage: `url(${herobg.src})` }}
                    className="bg-cover absolute bg-center h-[130vh]  w-full pt-[150px]"></div>

                <div className="relative flex flex-col items-center w-full mt-[150px]">
                    <MainHeadingText
                        text="Pick the Perfect Plan "
                        text2="for You"
                    />
                </div>

                <div className='relative flex flex-col sm:flex-row items-center justify-center w-full mt-10 gap-4 sm:gap-5 text-white px-6'>
                    <Button variant="ghost" className='w-full sm:w-[200px] border border-[#ffffff2d] sm:border-none'>
                        <Link href='/pricing/everyone'>Plans for Everyone</Link>
                    </Button>
                    <Button variant="blue" className='w-full sm:w-[200px]'>
                        <Link href='/pricing/for-artists'>Plans for Artists</Link>
                    </Button>
                    <Button variant="ghost" className='w-full sm:w-[200px] border border-[#ffffff2d] sm:border-none'>
                        <Link href='/pricing/for-labels'>Plans for Labels</Link>
                    </Button>
                </div>

                <div className="mt-20 sm:mt-30 flex flex-wrap justify-center gap-10 max-w-7xl mx-auto px-4">
                    {plansList.map((plan) => (
                        <div key={plan.planId} className={`flex flex-col w-full max-w-[350px] p-6 bg-[#0F0F0F] rounded-xl relative pb-40 ${plan.isBestValue ? 'border-2 border-yellow-400' : ''}`}>
                            {plan.isBestValue && (
                                <PiCrownFill className='text-yellow-300 absolute right-[-10px] top-[-10px] rotate-35 text-[70px]' />
                            )}
                            {plan.isPopular && !plan.isBestValue && (
                                <div className=" absolute top-[-10px] right-2 bg-[#652CD6] text-white px-4 py-1 rounded-full text-sm">Popular</div>
                            )}
                            <h1 className={`text-xl ${anton.className} text-white uppercase mb-4`}>{plan.name}</h1>
                            <div className="flex items-center gap-5 border-b border-gray-600 pb-8 mb-8">
                                <h1 className="text-[#652CD6] font-semibold text-4xl flex items-center">
                                    <FaIndianRupeeSign />
                                    {plan.price?.current}
                                </h1>
                                {plan.price?.original > plan.price?.current && (
                                    <h1 className="text-gray-300 opacity-70 text-2xl relative">
                                        {' '}
                                        <div className="w-full h-[2px] bg-gray-300 absolute top-[16px] left-0 "></div>{' '}
                                        <FaIndianRupeeSign className="inline-block" />
                                        {plan.price.original}
                                    </h1>
                                )}
                            </div>
                            <Link href="/signup">
                            <Button
                                disabled={isLoading}
                                // onClick={() => handleSubscribe(plan.planId)}
                                className={`w-full mb-8 text-white ${plan.isBestValue ? 'bg-[#FFC727] text-black hover:bg-[#e5b323]' : plan.isPopular ? 'bg-[#652CD6] hover:bg-[#5520b5]' : 'bg-[#0099FF] hover:bg-[#007acc]'}`}>
                                Subscribe Now
                            </Button>
                            </Link>

                            <div className="space-y-4">
                                {FEATURE_ORDER
                                    .filter(key => {
                                        const val = plan.features?.[key];
                                        if (typeof val === 'boolean') return val;
                                        if (typeof val === 'object') return val && Object.values(val).some(v => !!v);
                                        return !!val;
                                    })
                                    .map((key) => (
                                        <div
                                            key={key}
                                            className="flex justify-between items-center relative ">
                                            <div className="flex items-center gap-2">
                                                <MdOutlineDone className={`${plan.isBestValue ? 'text-[#FFC727] bg-[#FFC727]/10' : plan.isPopular ? 'text-[#652CD6] bg-[#652CD6]/10' : 'text-[#0099FF] bg-[#0099FF]/10'} w-8 h-8 p-2 rounded-full text-lg`} />
                                                <h1 className="text-gray-300 text-sm">{getFeatureLabel(key, plan.features[key])}</h1>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Compare Plan Section */}
                {plansList.length > 1 && (
                    <div className="flex flex-col items-center justify-center w-full mt-40 mb-20 px-4">
                        <h1 className={`text-4xl md:text-6xl ${anton.className} text-white uppercase mb-4 text-center`}>Compare Plan</h1>

                        <div className="w-full max-w-5xl bg-[#1A1E2B] rounded-xl p-4 sm:p-8 mt-10 md:mt-20 overflow-hidden">
                            <div className="overflow-x-auto w-full">
                                <div className="min-w-[800px]">
                                    {/* Table Header */}
                                    <div className={`grid gap-4 pb-8 text-gray-300 font-semibold text-lg`} style={{ gridTemplateColumns: `repeat(${plansList.length + 1}, 1fr)` }}>
                                        <div></div>
                                        {plansList.map(plan => (
                                            <div key={plan.planId} className="text-center">{plan.name}</div>
                                        ))}
                                    </div>

                                    {/* Table Rows */}
                                    {comparisonFeatures.map((fKey, index) => (
                                        <div
                                            key={fKey}
                                            className={`grid gap-4 py-4 border-b border-gray-800 last:border-b-0`}
                                            style={{ gridTemplateColumns: `repeat(${plansList.length + 1}, 1fr)` }}>
                                            <div className="text-gray-300 text-sm">{FEATURE_LABELS[fKey] || fKey}</div>
                                            {plansList.map(plan => {
                                                const val = plan.features?.[fKey];
                                                return (
                                                    <div key={plan.planId} className="text-center text-gray-400 text-sm">
                                                        {typeof val === 'boolean' ? (
                                                            val ? (
                                                                <MdOutlineDone className={`inline-block w-5 h-5 ${plan.isBestValue ? 'text-[#FFC727]' : plan.isPopular ? 'text-[#652CD6]' : 'text-[#0099FF]'}`} />
                                                            ) : (
                                                                '-'
                                                            )
                                                        ) : fKey === 'revenueShare' ? (
                                                            val?.percentage ? `${val.percentage}%` : '-'
                                                        ) : fKey === 'supportHours' ? (
                                                            SUPPORT_HOURS_LABELS[val] || val || '-'
                                                        ) : fKey === 'liveSupportTime' ? (
                                                            LIVE_PROCESS_LABELS[val] || val || '-'
                                                        ) : (
                                                            (typeof val === 'string' ? val : '-') || '-'
                                                        )}
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <ApplyToJoin />
            <Faq />
        </div>
    )
}

export default PageForArtists