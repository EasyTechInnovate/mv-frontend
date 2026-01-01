'use client'
import React from 'react'
import Faq from '@/components/website/Faq'
import LetTheWorld from '@/components/website/LetTheWorld'
import herobg from '@/public/images/mvadvertisement/herobg.png'
import { MainHeadingText, TwoHalfBoxes } from '@/components/FixedUiComponents'
import { Button } from '@/components/ui/button'
import { Anton } from 'next/font/google'

// Import the new icons for the music merch page
import artist from '@/public/images/musicmerch/artist.png'
import design from '@/public/images/musicmerch/design.png'
import endtoend from '@/public/images/musicmerch/endtoend.png'
import limited from '@/public/images/musicmerch/limited.png'
import merch from '@/public/images/musicmerch/merch.png'
import revenue from '@/public/images/musicmerch/revenue.png'
import sustainable from '@/public/images/musicmerch/sustainable.png'
import hiw1 from '@/public/images/musicmerch/hiw1.png'
import hiw2 from '@/public/images/musicmerch/hiw2.png'
import hiw3 from '@/public/images/musicmerch/hiw3.png'
import hiw4 from '@/public/images/musicmerch/hiw4.png'

import { motion } from 'framer-motion'
import Image from 'next/image'
import ProcessFlow from '@/components/website/ProcessFlow'
import Link from 'next/link'
const anton = Anton({
    weight: ['400'],
    subsets: ['latin']
})

const howItWorkData = [
    {
        image: hiw1,
        heading: 'Apply Now',
        text: 'Book a one-on-one session with our pros—personalized advice to level up your music journey.'
    },
    {
        image: hiw2,
        heading: 'Consultation',
        text: 'Get expert advice tailored to your journey—whether it’s for new releases, or growth strategies, we’re here to guide you.'
    },
    {
        image: hiw3,
        heading: 'Launch Your Merch',
        text: 'Turn your brand into wearable art—create, design, and sell custom merch your fans will love.'
    },
    {
        image: hiw4,
        heading: 'Get Paid On every sales',
        text: 'Keep 100% transparency and get paid for every merch sale—no delays, no hidden fees, just real profits.'
    },
];


const page = () => {
    return (
        <div className="overflow-x-hidden ">
            <div
                style={{ backgroundImage: `url(${herobg.src})` }}
                className="bg-cover bg-center min-h-[80vh] w-full flex flex-col justify-center items-center pt-[150px]">
            
                <MainHeadingText text="Music Merch Company" />
                <div className="flex flex-wrap items-center  mb-8 gap-2 mt-0 relative z-10 text-white">
                    <h1 className="text-center text-xl">Built for Creators</h1>
                    <div className="h-[20px] w-1 bg-[#652CD6]"></div>
                    <h1 className="text-center text-xl">Powered by Culture</h1>
                    <div className="h-[20px] w-1 bg-[#652CD6]"></div>
                    <h1 className="text-center text-xl">Ready for the World</h1>
                   
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
                    icon: artist,
                    title: 'Artist-Centric Custom Merchandise',
                    items: [
                        'Tailored merch design that reflects each artist’s identity, genre, and story' ,
                        'Print-on-demand t-shirts and hoodies to sippers, posters, and collectibles' ,
                        'QR code-enabled products that link to playlists, videos, or exclusive content'
                    ]
                }}
                item2={{
                    iconbg: '#9729CA',
                    icon: endtoend,
                    title: 'End-to-End Fulfillment & E-Commerce',
                    items: [
                        'Print-on-demand and bulk production options' ,
                        'Branded online store setup or integration with artist websites' ,
                        'Inventory, packaging, and global shipping handled seamlessly'
                    ]
                }}
            />

            <TwoHalfBoxes
                item1={{
                    iconbg: '#632BDF',
                    icon: design,
                    title: 'Design & Creative Support',
                    items: [
                        'In-house design team for artwork, typography, and packaging' ,
                        'Limited-edition drops, tour-specific collections, and seasonal campaigns' ,
                        'Visual storytelling that turns merch into a cultural statement'
                    ]
                }}
                item2={{
                    iconbg: '#9729CA',
                    icon: revenue,
                    title: 'Revenue Transparency & Ownership',
                    items: [
                        'Artists retain full ownership of their brand and designs' ,
                        'Transparent royalty splits and real-time sales tracking' ,
                        'Flexible pricing models: profit-share, flat-fee, or hybrid'
                    ]
                }}
            />

            <TwoHalfBoxes
                item1={{
                    iconbg: '#632BDF',
                    icon: limited,
                    title: 'Limited Edition & Drop Campaigns',
                    items: [
                        'Timed or quantity-limited merch drops to create urgency' ,
                        '“Hour-only” or “album-era” collections to boost exclusivity' ,
                        'Countdown timers and early access for superfans'
                    ]
                }}
                item2={{
                    iconbg: '#9729CA',
                    icon: sustainable,
                    title: 'Sustainable & Ethical Merch Options',
                    items: [
                        'Organic cotton, recycled fabrics, and eco-friendly inks' ,
                        'Plastic-free packaging and carbon-neutral shipping options' ,
                        'Artist badges for “eco-conscious” collections'
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
                            src={merch}
                            alt="Merch + Music Integration"
                            className="w-full h-full"
                        />
                    </div>
                    <h1 className={`${anton.className} text-4xl`}>Merch + Music Integration</h1>
                    {[
                        'QR codes linking to playlists, music videos, or behind-the-scenes content' ,
                        'NFC tags for exclusive unlockables' ,
                        'Merch that becomes part of the listening experience'
                    ].map((item, index) => (
                        <div
                            key={index}
                            className="flex items-top mb-2">
                            <div className="mx-1 mt-1"> • </div>
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