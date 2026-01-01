'use client'
import React from 'react'
import Faq from '@/components/website/Faq'
import LetTheWorld from '@/components/website/LetTheWorld'
import herobg from '@/public/images/forartist/herobg.png'
import { MainHeadingText, TwoHalfBoxes } from '@/components/FixedUiComponents'
import { Button } from '@/components/ui/button'
import { Anton } from 'next/font/google'

// Import the new icons for the playlist pitching page
import algo from '@/public/images/pitchplaying/algo.png'
import editorial from '@/public/images/pitchplaying/editorial.png'
import independent from '@/public/images/pitchplaying/independent.png'
import post from '@/public/images/pitchplaying/post.png'
import smart from '@/public/images/pitchplaying/smart.png'

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
              
                <MainHeadingText text=' PLAYLIST PITCHING' />
                <div className="flex flex-wrap items-center  mb-8 gap-2 mt-0 relative z-10 text-white">
                    <h1 className="text-center text-xl">Your track deserves more than a listen—it deserves a spot where it belongs</h1>
                </div>
                <Button
                    variant="blue"
                    className="shadow-2xl  shadow-violet-600">
                    <Link href="/signup">
                    Start Free Now
                    </Link>
                </Button>
            </div>

            <TwoHalfBoxes
                item1={{
                    iconbg: '#632BDF',
                    icon: editorial,
                    title: 'Editorial Playlist Pitching',
                    items: [
                        'Submit unreleased tracks directly to platforms like Spotify for official editorial consideration',
                        'Optimize metadata: genre, mood, instruments, language, and story',
                        'Submit at least 7 days before release for editorial consideration'
                    ]
                }}
                item2={{
                    iconbg: '#9729CA',
                    icon: independent,
                    title: 'Independent Curator Outreach',
                    items: [
                        'Build relationships with indie playlist curators on Spotify, Apple Music, and other platforms',
                        'Use personalized pitches referencing their playlist vibe and audience',
                        'Offer exclusive previews or early access to build trust'
                    ]
                }}
            />

            <TwoHalfBoxes
                item1={{
                    iconbg: '#632BDF',
                    icon: smart,
                    title: 'Smart Playlist Matching',
                    items: [
                        'Tag tracks by genre, mood, tempo, and theme (e.g., ‘late-night drive’)',
                        'Use AI or internal tools to match songs with relevant playlists',
                        'Maintain curated internal playlists for pitching reference'
                    ]
                }}
                item2={{
                    iconbg: '#9729CA',
                    icon: algo,
                    title: 'Algorithmic Playlist Optimization',
                    items: [
                        'Encourage pre-saves, early streams, and follows to trigger algorithm boosts',
                        'Focus on consistent release schedules to feed Spotify’s algorithm',
                        'Promote playlisted tracks to increase engagement and retention'
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
                            src={post}
                            alt="Post-Placement Promotion"
                            className="w-full h-full"
                        />
                    </div>
                    <h1 className={`${anton.className} text-4xl`}>Post-Placement Promotion</h1>
                    {[
                        'Share playlist placements on social media and tag curators',
                        'Leverage playlist followers for cross-promotion',
                        'Use placements in press releases and DSP pitch decks'
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

             <div className="w-full px-20 py-10 mb-10">
                <h2 className={`${anton.className} text-center text-5xl mb-10 text-white`}>TYPES OF PLAYLISTS YOU CAN PITCH TO</h2>
                <div className="overflow-x-auto rounded-lg border-2 border-gray-300">
                    <table className="min-w-full text-left text-sm font-light text-white  ">
                        <thead className="border-b-2 border-gray-300 bg-[#1D2334] font-medium dark:border-neutral-500">
                            <tr>
                                <th scope="col" className="px-8 py-8 text-3xl border-r-2 border-gray-300">Playlist Type</th>
                                <th scope="col" className="px-8 py-8 text-3xl border-r-2 border-gray-300">Curated By</th>
                                <th scope="col" className="px-8 py-8 text-3xl">Example</th>
                            </tr>
                        </thead>
                        <tbody className="text-base ">
                            <tr className="border-b-2 border-gray-300 dark:border-neutral-500">
                                <td className="whitespace-nowrap px-8 py-6 border-r-2 border-gray-300">Editorial</td>
                                <td className="whitespace-nowrap px-8 py-6 border-r-2 border-gray-300">DSPs (Spotify, Apple)</td>
                                <td className="whitespace-nowrap px-8 py-6">New music friday, RapCaviar</td>
                            </tr>
                            <tr className="border-b-2 border-gray-300 dark:border-neutral-500">
                                <td className="whitespace-nowrap px-8 py-6 border-r-2 border-gray-300">Algorithmic</td>
                                <td className="whitespace-nowrap px-8 py-6 border-r-2 border-gray-300">DSP Algorithms</td>
                                <td className="whitespace-nowrap px-8 py-6">Discover weekly, Release radar</td>
                            </tr>
                            <tr className="border-b-2 border-gray-300 dark:border-neutral-500">
                                <td className="whitespace-nowrap px-8 py-6 border-r-2 border-gray-300">Independent Curators</td>
                                <td className="whitespace-nowrap px-8 py-6 border-r-2 border-gray-300">Blogs, Influencers</td>
                                <td className="whitespace-nowrap px-8 py-6">Indie Chill, Desi hip-hop gems</td>
                            </tr>
                            <tr>
                                <td className="whitespace-nowrap px-8 py-6 border-r-2 border-gray-300">Brand/Label Playlists</td>
                                <td className="whitespace-nowrap px-8 py-6 border-r-2 border-gray-300">Labels or collectives</td>
                                <td className="whitespace-nowrap px-8 py-6">T-series, Mixtape, Majestic Casual</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <LetTheWorld />
        </div>
    )
}

export default page