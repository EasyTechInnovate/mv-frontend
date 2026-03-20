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
import ApplyToJoin from '@/components/website/ApplyToJoin'
import Link from 'next/link'
import { createPaymentIntent, verifyPayment, getSubscriptionPlans, getUserProfile } from '@/services/api.services.js'

const anton = Anton({
    weight: ['400'],
    subsets: ['latin']
})

const standardDataLabels = [
    { title: 'Unlimited Release', info: 'Release an unlimited number of tracks.' },
    { title: 'Unlimited Artists', info: 'Manage an unlimited number of artist profiles.' },
    { title: 'One Label', info: 'Manage a single label profile.' },
    { title: '70% Of The Net Revenue', info: 'You retain 70% of the net revenue generated from your releases.' },
    { title: 'YouTube Content ID', info: 'Monetize your music on YouTube and protect it from unauthorized use.' },
    { title: 'Meta Content ID', info: 'Protect and monetize your music across Meta platforms (Facebook, Instagram).' },
    { title: 'Analytics Centre', info: 'Access detailed analytics on your streams, audience, and revenue.' },
    { title: 'Artist Help Center', info: 'Access support and resources through the Artist Help Center.' },
    { title: 'Available to all 150 stores', info: 'Your music will be distributed to over 150 digital music stores and platforms worldwide.' },
    { title: 'Worldwide availability', info: 'Your music will be available globally.' },
    { title: 'Free UPC Code', info: 'A unique UPC code will be provided for each release.' },
    { title: 'Free ISRC Code', info: 'A unique ISRC code will be provided for each track.' },
    { title: 'Lifetime availability', info: 'Your music will remain on platforms indefinitely.' },
    { title: 'Support Time 48 Business Hours', info: 'Receive support within 48 business hours.' },
    { title: 'Live in 48 to 72 Business Hours', info: 'Your music will be live on platforms within 48 to 72 business hours.' }
]

const popularDataLabels = [
    { title: 'Unlimited release', info: 'Release an unlimited number of tracks.' },
    { title: 'Unlimited Artists', info: 'Manage an unlimited number of artist profiles.' },
    { title: 'One Label', info: 'Manage a single label profile.' },
    { title: '80% of the net revenue', info: 'You retain 80% of the net revenue generated from your releases.' },
    { title: 'YouTube Content ID', info: 'Monetize your music on YouTube and protect it from unauthorized use.' },
    { title: 'Meta Content ID', info: 'Protect and monetize your music across Meta platforms (Facebook, Instagram).' },
    { title: 'YouTube OAC', info: 'Access a YouTube Official Artist Channel for artists under your label.' },
    { title: 'Analytics Centre', info: 'Access detailed analytics on your streams, audience, and revenue.' },
    { title: 'Artist Help Center', info: 'Access support and resources through the Artist Help Center.' },
    { title: 'Dolby Atmos Distribution', info: 'Distribute your music in immersive Dolby Atmos format.' },
    { title: 'Available to all 150 stores', info: 'Your music will be distributed to over 150 digital music stores and platforms worldwide.' },
    { title: 'Worldwide availability', info: 'Your music will be available globally.' },
    { title: 'Free UPC Code', info: 'A unique UPC code will be provided for each release.' },
    { title: 'Free ISRC Code', info: 'A unique ISRC code will be provided for each track.' },
    { title: 'Lifetime availability', info: 'Your music will remain on platforms indefinitely.' },
    { title: 'Support Time 48 Business Hours', info: 'Receive support within 48 business hours.' },
    { title: 'Live in 48 to 72 Business Hours', info: 'Your music will be live on platforms within 48 to 72 business hours.' }
]

