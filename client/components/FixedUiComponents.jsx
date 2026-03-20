'use client'
import React, { useEffect, useState } from 'react'
import { Anton } from 'next/font/google'
import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import { Button } from './ui/button'
import Link from 'next/link'
import { useIsDesktop } from '../contexts/MediaQueryContext'

const anton = Anton({
    weight: ['400'],
    subsets: ['latin']
})

export const HeadingText = ({ text, className }) => {
    return (
        <div>
            <h1
                className={`${anton.className} text-[50px] mb-4 sm:text-[60px] w-fit leading-[1.1]  uppercase text-transparent bg-clip-text ${className}`}
                style={{
                    backgroundImage: `radial-gradient(circle at center -20%  , rgba(249, 244, 237, 1) 40% ,rgba(234,228,255,0.6) 70%`
                }}>
                {text}
            </h1>
        </div>
    )
}

export const MainHeadingText = ({ text, text2, text3, className }) => {

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
            
            >
            <h1
                className={`${anton.className} text-[80px]  mb-4 sm:text-[100px] w-screen leading-[1.1] text-center uppercase text-transparent bg-clip-text ${className}`}
                style={{
                    backgroundImage: `radial-gradient(circle at center -20%  , rgba(249, 244, 237, 1) 40% ,rgba(234,228,255,0.6) 70%`
                }}>
                {text} {text2 && <br />}  {text2} <br /> {text3}
            </h1>
        </motion.div>
    )
}

// Helper component to extract box content (eliminates code duplication)
const BoxContent = ({ item }) => (
    <>
        <div
            style={{ boxShadow: `0 0 30px 0px ${item.iconbg}`, backgroundColor: item.iconbg }}
            className={`w-[60px] h-[60px] p-2 rounded-xl`}>
            <Image
                src={item.icon}
                alt={item.title}
                className="w-full h-full"
            />
        </div>
        <h1 className={`${anton.className} text-4xl`}>{item.title}</h1>
        {item.items.map((text, index) => (
            <div key={index} className="flex items-top mb-2">
                <div className="mx-1 mt-1">•</div>
                <h1 className="text-gray-300 text-sm mx-3 my-1">{text}</h1>
            </div>
        ))}
    </>
)

// Wrapper component that handles responsive animations
const AnimatedBox = ({ item, direction, className }) => {
    const isDesktop = useIsDesktop()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    // Render without animation wrapper until client-side mounted
    if (!mounted) {
        return (
            <div className={className}>
                <BoxContent item={item} />
            </div>
        )
    }

    // Get animation values based on direction and screen size
    const getAnimationProps = () => {
        if (isDesktop) {
            return {
                initial: { x: direction === 'left' ? -200 : 200, opacity: 0 },
                whileInView: { x: 0, opacity: 1 }
            }
        }
        return {
            initial: { y: 200, opacity: 0 },
            whileInView: { y: 0, opacity: 1 }
        }
    }

    return (
        <motion.div
            {...getAnimationProps()}
            transition={{ duration: 0.4, delay: 0.05 }}
            viewport={{ once: true }}
            className={className}>
            <BoxContent item={item} />
        </motion.div>
    )
}

export const TwoHalfBoxes = ({ item1, item2 }) => {
    return (
        <div className="w-full p-10 md:p-20 flex justify-between items-top gap-[50px] max-lg:flex-col max-md:gap-8">
            <AnimatedBox
                item={item1}
                direction="left"
                className="w-[50%] max-lg:w-full max-lg:mb-14 h-auto shadow-custom bg-gradient-to-b from-[#1d2334] bg-[#151A27] rounded-t-3xl px-8 sm:px-14 py-10 text-white space-y-6"
            />
            <AnimatedBox
                item={item2}
                direction="right"
                className="w-[50%] max-lg:w-full h-auto shadow-custom bg-gradient-to-b from-[#1d2334] bg-[#151A27] rounded-t-3xl px-8 sm:px-14 py-10 text-white space-y-6"
            />
        </div>
    )
}

export const FullBox = ({ item1 }) => {
    return (
        <motion.div
            initial={{ y: 200, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            viewport={{ once: true }}
            className="w-full p-10 md:p-20 py-10 flex justify-between items-top gap-[50px] max-md:flex-col max-md:gap-8 ">
            <div className="w-full h-auto shadow-custom bg-gradient-to-b from-[#1d2334] bg-[#151A27]  rounded-t-3xl px-8 sm:px-14 py-10 text-white space-y-6 flex max-md:flex-col gap-4 ">
                <div className="w-[50%] max-md:w-full space-y-6">
                    <div
                        style={{ boxShadow: `0 0 30px 0px ${item1.iconbg}`, backgroundColor: item1.iconbg }}
                        className={`w-[60px] h-[60px] p-2   rounded-xl `}>
                        <Image
                            src={item1.icon}
                            alt={item1.title}
                            className="w-full h-full"
                        />
                    </div>
                    <h1 className={`${anton.className} text-4xl`}>{item1.title}</h1>
                    {item1.items.map((item, index) => (
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

                    {item1.buttonText && item1.buttonLink && (
                        <Button
                            variant="blue"
                            className="mt-4">
                            {' '}
                            <Link href={item1.buttonLink}> {item1.buttonText} </Link>{' '}
                        </Button>
                    )}
                </div>
                <div className="w-[50%] max-md:w-full h-[300px] flex items-center justify-center">
                    <Image
                        src={item1.image}
                        alt={item1.title}
                        style={{ boxShadow: '0 0 10px 0 #BB9BFF' }}
                        className="w-[90%] h-full  rounded-xl"
                    />
                </div>
            </div>
        </motion.div>
    )
}
