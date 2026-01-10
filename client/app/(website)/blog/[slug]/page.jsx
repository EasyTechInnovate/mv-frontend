'use client'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Anton } from 'next/font/google'
import { client } from '@/sanity/lib/client'
import { writeClient } from '@/sanity/lib/write-client'
import imageUrlBuilder from '@sanity/image-url'
import { PortableText } from '@portabletext/react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { FaFacebook, FaTwitter, FaLinkedin, FaWhatsapp } from 'react-icons/fa'

const anton = Anton({
    weight: ['400'],
    subsets: ['latin']
})

const builder = imageUrlBuilder(client)

function urlFor(source) {
    return builder.image(source)
}

const portableTextComponents = {
    types: {
        image: ({ value }) => (
            <div className="my-8 rounded-xl overflow-hidden">
                <Image
                    src={urlFor(value).url()}
                    alt={value.alt || 'Blog image'}
                    width={1200}
                    height={600}
                    className="w-full h-auto"
                />
            </div>
        )
    },
    block: {
        h1: ({ children }) => <h1 className={`${anton.className} text-4xl md:text-5xl my-6`}>{children}</h1>,
        h2: ({ children }) => <h2 className={`${anton.className} text-3xl md:text-4xl my-5`}>{children}</h2>,
        h3: ({ children }) => <h3 className={`${anton.className} text-2xl md:text-3xl my-4`}>{children}</h3>,
        normal: ({ children }) => <p className="text-gray-300 leading-relaxed my-4">{children}</p>,
        blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-purple-600 pl-6 my-6 italic text-gray-400">
                {children}
            </blockquote>
        )
    },
    list: {
        bullet: ({ children }) => <ul className="list-disc list-inside my-4 space-y-2 text-gray-300">{children}</ul>,
        number: ({ children }) => <ol className="list-decimal list-inside my-4 space-y-2 text-gray-300">{children}</ol>
    }
}

