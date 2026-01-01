'use client'
import React from 'react'
import Faq from '@/components/website/Faq'
import LetTheWorld from '@/components/website/LetTheWorld'
import herobg from '@/public/images/forartist/herobg.png'
import { MainHeadingText, TwoHalfBoxes } from '@/components/FixedUiComponents'
import { Button } from '@/components/ui/button'
import { Anton } from 'next/font/google'

// Import the new icons for the sync page
import creative from '@/public/images/sync/creative.png'
import design from '@/public/images/sync/design.png'
import rights from '@/public/images/sync/rights.png'
import syncready from '@/public/images/sync/syncready.png'
import whatis from '@/public/images/sync/whatis.png'

import { motion } from 'framer-motion'
import Image from 'next/image'
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
                className="bg-cover bg-center min-h-[80vh] w-full flex flex-col justify-center items-center pt-[150px]">
                <div>
                    <h1
                        className={`${anton.className}  text-[80px] mb-4 sm:text-[100px] w-fit leading-[1.1] text-center uppercase text-transparent bg-clip-text `}
                        style={{
                            backgroundImage: `radial-gradient(circle at center -20%  , rgba(249, 244, 237, 1) 40% ,rgba(234,228,255,0.6) 70%`
                        }}>
                        SYNCHRONIZATION
                    </h1>
                </div>
                <div className="flex flex-wrap items-center  mb-8 gap-2 mt-0 relative z-10 text-white">
                    <h1 className="text-center text-xl">Connecting Your Sound To Cinema</h1>
                    <div className="h-[20px] w-1 bg-[#652CD6]"></div>
                    <h1 className="text-center text-xl">Brands</h1>
                    <div className="h-[20px] w-1 bg-[#652CD6]"></div>
                    <h1 className="text-center text-xl">Beyond—One Sync At a Time</h1>
                </div>
                <Button
                    variant="blue"
                    className="shadow-2xl mt-0 shadow-violet-600">
                    <Link href="/signup">
                    Start Free Now
                    </Link>
                </Button>
            </div>

            <TwoHalfBoxes
                item1={{
                    iconbg: '#632BDF',
                    icon: whatis,
                    title: 'What is Sync Licensing?',
                    items: [
                        'Sync (synchronization) licensing allows music to be paired with visual media',
                        'Common placements: films, TV shows, web series, ads, video games, and social media',
                        'Artists earn upfront sync fees + backend royalties (via PROs like BMI, ASCAP)'
                    ]
                }}
                item2={{
                    iconbg: '#9729CA',
                    icon: rights,
                    title: 'Rights & Clearance Management',
                    items: [
                        'Handle both master and publishing rights clearance',
                        'Ensure “sync-ready” tracks (pre-built for easy licensing or pre-cleared) for faster licensing',
                        'Organize metadata, cue sheets, and legal documentation for every track'
                    ]
                }}
            />

            <TwoHalfBoxes
                item1={{
                    iconbg: '#632BDF',
                    icon: design,
                    title: 'Design & Creative Support',
                    items: [
                        'In-house design team for artwork, typography, and packaging',
                        'Limited-edition drops, tour-specific collections, and seasonal campaigns',
                        'Visual storytelling that turns merch into a cultural statement'
                    ]
                }}
                item2={{
                    iconbg: '#9729CA',
                    icon: syncready,
                    title: 'Sync-Ready Catalog Curation',
                    items: [
                        'Tag tracks by mood, genre, tempo, and theme',
                        'Create instrumentals, stems, and clean versions for each song',
                        'Organize playlists for music supervisors'
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
                            src={creative}
                            alt="Creative & Legal Support"
                            className="w-full h-full"
                        />
                    </div>
                    <h1 className={`${anton.className} text-4xl`}>Creative & Legal Support</h1>
                    {[
                        'Help artists understand sync terms, usage rights, and revenue splits',
                        'Provide legal templates for sync deals, exclusivity clauses, and clearances',
                        'Educate artists on how to make their music more syncable (e.g., no uncleared samples)'
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

            <LetTheWorld />
        </div>
    )
}

export default page
