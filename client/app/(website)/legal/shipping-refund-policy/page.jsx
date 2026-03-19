'use client'
import { HeadingText } from '@/components/FixedUiComponents'
import React from 'react'
import { 
  FaTruck, FaLock, FaEnvelope, FaPhone, FaShieldAlt 
} from 'react-icons/fa'

const ShippingRefundPolicyPage = () => {
  return (
    <div className="bg-[#151A27] min-h-screen flex flex-col w-full overflow-hidden items-center justify-center py-10 pt-[100px]">
      <HeadingText text="Shipping & Refund Policy" />

      <div className="max-w-6xl w-full mx-auto px-4 mt-8 space-y-8 text-gray-300">
        
        {/* Header Section */}
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-white mb-6 uppercase">Shipping & Refund Policy</h2>
          <div className="flex flex-col items-center gap-2 text-sm">
            <p>Effective Date: <span className="text-blue-400">04/12/2023</span></p>
            <p>Last Updated: <span className="text-blue-400">26/06/2025</span></p>
          </div>
          <p className="max-w-3xl mx-auto mt-6">
            Maheshwari Visuals ("we," "us," or "our") is committed to give you the best industry standard Music Distribution services. This Policy explains how we ship/provide our services and process the refunds when you visit our website (<a href="https://maheshwarivisuals.com" className="text-blue-400 hover:underline">maheshwarivisuals.com</a>, <a href="https://dashboard.maheshwarivisuals.com" className="text-blue-400 hover:underline">dashboard.maheshwarivisuals.com</a>) or use our services.
          </p>
        </div>

        {/* Section 1: No Refund Policy */}
        <div className="bg-[#1A1F2E] p-6 rounded-lg border-l-4 border-blue-500">
          <div className="flex items-center gap-3 mb-4">
            <FaShieldAlt className="text-blue-500 text-xl" />
            <h3 className="text-xl font-semibold text-white">1. No Refund Policy</h3>
          </div>
          <ul className="space-y-3 ml-4">
            <li className="flex gap-2">
              <span className="text-blue-500 font-bold">•</span>
              <p>All transactions processed through Maheshwari Visuals are <strong className="text-white">final and non-refundable</strong>.</p>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-500 font-bold">•</span>
              <p>Once payment has been successfully completed, no cancellations, refunds, credits, or exchanges will be permitted under any circumstances.</p>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-500 font-bold">•</span>
              <p>Clients are advised to carefully review all service details, product specifications, and distribution requirements prior to purchase.</p>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-500 font-bold">•</span>
              <p>By engaging with Maheshwari Visuals, you acknowledge and consent to this strict no-refund policy.</p>
            </li>
          </ul>
        </div>

        {/* Section 2: Shipping & Delivery Policy */}
        <div className="bg-[#1A1F2E] p-6 rounded-lg border-l-4 border-purple-500">
          <div className="flex items-center gap-3 mb-4">
            <FaTruck className="text-purple-500 text-xl" />
            <h3 className="text-xl font-semibold text-white">2. Shipping & Delivery Policy</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                Digital Services:
              </h4>
              <ul className="space-y-2 ml-6">
                <li className="flex gap-2 text-sm italic">
                  <span className="text-purple-500/70">•</span>
                  <p>Music distribution services, licenses, and digital deliverables will be provided electronically via email or through designated online platforms.</p>
                </li>
                <li className="flex gap-2 text-sm italic">
                  <span className="text-purple-500/70">•</span>
                  <p>Delivery timelines may vary depending on processing requirements, platform approvals, and technical factors.</p>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                Physical Products (if applicable):
              </h4>
              <ul className="space-y-2 ml-6">
                <li className="flex gap-2 text-sm italic">
                  <span className="text-purple-500/70">•</span>
                  <p>Any physical items such as promotional materials, merchandise, or hard copies will be shipped using recognized courier or postal services.</p>
                </li>
                <li className="flex gap-2 text-sm italic">
                  <span className="text-purple-500/70">•</span>
                  <p>Customers are responsible for providing accurate and complete shipping information. Maheshwari Visuals shall not be held liable for delays, losses, or misdeliveries caused by incorrect addresses or third-party courier errors.</p>
                </li>
                <li className="flex gap-2 text-sm italic">
                  <span className="text-purple-500/70">•</span>
                  <p>Estimated delivery times will be communicated at the point of sale; however, these are subject to change based on courier availability and destination.</p>
                </li>
                <li className="flex gap-2 text-sm italic">
                  <span className="text-purple-500/70">•</span>
                  <p>For international shipments, all customs duties, taxes, and additional fees are the sole responsibility of the customer.</p>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Section 3: Limitation of Liability */}
        <div className="bg-[#1A1F2E] p-6 rounded-lg border-l-4 border-green-500">
          <div className="flex items-center gap-3 mb-4">
            <FaLock className="text-green-500 text-xl" />
            <h3 className="text-xl font-semibold text-white">3. Limitation of Liability</h3>
          </div>
          <ul className="space-y-3 ml-4">
            <li className="flex gap-2">
              <span className="text-green-500 font-bold">•</span>
              <p>Maheshwari Visuals shall not be liable for delays or failures in delivery arising from circumstances beyond its reasonable control, including but not limited to courier delays, technical issues, or force majeure events.</p>
            </li>
            <li className="flex gap-2">
              <span className="text-green-500 font-bold">•</span>
              <p>Responsibility for verifying the accuracy of order details rests with the customer.</p>
            </li>
          </ul>
        </div>

        {/* Section 4: Contact Us */}
        <div className="bg-[#1A1F2E] p-8 rounded-lg border border-gray-600">
          <h3 className="text-xl font-semibold text-white mb-6 text-center">4. Contact Us</h3>
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
