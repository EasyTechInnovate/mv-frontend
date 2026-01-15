import { servicesAxiosInstance } from "./config"

export const getServerHealth = async () => {
    const response = await servicesAxiosInstance.get('/v1/health')
    return response.data
}

// Release APIs
export const createRelease = async (trackType) => {
    const response = await servicesAxiosInstance.post('/v1/releases/create', {
        trackType
    })
    return response.data
}

export const updateReleaseStep1 = async (releaseId, data) => {
    const response = await servicesAxiosInstance.patch(`/v1/releases/${releaseId}/step1`, data)
    return response.data
}

export const updateReleaseStep2 = async (releaseId, data) => {
    const response = await servicesAxiosInstance.patch(`/v1/releases/${releaseId}/step2`, data)
    return response.data
}

export const updateReleaseStep3 = async (releaseId, data) => {
    const response = await servicesAxiosInstance.patch(`/v1/releases/${releaseId}/step3`, data)
    return response.data
}

export const submitRelease = async (releaseId) => {
    const response = await servicesAxiosInstance.post(`/v1/releases/${releaseId}/submit`)
    return response.data
}

// Advanced Release APIs
export const createAdvancedRelease = async (releaseType) => {
    const response = await servicesAxiosInstance.post('/v1/advance-releases/create', {
        releaseType
    })
    return response.data
}

export const updateAdvancedReleaseStep1 = async (releaseId, data) => {
    const response = await servicesAxiosInstance.patch(`/v1/advance-releases/${releaseId}/step1`, data)
    return response.data
}

export const updateAdvancedReleaseStep2 = async (releaseId, data) => {
    const response = await servicesAxiosInstance.patch(`/v1/advance-releases/${releaseId}/step2`, data)
    return response.data
}

export const updateAdvancedReleaseStep3 = async (releaseId, data) => {
    const response = await servicesAxiosInstance.patch(`/v1/advance-releases/${releaseId}/step3`, data)
    return response.data
}

export const submitAdvancedRelease = async (releaseId) => {
    const response = await servicesAxiosInstance.post(`/v1/advance-releases/${releaseId}/submit`)
    return response.data
}

// Get Basic Releases
export const getBasicReleases = async (params) => {
    const { page = 1, limit = 10, status, search, sortOrder = 'desc' } = params
    const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sortOrder
    })

    if (status) queryParams.append('status', status)
    if (search) queryParams.append('search', search)

    const response = await servicesAxiosInstance.get(`/v1/releases/my-releases?${queryParams.toString()}`)
    return response.data
}

// Get Basic Release Details
export const getBasicReleaseDetails = async (releaseId) => {
    const response = await servicesAxiosInstance.get(`/v1/releases/${releaseId}`)
    return response.data
}

// Get Advanced Releases
export const getAdvancedReleases = async (params) => {
    const { page = 1, limit = 10, status, search, sortOrder = 'desc' } = params
    const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sortOrder
    })

    if (status) queryParams.append('status', status)
    if (search) queryParams.append('search', search)

    const response = await servicesAxiosInstance.get(`/v1/advance-releases/my-releases?${queryParams.toString()}`)
    return response.data
}

// Get Advanced Release Details
export const getAdvancedReleaseDetails = async (releaseId) => {
    const response = await servicesAxiosInstance.get(`/v1/advance-releases/${releaseId}`)
    return response.data
}

// Support Ticket APIs
export const createSupportTicket = async (ticketData) => {
    const response = await servicesAxiosInstance.post('/v1/support-tickets', ticketData)
    return response.data
}

export const getMyTickets = async (params) => {
    const { page = 1, limit = 10, status } = params
    const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
    })

    if (status) queryParams.append('status', status)

    const response = await servicesAxiosInstance.get(`/v1/support-tickets/my-tickets?${queryParams.toString()}`)
    return response.data
}

export const getMyTicketStats = async () => {
    const response = await servicesAxiosInstance.get('/v1/support-tickets/my-stats')
    return response.data
}

export const getTicketById = async (ticketId) => {
    const response = await servicesAxiosInstance.get(`/v1/support-tickets/${ticketId}`)
    return response.data
}

export const addTicketResponse = async ({ ticketId, responseData }) => {
    const response = await servicesAxiosInstance.post(`/v1/support-tickets/${ticketId}/response`, responseData)
    return response.data
}

export const addTicketRating = async ({ ticketId, ratingData }) => {
    const response = await servicesAxiosInstance.post(`/v1/support-tickets/${ticketId}/rating`, ratingData)
    return response.data
}

// FAQ APIs
export const getFaqs = async () => {
    const response = await servicesAxiosInstance.get('/v1/faqs')
    return response.data
}

// MCN APIs
export const submitMcnRequest = async (data) => {
    const response = await servicesAxiosInstance.post('/v1/mcn/request', data)
    return response.data
}

export const getMyMcnRequests = async (params) => {
    const { page = 1, limit = 10 } = params
    const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
    })

    const response = await servicesAxiosInstance.get(`/v1/mcn/my-requests?${queryParams.toString()}`)
    return response.data
}

export const getMyMcnChannels = async (params) => {
    const { page = 1, limit = 10 } = params
    const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
    })

    const response = await servicesAxiosInstance.get(`/v1/mcn/my-channels?${queryParams.toString()}`)
    return response.data
}

export const requestMcnRemoval = async (requestId) => {
    const response = await servicesAxiosInstance.post(`/v1/mcn/my-requests/${requestId}/request-removal`)
    return response.data
}


