import { servicesAxiosInstance } from "./config"

// ============= Health Check =============
export const getServerHealth = async () => {
    const response = await servicesAxiosInstance.get('/v1/health')
    return response.data
}

// ============= Authentication APIs =============

/**
 * Register a new user (Artist or Label)
 * @param {Object} userData - User registration data
 * @returns {Promise} Response with user data and tokens
 */
export const registerUser = async (userData) => {
    const response = await servicesAxiosInstance.post('/v1/auth/register', userData)
    return response.data
}

/**
 * Login a user
 * @param {Object} credentials - User login credentials (emailAddress, password)
 * @returns {Promise} Response with user data and tokens
 */
export const loginUser = async (credentials) => {
    const response = await servicesAxiosInstance.post('/v1/auth/login', credentials)
    return response.data
}

/**
 * Get user profile
 * @returns {Promise} Response with user profile data
 */
export const getUserProfile = async () => {
    const response = await servicesAxiosInstance.get('/v1/auth/profile')
    return response.data
}

// ============= Subscription APIs =============

/**
 * Get all subscription plans
 * @returns {Promise} Response with list of subscription plans
 */
export const getSubscriptionPlans = async () => {
    const response = await servicesAxiosInstance.get('/v1/subscription/plans')
    return response.data
}

/**
 * Create payment intent for subscription
 * @param {Object} paymentData - Payment data with planId
 * @returns {Promise} Response with payment intent details
 */
export const createPaymentIntent = async (paymentData) => {
    const response = await servicesAxiosInstance.post('/v1/subscription/create-payment-intent', paymentData)
    return response.data
}

/**
 * Verify payment after Razorpay transaction
 * @param {Object} verificationData - Razorpay payment verification data
 * @returns {Promise} Response with verification status
 */
export const verifyPayment = async (verificationData) => {
    const response = await servicesAxiosInstance.post('/v1/subscription/verify-payment', verificationData)
    return response.data
}

// ============= Aggregator APIs =============

/**
 * Submit aggregator application
 * @param {Object} aggregatorData - Aggregator application data
 * @returns {Promise} Response with application status
 */
export const submitAggregatorApplication = async (aggregatorData) => {
    const response = await servicesAxiosInstance.post('/v1/aggregator/apply', aggregatorData)
    return response.data
}

// ============= Trending Artists APIs =============

/**
 * Get top trending artists
 * @returns {Promise} Response with list of top trending artists
 */
export const getTopTrendingArtists = async () => {
    const response = await servicesAxiosInstance.get('/v1/trending-artists/top');
    return response.data;
};

// ============= Trending Labels APIs =============

/**
 * Get top trending labels
 * @returns {Promise} Response with list of top trending labels
 */
export const getTopTrendingLabels = async () => {
    const response = await servicesAxiosInstance.get('/v1/trending-labels/top?limit=10');
    return response.data;
};

// ============= FAQ APIs =============

/**
 * Get all FAQs
 * @returns {Promise} Response with list of FAQs
 */
export const getFaqs = async () => {
    const response = await servicesAxiosInstance.get('/v1/faqs');
    return response.data;
};

// ============= Company Settings APIs =============

/**
 * Get contact details from company settings
 * @returns {Promise} Response with company contact details
 */
export const getContactDetails = async () => {
    const response = await servicesAxiosInstance.get('/v1/company-settings/contact');
    return response.data;
};

/**
 * Get social media links from company settings
 * @returns {Promise} Response with company social media links
 */
export const getSocialMediaLinks = async () => {
    const response = await servicesAxiosInstance.get('/v1/company-settings/social-media');
    return response.data;
};

// ============= Testimonials APIs =============

/**
 * Get all published testimonials
 * @returns {Promise} Response with list of testimonials
 */
export const getPublicTestimonials = async () => {
    const response = await servicesAxiosInstance.get('/v1/testimonials');
    return response.data;
};
