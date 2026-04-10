import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Music, Link as LinkIcon, Check, X, ExternalLink, Plus, Smartphone, Monitor } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import toast from 'react-hot-toast'
import { getMyFanLinks, checkFanLinkAvailability, createFanLink, updateFanLink } from '@/services/api.services'
import { Card } from '@/components/ui/card'
import { useAuthStore } from '@/store/authStore'

const PLATFORMS = [
  { id: 'spotify', name: 'Spotify', icon: Music },
  { id: 'apple_music', name: 'Apple Music', icon: Music },
  { id: 'youtube_music', name: 'YouTube Music', icon: Music },
  { id: 'jiosaavn', name: 'JioSaavn', icon: Music },
  { id: 'gaana', name: 'Gaana', icon: Music },
  { id: 'amazon_music', name: 'Amazon Music', icon: Music },
]

export default function FanLinksBuilder() {
  const queryClient = useQueryClient()
  const { user } = useAuthStore()
  
  // Form States
  const [title, setTitle] = useState('Your Track Title')
  const [description, setDescription] = useState('')
  const [customUrl, setCustomUrl] = useState('')
  const [platformLinks, setPlatformLinks] = useState([])
  const [isUrlChecked, setIsUrlChecked] = useState(false)
  const [isUrlAvailable, setIsUrlAvailable] = useState(false)
  const [previewMode, setPreviewMode] = useState('mobile')
  const [customPlatforms, setCustomPlatforms] = useState([])
const [showAddPlatformForm, setShowAddPlatformForm] = useState(false)
const [newPlatformName, setNewPlatformName] = useState('')
const [newPlatformUrl, setNewPlatformUrl] = useState('')
  
  // Fetch existing fan links
  const { data: fanLinksData, isLoading } = useQuery({
    queryKey: ['fanLinks'],
    queryFn: () => getMyFanLinks({ page: 1, limit: 10 })
  })

  const existingLink = fanLinksData?.data?.fanLinks?.[0]
  const hasExistingLink = fanLinksData?.data?.fanLinks?.length > 0

  // Initialize form with existing data
  useEffect(() => {
    if (existingLink) {
      setTitle(existingLink.title || 'Your Track Title')
      setDescription(existingLink.description || '')
      setCustomUrl(existingLink.customUrl || '')
      
      const pLinks = existingLink.platformLinks || []
      setPlatformLinks(pLinks)
      
      const customPlats = []
      pLinks.forEach(link => {
        const isDefault = PLATFORMS.some(p => p.id === link.platform)
        if (!isDefault) {
          const formattedName = link.platform
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')
          customPlats.push({
            id: link.platform,
            name: formattedName,
            isCustom: true
          })
        }
      })
      setCustomPlatforms(customPlats)
      
      setIsUrlChecked(true)
      setIsUrlAvailable(true)
    }
  }, [existingLink])
  // Check URL availability mutation
  const checkUrlMutation = useMutation({
    mutationFn: checkFanLinkAvailability,
    onSuccess: (data) => {
      setIsUrlAvailable(data.data.isAvailable)
      setIsUrlChecked(true)
      if (data.data.isAvailable) {
        toast.success(data.data.message || 'URL is available')
      } else {
        toast.error(data.data.message || 'URL is not available')
      }
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || 'Failed to check URL availability'
      toast.error(errorMessage)
    }
  })

  // Create fan link mutation
  const createMutation = useMutation({
    mutationFn: createFanLink,
    onSuccess: () => {
      queryClient.invalidateQueries(['fanLinks'])
      toast.success('Fan link created successfully')
    },
    onError: (error) => {
      let errorMessage = error.response?.data?.message || 'Failed to create fan link'
      if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        const detailMessages = error.response.data.errors.map(err => err.message)
        if (detailMessages.length > 0) {
          errorMessage = detailMessages.join(" | ")
        }
      }
      toast.error(errorMessage)
    }
  })

  // Update fan link mutation
  const updateMutation = useMutation({
    mutationFn: ({ fanLinkId, data }) => updateFanLink(fanLinkId, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['fanLinks'])
      toast.success('Fan link updated successfully')
    },
    onError: (error) => {
      let errorMessage = error.response?.data?.message || 'Failed to update fan link'
      if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        const detailMessages = error.response.data.errors.map(err => err.message)
        if (detailMessages.length > 0) {
          errorMessage = detailMessages.join(" | ")
        }
      }
      toast.error(errorMessage)
    }
  })

  const handleCustomUrlChange = (value) => {
    // Sanitize URL - only alphanumeric and hyphens
    const sanitized = value.toLowerCase().replace(/[^a-z0-9-]/g, '')
    setCustomUrl(sanitized)
    setIsUrlChecked(false)
    setIsUrlAvailable(false)
  }

  const handleCheckUrl = () => {
    if (!customUrl.trim()) {
      toast.error('Please enter a custom URL')
      return
    }
    checkUrlMutation.mutate(customUrl)
  }

  const handlePlatformToggle = (platformId) => {
    setPlatformLinks(prev => {
      const exists = prev.find(p => p.platform === platformId)
      if (exists) {
        return prev.map(p => 
          p.platform === platformId ? { ...p, isActive: !p.isActive } : p
        )
      } else {
        return [...prev, { platform: platformId, link: '', isActive: true }]
      }
    })
  }

  const handlePlatformLinkChange = (platformId, link) => {
    setPlatformLinks(prev => 
      prev.map(p => p.platform === platformId ? { ...p, link } : p)
    )
  }

  const handleSubmit = () => {
    // Validation
    if (!title.trim()) {
      toast.error('Please enter a title')
      return
    }

    if (!customUrl.trim() || !isUrlChecked || !isUrlAvailable) {
      toast.error('Please check custom URL availability first')
      return
    }

    const activeLinks = platformLinks.filter(p => p.isActive && p.link.trim())
    if (activeLinks.length === 0) {
      toast.error('Please add at least one platform link')
      return
    }

    const payload = {
      title: title.trim(),
      description: description.trim(),
      customUrl: customUrl,
      platformLinks: activeLinks,
      ...(hasExistingLink && { status: existingLink.status })
    }

    if (hasExistingLink) {
      updateMutation.mutate({ fanLinkId: existingLink._id, data: payload })
    } else {
      createMutation.mutate(payload)
    }
  }
