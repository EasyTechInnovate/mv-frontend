'use client'
import React, { useState } from 'react'
import { Anton } from 'next/font/google'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

const anton = Anton({
    weight: ['400'],
    subsets: ['latin']
})

export default function NewsletterSubscribe() {
    const [email, setEmail] = useState('')
    const [subscribing, setSubscribing] = useState(false)

    const handleSubmit = (e) => {
        // We don't prevent default here because we want the form to submit natively to the action URL
        setSubscribing(true)
        
        // Prepare the attribs hidden field with JSON data before submission
        e.target.elements['attribs'].value = JSON.stringify({
            subscriberType: 'general' // Default for this simple component
        })
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

                <form 
                    action="https://mail.app.maheshwarivisuals.com/api/subscribe/submit" 
                    method="post" 
                    onSubmit={handleSubmit} 
                    className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto"
                >
                    <input type="hidden" name="token" value="7e4bffae1f4c" />
                    <input type="hidden" name="attribs" value="" />
                    <input
                        type="email"
                        name="email"
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
