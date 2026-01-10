'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import logo from '@/public/images/maheshwarilogo.png'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

const features = [
    { name: 'For Artists', href: '/features/for-artists' },
    { name: 'For Labels', href: '/features/for-labels' },
    { name: 'MV Advertisement', href: '/features/mv-advertisement' },
    { name: 'Mahi', href: '/features/mahi' },
]

const brands = [
    { name: 'MV Distribution', href: '/brands/mv-distribution' },
    { name: 'MV Marketing', href: '/brands/mv-marketing' },
    { name: 'MV Production', href: '/brands/mv-production' },
    { name: 'Music Merch Company', href: '/brands/music-merch-company' }
]

const dropdownVariants = {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.2 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } }
}

export default function WebsiteHeader() {
    const [isFeaturesOpen, setIsFeaturesOpen] = useState(false)
    const [isBrandsOpen, setIsBrandsOpen] = useState(false)
     const [isScrolled, setIsScrolled] = useState(false)
    const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 200)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // background class logic
  const headerBgClass =
    pathname === '/'
      ? isScrolled
        ? 'bg-[#151A27]'
        : 'bg-transparent'
      : 'bg-[#151A27]'

    return (
        <motion.header
            initial={{ opacity: 0, y: -50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{once:true}}
            transition={{ duration: 0.5 }}
            className={`fixed w-full top-0 z-50 text-base ${headerBgClass}  `}>
            <motion.nav className="container  mx-auto px-4 py-4 flex items-center justify-between ">
                <div className="flex-shrink-0">
                    <Link
                        href="/"
                        className="flex items-center text-white text-sm font-bold">
                        <Image
                            src={logo}
                            alt="Universal Visuals Logo"
                            className="h-10 w-auto"
                        />
                    </Link>
                </div>

                <div className="hidden lg:flex items-center space-x-8">
                    <Link
                        href="/"
                        className="text-gray-300 hover:text-white transition-colors duration-200">
                        Home
                    </Link>

                    <div
                        className="relative"
                        onMouseEnter={() => setIsFeaturesOpen(true)}
                        onMouseLeave={() => setIsFeaturesOpen(false)}>
                        <button className="flex items-center text-gray-300 hover:text-white transition-colors duration-200 focus:outline-none ">
                            Features
                            <svg
                                className="ml-2 h-4 w-4 transform transition-transform duration-200"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                style={{ transform: isFeaturesOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                        </button>
                        <AnimatePresence>
                            {isFeaturesOpen && (
                                <motion.div
                                    className="absolute left-0 mt-3 w-fit whitespace-nowrap rounded-3xl shadow-custom-nav p-2 bg-[#151A27] bg-opacity-70 backdrop-blur-sm  border-t overflow-hidden"
                                    variants={dropdownVariants}
                                    initial="initial"
                                    animate="animate"
                                    exit="exit">
                                    {features.map((item) => (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            className="block px-4 py-2 text-sm text-center text-gray-400 rounded-2xl hover:text-white transition-colors duration-200">
                                            {item.name}
                                        </Link>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <Link
                        href="/pricing/everyone"
                        className="text-gray-300 hover:text-white transition-colors duration-200">
                        Pricing
                    </Link>
                    <Link
                        href="/sync"
                        className="text-gray-300 hover:text-white transition-colors duration-200">
                        Sync
                    </Link>

                    <div
                        className="relative"
                        onMouseEnter={() => setIsBrandsOpen(true)}
                        onMouseLeave={() => setIsBrandsOpen(false)}>
                        <button className="flex items-center text-gray-300 hover:text-white transition-colors duration-200 focus:outline-none">
                            Brands
                            <svg
                                className="ml-2 h-4 w-4 transform transition-transform duration-200"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                style={{ transform: isBrandsOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                        </button>
                        <AnimatePresence>
                            {isBrandsOpen && (
                                <motion.div
                                    className="absolute left-0 mt-3 w-fit whitespace-nowrap rounded-3xl shadow-custom-nav  p-2 bg-[#151A27] bg-opacity-70 backdrop-blur-sm border-t overflow-hidden"
                                    variants={dropdownVariants}
                                    initial="initial"
                                    animate="animate"
                                    exit="exit">
                                    {brands.map((item) => (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            className="block px-4 py-2 text-sm text-center text-gray-400 rounded-2xl  hover:text-white transition-colors duration-200">
                                            {item.name}
                                        </Link>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <Link
                        href="/blog"
                        className="text-gray-300 hover:text-white transition-colors duration-200">
                        Blogs
                    </Link>
                </div>

                <div className="flex items-center space-x-4">
                    <Link href='/signin' className="px-6 py-2 bg-violet-700 text-white rounded-lg font-semibold hover:bg-violet-600 transition-colors duration-200 shadow-lg cursor-pointer">
                        Login
                    </Link>
                    <Link href='/signup' className="px-6 py-2 border border-white text-white rounded-lg font-semibold hover:text-white cursor-pointer transition-colors duration-200">
                        Free Sign Up
                    </Link>
                </div>
            </motion.nav>
        </motion.header>
    )
}
