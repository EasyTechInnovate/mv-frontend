import axios from "axios";

const axiosClient = axios.create({
  // baseURL: import.meta.env.VITE_API_URL,
  baseURL: "https://mv.easytechinnovate.site",
});


axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});




// ---------------------- Health ----------------------
const getHealth = () => axiosClient.get("/v1/health");

// ---------------------- Auth ----------------------
const login = (data) => axiosClient.post("/v1/auth/login", data);




// ---------------------- Subscription Plans ----------------------

const getSubscriptionPlans = (includeInactive = true) =>
  axiosClient.get(`/v1/admin/plans?includeInactive=${includeInactive}`);

const createSubscriptionPlan = async (payload) => {
  try {
    console.log("🌐 [API] Creating plan with payload:", payload);
    const response = await axiosClient.post("/v1/admin/plans", payload);
    console.log("✅ [API] Plan created:", response.data);
    return response;
  } catch (error) {
    console.error(
      "❌ [API] Error creating plan:",
      error.response?.data || error.message
    );
    throw error;
  }
};

const getPlanDetails = (planId) => axiosClient.get(`/v1/plans/${planId}`);

const updatePlan = (planId, updatedData) =>
  axiosClient.put(`/v1/admin/plans/${planId}`, updatedData);

const deletePlan = (planId) => axiosClient.delete(`/v1/admin/plans/${planId}`);

const activatePlan = (planId) => axiosClient.patch(`/v1/admin/plans/${planId}/activate`);

const deactivatePlan = (planId) =>
  axiosClient.patch(`/v1/admin/plans/${planId}/deactivate`);




// ---------------------- FAQs ----------------------

const getFaqs = (page = 1, limit = 10) =>
  axiosClient.get(`/v1/admin/faqs?page=${page}&limit=${limit}`);

const createFaq = (payload) => axiosClient.post("/v1/admin/faqs", payload);

const deleteFaq = (faqId) => axiosClient.delete(`/v1/admin/faqs/${faqId}`);

const updateFaq = (id, data) => axiosClient.put(`/v1/admin/faqs/${id}`, data);

const getFaqById = (faqId) => axiosClient.get(`/v1/admin/faqs/${faqId}`);





// ---------------------- Marketing: Sync Submissions ----------------------


const getPendingSyncSubmissions = () =>
  axiosClient.get("/v1/marketing/admin/sync/submissions/pending");

const getAllSyncSubmissions = (page = 1, limit = 10) =>
  axiosClient.get(`/v1/marketing/admin/sync/submissions?page=${page}&limit=${limit}`);

const reviewSyncSubmission = (submissionId, data) =>
  axiosClient.post(`/v1/marketing/admin/sync/submissions/${submissionId}/review`, data);




// ---------------------- Marketing: Playlist Pitching ----------------------


const getPlayPitching = (store = "Spotify", page = 1, limit = 10) =>
  axiosClient.get(
    `/v1/marketing/admin/playlist-pitching/submissions/store/${store}?page=${page}&limit=${limit}`
  );

const reviewPlayPitching = (submissionId, data) =>
  axiosClient.post(
    `/v1/marketing/admin/playlist-pitching/submissions/${submissionId}/review`,
    data
  );




// ---------------------- Trending Labels (Admin) ----------------------


const getAllTrendingLabels = (page = 1, limit = 10) =>
  axiosClient.get(`/v1/admin/trending-labels?page=${page}&limit=${limit}`);


const getTrendingLabel = (trendingLabelId) =>
  axiosClient.get(`/v1/admin/trending-labels/${trendingLabelId}`);

const updateTrendingLabel = (trendingLabelId, payload) =>
  axiosClient.put(`/v1/admin/trending-labels/${trendingLabelId}`, payload);

const updateTrendingLabelStats = (trendingLabelId, payload) =>
  axiosClient.patch(
    `/v1/admin/trending-labels/${trendingLabelId}/statistics`,
    payload
  );

const updateTrendingLabelStatus = (trendingLabelId, payload) =>
  axiosClient.patch(
    `/v1/admin/trending-labels/${trendingLabelId}/status`,
    payload
  );

const deleteTrendingLabel = (trendingLabelId) =>
  axiosClient.delete(`/v1/admin/trending-labels/${trendingLabelId}`);

const createTrendingLabel = (payload) =>
  axiosClient.post(`/v1/admin/trending-labels`, payload);




// ---------------------- Testimonials (Admin) ----------------------

const getAllTestimonials = (page = 1, limit = 10) =>
  axiosClient.get(`/v1/admin/testimonials?page=${page}&limit=${limit}`);

const createTestimonial = (payload) =>
  axiosClient.post(`/v1/admin/testimonials`, payload);

