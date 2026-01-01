'use client'
import React from 'react'
import Faq from '@/components/website/Faq'
import LetTheWorld from '@/components/website/LetTheWorld'
import herobg from '@/public/images/mvadvertisement/herobg.png'
import { MainHeadingText, TwoHalfBoxes } from '@/components/FixedUiComponents'
import { Button } from '@/components/ui/button'
import { Anton } from 'next/font/google'

// Import the new icons for the music video production page
import budget from '@/public/images/mvproduction/budget.png'
import cost from '@/public/images/mvproduction/cost.png'
import creative from '@/public/images/mvproduction/creative.png'
import fast from '@/public/images/mvproduction/fast.png'
import flexible from '@/public/images/mvproduction/flexible.png'
import inhouse from '@/public/images/mvproduction/inhouse.png'
import location from '@/public/images/mvproduction/location.png'
import hiw1 from '@/public/images/mvproduction/hiw1.png'
import hiw2 from '@/public/images/mvproduction/hiw2.png'
import hiw3 from '@/public/images/mvproduction/hiw3.png'

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
        text: 'Take the first step toward your next big move—apply now and unlock new opportunities.'
    },
    {
        image: hiw2,
        heading: 'Pitch your Project',
        text: 'Present your project with confidence—grab attention, spark interest, and open doors to real opportunities.'
    },
    {
        image: hiw3,
        heading: 'Get Funded',
        text: 'Secure the backing you need—grants, investments, or sponsorships—to take your music or project to the next level.'
    }
]

const page = () => {
    return (
        <div className="overflow-x-hidden ">
            <div
                style={{ backgroundImage: `url(${herobg.src})` }}
                className="bg-cover bg-center min-h-[80vh] w-full flex flex-col justify-center items-center pt-[150px]">
             
                <MainHeadingText text='Music Production' />
                <h1 className="text-center text-xl text-white">Crafting Visuals That Amplify Your Sound</h1>

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
                    icon: budget,
                    title: 'Budget-Tailored Creative Direction',
                    items: [
                        'Align video concepts with the artist’s budget from day one',
                        'Offer scalable solutions—from DIY-style shoots to cinematic productions',
                        'Help artists prioritize storytelling over spectacle'
                    ]
                }}
                item2={{
                    iconbg: '#9729CA',
                    icon: cost,
                    title: 'Transparent Cost Breakdown',
                    items: [
                        'Provide itemized estimates for pre-production, shoot day, and post',
                        'Include line items like crew, gear, locations, wardrobe, and editing',
                        'Avoid hidden fees—build trust through clarity'
                    ]
                }}
            />

            <TwoHalfBoxes
                item1={{
                    iconbg: '#632BDF',
                    icon: flexible,
                    title: 'Flexible Production Packages',
                    items: [
                        'Offer tiered packages (e.g., Basic, Indie, Premium)',
                        'Allow add-ons like drone shots, VFX, or behind-the-scenes reels',
                        'Enable artists to upgrade as their budget grows'
                    ]
                }}
                item2={{
                    iconbg: '#9729CA',
                    icon: inhouse,
                    title: 'In-House & Partnered Resources',
                    items: [
                        'Access to in-house directors, editors, and cinematographers',
                        'Partner network for location scouting, stylists, and set designers',
                        'Reduce costs through bundled services and repeat collaborations'
                    ]
                }}
            />

            <TwoHalfBoxes
                item1={{
                    iconbg: '#632BDF',
                    icon: location,
                    title: 'Location & Permit Management',
                    items: [
                        'Suggest budget-friendly or free locations',
                        'Handle permits and logistics to avoid last-minute surprises',
                        'Offer indoor/outdoor options based on concept and cost'
                    ]
                }}
                item2={{
                    iconbg: '#9729CA',
                    icon: fast,
                    title: 'Post-Production Optimization',
                    items: [
                        'Budget for editing, color grading, and motion graphics',
                        'Offer multiple revision rounds within the agreed scope',
                        'Deliverable media cutdowns and vertical formats as part of the package'
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
                            alt="Creative ROI Guidance"
                            className="w-full h-full"
                        />
                    </div>
                    <h1 className={`${anton.className} text-4xl`}>Creative ROI Guidance</h1>
                    {[
                        'Help artists understand how to get the most value from their video',
                        'Suggest ways to repurpose footage for reels, ads, or lyric videos',
                        'Offer insights on how video quality impacts editorial perception'
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
            <div className="mt-10">
                <h1 className={`${anton.className} text-4xl uppercase text-center text-white`}>How It Work</h1>

                <ProcessFlow data={howItWorkData} />
            </div>

            <LetTheWorld />
        </div>
    )
}

export default page
