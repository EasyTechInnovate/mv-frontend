'use client'
import { HeadingText } from '@/components/FixedUiComponents'
import React from 'react'
import { 
  FaTruck, FaMoneyBillWave, FaDatabase, FaShareAlt, 
  FaCookieBite, FaLock, FaUserEdit, FaExternalLinkAlt, 
  FaEnvelope, FaPhone, FaShieldAlt 
} from 'react-icons/fa'

const ShippingRefundPolicyPage = () => {
  return (
    <div className="bg-[#151A27] min-h-screen flex flex-col w-full overflow-hidden items-center justify-center py-10 pt-[100px]">
      <HeadingText text="Shipping & Refund Policy" />

      <div className="max-w-6xl w-full mx-auto px-4 mt-8 space-y-8 text-gray-300">
        
        {/* Header Section */}
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-white mb-6">SHIPPING & REFUND POLICY</h2>
          <div className="flex flex-col items-center gap-2 text-sm">
            <p>Effective Date: <span className="text-blue-400">04/12/2023</span></p>
            <p>Last Updated: <span className="text-blue-400">26/06/2025</span></p>
          </div>
          <p className="max-w-3xl mx-auto mt-6">
            Maheshwari Visuals ("we," "us," or "our") is committed to give you the best industry standard Music Distribution services. This Policy explains how we ship/provide our services and process the refunds when you visit our website (<a href="https://maheshwarivisuals.com" className="text-blue-400 hover:underline">maheshwarivisuals.com</a>, <a href="https://dashboard.maheshwarivisuals.com" className="text-blue-400 hover:underline">dashboard.maheshwarivisuals.com</a>) or use our services.
          </p>
        </div>

        {/* Section 1: Information We Collect */}
        <div className="bg-[#1A1F2E] p-6 rounded-lg border-l-4 border-blue-500">
          <div className="flex items-center gap-3 mb-4">
            <FaDatabase className="text-blue-500 text-xl" />
            <h3 className="text-xl font-semibold text-white">1. Information We Collect</h3>
          </div>
          <p className="mb-4">We may collect the following types of information:</p>
          <ul className="space-y-3 ml-4">
            <li className="flex gap-2">
              <span className="text-blue-500 font-bold">•</span>
              <p><strong className="text-white">Personal Information:</strong> Name, email address, phone number, payment details, and identification documents (e.g., Aadhaar, PAN, Passport).</p>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-500 font-bold">•</span>
              <p><strong className="text-white">Usage Data:</strong> IP address, browser type, operating system, and browsing behavior on our website.</p>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-500 font-bold">•</span>
              <p><strong className="text-white">Cookies and Tracking Data:</strong> Information collected through cookies to enhance user experience and analyze website performance.</p>
            </li>
          </ul>
        </div>

        {/* Section 2: How We Use Your Information */}
        <div className="bg-[#1A1F2E] p-6 rounded-lg border-l-4 border-purple-500">
          <div className="flex items-center gap-3 mb-4">
            <FaShieldAlt className="text-purple-500 text-xl" />
            <h3 className="text-xl font-semibold text-white">2. How We Use Your Information</h3>
          </div>
          <p className="mb-4">We use your information to:</p>
          <ul className="space-y-3 ml-4">
            <li className="flex gap-2">
              <span className="text-purple-500 font-bold">•</span>
              <p>Provide and improve our services, including music distribution and royalty management.</p>
            </li>
            <li className="flex gap-2">
              <span className="text-purple-500 font-bold">•</span>
              <p>Process payments and comply with legal obligations (e.g., tax reporting).</p>
            </li>
            <li className="flex gap-2">
              <span className="text-purple-500 font-bold">•</span>
              <p>Communicate with you regarding updates, promotions, and support.</p>
            </li>
            <li className="flex gap-2">
              <span className="text-purple-500 font-bold">•</span>
              <p>Analyze website traffic and user behavior to enhance functionality.</p>
            </li>
          </ul>
        </div>

        {/* Section 3: Sharing Your Information */}
        <div className="bg-[#1A1F2E] p-6 rounded-lg border-l-4 border-green-500">
          <div className="flex items-center gap-3 mb-4">
            <FaShareAlt className="text-green-500 text-xl" />
            <h3 className="text-xl font-semibold text-white">3. Sharing Your Information</h3>
          </div>
          <p className="mb-4">We do not sell your personal information. However, we may share your data with:</p>
          <ul className="space-y-3 ml-4">
            <li className="flex gap-2">
              <span className="text-green-500 font-bold">•</span>
              <p><strong className="text-white">Service Providers:</strong> For payment processing, analytics, and marketing.</p>
            </li>
            <li className="flex gap-2">
              <span className="text-green-500 font-bold">•</span>
              <p><strong className="text-white">Legal Authorities:</strong> When required by law or to protect our rights.</p>
            </li>
            <li className="flex gap-2">
              <span className="text-green-500 font-bold">•</span>
              <p><strong className="text-white">DSPs (Digital Service Providers):</strong> To distribute your music and manage royalties.</p>
            </li>
          </ul>
        </div>

        {/* Section 4: Cookies and Tracking Technologies */}
        <div className="bg-[#1A1F2E] p-6 rounded-lg border-l-4 border-yellow-500">
          <div className="flex items-center gap-3 mb-4">
            <FaCookieBite className="text-yellow-500 text-xl" />
            <h3 className="text-xl font-semibold text-white">4. Cookies and Tracking Technologies</h3>
          </div>
          <p className="mb-4">We use cookies to:</p>
          <ul className="space-y-3 ml-4 mb-4">
            <li className="flex gap-2">
              <span className="text-yellow-500 font-bold">•</span>
              <p>Remember your preferences and login details.</p>
            </li>
            <li className="flex gap-2">
              <span className="text-yellow-500 font-bold">•</span>
              <p>Analyze website traffic and improve user experience.</p>
            </li>
            <li className="flex gap-2">
              <span className="text-yellow-500 font-bold">•</span>
              <p>Deliver personalized ads and promotions.</p>
            </li>
          </ul>
          <p>
            You can manage or disable cookies through your browser settings. For more details, see our <a href="/legal/cookies-policy" className="text-blue-400 hover:underline">Cookie Policy</a>.
          </p>
        </div>

        {/* Section 5: Data Security */}
        <div className="bg-[#1A1F2E] p-6 rounded-lg border-l-4 border-red-500">
          <div className="flex items-center gap-3 mb-4">
            <FaLock className="text-red-500 text-xl" />
            <h3 className="text-xl font-semibold text-white">5. Data Security</h3>
          </div>
          <p>
            We implement industry-standard security measures to protect your data. However, no method of transmission or storage is 100% secure, and we cannot guarantee absolute security.
          </p>
        </div>

        {/* Section 6: Your Rights */}
        <div className="bg-[#1A1F2E] p-6 rounded-lg border-l-4 border-orange-500">
          <div className="flex items-center gap-3 mb-4">
            <FaUserEdit className="text-orange-500 text-xl" />
            <h3 className="text-xl font-semibold text-white">6. Your Rights</h3>
          </div>
          <p className="mb-4">Depending on your location, you may have the following rights:</p>
          <ul className="space-y-3 ml-4">
            <li className="flex gap-2">
              <span className="text-orange-500 font-bold">•</span>
              <p>Access, update, or delete your personal information.</p>
            </li>
            <li className="flex gap-2">
              <span className="text-orange-500 font-bold">•</span>
              <p>Withdraw consent for data processing.</p>
            </li>
            <li className="flex gap-2">
              <span className="text-orange-500 font-bold">•</span>
              <p>File a complaint with a data protection authority.</p>
            </li>
          </ul>
          <p className="mt-4">
            To exercise your rights, contact us at <a href="mailto:contact@maheshwarivisuals.com" className="text-blue-400 hover:underline">contact@maheshwarivisuals.com</a>
          </p>
        </div>

        {/* Section 7: Third-Party Links */}
        <div className="bg-[#1A1F2E] p-6 rounded-lg border-l-4 border-cyan-500">
          <div className="flex items-center gap-3 mb-4">
            <FaExternalLinkAlt className="text-cyan-500 text-xl" />
            <h3 className="text-xl font-semibold text-white">7. Third-Party Links</h3>
          </div>
          <p>
            Our website may contain links to third-party websites. We are not responsible for their privacy practices.
          </p>
        </div>

        {/* Section 8: Changes to This Policy */}
        <div className="bg-[#1A1F2E] p-6 rounded-lg border-l-4 border-indigo-500">
          <div className="flex items-center gap-3 mb-4">
            <FaTruck className="text-indigo-500 text-xl" />
            <h3 className="text-xl font-semibold text-white">8. Changes to This Policy</h3>
          </div>
          <p>
            We may update this Policy periodically. Changes will be posted on this page with a revised effective date.
          </p>
        </div>

        {/* Section 9: Contact Us */}
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

export default ShippingRefundPolicyPage
