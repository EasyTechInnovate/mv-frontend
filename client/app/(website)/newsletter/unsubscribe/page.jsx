'use client'
import React from 'react'
import { Syne, Inter } from 'next/font/google'
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

export default function NewsletterUnsubscribePage() {
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
                    <div className="w-[72px] h-[72px] bg-gradient-to-br from-[#2a2f45] to-[#1b2236] border-2 border-[#232b42] rounded-full flex items-center justify-center">
                        <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="#6b7394" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M2 6l10 7 10-7"/>
                            <rect x="2" y="4" width="20" height="16" rx="2"/>
                            <line x1="4" y1="20" x2="20" y2="4" stroke="#6c63ff" strokeWidth="1.5"/>
                        </svg>
                    </div>
                </div>

                {/* CONTENT */}
                <div className="p-7 px-10 pb-9 text-center">
                    <div className={`${syne.className} text-[10px] font-medium text-[#6b7394] tracking-[2.5px] uppercase mb-3 flex items-center justify-center gap-2`}>
                        <span className="w-5 h-[1px] bg-[#232b42]"></span>
                        Unsubscribed
                        <span className="w-5 h-[1px] bg-[#232b42]"></span>
                    </div>
                    <h2 className={`${syne.className} text-[26px] font-extrabold text-white tracking-[-0.5px] mb-3 leading-[1.15]`}>
                        You've Left the <span className="text-[#6c63ff]">Rhythm</span>
                    </h2>
                    <p className="text-[13px] font-light text-[#6b7394] leading-[1.8] mb-7 max-w-[320px] mx-auto">
                        You have been successfully removed from our mailing list. We're sorry to see you go — you can always come back whenever you're ready.
                    </p>
                    <Link href="/">
                        <Button variant="outline" className="border-[#6c63ff] text-[#a78bfa] hover:bg-[#6c63ff]/10 bg-transparent py-3 px-8 text-[11px] font-semibold tracking-[1.5px] uppercase rounded-[2px] h-auto font-syne">
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
