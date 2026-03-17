  'use client'
import { HeadingText } from '@/components/FixedUiComponents'
import React from 'react'
import { 
  FaFileAlt, FaHandshake, FaUserCheck, FaBullhorn, 
  FaMoneyBillWave, FaTimesCircle, FaGavel, FaEnvelope, FaPhone 
} from 'react-icons/fa'

const ContentPolicyPage = () => {
  return (
    <div className="bg-[#151A27] min-h-screen flex flex-col w-full overflow-hidden items-center justify-center py-10 pt-[100px]">
      <HeadingText text="Content Policy" />

      <div className="max-w-6xl w-full mx-auto px-4 mt-8 space-y-8 text-gray-300">
        
        {/* Header Section */}
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-white mb-6">CONTENT POLICY (EXCLUSIVE DISTRIBUTION)</h2>
          <div className="flex flex-col items-center gap-2 text-sm">
            <p>Effective Date: <span className="text-blue-400">04/12/2023</span></p>
            <p>Last Updated: <span className="text-blue-400">26/06/2025</span></p>
          </div>
          <p className="max-w-3xl mx-auto mt-6">
            Maheshwari Visuals ("we," "us," or "our") is committed to providing artists and labels with a transparent and fair platform for exclusive content distribution. This policy outlines the terms and conditions for content designated as "exclusive" on our platform/website (<a href="https://maheshwarivisuals.com" className="text-blue-400 hover:underline">maheshwarivisuals.com</a>, <a href="https://dashboard.maheshwarivisuals.com" className="text-blue-400 hover:underline">dashboard.maheshwarivisuals.com</a>).
          </p>
        </div>

        {/* Section 1: Definition of Exclusive Content */}
        <div className="bg-[#1A1F2E] p-6 rounded-lg border-l-4 border-blue-500">
          <div className="flex items-center gap-3 mb-4">
            <FaFileAlt className="text-blue-500 text-xl" />
            <h3 className="text-xl font-semibold text-white">1. Definition of Exclusive Content</h3>
          </div>
          <p>
            Exclusive content refers to music, videos, or other creative works that are distributed solely through Maheshwari Visuals for a specified period or indefinitely, as agreed upon by the artist/label/aggregators and Maheshwari Visuals.
          </p>
        </div>

        {/* Section 2: Terms of Exclusivity */}
        <div className="bg-[#1A1F2E] p-6 rounded-lg border-l-4 border-purple-500">
          <div className="flex items-center gap-3 mb-4">
            <FaHandshake className="text-purple-500 text-xl" />
            <h3 className="text-xl font-semibold text-white">2. Terms of Exclusivity</h3>
          </div>
          <ul className="space-y-3 ml-4">
            <li className="flex gap-2">
              <span className="text-purple-500 font-bold">•</span>
              <p><strong className="text-white">Duration:</strong> The exclusivity period will be defined in the distribution agreement (e.g., 6 months, 1 year, or indefinite).</p>
            </li>
            <li className="flex gap-2">
              <span className="text-purple-500 font-bold">•</span>
              <p><strong className="text-white">Territory:</strong> Exclusivity may apply globally or to specific regions, as specified in the agreement.</p>
            </li>
            <li className="flex gap-2">
              <span className="text-purple-500 font-bold">•</span>
              <p><strong className="text-white">Platforms:</strong> Exclusive content will not be distributed to other platforms or services outside of Maheshwari Visuals during the exclusivity period.</p>
            </li>
          </ul>
        </div>

        {/* Section 3: Artist/Label/Aggregators Obligations */}
        <div className="bg-[#1A1F2E] p-6 rounded-lg border-l-4 border-green-500">
          <div className="flex items-center gap-3 mb-4">
            <FaUserCheck className="text-green-500 text-xl" />
            <h3 className="text-xl font-semibold text-white">3. Artist/Label/Aggregators Obligations</h3>
          </div>
          <p className="mb-4">By designating content as exclusive, the artist/label agrees to:</p>
          <ul className="space-y-3 ml-4">
            <li className="flex gap-2">
              <span className="text-green-500 font-bold">•</span>
              <p>Not distribute the same content through any other distributor, platform, or service during the exclusivity period.</p>
            </li>
            <li className="flex gap-2">
              <span className="text-green-500 font-bold">•</span>
              <p>Ensure that the content is original and does not infringe on third-party rights.</p>
            </li>
          </ul>
        </div>

        {/* Section 4: Maheshwari Visuals Obligations */}
        <div className="bg-[#1A1F2E] p-6 rounded-lg border-l-4 border-yellow-500">
          <div className="flex items-center gap-3 mb-4">
            <FaBullhorn className="text-yellow-500 text-xl" />
            <h3 className="text-xl font-semibold text-white">4. Maheshwari Visuals Obligations</h3>
          </div>
          <ul className="space-y-3 ml-4">
            <li className="flex gap-2">
              <span className="text-yellow-500 font-bold">•</span>
              <p>Prioritize the promotion and distribution of exclusive content.</p>
            </li>
            <li className="flex gap-2">
              <span className="text-yellow-500 font-bold">•</span>
              <p>Provide detailed analytics and insights for exclusive releases.</p>
            </li>
          </ul>
        </div>

        {/* Section 5: Revenue and Royalties */}
        <div className="bg-[#1A1F2E] p-6 rounded-lg border-l-4 border-pink-500">
          <div className="flex items-center gap-3 mb-4">
            <FaMoneyBillWave className="text-pink-500 text-xl" />
            <h3 className="text-xl font-semibold text-white">5. Revenue and Royalties</h3>
          </div>
          <ul className="space-y-3 ml-4">
            <li className="flex gap-2">
              <span className="text-pink-500 font-bold">•</span>
              <p>The Royalties will be paid to Artists/labels/Aggregators generated from exclusive content as per their plan/agreement.</p>
            </li>
            <li className="flex gap-2">
              <span className="text-pink-500 font-bold">•</span>
              <p>Maheshwari Visuals will provide Monthly royalty reports and ensure timely payouts.</p>
            </li>
          </ul>
        </div>

        {/* Section 6: Termination of Exclusivity */}
        <div className="bg-[#1A1F2E] p-6 rounded-lg border-l-4 border-orange-500">
          <div className="flex items-center gap-3 mb-4">
            <FaTimesCircle className="text-orange-500 text-xl" />
            <h3 className="text-xl font-semibold text-white">6. Termination of Exclusivity</h3>
          </div>
          <ul className="space-y-3 ml-4">
            <li className="flex gap-2">
              <span className="text-orange-500 font-bold">•</span>
              <p>Artists/labels may request to terminate exclusivity after the agreed period by providing [Insert Notice Period] days' written notice.</p>
            </li>
            <li className="flex gap-2">
              <span className="text-orange-500 font-bold">•</span>
              <p>Early termination may result in penalties, as outlined in the distribution agreement.</p>
            </li>
          </ul>
        </div>

        {/* Section 7: Dispute Resolution */}
        <div className="bg-[#1A1F2E] p-6 rounded-lg border-l-4 border-cyan-500">
          <div className="flex items-center gap-3 mb-4">
            <FaGavel className="text-cyan-500 text-xl" />
            <h3 className="text-xl font-semibold text-white">7. Dispute Resolution</h3>
          </div>
          <p>
            Any disputes regarding exclusive content will be resolved in accordance with the terms outlined in the distribution agreement.
          </p>
        </div>

        {/* Section 8: Contact Us */}
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

export default ContentPolicyPage