const getTestimonialById = (testimonialId) =>
  axiosClient.get(`/v1/admin/testimonials/${testimonialId}`);

const updateTestimonial = (testimonialId, payload) =>
  axiosClient.put(`/v1/admin/testimonials/${testimonialId}`, payload);

const updateTestimonialStatus = (testimonialId, payload) =>
  axiosClient.patch(`/v1/admin/testimonials/${testimonialId}/status`, payload);

const deleteTestimonial = (testimonialId) =>
  axiosClient.delete(`/v1/admin/testimonials/${testimonialId}`);



// ---------------------- MCN Admin ----------------------


const getMcnRequests = (page = 1, limit = 10) =>
  axiosClient.get(`/v1/mcn/admin/requests?page=${page}&limit=${limit}`);

const getPendingMcnRequests = () =>
  axiosClient.get("/v1/mcn/admin/requests/pending");

const reviewMcnRequest = (requestId, data) =>
  axiosClient.post(`/v1/mcn/admin/requests/${requestId}/review`, data);

const createMcnChannel = (requestId, data) =>
  axiosClient.post(`/v1/mcn/admin/requests/${requestId}/create-channel`, data);

const getMcnChannels = (page = 1, limit = 10) =>
  axiosClient.get(`/v1/mcn/admin/channels?page=${page}&limit=${limit}`);

const updateMcnChannelStatus = (channelId, data) =>
  axiosClient.patch(`/v1/mcn/admin/channels/${channelId}/status`, data);

const getMcnStats = () => axiosClient.get("/v1/mcn/admin/stats");




// ---------------------- Team Members (Admin) ----------------------

const createTeamMember = (payload) =>
  axiosClient.post(`/v1/admin/team-members`, payload);

const getAllTeamMembers = (page = 1, limit = 10) =>
  axiosClient.get(`/v1/admin/team-members?page=${page}&limit=${limit}`);

const getTeamMemberById = (teamMemberId) =>
  axiosClient.get(`/v1/admin/team-members/${teamMemberId}`);

const updateTeamMember = (teamMemberId, payload) =>
  axiosClient.put(`/v1/admin/team-members/${teamMemberId}`, payload);

const updateTeamMemberStatus = (teamMemberId, payload) =>
  axiosClient.patch(`/v1/admin/team-members/${teamMemberId}/status`, payload);

const deleteTeamMember = (teamMemberId) =>
  axiosClient.delete(`/v1/admin/team-members/${teamMemberId}`);

const resendTeamInvitation = (teamMemberId) =>
  axiosClient.post(`/v1/admin/team-members/${teamMemberId}/resend-invitation`);

const getTeamStatistics = () =>
  axiosClient.get(`/v1/admin/team-members/statistics`);




// ---------------------- Sublabels (Admin) ----------------------


const createSubLabel = (payload) => axiosClient.post(`/v1/admin/sublabels`, payload);

const getAllSubLabels = (page = 1, limit = 10) =>
  axiosClient.get(`/v1/admin/sublabels?page=${page}&limit=${limit}`);

const getSubLabelById = (sublabelId) => axiosClient.get(`/v1/admin/sublabels/${sublabelId}`);

const updateSubLabel = (sublabelId, payload) =>
  axiosClient.patch(`/v1/admin/sublabels/${sublabelId}`, payload);

const deleteSubLabel = (sublabelId) => axiosClient.delete(`/v1/admin/sublabels/${sublabelId}`);

const assignSubLabelToUser = (sublabelId, payload) =>
  axiosClient.post(`/v1/admin/sublabels/${sublabelId}/assign-user`, payload);

const removeSubLabelFromUser = (sublabelId, payload) =>
  axiosClient.post(`/v1/admin/sublabels/${sublabelId}/remove-user`, payload);

const getUserSubLabels = (userId) => axiosClient.get(`/v1/admin/users/${userId}/sublabels`);

const toggleUserSubLabels = (userId, payload) =>
  axiosClient.post(`/v1/admin/users/${userId}/sublabels`, payload);


const getUsers = (page = 1, limit = 10, extraParams = "") =>
  axiosClient.get(`/v1/admin/users?page=${page}&limit=${limit}${extraParams}`);




// ---------------------- Support Tickets (Admin) ----------------------

const getAllSupportTickets = (page = 1, limit = 10) =>
  axiosClient.get(`/v1/admin/support-tickets?page=${page}&limit=${limit}`);

const getSupportTicketStats = (timeframe = "month") =>
  axiosClient.get(`/v1/admin/support-tickets/stats?timeframe=${timeframe}`);

const getSupportTicketAnalytics = (startDate, endDate) =>
  axiosClient.get(`/v1/admin/support-tickets/analytics?startDate=${startDate}&endDate=${endDate}`);

