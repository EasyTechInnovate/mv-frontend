'use client'
import { Anton } from 'next/font/google'

import React, { useState, useEffect } from 'react'
import RIGHT_IMAGE from '@/public/images/contactus.png'
import QR_IMAGE from '@/public/images/contactusqr.png'
import { MainHeadingText } from '@/components/FixedUiComponents'
import { useCompanyInfo } from '@/contexts/CompanyInfoContext';
import Faq from '@/components/website/Faq'
import LetTheWorld from '@/components/website/LetTheWorld'
const anton = Anton({
    weight: ['400'],
    subsets: ['latin']
})

export default function ContactPage() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        message: ''
    })
    const { contact, isLoading } = useCompanyInfo();
    const [submitting, setSubmitting] = useState(false)

    function handleChange(e) {
        const { name, value } = e.target
        setFormData((s) => ({ ...s, [name]: value }))
    }

    async function handleSubmit(e) {
        e.preventDefault()
        setSubmitting(true)

        // Example placeholder — replace with your actual API call
        try {
            // await fetch('/api/contact', {
            //   method: 'POST',
            //   headers: { 'Content-Type': 'application/json' },
            //   body: JSON.stringify(formData),
            // });
            console.log('submit ->', formData)
            // show a success state / toast here...
        } catch (err) {
            console.error('submit error', err)
            // handle error / show toast
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="bg-[#151A27] text-white min-h-screen w-full overflow-hidden pb-20 relative">
            <div className="w-50 h-50 blur-3xl bg-purple-600/20 rounded-full  absolute top-[200px] left-[100px] z-[9]"></div>
            <div className="w-40 h-40 blur-3xl bg-purple-700/20 rounded-full  absolute top-[600px] left-[100px] z-[9]"></div>
            <div className="w-30 h-30 blur-3xl bg-purple-700/20 rounded-full  absolute top-[200px] right-[100px] z-[9]"></div>

                <MainHeadingText text='Get In Touch' className='pt-[150px]'/>
            <div className="max-w-6xl mx-auto px-6 text-center relative z-[10] ">
                
                <p className="mt-3 text-gray-300 text-lg">Reach out, and let's create a universe of possibilities together!</p>
            </div>

            <section className="max-w-6xl mx-auto px-6 mt-10 relative z-[10]">
                <div className="bg-[#1F2330] rounded-3xl  shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                        <div className="rounded-2xl  p-8 md:p-12 ">
                            <h2 className="text-3xl font-bold leading-tight mb-2">We’d love to hear from you.</h2>
                            <p className=" mb-8 text-sm max-w-xl">Whether you're an artist, label, or music enthusiast—let’s connect.</p>

                            <form
                                onSubmit={handleSubmit}
                                className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        placeholder="Last Name"
                                        className="w-full p-3 rounded-md bg-[#292D3A] border border-gray-400 placeholder-gray-400 focus:outline-none"
                                    />
                                    <input
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        placeholder="First Name"
                                        className="w-full p-3 rounded-md bg-[#292D3A] border border-gray-400 placeholder-gray-400 focus:outline-none"
                                    />
                                </div>

                                <input
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Email"
                                    type="email"
                                    className="w-full p-3 rounded-md bg-[#292D3A] border border-gray-400 placeholder-gray-400 focus:outline-none"
                                />

                                <input
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="Phone Number"
                                    className="w-full p-3 rounded-md bg-[#292D3A] border border-gray-400 placeholder-gray-400 focus:outline-none"
                                />

                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder="Message"
                                    rows={5}
                                    className="w-full p-3 rounded-md bg-[#292D3A] border border-gray-400 placeholder-gray-400 focus:outline-none resize-none"
                                />

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="mt-2 w-full py-3 rounded-md bg-gradient-to-r from-[#8B3DF5] to-[#E241FF] font-semibold text-black">
                                    {submitting ? 'Sending...' : 'Send it to the Us 🚀'}
                                </button>
                            </form>
                        </div>

                        <div className="flex items-center justify-center">
                            <div className="rounded-2xl overflow-hidden  ">
                                <div className="rounded-2xl overflow-hidden ">
                                    <div className="relative w-full h-full md:pr-10">
                                        <img
                                            src={RIGHT_IMAGE.src}
                                            alt="Contact visual"
                                            className="object-cover"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="max-w-7xl mx-auto px-6 mt-12">
                <div className="rounded-3xl border border-gray-400 bg-[#1A1E2B] p-6">
                    <div className="rounded-2xl p-6 bg-transparent">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-6">
                                <div className="rounded-xl p-6 bg-[#1E212E] border border-gray-400 ">
                                    <h3 className="text-2xl font-semibold mb-4"> General Inquiries</h3>
                                    <p className=" text-sm">For questions about our services, or platform:</p>
                                    {contact?.primaryEmail && (
                                        <p className="mt-3 text-sm ">
                                            Email:{' '}
                                            <a
                                                className=""
                                                href={`mailto:${contact.primaryEmail}`}>
                                                {contact.primaryEmail}
                                            </a>
                                        </p>
                                    )}
                                    {contact?.businessEmail && (
                                        <p className="mt-2 text-sm">
                                            Business Email:{' '}
                                            <a
                                                className=""
                                                href={`mailto:${contact.businessEmail}`}>
                                                {contact.businessEmail}
                                            </a>
                                        </p>
                                    )}
                                </div>

                                <div className="rounded-xl p-6 bg-[#1E212E] border border-gray-400 ">
                                    <h3 className="text-2xl font-semibold mb-4">Head Office</h3>
                                    {contact?.physicalAddress && (
                                        <p className=" text-sm leading-relaxed">
                                            Maheshwari Visuals
                                            <br />
                                            {contact.physicalAddress.street}
                                            <br />
                                            {contact.physicalAddress.city}, {contact.physicalAddress.state}, {contact.physicalAddress.zipCode}
                                            <br />
                                            {contact.physicalAddress.country}
                                            <br />
                                            Phone : {contact.primaryPhone}
                                        </p>
                                    )}
                                </div>

                                <div className="rounded-xl p-6 bg-[#1E212E] border border-gray-400 ">
                                    <h3 className="text-2xl font-semibold mb-4">Artist and label Support</h3>
                                    <p className=" text-sm leading-relaxed">
                                        Having trouble with your release, royalties, or dashboard?
                                        <br />
                                        Chat with Mahi, our virtual assistant
                                        <br />
                                        Or connect with a real person within 24 hours
                                    </p>
                                    <div className="mt-6 text-sm space-y-2">
                                        {contact?.primaryPhone && <div>Primary Phone: {contact.primaryPhone}</div>}
                                        {contact?.secondaryPhone && <div>Secondary Phone: {contact.secondaryPhone}</div>}
                                        {contact?.businessHours && <div>Working Hours: {contact.businessHours}</div>}
                                        {contact?.supportEmail && (
                                            <div>
                                                Support Email:{' '}
                                                <a
                                                    className=""
                                                    href={`mailto:${contact.supportEmail}`}>
                                                    {contact.supportEmail}
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="rounded-xl p-6 bg-[#1E212E] border border-gray-400 ">
                                    <h3 className="text-xl font-semibold">© Infringements</h3>
                                     {contact?.supportEmail && (
                                            <div>
                                                Support Email:{' '}
                                                <a
                                                    className=""
                                                    href={`mailto:${contact.supportEmail}`}>
                                                    {contact.supportEmail}
                                                </a>
                                            </div>
                                        )}
                                </div>
                            </div>

                            <div className="space-y-6 flex flex-col">
                                <div className="rounded-xl p-6 bg-[#1E212E] border border-gray-400 ">
                                    <h3 className="text-2xl font-semibold mb-4">Partnerships & Media</h3>
                                    <p className=" text-sm">For collaborations and press:</p>
                                    {contact?.businessEmail && (
                                        <p className="mt-2 text-sm">
                                            Email:{' '}
                                            <a
                                                className=""
                                                href={`mailto:${contact.businessEmail}`}>
                                                {contact.businessEmail}
                                            </a>
                                        </p>
                                    )}
                                    {contact?.primaryEmail && (
                                        <p className="mt-2 text-sm">
                                            For Press & Media :{' '}
                                            <a
                                                className=""
                                                href={`mailto:${contact.primaryEmail}`}>
                                                {contact.primaryEmail}
                                            </a>
                                        </p>
                                    )}
                                    
                                </div>

                                <div className="rounded-xl p-6 bg-[#1E212E] border border-gray-400  flex-1 flex flex-col justify-between">
                                    <div>
                                        <h3 className="text-2xl font-semibold mb-4">Fast and easy connect</h3>
                                        <p className=" text-sm mb-4">Scan the QR and Chat Now</p>
                                    </div>

                                    <div className="mt-4 flex h-full items-center justify-center">
                                        <div className="w-[240px] h-[240px] md:w-[400px] md:h-[400px] ">
                                            {contact?.whatsappQRCode && (
                                                <img
                                                    src={contact.whatsappQRCode}
                                                    alt="WhatsApp QR"
                                                    className="object-contain w-full h-full"
                                                    width={400}
                                                    height={400}
                                                />
                                                
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>{' '}
                    </div>{' '}
                </div>{' '}
            </section>

            <Faq />
            <LetTheWorld/>
        </div>
    )
}