const bestValueDataLabels = [
    { title: 'Unlimited release', info: 'Release an unlimited number of tracks.' },
    { title: 'Unlimited Artists', info: 'Manage an unlimited number of artist profiles.' },
    { title: 'One Label', info: 'Manage a single label profile.' },
    { title: '95% of the net revenue', info: 'You retain 95% of the net revenue generated from your releases.' },
    { title: 'YouTube Content ID', info: 'Monetize your music on YouTube and protect it from unauthorized use.' },
    { title: 'Meta Content ID', info: 'Protect and monetize your music across Meta platforms (Facebook, Instagram).' },
    { title: 'YouTube OAC', info: 'Access a YouTube Official Artist Channel for artists under your label.' },
    { title: 'Analytics Centre', info: 'Access detailed analytics on your streams, audience, and revenue.' },
    { title: 'Artist Help Center', info: 'Access support and resources through the Artist Help Center.' },
    { title: 'Dolby Atmos Distribution', info: 'Distribute your music in immersive Dolby Atmos format.' },
    { title: 'Spotify Discovery Mode', info: 'Opt-in to Spotify Discovery Mode to increase your reach.' },
    { title: 'Available to all 150 stores', info: 'Your music will be distributed to over 150 digital music stores and platforms worldwide.' },
    { title: 'Worldwide availability', info: 'Your music will be available globally.' },
    { title: 'Free UPC Code', info: 'A unique UPC code will be provided for each release.' },
    { title: 'Free ISRC Code', info: 'A unique ISRC code will be provided for each track.' },
    { title: 'Lifetime availability', info: 'Your music will remain on platforms indefinitely.' },
    { title: 'Support Time 24 Business Hours', info: 'Receive support within 24 business hours.' },
    { title: 'Live in 48 to 72 Business Hours', info: 'Your music will be live on platforms within 48 to 72 business hours.' }
]

// Data for the comparison table
const comparisonDataLabels = [
    { feature: 'Royalty Share', standard: '70%', popular: '80%', bestValue: '95%' },
    { feature: 'No. of Releases', standard: 'Unlimited', popular: 'Unlimited', bestValue: 'Unlimited' },
    { feature: 'Unlimited Artists', standard: true, popular: true, bestValue: true },
    { feature: 'One Label', standard: true, popular: true, bestValue: true },
    { feature: 'YouTube Content ID', standard: true, popular: true, bestValue: true },
    { feature: 'Meta Content ID', standard: true, popular: true, bestValue: true },
    { feature: 'YouTube OAC', standard: false, popular: true, bestValue: true },
    { feature: 'Analytics Centre', standard: true, popular: true, bestValue: true },
    { feature: 'Artist Help Center', standard: true, popular: true, bestValue: true },
    { feature: 'Available to all 150 stores', standard: true, popular: true, bestValue: true },
    { feature: 'Dolby Atmos Distribution', standard: false, popular: true, bestValue: true },
    { feature: 'Spotify Discovery Mode', standard: false, popular: false, bestValue: true },
    { feature: 'Worldwide availability', standard: true, popular: true, bestValue: true },
    { feature: 'Free UPC Code', standard: true, popular: true, bestValue: true },
    { feature: 'Free ISRC Code', standard: true, popular: true, bestValue: true },
    { feature: 'Lifetime availability', standard: true, popular: true, bestValue: true },
    { feature: 'Support Time', standard: '48 Business hr', popular: '48 Business hr', bestValue: '24 Business hr' },
    { feature: 'Live in', standard: '48 to 72 Business hr', popular: '48 to 72 Business hr', bestValue: '48 to 72 Business hr' }
]

