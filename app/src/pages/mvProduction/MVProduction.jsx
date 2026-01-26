import { useState } from 'react'
import toast from 'react-hot-toast'
import { genreOptions, moodOptions, languageOptions, themeOptions } from '../../constants/options'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createMVProduction, deleteMVProduction, getMyMVProductions } from '@/services/api.services'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, Eye, Film, Trash2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import MVProductionView from './MVProductionView'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'

export default function MVProduction() {
    const [showForm, setShowForm] = useState(false)
    const [showViewOnly, setShowViewOnly] = useState(false)
    const [viewData, setViewData] = useState(null)
    const [currentStep, setCurrentStep] = useState(1)
    const [currentPage, setCurrentPage] = useState(1)
    const [deleteConfirm, setDeleteConfirm] = useState(null)
    const itemsPerPage = 10

    const queryClient = useQueryClient()

    // Fetch MV Productions
    const { data: productionsData, isLoading } = useQuery({
        queryKey: ['mvProductions', currentPage],
        queryFn: () => getMyMVProductions({ page: currentPage, limit: itemsPerPage }),
        enabled: !showForm && !showViewOnly,
        keepPreviousData: true
    })

    const mvRequests = productionsData?.data?.productions || []
    const pagination = productionsData?.data?.pagination

    // Form data state matching API structure
    const [formData, setFormData] = useState({
        // Step 1: Basic Details
        copyrightOwnerName: '',
        mobileNumber: '',
        emailOfCopyrightHolder: '',
        projectTitle: '',
        artistName: '',
        labelName: '',
        releaseTimeline: '',
        genres: '',
        mood: '',
        isPartOfAlbumOrEP: '',
        language: '',
        theme: '',
        locationPreference: {
            indoor_studio: false,
            outdoor_natural: false,
            urban_and_street: false,
            other: false
        },
        customLocation: '',

        // Step 2: Budget Request
        totalBudgetRequested: '',
        proposedOwnershipDilution: '',
        preProduction: '',
        shootDay: '',
        postProduction: '',
        miscellaneousContingency: '',
        willContributePersonalFunds: 'no',
        personalFundsAmount: '',
        revenueSharingModelProposed: '',

        // Step 3: Marketing & Distribution
        willBeReleasedViaMVDistribution: '',
        anyBrandOrMerchTieIns: 'no',
        brandOrMerchTieInsDescription: '',
        planToRunAdsOrInfluencerCampaigns: '',

        // Step 4: Legal
        confirmFullCreativeOwnership: '',
        agreeToCreditMVProduction: '',
        agreeToShareFinalAssets: '',
        requireNDAOrCustomAgreement: ''
    })

    // Mutation for creating MV Production
    const createMutation = useMutation({
        mutationFn: createMVProduction,
        onSuccess: (newData) => {
            toast.success('MV Production request submitted successfully!')

            // Update query data directly instead of invalidating
            queryClient.setQueryData(['mvProductions', 1], (oldData) => {
                if (!oldData) return oldData
                return {
                    ...oldData,
                    data: {
                        ...oldData.data,
                        productions: [newData.data, ...oldData.data.productions].slice(0, 10),
                        pagination: {
                            ...oldData.data.pagination,
                            totalCount: oldData.data.pagination.totalCount + 1
                        }
                    }
                }
            })

            setShowForm(false)
            setCurrentStep(1)
            resetForm()
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to submit MV Production request.')
        }
    })

    // Mutation for deleting MV Production
    const deleteMutation = useMutation({
        mutationFn: (id) => deleteMVProduction(id),
        onSuccess: (_, deletedId) => {
            toast.success('MV Production request deleted successfully!')

            // Update query data directly - remove the deleted item
            queryClient.setQueryData(['mvProductions', currentPage], (oldData) => {
                if (!oldData) return oldData
                return {
                    ...oldData,
                    data: {
                        ...oldData.data,
                        productions: oldData.data.productions.filter((item) => item._id !== deletedId),
                        pagination: {
                            ...oldData.data.pagination,
                            totalCount: oldData.data.pagination.totalCount - 1
                        }
                    }
                }
            })

            setDeleteConfirm(null)
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to delete MV Production request.')
        }
    })

    const handleInputChange = (field, value) => {
        const updatedFormData = { ...formData, [field]: value }

        // If the user selects "no", clear the personal funds amount
        if (field === 'willContributePersonalFunds' && value === 'no') {
            updatedFormData.personalFundsAmount = ''
        }

        // If the user selects "no" for brand or merch tie-ins, clear the description
        if (field === 'anyBrandOrMerchTieIns' && value === 'no') {
            updatedFormData.brandOrMerchTieInsDescription = ''
        }

        setFormData(updatedFormData)
    }

    const handleCheckboxChange = (section, field, checked) => {
        setFormData((prev) => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: checked
            }
        }))
    }

    const resetForm = () => {
        setFormData({
            copyrightOwnerName: '',
            mobileNumber: '',
            emailOfCopyrightHolder: '',
            projectTitle: '',
            artistName: '',
            labelName: '',
            releaseTimeline: '',
            genres: '',
            mood: '',
            isPartOfAlbumOrEP: '',
            language: '',
            theme: '',
            locationPreference: {
                indoor_studio: false,
                outdoor_natural: false,
                urban_and_street: false,
                other: false
            },
            customLocation: '',
            totalBudgetRequested: '',
            proposedOwnershipDilution: '',
            preProduction: '',
            shootDay: '',
            postProduction: '',
            miscellaneousContingency: '',
            willContributePersonalFunds: 'no',
            personalFundsAmount: '',
            revenueSharingModelProposed: '',
            willBeReleasedViaMVDistribution: '',
            anyBrandOrMerchTieIns: 'no',
            brandOrMerchTieInsDescription: '',
            planToRunAdsOrInfluencerCampaigns: '',
            confirmFullCreativeOwnership: '',
            agreeToCreditMVProduction: '',
            agreeToShareFinalAssets: '',
            requireNDAOrCustomAgreement: ''
        })
    }

    const handleView = (item) => {
        setViewData(item)
        setShowViewOnly(true)
    }

    const handleBackFromView = () => {
        setShowViewOnly(false)
        setViewData(null)
    }

    const handleNewRequest = () => {
        resetForm()
        setShowForm(true)
    }

    const handleBackToList = () => {
        setShowForm(false)
        setCurrentStep(1)
        resetForm()
    }

    const handleNextStep = () => {
        if (currentStep < 4) {
            setCurrentStep(currentStep + 1)
        }
    }

    const handlePreviousStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1)
        }
    }

    const handleFormSubmit = () => {
        // Convert form data to API format
        const selectedLocationPreferences = Object.keys(formData.locationPreference).filter((key) => formData.locationPreference[key])

        const payload = {
            ownerInfo: {
                copyrightOwnerName: formData.copyrightOwnerName,
                mobileNumber: formData.mobileNumber,
                emailOfCopyrightHolder: formData.emailOfCopyrightHolder
            },
            projectOverview: {
                projectTitle: formData.projectTitle,
                artistName: formData.artistName,
                labelName: formData.labelName,
                releaseTimeline: formData.releaseTimeline,
                genres: [formData.genres],
                mood: formData.mood,
                isPartOfAlbumOrEP: formData.isPartOfAlbumOrEP === 'yes',
                language: formData.language,
                theme: formData.theme,
                locationPreference: selectedLocationPreferences,
                ...(formData.locationPreference.other &&
                    formData.customLocation && {
                        customLocationDescription: formData.customLocation
                    })
            },
            budgetRequestAndOwnershipProposal: {
                totalBudgetRequested: parseFloat(formData.totalBudgetRequested) || 0,
                proposedOwnershipDilution: parseFloat(formData.proposedOwnershipDilution) || 0,
                breakdown: {
                    preProduction: parseFloat(formData.preProduction) || 0,
                    shootDay: parseFloat(formData.shootDay) || 0,
                    postProduction: parseFloat(formData.postProduction) || 0,
                    miscellaneousContingency: parseFloat(formData.miscellaneousContingency) || 0
                },
                willContributePersonalFunds: formData.willContributePersonalFunds === 'yes',
                personalFundsAmount: parseFloat(formData.personalFundsAmount) || 0,
                revenueSharingModelProposed: formData.revenueSharingModelProposed
            },
            marketingAndDistributionPlan: {
                willBeReleasedViaMVDistribution: formData.willBeReleasedViaMVDistribution === 'yes',
                anyBrandOrMerchTieIns: formData.anyBrandOrMerchTieIns === 'yes',
                brandOrMerchTieInsDescription: formData.brandOrMerchTieInsDescription || null,
                planToRunAdsOrInfluencerCampaigns: formData.planToRunAdsOrInfluencerCampaigns === 'yes'
            },
            legalAndOwnershipDeclaration: {
                confirmFullCreativeOwnership: formData.confirmFullCreativeOwnership === 'yes',
                agreeToCreditMVProduction: formData.agreeToCreditMVProduction === 'yes',
                agreeToShareFinalAssets: formData.agreeToShareFinalAssets === 'yes',
                requireNDAOrCustomAgreement: formData.requireNDAOrCustomAgreement === 'yes'
            }
        }

        createMutation.mutate(payload)
    }

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= (pagination?.totalPages || 1)) {
            setCurrentPage(newPage)
        }
    }

    const renderStepIndicator = () => (
        <div className="flex items-center justify-center md:space-x-4">
            {[
                { number: 1, label: 'Basic Details' },
                { number: 2, label: 'Budget Request' },
                { number: 3, label: 'Marketing' },
                { number: 4, label: 'Legal' }
            ].map((step) => (
                <div
                    key={step.number}
                    className="flex items-center">
                    <div
                        className={`w-6 h-6 lg:w-8 lg:h-8 rounded-full flex items-center justify-center shrink-0 text-xs lg:text-sm font-medium ${
                            currentStep >= step.number ? 'bg-[#711CE9] text-white' : 'bg-muted-foreground/10 text-muted-foreground'
                        }`}>
                        {step.number}
                    </div>
                    <span
                        className={`sm:ml-2 max-lg:text-center max-sm:hidden text-sm max-lg:text-xs ${
                            currentStep >= step.number ? 'text-foreground' : 'text-muted-foreground'
                        }`}>
                        {step.label}
                    </span>

                    {step.number < 4 && (
                        <div className={`w-4 lg:w-8 h-0.5 mx-1 lg:mx-4 ${currentStep > step.number ? 'bg-[#711CE9]' : 'bg-muted-foreground/20'}`} />
                    )}
                </div>
            ))}
        </div>
    )

    const renderStep1 = () => (
        <div className="space-y-8">
            {/* Owner Information */}
            <div>
                <h3 className="text-lg font-semibold mb-4">Owner Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="copyrightOwnerName">Copyright Owner Name</Label>
                        <Input
                            id="copyrightOwnerName"
                            placeholder="Artist"
                            value={formData.copyrightOwnerName}
                            onChange={(e) => handleInputChange('copyrightOwnerName', e.target.value)}
                            className="bg-background border-border"
                            disabled={showViewOnly}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="mobileNumber">Mobile No. Of the copyright Holder</Label>
                        <Input
                            id="mobileNumber"
                            placeholder="+91-9876543210"
                            value={formData.mobileNumber}
                            onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
                            className="bg-background border-border"
                            disabled={showViewOnly}
                        />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="emailOfCopyrightHolder">Email Of the copyright Holder</Label>
                        <Input
                            id="emailOfCopyrightHolder"
                            placeholder="artist@example.com"
                            value={formData.emailOfCopyrightHolder}
                            onChange={(e) => handleInputChange('emailOfCopyrightHolder', e.target.value)}
                            className="bg-background border-border"
                            disabled={showViewOnly}
                        />
                    </div>
                </div>
            </div>

            {/* Project Overview */}
            <div>
                <h3 className="text-lg font-semibold mb-4">Project Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="projectTitle">Project Title</Label>
                        <Input
                            id="projectTitle"
                            placeholder="My Music Video Project"
                            value={formData.projectTitle}
                            onChange={(e) => handleInputChange('projectTitle', e.target.value)}
                            className="bg-background border-border"
                            disabled={showViewOnly}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="artistName">Artist Name</Label>
                        <Input
                            id="artistName"
                            placeholder="Artist Name"
                            value={formData.artistName}
                            onChange={(e) => handleInputChange('artistName', e.target.value)}
                            className="bg-background border-border"
                            disabled={showViewOnly}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="labelName">Label name</Label>
                        <Input
                            id="labelName"
                            placeholder="Label Name"
                            value={formData.labelName}
                            onChange={(e) => handleInputChange('labelName', e.target.value)}
                            className="bg-background border-border"
                            disabled={showViewOnly}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="releaseTimeline">Release Timeline</Label>
                        <Input
                            id="releaseTimeline"
                            placeholder="Q1 2025"
                            value={formData.releaseTimeline}
                            onChange={(e) => handleInputChange('releaseTimeline', e.target.value)}
                            className="bg-background border-border"
                            disabled={showViewOnly}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="genres">Genre</Label>
                        <Select
                            value={formData.genres}
                            onValueChange={(value) => handleInputChange('genres', value)}
                            disabled={showViewOnly}>
                            <SelectTrigger className="bg-background border-border">
                                <SelectValue placeholder="Select genre" />
                            </SelectTrigger>
                            <SelectContent>
                                {genreOptions.map((option) => (
                                    <SelectItem
                                        key={option.value}
                                        value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="mood">Mood</Label>
                        <Select
                            value={formData.mood}
                            onValueChange={(value) => handleInputChange('mood', value)}
                            disabled={showViewOnly}>
                            <SelectTrigger className="bg-background border-border">
                                <SelectValue placeholder="Select mood" />
                            </SelectTrigger>
                            <SelectContent>
                                {moodOptions.map((option) => (
                                    <SelectItem
                                        key={option.value}
                                        value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="isPartOfAlbumOrEP">Is this part of an album or EP?</Label>
                        <Select
                            value={formData.isPartOfAlbumOrEP}
                            onValueChange={(value) => handleInputChange('isPartOfAlbumOrEP', value)}
                            disabled={showViewOnly}>
                            <SelectTrigger className="bg-background border-border">
                                <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="yes">Yes</SelectItem>
                                <SelectItem value="no">No</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="language">Language</Label>
                        <Select
                            value={formData.language}
                            onValueChange={(value) => handleInputChange('language', value)}
                            disabled={showViewOnly}>
                            <SelectTrigger className="bg-background border-border">
                                <SelectValue placeholder="Select language" />
                            </SelectTrigger>
                            <SelectContent>
                                {languageOptions.map((option) => (
                                    <SelectItem
                                        key={option.value}
                                        value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="theme">Theme</Label>
                        <Select
                            value={formData.theme}
                            onValueChange={(value) => handleInputChange('theme', value)}
                            disabled={showViewOnly}>
                            <SelectTrigger className="bg-background border-border">
                                <SelectValue placeholder="Select theme" />
                            </SelectTrigger>
                            <SelectContent>
                                {themeOptions.map((option) => (
                                    <SelectItem
                                        key={option.value}
                                        value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Location Preference Tick Boxes */}
                <div className="mt-6">
                    <Label className="text-sm font-medium">Location Preference</Label>
                    <div className="flex items-center space-x-6 mt-3">
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="indoor_studio"
                                checked={formData.locationPreference.indoor_studio}
                                onCheckedChange={(checked) => handleCheckboxChange('locationPreference', 'indoor_studio', checked)}
                                disabled={showViewOnly}
                            />
                            <label
                                htmlFor="indoor_studio"
                                className="text-sm">
                                Indoor Studio
                            </label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="outdoor_natural"
                                checked={formData.locationPreference.outdoor_natural}
                                onCheckedChange={(checked) => handleCheckboxChange('locationPreference', 'outdoor_natural', checked)}
                                disabled={showViewOnly}
                            />
                            <label
                                htmlFor="outdoor_natural"
                                className="text-sm">
                                Outdoor / Natural
                            </label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="urban_and_street"
                                checked={formData.locationPreference.urban_and_street}
                                onCheckedChange={(checked) => handleCheckboxChange('locationPreference', 'urban_and_street', checked)}
                                disabled={showViewOnly}
                            />
                            <label
                                htmlFor="urban_and_street"
                                className="text-sm">
                                Urban / Street
                            </label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="other"
                                checked={formData.locationPreference.other}
                                onCheckedChange={(checked) => handleCheckboxChange('locationPreference', 'other', checked)}
                                disabled={showViewOnly}
                            />
                            <label
                                htmlFor="other"
                                className="text-sm">
                                Other
                            </label>
                        </div>
                    </div>
                    {formData.locationPreference.other && (
                        <div className="mt-3">
                            <Input
                                id="customLocation"
                                placeholder="Specify custom location..."
                                value={formData.customLocation}
                                onChange={(e) => handleInputChange('customLocation', e.target.value)}
                                disabled={showViewOnly}
                                className="bg-background border-border"
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )

    const renderStep2 = () => (
        <div className="space-y-8">
            <h3 className="text-lg font-semibold">Budget Request & Ownership Proposal</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="totalBudgetRequested">Total Budget Requested (INR)</Label>
                    <Input
                        id="totalBudgetRequested"
                        placeholder="500000"
                        type="number"
                        value={formData.totalBudgetRequested}
                        onChange={(e) => handleInputChange('totalBudgetRequested', e.target.value)}
                        className="bg-background border-border"
                        disabled={showViewOnly}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="proposedOwnershipDilution">Proposed Ownership Dilution (% of video IP)</Label>
                    <Input
                        id="proposedOwnershipDilution"
                        placeholder="20"
                        type="number"
                        value={formData.proposedOwnershipDilution}
                        onChange={(e) => handleInputChange('proposedOwnershipDilution', e.target.value)}
                        className="bg-background border-border"
                        disabled={showViewOnly}
                    />
                </div>
            </div>

            <div>
                <Label className="text-sm font-medium">Breakdown (Estimated)</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-3">
                    <div className="space-y-2">
                        <Label htmlFor="preProduction">Pre-Production:</Label>
                        <Input
                            id="preProduction"
                            placeholder="100000"
                            type="number"
                            value={formData.preProduction}
                            onChange={(e) => handleInputChange('preProduction', e.target.value)}
                            className="bg-background border-border"
                            disabled={showViewOnly}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="shootDay">Shoot Day:</Label>
                        <Input
                            id="shootDay"
                            placeholder="250000"
                            type="number"
                            value={formData.shootDay}
                            onChange={(e) => handleInputChange('shootDay', e.target.value)}
                            className="bg-background border-border"
                            disabled={showViewOnly}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="postProduction">Post-Production:</Label>
                        <Input
                            id="postProduction"
                            placeholder="120000"
                            type="number"
                            value={formData.postProduction}
                            onChange={(e) => handleInputChange('postProduction', e.target.value)}
                            className="bg-background border-border"
                            disabled={showViewOnly}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="miscellaneousContingency">Miscellaneous / Contingency:</Label>
                        <Input
                            id="miscellaneousContingency"
                            placeholder="30000"
                            type="number"
                            value={formData.miscellaneousContingency}
                            onChange={(e) => handleInputChange('miscellaneousContingency', e.target.value)}
                            className="bg-background border-border"
                            disabled={showViewOnly}
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="willContributePersonalFunds">Will you contribute any personal funds?</Label>
                    <Select
                        value={formData.willContributePersonalFunds}
                        onValueChange={(value) => handleInputChange('willContributePersonalFunds', value)}
                        disabled={showViewOnly}>
                        <SelectTrigger className="bg-background border-border">
                            <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="yes">Yes</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                {formData.willContributePersonalFunds === 'yes' && (
                    <div className="space-y-2">
                        <Label htmlFor="personalFundsAmount">If yes, amount</Label>
                        <Input
                            id="personalFundsAmount"
                            placeholder="100000"
                            type="number"
                            value={formData.personalFundsAmount}
                            onChange={(e) => handleInputChange('personalFundsAmount', e.target.value)}
                            className="bg-background border-border"
                            disabled={showViewOnly}
                        />
                    </div>
                )}
            </div>

            <div className="space-y-2">
                <Label className="text-sm font-medium">Revenue Sharing Model Proposed</Label>
                <div className="flex max-md:flex-col md:gap-4 md:items-center space-y-2 mt-2">
                    {[
                        { label: 'Flat Buyout', value: 'flat_buyout' },
                        { label: 'Revenue Split', value: 'revenue_split' },
                        { label: 'Hybrid (Buyout + Royalties)', value: 'hybrid_buyout_royalties' }
                    ].map((option) => (
                        <div
                            key={option.value}
                            className="flex items-start space-x-2">
                            <Checkbox
                                id={`revenueSharingModel-${option.value}`}
                                checked={formData.revenueSharingModelProposed === option.value}
                                onCheckedChange={(checked) => {
                                    if (checked) {
                                        handleInputChange('revenueSharingModelProposed', option.value)
                                    } else {
                                        // Allow unchecking if it's the currently selected one,
                                        // but since we want single select, it means if unchecked
                                        // and it's the current, then clear the selection.
                                        // This creates a radio-like behavior.
                                        if (formData.revenueSharingModelProposed === option.value) {
                                            handleInputChange('revenueSharingModelProposed', '')
                                        }
                                    }
                                }}
                                disabled={showViewOnly}
                            />
                            <label
                                htmlFor={`revenueSharingModel-${option.value}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                {option.label}
                            </label>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )

    const renderStep3 = () => (
        <div className="space-y-8">
            <h3 className="text-lg font-semibold">Marketing & Distribution Plan</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="willBeReleasedViaMVDistribution">Will this be released via MV Distribution?</Label>
                    <Select
                        value={formData.willBeReleasedViaMVDistribution}
                        onValueChange={(value) => handleInputChange('willBeReleasedViaMVDistribution', value)}
                        disabled={showViewOnly}>
                        <SelectTrigger className="bg-background border-border">
                            <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="yes">Yes</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="planToRunAdsOrInfluencerCampaigns">Do you plan to run ads or influencer campaigns?</Label>
                    <Select
                        value={formData.planToRunAdsOrInfluencerCampaigns}
                        onValueChange={(value) => handleInputChange('planToRunAdsOrInfluencerCampaigns', value)}
                        disabled={showViewOnly}>
                        <SelectTrigger className="bg-background border-border">
                            <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="yes">Yes</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="anyBrandOrMerchTieIns">Any brand or merch tie-ins?</Label>
                    <Select
                        value={formData.anyBrandOrMerchTieIns}
                        onValueChange={(value) => handleInputChange('anyBrandOrMerchTieIns', value)}
                        disabled={showViewOnly}>
                        <SelectTrigger className="bg-background border-border">
                            <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="yes">Yes</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                {formData.anyBrandOrMerchTieIns === 'yes' && (
                    <div className="space-y-2">
                        <Label htmlFor="brandOrMerchTieInsDescription">If yes, describe</Label>
                        <Input
                            id="brandOrMerchTieInsDescription"
                            placeholder="Description"
                            value={formData.brandOrMerchTieInsDescription}
                            onChange={(e) => handleInputChange('brandOrMerchTieInsDescription', e.target.value)}
                            className="bg-background border-border"
                            disabled={showViewOnly}
                        />
                    </div>
                )}
            </div>
        </div>
    )

    const renderStep4 = () => (
        <div className="space-y-8">
            <h3 className="text-lg font-semibold">Legal & Ownership Declaration</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="confirmFullCreativeOwnership">Do you confirm that you retain full creative ownership of the project?</Label>
                    <Select
                        value={formData.confirmFullCreativeOwnership}
                        onValueChange={(value) => handleInputChange('confirmFullCreativeOwnership', value)}
                        disabled={showViewOnly}>
                        <SelectTrigger className="bg-background border-border">
                            <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="yes">Yes</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="agreeToCreditMVProduction">Do you agree to credit MV Production for budget support?</Label>
                    <Select
                        value={formData.agreeToCreditMVProduction}
                        onValueChange={(value) => handleInputChange('agreeToCreditMVProduction', value)}
                        disabled={showViewOnly}>
                        <SelectTrigger className="bg-background border-border">
                            <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="yes">Yes</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="agreeToShareFinalAssets">Do you agree to share final assets with MV for portfolio and showcase use?</Label>
                    <Select
                        value={formData.agreeToShareFinalAssets}
                        onValueChange={(value) => handleInputChange('agreeToShareFinalAssets', value)}
                        disabled={showViewOnly}>
                        <SelectTrigger className="bg-background border-border">
                            <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="yes">Yes</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="requireNDAOrCustomAgreement">Do you require an NDA or custom agreement?</Label>
                    <Select
                        value={formData.requireNDAOrCustomAgreement}
                        onValueChange={(value) => handleInputChange('requireNDAOrCustomAgreement', value)}
                        disabled={showViewOnly}>
                        <SelectTrigger className="bg-background border-border">
                            <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="yes">Yes</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    )

    const handleDelete = (id) => {
        setDeleteConfirm(id)
    }

    const confirmDelete = () => {
        console.log('Delete confirm - deleteConfirm ID:', deleteConfirm)
        if (deleteConfirm) {
            console.log('Calling deleteMutation with ID:', deleteConfirm)
            deleteMutation.mutate(deleteConfirm)
        }
    }

    const cancelDelete = () => {
        setDeleteConfirm(null)
    }

    if (showViewOnly && viewData) {
        return (
            <MVProductionView
                request={viewData}
                onBack={handleBackFromView}
            />
        )
    }

    if (showForm) {
        return (
            <div className="min-h-screen bg-background text-foreground p-6">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={handleBackToList}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">New MV Production Request</h1>
                        <p className="text-muted-foreground">Apply for music and video production funding to enhance your creative projects</p>
                    </div>
                </div>

                <Card className="max-w-6xl mx-auto">
                    <CardContent className="p-8">
                        {currentStep === 1 && renderStep1()}
                        {currentStep === 2 && renderStep2()}
                        {currentStep === 3 && renderStep3()}
                        {currentStep === 4 && renderStep4()}

                        {/* Navigation */}
                        <div className="flex justify-between items-center flex-wrap mt-8 pt-6 space-y-5 border-t border-border">
                            {renderStepIndicator()}
                            <div className="flex justify-end w-full flex-wrap items-center gap-4">
                                <Button
                                    variant="outline"
                                    onClick={handlePreviousStep}
                                    disabled={currentStep === 1}
                                    className="flex items-center gap-2">
                                    <ArrowLeft className="h-4 w-4" />
                                    Previous
                                </Button>

                                {currentStep < 4 ? (
                                    <Button
                                        onClick={handleNextStep}
                                        className="bg-[#711CE9] hover:bg-[#6f14ef] text-white flex items-center gap-2">
                                        Next Step
                                        <ArrowRight className="h-4 w-4" />
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={handleFormSubmit}
                                        disabled={createMutation.isLoading}
                                        className="bg-[#711CE9] hover:bg-[#6f14ef] text-white flex items-center gap-2">
                                        {createMutation.isLoading ? 'Submitting...' : 'Submit Request'}
                                        <ArrowRight className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background text-foreground p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold">MV Production</h1>
                    <p className="text-muted-foreground">Apply for music and video production funding to enhance your creative projects</p>
                </div>
                <Button
                    onClick={handleNewRequest}
                    className="bg-[#711CE9] hover:bg-[#6f14ef] text-white">
                    + New Request
                </Button>
            </div>

            {/* Main Content */}
            <Card>
                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        </div>
                    ) : (
                        <>
                            {mvRequests.length > 0 ? (
                                <>
                                    <div className="overflow-x-auto custom-scroll">
                                        <table className="w-full text-sm">
                                            <thead className="text-left text-muted-foreground border-b border-border">
                                                <tr>
                                                    <th className="p-4">Project Title</th>
                                                    <th className="p-4">Artist Name</th>
                                                    <th className="p-4">Label Name</th>
                                                    <th className="p-4">Budget Requested</th>
                                                    <th className="p-4">Status</th>
                                                    <th className="p-4">Submit Date</th>
                                                    <th className="p-4">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {mvRequests.map((request) => (
                                                    <tr
                                                        key={request._id}
                                                        className="border-b border-border hover:bg-muted/50">
                                                        <td className="p-4">{request.projectOverview.projectTitle}</td>
                                                        <td className="p-4">{request.projectOverview.artistName}</td>
                                                        <td className="p-4">{request.projectOverview.labelName}</td>
                                                        <td className="p-4">
                                                            ₹{request.budgetRequestAndOwnershipProposal.totalBudgetRequested.toLocaleString()}
                                                        </td>
                                                        <td className="p-4">
                                                            <span className="px-2 py-1 rounded text-xs bg-yellow-500/20 text-yellow-600 dark:bg-yellow-500/10 dark:text-yellow-400 capitalize">
                                                                {request.status}
                                                            </span>
                                                        </td>
                                                        <td className="p-4">{new Date(request.createdAt).toLocaleDateString()}</td>
                                                        <td className="p-4">
                                                            <div className="flex items-center gap-2">
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => handleView(request)}
                                                                    className="flex items-center gap-2">
                                                                    <Eye className="h-4 w-4" />
                                                                    View
                                                                </Button>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => handleDelete(request._id)}
                                                                    className="flex items-center gap-2 text-destructive hover:text-destructive">
                                                                    <Trash2 className="h-4 w-4" />
                                                                    Delete
                                                                </Button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Pagination */}
                                    {pagination && pagination.totalPages > 1 && (
                                        <div className="flex items-center justify-between mt-6 p-4 border-t">
                                            <div className="text-sm text-muted-foreground">
                                                Showing {(pagination.currentPage - 1) * itemsPerPage + 1} to{' '}
                                                {Math.min(pagination.currentPage * itemsPerPage, pagination.totalCount)} of {pagination.totalCount}{' '}
                                                requests
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
                                                    disabled={currentPage === pagination.totalPages}>
                                                    Next
                                                    <ChevronRight className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="text-center py-16">
                                    <div className="max-w-md mx-auto">
                                        <div className="mb-6">
                                            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                                                <Film className="h-8 w-8 text-muted-foreground" />
                                            </div>
                                            <h3 className="text-lg font-semibold mb-2">No MV Production Requests</h3>
                                            <p className="text-muted-foreground">
                                                You haven't submitted any music video production requests yet. Create your first request to get
                                                started with professional video production funding.
                                            </p>
                                        </div>
                                        <Button
                                            onClick={handleNewRequest}
                                            className="bg-[#711CE9] hover:bg-[#6f14ef] text-white">
                                            + Create Your First Request
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>

            {/* Delete Confirmation Dialog */}
            {deleteConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <Card className="max-w-sm w-full">
                        <CardHeader>
                            <CardTitle className="text-lg">Delete Request</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-muted-foreground">
                                Are you sure you want to delete this MV Production request? This action cannot be undone.
                            </p>
                            <div className="flex gap-3 justify-end">
                                <Button
                                    variant="outline"
                                    onClick={cancelDelete}
                                    disabled={deleteMutation.isLoading}>
                                    Cancel
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={confirmDelete}
                                    disabled={deleteMutation.isPending}
                                    className="flex items-center gap-2">
                                    {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    )
}
