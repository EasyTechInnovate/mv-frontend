'use client'
import Faq from '@/components/website/Faq'
import LetTheWorld from '@/components/website/LetTheWorld'
import React from 'react'
import herobg from '@/public/images/mvadvertisement/herobg.png'
import { FullBox, MainHeadingText, TwoHalfBoxes } from '@/components/FixedUiComponents'
import { Button } from '@/components/ui/button'
import { Anton } from 'next/font/google'
import youtube from '@/public/images/mvadvertisement/youtube.png'
import metaads from '@/public/images/mvadvertisement/metaads.png'
import unified from '@/public/images/mvadvertisement/unified.png'
import grow from '@/public/images/mvadvertisement/grow.png'
import goviral from '@/public/images/mvadvertisement/goviral.png'
import unifiedimage from '@/public/images/mvadvertisement/unifiedimage.png'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import hiw1 from '@/public/images/mvadvertisement/hiw1.png'
import hiw2 from '@/public/images/mvadvertisement/hiw2.png'
import hiw3 from '@/public/images/mvadvertisement/hiw3.png'
import ProcessFlow from '@/components/website/ProcessFlow'

const howItWorkData = [
    {
        image: hiw1,
        heading: 'Create a Campaign',
        text: 'Choose between growing your reach, followers, and streams.'
    },
    {
        image: hiw2,
        heading: 'Select Your Audience and Set Your Budget',
        text: 'Pick your ideal fans and control your spending.'
    },
    {
        image: hiw3,
        heading: 'Launch your Campaign',
        text: 'Upload Your Ad assets, launch the campaign & watch your career grow'
    }
]

const anton = Anton({
    weight: ['400'],
    subsets: ['latin']
})
const page = () => {
    return (
        <div className="overflow-x-hidden ">
            <div
                style={{ backgroundImage: `url(${herobg.src})` }}
                className="bg-cover bg-center min-h-screen w-full flex flex-col justify-center items-center pt-[150px]">
                <MainHeadingText
                    text="The Quickest Way to"
                    text2="Grow Your Fanbase    "
                />
                <h1 className="w-[60%] max-md:w-[90%] my-5 text-gray-300 text-center">
                    {' '}
                    Focus on Music. Let AI Handle the Marketing. <br /> Maheswari Express saves time and grows your fanbase—automatically.
                </h1>
                <Button
                    variant="blue"
                    className="shadow-2xl mt-5 shadow-violet-600">
                    <Link href="/signup">
                    Start Free Now
                    </Link>
                </Button>
            </div>

            <TwoHalfBoxes
                item1={{
                    iconbg: '#632BDF',
                    icon: youtube,
                    title: 'YouTube Music & Shorts Campaigns',
                    items: [
                        'Skippable & Non-Skippable Ads: Target fans by genre, mood, or lyric',
                        'YouTube Shorts Ads: Promote 15-60 sec vertical videos to Gen Z audiences',
                        'Pre-Roll for Music Videos: Appear before trending music videos',
                        'Influencer Collabs: Partner with creators for reaction videos, lyric breakdowns, or dance trends'
                    ]
                }}
                item2={{
                    iconbg: '#9729CA',
                    icon: metaads,
                    title: 'Meta Ads (Instagram & Facebook)',
                    items: [
                        'Reels Ads: Short-form vertical video ads with music hooks',
                        'Story Ads: Swipe-up CTAs for pre-saves, merch, or streaming',
                        'Feed Ads: Targeted by genre, mood, or fan analytics',
                        'Lookalike Audiences: Reach fans similar to your top listeners',
                        'Smart Link Retargeting: Show ads to users who clicked your release link'
                    ]
                }}
            />

            <FullBox
                item1={{
                    iconbg: '#CE3AB3',
                    icon: unified,
                    title: 'Unified Campaign Dashboard',
                    items: [
                        'Real-time tracking across all platforms',
                        'Stream-to-ad spend ratio, fan growth, and ROI',
                        'Exportable reports for artists and labels',
                        'Automated AI analysis of ad reports'
                    ],
                    image: unifiedimage
                }}
            />

            <TwoHalfBoxes
                item1={{
                    iconbg: '#632BDF',
                    icon: grow,
                    title: 'Influencer Reels & UGC Campaigns',
                    items: [
                        'Micro-Influencer Network: Collaborate with creators in music, fashion, or lifestyle',
                        'Trend Activation: Launch dance, lyric, or visual trends tied to your song',
                        'UGC Licensing: Repurpose influencer content into paid ads',
                        'Performance-Based Payouts: Pay per engagement or conversion'
                    ]
                }}
                item2={{
                    iconbg: '#9729CA',
                    icon: grow,
                    title: 'Spotify Ads & Growth Tools',
                    items: [
                        'Audio Ads: Run 15-30 sec ads between songs on Spotify Free',
                        'Video Takeover: Full-screen video ads when users are actively Browse',
                        'Canvas Integration: Looping visuals with tracks to boost engagement',
                        'Sponsored Playlists: Feature artist tracks in curated playlists'
                    ]
                }}
            />

            <motion.div
                initial={{ y: 200, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.05 }}
                viewport={{ once: true }}
                className="w-full px-40 py-20 flex justify-between items-top gap-[50px] max-md:flex-col max-md:gap-8 ">
                <div className="w-full h-auto  bg-[#1A1E2B]  rounded-3xl px-14 py-10 text-white space-y-6 flex justify-between gap-4 ">
                    <div className="w-[50%] space-y-6">
                        <h1 className={`${anton.className} text-4xl`}>Go Viral Faster — MV Advertisment for Your Tracks</h1>

                        <h1 className="text-gray-300 text-sm  my-1 mr-2">
                            {' '}
                            Get your music in front of the right audience without the guesswork. With built-in analytics and targeted reach, Express
                            Ads helps you grow streams, followers, and engagement all from one dashboard.
                        </h1>

                        <Button
                            variant="blue"
                            className="mt-4">
                            {' '}
                            <Link href={'#'}> Create a campaing </Link>{' '}
                        </Button>
                    </div>
                    <div className="w-[40%] h-[250px] flex items-center justify-center">
                        <Image
                            src={goviral}
                            alt="go-viral"
                            style={{ boxShadow: '0 0 10px 0 #BB9BFF' }}
                            className="w-[90%] h-full  rounded-xl"
                        />
                    </div>
                </div>
            </motion.div>

            <div className='mt-10'>
                <h1 className={`${anton.className} text-4xl uppercase text-center text-white`}>How It Work</h1>

                <ProcessFlow data={howItWorkData} />
            </div>

            <Faq />
            <LetTheWorld />
        </div>
    )
}

export default page
