'use client'
import React from 'react'
import Faq from '@/components/website/Faq'
import LetTheWorld from '@/components/website/LetTheWorld'
import herobg from '@/public/images/mvadvertisement/herobg.png'
import { MainHeadingText, TwoHalfBoxes } from '@/components/FixedUiComponents'
import { Button } from '@/components/ui/button'
import { Anton } from 'next/font/google'

// Import the new icons for the marketing page
import aipowered from '@/public/images/mvmarketing/aipowered.png'
import campaing from '@/public/images/mvmarketing/campaing.png'
import fan from '@/public/images/mvmarketing/fan.png'
import playlist from '@/public/images/mvmarketing/playlist.png'
import qrcode from '@/public/images/mvmarketing/qrcode.png'
import targeted from '@/public/images/mvmarketing/targeted.png'
import video from '@/public/images/mvmarketing/video.png'
import { motion } from 'framer-motion'
import Image from 'next/image'
import ProcessFlow from '@/components/website/ProcessFlow'
import hiw1 from '@/public/images/mvmarketing/hiw1.png'
import hiw2 from '@/public/images/mvmarketing/hiw2.png'
import hiw3 from '@/public/images/mvmarketing/hiw3.png'
import hiw4 from '@/public/images/mvmarketing/hiw4.png'
import Link from 'next/link'

const anton = Anton({
    weight: ['400'],
    subsets: ['latin']
})

const howItWorkData = [
    {
        image: hiw1,
        heading: 'Consultation',
        text: 'Book a one-on-one session with our pros—personalized advice to level up your music journey.'
    },
    {
        image: hiw2,
        heading: 'Strategy Development',
        text: 'Craft a custom roadmap for your music career—strategies that align with your goals and fuel real growth.'
    },
    {
        image: hiw3,
        heading: 'Implementation',
        text: 'Turn strategy into action with smooth execution that brings your vision to life—step by step, beat by beat.'
    },
    {
        image: hiw4,
        heading: 'Monitoring & Analysis',
        text: 'Stay in the loop with real-time stats and deep insights to fine-tune your performance and grow smarter.'
    },
];


const page = () => {
    return (
        <div className="overflow-x-hidden ">
            <div
                style={{ backgroundImage: `url(${herobg.src})` }}
                className="bg-cover bg-center min-h-[80vh] w-full flex flex-col justify-center items-center pt-[150px]">
              
                <MainHeadingText text='Music Marketing'/>
                <div className="flex flex-wrap items-center  mb-8 gap-2 mt-0 relative z-10 text-white">
                    <h1 className="text-center text-xl">🚀 Campaigns That Connect</h1>
                    <div className="h-[20px] w-1 bg-[#652CD6]"></div>
                    <h1 className="text-center text-xl">🛡️ Results That Resonate</h1>
                   
                </div>
                <Button
                    variant="blue"
                    className="shadow-2xl  shadow-violet-600">
                    <Link href="/signup">
                    Get Started
                    </Link>
                </Button>
            </div>

            <TwoHalfBoxes
                item1={{
                    iconbg: '#632BDF',
                    icon: playlist,
                    title: 'Playlist Pitching & Influencer Campaigns',
                    items: [
                        'Editorial playlist submission via dashboard',
                        'Micro-influencer partnerships on Instagram, YouTube Shorts, and TikTok',
                        'Genre-specific influencer matching'
                    ]
                }}
                item2={{
                    iconbg: '#9729CA',
                    icon: campaing,
                    title: 'Campaign Analytics Dashboard',
                    items: [
                        'Real-time ad performance tracking (clicks, conversions, cost-per-stream)',
                        'Geo and demographic breakdowns',
                        'ROI insights for each campaign'
                    ]
                }}
            />

            <TwoHalfBoxes
                item1={{
                    iconbg: '#632BDF',
                    icon: targeted,
                    title: 'Targeted Ad Campaigns',
                    items: [
                        'Facebook, Instagram, and YouTube ad setup with genre/region targeting',
                        'Retargeting ads for fans who’ve streamed or visited artist pages',
                        'A/B testing for creatives and copy'
                    ]
                }}
                item2={{
                    iconbg: '#9729CA',
                    icon: qrcode,
                    title: 'QR Code-Enabled Merch & Posters',
                    items: [
                        'Scannable codes on t-shirts, sippers, or flyers that link to music or campaigns',
                        'Trackable analytics to measure fan engagement',
                        'Great for offline-to-online conversion at gigs or pop-ups'
                    ]
                }}
            />

            <TwoHalfBoxes
                item1={{
                    iconbg: '#632BDF',
                    icon: video,
                    title: 'Video & Audio Ad Creation',
                    items: [
                        'Short-form video ads for Instagram Reels, YouTube Shorts, and TikTok',
                        'Native audio ads for Spotify and JioSaavn',
                        'Voiceover + motion graphics support'
                    ]
                }}
                item2={{
                    iconbg: '#9729CA',
                    icon: fan,
                    title: 'Fan Engagement Tools',
                    items: [
                        'Contests, giveaways, and unlockable content (e.g., “Stream to Win”)',
                        'Email/SMS capture via landing pages',
                        'Custom fan journey automation (e.g., stream + follow + merch)'
                    ]
                }}
            />

           

            <div className="w-full p-20 flex justify-center items-top gap-[50px] max-md:flex-col max-md:gap-8 ">
                <motion.div
                    initial={{ x: -200, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.05 }}
                    viewport={{ once: true }}
                    className="w-[50%] h-auto shadow-custom bg-gradient-to-b from-[#1d2334] bg-[#151A27]  rounded-t-3xl px-14 py-10 text-white space-y-6">
                    <div
                        style={{ boxShadow: `0 0 30px 0px [#632BDF] `, backgroundColor: '#632BDF' }}
                        className={`w-[60px] h-[60px] p-2   rounded-xl `}>
                        <Image
                            src={aipowered}
                            alt="AI-Powered Campaign Suggestions"
                            className="w-full h-full"
                        />
                    </div>
                    <h1 className={`${anton.className} text-4xl`}>AI-Powered Campaign Suggestions</h1>
                    {[
                        'Smart recommendations based on genre, past performance, and audience behavior',
                        'Auto-budgeting and scheduling for optimal ad spend',
                        'Predictive analytics for campaign success'
                    ].map((item, index) => (
                        <div
                            key={index}
                            className="flex items-top mb-2">
                            <div className="mx-1 mt-1">•</div>
                            <h1
                                key={index}
                                className="text-gray-300 text-sm mx-3 my-1">
                                {' '}
                                {item}
                            </h1>
                        </div>
                    ))}
                </motion.div>
            </div>

             <div className='mt-10'>
                <h1 className={`${anton.className} text-4xl uppercase text-center text-white`}>How It Work</h1>

                <ProcessFlow data={howItWorkData} />
            </div>

            <LetTheWorld />
        </div>
    )
}

export default page