export default function BlogDetailPage({ params }) {
    const [blog, setBlog] = useState(null)
    const [relatedBlogs, setRelatedBlogs] = useState([])
    const [loading, setLoading] = useState(true)
    const [comment, setComment] = useState({ name: '', email: '', comment: '' })
    const [submittingComment, setSubmittingComment] = useState(false)
    const [slug, setSlug] = useState(null)

    useEffect(() => {
        async function unwrapParams() {
            const resolvedParams = await params
            setSlug(resolvedParams.slug)
        }
        unwrapParams()
    }, [params])

    useEffect(() => {
        if (!slug) return

        async function fetchBlog() {
            try {
                console.log('Fetching blog with slug:', slug)

                const query = `*[_type == "blog" && slug.current == $slug && status == "published"][0] {
                    _id,
                    title,
                    slug,
                    thumbnail,
                    poster,
                    content,
                    excerpt,
                    author,
                    category,
                    publishDate,
                    views,
                    featured,
                    comments,
                    seo
                }`

                const data = await client.fetch(query, { slug })
                console.log('Blog data:', data)

                if (data) {
                    setBlog(data)

                    // Increment views (use writeClient for mutations)
                    try {
                        await writeClient.patch(data._id).inc({ views: 1 }).commit()
                    } catch (error) {
                        console.error('Error incrementing views:', error)
                    }

                    // Fetch related blogs
                    const relatedQuery = `*[_type == "blog" && category == $category && slug.current != $slug && status == "published"] | order(publishDate desc) [0...3] {
                        _id,
                        title,
                        slug,
                        thumbnail,
                        author,
                        publishDate,
                        views
                    }`

                    const related = await client.fetch(relatedQuery, {
                        category: data.category,
                        slug
                    })
                    setRelatedBlogs(related)
                }
                setLoading(false)
            } catch (error) {
                console.error('Error fetching blog:', error)
                setLoading(false)
            }
        }

        fetchBlog()
    }, [slug])

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    const handleCommentSubmit = async (e) => {
        e.preventDefault()
        setSubmittingComment(true)

        try {
            await writeClient
                .patch(blog._id)
                .setIfMissing({ comments: [] })
                .append('comments', [
                    {
                        ...comment,
                        date: new Date().toISOString(),
                        approved: false
                    }
                ])
                .commit()

            toast.success('Comment submitted! It will be visible after approval.')
            setComment({ name: '', email: '', comment: '' })
        } catch (error) {
            console.error('Error submitting comment:', error)
            toast.error('Failed to submit comment. Please try again.')
        } finally {
            setSubmittingComment(false)
        }
    }

    const shareUrl = typeof window !== 'undefined' ? window.location.href : ''

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0A0E1A] flex items-center justify-center">
                <div className="text-white text-2xl">Loading...</div>
            </div>
        )
    }

    if (!blog) {
        return (
            <div className="min-h-screen bg-[#0A0E1A] flex items-center justify-center">
                <div className="text-center">
                    <h1 className={`${anton.className} text-4xl text-white mb-4`}>Blog Not Found</h1>
                    <Link href="/blog">
                        <Button variant="blue">Back to Blog</Button>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#0A0E1A] text-white">
            {/* Hero Section */}
            <div className="relative pt-32 pb-12 px-6 md:px-20">
                <div className="max-w-4xl mx-auto">
                    <Link href="/blog" className="text-purple-400 hover:text-purple-300 mb-6 inline-block">
                        ← Back to Blog
                    </Link>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-sm px-4 py-1 bg-purple-600/20 text-purple-400 rounded-full">
                                {blog.category}
                            </span>
                        </div>

                        <h1
                            className={`${anton.className} text-4xl md:text-6xl uppercase text-transparent bg-clip-text mb-6`}
                            style={{
                                backgroundImage: `radial-gradient(circle at center -20%, rgba(249, 244, 237, 1) 40%, rgba(234,228,255,0.6) 70%)`
                            }}
                        >
                            {blog.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-8">
                            <span className="flex items-center gap-2">
                                <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                                    {blog.author[0].toUpperCase()}
                                </div>
                                {blog.author}
                            </span>
                            <span>•</span>
                            <span>{formatDate(blog.publishDate)}</span>
                            <span>•</span>
                            <span>{blog.views} views</span>
                        </div>

                        {/* Share Buttons */}
                        <div className="flex items-center gap-3 mb-8">
                            <span className="text-sm text-gray-400">Share:</span>
                            <a
                                href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 bg-[#1d2334] rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors"
                            >
                                <FaFacebook />
                            </a>
                            <a
                                href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${blog.title}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 bg-[#1d2334] rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors"
                            >
                                <FaTwitter />
                            </a>
                            <a
                                href={`https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 bg-[#1d2334] rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors"
                            >
                                <FaLinkedin />
                            </a>
                            <a
                                href={`https://wa.me/?text=${blog.title} ${shareUrl}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 bg-[#1d2334] rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors"
                            >
                                <FaWhatsapp />
                            </a>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Featured Image */}
            {blog.poster && (
                <div className="px-6 md:px-20 mb-12">
                    <div className="max-w-4xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="relative h-[300px] md:h-[500px] rounded-3xl overflow-hidden"
                        >
                            <Image
                                src={urlFor(blog.poster).width(1200).url()}
                                alt={blog.title}
                                fill
                                className="object-cover"
                            />
                        </motion.div>
                    </div>
                </div>
            )}

            {/* Content */}
            <div className="px-6 md:px-20 pb-12">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="prose prose-invert prose-lg max-w-none"
                    >
                        <PortableText value={blog.content} components={portableTextComponents} />
                    </motion.div>
                </div>
            </div>

            {/* Comments Section */}
            <div className="px-6 md:px-20 pb-12">
                <div className="max-w-4xl mx-auto">
                    <h2 className={`${anton.className} text-3xl mb-6`}>Comments</h2>

                    {/* Comment Form */}
                    <form onSubmit={handleCommentSubmit} className="bg-gradient-to-b from-[#1d2334] to-[#151A27] rounded-3xl p-8 mb-8">
                        <h3 className={`${anton.className} text-2xl mb-4`}>Leave a Comment</h3>
                        <div className="space-y-4">
                            <div>
                                <input
                                    type="text"
                                    placeholder="Your Name"
                                    value={comment.name}
                                    onChange={(e) => setComment({ ...comment, name: e.target.value })}
                                    required
                                    className="w-full px-4 py-3 bg-[#0A0E1A] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
                                />
                            </div>
                            <div>
                                <input
                                    type="email"
                                    placeholder="Your Email"
                                    value={comment.email}
                                    onChange={(e) => setComment({ ...comment, email: e.target.value })}
                                    required
                                    className="w-full px-4 py-3 bg-[#0A0E1A] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
                                />
                            </div>
                            <div>
                                <textarea
                                    placeholder="Your Comment"
                                    value={comment.comment}
                                    onChange={(e) => setComment({ ...comment, comment: e.target.value })}
                                    required
                                    rows={4}
                                    className="w-full px-4 py-3 bg-[#0A0E1A] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 resize-none"
                                />
                            </div>
                            <Button type="submit" variant="blue" disabled={submittingComment}>
                                {submittingComment ? 'Submitting...' : 'Submit Comment'}
                            </Button>
                        </div>
                    </form>

                    {/* Approved Comments */}
                    <div className="space-y-4">
                        {blog.comments?.filter(c => c.approved).map((c, index) => (
                            <div key={index} className="bg-gradient-to-b from-[#1d2334] to-[#151A27] rounded-3xl p-6">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                                        {c.name[0].toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-semibold">{c.name}</p>
                                        <p className="text-xs text-gray-500">{formatDate(c.date)}</p>
                                    </div>
                                </div>
                                <p className="text-gray-300">{c.comment}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Related Blogs */}
            {relatedBlogs.length > 0 && (
                <div className="px-6 md:px-20 pb-20">
                    <div className="max-w-7xl mx-auto">
                        <h2 className={`${anton.className} text-3xl mb-8`}>Related Articles</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {relatedBlogs.map((relatedBlog) => (
                                <Link key={relatedBlog._id} href={`/blog/${relatedBlog.slug.current}`}>
                                    <div className="bg-gradient-to-b from-[#1d2334] to-[#151A27] rounded-3xl overflow-hidden group cursor-pointer h-full shadow-custom hover:shadow-purple-500/20 transition-all duration-300">
                                        <div className="relative h-[180px] overflow-hidden">
                                            <Image
                                                src={urlFor(relatedBlog.thumbnail).width(400).url()}
                                                alt={relatedBlog.title}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        </div>
                                        <div className="p-4">
                                            <h3 className={`${anton.className} text-xl mb-2 line-clamp-2 group-hover:text-purple-400 transition-colors`}>
                                                {relatedBlog.title}
                                            </h3>
                                            <div className="flex items-center justify-between text-xs text-gray-500">
                                                <span>{relatedBlog.author}</span>
                                                <span>{relatedBlog.views} views</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
