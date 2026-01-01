'use client'
import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Anton } from 'next/font/google'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import herobg from '@/public/images/home/hero.png'
import hero2 from '@/public/images/home/hero2.png'
import ourMissionBg from '@/public/images/home/ourmissionbg.png'
import ourMission from '@/public/images/home/ourmission.png'
import anghami from '@/public/images/home/marque/anghami.png'
import instagram from '@/public/images/home/marque/insta.png'
import appleMusic from '@/public/images/home/marque/music.png'
import youtube from '@/public/images/home/marque/youtube.png'
import circleText from '@/public/images/home/circletext.svg'
import whyChooseUs from '@/public/images/home/whychooseus.png'
import ourServicesBg from '@/public/images/home/ourservicesbg.png'
import ourservices1 from '@/public/images/home/ourservices1.png'
import ourservices2 from '@/public/images/home/ourservices2.png'
import ourservices3 from '@/public/images/home/ourservices3.png'
import allessentialsbg from '@/public/images/allessentialsbg.png'
import allessentialsimage from '@/public/images/allessentialsimage.png'
import map from '@/public/images/home/map.png'

import { AiFillInstagram } from "react-icons/ai";

import LetTheWorld from '@/components/website/LetTheWorld'
import Faq from '@/components/website/Faq'
import { FaMusic } from 'react-icons/fa'
import { HeadingText, MainHeadingText } from '@/components/FixedUiComponents'
import TestimonialSwiper from '@/components/website/TestimonialSwiper'
import { notFound, useParams } from 'next/navigation'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
const anton = Anton({
    weight: ['400'],
    subsets: ['latin']
})

const images = [
    anghami.src,
    instagram.src,
    appleMusic.src,
    youtube.src,
    anghami.src,
    instagram.src,
    appleMusic.src,
    youtube.src,
    appleMusic.src,
    youtube.src
]

const allowedCountries = ['japan', 'brazil', 'south-korea', 'singapore', 'france', 'usa', 'uk', 'nigeria', 'netherlands']

