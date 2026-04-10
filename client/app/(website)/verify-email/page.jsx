'use client'

import React, { useState, useEffect, useRef, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import toast from 'react-hot-toast'
import { verifyEmail, resendVerificationEmail } from '@/services/api.services'
import Link from 'next/link'

const VerifyEmailContent = () => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [code, setCode] = useState(['', '', '', '', '', ''])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isResending, setIsResending] = useState(false)
    const [email, setEmail] = useState('')
    const [verified, setVerified] = useState(false)
    const inputRefs = useRef([])
    const [timeLeft, setTimeLeft] = useState(120)

    useEffect(() => {
        const urlEmail = searchParams.get('email') || sessionStorage.getItem('verifyEmail') || ''
        if (urlEmail) setEmail(urlEmail)
        // Auto-focus first input
        setTimeout(() => inputRefs.current[0]?.focus(), 100)
    }, [searchParams])

    useEffect(() => {
        if (timeLeft <= 0) return;
        const intervalId = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);
        return () => clearInterval(intervalId);
    }, [timeLeft]);

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    }

    const handleCodeChange = (index, value) => {
        if (!/^\d*$/.test(value)) return
        const newCode = [...code]
        newCode[index] = value.slice(-1)
        setCode(newCode)
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus()
        }
    }

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus()
        }
    }

    const handlePaste = (e) => {
        e.preventDefault()
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
        if (pasted.length === 6) {
            setCode(pasted.split(''))
            inputRefs.current[5]?.focus()
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const codeStr = code.join('')
        if (codeStr.length !== 6) {
            toast.error('Please enter all 6 digits')
            return
        }
        if (!email) {
            toast.error('Email address is missing. Please go back and sign up again.')
            return
        }

        setIsSubmitting(true)
        try {
            await verifyEmail({ emailAddress: email, code: codeStr })
            setVerified(true)
            toast.success('Email verified successfully!')
            sessionStorage.removeItem('verifyEmail')
            setTimeout(() => router.push('/subscriptions'), 2000)
        } catch (err) {
            const msg = err.response?.data?.message || 'Verification failed. Please try again.'
            toast.error(msg)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleResend = async () => {
        if (!email) {
            toast.error('Please enter your email address to resend.')
            return
        }
        setIsResending(true)
        try {
            await resendVerificationEmail({ emailAddress: email })
            toast.success('Verification email resent! Check your inbox.')
            setTimeLeft(120) // Reset the timer to 2 minutes
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to resend. Please try again.')
        } finally {
            setIsResending(false)
        }
    }

    if (verified) {
        return (
            <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
                <div className="text-center space-y-4">
                    <div className="text-6xl">✅</div>
                    <h1 className="text-2xl font-bold text-white">Email Verified!</h1>
                    <p className="text-gray-400">Redirecting to plans...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="bg-[#111827] rounded-2xl p-4 sm:p-8 border border-gray-800 shadow-xl space-y-6">
                    {/* Header */}
                    <div className="text-center space-y-2">
                        <div className="text-4xl">📧</div>
                        <h1 className="text-2xl font-bold text-white">Verify Your Email</h1>
                        <p className="text-gray-400 text-sm">
                            We sent a 6-digit code to{' '}
                            {email ? <span className="text-purple-400 font-medium">{email}</span> : 'your email address'}.
                            {' '}Enter it below to verify your account.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* 6-digit code inputs */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-3 text-center">
                                Verification Code
                            </label>
                            <div className="flex gap-2 justify-center" onPaste={handlePaste}>
                                {code.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={(el) => (inputRefs.current[index] = el)}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleCodeChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        className="w-12 h-14 text-center text-xl font-bold bg-[#1a2332] border border-gray-700 text-white rounded-lg focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Show email input only if email not in URL/session */}
                        {!email && (
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    className="w-full px-4 py-2.5 bg-[#1a2332] border border-gray-700 text-white rounded-lg focus:outline-none focus:border-purple-500 text-sm"
                                />
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isSubmitting || code.join('').length !== 6}
                            className="w-full py-3 px-6 bg-gradient-to-r from-[#652CD6] to-[#0466C7] text-white font-semibold rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            {isSubmitting ? 'Verifying...' : 'Verify Email'}
                        </button>
                    </form>

                    {/* Resend */}
                    <div className="text-center space-y-2">
                        <p className="text-gray-500 text-sm">Didn't receive the code?</p>
                        <button
                            onClick={handleResend}
                            disabled={isResending || timeLeft > 0}
                            className="text-purple-400 hover:text-purple-300 text-sm font-medium disabled:opacity-50"
                        >
                            {isResending ? 'Resending...' : (timeLeft > 0 ? `Resend code in ${formatTime(timeLeft)}` : 'Resend verification email')}
                        </button>
                    </div>

                    <div className="text-center">
                        <Link href="/signin" className="text-gray-500 hover:text-gray-300 text-xs">
                            Back to Sign In
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

const VerifyEmailPage = () => (
    <Suspense fallback={null}>
        <VerifyEmailContent />
    </Suspense>
)

export default VerifyEmailPage
