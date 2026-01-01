import Faq from '@/components/website/Faq'
import LetTheWorld from '@/components/website/LetTheWorld'
import React from 'react'
import herobg from '@/public/images/mvadvertisement/herobg.png'
import { HeadingText, MainHeadingText } from '@/components/FixedUiComponents'
import { Button } from '@/components/ui/button'
import ourMission from '@/public/images/home/ourmission.png'
import circleText from '@/public/images/home/circletext.svg'
import mahiisdiffrentbg from '@/public/images/mahi/mahiisdiffrentbg.png'
import whyChooseUs from '@/public/images/home/whychooseus.png'

import { Anton } from 'next/font/google';
import Image from 'next/image'
import Link from 'next/link'
import { FaMusic } from 'react-icons/fa'
const anton = Anton({
    weight: ["400",],
    subsets: ["latin"],
});


const page = () => {
    return (
        <div className='overflow-x-hidden '>
            <div style={{ backgroundImage: `url(${herobg.src})` }} className='bg-cover bg-center min-h-screen w-full flex flex-col justify-center items-center pt-[150px]'>
                <MainHeadingText text='Hi, I am Mahi. ' text2='your smart assistant' text3='for all music things!' />
                <h1 className='w-[60%] max-md:w-[90%] my-5 text-gray-300 text-center'>Mahi is your intelligent music assistant, here to guide you through distribution, royalties, platform uploads, and everything in between. Whether you're just starting out or scaling up, Mahi’s got your back—24/7.</h1>
                <Button variant='blue' className='shadow-2xl mt-5 shadow-violet-600'>Chat with Mahi</Button>
            </div>
             <div className='flex max-lg:flex-col p-20 gap-20  justify-between  '>

                <div className='w-full lg:w-[40%] relative '>
                    <div className='absolute z-[9] bg-radial w-[50px] h-[50px] rounded-full from-[rgb(208,116,195)]/10 right-40 top-60 to-transparent backdrop-blur-3xl shadow-[0_0px_305px_304px_rgb(208,116,195,0.1)]  '></div>

                    <Image src={whyChooseUs} alt="Why choose us" className='h-[600px] max-sm:h-[300px] object-contain relative z-10' />
                </div>
                <div className='w-full lg:w-[60%] flex flex-col justify-center'>
                    <h1 className={`text-2xl ${anton.className} text-[#652CD6] uppercase mb-4`}>Hello Mahi!</h1>
                    <HeadingText text='Who is Mahi?' />
                    <p className='text-lg text-gray-300 py-4 mb-6 '>
                        Mahi is your AI-powered music business sidekick, crafted especially for artists, labels, and music creators. From uploading your first track to tracking royalties and managing distributions—Mahi makes it all simple. Always on, always learning, and always humble (no auto-tune or ego here 😉).
                    </p>

                    <Button variant="blue" className='w-fit shadow-2xl shadow-violet-600'><Link href="/signup" >Get Started</Link></Button>
                </div>
            </div>

            <div style={{ backgroundImage: `url(${mahiisdiffrentbg.src})` }} className='w-screen relative h-fit bg-cover bg-center text-white'>

                <div className='flex max-lg:flex-col flex-wrap p-20 max-lg:gap-20 '>
                    <div className='w-full lg:w-[60%] sm:pr-5'>
                        <h1 className={`text-2xl ${anton.className} text-[#652CD6] uppercase mb-4`}>Mahi is differnt</h1>
                        <HeadingText text='What Makes Mahi Unique?' />
                        <p className='text-lg text-gray-300 py-4 mb-6 pr-20'>
                            Mahi isn’t just another chatbot — it’s your smart, music-savvy companion. Built specifically for the music industry, Mahi understands your needs as an artist or label and provides instant, easy-to-understand answers. From royalty splits to releasing on platforms like Spotify, Apple Music, and JioSaavn — Mahi’s got it covered. <br /> <br /> Speak in English, Hindi, or your native language — Mahi gets it. No confusion, just clear guidance. <br /> <br /> With Mahi by your side, you’ll spend less time figuring things out and more time doing what you love — creating music.
                        </p>

                        <Button variant="blue"><Link href="#">Get Started</Link></Button>
                    </div>
                    <div className='w-full lg:w-[40%] relative '>
                        <div className='absolute z-[9] bg-radial w-[50px] h-[50px] rounded-full from-[rgb(208,116,195)]/10 right-40 top-40 to-transparent backdrop-blur-3xl shadow-[0_0px_405px_404px_rgb(208,116,195,0.1)]  '></div>
                        <div className='absolute z-20 -top-5 left-0 ' >
                            <Image src={circleText} alt="Circle Text" className=' w-[150px] h-[150px] max-sm:w-[100px] max-sm:h-[100px] object-contain animate-[spin_20s_linear_infinite] origin-center ' />
                            <FaMusic className='absolute text-2xl top-[50%]  left-[50%] transform translate-x-[-50%] translate-y-[-50%]' />
                        </div>
                        <Image src={ourMission} alt="Our Mission" className='h-[600px] max-sm:h-[300px] object-contain relative z-10' />
                    </div>
                </div>
            </div>

           


            <Faq />
            <LetTheWorld />
        </div>
    )
}

export default page