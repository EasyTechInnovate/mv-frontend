import React, { useState, useEffect } from 'react'
import { Search, Music, Play, BarChart3, Eye, Download, MoreHorizontal, ChevronLeft, ChevronRight, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from '@/components/ui/label'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { 
    getBasicReleases, 
    getAdvancedReleases, 
    getBasicReleaseDetails, 
    getAdvancedReleaseDetails,
    requestUpdate,
    requestTakeDown,
    requestAdvancedUpdate,
    requestAdvancedTakeDown
} from '../../services/api.services'
import { showToast } from '../../utils/toast'
import ExportCsvDialog from '../../components/common/ExportCsvDialog'

// Release Status Enum
export const EReleaseStatus = Object.freeze({
    DRAFT: 'draft',
    SUBMITTED: 'submitted',
    UNDER_REVIEW: 'under_review',
    PROCESSING: 'processing',
    PUBLISHED: 'published',
    LIVE: 'live',
    REJECTED: 'rejected',
    TAKE_DOWN: 'take_down',
    UPDATE_REQUEST: 'update_request',
    TAKEN_DOWN: 'taken_down'
});

const StatusBadge = ({ status }) => {
    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case EReleaseStatus.PUBLISHED:
            case EReleaseStatus.LIVE:
                return 'bg-green-500/10 text-green-500 border-green-500/20'
            case EReleaseStatus.SUBMITTED:
            case EReleaseStatus.UNDER_REVIEW:
                return 'bg-blue-500/10 text-blue-500 border-blue-500/20'
            case EReleaseStatus.PROCESSING:
                return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
            case EReleaseStatus.DRAFT:
                return 'bg-gray-500/10 text-gray-400 border-gray-500/20'
            case EReleaseStatus.REJECTED:
                return 'bg-red-500/10 text-red-500 border-red-500/20'
            case EReleaseStatus.TAKE_DOWN:
            case EReleaseStatus.TAKEN_DOWN:
            case 'down': // Fallback for backend 'down' if logic differs
                return 'bg-red-500/10 text-red-500 border-red-500/20'
            case EReleaseStatus.UPDATE_REQUEST:
                return 'bg-purple-500/10 text-purple-500 border-purple-500/20'
            default:
                return 'bg-gray-500/10 text-gray-400 border-gray-500/20'
        }
    }

    const formatStatus = (status) => {
        if (status === 'submitted') return 'Pending'
        return status?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Unknown'
    }

    return <Badge className={`${getStatusColor(status)} border`}>{formatStatus(status)}</Badge>
}

