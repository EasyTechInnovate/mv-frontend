import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Download, ArrowLeft, Music, AlertCircle, CheckCircle, XCircle, Clock } from 'lucide-react'
import GlobalApi from '@/lib/GlobalApi'
import { toast } from 'sonner'

const STATUS_CONFIG = {
    draft: {
        label: 'Draft',
        color: 'bg-gray-500/20 text-gray-600 dark:text-gray-400',
        icon: <Clock className="w-3 h-3" />
    },
    submitted: {
        label: 'Submitted',
        color: 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400',
        icon: <Clock className="w-3 h-3" />
    },
    under_review: {
        label: 'Under Review',
        color: 'bg-blue-500/20 text-blue-600 dark:text-blue-400',
        icon: <AlertCircle className="w-3 h-3" />
    },
    processing: {
        label: 'Processing',
        color: 'bg-purple-500/20 text-purple-600 dark:text-purple-400',
        icon: <Clock className="w-3 h-3" />
    },
    published: {
        label: 'Published',
        color: 'bg-green-500/20 text-green-600 dark:text-green-400',
        icon: <CheckCircle className="w-3 h-3" />
    },
    live: {
        label: 'Live',
        color: 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400',
        icon: <CheckCircle className="w-3 h-3" />
    },
    rejected: {
        label: 'Rejected',
        color: 'bg-red-500/20 text-red-600 dark:text-red-400',
        icon: <XCircle className="w-3 h-3" />
    },
    take_down: {
        label: 'Take Down',
        color: 'bg-red-500/20 text-red-600 dark:text-red-400',
        icon: <XCircle className="w-3 h-3" />
    },
    update_request: {
        label: 'Update Request',
        color: 'bg-orange-500/20 text-orange-600 dark:text-orange-400',
        icon: <AlertCircle className="w-3 h-3" />
    }
}

function SkeletonBox({ className = '' }) {
    return <div className={`animate-pulse rounded-md bg-gray-300/30 dark:bg-gray-700/30 ${className}`} />
}

function StatusBadge({ status }) {
    const config = STATUS_CONFIG[status] || STATUS_CONFIG.draft
    return (
        <Badge className={`flex items-center gap-1.5 ${config.color} border-0`}>
            {config.icon}
            <span>{config.label}</span>
        </Badge>
    )
}

