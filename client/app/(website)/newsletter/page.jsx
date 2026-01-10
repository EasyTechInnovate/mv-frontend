'use client'
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Anton } from 'next/font/google'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { FaEnvelope, FaCheckCircle } from 'react-icons/fa'

const anton = Anton({
    weight: ['400'],
    subsets: ['latin']
})

export default function NewsletterPage() {
    const [formData, setFormData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        subscriberType: 'general'
    })
    const [subscribing, setSubscribing] = useState(false)
    const [subscribed, setSubscribed] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSubscribing(true)

        try {
            const response = await fetch('/api/newsletter/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })

            const data = await response.json()

            if (response.ok) {
                toast.success('Successfully subscribed to our newsletter!')
                setSubscribed(true)
                setFormData({
                    email: '',
                    firstName: '',
                    lastName: '',
                    subscriberType: 'general'
                })
            } else {
                toast.error(data.message || 'Failed to subscribe. Please try again.')
            }
        } catch (error) {
            console.error('Error subscribing:', error)
            toast.error('An error occurred. Please try again.')
        } finally {
            setSubscribing(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#0A0E1A] text-white">
            {/* Hero Section */}
            <div className="relative pt-32 pb-20 px-6 md:px-20">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-600/20 rounded-full mb-6">
                            <FaEnvelope className="text-4xl text-purple-400" />
                        </div>

                        <h1
                            className={`${anton.className} text-[60px] md:text-[100px] uppercase text-transparent bg-clip-text mb-6`}
                            style={{
                                backgroundImage: `radial-gradient(circle at center -20%, rgba(249, 244, 237, 1) 40%, rgba(234,228,255,0.6) 70%)`
                            }}
                        >
                            Newsletter
                        </h1>

                        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-12">
                            Stay ahead of the curve with exclusive insights, tips, and updates from the music industry. Join thousands of artists and labels who trust us to keep them informed.
                        </p>
                    </motion.div>

                    {/* Subscription Form */}
                    {!subscribed ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="bg-gradient-to-b from-[#1d2334] to-[#151A27] rounded-3xl p-8 md:p-12 shadow-custom"
                        >
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-2">First Name</label>
                                        <input
                                            type="text"
                                            placeholder="John"
                                            value={formData.firstName}
                                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                            className="w-full px-4 py-3 bg-[#0A0E1A] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-2">Last Name</label>
                                        <input
                                            type="text"
                                            placeholder="Doe"
                                            value={formData.lastName}
                                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                            className="w-full px-4 py-3 bg-[#0A0E1A] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Email Address *</label>
                                    <input
                                        type="email"
                                        placeholder="john@example.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                        className="w-full px-4 py-3 bg-[#0A0E1A] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">I am a...</label>
                                    <select
                                        value={formData.subscriberType}
                                        onChange={(e) => setFormData({ ...formData, subscriberType: e.target.value })}
                                        className="w-full px-4 py-3 bg-[#0A0E1A] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                                    >
                                        <option value="general">General Subscriber</option>
                                        <option value="artist">Artist</option>
                                        <option value="label">Label/Producer</option>
                                    </select>
                                </div>

                                <Button
                                    type="submit"
                                    variant="blue"
                                    disabled={subscribing}
                                    className="w-full py-6 text-lg"
                                >
                                    {subscribing ? 'Subscribing...' : 'Subscribe Now'}
                                </Button>

                                <p className="text-xs text-gray-500 text-center">
                                    By subscribing, you agree to receive our newsletter and promotional emails. You can unsubscribe at any time.
                                </p>
                            </form>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6 }}
                            className="bg-gradient-to-b from-[#1d2334] to-[#151A27] rounded-3xl p-12 shadow-custom text-center"
                        >
                            <div className="inline-flex items-center justify-center w-24 h-24 bg-green-600/20 rounded-full mb-6">
                                <FaCheckCircle className="text-5xl text-green-400" />
                            </div>
                            <h2 className={`${anton.className} text-3xl md:text-4xl mb-4`}>
                                You're All Set!
                            </h2>
                            <p className="text-gray-400 text-lg mb-6">
                                Thank you for subscribing! Check your inbox for a confirmation email.
                            </p>
                            <Button onClick={() => setSubscribed(false)} variant="blue">
                                Subscribe Another Email
                            </Button>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Benefits Section */}
            <div className="px-6 md:px-20 pb-20">
                <div className="max-w-7xl mx-auto">
                    <h2 className={`${anton.className} text-3xl md:text-4xl text-center mb-12`}>
                        What You'll Get
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                title: 'Industry Insights',
                                description: 'Get the latest trends, news, and analysis from the music distribution world.'
                            },
                            {
                                title: 'Expert Tips',
                                description: 'Learn proven strategies to grow your music career and maximize your earnings.'
                            },
                            {
                                title: 'Exclusive Updates',
                                description: 'Be the first to know about new features, platform updates, and special offers.'
                            }
                        ].map((benefit, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="bg-gradient-to-b from-[#1d2334] to-[#151A27] rounded-3xl p-8 shadow-custom text-center"
                            >
                                <h3 className={`${anton.className} text-2xl mb-4`}>{benefit.title}</h3>
                                <p className="text-gray-400">{benefit.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
