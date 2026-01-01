'use client'
import React from 'react'
import Image from 'next/image'
import { delay, motion } from 'framer-motion'
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
import map from '@/public/images/home/map.png'
import artist1 from '@/public/images/home/artist1.png'
import artist2 from '@/public/images/home/artist2.png'
import artist3 from '@/public/images/home/artist3.png'
import Footer from '@/components/website/Footer'
import LetTheWorld from '@/components/website/LetTheWorld'
import Faq from '@/components/website/Faq'
import { FaMusic } from 'react-icons/fa'
import { HeadingText } from '@/components/FixedUiComponents'
import TestimonialSwiper from '@/components/website/TestimonialSwiper'
import { useIsMdAndUp } from '@/contexts/MediaQueryContext'

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

const HomePage = () => {
    // Get breakpoint value from context
    const isMdAndUp = useIsMdAndUp()

    const mainHeading = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.6, delay: 0.2, ease: 'easeOut' }, viewport: { once: true } }
    }
    const subHeading = {
        hidden: { opacity: 0, y:20 },
        visible: { opacity: 1, y:0, transition: { duration: 0.6, delay: 0.3, ease: 'easeOut' }, viewport: { once: true } }
    }

    return (
        <div className="overflow-x-hidden">
            <div className=" h-screen relative">
                <div
                    style={{ backgroundImage: `url(${herobg.src})` }}
                    className={`w-screen h-screen  bg-cover bg-top relative text-white`}>
                    <div className="w-full h-full absolute  bg-[#000000ba]"></div>
                    <div className="absolute z-[2] right-10 top-[50%] flex items-center justify-center gap-6">
                        <div className="flex ">
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ ease: 'easeOut', delay: 0.6 }}
                                viewport={{ once: true }}
                                className="w-12 h-12  rounded-full border-2 border-gray-950 overflow-hidden ">
                                {' '}
                                <Image
                                    src={artist1}
                                    alt="artist1"
                                    className="w-full h-full object-cover"
                                />{' '}
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ ease: 'easeOut', delay: 0.7 }}
                                viewport={{ once: true }}
                                className="w-12 h-12 ml-[-10px] rounded-full border-2 border-gray-950 overflow-hidden ">
                                {' '}
                                <Image
                                    src={artist2}
                                    alt="artist2"
                                    className="w-full h-full object-cover"
                                />{' '}
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ ease: 'easeOut', delay: 0.8 }}
                                viewport={{ once: true }}
                                className="w-12 h-12 ml-[-10px] rounded-full border-2 border-gray-950 overflow-hidden ">
                                {' '}
                                <Image
                                    src={artist3}
                                    alt="artist3"
                                    className="w-full h-full object-cover"
                                />{' '}
                            </motion.div>
                        </div>

                        <motion.h1
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ ease: 'easeOut', delay: 1 }}
                            viewport={{ once: true }}
                            className="text-gray-300 text-sm">
                            TRUSTED BY 200K+ ARTISTS
                        </motion.h1>
                    </div>
                    <div className="relative pt-[150px] md:pt-[100px]  ">
                        <motion.h1
                            variants={mainHeading}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className={`${anton.className} text-[50px] sm:text-[70px]  md:text-[100px]  leading-none text-center  uppercase text-transparent bg-clip-text`}
                            style={isMdAndUp ? {
                                backgroundImage: `radial-gradient(circle at center -200px, rgba(249, 244, 237, 1) 30%,rgba(180,160,255,0.6) 60%,  rgba(100,100,255,0.2) 70%)`
                            } : {color: '#cfc6d5' }}>
                            YOUR MUSIC
                            <br />
                        </motion.h1>
                        <motion.h1
                            variants={mainHeading}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className={`${anton.className} text-[50px] sm:text-[70px]  md:text-[100px]  leading-none text-center  uppercase text-transparent bg-clip-text`}
                            style={isMdAndUp ? {
                                backgroundImage: `radial-gradient(circle at center -250px, rgba(249, 244, 237, 1) 30%,rgba(180,160,255,0.6) 60%,  rgba(100,100,255,0.2) 70%)`
                            } : {color: '#cfc6d5' }}>
                            Our Mission
                            <br />
                        </motion.h1>
                        <motion.h1
                            variants={subHeading}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="text-center mt-6 max-sm:text-xs">
                            Distribute your music to top platforms, grow your <br /> audience, and get the recognition you deserve.
                        </motion.h1>
                        <motion.div
                            variants={subHeading}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="flex justify-center items-center mt-6 gap-2 relative z-10">
                            <h1 className="text-center max-sm:text-xs text-xl">🚀 Music Distribution</h1>
                            <div className="h-[20px] w-1 bg-[#652CD6]"></div>
                            <h1 className="text-center max-sm:text-xs text-xl">🛡️ Marketing</h1>
                            <div className="h-[20px] w-1 bg-[#652CD6]"></div>
                            <h1 className="text-center max-sm:text-xs text-xl">📞 Artist & Label Solutions</h1>
                        </motion.div>
                        <motion.div
                            variants={subHeading}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="flex justify-center items-center mt-6 relative z-10 max-sm:mt-10">
                            <Button
                                variant="blue"
                                className="shadow-2xl shadow-violet-600">
                                <Link href="/signup">Start Free Now</Link>
                            </Button>
                        </motion.div>
                    </div>
                </div>
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5, ease: 'easeInOut' }}>
                    <Image
                        src={hero2}
                        alt=""
                        className="h-[400px] object-cover lg:w-screen absolute bottom-[-50px] lg:bottom-[-150px] z-[9]"
                    />
                </motion.div>
            </div>
            <div
                style={{ backgroundImage: `url(${ourMissionBg.src})` }}
                className="w-screen relative h-fit bg-cover bg-center mt-[100px] text-white">
                <div className="w-full flex px-20 items-center justify-center mt-[-80px] absolute z-10">
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
                <div className="flex max-lg:flex-col flex-wrap p-20 max-lg:gap-20 pt-50 ">
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
                            <Link href="/signup">Get Started</Link>
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
            <div className="flex max-lg:flex-col  p-20  gap-20  justify-between  ">
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
                    <HeadingText text="Artist-First Philosophy" />
                    <p className="text-lg text-gray-300 py-4 mb-6 ">
                        In short, Maheshwari Visuals isn’t just a distributor—it’s a creative ecosystem built to empower, elevate, and evolve with the
                        artist.
                    </p>
                    <div className="flex flex-wrap mb-8 gap-2 relative z-10 text-white">
                        <h1 className="text-center text-xl">🚀 Powerful Tools & Dashboard</h1>
                        <div className="h-[20px] w-1 bg-[#652CD6]"></div>
                        <h1 className="text-center text-xl">🛡️ Marketing & Exposure</h1>
                        <div className="h-[20px] w-1 bg-[rgb(101,44,214)]"></div>
                        <h1 className="text-center text-xl">📞 Community & Collaboration</h1>
                    </div>
                    <Button
                        variant="blue"
                        className="w-fit shadow-2xl shadow-violet-600">
                        <Link href="/signup">Get Started</Link>
                    </Button>
                </div>
            </div>

            <div
                style={{ backgroundImage: `url(${ourServicesBg.src})` }}
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
            <div className="p-12 py-16  flex flex-col justify-center items-center text-white">
                <HeadingText text="trusted by 200k+ artists & Labels Globally" />
                <h1 className="text-center w-[80%] text-gray-300">
                    We have roaster full of Artist and Labels across the Globe. We are here to get you collaborations with artists, fulfilling the
                    needs. Our roaster algorithim will help you to get collaboration according to your taste in Music.
                </h1>
                <Image
                    src={map}
                    alt="map"
                    className="w-full object-contain mt-10"
                />
            </div>

            <div
                style={{ backgroundImage: `url(${ourServicesBg.src})` }}
                className="p-12 py-16  text-white bg-cover bg-center">
                <div className="flex justify-center items-center">
                    <HeadingText text="Voices of the vibe" />
                </div>
                <div className="w-[80%] h-auto flex justify-center  mx-auto ">
                    <TestimonialSwiper />
                </div>
            </div>
            <Faq />
            <LetTheWorld />
        </div>
    )
}

export default HomePage