const HomePage = () => {
    const { country } = useParams()
    if (!allowedCountries.includes(country.toLowerCase())) {
        notFound()
    }

    return (
        <div className="overflow-x-hidden">
            <div className=" h-screen relative">
                <div
                    style={{ backgroundImage: `url(${herobg.src})` }}
                    className={`w-screen h-screen  bg-cover bg-top relative text-white`}>
                    <div className="w-full h-full absolute  bg-[#000000ba]"></div>
                    <div className="relative pt-[150px] ">
                        <div className='w-full'>
                        <MainHeadingText text='Best Music Distribution' text2={`Platform in ${country}`}/>

                        </div>
                        <h1 className="text-center mt-8">
                            Distribute your music to top platforms, grow your <br /> audience, and get the recognition you deserve.
                        </h1>

                        <div className="flex justify-center items-center mt-8 relative z-10">
                            <Button variant="blue">
                                <Link href="/signup">Start Free Now</Link>
                            </Button>
                        </div>
                        <div className="w-full flex px-12 items-center justify-center mt-20 relative z-10">
                            <div className="relative w-full rounded-4xl overflow-hidden py-8 px-10  bg-[#1D202F]/70   backdrop-blur-md ">
                                <div className={`text-center text-gray-300 text-lg  mb-4 tracking-widest `}>OUR DISTRIBUTION NETWORK</div>
                                <div className="w-full relative overflow-hidden ">
                                    <div className="relative h-20 flex w-[4000px] overflow-hidden">
                                        <motion.div
                                            className="flex whitespace-nowrap w-[2000px] justify-evenly items-center gap-10 overflow-hidden"
                                            animate={{ x: ['0%', '-100%'] }}
                                            transition={{ ease: 'linear', duration: 30, repeat: Infinity }}>
                                            {images.map((src, index) => (
                                                <img
                                                    key={index}
                                                    src={src}
                                                    alt={`Distribution Partner ${index + 1}`}
                                                    className="h-[50px] w-[150px] object-contain "
                                                />
                                            ))}
                                        </motion.div>
                                        <motion.div
                                            className="flex whitespace-nowrap w-[2000px] justify-evenly items-center gap-10 overflow-hidden"
                                            animate={{ x: ['0%', '-100%'] }}
                                            transition={{ ease: 'linear', duration: 30, repeat: Infinity }}>
                                            {images.map((src, index) => (
                                                <img
                                                    key={index}
                                                    src={src}
                                                    alt={`Distribution Partner ${index + 1}`}
                                                    className="h-[50px] w-[150px] object-contain "
                                                />
                                            ))}
                                        </motion.div>
                                    </div>
                                    <div className="absolute w-[300px] h-[50px]  top-4 left-0 bg-gradient-to-r from-[rgb(29,32,47)] to-90% to-transparent"></div>
                                    <div className="absolute w-[300px] h-[50px]  top-4 right-0 bg-gradient-to-r from-transparent to-90% to-[#1D202F]"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div
                style={{ backgroundImage: `url(${ourMissionBg.src})` }}
                className="w-screen relative h-fit bg-cover bg-center mt-[100px] text-white">
                <div className="flex max-lg:flex-col flex-wrap p-20 max-lg:gap-20 py-30 ">
                    <div className="w-full lg:w-[60%] sm:pr-5">
                        <h1 className={`text-2xl ${anton.className} text-[#652CD6] uppercase mb-4`}>Our Mission</h1>
                        <HeadingText text="Empowering Independent Artists  & labels to Rule the Global Stage" />
                        <p className="text-lg text-gray-300 py-4 mb-6 pr-20">
                            we help artists go live fast — your music hits 100+ stores like Spotify & Apple Music within 48 hours. You keep 100% of
                            your rights, always. No cuts, no control games. And if you need help, real human support is just a call or email away —
                            replies within 24 hours. Simple. Fast. Artist-first.
                        </p>
                        <div className="flex flex-wrap mb-8 gap-2 relative z-10">
                            <h1 className="text-center text-xl">🚀 Faster Music Delivery</h1>
                            <div className="h-[20px] w-1 bg-[#652CD6]"></div>
                            <h1 className="text-center text-xl">🛡️ Keep your 100% Rights</h1>
                            <div className="h-[20px] w-1 bg-[#652CD6]"></div>
                            <h1 className="text-center text-xl">📞 Real Human Support</h1>
                        </div>
                        <Button variant="blue">
                            <Link href="#">Get Started</Link>
                        </Button>
                    </div>
                    <div className="w-full lg:w-[40%] relative ">
                        <div className="absolute z-[9] bg-radial w-[50px] h-[50px] rounded-full from-[rgb(208,116,195)]/10 right-40 top-40 to-transparent backdrop-blur-3xl shadow-[0_0px_405px_404px_rgb(208,116,195,0.1)]  "></div>
                        <div className="absolute z-20 -top-5 left-0 ">
                            <Image
                                src={circleText}
                                alt="Circle Text"
                                className=" w-[150px] h-[150px] max-sm:w-[100px] max-sm:h-[100px] object-contain animate-[spin_20s_linear_infinite] origin-center "
                            />
                            <FaMusic className="absolute text-2xl top-[50%]  left-[50%] transform translate-x-[-50%] translate-y-[-50%]" />
                        </div>
                        <Image
                            src={ourMission}
                            alt="Our Mission"
                            className="h-[600px] max-sm:h-[300px] object-contain relative z-10"
                        />
                    </div>
                </div>
            </div>
            <div className="flex max-lg:flex-col  p-20 gap-20  justify-between  ">
                <div className="w-full lg:w-[40%] relative ">
                    <div className="absolute z-[9] bg-radial w-[50px] h-[50px] rounded-full from-[rgb(208,116,195)]/10 right-40 top-60 to-transparent backdrop-blur-3xl shadow-[0_0px_305px_304px_rgb(208,116,195,0.1)]  "></div>

                    <Image
                        src={whyChooseUs}
                        alt="Why choose us"
                        className="h-[600px] max-sm:h-[300px] object-contain relative z-10"
                    />
                </div>
                <div className="w-full lg:w-[60%] flex flex-col justify-center">
                    <h1 className={`text-2xl ${anton.className} text-[#652CD6] uppercase mb-4`}>Why choose us</h1>
                    <HeadingText text="What Makes Us Stand Out" />
                    <p className="text-lg text-gray-300 py-4 mb-6 ">
                        we help artists go live fast — your music hits 100+ stores like Spotify & Apple Music within 48 hours. You keep 100% of your
                        rights, always. No cuts, no control games. And if you need help, real human support is just a call or email away — replies
                        within 24 hours. Simple. Fast. Artist-first.
                    </p>
                    <div className="flex flex-wrap mb-8 gap-2 relative z-10 text-white">
                        <h1 className="text-center text-xl">🚀 Faster Music Delivery</h1>
                        <div className="h-[20px] w-1 bg-[#652CD6]"></div>
                        <h1 className="text-center text-xl">🛡️ Keep your 100% Rights</h1>
                        <div className="h-[20px] w-1 bg-[rgb(101,44,214)]"></div>
                        <h1 className="text-center text-xl">📞 Real Human Support</h1>
                    </div>
                    <Button
                        variant="blue"
                        className="w-fit shadow-2xl shadow-violet-600">
                        <Link href="#">Get Started</Link>
                    </Button>
                </div>
            </div>
            <div
                className="p-20 bg-center bg-cover "
                style={{ backgroundImage: `url(${allessentialsbg.src})` }}>
                <h1 className={`text-2xl ${anton.className} text-[#652CD6] uppercase  text-center mb-10`}>Features</h1>
                <HeadingText
                    text="All the essentials, Right at Your Fingertips"
                    className="w-full text-center"
                />
                <div className="flex justify-center items-center gap-20 max-md:flex-col text-white mt-10">
                    <div className="w-[60%] max-md:w-full">
                        <Accordion
                            type="single"
                            collapsible
                            className=" w-full md:w-[100%]"
                            defaultValue="item-1">
                            <AccordionItem value="item-1" className='border-b-2 py-5 '>
                                <AccordionTrigger className=' text-2xl'><h1 className='flex gap-4'> <AiFillInstagram className='text-blue-500 w-10 h-10'/> Independent Artists</h1></AccordionTrigger>
                                <AccordionContent className="flex flex-col gap-4 text-base ml-10 w-[90%]  text-gray-300">
                                    <p>
                                        We offer 24/7 psychic and emotional support through holographic dolphins trained in advanced customer service.
                                        Just whisper your issue into a conch shell and wait for assistance.
                                    </p>
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-2" className='border-b-2 py-5 '>
                                <AccordionTrigger className=' text-2xl'><h1 className='flex gap-4'><AiFillInstagram className='text-blue-500 w-10 h-10'/> Record Labels & Collectives</h1></AccordionTrigger>
                                <AccordionContent className="flex flex-col gap-4 text-base ml-10 w-[90%]  text-gray-300">
                                    <p>
                                        Absolutely! In fact, we encourage users to upload remixes of bird songs and cover versions of alien
                                        transmissions. Copyright laws don’t apply in the metaverse.
                                    </p>
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-3" className='border-b-2 py-5 '>
                                <AccordionTrigger className=' text-2xl'><h1 className='flex gap-4'><AiFillInstagram className='text-blue-500 w-10 h-10'/>Producers & BeatMakers</h1></AccordionTrigger>
                                <AccordionContent className="flex flex-col gap-4 text-base ml-10 w-[90%]  text-gray-300">
                                    <p>
                                        We pay artists exclusively in space credits and rare NFTs of dancing potatoes. You can cash them out at any
                                        intergalactic taco stand.
                                    </p>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>
                    <div className="w-[40%] max-md:w-full flex items-center justify-center">
                        <Image
                            src={allessentialsimage}
                            alt="allessentialsimage"
                            className="h-[400px] w-[400px] "
                        />
                    </div>
                </div>
            </div>

            <div
                
                className="bg-cover bg-center p-12 py-20 flex flex-col justify-center items-center text-white">
                <HeadingText text="Our Services" />
                <h1 className="text-gray-300">Everything You Need to Take Your Music Further.</h1>
                <div className="grid grid-cols-3 max-md:grid-cols-1 py-10 justify-items-center w-full ">
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        style={{ backgroundImage: `url(${ourservices1.src})` }}
                        className="h-[500px] w-[400px] rounded-2xl bg-cover bg-center flex flex-col justify-end p-4">
                        <h1 className={`text-2xl ${anton.className}  uppercase mb-4`}>Music distribution</h1>
                        <p className="text-gray-300 ">
                            Distribute your music to 100+ platforms like Spotify, Apple Music, and more — fast and with full rights.
                        </p>
                    </motion.div>
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        style={{ backgroundImage: `url(${ourservices2.src})` }}
                        className="h-[500px] w-[400px] rounded-2xl bg-cover bg-center flex flex-col justify-end p-4">
                        <h1 className={`text-2xl ${anton.className}  uppercase mb-4`}>Music Marketing</h1>
                        <p className="text-gray-300 ">
                            Promote your music with smart tools, playlist pitching, social campaigns, and branding support.
                        </p>
                    </motion.div>
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        style={{ backgroundImage: `url(${ourservices3.src})` }}
                        className="h-[500px] w-[400px] rounded-2xl bg-cover bg-center flex flex-col justify-end p-4">
                        <h1 className={`text-2xl ${anton.className}  uppercase mb-4`}>Content Managment System</h1>
                        <p className="text-gray-300 ">
                            manage your releases, earnings, and data easily with all-in-one CMS Dashboard. Connect Your YT and we help your channel
                            grow
                        </p>
                    </motion.div>
                </div>
            </div>
         
            <Faq />
            <LetTheWorld />
        </div>
    )
}

export default HomePage
