'use client'
import React, { useState } from 'react'
import { Anton } from 'next/font/google'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { motion } from 'framer-motion'

const anton = Anton({
    weight: ['400'],
    subsets: ['latin']
})

export default function NewsletterSubscribe() {
    const [email, setEmail] = useState('')
    const [subscribing, setSubscribing] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSubscribing(true)

        try {
            const response = await fetch('/api/newsletter/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            })

            const data = await response.json()

            if (response.ok) {
                toast.success('Successfully subscribed to our newsletter!')
                setEmail('')
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
        <div className="bg-gradient-to-b from-[#1d2334] to-[#151A27] rounded-3xl p-8 md:p-12 shadow-custom">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="text-center"
            >
                <h2 className={`${anton.className} text-3xl md:text-4xl mb-4`}>
                    Subscribe to Our Newsletter
                </h2>
                <p className="text-gray-400 mb-6">
                    Get the latest updates, tips, and exclusive content delivered to your inbox.
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="flex-1 px-4 py-3 bg-[#0A0E1A] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                    <Button type="submit" variant="blue" disabled={subscribing}>
                        {subscribing ? 'Subscribing...' : 'Subscribe'}
                    </Button>
                </form>

                <p className="text-xs text-gray-500 mt-4">
                    We respect your privacy. Unsubscribe at any time.
                </p>
            </motion.div>
        </div>
    )
}
