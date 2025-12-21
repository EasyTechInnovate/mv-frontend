import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ArrowLeft, Upload, Loader2 } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useMutation } from "@tanstack/react-query"
import { submitMcnRequest } from "../../services/api.services"
import { showToast } from "../../utils/toast"
import { uploadToImageKit } from "../../utils/imagekitUploader"

export default function YouTubeMCNRequest() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    channelName: "",
    youtubeChannelId: "",
    subscribers: "",
    totalViews: "",
    monetization: "",
    strikes: "",
    originalContent: "",
    adsense: "",
    otherMCN: "",
    otherMCNName: "",
    revenueLastMonth: "",
    analyticsScreenshotUrl: "",
    revenueScreenshotUrl: "",
    legalOwner: false,
    agreeTerms: false,
    ownershipTransfer: false,
    contactConsent: false,
  })

  const [dragActive, setDragActive] = useState({ analytics: false, revenue: false })
  const [isUploading, setIsUploading] = useState({ analytics: false, revenue: false })

  const { mutate: submitRequest, isLoading } = useMutation({
    mutationFn: submitMcnRequest,
    onSuccess: () => {
      showToast.success("MCN request submitted successfully!")
      navigate("/app/youtube-mcn")
    },
    onError: (error) => {
      showToast.error(error.response?.data?.message || "Failed to submit request.")
    },
  })

  const parseRevenue = (revenueString) => {
    if (!revenueString) return null
    if (revenueString.includes('+')) {
      return parseInt(revenueString.replace('$', '').replace('+', ''), 10)
    }
    return parseInt(revenueString.split('-')[0].replace('$', ''), 10)
  }

  const getChannelIdFromUrl = (url) => {
    if (!url) return ""
    try {
      const urlObj = new URL(url)
      const pathParts = urlObj.pathname.split('/').filter(Boolean)
      if (pathParts[0] === 'channel' && pathParts[1]) {
        return pathParts[1]
      }
    } catch (e) { /* Not a valid URL, might be an ID */ }
    return url // Assume it's an ID if parsing fails
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckbox = (e) => {
    const { name, checked } = e.target
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleDrag = (e, fileType) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(prev => ({ ...prev, [fileType]: true }))
    } else if (e.type === "dragleave") {
      setDragActive(prev => ({ ...prev, [fileType]: false }))
    }
  }

  const handleFileUpload = async (file, fileType) => {
    if (!file) return
    setIsUploading((prev) => ({ ...prev, [fileType]: true }))
    try {
      const response = await uploadToImageKit(file, "mcn_screenshots")
      setFormData((prev) => ({ ...prev, [`${fileType}ScreenshotUrl`]: response.url }))
    } catch (error) {
      console.error("Upload failed:", error)
    } finally {
      setIsUploading((prev) => ({ ...prev, [fileType]: false }))
    }
  }

  const handleDrop = (e, fileType) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(prev => ({ ...prev, [fileType]: false }))
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0], fileType)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // NOTE: File upload to a storage service to get a URL is not implemented.
    // Using placeholder URLs as per API requirement.
    const payload = {
      youtubeChannelName: formData.channelName,
      youtubeChannelId: getChannelIdFromUrl(formData.youtubeChannelId),
      subscriberCount: Number(formData.subscribers),
      totalViewsCountsIn28Days: Number(formData.totalViews),
      monetizationEligibility: formData.monetization === "Yes",
      isAdSenseEnabled: formData.adsense === "Yes",
      hasCopyrightStrikes: formData.strikes === "Yes",
      isContentOriginal: formData.originalContent === "Yes",
      isPartOfAnotherMCN: formData.otherMCN === "Yes",
      otherMCNDetails: formData.otherMCN === "Yes" ? formData.otherMCNName : null,
      channelRevenueLastMonth: parseRevenue(formData.revenueLastMonth),
      analyticsScreenshotUrl: formData.analyticsScreenshotUrl,
      revenueScreenshotUrl: formData.revenueScreenshotUrl,
      isLegalOwner: formData.legalOwner,
      agreesToTerms: formData.agreeTerms,
      understandsOwnership: formData.ownershipTransfer,
      consentsToContact: formData.contactConsent,
    }

    submitRequest(payload)
  }

  const FileUploadArea = ({ fileType, label, url }) => (
    <div className="space-y-2 p-4 rounded-lg border">
      <label className="flex items-center gap-2 text-sm font-medium text-white">
        <Upload className="w-4 h-4" />
        {label}
      </label>
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive[fileType] 
            ? 'border-purple-400 bg-purple-400/10' 
            : 'border-gray-600 hover:border-gray-500'
        }`}
        onDragEnter={(e) => handleDrag(e, fileType)}
        onDragLeave={(e) => handleDrag(e, fileType)}
        onDragOver={(e) => handleDrag(e, fileType)}
        onDrop={(e) => handleDrop(e, fileType)}
      >
        {isUploading[fileType] ? (
          <div className="flex flex-col items-center justify-center">
            <Loader2 className="w-12 h-12 mx-auto mb-4 text-gray-400 animate-spin" />
            <p className="text-gray-300">Uploading...</p>
          </div>
        ) : url ? (
          <div className="text-center">
            <img src={url} alt="Screenshot preview" className="max-h-24 mx-auto mb-2 rounded" />
            <a href={url} target="_blank" rel="noopener noreferrer" className="text-purple-400 text-xs break-all hover:underline">
              {url.split('/').pop()}
            </a>
          </div>
        ) : (
          <>
            <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-300 mb-2">Drop your screenshot here</p>
            <p className="text-sm text-gray-500 mb-4">Supports JPG, PNG</p>
          </>
        )}
        <input
          type="file"
          accept=".png,.jpg,.jpeg"
          onChange={(e) => handleFileUpload(e.target.files[0], fileType)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isUploading[fileType]}
        />
        <Button
          type="button"
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 mt-4"
          onClick={(e) => e.currentTarget.previousElementSibling.click()}
          disabled={isUploading[fileType]}
        >
          Choose File
        </Button>
      </div>
    </div>
  )

  const allTermsAccepted = formData.legalOwner && formData.agreeTerms && formData.ownershipTransfer && formData.contactConsent

  return (
    <form onSubmit={handleSubmit} className="min-h-screen p-4">
      {/* Back Button */}
      <div className="flex items-center gap-3 mb-6">
        <Button 
          type="button"
          variant="outline" 
          className="mt-2 border-gray-600  hover:bg-gray-800" 
          size="icon" 
          onClick={()=> navigate('/app/youtube-mcn')}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl font-bold">New Request</h1>
      </div>

      {/* Section 1: Basic Information */}
      <Card className="mb-6 ">
        <CardHeader>
          <CardTitle >Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm mb-1 ">YouTube Channel Name</label>
            <input
              type="text"
              name="channelName"
              value={formData.channelName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-600 rounded-md "
            />
          </div>

          <div>
            <label className="block text-sm mb-1 ">YouTube Channel ID or Link</label>
            <input
              type="url"
              name="youtubeChannelId"
              value={formData.youtubeChannelId}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-600 rounded-md "
            />
          </div>

          <div>
            <label className="block text-sm mb-1 ">Subscribers Count</label>
            <input
              type="number"
              name="subscribers"
              value={formData.subscribers}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-600 rounded-md "
            />
          </div>

          <div>
            <label className="block text-sm mb-1 ">Total Views (last 28 days)</label>
            <input
              type="number"
              name="totalViews"
              value={formData.totalViews}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-600 rounded-md "
            />
          </div>

          <div>
            <label className="block text-sm mb-1 ">Monetization Eligibility</label>
            <select
              name="monetization"
              value={formData.monetization}
              onChange={handleChange}
              className="w-full px-3 py-2 border bg-muted border-slate-600 rounded-md "
            >
              <option value="">Select</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1 ">Is AdSense Enabled?</label>
            <select
              name="adsense"
              value={formData.adsense}
              onChange={handleChange}
              className="w-full px-3 py-2 border bg-muted border-slate-600 rounded-md "
            >
              <option value="">Select</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1 ">Have you received any copyright strikes?</label>
            <select
              name="strikes"
              value={formData.strikes}
              onChange={handleChange}
              className="w-full px-3 py-2 border bg-muted border-slate-600 rounded-md "
            >
              <option value="">Select</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1 ">Is your content 100% original/licensed?</label>
            <select
              name="originalContent"
              value={formData.originalContent}
              onChange={handleChange}
              className="w-full px-3 py-2 border bg-muted border-slate-600 rounded-md "
            >
              <option value="">Select</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1 ">Are you part of another MCN currently?</label>
            <select
              name="otherMCN"
              value={formData.otherMCN}
              onChange={handleChange}
              className="w-full px-3 py-2 border bg-muted border-slate-600 rounded-md "
            >
              <option value="">Select</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>

          {formData.otherMCN === "Yes" && (
            <div>
              <label className="block text-sm mb-1 ">MCN Name</label>
              <input
                type="text"
                name="otherMCNName"
                value={formData.otherMCNName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-600 rounded-md "
              />
            </div>
          )}

          <div>
            <label className="block text-sm mb-1 ">Channel Revenue (Last Month)</label>
            <select
              name="revenueLastMonth"
              value={formData.revenueLastMonth}
              onChange={handleChange}
              className="w-full px-3 py-2 border bg-muted border-slate-600 rounded-md "
            >
              <option value="">Select</option>
              <option value="0-100">$0 - $100</option>
              <option value="100-500">$100 - $500</option>
              <option value="500-1000">$500 - $1000</option>
              <option value="1000+">$1000+</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Section 2: Supporting Materials */}
      <Card className="mb-6">
        <CardHeader>
        <CardTitle className="text-xl font-bold  text-white">Supporting Materials</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FileUploadArea
            fileType="analytics"
            label="Upload Channel Analytics Screenshot (Last 90 Days)"
            url={formData.analyticsScreenshotUrl}
          />
          <FileUploadArea
            fileType="revenue"
            label="Upload Channel Revenue Screenshot (Last 90 Days)"
            url={formData.revenueScreenshotUrl}
          />
        </CardContent>
      </Card>

      {/* Section 3: Terms & Declaration */}
      <Card className="mb-6 p-6">
        <h2 className="text-xl font-bold  text-white">Terms & Declaration</h2>
        <CardContent className="p-0 mb-4 ">
          <h3 className=" font-semibold mb-4">Project Suitability</h3>
          <div className="space-y-4">
            <label className="flex items-start gap-3 text-sm text-gray-300 cursor-pointer">
              <input
                type="checkbox"
                name="legalOwner"
                checked={formData.legalOwner}
                onChange={handleCheckbox}
                className="w-4 h-4 mt-0.5 text-purple-600 bg-slate-700 border-slate-600 rounded focus:ring-purple-500"
              />
              <span>I confirm that I am the legal owner of the YouTube channel listed above.</span>
            </label>

            <label className="flex items-start gap-3 text-sm text-gray-300 cursor-pointer">
              <input
                type="checkbox"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleCheckbox}
                className="w-4 h-4 mt-0.5 text-purple-600 bg-slate-700 border-slate-600 rounded focus:ring-purple-500"
              />
              <span>I agree to MV's MCN terms and revenue share model (to be discussed upon approval).</span>
            </label>

            <label className="flex items-start gap-3 text-sm text-gray-300 cursor-pointer">
              <input
                type="checkbox"
                name="ownershipTransfer"
                checked={formData.ownershipTransfer}
                onChange={handleCheckbox}
                className="w-4 h-4 mt-0.5 text-purple-600 bg-slate-700 border-slate-600 rounded focus:ring-purple-500"
              />
              <span>I understand that joining the MCN does not transfer ownership of my content.</span>
            </label>

            <label className="flex items-start gap-3 text-sm text-gray-300 cursor-pointer">
              <input
                type="checkbox"
                name="contactConsent"
                checked={formData.contactConsent}
                onChange={handleCheckbox}
                className="w-4 h-4 mt-0.5 text-purple-600 bg-slate-700 border-slate-600 rounded focus:ring-purple-500"
              />
              <span>I consent to MV contacting me regarding this application.</span>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="mt-8">
        <Button 
          type="submit"
          disabled={!allTermsAccepted || isLoading}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 text-lg font-medium disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Applying...</>
          ) : (
            "Apply"
          )}
        </Button>
      </div>
    </form>
  )
}   