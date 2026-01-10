'use client'
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Anton } from 'next/font/google'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { FaEnvelopeOpen, FaSadTear } from 'react-icons/fa'

const anton = Anton({
    weight: ['400'],
    subsets: ['latin']
})

export default function UnsubscribePage() {
    const [email, setEmail] = useState('')
    const [unsubscribing, setUnsubscribing] = useState(false)
    const [unsubscribed, setUnsubscribed] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setUnsubscribing(true)

        try {
            const response = await fetch('/api/newsletter/unsubscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            })

            const data = await response.json()

            if (response.ok) {
                toast.success('Successfully unsubscribed from our newsletter.')
                setUnsubscribed(true)
                setEmail('')
            } else {
                toast.error(data.message || 'Failed to unsubscribe. Please try again.')
            }
        } catch (error) {
            console.error('Error unsubscribing:', error)
            toast.error('An error occurred. Please try again.')
        } finally {
            setUnsubscribing(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#0A0E1A] text-white">
            <div className="relative pt-32 pb-20 px-6 md:px-20">
                <div className="max-w-2xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        {!unsubscribed ? (
                            <>
                                <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-600/20 rounded-full mb-6">
                                    <FaSadTear className="text-4xl text-orange-400" />
                                </div>

                                <h1
                                    className={`${anton.className} text-[50px] md:text-[80px] uppercase text-transparent bg-clip-text mb-6`}
                                    style={{
                                        backgroundImage: `radial-gradient(circle at center -20%, rgba(249, 244, 237, 1) 40%, rgba(234,228,255,0.6) 70%)`
                                    }}
                                >
                                    Unsubscribe
                                </h1>

                                <p className="text-gray-400 text-lg mb-12">
                                    We're sorry to see you go! If you'd like to unsubscribe from our newsletter, please enter your email address below.
                                </p>

                                <div className="bg-gradient-to-b from-[#1d2334] to-[#151A27] rounded-3xl p-8 md:p-12 shadow-custom">
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div>
                                            <label className="block text-sm text-gray-400 mb-2">Email Address</label>
                                            <input
                                                type="email"
                                                placeholder="john@example.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                                className="w-full px-4 py-3 bg-[#0A0E1A] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
                                            />
                                        </div>

                                        <Button
                                            type="submit"
                                            variant="blue"
                                            disabled={unsubscribing}
                                            className="w-full py-6 text-lg"
                                        >
                                            {unsubscribing ? 'Unsubscribing...' : 'Unsubscribe'}
                                        </Button>
                                    </form>
                                </div>
                            </>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.6 }}
                                className="bg-gradient-to-b from-[#1d2334] to-[#151A27] rounded-3xl p-12 shadow-custom"
                            >
                                <div className="inline-flex items-center justify-center w-24 h-24 bg-blue-600/20 rounded-full mb-6">
                                    <FaEnvelopeOpen className="text-5xl text-blue-400" />
                                </div>
                                <h2 className={`${anton.className} text-3xl md:text-4xl mb-4`}>
                                    Unsubscribed Successfully
                                </h2>
                                <p className="text-gray-400 text-lg mb-6">
                                    You've been removed from our mailing list. We hope to see you again soon!
                                </p>
                                <Button
                                    onClick={() => (window.location.href = '/newsletter')}
                                    variant="blue"
                                >
                                    Subscribe Again
                                </Button>
                            </motion.div>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    )
}
