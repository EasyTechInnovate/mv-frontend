import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Eye, Plus, ArrowLeft, ChevronLeft, ChevronRight, Music } from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getMyPlaylistPitchingSubmissions, submitPlaylistPitchingRequest } from '../../services/api.services'
import { showToast } from '../../utils/toast'

import {
    genreOptions,
    moodOptions,
    languageOptions,
    themeOptions,
    vocalsPresentOptions,
    storeOptions
} from '../../constants/options'

// --- HELPER COMPONENTS ---

const InputWithLabel = ({ id, label, value, onChange, disabled, ...props }) => (
    <div className="space-y-2">
        <Label htmlFor={id}>{label}</Label>
        <Input
            id={id}
            value={value}
            onChange={onChange}
            disabled={disabled}
            className="bg-background border-border"
            {...props}
        />
    </div>
)

const SelectWithLabel = ({ id, label, value, onValueChange, disabled, options }) => (
    <div className="space-y-2 ">
        <Label htmlFor={id}>{label}</Label>
        <Select
            value={value}
            onValueChange={onValueChange}
            disabled={disabled}>
            <SelectTrigger
                id={id}
                className=" bg-background border-border">
                <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
                {options.map((option) => (
                    <SelectItem
                        key={option.label}
                        value={option.value}>
                        {option.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    </div>
)

export default function PlaylistPitching() {
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10

    // State to manage form visibility, data, and view-only mode
    const [viewState, setViewState] = useState({
        showForm: false, data: null, isViewOnly: false
    })

    const queryClient = useQueryClient()

    // --- DATA FETCHING ---
    const { data: pitchingData, isLoading } = useQuery({
        queryKey: ['playlistPitchingSubmissions', currentPage],
        queryFn: () => getMyPlaylistPitchingSubmissions({ page: currentPage, limit: itemsPerPage }),
        keepPreviousData: true
    })

    const pitchingRequests = pitchingData?.data?.submissions || []
    const currentPagination = pitchingData?.data?.pagination

    // --- FORM DATA ---

    const initialPitchingFormData = {
        trackName: '',
        artistName: '',
        labelName: '',
        isrc: '',
        genres: '',
        mood: '',
        isVocalsPresent: 'false',
        language: '',
        theme: '',
        selectedStore: '',
        trackLinks: [{ platform: '', url: '' }]
    }

    // --- HANDLERS ---

    const handleNewRequest = () => {
        setViewState({
            showForm: true, data: initialPitchingFormData, isViewOnly: false
        })
    }

    const handleView = (item) => {
        setViewState({
            showForm: true,
            data: {
                ...item,
                // The API sends genres as an array, but the Select component expects a single value.
                // We take the first genre from the array for display purposes.
                genres: Array.isArray(item.genres) ? item.genres[0] : item.genres,
                trackLinks: item.trackLinks || [{ platform: '', url: '' }],
                isVocalsPresent: item.isVocalsPresent ? "true" : "false"
            },
            isViewOnly: true
        })
    }

    const handleBackToList = () => {
        setViewState({ showForm: false, data: null, isViewOnly: false })
    }

    const pitchingMutation = useMutation({
        mutationFn: submitPlaylistPitchingRequest,
        onSuccess: () => {
            showToast.success('Playlist pitch submitted successfully!')
            queryClient.invalidateQueries(['playlistPitchingSubmissions'])
            handleBackToList()
        },
        onError: (error) => {
            const data = error.response?.data
            if (data?.errors && Array.isArray(data.errors) && data.errors.length > 0) {
                data.errors.forEach((err) => {
                    showToast.error(err.message || 'Validation error')
                })
            } else {
                showToast.error(data?.message || 'Failed to submit playlist pitch.')
            }
        }
    })

    const handleFormSubmit = () => {
        const formData = viewState.data
        const { language, ...restOfFormData } = formData
        const payload = {
            ...restOfFormData,
            genres: [formData.genres], // Already lowercase
            ...(language && { language: language.toLowerCase() }),
            theme: formData.theme,
            isVocalsPresent: formData.isVocalsPresent === "true",
            trackLinks: formData.trackLinks
        }
        pitchingMutation.mutate(payload)
    }

    const isSubmitting = pitchingMutation.isLoading

    const handleTrackLinkChange = (index, url) => {
        setViewState((prev) => {
            const newTrackLinks = [...prev.data.trackLinks]
            newTrackLinks[index] = { ...newTrackLinks[index], url }
            return {
                ...prev,
                data: {
                    ...prev.data,
                    trackLinks: newTrackLinks
                }
            }
        })
    }

    const handleInputChange = (field, value) => {
        setViewState((prev) => {
            const newData = { ...prev.data, [field]: value }
            if (field === 'isVocalsPresent' && value === 'false') {
                newData.language = ''
            }
            if (field === 'selectedStore') {
                if (value === 'Select All') {
                    newData.trackLinks = [
                        { platform: 'Spotify', url: '' },
                        { platform: 'Apple Music', url: '' },
                        { platform: 'JioSaavn', url: '' },
                        { platform: 'Amazon', url: '' }
                    ]
                } else {
                    newData.trackLinks = [{ platform: value, url: '' }]
                }
            }
            return {
                ...prev,
                data: newData
            }
        })
    }

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= (currentPagination?.totalPages || 1)) {
            setCurrentPage(newPage)
        }
    }

    // --- RENDER FUNCTIONS ---

    const renderPlaylistPitchingForm = () => {
        const { data, isViewOnly } = viewState
        if (!data) return null

        return (
            <div>
                <div className="flex items-center gap-4 mb-6">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={handleBackToList}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">{isViewOnly ? 'View Playlist Pitch' : 'New Playlist Pitching Request'}</h1>
                        <p className="text-muted-foreground">
                            {isViewOnly ? 'Viewing the details for your playlist pitch.' : 'Fill in the details for your playlist pitch.'}
                        </p>
                    </div>
                </div>
                <Card>
                    <CardContent className="p-8 space-y-8">
                        {/* Basic Information Section */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round">
                                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                                    <circle
                                        cx="12"
                                        cy="7"
                                        r="4"
                                    />
                                </svg>
                                Basic Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InputWithLabel
                                    id="trackName"
                                    label="Track Name"
                                    placeholder={isViewOnly ? "" : "Artist"}
                                    value={data.trackName}
                                    disabled={isViewOnly}
                                    onChange={(e) => handleInputChange('trackName', e.target.value)}
                                />
                                <InputWithLabel
                                    id="artistName"
                                    label="Artist Name"
                                    placeholder={isViewOnly ? "" : "Name"}
                                    value={data.artistName}
                                    disabled={isViewOnly}
                                    onChange={(e) => handleInputChange('artistName', e.target.value)}
                                />
                                <InputWithLabel
                                    id="labelName"
                                    label="Label name"
                                    placeholder={isViewOnly ? "" : "Label Name"}
                                    value={data.labelName}
                                    disabled={isViewOnly}
                                    onChange={(e) => handleInputChange('labelName', e.target.value)}
                                />
                                <InputWithLabel
                                    id="isrc"
                                    label="ISRC of the Track (Optional)"
                                    placeholder={isViewOnly ? "" : "9856674676476"}
                                    value={data.isrc}
                                    disabled={isViewOnly}
                                    onChange={(e) => handleInputChange('isrc', e.target.value)}
                                />
                                <SelectWithLabel
                                    id="genres"
                                    label="Genres"
                                    value={data.genres}
                                    disabled={isViewOnly}
                                    onValueChange={(value) => handleInputChange('genres', value)}
                                    options={genreOptions}
                                />
                                <SelectWithLabel
                                    id="mood"
                                    label="Mood"
                                    value={data.mood}
                                    disabled={isViewOnly}
                                    onValueChange={(value) => handleInputChange('mood', value)}
                                    options={moodOptions}
                                />
                                <SelectWithLabel
                                    id="isVocalsPresent"
                                    label="Is Vocals Present?"
                                    value={data.isVocalsPresent}
                                    disabled={isViewOnly}
                                    onValueChange={(value) => handleInputChange('isVocalsPresent', value)}
                                    options={vocalsPresentOptions}
                                />
                                <SelectWithLabel
                                    id="language"
                                    label="Language"
                                    value={data.language}
                                    disabled={isViewOnly || data.isVocalsPresent === 'false'}
                                    onValueChange={(value) => handleInputChange('language', value)}
                                    options={languageOptions}
                                />
                                <SelectWithLabel
                                    id="theme"
                                    label="Theme"
                                    value={data.theme}
                                    disabled={isViewOnly}
                                    onValueChange={(value) => handleInputChange('theme', value)}
                                    options={themeOptions}
                                />
                                <SelectWithLabel
                                    id="selectedStore"
                                    label="Select Store"
                                    value={data.selectedStore}
                                    disabled={isViewOnly}
                                    onValueChange={(value) => handleInputChange('selectedStore', value)}
                                    options={storeOptions}
                                />
                                <div className="md:col-span-2">
                                    {data.selectedStore === 'Select All' ? (
                                        <div className="space-y-4">
                                            {data.trackLinks.map((trackLink, index) => (
                                                <InputWithLabel
                                                    key={index}
                                                    id={`trackLink-${index}`}
                                                    label={`Track Link for ${trackLink.platform}`}
                                                    placeholder={isViewOnly ? "" : `Link for ${trackLink.platform}`}
                                                    value={trackLink.url}
                                                    disabled={isViewOnly}
                                                    onChange={(e) => handleTrackLinkChange(index, e.target.value)}
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <InputWithLabel
                                            id="trackLink"
                                            label="Track Link"
                                            placeholder={isViewOnly ? "" : "Link"}
                                            value={data.trackLinks[0]?.url || ''}
                                            disabled={isViewOnly}
                                            onChange={(e) => handleTrackLinkChange(0, e.target.value)}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>

                        {isViewOnly && data.status === 'rejected' && data.rejectionReason && (
                            <div className="mt-6 p-4 rounded-md border border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-800">
                                <h3 className="text-red-800 dark:text-red-400 font-semibold mb-1">Rejection Reason</h3>
                                <p className="text-sm text-red-700 dark:text-red-300">{data.rejectionReason}</p>
                            </div>
                        )}

                        {!isViewOnly && (
                            <div className="flex justify-center pt-4">
                                <Button
                                    onClick={handleFormSubmit}
                                    disabled={isSubmitting}
                                    className="bg-[#711CE9] hover:bg-[#6f14ef] text-white w-full md:w-auto px-10">
                                    Submit
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        )
    }

    // --- MAIN RENDER ---

    if (viewState.showForm) {
        return (
            <div className="min-h-screen bg-background text-foreground p-6">
                {renderPlaylistPitchingForm()}
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background text-foreground p-6">
            {/* Main Page Header */}
            <div>
                <h1 className="text-2xl font-bold">Playlist Pitching</h1>
                <p className="text-muted-foreground">Submit your tracks for playlist consideration across platforms</p>
            </div>

            {/* Content Header */}
            <div className="mt-8 flex flex-wrap justify-between items-center gap-4 mb-6">
                <div>
                    <h2 className="text-xl font-semibold">Playlist Pitching Requests</h2>
                    <p className="text-muted-foreground text-sm">View, create, and manage your submissions below.</p>
                </div>
                <Button
                    onClick={handleNewRequest}
                    className="bg-[#711CE9] hover:bg-[#6f14ef] text-white flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    New Playlist Pitch
                </Button>
            </div>

            {/* Table */}
            <Card>
                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="text-left text-muted-foreground border-b border-border">
                                        <tr className="whitespace-nowrap">
                                            <th className="p-4 font-medium">Track Name</th>
                                            <th className="p-4 font-medium">Artist Name</th>
                                            <th className="p-4 font-medium">Language</th>
                                            <th className="p-4 font-medium">Genres</th>
                                            <th className="p-4 font-medium">Status</th>
                                            <th className="p-4 font-medium">Submit Date</th>
                                            <th className="p-4 font-medium text-center">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pitchingRequests.map((request) => (
                                            <tr
                                                key={request._id}
                                                className="border-b border-border last:border-b-0 hover:bg-muted/50 whitespace-nowrap">
                                                <td className="p-4">{request.trackName}</td>
                                                <td className="p-4">{request.artistName}</td>
                                                <td className="p-4 capitalize">{request.language}</td>
                                                <td className="p-4 capitalize">{request.genres.join(', ')}</td>
                                                <td className="p-4">
                                                    <span className="px-2 py-1 rounded text-xs bg-yellow-500/20 text-yellow-600 dark:bg-yellow-500/10 dark:text-yellow-400 capitalize">
                                                        {request.status}
                                                    </span>
                                                </td>
                                                <td className="p-4">{new Date(request.createdAt).toLocaleDateString()}</td>
                                                <td className="p-4 text-center">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleView(request)}
                                                        className="flex items-center gap-2">
                                                        <Eye className="h-4 w-4" />
                                                        View
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                        {pitchingRequests.length === 0 && (
                                            <tr>
                                                <td
                                                    colSpan="7"
                                                    className="text-center py-12">
                                                    <Music className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                                                    <p className="text-muted-foreground">No submissions found</p>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {currentPagination && currentPagination.totalPages > 1 && (
                                <div className="flex items-center justify-between mt-6 p-4 border-t">
                                    <div className="text-sm text-muted-foreground">
                                        Showing {(currentPagination.currentPage - 1) * itemsPerPage + 1} to{' '}
                                        {Math.min(currentPagination.currentPage * itemsPerPage, currentPagination.totalCount)} of{' '}
                                        {currentPagination.totalCount} submissions
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 1}>
                                            <ChevronLeft className="w-4 h-4" />
                                            Previous
                                        </Button>

                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage === currentPagination.totalPages}>
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
        </div>
    )
}
