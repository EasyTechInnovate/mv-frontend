'use client'

import React, { useEffect, useState } from 'react'
import { Country, State } from 'country-state-city'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { PHONE_CODES } from '@/lib/constants'

const App = () => {
    const router = useRouter()
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneCode: '+91',
        phoneNumber: '',
        address: '',
        pincode: '',
        state: '',
        country: '',
        password: '',
        confirmPassword: '',
        userType: '', // "Artist" or "Label"
        // Artist-specific fields
        artistName: '',
        // Label-specific fields
        labelName: '',
        popularReleaseLinks: '',
        popularArtistLinks: '',
        totalReleases: '',
        releaseFrequency: 'Daily',
        monthlyReleaseCount: '5-20',
        labelInfo: '',
        // Common fields for both
        youtube: '',
        instagram: '',
        facebook: '',
        website: '',
        acceptTerms: false
    })

    const [countries] = useState(Country.getAllCountries())
    const [states, setStates] = useState([])

    const [isArtist, setIsArtist] = useState(false)
    const [isLabel, setIsLabel] = useState(false)
    const [errors, setErrors] = useState({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    useEffect(() => {
        if (formData.country) {
            // Use the package to get states of the selected country
            const newStates = State.getStatesOfCountry(formData.country)
            setStates(newStates)
            // Reset the state field when the country changes
            setFormData((prev) => ({ ...prev, state: '' }))
        } else {
            setStates([])
            setFormData((prev) => ({ ...prev, state: '' }))
        }
    }, [formData.country])
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target

        if (name === 'userType') {
            setIsArtist(value === 'artist')
            setIsLabel(value === 'label')
        }

        if (type === 'checkbox') {
            setFormData((prev) => ({ ...prev, acceptTerms: checked }))
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }))
        }
    }

    const validateForm = () => {
        const newErrors = {}

        // Basic fields validation
        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required'
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required'
        
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Invalid email address'
        }

        if (!formData.phoneNumber.trim()) {
            newErrors.phoneNumber = 'Phone number is required'
        } else if (formData.phoneNumber.replace(/\D/g, '').length < 10) {
            newErrors.phoneNumber = 'Phone number must be at least 10 digits'
        }

        if (!formData.address.trim()) newErrors.address = 'Address is required'
        if (!formData.pincode.trim()) newErrors.pincode = 'Pincode is required'
        if (!formData.state) newErrors.state = 'State is required'
        if (!formData.country) newErrors.country = 'Country is required'
        
        if (!formData.password) {
            newErrors.password = 'Password is required'
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters'
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Confirm password is required'
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match'
        }
        if (!formData.userType) newErrors.userType = 'Please select user type'

        // Artist-specific validation
        if (isArtist) {
            if (!formData.artistName.trim()) newErrors.artistName = 'Artist name is required'
            if (!formData.youtube.trim()) newErrors.youtube = 'YouTube URL is required'
            if (!formData.instagram.trim()) newErrors.instagram = 'Instagram URL is required'
            if (!formData.facebook.trim()) newErrors.facebook = 'Facebook URL is required'
        }

        // Label-specific validation
        if (isLabel) {
            if (!formData.labelName.trim()) newErrors.labelName = 'Label name is required'
            if (!formData.youtube.trim()) newErrors.youtube = 'YouTube URL is required'
            if (!formData.instagram.trim()) newErrors.instagram = 'Instagram URL is required'
            if (!formData.facebook.trim()) newErrors.facebook = 'Facebook URL is required'
        }

        if (!formData.acceptTerms) {
            newErrors.acceptTerms = 'You must accept the terms and conditions'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        if (!validateForm()) {
            toast.error('Please fill in all required fields correctly')
            return
        }

        setIsSubmitting(true)

        try {
            // Store form data in sessionStorage to pass to distribution-agreement page
            sessionStorage.setItem('signupFormData', JSON.stringify(formData))

            toast.success('Information saved! Proceed to accept agreement.')

            // Navigate to distribution agreement page
            setTimeout(() => {
                router.push('/signup/distribution-agreement')
            }, 800)
        } catch (error) {
            console.error('Error saving form data:', error)
            toast.error('An error occurred. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    const MainHeadingText = ({ text }) => <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">{text}</h1>

    const Button = ({ children, variant, ...props }) => (
        <button
            {...props}
            className={`px-6 py-3 rounded-full text-white font-bold transition-all duration-300 transform hover:scale-105 shadow-lg
        ${variant === 'blue' ? 'bg-gradient-to-r from-[#652CD6] to-[#0466C7]' : ''}
        ${props.className || ''}`}>
            {children}
        </button>
    )

    const renderArtistFields = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 align-top">
            <div>
                <label>
                    Artist Name <span className="text-[#652CD6]">*</span>
                </label>
                <input
                    type="text"
                    name="artistName"
                    value={formData.artistName}
                    onChange={handleChange}
                    className={`w-full bg-transparent border ${errors.artistName ? 'border-red-500' : 'border-gray-500'} rounded-md px-3 py-2 focus:border-purple-500 outline-none`}
                />
                {errors.artistName && <p className="text-red-500 text-xs mt-1">{errors.artistName}</p>}
            </div>
            <div>
                <label>
                    Youtube Channel Url <span className="text-[#652CD6]">*</span>
                </label>
                <input
                    type="text"
                    name="youtube"
                    value={formData.youtube}
                    onChange={handleChange}
                    className="w-full bg-transparent border border-gray-500 rounded-md px-3 py-2"
                />
            </div>
            <div>
                <label>
                    Instagram Url <span className="text-[#652CD6]">*</span>
                </label>
                <input
                    type="text"
                    name="instagram"
                    value={formData.instagram}
                    onChange={handleChange}
                    className="w-full bg-transparent border border-gray-500 rounded-md px-3 py-2"
                />
            </div>
            <div>
                <label>
                    Facebook URL <span className="text-[#652CD6]">*</span>
                </label>
                <input
                    type="text"
                    name="facebook"
                    value={formData.facebook}
                    onChange={handleChange}
                    className="w-full bg-transparent border border-gray-500 rounded-md px-3 py-2"
                />
            </div>
        </div>
    )

    const renderLabelFields = () => (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 align-top">
                <div>
                    <label>
                        Label Name <span className="text-[#652CD6]">*</span>
                    </label>
                    <input
                        type="text"
                        name="labelName"
                        value={formData.labelName}
                        onChange={handleChange}
                        className="w-full bg-transparent border border-gray-500 rounded-md px-3 py-2"
                    />
                </div>
                <div>
                    <label>
                        Youtube Channel Url <span className="text-[#652CD6]">*</span>
                    </label>
                    <input
                        type="text"
                        name="youtube"
                        value={formData.youtube}
                        onChange={handleChange}
                        className="w-full bg-transparent border border-gray-500 rounded-md px-3 py-2"
                    />
                </div>
                <div>
                    <label>
                        Instagram Url <span className="text-[#652CD6]">*</span>
                    </label>
                    <input
                        type="text"
                        name="instagram"
                        value={formData.instagram}
                        onChange={handleChange}
                        className="w-full bg-transparent border border-gray-500 rounded-md px-3 py-2"
                    />
                </div>
                <div>
                    <label>
                        Facebook URL <span className="text-[#652CD6]">*</span>
                    </label>
                    <input
                        type="text"
                        name="facebook"
                        value={formData.facebook}
                        onChange={handleChange}
                        className="w-full bg-transparent border border-gray-500 rounded-md px-3 py-2"
                    />
                </div>
                <div>
                    <label>Website URL</label>
                    <input
                        type="text"
                        name="website"
                        value={formData.website}
                        onChange={handleChange}
                        className="w-full bg-transparent border border-gray-500 rounded-md px-3 py-2"
                    />
                </div>
                <div>
                    <label>Your Popular Release Links</label>
                    <input
                        type="text"
                        name="popularReleaseLinks"
                        value={formData.popularReleaseLinks}
                        onChange={handleChange}
                        className="w-full bg-transparent border border-gray-500 rounded-md px-3 py-2 "
                    />
                </div>
                <div>
                    <label>Your Popular Artist Links</label>
                    <input
                        type="text"
                        name="popularArtistLinks"
                        value={formData.popularArtistLinks}
                        onChange={handleChange}
                        className="w-full bg-transparent border border-gray-500 rounded-md px-3 py-2 "
                    />
                </div>
                <div>
                    <label>Total No. Of releases in Your current Catalog</label>
                    <input
                        type="text"
                        name="totalReleases"
                        value={formData.totalReleases}
                        onChange={handleChange}
                        className="w-full bg-transparent border border-gray-500 rounded-md px-3 py-2"
                    />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label>How often Do You release your music?</label>
                    <select
                        name="releaseFrequency"
                        value={formData.releaseFrequency}
                        onChange={handleChange}
                        className="w-full bg-[#151A27]  text-white border border-gray-500 rounded-md px-3 py-2">
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="quarterly">Quarterly</option>
                        <option value="yearly">Yearly</option>
                    </select>
                </div>
                <div>
                    <label>How many releases do plan to distribute in a month?</label>
                    <select
                        name="monthlyReleaseCount"
                        value={formData.monthlyReleaseCount}
                        onChange={handleChange}
                        className="w-full bg-[#151A27]  text-white border border-gray-500 rounded-md px-3 py-2">
                        <option value="1-5">1-5</option>
                        <option value="5-20">5-20</option>
                        <option value="20+">20+</option>
                    </select>
                </div>
            </div>
            <div>
                <label>Provide some brief info. About your Label</label>
                <textarea
                    name="labelInfo"
                    value={formData.labelInfo}
                    onChange={handleChange}
                    className="w-full bg-transparent border border-gray-500 rounded-md px-3 py-3 h-28"
                />
            </div>
        </>
    )

    return (
        <div className="bg-[#151A27] min-h-screen flex flex-col w-full overflow-hidden items-center justify-center py-10 pt-[100px] ">
            <MainHeadingText text="SIGN UP" />

            <form
                onSubmit={handleSubmit}
                className="bg-[#191E2A] border border-gray-400 rounded-xl p-8 max-sm:px-4 md:p-20 mt-10 w-full max-sm:w-[95%] sm:max-w-6xl text-white space-y-6">
                
                {/* User Type Selector at the Top */}
                <div className="mb-8">
                    <label className="block text-center text-lg font-semibold mb-4 text-gray-200">
                        Which of these best describes you? <span className="text-[#652CD6]">*</span>
                    </label>
                    <div className="flex justify-center">
                        <div className="inline-flex bg-[#0A0E1A] p-1.5 rounded-2xl border border-gray-700/50 shadow-inner">
                            <button
                                type="button"
                                onClick={() => handleChange({ target: { name: 'userType', value: 'artist' }})}
                                className={` max-sm:px-4 px-8 py-3 rounded-xl font-medium transition-all duration-300 ${
                                    isArtist 
                                    ? 'bg-gradient-to-r from-[#652CD6] to-[#0466C7] text-white shadow-lg shadow-blue-500/25' 
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                <span className="flex items-center gap-2">
                                    <span className="text-xl">🎤</span> Artist
                                </span>
                            </button>
                            <button
                                type="button"
                                onClick={() => handleChange({ target: { name: 'userType', value: 'label' }})}
                                className={` max-sm:px-4 px-8 py-3 rounded-xl font-medium transition-all duration-300 ${
                                    isLabel 
                                    ? 'bg-gradient-to-r from-[#652CD6] to-[#0466C7] text-white shadow-lg shadow-blue-500/25' 
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                <span className="flex items-center gap-2">
                                    <span className="text-xl">🎧</span> Label
                                </span>
                            </button>
                        </div>
                    </div>
                    {errors.userType && <p className="text-red-500 text-xs mt-2 text-center">{errors.userType}</p>}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label>
                            First Name <span className="text-[#652CD6]">*</span>
                        </label>
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            className={`w-full bg-transparent border ${errors.firstName ? 'border-red-500' : 'border-gray-500'} rounded-md px-3 py-2 focus:border-purple-500 outline-none`}
                        />
                        {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                    </div>
                    <div>
                        <label>
                            Last Name <span className="text-[#652CD6]">*</span>
                        </label>
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            className={`w-full bg-transparent border ${errors.lastName ? 'border-red-500' : 'border-gray-500'} rounded-md px-3 py-2 focus:border-purple-500 outline-none`}
                        />
                        {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                    </div>
                </div>

                <div>
                    <label>
                        Email ID <span className="text-[#652CD6]">*</span>
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full bg-transparent border ${errors.email ? 'border-red-500' : 'border-gray-500'} rounded-md px-3 py-2 focus:border-purple-500 outline-none`}
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>

                <label>
                    Phone Number <span className="text-[#652CD6]">*</span>
                </label>
                <div className="flex gap-2">
                    <select
                        name="phoneCode"
                        value={formData.phoneCode}
                        onChange={handleChange}
                        className="bg-[#151A27] border border-gray-500 rounded-md px-3 py-2">
                        {PHONE_CODES.map((item) => (
                            <option key={item.code} value={item.code}>
                                {item.code}
                            </option>
                        ))}
                    </select>
                    <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        className={`flex-1 bg-transparent border ${errors.phoneNumber ? 'border-red-500' : 'border-gray-500'} rounded-md px-3 py-2 focus:border-purple-500 outline-none`}
                    />
                </div>
                {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label>
                            Address <span className="text-[#652CD6]">*</span>
                        </label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className={`w-full bg-transparent border ${errors.address ? 'border-red-500' : 'border-gray-500'} rounded-md px-3 py-2 focus:border-purple-500 outline-none`}
                        />
                        {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                    </div>
                    <div>
                        <label>
                            Pincode <span className="text-[#652CD6]">*</span>
                        </label>
                        <input
                            type="text"
                            name="pincode"
                            value={formData.pincode}
                            onChange={handleChange}
                            className={`w-full bg-transparent border ${errors.pincode ? 'border-red-500' : 'border-gray-500'} rounded-md px-3 py-2 focus:border-purple-500 outline-none`}
                        />
                        {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label>
                            Country <span className="text-[#652CD6]">*</span>
                        </label>
                        <select
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            className={`w-full bg-transparent border ${errors.country ? 'border-red-500' : 'border-gray-500'} rounded-md px-3 py-2 focus:border-purple-500 outline-none`}>
                            <option
                                className="bg-[#151A27] text-white"
                                value="">
                                Select Country
                            </option>
                            {countries.map((c) => (
                                <option
                                    className="bg-[#151A27] text-white"
                                    key={c.isoCode}
                                    value={c.isoCode}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                        {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
                    </div>

                    <div>
                        <label>
                            State <span className="text-[#652CD6]">*</span>
                        </label>
                        <select
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                            className={`w-full bg-transparent border ${errors.state ? 'border-red-500' : 'border-gray-500'} rounded-md px-3 py-2 focus:border-purple-500 outline-none`}>
                            <option
                                className="bg-[#151A27] text-white"
                                value="">
                                Select State
                            </option>
                            {states.map((s) => (
                                <option
                                    className="bg-[#151A27] text-white"
                                    key={s.isoCode}
                                    value={s.isoCode}>
                                    {s.name}
                                </option>
                            ))}
                        </select>
                        {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label>
                            Password <span className="text-[#652CD6]">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className={`w-full bg-transparent border ${errors.password ? 'border-red-500' : 'border-gray-500'} rounded-md px-3 py-2 pr-10 focus:border-purple-500 outline-none`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                    </div>
                    <div>
                        <label>
                            Confirm Password <span className="text-[#652CD6]">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className={`w-full bg-transparent border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-500'} rounded-md px-3 py-2 pr-10 focus:border-purple-500 outline-none`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                            >
                                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                        {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                    </div>
                </div>


                {isArtist && renderArtistFields()}
                {isLabel && renderLabelFields()}

                <div className="flex items-center gap-3">
                    <input
                        type="checkbox"
                        name="acceptTerms"
                        checked={formData.acceptTerms}
                        onChange={handleChange}
                        className="h-5 w-5 accent-purple-500"
                    />
                    <label className="text-sm">
                        I accept the <a href="/legal/terms-conditions" target="_blank" className="text-blue-400 hover:underline">Terms & Conditions</a> and <a href="/legal/privacy-policy" target="_blank" className="text-blue-400 hover:underline">Privacy Policy</a>
                    </label>
                </div>
                {errors.acceptTerms && <p className="text-red-500 text-xs">{errors.acceptTerms}</p>}

                <div className="w-full flex justify-center items-center">
                    <Button
                        variant="blue"
                        onClick={handleSubmit}
                        disabled={isSubmitting}>
                        {isSubmitting ? 'Processing...' : 'Next Step'}
                    </Button>
                </div>
            </form>
            
        </div>
    )
}

export default App