const handleAddCustomPlatform = () => {
  if (!newPlatformName.trim()) {
    toast.error('Please enter platform name')
    return
  }
  
  // Generate platform ID from name (lowercase, replace spaces with underscore)
  const platformId = newPlatformName.trim().toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '')
  
  // Check if platform already exists
  const exists = [...PLATFORMS, ...customPlatforms].some(p => 
    (p.id || p.id) === platformId
  )
  
  if (exists) {
    toast.error('Platform with this name already exists')
    return
  }
  
  const newPlatform = {
    id: platformId,  // Use generated ID instead of timestamp
    name: newPlatformName.trim(),
    isCustom: true
  }
  
  setCustomPlatforms(prev => [...prev, newPlatform])
  
  // Add to platform links as active
  const newLink = {
    platform: platformId,  // This will be sent in API
    link: newPlatformUrl.trim(),
    isActive: true
  }
  setPlatformLinks(prev => [...prev, newLink])
  
  // Reset form
  setNewPlatformName('')
  setNewPlatformUrl('')
  setShowAddPlatformForm(false)
  toast.success('Platform added successfully')
}

const handleDeletePlatform = (platformId, isCustom) => {
  if (isCustom) {
    setCustomPlatforms(prev => prev.filter(p => p.id !== platformId))
  }
  setPlatformLinks(prev => prev.filter(p => p.platform !== platformId))
  toast.success('Platform removed')
}

  const activePlatformLinks = platformLinks.filter(p => p.isActive && p.link.trim()).map(link => {
  // Check if it's a default platform
  const defaultPlatform = PLATFORMS.find(p => p.id === link.platform)
  if (defaultPlatform) {
    return { ...link, name: defaultPlatform.name }
  }
  
  // Check if it's a custom platform
  const customPlatform = customPlatforms.find(p => p.id === link.platform)
  if (customPlatform) {
    return { ...link, name: customPlatform.name }
  }
  
  return link
})

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen  text-white">
      {/* Header */}
      <div className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Fan Links Builder</h1>
          <p className="text-sm text-gray-400">Create custom smart link pages for your releases</p>
        </div>
        {hasExistingLink && existingLink.fullUrl && (
          <Button
            onClick={() => window.open(existingLink.fullUrl, '_blank')}
            className="bg-[#711CE9] hover:bg-[#5e17c2] text-white"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            View Live Link
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
        {/* Left Side - Form */}
        <div className="space-y-6">
          {/* Basic Info */}
          <Card className=" rounded-lg p-6 space-y-4">
            <div>
              <Label htmlFor="title">Link Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., My New Single"
                className="bg-[#0a0a0f] border-gray-700 mt-2"
              />
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell your fans about this release"
                className="bg-[#0a0a0f] border-gray-700 mt-2 min-h-[80px]"
              />
            </div>

            <div>
              <Label htmlFor="customUrl">Custom URL *</Label>
              <div className="flex gap-2 mt-2">
                <div className="flex-1 flex items-center bg-[#0a0a0f] border border-gray-700 rounded-md">
                  {/* <span className="px-3 whitespace-nowrap text-gray-500 text-sm">fan-link/</span> */}
                  <Input
                    id="customUrl"
                    value={customUrl}
                    onChange={(e) => handleCustomUrlChange(e.target.value)}
                    placeholder="my-latest-single"
                    className="bg-transparent border-0 focus-visible:ring-0"
                  />
                </div>
              </div>
              <Button
                onClick={handleCheckUrl}
                disabled={!customUrl.trim() || checkUrlMutation.isPending}
                className={`w-full mt-2 ${
                  isUrlChecked && isUrlAvailable 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : isUrlChecked && !isUrlAvailable
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-[#711CE9] hover:bg-[#5e17c2]'
                }`}
              >
                {isUrlChecked && isUrlAvailable ? (
                  <><Check className="w-4 h-4 mr-2" /> URL Available</>
                ) : isUrlChecked && !isUrlAvailable ? (
                  <><X className="w-4 h-4 mr-2" /> URL Not Available</>
                ) : (
                  <>Check Availability</>
                )}
              </Button>
            </div>
          </Card>

          {/* Platform Links */}
          <Card className=" rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Platform Links</h2>
            <div className="space-y-3">
  {/* Add Platform Form */}
  {showAddPlatformForm && (
    <div className="border-2 border-[#711CE9] rounded-lg p-4 space-y-3 bg-purple-500/2">
      <div>
        <Label htmlFor="platformName" className="text-sm">Platform Name *</Label>
        <Input
          id="platformName"
          value={newPlatformName}
          onChange={(e) => setNewPlatformName(e.target.value)}
          placeholder="e.g., SoundCloud, Bandcamp"
          className="bg-[#0a0a0f] border-gray-700 mt-1"
        />
      </div>
      <div>
        <Label htmlFor="platformUrl" className="text-sm">Platform URL (Optional)</Label>
        <Input
          id="platformUrl"
          value={newPlatformUrl}
          onChange={(e) => setNewPlatformUrl(e.target.value)}
          placeholder="https://..."
          className="bg-[#0a0a0f] border-gray-700 mt-1"
        />
      </div>
      <div className="flex gap-2">
        <Button
          onClick={handleAddCustomPlatform}
          className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
        >
          Add Platform
        </Button>
        <Button
          onClick={() => {
            setShowAddPlatformForm(false)
            setNewPlatformName('')
            setNewPlatformUrl('')
          }}
          variant="ghost"
          className="flex-1"
        >
          Cancel
        </Button>
      </div>
    </div>
  )}

  {/* Default Platforms */}
  {PLATFORMS.map((platform) => {
    const linkData = platformLinks.find(p => p.platform === platform.id)
    const isActive = linkData?.isActive || false

    return (
      <div key={platform.id} className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Switch
              checked={isActive}
              onCheckedChange={() => handlePlatformToggle(platform.id)}
            />
            <platform.icon className="w-5 h-5" />
            <span>{platform.name}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeletePlatform(platform.id, false)}
            className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        {isActive && (
          <Input
            value={linkData?.link || ''}
            onChange={(e) => handlePlatformLinkChange(platform.id, e.target.value)}
            placeholder="Paste platform URL"
            className="bg-[#0a0a0f] border-gray-700"
          />
        )}
      </div>
    )
  })}

  {/* Custom Platforms */}
  {customPlatforms.map((platform) => {
    const linkData = platformLinks.find(p => p.platform === platform.id)
    const isActive = linkData?.isActive || false

    return (
      <div key={platform.id} className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Switch
              checked={isActive}
              onCheckedChange={() => handlePlatformToggle(platform.id)}
            />
            <Music className="w-5 h-5 text-purple-500" />
            <span className="text-purple-400">{platform.name}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeletePlatform(platform.id, true)}
            className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        {isActive && (
          <Input
            value={linkData?.link || ''}
            onChange={(e) => handlePlatformLinkChange(platform.id, e.target.value)}
            placeholder="Paste platform URL"
            className="bg-[#0a0a0f] border-gray-700"
          />
        )}
      </div>
    )
  })}

  {/* Add More Button */}
  {!showAddPlatformForm && (
    <button
      onClick={() => setShowAddPlatformForm(true)}
      className="w-full py-3 border-2 border-dashed border-gray-700 rounded-lg text-purple-500 hover:border-purple-500 hover:bg-purple-500/10 transition-colors flex items-center justify-center gap-2"
    >
      <Plus className="w-5 h-5" />
      Add More Links
    </button>
  )}