const PageForLabels = () => {
    const [hoveredItem, setHoveredItem] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [dynamicPlans, setDynamicPlans] = useState({})

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const response = await getSubscriptionPlans()
                if (response?.data) {
                    const plansMap = {}
                    response.data.forEach(plan => {
                        plansMap[plan.planId] = plan
                    })
                    setDynamicPlans(plansMap)
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
            <div className="min-h-[100vh] overflow-x-hidden relative pt-1 ">
                <div
                    style={{ backgroundImage: `url(${herobg.src})` }}
                    className="bg-cover absolute bg-center h-[130vh] w-full pt-[150px]"></div>

                <div className="relative flex flex-col items-center w-full mt-[150px]">
                    <MainHeadingText
                        text="Pick the Perfect Plan "
                        text2="for You"
                    />
                </div>

                <div className='relative flex items-center justify-center w-full mt-10 gap-5 text-white'>
                    <Button variant="ghost" className='w-[200px] '><Link href='/pricing/everyone' > Plans for Everyone </Link> </Button>
                    <Button variant="ghost" className='w-[200px] '> <Link href='/pricing/for-artists' > Plans for Artists</Link> </Button>
                    <Button variant="blue" className='w-[200px] '> <Link href='/pricing/for-labels'>Plans for Labels</Link> </Button>
                </div>

                <div className="mt-30 flex flex-col lg:flex-row justify-center max-lg:items-center gap-10">
                    {/* Standard Plan */}
                    <div className="w-[350px] mt-10 p-6 bg-[#0F0F0F] rounded-xl relative pb-40">
                        <h1 className={`text-xl ${anton.className} text-white uppercase mb-4`}>Maheshwari Standard</h1>
                        <div className="flex flex-wrap items-center gap-2 border-b border-gray-600 pb-8 mb-8">
                            <h1 className="text-[#652CD6] font-semibold text-4xl flex items-center">
                                <FaIndianRupeeSign />
                                {dynamicPlans['label_standard']?.price?.current || 1499}
                            </h1>
                            <h1 className="text-gray-300 opacity-70 text-2xl relative">
                                {' '}
                                <div className="w-full h-[2px] bg-gray-300 absolute top-[16px] left-0 "></div>{' '}
                                <FaIndianRupeeSign className="inline-block" />
                                {dynamicPlans['label_standard']?.price?.original || 2999}
                            </h1>
                            <h1 className="text-gray-300 opacity-70 text-sm relative">
                                /3 MONTHS
                            </h1>
                        </div>

                        <Button 
                            disabled={isLoading} 
                            onClick={() => handleSubscribe('label_standard')} 
                            className="w-full mb-8 bg-[#0099FF] text-white hover:bg-[#007acc]">
                            Subscribe Now
                        </Button>

                        {standardDataLabels.map((item, index) => (
                            <div
                                key={index}
                                className="flex justify-between items-center space-y-4 relative ">
                                <div className="flex items-center gap-2">
                                    <MdOutlineDone className="text-[#0099FF] bg-[#0099FF]/10 w-8 h-8 p-2 rounded-full text-lg" />
                                    <h1 className="text-gray-300 text-sm">{item.title}</h1>
                                </div>
                                <div
                                    className="relative "
                                    onMouseEnter={() => setHoveredItem({ type: 'standard', index: index })}
                                    onMouseLeave={() => setHoveredItem(null)}>
                                    <IoMdInformationCircleOutline className="text-gray-500 w-6 h-6 text-lg cursor-pointer" />
                                    {hoveredItem?.type === 'standard' && hoveredItem?.index === index && (
                                        <motion.div
                                            whileInView={{ y: -10 }}
                                            className="absolute bottom-full left-1/2 -translate-x-1/2 p-2 bg-gray-700 text-white text-xs rounded shadow-lg w-[200px] border border-gray-600 z-10">
                                            {item.info}
                                        </motion.div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Popular Plan */}
                    <div className="w-[350px] mt-0 p-6 bg-[#0F0F0F] rounded-xl relative pb-40 border border-yellow-400">
                        <PiCrownFill className='text-yellow-300 absolute right-[-30px] top-[-30px] rotate-[35deg] text-[70px]' />
                        <h1 className={`text-xl ${anton.className} text-white uppercase mb-4`}>Maheshwari popular</h1>
                        <div className="flex flex-wrap items-center gap-2 border-b border-gray-600 pb-8 mb-8">
                            <h1 className="text-[#652CD6] font-semibold text-4xl flex items-center">
                                <FaIndianRupeeSign />
                                {dynamicPlans['label_popular']?.price?.current || 2499}
                            </h1>
                            <h1 className="text-gray-300 opacity-70 text-2xl relative">
                                {' '}
                                <div className="w-full h-[2px] bg-gray-300 absolute top-[16px] left-0 "></div>{' '}
                                <FaIndianRupeeSign className="inline-block" />
                                {dynamicPlans['label_popular']?.price?.original || 3999}
                            </h1>
                            <h1 className="text-gray-300 opacity-70 text-sm relative">
                                /3 MONTHS
                            </h1>
                        </div>

                        <Button 
                            disabled={isLoading} 
                            onClick={() => handleSubscribe('label_popular')} 
                            className="w-full mb-8 bg-[#FFC727] text-black hover:bg-[#e5b323]">
                            Subscribe Now
                        </Button>

                        {popularDataLabels.map((item, index) => (
                            <div
                                key={index}
                                className="flex justify-between items-center space-y-4 relative">
                                <div className="flex items-center gap-2">
                                    <MdOutlineDone className="text-[#FFC727] bg-[#FFC727]/10 w-8 h-8 p-2 rounded-full text-lg" />
                                    <h1 className="text-gray-300 text-sm">{item.title}</h1>
                                </div>
                                <div
                                    className="relative "
                                    onMouseEnter={() => setHoveredItem({ type: 'popular', index: index })}
                                    onMouseLeave={() => setHoveredItem(null)}>
                                    <IoMdInformationCircleOutline className="text-gray-500 w-6 h-6 text-lg cursor-pointer" />
                                    {hoveredItem?.type === 'popular' && hoveredItem?.index === index && (
                                        <motion.div
                                            whileInView={{ y: -10 }}
                                            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-2 bg-gray-700 text-white text-xs rounded shadow-lg w-[200px] border border-gray-600 z-10">
                                            {item.info}
                                        </motion.div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Best Value Plan */}
                    <div className="w-[350px] mt-10 p-6 bg-[#0F0F0F] rounded-xl relative pb-40">
                        <h1 className={`text-xl ${anton.className} text-white uppercase mb-4`}>Maheshwari Best Value</h1>
                        <div className="flex flex-wrap items-center gap-2 border-b border-gray-600 pb-8 mb-8">
                            <h1 className="text-[#652CD6] font-semibold text-4xl flex items-center">
                                <FaIndianRupeeSign />
                                {dynamicPlans['label_best_value']?.price?.current || 1499}
                            </h1>
                            <h1 className="text-gray-300 opacity-70 text-2xl relative">
                                {' '}
                                <div className="w-full h-[2px] bg-gray-300 absolute top-[16px] left-0 "></div>{' '}
                                <FaIndianRupeeSign className="inline-block" />
                                {dynamicPlans['label_best_value']?.price?.original || 1999}
                            </h1>
                            <h1 className="text-gray-300 opacity-70 text-sm relative">
                                /3 MONTHS
                            </h1>
                        </div>

                        <Button 
                            disabled={isLoading} 
                            onClick={() => handleSubscribe('label_best_value')} 
                            className="w-full mb-8 bg-[#652CD6] text-white hover:bg-[#502bb5]">
                            Subscribe Now
                        </Button>

                        {bestValueDataLabels.map((item, index) => (
                            <div
                                key={index}
                                className="flex justify-between items-center space-y-4 relative">
                                <div className="flex items-center gap-2">
                                    <MdOutlineDone className="text-[#652CD6] bg-[#652CD6]/10 w-8 h-8 p-2 rounded-full text-lg" />
                                    <h1 className="text-gray-300 text-sm">{item.title}</h1>
                                </div>
                                <div
                                    className="relative "
                                    onMouseEnter={() => setHoveredItem({ type: 'bestValue', index: index })}
                                    onMouseLeave={() => setHoveredItem(null)}>
                                    <IoMdInformationCircleOutline className="text-gray-500 w-6 h-6 text-lg cursor-pointer" />
                                    {hoveredItem?.type === 'bestValue' && hoveredItem?.index === index && (
                                        <motion.div
                                            whileInView={{ y: -10 }}
                                            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-2 bg-gray-700 text-white text-xs rounded shadow-lg w-[200px] border border-gray-600 z-10">
                                            {item.info}
                                        </motion.div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Compare Plan Section */}
                <div className="flex flex-col items-center justify-center w-full mt-40 mb-20">
                    <h1 className={`text-6xl ${anton.className} text-white uppercase mb-4`}>Compare Plan</h1>

                    <div className="w-full max-w-5xl bg-[#1A1E2B] rounded-xl p-8 mt-20">
                        {/* Table Header */}
                        <div className="grid grid-cols-4 gap-4 pb-8 text-gray-300 font-semibold text-lg">
                            <div></div> {/* Empty cell for alignment */}
                            <div className="text-center">Maheshwari Standard</div>
                            <div className="text-center">Maheshwari Popular</div>
                            <div className="text-center">Maheshwari Best Value</div>
                        </div>

                        {/* Table Rows */}
                        {comparisonDataLabels.map((row, index) => (
                            <div
                                key={index}
                                className="grid grid-cols-4 gap-4 py-4 border-b border-gray-800 last:border-b-0">
                                <div className="text-gray-300 text-sm">{row.feature}</div>
                                <div className="text-center text-gray-400 text-sm">
                                    {typeof row.standard === 'boolean' ? (
                                        row.standard ? (
                                            <MdOutlineDone className="inline-block text-[#0099FF] w-5 h-5" />
                                        ) : (
                                            '-'
                                        )
                                    ) : (
                                        row.standard
                                    )}
                                </div>
                                <div className="text-center text-gray-400 text-sm">
                                    {typeof row.popular === 'boolean' ? (
                                        row.popular ? (
                                            <MdOutlineDone className="inline-block text-[#652CD6] w-5 h-5" />
                                        ) : (
                                            '-'
                                        )
                                    ) : (
                                        row.popular
                                    )}
                                </div>
                                <div className="text-center text-gray-400 text-sm">
                                    {typeof row.bestValue === 'boolean' ? (
                                        row.bestValue ? (
                                            <MdOutlineDone className="inline-block text-[#FFC727] w-5 h-5" />
                                        ) : (
                                            '-'
                                        )
                                    ) : (
                                        row.bestValue
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <ApplyToJoin />
            <Faq />
        </div>
    )
}

export default PageForLabels