'use client'
import React from 'react'
import LetTheWorld from '@/components/website/LetTheWorld'
import herobg from '@/public/images/forartist/herobg.png'
import { Button } from '@/components/ui/button'
import { Anton } from 'next/font/google'

import aboutimage from '@/public/images/aboutus/aboutimage.png'
import hwi1 from '@/public/images/aboutus/hwi1.png'
import hwi2 from '@/public/images/aboutus/hwi2.png'
import hwi3 from '@/public/images/aboutus/hwi3.png'
import hwi4 from '@/public/images/aboutus/hwi4.png'

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
        image: hwi1,
        heading: 'Transparent Royalty Tracking:',
        text: 'With real-time royalty tracking, you get paid accurately and on time—no guesswork, just what you truly deserve.'
    },
    {
        image: hwi2,
        heading: 'Personalized Artist Support:',
        text: 'More than just distribution—we offer real support, expert guidance, and a team that truly gets your journey.'
    },
    {
        image: hwi3,
        heading: 'Playlist Placement Opportunities:',
        text: 'Boost your reach with curated playlist placements tailored to your sound—more listeners, more love.'
    },
    {
        image: hwi4,
        heading: 'Intuitive Marketing Tools:',
        text: 'Promote your music like a pro with smart tools that help you connect, create, and grow your fanbase effortlessly.'
    }
]

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
                        About Us
                    </h1>
                </div>
                <div className="flex flex-wrap pl-10 items-center  mb-8 gap-2 mt-0 relative z-10 text-white">
                    <h1 className="text-center text-xl">Buit for Creators</h1>
                    <div className="h-[20px] w-1 bg-[#652CD6]"></div>
                    <h1 className="text-center text-xl">Powerd By Culture</h1>
                    <div className="h-[20px] w-1 bg-[#652CD6]"></div>
                    <h1 className="text-center text-xl">Ready For The World</h1>
                </div>
                <Button
                    variant="blue"
                    className="shadow-2xl mt-0 shadow-violet-600">
                    <Link href="/signup">
                    Start Free Now
                    </Link>
                </Button>
            </div>

            <motion.div
                initial={{ y: 200, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.05 }}
                viewport={{ once: true }}
                className="w-full p-20 py-20 flex justify-between items-top gap-[50px] max-md:flex-col max-md:gap-8 ">
                <div className="w-full h-auto shadow-custom bg-gradient-to-b from-[#1d2334] bg-[#151A27]  rounded-t-3xl px-14 py-10 text-white space-y-6 flex gap-4 ">
                    <div className="w-[50%] space-y-6">
                        <h1 className={`${anton.className} text-4xl`}>About Maheshwari Visuals</h1>

                        <div className="flex items-top mb-2">
                            <div className="mx-1 mt-1">•</div>
                            <h1 className="text-gray-300 text-sm mx-3 my-1">
                                {' '}
                                Maheshwari Visuals® is a trademarked, artist-first creative ecosystem founded with a singular purpose: to empower
                                musicians, storytellers, and cultural voices across India and the world. We don’t just distribute music—we nurture
                                artistry, drive innovation, and build sustainable creative careers through four integrated verticals
                            </h1>
                        </div>
                    </div>
                    <div className="w-[50%] h-[250px] flex items-center justify-center">
                        <Image
                            src={aboutimage}
                            alt="aboutus"
                            style={{ boxShadow: '0 0 10px 0 #BB9BFF' }}
                            className="w-[90%] h-full  rounded-xl"
                        />
                    </div>
                </div>
            </motion.div>

            <div className="w-full p-20 flex justify-center items-top gap-[50px] max-md:flex-col max-md:gap-8 ">
                <motion.div
                    initial={{ x: -200, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.05 }}
                    viewport={{ once: true }}
                    className="w-[50%] h-auto shadow-custom bg-gradient-to-b from-[#1d2334] bg-[#151A27]  rounded-t-3xl px-14 py-10 text-white space-y-6">
                    <h1 className={`${anton.className} text-4xl`}>🎧 MV Distribution</h1>
                    <div className="flex flex-wrap pl-10 items-center  mb-4 gap-2 mt-0 relative z-10 text-white">
                        <h1 className="text-center text-sm">Your Music</h1>
                        <div className="h-[20px] w-1 bg-[#652CD6]"></div>
                        <h1 className="text-center text-sm">everywhere</h1>
                        <div className="h-[20px] w-1 bg-[#652CD6]"></div>
                        <h1 className="text-center text-sm">On your terms</h1>
                    </div>
                    {[
                        'Delivering music to 100+ global platforms with 100% royalty retention, metadata control, and artist-first tools—from playlist pitching to callertune integrations.'
                    ].map((item, index) => (
                        <div
                            key={index}
                            className="flex items-top mb-2">
                            <h1
                                key={index}
                                className="text-gray-300 text-sm mx-3 my-1">
                                {' '}
                                {item}
                            </h1>
                        </div>
                    ))}
                </motion.div>
                <motion.div
                    initial={{ x: 200, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.05 }}
                    viewport={{ once: true }}
                    className="w-[50%] h-auto shadow-custom bg-gradient-to-b from-[#1d2334] bg-[#151A27]  rounded-t-3xl px-14 py-10 text-white space-y-6">
                    <h1 className={`${anton.className} text-4xl`}>📣 MV Marketing</h1>
                    <div className="flex flex-wrap pl-10 items-center  mb-4 gap-2 mt-0 relative z-10 text-white">
                        <h1 className="text-center text-sm">Campaigns that connect</h1>
                        <div className="h-[20px] w-1 bg-[#652CD6]"></div>
                        <h1 className="text-center text-sm">Results that resonate</h1>
                    </div>
                    {[
                        'End-to-end promotional solutions including social media ads, influencer campaigns, smart links, and Spotify/YouTube targeting—built to make music unmissable.'
                    ].map((item, index) => (
                        <div
                            key={index}
                            className="flex items-top mb-2">
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

            <div className="w-full p-20 flex justify-center items-top gap-[50px] max-md:flex-col max-md:gap-8 ">
                <motion.div
                    initial={{ x: -200, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.05 }}
                    viewport={{ once: true }}
                    className="w-[50%] h-auto shadow-custom bg-gradient-to-b from-[#1d2334] bg-[#151A27]  rounded-t-3xl px-14 py-10 text-white space-y-6">
                    <h1 className={`${anton.className} text-4xl`}>🎬 MV Production</h1>
                    <div className="flex flex-wrap pl-10 items-center  mb-4 gap-2 mt-0 relative z-10 text-white">
                        <h1 className="text-center text-sm">Crafting visuals that amplify your sound</h1>
                    </div>
                    {[
                        'From budget-conscious music video direction to cinematic storytelling, we provide flexible video production with creative and technical excellence, tailored to every artist’s voice.'
                    ].map((item, index) => (
                        <div
                            key={index}
                            className="flex items-top mb-2">
                            <h1
                                key={index}
                                className="text-gray-300 text-sm mx-3 my-1">
                                {' '}
                                {item}
                            </h1>
                        </div>
                    ))}
                </motion.div>
                <motion.div
                    initial={{ x: 200, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.05 }}
                    viewport={{ once: true }}
                    className="w-[50%] h-auto shadow-custom bg-gradient-to-b from-[#1d2334] bg-[#151A27]  rounded-t-3xl px-14 py-10 text-white space-y-6">
                    <h1 className={`${anton.className} text-4xl`}>👕 Music Merch Company</h1>
                    <div className="flex flex-wrap pl-10 items-center  mb-4 gap-2 mt-0 relative z-10 text-white">
                        <h1 className="text-center text-sm">Wear your sound</h1>
                        <div className="h-[20px] w-1 bg-[#652CD6]"></div>
                        <h1 className="text-center text-sm">Sell your story</h1>
                    </div>
                    {[
                        'Custom merchandise solutions for artists and labels—from t-shirts and sippers to QR-enabled drops. We blend fashion, fandom, and functionality to bring music closer to the listener.'
                    ].map((item, index) => (
                        <div
                            key={index}
                            className="flex items-top mb-2">
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

            <div className="w-full p-20 flex justify-center items-top gap-[50px] max-md:flex-col max-md:gap-8 ">
                <motion.div
                    initial={{ x: -200, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.05 }}
                    viewport={{ once: true }}
                    className="w-[50%] h-auto shadow-custom bg-gradient-to-b from-[#1d2334] bg-[#151A27]  rounded-t-3xl px-14 py-10 text-white space-y-6">
                    {[
                        "Whether you're an independent artist, an emerging label, or a creative collaborator, Maheshwari Visuals offers a seamless platform to grow, express, and monetize your vision. Built in India. Designed for the world."
                    ].map((item, index) => (
                        <div
                            key={index}
                            className="flex items-top mb-2">
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
                <h1 className={`${anton.className} text-4xl uppercase text-center text-white`}>Why choose us ?</h1>

                <ProcessFlow data={howItWorkData} />
            </div>

            <LetTheWorld />
        </div>
    )
}

export default page
