'use client'
import { HeadingText } from '@/components/FixedUiComponents'
import React from 'react'
import { 
  FaInfoCircle, FaBriefcase, FaUserCheck, FaGavel, 
  FaMoneyBillWave, FaExclamationTriangle, FaUserTimes, 
  FaShieldAlt, FaCookieBite, FaHistory, FaEnvelope, FaPhone,
  FaTimesCircle
} from 'react-icons/fa'

const TermsOfServicePage = () => {
  return (
    <div className="bg-[#151A27] min-h-screen flex flex-col w-full overflow-hidden items-center justify-center py-10 pt-[100px]">
      <HeadingText text="Terms & Conditions" />

      <div className="max-w-6xl w-full mx-auto px-4 mt-8 space-y-8 text-gray-300">
        
        {/* Header Section */}
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-white mb-6">TERMS AND CONDITIONS</h2>
          <div className="flex flex-col items-center gap-2 text-sm">
            <p>Effective Date: <span className="text-blue-400">04/12/2023</span></p>
            <p>Last Updated: <span className="text-blue-400">26/06/2025</span></p>
          </div>
          <p className="max-w-3xl mx-auto mt-6">
            Welcome to Maheshwari Visuals! By accessing or using our website (<a href="https://maheshwarivisuals.com" className="text-blue-400 hover:underline">maheshwarivisuals.com</a>, <a href="https://dashboard.maheshwarivisuals.com" className="text-blue-400 hover:underline">dashboard.maheshwarivisuals.com</a>) and services, you agree to comply with the following terms and conditions. Please read them carefully.
          </p>
        </div>

        {/* Section 1: Introduction */}
        <div className="bg-[#1A1F2E] p-6 rounded-lg border-l-4 border-blue-500">
          <div className="flex items-center gap-3 mb-4">
            <FaInfoCircle className="text-blue-500 text-xl" />
            <h3 className="text-xl font-semibold text-white">1. Introduction</h3>
          </div>
          <p>
            Maheshwari Visuals provides music distribution and artist services to creators and labels. These terms govern your use of our website and services. By using our platform, you confirm that you are at least 18 years old or have parental/guardian consent.
          </p>
        </div>

        {/* Section 2: Services Overview */}
        <div className="bg-[#1A1F2E] p-6 rounded-lg border-l-4 border-purple-500">
          <div className="flex items-center gap-3 mb-4">
            <FaBriefcase className="text-purple-500 text-xl" />
            <h3 className="text-xl font-semibold text-white">2. Services Overview</h3>
          </div>
          <p className="mb-4">We offer:</p>
          <ul className="grid md:grid-cols-2 gap-3 ml-4">
            <li className="flex gap-2">
              <span className="text-purple-500 font-bold">•</span>
              <p>Music distribution to digital platforms (DSPs)</p>
            </li>
            <li className="flex gap-2">
              <span className="text-purple-500 font-bold">•</span>
              <p>YouTube CMS</p>
            </li>
            <li className="flex gap-2">
              <span className="text-purple-500 font-bold">•</span>
              <p>Merch Launch via Music Merch Company (musicmerchcompany.com)</p>
            </li>
            <li className="flex gap-2">
              <span className="text-purple-500 font-bold">•</span>
              <p>Royalty reports and payouts</p>
            </li>
            <li className="flex gap-2">
              <span className="text-purple-500 font-bold">•</span>
              <p>Music Marketing, Playlist pitching and promotional tools</p>
            </li>
            <li className="flex gap-2">
              <span className="text-purple-500 font-bold">•</span>
              <p>Callertune integration for Indian artists</p>
            </li>
          </ul>
        </div>

        {/* Section 3: User Obligations */}
        <div className="bg-[#1A1F2E] p-6 rounded-lg border-l-4 border-green-500">
          <div className="flex items-center gap-3 mb-4">
            <FaUserCheck className="text-green-500 text-xl" />
            <h3 className="text-xl font-semibold text-white">3. User Obligations</h3>
          </div>
          <p className="mb-4">As a user, you agree to:</p>
          <ul className="space-y-3 ml-4">
            <li className="flex gap-2">
              <span className="text-green-500 font-bold">•</span>
              <p>Provide accurate and complete information during registration and KYC.</p>
            </li>
            <li className="flex gap-2">
              <span className="text-green-500 font-bold">•</span>
              <p>Ensure that all uploaded content is original and does not infringe on third-party copyrights.</p>
            </li>
            <li className="flex gap-2">
              <span className="text-green-500 font-bold">•</span>
              <p>Comply with all applicable laws and regulations.</p>
            </li>
          </ul>
        </div>

        {/* Section 4: Intellectual Property */}
        <div className="bg-[#1A1F2E] p-6 rounded-lg border-l-4 border-yellow-500">
          <div className="flex items-center gap-3 mb-4">
            <FaGavel className="text-yellow-500 text-xl" />
            <h3 className="text-xl font-semibold text-white">4. Intellectual Property</h3>
          </div>
          <ul className="space-y-3 ml-4">
            <li className="flex gap-2">
              <span className="text-yellow-500 font-bold">•</span>
              <p>You retain ownership of your music and associated copyrights.</p>
            </li>
            <li className="flex gap-2">
              <span className="text-yellow-500 font-bold">•</span>
              <p>By using our services, you grant Maheshwari Visuals an exclusive license to distribute your content to DSPs.</p>
            </li>
          </ul>
        </div>

        {/* Section 5: Payments and Royalties */}
        <div className="bg-[#1A1F2E] p-6 rounded-lg border-l-4 border-pink-500">
          <div className="flex items-center gap-3 mb-4">
            <FaMoneyBillWave className="text-pink-500 text-xl" />
            <h3 className="text-xl font-semibold text-white">5. Payments and Royalties</h3>
          </div>
          <ul className="space-y-3 ml-4">
            <li className="flex gap-2">
              <span className="text-pink-500 font-bold">•</span>
              <p>Royalties are calculated based on DSP reports and paid monthly.</p>
            </li>
            <li className="flex gap-2">
              <span className="text-pink-500 font-bold">•</span>
              <p>Users are responsible for providing accurate bank and tax details.</p>
            </li>
            <li className="flex gap-2">
              <span className="text-pink-500 font-bold">•</span>
              <p>Maheshwari Visuals reserves the right to withhold payments in cases of suspected fraud or policy violations.</p>
            </li>
          </ul>
        </div>

        {/* Section 6: Prohibited Activities */}
        <div className="bg-[#1A1F2E] p-6 rounded-lg border-l-4 border-red-500">
          <div className="flex items-center gap-3 mb-4">
            <FaExclamationTriangle className="text-red-500 text-xl" />
            <h3 className="text-xl font-semibold text-white">6. Prohibited Activities</h3>
          </div>
          <p className="mb-4">You may not:</p>
          <ul className="space-y-3 ml-4">
            <li className="flex gap-2">
              <span className="text-red-500 font-bold">•</span>
              <p>Upload content that violates copyright laws or contains offensive material.</p>
            </li>
            <li className="flex gap-2">
              <span className="text-red-500 font-bold">•</span>
              <p>Engage in artificial streaming or fraudulent activities.</p>
            </li>
            <li className="flex gap-2">
              <span className="text-red-500 font-bold">•</span>
              <p>Attempt to bypass our security measures or disrupt services.</p>
            </li>
          </ul>
        </div>

        {/* Section 7: Termination Policy */}
        <div className="bg-[#1A1F2E] p-6 rounded-lg border-l-4 border-orange-500">
          <div className="flex items-center gap-3 mb-4">
            <FaUserTimes className="text-orange-500 text-xl" />
            <h3 className="text-xl font-semibold text-white">7. Termination Policy</h3>
          </div>
          <p className="mb-4 font-semibold text-white">We follow a 3-Strike Policy:</p>
          <div className="grid md:grid-cols-3 gap-4 mt-4">
            <div className="p-4 bg-[#232938] rounded-lg border border-yellow-600/30">
              <p className="text-yellow-500 font-bold mb-1">1. First Strike:</p>
              <p className="text-sm text-gray-400">Warning issued to the user.</p>
            </div>
            <div className="p-4 bg-[#232938] rounded-lg border border-orange-600/30">
              <p className="text-orange-500 font-bold mb-1">2. Second Strike:</p>
              <p className="text-sm text-gray-400">Penalties imposed (e.g., release holds, royalty freezes).</p>
            </div>
            <div className="p-4 bg-[#232938] rounded-lg border border-red-600/30">
              <p className="text-red-500 font-bold mb-1">3. Third Strike:</p>
              <p className="text-sm text-gray-400">Permanent ban and removal of all content from our platform.</p>
            </div>
          </div>
        </div>

        {/* Section 8: Limitation of Liability */}
        <div className="bg-[#1A1F2E] p-6 rounded-lg border-l-4 border-cyan-500">
          <div className="flex items-center gap-3 mb-4">
            <FaShieldAlt className="text-cyan-500 text-xl" />
            <h3 className="text-xl font-semibold text-white">8. Limitation of Liability</h3>
          </div>
          <p className="mb-4">Maheshwari Visuals is not liable for:</p>
          <ul className="space-y-3 ml-4">
            <li className="flex gap-2">
              <span className="text-cyan-500 font-bold">•</span>
              <p>Loss of revenue due to DSP delays or technical issues.</p>
            </li>
            <li className="flex gap-2">
              <span className="text-cyan-500 font-bold">•</span>
              <p>Unauthorized access to your account caused by user negligence.</p>
            </li>
          </ul>
        </div>

        {/* Section 9: Privacy and Cookies */}
        <div className="bg-[#1A1F2E] p-6 rounded-lg border-l-4 border-indigo-500">
          <div className="flex items-center gap-3 mb-4">
            <FaCookieBite className="text-indigo-500 text-xl" />
            <h3 className="text-xl font-semibold text-white">9. Privacy and Cookies</h3>
          </div>
          <p>
            Our Privacy Policy and Cookie Policy explain how we collect, use, and protect your data. By using our services, you consent to these policies.
          </p>
        </div>

        {/* Section 10: Changes to Terms */}
        <div className="bg-[#1A1F2E] p-6 rounded-lg border-l-4 border-gray-500">
          <div className="flex items-center gap-3 mb-4">
            <FaHistory className="text-gray-500 text-xl" />
            <h3 className="text-xl font-semibold text-white">10. Changes to Terms</h3>
          </div>
          <p>
            We may update these terms periodically. Continued use of our services after updates constitutes acceptance of the revised terms.
          </p>
        </div>

        {/* Section 11: Contact Us */}
        <div className="bg-[#1A1F2E] p-8 rounded-lg border border-gray-600">
          <h3 className="text-xl font-semibold text-white mb-6 text-center">11. Contact Us</h3>
          <p className="text-center text-gray-400 mb-6">For questions or concerns, contact us at:</p>
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <div className="flex items-center gap-4 p-4 bg-[#232938] rounded-lg">
              <FaEnvelope className="text-blue-400 text-2xl" />
              <div>
                <p className="text-xs text-gray-400 uppercase font-bold">Email</p>
                <a href="mailto:contact@maheshwarivisuals.com" className="text-white hover:text-blue-400 transition-colors">
                  contact@maheshwarivisuals.com
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

export default TermsOfServicePage