function ActionButtons({ release, onActionComplete, isDark }) {
    const [loading, setLoading] = useState(false)
    const [showRejectDialog, setShowRejectDialog] = useState(false)
    const [rejectionReason, setRejectionReason] = useState('')
    const [acrLoading, setAcrLoading] = useState(false)
    const [acrProgress, setAcrProgress] = useState('')

    const handleAction = async (actionFn, successMessage) => {
        try {
            setLoading(true)
            await actionFn()
            toast.success(successMessage)
            onActionComplete()
        } catch (error) {
            toast.error(error.response?.data?.message || 'Action failed')
        } finally {
            setLoading(false)
        }
    }

    const handleReject = async () => {
        if (!rejectionReason.trim()) {
            toast.error('Please provide a rejection reason')
            return
        }
        await handleAction(() => GlobalApi.rejectRelease(release.releaseId, { reason: rejectionReason }), 'Release rejected successfully')
        setShowRejectDialog(false)
        setRejectionReason('')
    }

    const handleACRCheck = async () => {
        try {
            setAcrLoading(true)
            const tracks = release.step2?.tracks || []

            if (tracks.length === 0) {
                toast.error('No tracks found to check')
                return
            }

            setAcrProgress(`Checking ${tracks.length} track${tracks.length > 1 ? 's' : ''}...`)
            const acrResults = []

            // Check each track
            for (let i = 0; i < tracks.length; i++) {
                const track = tracks[i]
                setAcrProgress(`Checking track ${i + 1}/${tracks.length}: ${track.trackName}...`)

                // Get audio URL from track
                const audioUrl = track.audioFiles?.[0]?.fileUrl || track.trackLink

                if (!audioUrl) {
                    console.warn(`No audio URL for track: ${track.trackName}`)
                    continue
                }

                try {
                    // Call external ACR service
                    const acrResponse = await fetch('https://acr-mv.manishdashsharma.com/recognize', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            imagekit_url: audioUrl
                        })
                    })

                    const acrData = await acrResponse.json()

                    // Parse ACR response and add to results
                    // API returns: { success, message, data: { match_percentage, title, artists, ... } }
                    if (acrData?.success && acrData?.data) {
                        const match = acrData.data
                        acrResults.push({
                            trackId: track._id,
                            trackName: track.trackName,
                            matchPercentage: match.match_percentage || 0,
                            title: match.title,
                            label: match.label,
                            artists: match.artists || [],
                            album: match.album,
                            releaseDate: match.release_date,
                            durationMs: match.duration_ms,
                            matchTime: match.match_time,
                            externalIds: {
                                isrc: match.external_ids?.isrc,
                                upc: match.external_ids?.upc
                            },
                            streamingLinks: {
                                spotify: match.streaming_links?.spotify,
                                deezer: match.streaming_links?.deezer
                            },
                            genres: match.genres || []
                        })
                    }
                } catch (error) {
                    console.error(`ACR check failed for track ${track.trackName}:`, error)
                }
            }

            // Save results to backend
            if (acrResults.length > 0) {
                setAcrProgress('Saving results...')
                await GlobalApi.saveAudioFootprinting(release.releaseId, { footprintingData: acrResults })
                toast.success(`ACR check complete! Found ${acrResults.length} match${acrResults.length > 1 ? 'es' : ''}`)
            } else {
                toast.info('ACR check complete - no matches found')
            }

            onActionComplete()
        } catch (error) {
            console.error('ACR check error:', error)
            toast.error(error.message || 'ACR check failed')
        } finally {
            setAcrLoading(false)
            setAcrProgress('')
        }
    }

    return (
        <>
            <div className="flex flex-wrap gap-2">
                {release.releaseStatus === 'submitted' && (
                    <Button
                        onClick={() => handleAction(() => GlobalApi.approveRelease(release.releaseId, {}), 'Release approved for review')}
                        className="bg-green-600 hover:bg-green-700 text-white"
                        disabled={loading}>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve for Review
                    </Button>
                )}

                {release.releaseStatus === 'under_review' && (
                    <>
                        <Button
                            onClick={() => handleAction(() => GlobalApi.startProcessingRelease(release.releaseId), 'Processing started')}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                            disabled={loading}>
                            <Clock className="w-4 h-4 mr-2" />
                            Start Processing
                        </Button>
                        <Button
                            onClick={() => setShowRejectDialog(true)}
                            variant="destructive"
                            disabled={loading}>
                            <XCircle className="w-4 h-4 mr-2" />
                            Reject
                        </Button>
                    </>
                )}

                {release.releaseStatus === 'processing' && (
                    <>
                        <Button
                            onClick={() => handleAction(() => GlobalApi.publishRelease(release.releaseId), 'Release published successfully')}
                            className="bg-purple-600 hover:bg-purple-700 text-white"
                            disabled={loading}>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Publish Release
                        </Button>
                        <Button
                            onClick={() => setShowRejectDialog(true)}
                            variant="destructive"
                            disabled={loading}>
                            <XCircle className="w-4 h-4 mr-2" />
                            Reject
                        </Button>
                    </>
                )}

                {release.releaseStatus === 'published' && (
                    <Button
                        onClick={() => handleAction(() => GlobalApi.goLiveRelease(release.releaseId), 'Release is now live!')}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                        disabled={loading}>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Go Live
                    </Button>
                )}

                {release.releaseStatus === 'take_down' && (
                    <Button
                        onClick={() => handleAction(() => GlobalApi.processTakedownRequest(release.releaseId), 'Takedown processed')}
                        className="bg-orange-600 hover:bg-orange-700 text-white"
                        disabled={loading}>
                        Process Takedown
                    </Button>
                )}

                {/* ACR Check Button - available before live */}
                {!['live', 'rejected', 'take_down'].includes(release.releaseStatus) && (
                    <Button
                        onClick={handleACRCheck}
                        variant="outline"
                        disabled={acrLoading || loading}
                        className="border-purple-500 text-purple-600 hover:bg-purple-50 dark:border-purple-400 dark:text-purple-400">
                        <AlertCircle className="w-4 h-4 mr-2" />
                        {acrLoading ? acrProgress : 'Check Audio Footprinting'}
                    </Button>
                )}
            </div>

            {/* Reject Dialog */}
            {showRejectDialog && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className={`${isDark ? 'bg-[#151F28] text-gray-200' : 'bg-white text-gray-900'} rounded-lg p-6 max-w-md w-full mx-4`}>
                        <h3 className="text-lg font-semibold mb-4">Reject Release</h3>
                        <Textarea
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            placeholder="Enter rejection reason..."
                            className={`mb-4 ${isDark ? 'bg-[#0f1724] border-gray-700' : 'bg-white border-gray-300'}`}
                            rows={4}
                        />
                        <div className="flex gap-2 justify-end">
                            <Button
                                variant="outline"
                                onClick={() => setShowRejectDialog(false)}>
                                Cancel
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={handleReject}
                                disabled={loading}>
                                Reject Release
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default function ReleaseModal({ theme, defaultData, onBack }) {
    const isDark = theme === 'dark'
    const releaseId = defaultData

    const [loading, setLoading] = useState(true)
    const [release, setRelease] = useState(null)
    const [isAdvanced, setIsAdvanced] = useState(false)

    useEffect(() => {
        fetchReleaseDetails()
    }, [releaseId])

    const fetchReleaseDetails = async () => {
        try {
            setLoading(true)
            const res = await GlobalApi.getReleaseDetails(releaseId)
            const data = res.data?.data

            if (!data) {
                toast.error('Release not found')
                return
            }

            setRelease(data)

            // Detect if advanced release based on releaseType field
            const advancedTypes = ['single', 'album', 'ep', 'mini_album', 'ringtone_release']
            setIsAdvanced(advancedTypes.includes(data.releaseType))
        } catch (error) {
            console.error('Error fetching release details:', error)
            toast.error('Failed to load release details')
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className={`p-6 space-y-6 ${isDark ? 'bg-[#111A22] text-gray-200' : 'bg-gray-50 text-[#151F28]'}`}>
                <SkeletonBox className="h-8 w-48" />
                <SkeletonBox className="h-6 w-64" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <SkeletonBox className="h-64" />
                    <SkeletonBox className="h-64 md:col-span-2" />
                </div>
                <SkeletonBox className="h-96" />
            </div>
        )
    }

    if (!release) {
        return (
            <div className={`p-6 ${isDark ? 'bg-[#111A22] text-gray-200' : 'bg-gray-50 text-[#151F28]'}`}>
                <p>Release not found</p>
                <Button
                    onClick={onBack}
                    className="mt-4">
                    Go Back
                </Button>
            </div>
        )
    }

    const releaseInfo = isAdvanced ? release.step1?.releaseInfo : release.step1?.releaseInfo
    const coverArt = release.step1?.coverArt?.imageUrl
    const tracks = release.step2?.tracks || []

    return (
        <div className={`p-6 space-y-6 ${isDark ? 'bg-[#111A22] text-gray-200' : 'bg-gray-50 text-[#151F28]'}`}>
            {/* Header */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                    <Button
                        onClick={onBack}
                        variant="outline"
                        className={`${isDark ? 'bg-[#151F28] border-gray-700' : 'bg-white border-gray-200'}`}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                    </Button>

                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-2xl font-semibold">{releaseInfo?.releaseName || 'Untitled Release'}</h1>
                            <StatusBadge status={release.releaseStatus} />
                            <Badge
                                variant="outline"
                                className="capitalize">
                                {isAdvanced ? 'Advanced' : 'Basic'} Release
                            </Badge>
                        </div>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            Release ID: {release.releaseId} • {tracks.length} track{tracks.length !== 1 ? 's' : ''}
                        </p>
                    </div>
                </div>

                {/* Action Buttons */}
                <ActionButtons
                    release={release}
                    onActionComplete={fetchReleaseDetails}
                    isDark={isDark}
                />
            </div>

            {/* UPC Provision for Advanced Releases */}
            {isAdvanced && releaseInfo?.needsUPC && (
                <UPCProvisionSection
                    release={release}
                    onUpdate={fetchReleaseDetails}
                    isDark={isDark}
                />
            )}

            {/* ACR Results */}
            {release.audioFootprinting && release.audioFootprinting.length > 0 && (
                <ACRResultsSection
                    results={release.audioFootprinting}
                    isDark={isDark}
                />
            )}

            {/* Admin Review Info */}
            {release.adminReview?.rejectionReason && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <h3 className="font-semibold text-red-800 dark:text-red-400 mb-2">Rejection Reason</h3>
                    <p className="text-sm text-red-700 dark:text-red-300">{release.adminReview.rejectionReason}</p>
                </div>
            )}

            {release.adminReview?.adminNotes && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-800 dark:text-blue-400 mb-2">Admin Notes</h3>
                    <p className="text-sm text-blue-700 dark:text-blue-300">{release.adminReview.adminNotes}</p>
                </div>
            )}

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Cover Art */}
                <div className={`rounded-lg p-4 ${isDark ? 'bg-[#151F28] border border-gray-700' : 'bg-white border border-gray-200'}`}>
                    <h3 className="font-medium mb-3">Cover Art</h3>
                    <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                        {coverArt ? (
                            <img
                                src={coverArt}
                                alt="Cover Art"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <Music className="w-16 h-16" />
                            </div>
                        )}
                    </div>
                    {coverArt && (
                        <a
                            href={coverArt}
                            download
                            className="mt-3 block">
                            <Button
                                variant="outline"
                                className="w-full"
                                size="sm">
                                <Download className="w-4 h-4 mr-2" />
                                Download
                            </Button>
                        </a>
                    )}
                </div>

                {/* Release Information */}
                <div className={`lg:col-span-2 rounded-lg p-6 ${isDark ? 'bg-[#151F28] border border-gray-700' : 'bg-white border border-gray-200'}`}>
                    <h3 className="font-medium mb-4">Release Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <InfoField
                            label="Release Name"
                            value={releaseInfo?.releaseName}
                        />
                        <InfoField
                            label="Genre"
                            value={releaseInfo?.primaryGenre || releaseInfo?.genre}
                        />

                        {isAdvanced ? (
                            <>
                                <InfoField
                                    label="Release Type"
                                    value={release.releaseType?.replace('_', ' ')}
                                    capitalize
                                />
                                <InfoField
                                    label="Release Version"
                                    value={releaseInfo?.releaseVersion}
                                />
                                <InfoField
                                    label="Catalog"
                                    value={releaseInfo?.catalog}
                                />
                                <InfoField
                                    label="Secondary Genre"
                                    value={releaseInfo?.secondaryGenre}
                                />
                                <InfoField
                                    label="Primary Artists"
                                    value={releaseInfo?.primaryArtists?.join(', ')}
                                />
                                <InfoField
                                    label="Featuring Artists"
                                    value={releaseInfo?.featuringArtists?.join(', ')}
                                />
                                <InfoField
                                    label="UPC"
                                    value={releaseInfo?.upcCode || releaseInfo?.adminProvidedUPC}
                                />
                                <InfoField
                                    label="C-Line"
                                    value={releaseInfo?.cLine ? `© ${releaseInfo.cLine.year} ${releaseInfo.cLine.text}` : null}
                                />
                                <InfoField
                                    label="P-Line"
                                    value={releaseInfo?.pLine ? `℗ ${releaseInfo.pLine.year} ${releaseInfo.pLine.text}` : null}
                                />
                                <InfoField
                                    label="Pricing Tier"
                                    value={releaseInfo?.releasePricingTier}
                                    capitalize
                                />
                            </>
                        ) : (
                            <>
                                <InfoField
                                    label="Track Type"
                                    value={release.trackType}
                                    capitalize
                                />
                                <InfoField
                                    label="Label Name"
                                    value={releaseInfo?.labelName}
                                />
                                <InfoField
                                    label="UPC"
                                    value={releaseInfo?.upc}
                                />
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Tracks Section */}
            <div className={`rounded-lg p-6 ${isDark ? 'bg-[#151F28] border border-gray-700' : 'bg-white border border-gray-200'}`}>
                <h3 className="font-medium mb-4 flex items-center gap-2">
                    <Music className="w-5 h-5" />
                    Tracks ({tracks.length})
                </h3>

                {tracks.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No tracks uploaded yet</p>
                ) : (
                    <div className="space-y-4">
                        {tracks.map((track, index) => (
                            <TrackCard
                                key={track._id || index}
                                track={track}
                                index={index}
                                isAdvanced={isAdvanced}
                                isDark={isDark}
                                release={release}
                                onUpdate={fetchReleaseDetails}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Distribution Settings */}
            <div className={`rounded-lg p-6 ${isDark ? 'bg-[#151F28] border border-gray-700' : 'bg-white border border-gray-200'}`}>
                <h3 className="font-medium mb-4">Distribution Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-medium mb-2 block">Release Date</label>
                        <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                            {release.step3?.releaseDate || release.step3?.deliveryDetails?.forFutureRelease
                                ? new Date(release.step3?.releaseDate || release.step3?.deliveryDetails?.forFutureRelease).toLocaleDateString()
                                : 'Not set'}
                        </p>
                    </div>

                    <div>
                        <label className="text-sm font-medium mb-2 block">Territories</label>
                        <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                            {release.step3?.territorialRights?.isWorldwide
                                ? 'Worldwide'
                                : release.step3?.territorialRights?.territories?.length
                                  ? `${release.step3.territorialRights.territories.length} territories`
                                  : 'Not set'}
                        </p>
                    </div>

                    <div className="md:col-span-2">
                        <label className="text-sm font-medium mb-2 block">Distribution Partners</label>
                        <div className="flex flex-wrap gap-2">
                            {(release.step3?.distributionPartners || release.step3?.partnerSelection?.partners || []).map((partner, i) => (
                                <Badge
                                    key={i}
                                    variant="secondary"
                                    className="capitalize">
                                    {partner.replace('_', ' ')}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Timestamps */}
            <div className={`rounded-lg p-6 ${isDark ? 'bg-[#151F28] border border-gray-700' : 'bg-white border border-gray-200'}`}>
                <h3 className="font-medium mb-4">Timeline</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <TimeStamp
                        label="Created"
                        date={release.createdAt}
                    />
                    <TimeStamp
                        label="Submitted"
                        date={release.submittedAt}
                    />
                    <TimeStamp
                        label="Published"
                        date={release.publishedAt}
                    />
                    <TimeStamp
                        label="Live"
                        date={release.liveAt}
                    />
                </div>
            </div>
        </div>
    )
}

function UPCProvisionSection({ release, onUpdate, isDark }) {
    const [upcCode, setUpcCode] = useState('')
    const [loading, setLoading] = useState(false)

    const releaseInfo = release.step1?.releaseInfo

    if (releaseInfo?.adminProvidedUPC) {
        return (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <h3 className="font-semibold text-green-800 dark:text-green-400">UPC Code Provided</h3>
                </div>
                <p className="text-sm text-green-700 dark:text-green-300">
                    UPC: <span className="font-mono font-semibold">{releaseInfo.adminProvidedUPC}</span>
                </p>
            </div>
        )
    }

    const handleProvideUPC = async () => {
        if (!upcCode.trim() || upcCode.length !== 12) {
            toast.error('UPC must be exactly 12 digits')
            return
        }

        try {
            setLoading(true)
            await GlobalApi.provideUPC(release.releaseId, upcCode)
            toast.success('UPC code provided successfully')
            onUpdate()
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to provide UPC')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                <h3 className="font-semibold text-yellow-800 dark:text-yellow-400">UPC Code Required</h3>
            </div>
            <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-3">User has requested admin-provided UPC code</p>
            <div className="flex gap-2">
                <Input
                    value={upcCode}
                    onChange={(e) => setUpcCode(e.target.value.replace(/\D/g, '').slice(0, 12))}
                    placeholder="Enter 12-digit UPC code"
                    maxLength={12}
                    className={`${isDark ? 'bg-[#0f1724] border-gray-700' : 'bg-white border-gray-300'}`}
                />
                <Button
                    onClick={handleProvideUPC}
                    disabled={loading || upcCode.length !== 12}>
                    {loading ? 'Providing...' : 'Provide UPC'}
                </Button>
            </div>
        </div>
    )
}

function ACRResultsSection({ results, isDark }) {
    return (
        <div className={`rounded-lg p-6 ${isDark ? 'bg-[#151F28] border border-gray-700' : 'bg-white border border-gray-200'}`}>
            <h3 className="font-medium mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                ACR Copyright Check Results ({results.length})
            </h3>
            <div className="space-y-3">
                {results.map((result, idx) => {
                    const riskLevel = result.matchPercentage > 80 ? 'high' : result.matchPercentage > 50 ? 'medium' : 'low'

                    const riskConfig = {
                        high: {
                            bg: 'bg-red-50 dark:bg-red-900/20',
                            border: 'border-red-500',
                            text: 'text-red-700 dark:text-red-300',
                            label: 'High Risk'
                        },
                        medium: {
                            bg: 'bg-yellow-50 dark:bg-yellow-900/20',
                            border: 'border-yellow-500',
                            text: 'text-yellow-700 dark:text-yellow-300',
                            label: 'Medium Risk'
                        },
                        low: {
                            bg: 'bg-green-50 dark:bg-green-900/20',
                            border: 'border-green-500',
                            text: 'text-green-700 dark:text-green-300',
                            label: 'Low Risk'
                        }
                    }

                    const config = riskConfig[riskLevel]

                    return (
                        <div
                            key={idx}
                            className={`${config.bg} border-l-4 ${config.border} p-4 rounded`}>
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <h4 className={`font-semibold ${config.text}`}>{result.title || 'Match Found'}</h4>
                                    <p className="text-sm mt-1">Artists: {result.artists?.join(', ') || 'Unknown'}</p>
                                    <p className="text-sm">Label: {result.label || 'Unknown'}</p>
                                    {result.externalIds?.isrc && <p className="text-xs mt-1 font-mono">ISRC: {result.externalIds.isrc}</p>}
                                </div>
                                <div className="text-right">
                                    <div className={`text-2xl font-bold ${config.text}`}>{result.matchPercentage}%</div>
                                    <div className="text-xs font-semibold uppercase">{config.label}</div>
                                </div>
                            </div>
                            {result.streamingLinks?.spotify && (
                                <a
                                    href={result.streamingLinks.spotify}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 dark:text-blue-400 text-sm mt-2 inline-block hover:underline">
                                    Listen on Spotify →
                                </a>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

function InfoField({ label, value, capitalize }) {
    return (
        <div>
            <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">{label}</label>
            <p className={`${capitalize ? 'capitalize' : ''} text-sm font-medium`}>{value || <span className="text-gray-400">-</span>}</p>
        </div>
    )
}

function TimeStamp({ label, date }) {
    return (
        <div>
            <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">{label}</label>
            <p className="text-sm">{date ? new Date(date).toLocaleDateString() : <span className="text-gray-400">-</span>}</p>
        </div>
    )
}

function TrackCard({ track, index, isAdvanced, isDark, release, onUpdate }) {
    const [expanded, setExpanded] = useState(false)
    const [isrcCode, setIsrcCode] = useState('')
    const [loading, setLoading] = useState(false)

    const handleProvideISRC = async () => {
        if (!isrcCode.trim() || isrcCode.length < 12) {
            toast.error('Invalid ISRC format')
            return
        }

        try {
            setLoading(true)
            await GlobalApi.provideISRC(release.releaseId, track._id, isrcCode)
            toast.success('ISRC code provided successfully')
            onUpdate()
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to provide ISRC')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={`border rounded-lg p-4 ${isDark ? 'border-gray-700 bg-[#0f1724]' : 'border-gray-200 bg-gray-50'}`}>
            <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setExpanded(!expanded)}>
                <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded flex items-center justify-center text-sm font-medium ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                        {index + 1}
                    </div>
                    <div>
                        <h4 className="font-medium">{track.trackName}</h4>
                        {isAdvanced && track.primaryArtists && <p className="text-sm text-gray-500">{track.primaryArtists.join(', ')}</p>}
                        {!isAdvanced && track.singerName && <p className="text-sm text-gray-500">{track.singerName}</p>}
                    </div>
                </div>
                <Button
                    variant="ghost"
                    size="sm">
                    {expanded ? 'Hide Details' : 'Show Details'}
                </Button>
            </div>

            {expanded && (
                <div className="mt-4 pt-4 border-t border-gray-300 dark:border-gray-600 grid grid-cols-2 gap-3">
                    {isAdvanced ? (
                        <>
                            <InfoField
                                label="Genre"
                                value={track.primaryGenre}
                            />
                            <InfoField
                                label="Secondary Genre"
                                value={track.secondaryGenre}
                            />
                            <InfoField
                                label="Mix Version"
                                value={track.mixVersion}
                            />
                            <InfoField
                                label="Language"
                                value={track.language}
                            />
                            <InfoField
                                label="Vocal Type"
                                value={track.vocalType}
                            />
                            <InfoField
                                label="Has Human Vocals"
                                value={track.hasHumanVocals ? 'Yes' : 'No'}
                            />
                            <InfoField
                                label="Available for Download"
                                value={track.isAvailableForDownload ? 'Yes' : 'No'}
                            />
                            <InfoField label="ISRC" />
                            <div className="col-span-2">
                                {track.adminProvidedISRC ? (
                                    <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded">
                                        <p className="text-xs text-green-700 dark:text-green-300 mb-1">✓ ISRC Provided</p>
                                        <p className="font-mono font-semibold">{track.adminProvidedISRC}</p>
                                    </div>
                                ) : track.needsISRC ? (
                                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded">
                                        <p className="text-xs text-yellow-700 dark:text-yellow-300 mb-2">⚠️ ISRC Required</p>
                                        <div className="flex gap-2">
                                            <Input
                                                value={isrcCode}
                                                onChange={(e) => setIsrcCode(e.target.value.toUpperCase())}
                                                placeholder="USXXXX1234567"
                                                maxLength={15}
                                                size="sm"
                                                className={`text-sm ${isDark ? 'bg-[#111A22] border-gray-700' : 'bg-white border-gray-300'}`}
                                            />
                                            <Button
                                                size="sm"
                                                onClick={handleProvideISRC}
                                                disabled={loading}>
                                                Provide
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <InfoField
                                        label="ISRC"
                                        value={track.isrcCode || track.adminProvidedISRC}
                                    />
                                )}
                            </div>
                            {track.featuringArtists && track.featuringArtists.length > 0 && (
                                <div className="col-span-2">
                                    <InfoField
                                        label="Featuring Artists"
                                        value={track.featuringArtists.join(', ')}
                                    />
                                </div>
                            )}
                            {track.contributorsToSoundRecording && track.contributorsToSoundRecording.length > 0 && (
                                <div className="col-span-2">
                                    <label className="text-xs text-gray-500 dark:text-gray-400 mb-2 block">Sound Recording Contributors</label>
                                    <div className="flex flex-wrap gap-2">
                                        {track.contributorsToSoundRecording.map((contrib, i) => (
                                            <Badge
                                                key={i}
                                                variant="outline">
                                                {contrib.profession}: {contrib.contributors}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {track.contributorsToMusicalWork && track.contributorsToMusicalWork.length > 0 && (
                                <div className="col-span-2">
                                    <label className="text-xs text-gray-500 dark:text-gray-400 mb-2 block">Musical Work Contributors</label>
                                    <div className="flex flex-wrap gap-2">
                                        {track.contributorsToMusicalWork.map((contrib, i) => (
                                            <Badge
                                                key={i}
                                                variant="outline">
                                                {contrib.profession}: {contrib.contributors}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            <InfoField
                                label="Genre"
                                value={track.genre}
                            />
                            <InfoField
                                label="Singer"
                                value={track.singerName}
                            />
                            <InfoField
                                label="Composer"
                                value={track.composerName}
                            />
                            <InfoField
                                label="Lyricist"
                                value={track.lyricistName}
                            />
                            <InfoField
                                label="Producer"
                                value={track.producerName}
                            />
                            <InfoField
                                label="ISRC"
                                value={track.isrc}
                            />
                        </>
                    )}

                    {track.audioFiles && track.audioFiles.length > 0 && (
                        <div className="col-span-2">
                            <label className="text-xs text-gray-500 dark:text-gray-400 mb-2 block">Audio Files</label>
                            <div className="flex flex-wrap gap-2">
                                {track.audioFiles.map((file, i) => (
                                    <a
                                        key={i}
                                        href={file.fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer">
                                        <Button
                                            variant="outline"
                                            size="sm">
                                            <Download className="w-3 h-3 mr-1" />
                                            {file.format?.toUpperCase() || 'Audio'}
                                        </Button>
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
