'use client'
import { HeadingText } from '@/components/FixedUiComponents'
import React from 'react'
import { FaCookieBite, FaShieldAlt, FaInfoCircle, FaEnvelope, FaPhone } from 'react-icons/fa'

const CookiePolicyPage = () => {
  return (
    <div className="bg-[#151A27] min-h-screen flex flex-col w-full overflow-hidden items-center justify-center py-10 pt-[100px]">
      <HeadingText text="Cookie Policy" />

      <div className="max-w-6xl w-full mx-auto px-4 mt-8 space-y-8 text-gray-300">
        
        {/* Header Section */}
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-white mb-6">COOKIE POLICY</h2>
          <div className="flex flex-col items-center gap-2 text-sm">
            <p>Effective Date: <span className="text-blue-400">04/12/2023</span></p>
            <p>Last Updated: <span className="text-blue-400">26/06/2025</span></p>
          </div>
          <p className="max-w-3xl mx-auto mt-6">
            Maheshwari Visuals ("we," "us," or "our") uses cookies and similar tracking technologies to enhance your experience on our website (<a href="https://maheshwarivisuals.com" className="text-blue-400 hover:underline">maheshwarivisuals.com</a>, <a href="https://dashboard.maheshwarivisuals.com" className="text-blue-400 hover:underline">dashboard.maheshwarivisuals.com</a>) . This policy explains what cookies are, how we use them, and your choices regarding their usage.
          </p>
        </div>

        {/* Section 1: What Are Cookies? */}
        <div className="bg-[#1A1F2E] p-6 rounded-lg border-l-4 border-blue-500">
          <div className="flex items-center gap-3 mb-4">
            <FaCookieBite className="text-blue-500 text-xl" />
            <h3 className="text-xl font-semibold text-white">1. What Are Cookies?</h3>
          </div>
          <p>
            Cookies are small text files stored on your device when you visit a website. They help improve functionality, analyze site performance, and personalize user experience.
          </p>
        </div>

        {/* Section 2: How We Use Cookies */}
        <div className="bg-[#1A1F2E] p-6 rounded-lg border-l-4 border-purple-500">
          <div className="flex items-center gap-3 mb-4">
            <FaShieldAlt className="text-purple-500 text-xl" />
            <h3 className="text-xl font-semibold text-white">2. How We Use Cookies</h3>
          </div>
          <p className="mb-4">We use cookies for the following purposes:</p>
          <ul className="space-y-3 ml-4">
            <li className="flex gap-2">
              <span className="text-purple-500 font-bold">•</span>
              <p><strong className="text-white">Essential Cookies:</strong> Required for website functionality (e.g., login, security).</p>
            </li>
            <li className="flex gap-2">
              <span className="text-purple-500 font-bold">•</span>
              <p><strong className="text-white">Performance Cookies:</strong> Help us analyze traffic and optimize user experience.</p>
            </li>
            <li className="flex gap-2">
              <span className="text-purple-500 font-bold">•</span>
              <p><strong className="text-white">Marketing Cookies:</strong> Used for personalized ads and promotions.</p>
            </li>
            <li className="flex gap-2">
              <span className="text-purple-500 font-bold">•</span>
              <p><strong className="text-white">Third-Party Cookies:</strong> Set by external services like Google Analytics, Facebook Pixel, and Spotify integrations.</p>
            </li>
          </ul>
        </div>

        {/* Section 3: Managing Cookies */}
        <div className="bg-[#1A1F2E] p-6 rounded-lg border-l-4 border-green-500">
          <div className="flex items-center gap-3 mb-4">
            <FaInfoCircle className="text-green-500 text-xl" />
            <h3 className="text-xl font-semibold text-white">3. Managing Cookies</h3>
          </div>
          <p>
            You can control or disable cookies through your browser settings. However, restricting cookies may impact certain website features.
          </p>
        </div>

        {/* Section 4: Third-Party Services */}
        <div className="bg-[#1A1F2E] p-6 rounded-lg border-l-4 border-yellow-500">
          <div className="flex items-center gap-3 mb-4">
            <FaShieldAlt className="text-yellow-500 text-xl" />
            <h3 className="text-xl font-semibold text-white">4. Third-Party Services</h3>
          </div>
          <p>
            Some cookies are placed by third-party providers for analytics and advertising. We encourage users to review their respective privacy policies.
          </p>
        </div>

        {/* Section 5: Updates to This Policy */}
        <div className="bg-[#1A1F2E] p-6 rounded-lg border-l-4 border-orange-500">
          <div className="flex items-center gap-3 mb-4">
            <FaInfoCircle className="text-orange-500 text-xl" />
            <h3 className="text-xl font-semibold text-white">5. Updates to This Policy</h3>
          </div>
          <p>
            We may update this policy periodically. Changes will be posted on this page with a revised effective date.
          </p>
        </div>

        {/* Section 6: Contact Us */}
        <div className="bg-[#1A1F2E] p-8 rounded-lg border border-gray-600">
          <h3 className="text-xl font-semibold text-white mb-6 text-center">Contact Us</h3>
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <div className="flex items-center gap-4 p-4 bg-[#232938] rounded-lg">
              <FaEnvelope className="text-blue-400 text-2xl" />
              <div>
                <p className="text-xs text-gray-400 uppercase font-bold">Email</p>
                <a href="mailto:Contact@maheshwarivisuals.com" className="text-white hover:text-blue-400 transition-colors">
                  Contact@maheshwarivisuals.com
                </a>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-[#232938] rounded-lg">
              <FaPhone className="text-blue-400 text-2xl" />
              <div>
                <p className="text-xs text-gray-400 uppercase font-bold">Call</p>
                <a href="tel:+9105833796906" className="text-white hover:text-blue-400 transition-colors">
                  +91 05833796906
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center text-sm text-gray-500 py-10">
          © 2022-2025 Maheshwari Visuals PVT LTD. All rights reserved.
        </div>
      </div>
    </div>
  )
}

export default CookiePolicyPage
