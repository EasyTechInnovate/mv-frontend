import Faq from '@/components/website/Faq'
import LetTheWorld from '@/components/website/LetTheWorld'
import React from 'react'
import herobg from '@/public/images/forartist/herobg.png'
import { FullBox, MainHeadingText, TwoHalfBoxes } from '@/components/FixedUiComponents'
import { Button } from '@/components/ui/button'
import fastmusic from '@/public/images/forartist/fastmusic.png'
import royalty from '@/public/images/forartist/royalty.png'
import promotional from '@/public/images/forartist/promotional.png'
import support from '@/public/images/forartist/support.png'
import artistdashboard from '@/public/images/forartist/artistdashboard.png'
import artistdashboardicon from '@/public/images/forartist/artistdashboardicon.png'
import brandandmerchicon from '@/public/images/forartist/brandandmerchicon.png'
import brandandmerch from '@/public/images/forartist/brandandmerch.png'
import { Anton } from 'next/font/google'
import TrendingSingerSwiper from './TrendingSingerSwiper'
import Link from 'next/link'

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
                    text="Features offered"
                    text2="to Artist"
                />
                <h1 className="w-[60%] max-md:w-[90%] my-5 text-gray-300 text-center">
                    Maheshwari Visuals, where passion meets global reach, and every note has the potential to resonate worldwide. As a leading force
                    in the music distribution industry, we take pride in empowering artists and labels to share their creations with the world.
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
                    icon: fastmusic,
                    title: 'Fast Music Distribution',
                    items: [
                        'Distribute to 100+ platforms including Spotify, Apple Music, Amazon, JioSaavn, and YouTube Music',
                        'Fast release turnaround (typically within 48–72 hours)',
                        'Schedule releases in advance with metadata control'
                    ]
                }}
                item2={{
                    iconbg: '#9729CA',
                    icon: royalty,
                    title: ' Royalty Management',
                    items: [
                        '100% royalty retention',
                        'Transparent quarterly payouts with downloadable TDS certificates',
                        'Real-time royalty dashboard with stream-by-stream breakdown'
                    ]
                }}
            />

            <FullBox
                item1={{
                    iconbg: '#CE3AB3',
                    icon: artistdashboardicon,
                    title: ' Artist Dashboard',
                    items: [
                        'Upload and manage releases',
                        'Track royalties and campaign performance',
                        'Request support, callertunes, or playlist pitching—all in one place'
                    ],
                    image: artistdashboard
                }}
            />

            <TwoHalfBoxes
                item1={{
                    iconbg: '#632BDF',
                    icon: promotional,
                    title: 'Promotional Tools',
                    items: [
                        'Playlist pitching submission',
                        'Callertune integration across indian telecoms',
                        'Campaign tracking for YouTube, Instagram, and Spotify ads'
                    ]
                }}
                item2={{
                    iconbg: '#9729CA',
                    icon: support,
                    title: 'Support & Community',
                    items: [
                        'Chat with Mahi (AI + human support)',
                        '24-hour response time from real artist managers',
                        'Access to artist guides, FAQs, and educational blog content'
                    ]
                }}
            />

            <FullBox
                item1={{
                    iconbg: '#CE3AB3',
                    icon: brandandmerchicon,
                    title: ' Brand & Merch Integration (via Music Merch Company)',
                    items: [
                        'Launch custom merch with QR-code playlists',
                        'Design support for t-shirts, sippers, posters, and more',
                        'Integrated store setup and fulfillment'
                    ],
                    image: brandandmerch
                }}
            />

            <div className="p-20 ">
              
                    <h1
                        className={`${anton.className}  text-[40px] mb-4 sm:text-[60px]  w-full leading-[1.1] text-center uppercase text-transparent bg-clip-text pb-10 `}
                        style={{
                            backgroundImage: `radial-gradient(circle at center -20%  , rgba(249, 244, 237, 1) 40% ,rgba(234,228,255,0.6) 70%`
                        }}>
                        Trending Singers and Musicians
                    </h1>
                <TrendingSingerSwiper/>
            </div>

            <Faq />
            <LetTheWorld />
        </div>
    )
}

export default page