</div>
          </Card>
        </div>

        {/* Right Side - Preview */}
        <div className="space-y-4">
          <Card className=" rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <LinkIcon className="w-5 h-5" />
                Live Preview
              </h2>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={previewMode === 'mobile' ? 'default' : 'ghost'}
                  onClick={() => setPreviewMode('mobile')}
                  className={previewMode === 'mobile' ? 'bg-[#711CE9] hover:bg-[#5e17c2] text-white' : ''}
                >
                  <Smartphone className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant={previewMode === 'desktop' ? 'default' : 'ghost'}
                  onClick={() => setPreviewMode('desktop')}
                  className={previewMode === 'desktop' ? 'bg-[#711CE9] hover:bg-[#5e17c2] text-white' : ''}
                >
                  <Monitor className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Preview Container */}
            <div className="flex justify-center">
              <div
                className={`bg-gradient-to-b from-[#2d1b4e] to-[#0a0a0f] rounded-2xl p-6 transition-all ${
                  previewMode === 'mobile' ? 'w-[320px]' : 'w-full max-w-[600px]'
                }`}
              >
                {/* User Image / Music Icon */}
                <div className="flex justify-center mb-6">
                  {user?.profile?.photo ? (
                    <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-purple-500/30 shadow-xl shadow-purple-500/10">
                      <img 
                        src={user.profile.photo} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-purple-600/20 flex items-center justify-center">
                      <Music className="w-12 h-12 text-purple-500" />
                    </div>
                  )}
                </div>

                {/* Title & Description */}
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold mb-2">{title}</h3>
                  {description && (
                    <p className="text-sm text-gray-400">{description}</p>
                  )}
                </div>

                {/* Platform Buttons */}
                <div className="space-y-3">
                  {activePlatformLinks.length > 0 ? (
                    activePlatformLinks.map((link) => {
                      const platform = PLATFORMS.find(p => p.id === link.platform)
                      return (
                        <button
                          key={link.platform}
                          className="w-full bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg py-3 px-4 flex items-center justify-between group transition-all"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded bg-purple-600/20 flex items-center justify-center">
                              <Music className="w-4 h-4 text-white" />
                            </div>
                            <span className="font-medium">{link.name}</span>
                          </div>
                          <div className="text-xs text-white/40 group-hover:text-white/60 transition-colors">
                            Play
                          </div>
                        </button>
                      )
                    })
                  ) : (
                    <div className="text-center text-gray-500 py-8">
                      Add platform links to see preview
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={createMutation.isPending || updateMutation.isPending}
            className="w-full bg-[#711CE9] hover:bg-[#5e17c2] text-white h-12 text-lg"
          >
            {hasExistingLink ? 'Update Fan Link' : 'Create Fan Link'}
          </Button>
        </div>
      </div>
    </div>
  )
}