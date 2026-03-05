'use client'
import React, { useEffect, useState } from 'react'
import { Anton } from 'next/font/google'
import { motion } from 'framer-motion'
import Image from 'next/image'
import herobg from '@/public/images/forartist/herobg.png'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { getNewsItems } from '@/services/api.services'

const anton = Anton({
    weight: ['400'],
    subsets: ['latin']
})

export default function PressPage() {
    const [newsItems, setNewsItems] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const res = await getNewsItems()
                setNewsItems(res?.data || [])
            } catch (err) {
                console.error('Failed to fetch news items:', err)
            } finally {
                setLoading(false)
            }
        }
        fetchNews()
    }, [])

    return (
        <div className="overflow-x-hidden">
            {/* ── Hero ──────────────────────────────────────────────────── */}
            <div
                style={{ backgroundImage: `url(${herobg.src})` }}
                className="bg-cover bg-center min-h-[80vh] w-full flex flex-col justify-center items-center pt-[150px]"
            >
                <motion.div
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col items-center gap-6"
                >
                    <h1
                        className={`${anton.className} text-[70px] sm:text-[100px] leading-[1.05] text-center uppercase text-transparent bg-clip-text`}
                        style={{
                            backgroundImage:
                                'radial-gradient(circle at center -20%, rgba(249,244,237,1) 40%, rgba(234,228,255,0.6) 70%)'
                        }}
                    >
                        In The News
                    </h1>

                    <p className="text-center text-gray-300 max-w-[520px] text-base px-4">
                        In the headlines, behind the scores—discover how Maheshwari Visuals is shaping
                        the cultural narrative.
                    </p>

                    <Button variant="blue" className="shadow-2xl shadow-violet-600">
                        <Link href="/signup">Start Free Now</Link>
                    </Button>
                </motion.div>
            </div>

            {/* ── Press Logos Grid ──────────────────────────────────────── */}
            <section className="w-full px-6 py-20 max-w-6xl mx-auto">
                {loading ? (
                    /* Skeleton */
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div
                                key={i}
                                className="rounded-2xl bg-[#151A27] animate-pulse h-[140px]"
                            />
                        ))}
                    </div>
                ) : newsItems.length === 0 ? (
                    <div className="text-center text-gray-500 py-20">
                        No press coverage to show yet.
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                        {newsItems.map((item, index) => (
                            <motion.a
                                key={item._id}
                                href={item.articleUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: index * 0.06 }}
                                whileHover={{ scale: 1.04, boxShadow: '0 0 20px rgba(101,44,214,0.35)' }}
                                className="
                                    group relative flex items-center justify-center
                                    rounded-2xl overflow-hidden cursor-pointer
                                     shadow-custom bg-gradient-to-b from-[#1d2334] bg-[#151A27]
                                    border border-white/5 h-[200px] p-6
                                    transition-all duration-300
                                "
                            >
                                {/* Subtle hover glow overlay */}
                                <div className="absolute inset-0 bg-purple-600/0 group-hover:bg-purple-600/5 transition-all duration-300 rounded-2xl" />

                                <div className="relative w-full h-full flex items-center justify-center">
                                    <img
                                        src={item.imageUrl}
                                        alt="publisher logo"
                                        className="max-w-full max-h-full object-contain filter brightness-90 group-hover:brightness-110 transition-all duration-300"
                                    />
                                </div>

                                {/* Bottom external link indicator */}
                                <div className="absolute bottom-2 right-3 opacity-0 group-hover:opacity-60 transition-opacity duration-200">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="12"
                                        height="12"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="white"
                                        strokeWidth="2"
                                    >
                                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                        <polyline points="15 3 21 3 21 9" />
                                        <line x1="10" y1="14" x2="21" y2="3" />
                                    </svg>
                                </div>
                            </motion.a>
                        ))}
                    </div>
                )}
            </section>
        </div>
    )
}
