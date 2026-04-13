import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Eye, Plus, ArrowLeft, ChevronLeft, ChevronRight, Music } from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getMySyncSubmissions, submitSyncRequest } from '../../services/api.services'
import { showToast } from '../../utils/toast'

import {
    genreOptions,
    moodOptions,
    languageOptions,
    themeOptions,
    vocalsPresentOptions,
    syncClearedOptions,
    masterRightsOptions,
    publishingRightsOptions
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

const CheckboxWithLabel = ({ id, label, checked, onCheckedChange, disabled }) => (
    <div className="flex items-center space-x-2">
        <Checkbox
            id={id}
            checked={checked}
            onCheckedChange={onCheckedChange}
            disabled={disabled}
        />
        <label
            htmlFor={id}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {label}
        </label>
    </div>
)

export default function Sync() {
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10

    // State to manage form visibility, data, and view-only mode
    const [viewState, setViewState] = useState({
        showForm: false, data: null, isViewOnly: false
    })

    const queryClient = useQueryClient()

    // --- DATA FETCHING ---
    const { data: syncData, isLoading } = useQuery({
        queryKey: ['syncSubmissions', currentPage],
        queryFn: () => getMySyncSubmissions({ page: currentPage, limit: itemsPerPage }),
        keepPreviousData: true
    })

    const syncRequests = syncData?.data?.submissions || []
    const currentPagination = syncData?.data?.pagination

    // --- FORM DATA ---

    const initialSyncFormData = {
        trackName: '',
        artistName: '',
        labelName: '',
        isrc: '',
        genres: '',
        mood: '',
        isVocalsPresent: 'false',
        language: '',
        theme: '',
        tempoBPM: '',
        masterRightsOwner: '',
        publishingRightsOwner: '',
        isFullyClearedForSync: 'true',
        proAffiliation: '',
        projectSuitability: {
            ad_campaigns: false,
            ott_web_series: false,
            tv_film_score: false,
            trailers: false,
            podcasts: false,
            corporate_films: false,
            fashion_or_product_launch: false,
            gaming_animation: false,
            festival_documentaries: false,
            short_films_student_projects: false
        },
        trackLinks: ''
    }

    // --- HANDLERS ---

    const handleNewRequest = () => {
        setViewState({
            showForm: true, data: initialSyncFormData, isViewOnly: false
        })
    }

    const handleView = (item) => {
        let projectSuitability = {}
        // Convert array from API to object for checkboxes
        Object.keys(initialSyncFormData.projectSuitability).forEach((key) => {
            projectSuitability[key] = item.projectSuitability.includes(key)
        })

        setViewState({
            showForm: true,
            data: {
                ...item,
                // The API sends genres as an array, but the Select component expects a single value.
                // We take the first genre from the array for display purposes.
                genres: Array.isArray(item.genres) ? item.genres[0] : item.genres,
                projectSuitability: projectSuitability,
                trackLinks: item.trackLinks?.[0]?.url || '',
                isVocalsPresent: item.isVocalsPresent ? "true" : "false",
                isFullyClearedForSync: String(item.isFullyClearedForSync)
            },
            isViewOnly: true
        })
    }

    const handleBackToList = () => {
        setViewState({ showForm: false, data: null, isViewOnly: false })
    }

    const syncMutation = useMutation({
        mutationFn: submitSyncRequest,
        onSuccess: () => {
            showToast.success('Sync request submitted successfully!')
            queryClient.invalidateQueries(['syncSubmissions'])
            handleBackToList()
        },
        onError: (error) => {
            const data = error.response?.data
            if (data?.errors && Array.isArray(data.errors) && data.errors.length > 0) {
                data.errors.forEach((err) => {
                    showToast.error(err.message || 'Validation error')
                })
            } else {
                showToast.error(data?.message || 'Failed to submit sync request.')
            }
        }
    })

    const handleFormSubmit = () => {
        const formData = viewState.data
        const { language, proAffiliation, ...restOfFormData } = formData
        const payload = {
            ...restOfFormData,
            genres: [formData.genres], // Already lowercase
            ...(proAffiliation && { proAffiliation: proAffiliation.toLowerCase() }),
            ...(language && { language: language.toLowerCase() }),
            theme: formData.theme,
            isVocalsPresent: formData.isVocalsPresent === "true",
            isFullyClearedForSync: formData.isFullyClearedForSync === "unsure" ? "unsure" : formData.isFullyClearedForSync === "true",
            projectSuitability: Object.keys(formData.projectSuitability).filter((key) => formData.projectSuitability[key]),
            trackLinks: [{ platform: 'Spotify', url: formData.trackLinks }] // Assuming Spotify for now
        }
        syncMutation.mutate(payload)
    }

    const isSubmitting = syncMutation.isLoading

    const handleInputChange = (field, value) => {
        setViewState((prev) => {
            const newData = { ...prev.data, [field]: value }
            if (field === 'isVocalsPresent' && value === 'false') {
                newData.language = ''
            }
            return {
                ...prev,
                data: newData
            }
        })
    }

    const handleCheckboxChange = (field, checked) => {
        setViewState((prev) => ({
            ...prev,
            data: {
                ...prev.data,
                projectSuitability: { ...prev.data.projectSuitability, [field]: checked }
            }
        }))
    }

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= (currentPagination?.totalPages || 1)) {
            setCurrentPage(newPage)
        }
    }

    // --- RENDER FUNCTIONS ---

    const renderSyncForm = () => {
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
                        <h1 className="text-2xl font-bold">{isViewOnly ? 'View Sync Request' : 'New Sync Request'}</h1>
                        <p className="text-muted-foreground">
                            {isViewOnly ? 'Viewing the details for your sync submission.' : 'Fill in the details for your sync submission.'}
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
                                    label="Label Name"
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
                                <div className="md:col-span-2">
                                    <SelectWithLabel
                                        id="theme"
                                        label="Theme"
                                        value={data.theme}
                                        disabled={isViewOnly}
                                        onValueChange={(value) => handleInputChange('theme', value)}
                                        options={themeOptions}
                                    />
                                </div>
                                <InputWithLabel
                                    id="tempoBPM"
                                    label="Tempo/BPM"
                                    placeholder={isViewOnly ? "" : "Tempo/BPM"}
                                    value={data.tempoBPM}
                                    disabled={isViewOnly}
                                    onChange={(e) => handleInputChange('tempoBPM', e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Rights Ownership Section */}
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
                                    <path d="M16 20h-6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v5" />
                                    <path d="M11 12H7" />
                                    <path d="M11 8H7" />
                                    <path d="m18 16 2 2 4-4" />
                                </svg>
                                Rights Ownership and Clearence
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <SelectWithLabel
                                    id="masterRightsOwner"
                                    label="Who owns the Master Rights?"
                                    value={data.masterRightsOwner}
                                    disabled={isViewOnly}
                                    onValueChange={(value) => handleInputChange('masterRightsOwner', value)}
                                    options={masterRightsOptions}
                                />
                                <SelectWithLabel
                                    id="publishingRightsOwner"
                                    label="Who owns the Publishing Rights?"
                                    value={data.publishingRightsOwner}
                                    disabled={isViewOnly}
                                    onValueChange={(value) => handleInputChange('publishingRightsOwner', value)}
                                    options={publishingRightsOptions}
                                />
                                <div className="md:col-span-2">
                                    <SelectWithLabel
                                        id="isFullyClearedForSync"
                                        label="Is the Track fully cleared for sync use?"
                                        value={data.isFullyClearedForSync}
                                        disabled={isViewOnly}
                                        onValueChange={(value) => handleInputChange('isFullyClearedForSync', value)}
                                        options={syncClearedOptions}
                                    />
                                </div>
                                <InputWithLabel
                                    id="proAffiliation"
                                    label="PRO affiliation (e.g. BMI, IPRS, ASCAP) (Optional)"
                                    placeholder={isViewOnly ? "" : "e.g. BMI, IPRS, ASCAP"}
                                    value={data.proAffiliation}
                                    disabled={isViewOnly}
                                    onChange={(e) => handleInputChange('proAffiliation', e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Project Suitability Section */}
                        <div>
                            <Label className="text-base font-semibold">Project Suitability</Label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-3">
                                {Object.keys(initialSyncFormData.projectSuitability).map((key) => {
                                    const label = key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
                                    return (
                                        <CheckboxWithLabel
                                            key={key}
                                            id={key}
                                            label={label}
                                            checked={data.projectSuitability[key]}
                                            disabled={isViewOnly}
                                            onCheckedChange={(checked) => handleCheckboxChange(key, checked)}
                                        />
                                    )
                                })}
                            </div>
                        </div>

                        {/* Track Link Section */}
                        <div>
                            <InputWithLabel
                                id="trackLinks"
                                label="Track Link (Any Store) Please share the most streamed platform link."
                                placeholder={isViewOnly ? "" : "Link"}
                                value={data.trackLinks}
                                disabled={isViewOnly}
                                onChange={(e) => handleInputChange('trackLinks', e.target.value)}
                            />
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
                {renderSyncForm()}
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background text-foreground p-6">
            {/* Main Page Header */}
            <div>
                <h1 className="text-2xl font-bold">Sync</h1>
                <p className="text-muted-foreground">Manage and submit requests for music synchronization</p>
            </div>

            {/* Content Header */}
            <div className="mt-8 flex flex-wrap justify-between items-center gap-4 mb-6">
                <div>
                    <h2 className="text-xl font-semibold">Sync Requests</h2>
                    <p className="text-muted-foreground text-sm">View, create, and manage your sync submissions below.</p>
                </div>
                <Button
                    onClick={handleNewRequest}
                    className="bg-[#711CE9] hover:bg-[#6f14ef] text-white flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    New Sync Request
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
                                        {syncRequests.map((request) => (
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
                                        {syncRequests.length === 0 && (
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
