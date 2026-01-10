'use client'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Anton } from 'next/font/google'
import { client } from '@/sanity/lib/client'
import imageUrlBuilder from '@sanity/image-url'
import { HeadingText } from '@/components/FixedUiComponents'
import { Button } from '@/components/ui/button'

const anton = Anton({
    weight: ['400'],
    subsets: ['latin']
})

const builder = imageUrlBuilder(client)

function urlFor(source) {
    return builder.image(source)
}

export default function BlogPage() {
    const [blogs, setBlogs] = useState([])
    const [featuredBlog, setFeaturedBlog] = useState(null)
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [loading, setLoading] = useState(true)

    const categories = [
        { label: 'All', value: 'all' },
        { label: 'Music Distribution', value: 'music-distribution' },
        { label: 'Industry News', value: 'industry-news' },
        { label: 'Tips & Tricks', value: 'tips-tricks' },
        { label: 'Artist Stories', value: 'artist-stories' },
        { label: 'Technology', value: 'technology' }
    ]

    useEffect(() => {
        async function fetchBlogs() {
            try {
                const query = `*[_type == "blog" && status == "published"] | order(publishDate desc) {
                    _id,
                    title,
                    slug,
                    thumbnail,
                    excerpt,
                    author,
                    category,
                    publishDate,
                    views,
                    featured,
                    "commentsCount": count(comments)
                }`

                console.log('Fetching blogs from Sanity...')
                const data = await client.fetch(query)
                console.log('Fetched blogs:', data)
                console.log('Total blogs found:', data.length)

                setBlogs(data)

                const featured = data.find(blog => blog.featured)
                setFeaturedBlog(featured || data[0])
                setLoading(false)
            } catch (error) {
                console.error('Error fetching blogs:', error)
                console.error('Error details:', error.message)
                setLoading(false)
            }
        }

        fetchBlogs()
    }, [])

    const filteredBlogs = selectedCategory === 'all'
        ? blogs
        : blogs.filter(blog => blog.category === selectedCategory)

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0A0E1A] flex items-center justify-center">
                <div className="text-white text-2xl">Loading...</div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#0A0E1A] text-white">
            {/* Hero Section */}
            <div className="relative pt-32 pb-20 px-6 md:px-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h1
                        className={`${anton.className} text-[60px] md:text-[100px] uppercase text-transparent bg-clip-text mb-4`}
                        style={{
                            backgroundImage: `radial-gradient(circle at center -20%, rgba(249, 244, 237, 1) 40%, rgba(234,228,255,0.6) 70%)`
                        }}
                    >
                        Our Blog
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Stay updated with the latest news, tips, and insights from the music industry
                    </p>
                </motion.div>

                {/* Featured Blog */}
                {featuredBlog && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="max-w-7xl mx-auto mb-20"
                    >
                        <Link href={`/blog/${featuredBlog.slug.current}`}>
                            <div className="relative h-[400px] md:h-[500px] rounded-3xl overflow-hidden group cursor-pointer">
                                <Image
                                    src={urlFor(featuredBlog.thumbnail).width(1200).url()}
                                    alt={featuredBlog.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                                    <span className="inline-block px-4 py-2 bg-purple-600 rounded-full text-sm mb-4">
                                        Featured
                                    </span>
                                    <h2 className={`${anton.className} text-4xl md:text-6xl mb-4`}>
                                        {featuredBlog.title}
                                    </h2>
                                    <p className="text-gray-300 mb-4 line-clamp-2">{featuredBlog.excerpt}</p>
                                    <div className="flex items-center gap-4 text-sm text-gray-400">
                                        <span>{featuredBlog.author}</span>
                                        <span>•</span>
                                        <span>{formatDate(featuredBlog.publishDate)}</span>
                                        <span>•</span>
                                        <span>{featuredBlog.views} views</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                )}
            </div>

            {/* Category Filter */}
            <div className="px-6 md:px-20 mb-12">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-wrap gap-3">
                        {categories.map((cat) => (
                            <button
                                key={cat.value}
                                onClick={() => setSelectedCategory(cat.value)}
                                className={`px-6 py-2 rounded-full transition-all ${
                                    selectedCategory === cat.value
                                        ? 'bg-purple-600 text-white'
                                        : 'bg-[#1d2334] text-gray-400 hover:bg-[#252b3f]'
                                }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Blog Grid */}
            <div className="px-6 md:px-20 pb-20">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredBlogs.map((blog, index) => (
                            <motion.div
                                key={blog._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: index * 0.1 }}
                            >
                                <Link href={`/blog/${blog.slug.current}`}>
                                    <div className="bg-gradient-to-b from-[#1d2334] to-[#151A27] rounded-3xl overflow-hidden group cursor-pointer h-full shadow-custom hover:shadow-purple-500/20 transition-all duration-300">
                                        <div className="relative h-[240px] overflow-hidden">
                                            <Image
                                                src={urlFor(blog.thumbnail).width(600).url()}
                                                alt={blog.title}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        </div>
                                        <div className="p-6">
                                            <div className="flex items-center gap-2 mb-3">
                                                <span className="text-xs px-3 py-1 bg-purple-600/20 text-purple-400 rounded-full">
                                                    {categories.find(c => c.value === blog.category)?.label || blog.category}
                                                </span>
                                            </div>
                                            <h3 className={`${anton.className} text-2xl mb-3 line-clamp-2 group-hover:text-purple-400 transition-colors`}>
                                                {blog.title}
                                            </h3>
                                            <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                                                {blog.excerpt}
                                            </p>
                                            <div className="flex items-center justify-between text-xs text-gray-500">
                                                <span>{blog.author}</span>
                                                <span>{formatDate(blog.publishDate)}</span>
                                            </div>
                                            <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                                                <span>{blog.views} views</span>
                                                <span>•</span>
                                                <span>{blog.commentsCount || 0} comments</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>

                    {filteredBlogs.length === 0 && (
                        <div className="text-center py-20">
                            <p className="text-gray-400 text-lg">No blogs found in this category.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
