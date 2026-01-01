import Faq from '@/components/website/Faq'
import LetTheWorld from '@/components/website/LetTheWorld'
import React from 'react'
import herobg from '@/public/images/forartist/herobg.png'
import { FullBox, MainHeadingText, TwoHalfBoxes } from '@/components/FixedUiComponents'
import { Button } from '@/components/ui/button'

import global from '@/public/images/forlabels/global.svg'
import multiartist from '@/public/images/forlabels/multiartist.svg'
import royalty from '@/public/images/forlabels/royalty.svg'
import advance from '@/public/images/forlabels/advance.svg'
import compliance from '@/public/images/forlabels/compliance.svg'
import dedicated from '@/public/images/forlabels/dedicated.svg'
import royaltyright from '@/public/images/forlabels/royaltyright.png'
import dadicatedright from '@/public/images/forlabels/dadicatedright.png'
import { Anton } from 'next/font/google'
import OurLabels from './OurLabels'
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
                    text="The new standard for"
                    text2="LABEL services"
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
                    icon: global,
                    title: 'Global Distribution with Metadata Precision',
                    items: [
                        'Distribute to 100+ DSPs, including Spotify, Apple Music, Amazon, JioSaavn, and YouTube Music',
                        'Direct deals with platforms for high-tier catalog pitching',
                        'Free ISRC/UPC codes and advanced automated metadata correction'
                    ]
                }}
                item2={{
                    iconbg: '#9729CA',
                    icon: multiartist,
                    title: 'Multi-Artist & Catalog Control',
                    items: [
                        'Unified dashboard to manage multiple artists, releases, and brands',
                        'Sub-label creation and label-tier permissions',
                        'Bulk metadata editor for fast catalog updates and artwork'
                    ]
                }}
            />

            <FullBox
                item1={{
                    iconbg: '#CE3AB3',
                    icon: royalty,
                    title: 'Royalty & Revenue Management',
                    items: [
                        'Automated revenue splits between artists, producers, and writers',
                        'Custom contracts with variable payment and downloadable TDS reports',
                        'Flexible payouts (on-demand, share-of-revenue, or fixed)'
                    ],
                    image: royaltyright
                }}
            />

            <TwoHalfBoxes
                item1={{
                    iconbg: '#632BDF',
                    icon: advance,
                    title: 'Advanced Analytics & Reporting',
                    items: [
                        'Stream-by-stream royalty breakdown',
                        'YouTube Content ID management and insights',
                        'Custom exportable reports for internal accounting or master deals'
                    ]
                }}
                item2={{
                    iconbg: '#9729CA',
                    icon: compliance,
                    title: 'Compliance & Rights Infrastructure',
                    items: [
                        'DTC onboarding for all artists under the label',
                        'Automated metadata verification and takedown tools',
                        '2-factor policy enforcement and content moderation'
                    ]
                }}
            />

            <FullBox
                item1={{
                    iconbg: '#CE3AB3',
                    icon: dedicated,
                    title: 'Dedicated Label Support',
                    items: [
                        'Dedicated artist manager via phone, email, and SLA',
                        'Onboarding assistance for catalog migration and monetization',
                        'Strategic consultations for release planning and monetization'
                    ],
                    image: dadicatedright
                }}
            />

            <div className="p-20 ">
                <h1
                    className={`${anton.className}  text-[40px] mb-4 sm:text-[60px]  w-full leading-[1.1] text-center uppercase text-transparent bg-clip-text pb-10 `}
                    style={{
                        backgroundImage: `radial-gradient(circle at center -20%  , rgba(249, 244, 237, 1) 40% ,rgba(234,228,255,0.6) 70%`
                    }}>
                    Our Labels
                </h1>
                <OurLabels />
            </div>

            <Faq />
            <LetTheWorld />
        </div>
    )
}

export default page