const ReleaseDetailsModal = ({ release, isOpen, onClose, releaseType }) => {
    const [releaseDetails, setReleaseDetails] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (isOpen && release?.releaseId) {
            fetchReleaseDetails()
        }
    }, [isOpen, release?.releaseId])

    const fetchReleaseDetails = async () => {
        setIsLoading(true)
        try {
            const response = releaseType === 'basic'
                ? await getBasicReleaseDetails(release.releaseId)
                : await getAdvancedReleaseDetails(release.releaseId)
            setReleaseDetails(response.data)
        } catch (error) {
            showToast.error('Failed to load release details')
        } finally {
            setIsLoading(false)
        }
    }

    if (!release) return null
    
    const renderContributors = (title, contributors) => (
        <div>
            <Label>{title}</Label>
            <Card className="p-2 mt-1 border border-muted bg-muted/20">
                {contributors.map((c, i) => (
                    <div key={i} className="text-sm bg-background px-2 py-1 rounded mb-1">
                        <span className="font-semibold capitalize">{c.profession.replace(/_/g, ' ')}:</span> {c.contributors}
                    </div>
                ))}
            </Card>
        </div>
    );

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-lg:min-w-[90vw] min-w-[80vw] max-w-7xl max-h-[90vh] overflow-y-auto custom-scroll">
                <DialogHeader className="flex flex-row items-center justify-between">
                    <DialogTitle>Release Details</DialogTitle>
                </DialogHeader>

                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                ) : releaseDetails ? (
                    <div className="space-y-6">
                        {/* Track Information Section */}
                        <div className="space-y-6">
                            <div className="md:flex gap-4 max-md:space-y-6">
                                <Card className="p-6">
                                    <CardHeader className="p-0 mb-4">
                                        <CardTitle>Cover Art</CardTitle>
                                    </CardHeader>
                                    <div className="border-2 border-dashed border-muted-foreground rounded-lg flex flex-col p-6 gap-2 items-center justify-center">
                                        {releaseDetails.step1?.coverArt?.imageUrl ? (
                                            <img
                                                src={releaseDetails.step1.coverArt.imageUrl}
                                                alt="Cover Art"
                                                className="w-full max-w-[300px] h-auto rounded-lg"
                                            />
                                        ) : (
                                            <>
                                                <Music className="w-18 h-18 text-muted-foreground bg-muted/50 p-4 rounded-lg" />
                                                <p className="text-xs text-muted-foreground text-center">No cover art uploaded</p>
                                            </>
                                        )}
                                    </div>
                                </Card>

                                <Card className="flex-1 p-6">
                                    <CardHeader className="p-0 mb-4">
                                        <CardTitle>Release Information</CardTitle>
                                    </CardHeader>
                                    <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-0">
                                        <div>
                                            <Label>Release Name</Label>
                                            <Input value={releaseDetails.step1?.releaseInfo?.releaseName || ''} disabled />
                                        </div>
                                        {releaseType === 'advanced' && (
                                            <>
                                                <div>
                                                    <Label>Release Version</Label>
                                                    <Input value={releaseDetails.step1?.releaseInfo?.releaseVersion || ''} disabled />
                                                </div>
                                                <div>
                                                    <Label>Catalog #</Label>
                                                    <Input value={releaseDetails.step1?.releaseInfo?.catalog || ''} disabled />
                                                </div>
                                                <div>
                                                    <Label>Primary Artists</Label>
                                                    <Input value={releaseDetails.step1?.releaseInfo?.primaryArtists?.join(', ') || ''} disabled />
                                                </div>
                                                {releaseDetails.step1?.releaseInfo?.featuringArtists?.length > 0 && <div>
                                                    <Label>Featuring Artists</Label>
                                                    <Input value={releaseDetails.step1.releaseInfo.featuringArtists.join(', ')} disabled />
                                                </div>}
                                            </>
                                        )}
                                        <div>
                                            <Label>Genre</Label>
                                            <Input value={releaseDetails.step1?.releaseInfo?.genre || releaseDetails.step1?.releaseInfo?.primaryGenre || ''} disabled />
                                        </div>
                                        {releaseType === 'advanced' && releaseDetails.step1?.releaseInfo?.secondaryGenre && (
                                            <div>
                                                <Label>Secondary Genre</Label>
                                                <Input value={releaseDetails.step1.releaseInfo.secondaryGenre} disabled />
                                            </div>
                                        )}
                                        <div>
                                            <Label>Label Name</Label>
                                            <Input value={releaseDetails.step1?.releaseInfo?.labelName?.name || releaseDetails.step1?.releaseInfo?.labelName || ''} disabled />
                                        </div>
                                        <div>
                                            <Label>UPC Code</Label>
                                            <Input value={releaseDetails.step1?.releaseInfo?.upcCode || releaseDetails.step1?.releaseInfo?.upc || 'Auto-generated'} disabled />
                                        </div>
                                        {releaseType === 'advanced' && (
                                            <>
                                                {releaseDetails.step1?.releaseInfo?.cLine && <div>
                                                    <Label>C-Line</Label>
                                                    <Input value={`© ${releaseDetails.step1.releaseInfo.cLine.year} ${releaseDetails.step1.releaseInfo.cLine.text}`} disabled />
                                                </div>}
                                                {releaseDetails.step1?.releaseInfo?.pLine && <div>
                                                    <Label>P-Line</Label>
                                                    <Input value={`℗ ${releaseDetails.step1.releaseInfo.pLine.year} ${releaseDetails.step1.releaseInfo.pLine.text}`} disabled />
                                                </div>}
                                                {releaseDetails.step1?.releaseInfo?.releasePricingTier && <div>
                                                    <Label>Pricing Tier</Label>
                                                    <Input value={releaseDetails.step1.releaseInfo.releasePricingTier} disabled className="capitalize"/>
                                                </div>}
                                            </>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        </div>

                        {releaseDetails.step2?.tracks && releaseDetails.step2.tracks.length > 0 && (
                            <div className="space-y-6">
                                {releaseDetails.step2.tracks.map((track, index) => (
                                    <div key={index} className="md:flex gap-4 max-md:space-y-6">
                                        <Card className="p-6 basis-1/4">
                                            <CardHeader className="p-0 mb-4">
                                                <CardTitle>Audio file - Track {index + 1}</CardTitle>
                                            </CardHeader>
                                            <div className="border-2 border-dashed border-muted-foreground rounded-lg flex flex-col p-6 gap-2 items-center justify-center">
                                                <Music className="w-18 h-18 text-muted-foreground bg-muted/50 p-4 rounded-lg" />
                                                <div className="mt-2 space-y-1 text-center">
                                                    <h1 className="font-semibold break-all">{track.audioFileName || track.trackName || 'Audio File'}</h1>
                                                    {(track.audioFiles?.[0]?.fileUrl || track.trackLink) && (
                                                        <a href={track.audioFiles?.[0]?.fileUrl || track.trackLink} target="_blank" rel="noopener noreferrer" className="text-primary text-sm hover:underline block">
                                                            View Audio File
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </Card>

                                        <Card className="flex-1 p-6">
                                            <CardHeader className="p-0 mb-4">
                                                <CardTitle>Track {index + 1} Information</CardTitle>
                                            </CardHeader>
                                            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-0">
                                                <div>
                                                    <Label>Song Name</Label>
                                                    <Input value={track.trackName || track.songName || ''} disabled />
                                                </div>
                                                {releaseType === 'advanced' && track.mixVersion && (
                                                    <div>
                                                        <Label>Mix Version</Label>
                                                        <Input value={track.mixVersion} disabled />
                                                    </div>
                                                )}
                                                <div>
                                                    <Label>Genre</Label>
                                                    <Input value={track.genre || track.primaryGenre || ''} disabled />
                                                </div>
                                                 {releaseType === 'advanced' && track.secondaryGenre && (
                                                    <div>
                                                        <Label>Secondary Genre</Label>
                                                        <Input value={track.secondaryGenre} disabled />
                                                    </div>
                                                )}
                                                {releaseType === 'basic' && (
                                                    <>
                                                        <div><Label>Singer Name</Label><Input value={track.singerName || ''} disabled /></div>
                                                        <div><Label>Composer Name</Label><Input value={track.composerName || ''} disabled /></div>
                                                        <div><Label>Lyricist Name</Label><Input value={track.lyricistName || ''} disabled /></div>
                                                        <div><Label>Producer Name</Label><Input value={track.producerName || ''} disabled /></div>
                                                    </>
                                                )}
                                                {releaseType === 'advanced' && track.primaryArtists?.length > 0 && (
                                                    <div>
                                                        <Label>Primary Artists</Label>
                                                        <Input value={track.primaryArtists.join(', ')} disabled />
                                                    </div>
                                                )}
                                                {releaseType === 'advanced' && track.featuringArtists?.length > 0 && (
                                                    <div>
                                                        <Label>Featuring Artists</Label>
                                                        <Input value={track.featuringArtists.join(', ')} disabled />
                                                    </div>
                                                )}
                                                 {releaseType === 'advanced' && track.contributorsToSoundRecording?.length > 0 && renderContributors('Sound Recording Contributors', track.contributorsToSoundRecording)}
                                                 {releaseType === 'advanced' && track.contributorsToMusicalWork?.length > 0 && renderContributors('Musical Work Contributors', track.contributorsToMusicalWork)}
                                                <div>
                                                    <Label>ISRC</Label>
                                                    <Input value={track.isrc || track.isrcCode || 'Auto-generated'} disabled />
                                                </div>
                                                {track.language && (
                                                    <div>
                                                        <Label>Language</Label>
                                                        <Input value={track.language} disabled />
                                                    </div>
                                                )}
                                                {releaseType === 'advanced' && track.explicitStatus && (
                                                    <div>
                                                        <Label>Explicit Status</Label>
                                                        <Input value={track.explicitStatus} disabled className="capitalize"/>
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </div>
                                ))}
                            </div>
                        )}

                        <Card>
                            <CardHeader>
                                <CardTitle>Step 3 - Release Settings</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-4">
                                    {releaseDetails.step3?.releaseDate && (
                                        <div>
                                            <Label>Release Date</Label>
                                            <Input
                                                value={new Date(releaseDetails.step3.releaseDate).toLocaleDateString()}
                                                disabled
                                            />
                                        </div>
                                    )}
                                    {releaseDetails.step3?.deliveryDetails?.forFutureRelease && (
                                        <div>
                                            <Label>Future Release Date</Label>
                                            <Input
                                                value={new Date(releaseDetails.step3.deliveryDetails.forFutureRelease).toLocaleDateString()}
                                                disabled
                                            />
                                        </div>
                                    )}
                                    {releaseDetails.step3?.deliveryDetails?.forPastRelease && (
                                        <div>
                                            <Label>Past Release Date</Label>
                                            <Input
                                                value={new Date(releaseDetails.step3.deliveryDetails.forPastRelease).toLocaleDateString()}
                                                disabled
                                            />
                                        </div>
                                    )}

                                    {/* Territories */}
                                    {releaseDetails.step3?.territorialRights && (
                                        <div>
                                            <Label>Territorial Rights</Label>
                                            {releaseDetails.step3.territorialRights.isWorldwide ? (
                                                <Input value="Worldwide" disabled />
                                            ) : (
                                                <Card className="p-4 mt-2 border border-muted bg-muted/20">
                                                    <Label className="text-sm font-medium">Selected Territories ({releaseDetails.step3.territorialRights.territories?.length || 0})</Label>
                                                    <div className="grid grid-cols-3 gap-2 mt-3 max-h-40 overflow-y-auto">
                                                        {releaseDetails.step3.territorialRights.territories?.map((territory, idx) => (
                                                            <div key={idx} className="text-sm bg-background px-2 py-1 rounded">
                                                                {territory.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </Card>
                                            )}
                                        </div>
                                    )}

                                    {/* Distribution Partners */}
                                    {(releaseDetails.step3?.partnerSelection?.partners || releaseDetails.step3?.distributionPartners) && (
                                        <div>
                                            <Label>Distribution Partners</Label>
                                            <Card className="p-4 mt-2 border border-muted bg-muted/20">
                                                <Label className="text-sm font-medium">
                                                    Selected Partners ({(releaseDetails.step3.partnerSelection?.partners?.length || releaseDetails.step3.distributionPartners?.length || 0)})
                                                </Label>
                                                <div className="grid grid-cols-3 gap-2 mt-3 max-h-40 overflow-y-auto">
                                                    {(releaseDetails.step3.partnerSelection?.partners || releaseDetails.step3.distributionPartners)?.map((partner, idx) => (
                                                        <div key={idx} className="text-sm bg-background px-2 py-1 rounded">
                                                            {partner.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                                        </div>
                                                    ))}
                                                </div>
                                            </Card>
                                        </div>
                                    )}

                                    {/* Copyright Info */}
                                    {releaseDetails.step3?.copyrights && (
                                        <div>
                                            <Label>Copyright Information</Label>
                                            <Input
                                                value={releaseDetails.step3.copyrights.ownsCopyright ? 'Owns Copyright - Document Uploaded' : 'Proceeding without Copyright Document'}
                                                disabled
                                            />
                                        </div>
                                    )}
                                    {releaseDetails.step3?.copyrightOptions && (
                                        <div>
                                            <Label>Copyright Information</Label>
                                            <Input
                                                value={releaseDetails.step3.copyrightOptions.ownsCopyrights ? 'Owns Copyright - Document Uploaded' :
                                                       releaseDetails.step3.copyrightOptions.proceedWithoutCopyright ? 'Proceeding without Copyright Document' : 'No Information'}
                                                disabled
                                            />
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                ) : (
                    <div className="text-center py-12 text-muted-foreground">
                        No details available
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}

const CatalogPage = () => {
    const navigate = useNavigate()
    const [releaseType, setReleaseType] = useState('basic') // 'basic' or 'advanced'
    const [searchTerm, setSearchTerm] = useState('')
    const [debouncedSearch, setDebouncedSearch] = useState('')
    const [selectedStatus, setSelectedStatus] = useState('all')
    const [sortOrder, setSortOrder] = useState('desc')
    const [currentPage, setCurrentPage] = useState(1)
    const [selectedRelease, setSelectedRelease] = useState(null)
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
    const [isExportModalOpen, setIsExportModalOpen] = useState(false)
    const queryClient = useQueryClient()
    const itemsPerPage = 10

    const [editDialog, setEditDialog] = useState({ 
        isOpen: false, 
        release: null, 
        reason: '', 
        changes: '' 
    })

    const [takedownDialog, setTakedownDialog] = useState({ 
        isOpen: false, 
        release: null, 
        reason: '' 
    })

    const handleOpenEdit = (release) => {
        setEditDialog({ isOpen: true, release, reason: '', changes: '' })
    }

    const handleOpenTakedown = (release) => {
        setTakedownDialog({ isOpen: true, release, reason: '' })
    }

    const handleEditRelease = (release) => {
        if (releaseType === 'basic') {
            navigate(`/app/edit-release/basic/${release.releaseId}`)
        } else {
            navigate(`/app/edit-release/advanced/${release.releaseId}`)
        }
    }

    const submitEdit = async () => {
        if (!editDialog.reason || !editDialog.changes) {
            showToast.error("Please fill in all fields")
            return
        }
        
        try {
            if (releaseType === 'basic') {
                await requestUpdate(editDialog.release.releaseId, {
                    reason: editDialog.reason,
                    changes: editDialog.changes
                })
            } else {
                 await requestAdvancedUpdate(editDialog.release.releaseId, {
                    reason: editDialog.reason,
                    changes: editDialog.changes
                })
            }
            
            showToast.success("Edit request submitted")
            setEditDialog({ ...editDialog, isOpen: false })
            queryClient.invalidateQueries(['basicReleases'])
            queryClient.invalidateQueries(['advancedReleases'])
        } catch (error) {
            showToast.error(error.response?.data?.message || "Failed to submit request")
        }
    }

    const submitTakedown = async () => {
        if (!takedownDialog.reason) {
            showToast.error("Please enter a reason")
            return
        }
        
        try {
            if (releaseType === 'basic') {
                await requestTakeDown(takedownDialog.release.releaseId, {
                    reason: takedownDialog.reason
                })
            } else {
                 await requestAdvancedTakeDown(takedownDialog.release.releaseId, {
                    reason: takedownDialog.reason
                })
            }
            
            showToast.success("Takedown request submitted")
            setTakedownDialog({ ...takedownDialog, isOpen: false })
            queryClient.invalidateQueries(['basicReleases'])
            queryClient.invalidateQueries(['advancedReleases'])
        } catch (error) {
            showToast.error(error.response?.data?.message || "Failed to submit request")
        }
    }



    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm)
            setCurrentPage(1) // Reset to first page on search
        }, 500)

        return () => clearTimeout(timer)
    }, [searchTerm])

    // Fetch Basic Releases
    const { data: basicReleasesData, isLoading: basicLoading } = useQuery({
        queryKey: ['basicReleases', currentPage, debouncedSearch, selectedStatus, sortOrder, releaseType],
        queryFn: () => getBasicReleases({   
            page: currentPage,
            limit: itemsPerPage,
            status: selectedStatus === 'all' ? undefined : selectedStatus,
            search: debouncedSearch || undefined,
            sortOrder
        }),
        enabled: releaseType === 'basic',
        keepPreviousData: true
    })

    // Fetch Advanced Releases
    const { data: advancedReleasesData, isLoading: advancedLoading } = useQuery({
        queryKey: ['advancedReleases', currentPage, debouncedSearch, selectedStatus, sortOrder, releaseType],
        queryFn: () => getAdvancedReleases({
            page: currentPage,
            limit: itemsPerPage,
            status: selectedStatus === 'all' ? undefined : selectedStatus,
            search: debouncedSearch || undefined,
            sortOrder
        }),
        enabled: releaseType === 'advanced',
        keepPreviousData: true
    })

    // Fetch stats from both APIs
    const { data: basicStatsData } = useQuery({
        queryKey: ['basicStatsData'],
        queryFn: () => getBasicReleases({ page: 1, limit: 1 })
    })

    const { data: advancedStatsData } = useQuery({
        queryKey: ['advancedStatsData'],
        queryFn: () => getAdvancedReleases({ page: 1, limit: 1 })
    })

    const currentData = releaseType === 'basic' ? basicReleasesData : advancedReleasesData
    const isLoading = releaseType === 'basic' ? basicLoading : advancedLoading
    const releases = currentData?.data?.releases || []
    const pagination = currentData?.data?.pagination

    // Calculate combined stats
    const totalReleases = (basicStatsData?.data?.pagination?.totalItems || 0) + (advancedStatsData?.data?.pagination?.totalItems || 0)

    // Count live releases from both
    const basicLiveCount = 0 // We'll need to fetch this separately or calculate from all releases
    const advancedLiveCount = 0 // Same here
    const liveReleases = basicLiveCount + advancedLiveCount

    const handleViewDetails = (release) => {
        setSelectedRelease(release)
        setIsDetailModalOpen(true)
    }

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= (pagination?.totalPages || 1)) {
            setCurrentPage(newPage)
        }
    }

    const handleStatusChange = (value) => {
        setSelectedStatus(value)
        setCurrentPage(1)
    }

    const handleSortChange = (value) => {
        setSortOrder(value)
        setCurrentPage(1)
    }

    return (
        <div className="min-h-screen bg-background text-foreground p-6">
            {/* Header */}
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Catalog</h1>
                    <p className="text-muted-foreground mt-1">Manage all your releases and track their performance</p>
                </div>
                <Link to="/app/upload-release">
                    <Button className="bg-[#711CE9] text-white hover:bg-[#711CE9]/90">
                        <Music className="w-4 h-4 mr-2" />
                        New Release
                    </Button>
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card className='p-0'>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-muted-foreground text-sm">Total Releases</p>
                                <p className="text-2xl font-bold">{totalReleases}</p>
                            </div>
                            <Music className="w-8 h-8 text-muted-foreground" />
                        </div>
                    </CardContent>
                </Card>

                <Card className='p-0'>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-muted-foreground text-sm">Live Releases</p>
                                <p className="text-2xl font-bold">{liveReleases}</p>
                            </div>
                            <div className="flex items-center bg-green-200/10 p-2 rounded-full">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className='p-0'>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-muted-foreground text-sm">Total Streams</p>
                                <p className="text-2xl font-bold">-</p>
                            </div>
                            <Play className="w-8 h-8 text-muted-foreground" />
                        </div>
                    </CardContent>
                </Card>

                <Card className='p-0'>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-muted-foreground text-sm">Total Revenue</p>
                                <p className="text-2xl font-bold">-</p>
                            </div>
                            <BarChart3 className="w-8 h-8 text-muted-foreground" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Release Type Toggle */}
            <div className="flex gap-4 mb-6">
                <Button
                    variant={releaseType === 'basic' ? 'default' : 'outline'}
                    onClick={() => {
                        setReleaseType('basic')
                        setCurrentPage(1)
                    }}
                    className={releaseType === 'basic' ? 'bg-[#711CE9] hover:bg-[#711CE9]/90 text-white' : 'text-white'}
                >
                    Basic Releases
                </Button>
                <Button
                    variant={releaseType === 'advanced' ? 'default' : 'outline'}
                    onClick={() => {
                        setReleaseType('advanced')
                        setCurrentPage(1)
                    }}
                    className={releaseType === 'advanced' ? 'bg-[#711CE9] hover:bg-[#711CE9]/90 text-white' : 'tewhxt-white'}
                >
                    Advanced Releases
                </Button>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                        placeholder="Search releases..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Select value={sortOrder} onValueChange={handleSortChange}>
                    <SelectTrigger className="w-48">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="desc">Newest First</SelectItem>
                        <SelectItem value="asc">Oldest First</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={selectedStatus} onValueChange={handleStatusChange}>
                    <SelectTrigger className="w-48">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value={EReleaseStatus.DRAFT}>Draft</SelectItem>
                        <SelectItem value={EReleaseStatus.SUBMITTED}>Pending</SelectItem>
                        <SelectItem value={EReleaseStatus.UNDER_REVIEW}>Under Review</SelectItem>
                        <SelectItem value={EReleaseStatus.PROCESSING}>Processing</SelectItem>
                        <SelectItem value={EReleaseStatus.PUBLISHED}>Published</SelectItem>
                        <SelectItem value={EReleaseStatus.LIVE}>Live</SelectItem>
                        <SelectItem value={EReleaseStatus.REJECTED}>Rejected</SelectItem>
                        <SelectItem value={EReleaseStatus.TAKE_DOWN}>Take Down</SelectItem>
                        <SelectItem value={EReleaseStatus.TAKEN_DOWN}>Taken Down</SelectItem>
                        <SelectItem value={EReleaseStatus.UPDATE_REQUEST}>Update Request</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Releases Table */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>
                        {releaseType === 'basic' ? 'Basic Releases' : 'Advanced Releases'}
                    </CardTitle>
                    <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsExportModalOpen(true)}
                        >
                            <Upload className="w-4 h-4 mr-2" />
                            Export as CSV
                        </Button>
                    </div>
                </CardHeader>

                <CardContent>
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-sm text-left border-collapse">
                                    <thead className="border-b text-muted-foreground">
                                        <tr className='whitespace-nowrap'>
                                            <th className="px-4 py-2">Release ID</th>
                                            <th className="px-4 py-2">Release Name</th>
                                            <th className="px-4 py-2">Type</th>
                                            <th className="px-4 py-2">Status</th>
                                            <th className="px-4 py-2">Created Date</th>
                                            <th className="px-4 py-2">Tracks</th>
                                            <th className="px-4 py-2 text-center">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {releases.map((release) => (
                                            <tr key={release.releaseId || release._id} className="hover:bg-secondary/50 whitespace-nowrap">
                                                <td className="px-4 py-3">{release.releaseId}</td>
                                                <td className="px-4 py-3 truncate max-w-[200px]" title={release.releaseName || release.step1?.releaseInfo?.releaseName}>
                                                    {release.releaseName || release.step1?.releaseInfo?.releaseName ||'Untitled Release'}
                                                </td>
                                                <td className="px-4 py-3 capitalize">{release.trackType || release.releaseType}</td>
                                                <td className="px-4 py-3">
                                                    <StatusBadge status={release.releaseStatus} />
                                                </td>
                                               
                                                <td className="px-4 py-3">
                                                    {new Date(release.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-4 py-3 text-center">{release.step2?.tracks?.length || release.trackCount  || '--'} </td>
                                                <td className="px-4 py-3 flex gap-2">
                                                    <Button
                                                        onClick={() => handleViewDetails(release)}
                                                        size="sm"
                                                        className="bg-[#711CE9] text-white hover:bg-[#711CE9]/90"
                                                    >
                                                        <Eye className="w-4 h-4 mr-1" />
                                                        View Details
                                                    </Button>
                                                  


                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button size="sm" variant="ghost">
                                                                <MoreHorizontal className="w-4 h-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                            <DropdownMenuItem onClick={() => handleViewDetails(release)}>
                                                                View Details
                                                            </DropdownMenuItem>

                                                            {(release.releaseStatus === EReleaseStatus.DRAFT || release.releaseStatus === EReleaseStatus.REJECTED) && (
                                                                <>
                                                                    <DropdownMenuSeparator />
                                                                    <DropdownMenuItem onClick={() => handleEditRelease(release)}>
                                                                        Edit Release
                                                                    </DropdownMenuItem>
                                                                </>
                                                            )}
                                                            

                                                            
                                                            {(release.releaseStatus === EReleaseStatus.LIVE || release.releaseStatus === EReleaseStatus.PUBLISHED) && (
                                                                <>
                                                                    <DropdownMenuSeparator />
                                                                    <DropdownMenuItem onClick={() => handleOpenEdit(release)}>
                                                                        Request Edit
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem onClick={() => handleOpenTakedown(release)} className="text-red-600 focus:text-red-600">
                                                                        Request Takedown
                                                                    </DropdownMenuItem>
                                                                </>
                                                            )}
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </td>
                                            </tr>
                                        ))}
                                        {releases.length === 0 && (
                                            <tr>
                                                <td colSpan="7" className="text-center py-12">
                                                    <Music className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                                                    <p className="text-muted-foreground">No releases found</p>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {pagination && pagination.totalPages > 1 && (
                                <div className="flex items-center justify-between mt-6">
                                    <div className="text-sm text-muted-foreground">
                                        Showing {((pagination.currentPage - 1) * itemsPerPage) + 1} to {Math.min(pagination.currentPage * itemsPerPage, pagination.totalItems)} of {pagination.totalItems} releases
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 1}
                                        >
                                            <ChevronLeft className="w-4 h-4" />
                                            Previous
                                        </Button>
                                        <div className="flex gap-1">
                                            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                                                let pageNum
                                                if (pagination.totalPages <= 5) {
                                                    pageNum = i + 1
                                                } else if (currentPage <= 3) {
                                                    pageNum = i + 1
                                                } else if (currentPage >= pagination.totalPages - 2) {
                                                    pageNum = pagination.totalPages - 4 + i
                                                } else {
                                                    pageNum = currentPage - 2 + i
                                                }

                                                return (
                                                    <Button
                                                        key={pageNum}
                                                        variant={pageNum === currentPage ? 'default' : 'outline'}
                                                        size="sm"
                                                        onClick={() => handlePageChange(pageNum)}
                                                        className={pageNum === currentPage ? 'bg-[#711CE9] hover:bg-[#711CE9]/90' : ''}
                                                    >
                                                        {pageNum}
                                                    </Button>
                                                )
                                            })}
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage === pagination.totalPages}
                                        >
                                            Next
                                            <ChevronRight className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>

            {/* Release Details Modal */}
            <ReleaseDetailsModal
                release={selectedRelease}
                isOpen={isDetailModalOpen}
                onClose={() => {
                    setIsDetailModalOpen(false)
                    setSelectedRelease(null)
                }}
                releaseType={releaseType}
            />
            {/* Edit Request Dialog */}
            <Dialog open={editDialog.isOpen} onOpenChange={(open) => setEditDialog({ ...editDialog, isOpen: open })}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Request Edit For {editDialog.release?.releaseName}</DialogTitle>
                        <DialogDescription>
                            Note: Moving a release back to draft for editing will temporarily remove it from review/live status.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Reason for Edit</Label>
                            <Input 
                                placeholder="E.g. Typo in title, wrong artwork" 
                                value={editDialog.reason}
                                onChange={(e) => setEditDialog({ ...editDialog, reason: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Requested Changes</Label>
                            <Textarea 
                                placeholder="Describe exactly what needs to be changed..." 
                                value={editDialog.changes}
                                onChange={(e) => setEditDialog({ ...editDialog, changes: e.target.value })}
                                rows={4}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditDialog({ ...editDialog, isOpen: false })}>Cancel</Button>
                        <Button onClick={submitEdit} disabled={!editDialog.reason || !editDialog.changes}>Submit Request</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Takedown Request Dialog */}
            <Dialog open={takedownDialog.isOpen} onOpenChange={(open) => setTakedownDialog({ ...takedownDialog, isOpen: open })}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-red-600">Request Takedown For {takedownDialog.release?.releaseName}</DialogTitle>
                        <DialogDescription>
                            Warning: This will permanently remove your release from all stores. This action cannot be undone immediately.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Reason for Takedown</Label>
                            <Textarea 
                                placeholder="Why do you want to take down this release?" 
                                value={takedownDialog.reason}
                                onChange={(e) => setTakedownDialog({ ...takedownDialog, reason: e.target.value })}
                                rows={4}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setTakedownDialog({ ...takedownDialog, isOpen: false })}>Cancel</Button>
                        <Button variant="destructive" onClick={submitTakedown} disabled={!takedownDialog.reason}>Submit Takedown Request</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

             <ExportCsvDialog
                isOpen={isExportModalOpen}
                onClose={() => setIsExportModalOpen(false)}
                totalItems={pagination?.totalItems || 0}
                headers={[
                  { label: "S.No.", key: "sno" },
                  { label: "Release ID", key: "releaseId" },
                  { label: "Release Name", key: "releaseName" },
                  { label: "Release Type", key: "releaseType" },
                  { label: "Track Type", key: "trackType" },
                  { label: "Status", key: "releaseStatus" },
                  { label: "Request Status", key: "requestStatus" },
                  { label: "Label", key: "labelName" },
                  { label: "Genre", key: "genre" },
                  { label: "UPC", key: "upc" },
                  { label: "Cover Art URL", key: "coverArtUrl" },
                  { label: "Submitted At", key: "submittedAt" },
                  { label: "Published At", key: "publishedAt" },
                  { label: "Live At", key: "liveAt" },
                  // Track Details
                  { label: "Track No.", key: "trackNumber" },
                  { label: "Track Name", key: "trackName" },
                  { label: "ISRC", key: "isrc" },
                  { label: "Track Genre", key: "trackGenre" },
                  { label: "Composer", key: "trackComposer" },
                  { label: "Lyricist", key: "trackLyricist" },
                  { label: "Singer", key: "trackSinger" },
                  { label: "Producer", key: "trackProducer" },
                  { label: "Audio Format", key: "audioFormat" },
                  { label: "Audio File URL", key: "audioFileUrl" },
                  { label: "Duration", key: "duration" },
                  { label: "Preview Start", key: "previewStart" },
                  { label: "Preview End", key: "previewEnd" },
                  { label: "Caller Tune Start", key: "callerTuneStart" },
                  { label: "Caller Tune End", key: "callerTuneEnd" },
                  // Step 3 Details
                  { label: "Release Date", key: "releaseDate" },
                  { label: "Has Rights", key: "hasRights" },
                  { label: "Territories", key: "territories" },
                  { label: "Has Partners", key: "hasPartners" },
                  { label: "Partners", key: "partners" },
                  { label: "Owns Copyright", key: "ownsCopyright" },
                ]}
                fetchData={async (page, limit) => {
                  try {
                    const params = {
                      page,
                      limit,
                      status: selectedStatus === 'all' ? undefined : selectedStatus,
                      search: debouncedSearch || undefined,
                      sortOrder,
                      isExport: true // Signal backend to populate all fields
                    };
                    
                    const fetchFunction = releaseType === 'basic' ? getBasicReleases : getAdvancedReleases;
                    const res = await fetchFunction(params);
                    const releasesToExport = res?.data?.releases || res?.data?.data?.releases || []; // Handle structure variations

                    const flattenedData = [];

                    releasesToExport.forEach(rel => {
                      const releaseInfo = {
                        releaseId: rel.releaseId,
                        releaseName: rel.releaseName || rel.step1?.releaseInfo?.releaseName || rel.releaseTitle || '-',
                        upc: rel.step1?.releaseInfo?.upc ? `\t${rel.step1.releaseInfo.upc}` : '-',
                        labelName: rel.step1?.releaseInfo?.labelName || '-',
                        genre: rel.step1?.releaseInfo?.genre || '-',
                        releaseType: rel.releaseType || 'Basic',
                        trackType: rel.trackType,
                        releaseStatus: rel.releaseStatus === 'submitted' ? 'Pending' : rel.releaseStatus,
                        requestStatus: (rel.requestStatus || rel.releaseStatus) === 'submitted' ? 'Pending' : (rel.requestStatus || rel.releaseStatus),
                        coverArtUrl: rel.step1?.coverArt?.imageUrl || '-',
                        releaseDate: rel.step3?.releaseDate ? new Date(rel.step3.releaseDate).toLocaleDateString() : '-',
                        hasRights: rel.step3?.territorialRights?.hasRights ? "Yes" : "No",
                        territories: rel.step3?.territorialRights?.territories?.join(", ") || '-',
                        hasPartners: rel.step3?.partnerSelection?.hasPartners ? "Yes" : "No",
                        partners: rel.step3?.partnerSelection?.partners?.join(", ") || '-',
                        ownsCopyright: rel.step3?.copyrights?.ownsCopyright ? "Yes" : "No",
                        submittedAt: rel.submittedAt ? new Date(rel.submittedAt).toLocaleDateString() : '-',
                        publishedAt: rel.publishedAt ? new Date(rel.publishedAt).toLocaleDateString() : '-',
                        liveAt: rel.liveAt ? new Date(rel.liveAt).toLocaleDateString() : '-'
                      };

                      const tracks = rel.step2?.tracks || [];

                      if (tracks.length > 0) {
                        tracks.forEach((track, index) => {
                          flattenedData.push({
                            sno: flattenedData.length + 1,
                            ...releaseInfo,
                            trackNumber: index + 1,
                            trackName: track.trackName || '-',
                            isrc: track.isrc ? `\t${track.isrc}` : '-',
                            trackGenre: track.genre || '-',
                            trackComposer: track.composerName || '-',
                            trackLyricist: track.lyricistName || '-',
                            trackSinger: track.singerName || '-',
                            trackProducer: track.producerName || '-',
                            audioFormat: track.audioFiles?.[0]?.format || '-',
                            audioFileUrl: track.audioFiles?.[0]?.fileUrl || '-',
                            duration: track.audioFiles?.[0]?.duration ? `${Math.floor(track.audioFiles[0].duration)}s` : '-',
                            previewStart: track.previewTiming?.startTime ?? '-',
                            previewEnd: track.previewTiming?.endTime ?? '-',
                            callerTuneStart: track.callerTuneTiming?.startTime ?? '-',
                            callerTuneEnd: track.callerTuneTiming?.endTime ?? '-'
                          });
                        });
                      } else {
                        flattenedData.push({
                          sno: flattenedData.length + 1,
                          ...releaseInfo,
                          trackNumber: '-',
                          trackName: '-',
                          isrc: '-',
                          trackGenre: '-',
                          trackComposer: '-',
                          trackLyricist: '-',
                          trackSinger: '-',
                          trackProducer: '-',
                          audioFormat: '-',
                          audioFileUrl: '-',
                          duration: '-',
                          previewStart: '-',
                          previewEnd: '-',
                          callerTuneStart: '-',
                          callerTuneEnd: '-'
                        });
                      }
                    });

                    return flattenedData;
                  } catch (err) {
                    showToast.error("Failed to fetch data for export.");
                    return [];
                  }
                }}
              />
        </div>
    )
}

export default CatalogPage