const getSupportTicketById = (ticketId) =>
  axiosClient.get(`/v1/admin/support-tickets/${ticketId}`);

const updateSupportTicket = (ticketId, payload) =>
  axiosClient.put(`/v1/admin/support-tickets/${ticketId}`, payload);

const deleteSupportTicket = (ticketId) =>
  axiosClient.delete(`/v1/admin/support-tickets/${ticketId}`);

const addAdminResponse = (ticketId, payload) =>
  axiosClient.post(`/v1/admin/support-tickets/${ticketId}/response`, payload);

const addInternalNote = (ticketId, payload) =>
  axiosClient.post(`/v1/admin/support-tickets/${ticketId}/internal-note`, payload);

const assignSupportTicket = (ticketId, payload) =>
  axiosClient.patch(`/v1/admin/support-tickets/${ticketId}/assign`, payload);

const escalateSupportTicket = (ticketId, payload) =>
  axiosClient.patch(`/v1/admin/support-tickets/${ticketId}/escalate`, payload);


// ---------------------- Company Settings (Admin) ----------------------

const createCompanySettings = (payload) =>
  axiosClient.post(`/v1/admin/company-settings`, payload);

const getAllCompanySettings = (page = 1, limit = 10) =>
  axiosClient.get(`/v1/admin/company-settings?page=${page}&limit=${limit}`);

const getCompanySettingsById = (companySettingsId) =>
  axiosClient.get(`/v1/admin/company-settings/${companySettingsId}`);

const updateCompanySettings = (companySettingsId, payload) =>
  axiosClient.put(`/v1/admin/company-settings/${companySettingsId}`, payload);

const updateCompanySettingsStatus = (companySettingsId, payload) =>
  axiosClient.patch(`/v1/admin/company-settings/${companySettingsId}/status`, payload);

const deleteCompanySettings = (companySettingsId) =>
  axiosClient.delete(`/v1/admin/company-settings/${companySettingsId}`);


// ---------------------- Company Settings: YouTube Links ----------------------

const addYouTubeLink = (companySettingsId, payload) =>
  axiosClient.post(`/v1/admin/company-settings/${companySettingsId}/youtube-links`, payload);

const updateYouTubeLinks = (companySettingsId, payload) =>
  axiosClient.put(`/v1/admin/company-settings/${companySettingsId}/youtube-links/0`, payload);

const deleteYouTubeLink = (companySettingsId) =>
  axiosClient.delete(`/v1/admin/company-settings/${companySettingsId}/youtube-links/0`);



// ---------------------- Month Management (Admin) ----------------------

const createMonth = (payload) =>
  axiosClient.post(`/v1/admin/months`, payload);

const getAllMonths = (page = 1, limit = 10) =>
  axiosClient.get(`/v1/admin/months?page=${page}&limit=${limit}`);

const getMonthsStats = () =>
  axiosClient.get(`/v1/admin/months/stats`);

const getMonthsByType = (type, includeInactive = false) =>
  axiosClient.get(`/v1/admin/months/type/${type}?includeInactive=${includeInactive}`);

const getMonthById = (monthId) =>
  axiosClient.get(`/v1/admin/months/${monthId}`);

const updateMonth = (monthId, payload) =>
  axiosClient.patch(`/v1/admin/months/${monthId}`, payload);

const deleteMonth = (monthId) =>
  axiosClient.delete(`/v1/admin/months/${monthId}`);

const toggleMonthStatus = (monthId, payload) =>
  axiosClient.patch(`/v1/admin/months/${monthId}/toggle-status`, payload);


// ---------------------- Release Management (Admin) ----------------------

const getAllReleases = (page = 1, limit = 10) =>
  axiosClient.get(`/v1/admin/releases?page=${page}&limit=${limit}`);

const getPendingReleaseReviews = (page = 1, limit = 10) =>
  axiosClient.get(`/v1/admin/releases/pending-reviews?page=${page}&limit=${limit}`);

const getReleaseStats = () =>
  axiosClient.get(`/v1/admin/releases/stats`);

const getReleaseDetails = (releaseId) =>
  axiosClient.get(`/v1/admin/releases/${releaseId}`);

const approveRelease = (releaseId, payload) =>
  axiosClient.post(`/v1/admin/releases/${releaseId}/approve`, payload);

const startProcessingRelease = (releaseId) =>
  axiosClient.post(`/v1/admin/releases/${releaseId}/start-processing`);

const publishRelease = (releaseId) =>
  axiosClient.post(`/v1/admin/releases/${releaseId}/publish`);

const goLiveRelease = (releaseId) =>
  axiosClient.post(`/v1/admin/releases/${releaseId}/go-live`);

const processTakedownRequest = (releaseId) =>
  axiosClient.post(`/v1/admin/releases/${releaseId}/process-takedown`);