// Fan Links APIs
export const getMyFanLinks = async (params) => {
    const { page = 1, limit = 10 } = params
    const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
    })

    const response = await servicesAxiosInstance.get(`/v1/fan-links/my-links?${queryParams.toString()}`)
    return response.data
}

export const checkFanLinkAvailability = async (customUrl) => {
    const response = await servicesAxiosInstance.get(`/v1/fan-links/check-availability/${customUrl}`)
    return response.data
}

export const createFanLink = async (data) => {
    const response = await servicesAxiosInstance.post('/v1/fan-links/create', data)
    return response.data
}

export const updateFanLink = async (fanLinkId, data) => {
    const response = await servicesAxiosInstance.put(`/v1/fan-links/my-links/${fanLinkId}`, data)
    return response.data
}

// Marketing APIs

// Sync Submissions
export const getMySyncSubmissions = async (params) => {
    const { page = 1, limit = 10 } = params
    const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
    })

    const response = await servicesAxiosInstance.get(`/v1/marketing/sync/my-submissions?${queryParams.toString()}`)
    return response.data
}

export const submitSyncRequest = async (data) => {
    const response = await servicesAxiosInstance.post('/v1/marketing/sync/submit', data)
    return response.data
}

// Playlist Pitching Submissions
export const getMyPlaylistPitchingSubmissions = async (params) => {
    const { page = 1, limit = 10 } = params
    const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
    })

    const response = await servicesAxiosInstance.get(`/v1/marketing/playlist-pitching/my-submissions?${queryParams.toString()}`)
    return response.data
}

export const submitPlaylistPitchingRequest = async (data) => {
    const response = await servicesAxiosInstance.post('/v1/marketing/playlist-pitching/submit', data)
    return response.data
}

// MV Production APIs
export const createMVProduction = async (data) => {
    const response = await servicesAxiosInstance.post('/v1/mv-production', data)
    return response.data
}

export const getMyMVProductions = async (params) => {
    const { page = 1, limit = 10 } = params
    const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
    })

    const response = await servicesAxiosInstance.get(`/v1/mv-production?${queryParams.toString()}`)
    return response.data
}

export const deleteMVProduction = async (productionId) => {
    console.log('API call - Deleting production:', productionId)
    const response = await servicesAxiosInstance.delete(`/v1/mv-production/${productionId}`)
    return response.data
}

// Subscription APIs
export const getMySubscription = async () => {
    const response = await servicesAxiosInstance.get('/v1/subscription/my-subscription')
    return response.data
}

export const getAllSubscriptionPlans = async () => {
    const response = await servicesAxiosInstance.get('/v1/subscription/plans')
    return response.data
}

// Company Settings APIs
export const getContactInfo = async () => {
    const response = await servicesAxiosInstance.get('/v1/company-settings/contact')
    return response.data
}

// Analytics APIs
export const getAnalyticsDashboard = async (params) => {
    const { timeframe = 'last_6_months', groupBy = 'day', topTracksLimit = 10, countriesLimit = 20 } = params
    const queryParams = new URLSearchParams({
        timeframe,
        groupBy,
        topTracksLimit: topTracksLimit.toString(),
        countriesLimit: countriesLimit.toString()
    })

    const response = await servicesAxiosInstance.get(`/v1/reports/analytics/dashboard?${queryParams.toString()}`)
    return response.data
}

// Royalty APIs
export const getRoyaltyDashboard = async (params) => {
    const { timeframe = 'last_year' } = params
    const queryParams = new URLSearchParams({ timeframe })

    const response = await servicesAxiosInstance.get(`/v1/reports/royalty/dashboard?${queryParams.toString()}`)
    return response.data
}

// Merch Store APIs
export const createMerchStore = async (data) => {
    const response = await servicesAxiosInstance.post('/v1/merch-store', data)
    return response.data
}

export const getMerchStores = async (params) => {
    const { page = 1, limit = 10 } = params
    const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
    })

    const response = await servicesAxiosInstance.get(`/v1/merch-store?${queryParams.toString()}`)
    return response.data
}

export const getApprovedDesigns = async (params) => {
    const { page = 1, limit = 10 } = params
    const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
    })

    const response = await servicesAxiosInstance.get(`/v1/merch-store/approved-designs?${queryParams.toString()}`)
    return response.data
}

export const submitMerchDesigns = async (storeId, designs) => {
    const response = await servicesAxiosInstance.post(`/v1/merch-store/${storeId}/designs`, { designs })
    return response.data
}

export const deleteMerchStore = async (storeId) => {
    const response = await servicesAxiosInstance.delete(`/v1/merch-store/${storeId}`)
    return response.data
}

// Wallet APIs
export const getMyWallet = async () => {
    const response = await servicesAxiosInstance.get('/v1/wallet/my-wallet');
    return response.data;
};


// Payout APIs
export const createPayoutRequest = async (data) => {
    const response = await servicesAxiosInstance.post('/v1/payout-requests/create', data);
    return response.data;
};

export const getMyPayoutRequests = async (params) => {
    const response = await servicesAxiosInstance.get('/v1/payout-requests/my-requests', { params });
    return response.data;
};

export const cancelPayoutRequest = async (requestId, data) => {
    const response = await servicesAxiosInstance.patch(`/v1/payout-requests/${requestId}/cancel`, data);
    return response.data;
};