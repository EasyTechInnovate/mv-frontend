'use client'
import { HeadingText } from '@/components/FixedUiComponents'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { registerUser, getUserProfile } from '@/services/api.services'
import { Country, State } from 'country-state-city'
import toast from 'react-hot-toast'
import DistributionAgreementContent from '@/components/legal/DistributionAgreementContent'

const DistributionAgreementPage = () => {
  const router = useRouter()
  const [formData, setFormData] = useState(null)
  const [consent, setConsent] = useState({
    terms: false,
    privacy: false,
    marketing: false
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    // Load form data from sessionStorage
    const savedData = sessionStorage.getItem('signupFormData')
    if (!savedData) {
      // If no data found, redirect back to signup
      router.push('/signup')
      return
    }

    try {
      const parsedData = JSON.parse(savedData)
      setFormData(parsedData)
    } catch (error) {
      console.error('Error parsing form data:', error)
      router.push('/signup')
    }
  }, [router])

  const handleConsentChange = (field) => {
    setConsent(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  const transformFormDataToAPI = () => {
    if (!formData) return null

    // Get country and state names
    const countryData = Country.getCountryByCode(formData.country)
    const stateData = State.getStateByCodeAndCountry(formData.state, formData.country)

    const baseData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      emailAddress: formData.email,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      userType: formData.userType,
      phoneNumber: formData.phoneCode.replace('+', '') + formData.phoneNumber,
      consent: {
        terms: consent.terms,
        privacy: consent.privacy,
        marketing: consent.marketing
      },
      address: {
        street: formData.address,
        city: stateData?.name || '',
        state: stateData?.name || '',
        country: countryData?.name || '',
        pinCode: formData.pincode
      }
    }

    // Add artist or label specific data
    if (formData.userType === 'artist') {
      baseData.artistData = {
        artistName: formData.artistName || '',
        youtubeLink: formData.youtube || '',
        instagramLink: formData.instagram || '',
        facebookLink: formData.facebook || ''
      }
    } else if (formData.userType === 'label') {
      // Convert popularArtistLinks string to array if needed
      const artistLinksArray = formData.popularArtistLinks
        ? formData.popularArtistLinks.split(',').map(link => link.trim()).filter(Boolean)
        : []

      // Safely extract monthly release count
      let monthlyPlans = 5 // default
      if (formData.monthlyReleaseCount) {
        const parts = formData.monthlyReleaseCount.split('-')
        monthlyPlans = parseInt(parts[0]) || 5
      }

      baseData.labelData = {
        labelName: formData.labelName || '',
        youtubeLink: formData.youtube || '',
        websiteLink: formData.website || '',
        popularReleaseLink: formData.popularReleaseLinks || '',
        popularArtistLinks: artistLinksArray,
        totalReleases: parseInt(formData.totalReleases) || 0,
        releaseFrequency: formData.releaseFrequency ? formData.releaseFrequency.toLowerCase() : 'daily',
        monthlyReleasePlans: monthlyPlans,
        aboutLabel: formData.labelInfo || ''
      }
    }

    return baseData
  }

  const handleSubmit = async () => {
    // Validate consent
    if (!consent.terms || !consent.privacy) {
      toast.error('Please accept Terms and Conditions and Privacy Policy (mandatory)')
      return
    }

    setIsSubmitting(true)

    try {
      const apiData = transformFormDataToAPI()

      // Debug: Log the data being sent
      console.log('🔍 Registration Data Being Sent:', JSON.stringify(apiData, null, 2))

      // Register user with loading toast
      const loadingToast = toast.loading('Creating your account...')

      const registerResponse = await registerUser(apiData)

      if (registerResponse.success) {
        // Store tokens in localStorage
        const { accessToken, refreshToken } = registerResponse.data.tokens
        localStorage.setItem('accessToken', accessToken)
        localStorage.setItem('refreshToken', refreshToken)

        // Store email for verify-email page
        sessionStorage.setItem('verifyEmail', apiData.emailAddress)

        // Clear signup form data from sessionStorage
        sessionStorage.removeItem('signupFormData')

        toast.success('Account created! Please verify your email.', { id: loadingToast })

        // Navigate to verify-email page
        setTimeout(() => {
          router.push('/verify-email?email=' + encodeURIComponent(apiData.emailAddress))
        }, 1000)
      }
    } catch (error) {
      console.error('Registration error:', error)
      console.error('Error response:', error.response?.data)
      console.error('Error status:', error.response?.status)

      const errorMessage = error.response?.data?.message ||
                          error.response?.data?.error ||
                          'Registration failed. Please try again.'
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!formData) {
    return (
      <div className="bg-[#151A27] min-h-screen flex items-center justify-center">
        <p className="text-white">Loading...</p>
      </div>
    )
  }

  return (
    <div className="bg-[#151A27] min-h-screen flex flex-col w-full overflow-hidden items-center justify-center py-10 pt-[100px]">
      <HeadingText text="Distribution Agreement" />

      <DistributionAgreementContent />

      <div className="max-w-6xl w-full mx-auto px-4 space-y-8 text-gray-300">
        {/* Consent Checkboxes */}
        <div className="mt-12 p-6 bg-[#1A1F2E] rounded-lg border border-gray-600 space-y-4">
          <h3 className="text-xl font-semibold text-white mb-4">Your Consent</h3>

          {/* Terms and Conditions */}
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="accept-terms"
              checked={consent.terms}
              onChange={() => handleConsentChange('terms')}
              className="mt-1 h-5 w-5 accent-purple-500 cursor-pointer"
            />
            <label htmlFor="accept-terms" className="text-sm text-gray-300 flex-1 cursor-pointer">
              I accept the <a href="/legal/terms-conditions" target="_blank" className="text-white font-bold hover:underline">Terms and Conditions</a> of this Distribution Agreement and understand all the clauses, payment terms, and obligations mentioned above. <span className="text-red-500">*</span>
            </label>
          </div>

          {/* Privacy Policy */}
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="accept-privacy"
              checked={consent.privacy}
              onChange={() => handleConsentChange('privacy')}
              className="mt-1 h-5 w-5 accent-purple-500 cursor-pointer"
            />
            <label htmlFor="accept-privacy" className="text-sm text-gray-300 flex-1 cursor-pointer">
              I accept the <a href="/legal/privacy-policy" target="_blank" className="text-white font-bold hover:underline">Privacy Policy</a> and <a href="/legal/shipping-refund-policy" target="_blank" className="text-white font-bold hover:underline">Shipping & Refund Policy</a> and understand how my data will be collected, used, and protected. <span className="text-red-500">*</span>
            </label>
          </div>

          {/* Marketing Communications */}
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="accept-marketing"
              checked={consent.marketing}
              onChange={() => handleConsentChange('marketing')}
              className="mt-1 h-5 w-5 accent-purple-500 cursor-pointer"
            />
            <label htmlFor="accept-marketing" className="text-sm text-gray-300 flex-1 cursor-pointer">
              I agree to receive <strong className="text-white">Marketing Communications</strong> including newsletters, promotional offers, and updates from Maheshwari Visuals. (Optional)
            </label>
          </div>

          <p className="text-xs text-gray-400 mt-4">
            <span className="text-red-500">*</span> Required fields
          </p>
        </div>

        <div className="flex flex-col md:flex-row justify-center items-center gap-4 pb-10">
          <button
            onClick={() => router.push('/signup')}
            className="w-full md:w-auto px-8 py-3 rounded-lg font-medium border border-gray-500 text-gray-300 hover:bg-gray-800 transition-all duration-300 cursor-pointer"
          >
            Go Back & Edit
          </button>
          <button
            onClick={handleSubmit}
            disabled={!consent.terms || !consent.privacy || isSubmitting}
            className={`w-full md:w-auto px-8 py-3 rounded-lg font-medium transition-all duration-300 ${
              (consent.terms && consent.privacy && !isSubmitting)
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg cursor-pointer'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? 'Creating Account...' : 'Complete Registration'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default DistributionAgreementPage