const rejectRelease = (releaseId, payload) =>
  axiosClient.post(`/v1/admin/releases/${releaseId}/reject`, payload);


// ---------------------- Merch Store Management (Admin) ----------------------

export const getAllMerchStores = (page = 1, limit = 10) =>
  axiosClient.get(`/v1/merch-store/admin?page=${page}&limit=${limit}`);

export const getMerchStoreStats = () =>
  axiosClient.get(`/v1/merch-store/admin/stats`);

export const getMerchStoreById = (storeId) =>
  axiosClient.get(`/v1/merch-store/admin/${storeId}`);

export const updateMerchStoreStatus = (storeId, payload) =>
  axiosClient.patch(`/v1/merch-store/admin/${storeId}/status`, payload);

export const updateMerchStore = (storeId, payload) =>
  axiosClient.patch(`/v1/merch-store/admin/${storeId}`, payload);

export const deleteMerchStore = (storeId) =>
  axiosClient.delete(`/v1/merch-store/admin/${storeId}`);



// ---------------------- MV Production Management (Admin) ----------------------

export const getAllMVProductions = (page = 1, limit = 10) =>
  axiosClient.get(`/v1/mv-production/admin?page=${page}&limit=${limit}`);

export const getMVProductionStats = () =>
  axiosClient.get(`/v1/mv-production/admin/stats`);

export const getMVProductionById = (productionId) =>
  axiosClient.get(`/v1/mv-production/admin/${productionId}`);

export const updateMVProduction = (productionId, payload) =>
  axiosClient.patch(`/v1/mv-production/admin/${productionId}`, payload);

export const updateMVProductionStatus = (productionId, payload) =>
  axiosClient.patch(`/v1/mv-production/admin/${productionId}/status`, payload);

export const deleteMVProduction = (productionId) =>
  axiosClient.delete(`/v1/mv-production/admin/${productionId}`);


export default {
  getHealth,
  getSubscriptionPlans,
  createSubscriptionPlan,
  getPlanDetails,
  updatePlan,
  deletePlan,
  activatePlan,
  deactivatePlan,
  login,
  getFaqs,
  createFaq,
  deleteFaq,
  updateFaq,
  getFaqById,
  getPendingSyncSubmissions,
  getAllSyncSubmissions,
  reviewSyncSubmission,
  getPlayPitching,
  reviewPlayPitching,
  getTrendingLabel,
  updateTrendingLabel,
  updateTrendingLabelStats,
  updateTrendingLabelStatus,
  deleteTrendingLabel,
  createTrendingLabel,
  getAllTrendingLabels,
  getAllTestimonials,
  createTestimonial,
  getTestimonialById,
  updateTestimonial,
  updateTestimonialStatus,
  deleteTestimonial,
  getMcnRequests,
  getPendingMcnRequests,
  reviewMcnRequest,
  createMcnChannel,
  getMcnChannels,
  updateMcnChannelStatus,
  getMcnStats,
  createTeamMember,
  getAllTeamMembers,
  getTeamMemberById,
  updateTeamMember,
  updateTeamMemberStatus,
  deleteTeamMember,
  resendTeamInvitation,
  getTeamStatistics,
  createSubLabel,
  getAllSubLabels,
  getSubLabelById,
  updateSubLabel,
  deleteSubLabel,
  assignSubLabelToUser,
  removeSubLabelFromUser,
  getUserSubLabels,
  toggleUserSubLabels,
  getUsers,
  getAllSupportTickets,
  getSupportTicketStats,
  getSupportTicketAnalytics,
  getSupportTicketById,
  updateSupportTicket,
  deleteSupportTicket,
  addAdminResponse,
  addInternalNote,
  assignSupportTicket,
  escalateSupportTicket,
  createCompanySettings,
  getAllCompanySettings,
  getCompanySettingsById,
  updateCompanySettings,
  updateCompanySettingsStatus,
  deleteCompanySettings,
  addYouTubeLink,
  updateYouTubeLinks,
  deleteYouTubeLink,
  createMonth,
  getAllMonths,
  getMonthsStats,
  getMonthsByType,
  getMonthById,
  updateMonth,
  deleteMonth,
  toggleMonthStatus,
  getAllReleases,
  getPendingReleaseReviews,
  getReleaseStats,
  getReleaseDetails,
  approveRelease,
  startProcessingRelease,
  publishRelease,
  goLiveRelease,
  rejectRelease,
  processTakedownRequest,
  getAllMerchStores,
  getMerchStoreStats,
  getMerchStoreById,
  updateMerchStoreStatus,
  updateMerchStore,
  deleteMerchStore,
  getAllMVProductions,
  getMVProductionStats,
  getMVProductionById,
  updateMVProduction,
  updateMVProductionStatus,
  deleteMVProduction,

};
