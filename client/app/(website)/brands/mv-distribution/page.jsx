import React from 'react'
import Faq from '@/components/website/Faq'
import LetTheWorld from '@/components/website/LetTheWorld'
import herobg from '@/public/images/mvadvertisement/herobg.png'
import { FullBox, MainHeadingText, TwoHalfBoxes } from '@/components/FixedUiComponents'
import { Button } from '@/components/ui/button'
import { Anton } from 'next/font/google'
import dolbyimage from '@/public/images/branding/dolbyimage.png'
// Import the new icons from the mvdistribution folder
import advance from '@/public/images/mvdistribution/advance.png'
import dashboard from '@/public/images/mvdistribution/dashboard.png'
import ddex from '@/public/images/mvdistribution/ddex.png'
import ecosystem from '@/public/images/mvdistribution/ecosystem.png'
import global from '@/public/images/mvdistribution/global.png'
import kyc from '@/public/images/mvdistribution/kyc.png'
import promotional from '@/public/images/mvdistribution/promotional.png'
import royalty from '@/public/images/mvdistribution/royalty.png'
import support from '@/public/images/mvdistribution/support.png'
import ProcessFlow from '@/components/website/ProcessFlow'
import hiw1 from '@/public/images/mvdistribution/hiw1.png'
import hiw2 from '@/public/images/mvdistribution/hiw2.png'
import hiw3 from '@/public/images/mvdistribution/hiw3.png'
import hiw4 from '@/public/images/mvdistribution/hiw4.png'
import hiw5 from '@/public/images/mvdistribution/hiw5.png'
import Link from 'next/link'

const anton = Anton({
    weight: ['400'],
    subsets: ['latin']
})

const howItWorkData = [
    {
        image: hiw1,
        heading: 'Free Signup',
        text: 'Sign up in seconds—no fees, no fuss. Just pure access to everything you need to get started.'
    },
    {
        image: hiw2,
        heading: 'Upload Your music',
        text: 'Easily upload your music and share your sound with the world—quick, smooth, and built for artists like you.'
    },
    {
        image: hiw3,
        heading: 'Select your release date and stores',
        text: "Choose where your music drops—Spotify, Apple Music, and more. You're in control of the spotlight."
    },
    {
        image: hiw4,
        heading: 'Monitoring & Analysis',
        text: "Stay in the loop with real-time stats and deep insights to fine-tune your performance and grow smarter."
    },
    {
        image: hiw5,
        heading: 'Get Paid',
        text: "Earn every time your music streams—track your royalties and get paid fast, straight to your account."
    },
]

const page = () => {
    return (
        <div className="overflow-x-hidden ">
            <div
                style={{ backgroundImage: `url(${herobg.src})` }}
                className="bg-cover bg-top min-h-[80vh] w-full flex flex-col justify-center items-center pt-[150px]">
               
                <MainHeadingText text='Music Distribution' />
                <div className="flex flex-wrap items-center mb-8 gap-2 mt-0 relative z-10 text-white">
                    <h1 className="text-center text-xl">🚀 Your Music</h1>
                    <div className="h-[20px] w-1 bg-[#652CD6]"></div>
                    <h1 className="text-center text-xl">🛡️ Everywhere</h1>
                    <div className="h-[20px] w-1 bg-[#652CD6]"></div>
                    <h1 className="text-center text-xl">📞 On Your Terms</h1>
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
                    icon: global,
                    title: 'Global Music Distribution',
                    items: [
                        'Deliver music to 100+ DSPs including Spotify, Apple Music, Amazon, JioSaavn, YouTube Music, and more.',
                        'Support for regional and niche platforms like Wynk, Hungama, and Beatport.',
                        'Schedule releases in advance or release instantly with full metadata control.'
                    ]
                }}
                item2={{
                    iconbg: '#9729CA',
                    icon: royalty,
                    title: '100% Royalty Retention',
                    items: [
                        'Artists and labels keep 100% of their royalties.',
                        'Transparent quarterly payouts with downloadable TDS certificates.',
                        'Real-time royalty dashboard with stream-by-stream breakdown.'
                    ]
                }}
            />

            <TwoHalfBoxes
                item1={{
                    iconbg: '#632BDF',
                    icon: ddex,
                    title: 'DDEX & API-Ready Infrastructure',
                    items: [
                        'Fully compliant with DDEX standards for metadata delivery.',
                        'API-based ingestion for faster, scalable release management.',
                        'Built-in tools for ISRC/UPC assignment, rights validation, and QC.'
                    ]
                }}
                item2={{
                    iconbg: '#9729CA',
                    icon: advance,
                    title: 'Advanced Analytics & Insights',
                    items: [
                        'Track monthly listeners, top cities, and platform-specific performance.',
                        'Monitor playlist placements, callertune activations, and campaign ROI.',
                        'Exportable reports for internal use or investor decks.'
                    ]
                }}
            />

            <TwoHalfBoxes
                item1={{
                    iconbg: '#632BDF',
                    icon: dashboard,
                    title: 'Artist & Label Dashboard',
                    items: [
                        'Upload and manage releases with ease.',
                        'Request playlist pitching, callertunes, and marketing support.',
                        'Access royalty reports, campaign tools, and smart links—all in one place.'
                    ]
                }}
                item2={{
                    iconbg: '#9729CA',
                    icon: promotional,
                    title: 'Promotional Tools',
                    items: [
                        'Playlist pitching portal for editorial and influencer campaigns.',
                        'Callertune integration across Jio, Airtel, Vi, and BSNL.',
                        'QR-code generator for merch, posters, and smart links.'
                    ]
                }}
            />

            <TwoHalfBoxes
                item1={{
                    iconbg: '#632BDF',
                    icon: kyc,
                    title: 'KYC & Compliance',
                    items: [
                        'Secure onboarding with Aadhaar, PAN, or passport verification.',
                        '3-strike policy enforcement and copyright protection.',
                        'Automated content moderation and metadata validation.'
                    ]
                }}
                item2={{
                    iconbg: '#9729CA',
                    icon: ecosystem,
                    title: 'Ecosystem Integration',
                    items: [
                        'Seamless connection to Music Merch Company for merch drops.',
                        'Artist pages with streaming stats, discography, and promo tools.',
                        'Future-ready for sync licensing, publishing, and direct DSP deals.'
                    ]
                }}
            />
            <FullBox
                item1={{
                    iconbg: '#CE3AB3',
                    icon: support,
                    title: 'Real Human Support',
                    items: [
                        '24-hour SLA for artist and label queries.',
                        'Dedicated account managers for labels and high-volume artists.',
                        'Chatbot + human hybrid support via WhatsApp and dashboard.'
                    ],
                    image: dolbyimage
                }}
            />
            <div className='mt-10'>
                <h1 className={`${anton.className} text-4xl uppercase text-center text-white`}>How It Work</h1>

                <ProcessFlow data={howItWorkData} />
            </div>
            <LetTheWorld />
        </div>
    )
}

export default page
