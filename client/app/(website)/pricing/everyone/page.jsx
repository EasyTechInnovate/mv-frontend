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

import { Anton } from 'next/font/google'
import ApplyToJoin from '@/components/website/ApplyToJoin'
import { createPaymentIntent, verifyPayment, getSubscriptionPlans, getUserProfile } from '@/services/api.services.js'
const anton = Anton({
    weight: ['400'],
    subsets: ['latin']
})

const oneSongData = [
    { title: 'Per track release', info: 'Release one song per purchase.' },
    { title: '90% of the net revenue', info: 'You retain 90% of the net revenue generated from your track.' },
    { title: 'YouTube Content ID', info: 'Monetize your music on YouTube and protect it from unauthorized use.' },
    { title: 'Meta Content ID', info: 'Protect and monetize your music across Meta platforms (Facebook, Instagram).' },
    { title: 'Analytics Centre', info: 'Access detailed analytics on your streams, audience, and revenue.' },
    { title: 'Dolby Atmos Distribution', info: 'Distribute your music in immersive Dolby Atmos format.' },
    { title: 'Spotify Discovery Mode', info: 'Opt-in to Spotify Discovery Mode to increase your reach.' },
    { title: 'Available To All 150 Stores', info: 'Your music will be distributed to over 150 digital music stores and platforms worldwide.' },
    { title: 'Worldwide Availability', info: 'Your music will be available globally.' },
    { title: 'Free UPC Code', info: 'A unique UPC code will be provided for your release.' },
    { title: 'Free ISRC Code', info: 'A unique ISRC code will be provided for your track.' },
    { title: 'Lifetime Availability', info: 'Your music will remain on platforms indefinitely.' },
    { title: 'Support Time 24 Business Hours', info: 'Receive support within 24 business hours.' },
    { title: 'Live in 48 To 72 Business Hours', info: 'Your music will be live on platforms within 48 to 72 business hours.' }
]

const oneAlbumData = [
    { title: 'up to 9 track release', info: 'Release up to 9 tracks as part of one album.' },
    { title: '90% of the net revenue', info: 'You retain 90% of the net revenue generated from your album.' },
    { title: 'YouTube Content ID', info: 'Monetize your music on YouTube and protect it from unauthorized use.' },
    { title: 'Meta Content ID', info: 'Protect and monetize your music across Meta platforms (Facebook, Instagram).' },
    { title: 'Dolby Atmos Distribution', info: 'Distribute your music in immersive Dolby Atmos format.' },
    { title: 'Spotify Discovery Mode', info: 'Opt-in to Spotify Discovery Mode to increase your reach.' },
    { title: 'Analytics Centre', info: 'Access detailed analytics on your streams, audience, and revenue.' },
    { title: 'Available to all 150 stores', info: 'Your album will be distributed to over 150 digital music stores and platforms worldwide.' },
    { title: 'Worldwide availability', info: 'Your album will be available globally.' },
    { title: 'Free UPC Code', info: 'A unique UPC code will be provided for your album release.' },
    { title: 'Free ISRC Code', info: 'A unique ISRC code will be provided for each track in your album.' },
    { title: 'Lifetime availability', info: 'Your album will remain on platforms indefinitely.' },
    { title: 'Support Time 24 Business Hours', info: 'Receive support within 24 business hours.' },
    { title: 'Live in 48 to 72 Business Hours', info: 'Your album will be live on platforms within 48 to 72 business hours.' }
]

// Data for the comparison table
const comparisonData = [
    { feature: 'Royalty Share', oneSong: '90%', oneAlbum: '90%' },
    { feature: 'No. of Releases', oneSong: '1', oneAlbum: 'Upto 9' },
    { feature: 'YouTube Content ID', oneSong: true, oneAlbum: true },
    { feature: 'Meta Content ID', oneSong: true, oneAlbum: true },
    { feature: 'Analytics Centre', oneSong: true, oneAlbum: true },
    { feature: 'Available to all 150 stores', oneSong: true, oneAlbum: true },
    { feature: 'Dolby Atmos Distribution', oneSong: true, oneAlbum: true },
    { feature: 'Spotify Discovery Mode', oneSong: true, oneAlbum: true },
    { feature: 'Worldwide availability', oneSong: true, oneAlbum: true },
    { feature: 'Free UPC Code', oneSong: true, oneAlbum: true },
    { feature: 'Free ISRC Code', oneSong: true, oneAlbum: true },
    { feature: 'Lifetime availability', oneSong: true, oneAlbum: true },
    { feature: 'Support Time', oneSong: '24 Business hr', oneAlbum: '24 Business hr' },
    { feature: 'Live in', oneSong: '48 to 72 Business hr', oneAlbum: '48 to 72 Business hr' }
]

