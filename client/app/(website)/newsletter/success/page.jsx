'use client'
import React from 'react'
import { Syne, Inter, Anton } from 'next/font/google'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'

const syne = Syne({
    subsets: ['latin'],
    weight: ['400', '600', '700', '800']
})

const inter = Inter({
    subsets: ['latin'],
    weight: ['300', '400', '500']
})

const anton = Anton({
    weight: ['400'],
    subsets: ['latin']
})

export default function NewsletterSuccessPage() {
    return (
        <div className={`min-h-screen bg-[#0e1221] flex items-center justify-center p-4 md:p-6 ${inter.className}`}>
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-[480px] w-full bg-[#151a27] border border-[#232b42] overflow-hidden"
            >
                {/* HEADER */}
                <div className="p-10 pb-0 bg-[#151a27]">
                    <img 
                        src="https://www.maheshwarivisuals.com/assets/img/logo/logo.png"
                        alt="Maheshwari Visuals" 
                        className="w-[120px] h-10 object-cover block"
                    />
                    <div className="mt-5 h-[2px] flex">
                        <div className="w-8 bg-[#6c63ff]"></div>
                        <div className="flex-1 bg-[#232b42]"></div>
                    </div>
                </div>

                {/* ICON */}
                <div className="p-11 pb-0 flex justify-center">
                    <div className="w-[72px] h-[72px] bg-[#6c63ff] rounded-full flex items-center justify-center">
                        <svg viewBox="0 0 1024 1024" width="40" height="40" fill="#ffffff">
                            <path d="M771.6352 905.1136L650.24 814.1312l30.72-41.0112 83.4048 62.6176 163.584-186.9824 38.5024 33.6896-194.816 222.6688zM102.4 204.8v614.4h409.6v-51.2H153.6V280.9344l358.4 262.8096 358.4-262.8096V512h51.2V204.8z m103.8336 51.2h611.5328L512 480.256z" />
                        </svg>
                    </div>
                </div>

                {/* CONTENT */}
                <div className="p-7 px-10 pb-9 text-center">
                    <div className={`${syne.className} text-[10px] font-medium text-[#a78bfa] tracking-[2.5px] uppercase mb-3 flex items-center justify-center gap-2`}>
                        <span className="w-5 h-[1px] bg-[#232b42]"></span>
                        Confirmed
                        <span className="w-5 h-[1px] bg-[#232b42]"></span>
                    </div>
                    <h2 className={`${syne.className} text-[26px] font-extrabold text-white tracking-[-0.5px] mb-3 leading-[1.15]`}>
                        You're In the <span className="text-[#a78bfa]">Rhythm!</span>
                    </h2>
                    <p className="text-[13px] font-light text-[#6b7394] leading-[1.8] mb-7 max-w-[320px] mx-auto">
                        Welcome to the Maheshwari Visuals family. You'll now receive our latest updates on music distribution, artist spotlights, and industry insights straight to your inbox.
                    </p>
                    <Link href="/">
                        <Button className="bg-[#6c63ff] hover:bg-[#5b54d6] text-white py-3 px-8 text-[11px] font-semibold tracking-[1.5px] uppercase rounded-[2px] h-auto font-syne">
                            Visit Our Website
                        </Button>
                    </Link>
                </div>

                {/* FOOTER */}
                <div className="p-5 px-10 pb-6 bg-[#1b2236] border-t border-[#232b42] text-center">
                    <div className="mb-3 flex flex-wrap justify-center gap-x-5 gap-y-1">
                        {[
                            { name: 'Website', url: '/' },
                            { name: 'Instagram', url: 'https://www.instagram.com/maheshwarivisuals' },
                            { name: 'YouTube', url: 'https://www.youtube.com/maheshwarivisuals' },
                            { name: 'LinkedIn', url: 'https://www.linkedin.com/company/maheshwarivisuals/' }
                        ].map((link) => (
                            <Link 
                                key={link.name} 
                                href={link.url} 
                                className="text-[10px] tracking-[1px] uppercase text-[#6b7394] hover:text-[#a78bfa] transition-colors"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>
                    <p className="text-[10.5px] text-[#6b7394] opacity-60 leading-[1.6] mb-1">
                        Maheshwari Complex, Near Gandhi Park, Bilsi, India — 243633
                    </p>
                    <p className="text-[10px] text-[#6b7394] opacity-40 leading-[1.6]">
                        © 2026 Maheshwari Visuals. All rights reserved.
                    </p>
                </div>
            </motion.div>
        </div>
    )
}