const page = () => {
    const [hoveredItem, setHoveredItem] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [dynamicPlans, setDynamicPlans] = useState({})

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const response = await getSubscriptionPlans('everyone')
                if (response?.data) {
                    const plansMap = {}
                    response.data.forEach(plan => {
                        plansMap[plan.planId] = plan
                    })
                    setDynamicPlans(plansMap)
                }
            } catch (error) {
                console.error('Failed to fetch plans', error)
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
                    if (profileResponse?.data?.user) userProfile = profileResponse.data.user
                } catch {}
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
                    },
                    theme: { color: '#652CD6' },
                    handler: async function (response) {
                        try {
                            await verifyPayment({
                                razorpayPaymentId: response.razorpay_payment_id,
                                razorpayOrderId: response.razorpay_order_id,
                                razorpaySignature: response.razorpay_signature,
                                planId,
                            })
                            alert('Payment successful! Please log in to your dashboard.')
                            window.location.href = '/signin'
                        } catch {
                            alert('Payment verification failed. Please contact support.')
                        }
                    },
                }
                new window.Razorpay(options).open()
            } else {
                alert(response.message || 'Failed to initiate payment')
            }
        } catch (err) {
            alert(err.response?.data?.message || err.message || 'Failed to initiate subscription.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="overflow-x-hidden ">
            <div className="min-h-[100vh] overflow-x-hidden relative pt-1 ">
                <div
                    style={{ backgroundImage: `url(${herobg.src})` }}
                    className="bg-cover absolute bg-center h-[130vh]  w-full pt-[150px]"></div>

                <div className="relative flex flex-col items-center w-full mt-[150px]">
                    <MainHeadingText
                        text="Pick the Perfect Plan "
                        text2="for You"
                    />
                </div>
                <div className="mt-40 flex flex-col md:flex-row items-center justify-center gap-10 ">
                    {/* One Song Plan */}
                    <div className="w-[350px] p-6 bg-[#0F0F0F] rounded-xl relative pb-40">
                        <h1 className={`text-xl ${anton.className} text-white uppercase mb-4`}>one song</h1>
                        <div className="flex items-center gap-5 border-b border-gray-600 pb-8 mb-8">
                            <h1 className="text-[#652CD6] font-semibold text-4xl flex items-center">
                                <FaIndianRupeeSign />
                                {dynamicPlans['one_song']?.price?.current || 199}
                            </h1>
                            <h1 className="text-gray-300 opacity-70 text-2xl relative">
                                {' '}
                                <div className="w-full h-[2px] bg-gray-300 absolute top-[16px] left-0 "></div>{' '}
                                <FaIndianRupeeSign className="inline-block" />
                                {dynamicPlans['one_song']?.price?.original || 399}
                            </h1>
                        </div>
                        <Button
                            disabled={isLoading}
                            onClick={() => handleSubscribe('one_song')}
                            className="w-full mb-8 bg-[#0099FF] text-white hover:bg-[#007acc]">
                            Subscribe Now
                        </Button>

                        {oneSongData.map((item, index) => (
                            <div
                                key={index}
                                className="flex justify-between items-center space-y-4 relative ">
                                <div className="flex items-center gap-2">
                                    <MdOutlineDone className="text-[#0099FF] bg-[#0099FF]/10 w-8 h-8 p-2 rounded-full text-lg" />
                                    <h1 className="text-gray-300 text-sm">{item.title}</h1>
                                </div>
                                <div
                                    className="relative "
                                    onMouseEnter={() => setHoveredItem({ type: 'song', index: index })}
                                    onMouseLeave={() => setHoveredItem(null)}>
                                    <IoMdInformationCircleOutline className="text-gray-500 w-6 h-6 text-lg cursor-pointer" />
                                    {hoveredItem?.type === 'song' && hoveredItem?.index === index && (
                                        <motion.div
                                            whileInView={{ y: -10 }}
                                            className="absolute bottom-full left-1/2 -translate-x-1/2  p-2 bg-gray-700 text-white text-xs rounded shadow-lg w-[200px]  border border-gray-600 z-10">
                                            {item.info}
                                        </motion.div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* One Album Plan */}
                    <div className="w-[350px] p-6 bg-[#0F0F0F] rounded-xl relative pb-40">
                        <h1 className={`text-xl ${anton.className} text-white uppercase mb-4`}>one album</h1>
                        <div className="flex items-center gap-5 border-b border-gray-600 pb-8 mb-8">
                            <h1 className="text-[#652CD6] font-semibold text-4xl flex items-center">
                                <FaIndianRupeeSign />
                                {dynamicPlans['one_album']?.price?.current || 499}
                            </h1>
                            <h1 className="text-gray-300 opacity-70 text-2xl relative">
                                {' '}
                                <div className="w-full h-[2px] bg-gray-300 absolute top-[16px] left-0 "></div>{' '}
                                <FaIndianRupeeSign className="inline-block" />
                                {dynamicPlans['one_album']?.price?.original || 699}
                            </h1>
                        </div>
                        <Button
                            disabled={isLoading}
                            onClick={() => handleSubscribe('one_album')}
                            className="w-full mb-8 bg-[#652CD6] text-white hover:bg-[#5520b5]">
                            Subscribe Now
                        </Button>

                        {oneAlbumData.map((item, index) => (
                            <div
                                key={index}
                                className="flex justify-between items-center space-y-4 relative">
                                <div className="flex items-center gap-2">
                                    <MdOutlineDone className="text-[#652CD6] bg-[#652CD6]/10 w-8 h-8 p-2 rounded-full text-lg" />
                                    <h1 className="text-gray-300 text-sm">{item.title}</h1>
                                </div>
                                <div
                                    className="relative "
                                    onMouseEnter={() => setHoveredItem({ type: 'album', index: index })}
                                    onMouseLeave={() => setHoveredItem(null)}>
                                    <IoMdInformationCircleOutline className="text-gray-500 w-6 h-6 text-lg cursor-pointer" />
                                    {hoveredItem?.type === 'album' && hoveredItem?.index === index && (
                                        <motion.div
                                            whileInView={{ y: -10 }}
                                            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-2 bg-gray-700 text-white text-xs rounded shadow-lg w-[200px]  border border-gray-600 z-10">
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

                    <div className="w-full max-w-3xl bg-[#1A1E2B] rounded-xl p-8 mt-20">
                        {/* Table Header */}
                        <div className="grid grid-cols-3 gap-4 pb-8  text-gray-300 font-semibold text-lg">
                            <div></div> {/* Empty cell for alignment */}
                            <div className="text-center">One Song</div>
                            <div className="text-center">One Album</div>
                        </div>

                        {/* Table Rows */}
                        {comparisonData.map((row, index) => (
                            <div
                                key={index}
                                className="grid grid-cols-3 gap-4 py-4 border-b border-gray-800 last:border-b-0">
                                <div className="text-gray-300 text-sm">{row.feature}</div>
                                <div className="text-center text-gray-400 text-sm">
                                    {typeof row.oneSong === 'boolean' ? (
                                        row.oneSong ? (
                                            <MdOutlineDone className="inline-block text-[#0099FF] w-5 h-5" />
                                        ) : (
                                            '-'
                                        )
                                    ) : (
                                        row.oneSong
                                    )}
                                </div>
                                <div className="text-center text-gray-400 text-sm">
                                    {typeof row.oneAlbum === 'boolean' ? (
                                        row.oneAlbum ? (
                                            <MdOutlineDone className="inline-block text-[#652CD6] w-5 h-5" />
                                        ) : (
                                            '-'
                                        )
                                    ) : (
                                        row.oneAlbum
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

export default page
