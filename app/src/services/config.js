import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL;
// const baseURL = 'https://mv.easytechinnovate.site';
// const baseURL = 'http://localhost:5000';

if (!baseURL) {
    throw new Error('VITE_API_URL is not right or defined in the environment variables.');
}

const servicesAxiosInstance = axios.create({
    baseURL: baseURL
});

// Flag to prevent multiple simultaneous refresh token requests
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// Request interceptor - Add access token to headers
servicesAxiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - Handle token refresh automatically
servicesAxiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // Check if error is 401 and we haven't tried to refresh yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                // If already refreshing, queue this request
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then(token => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return servicesAxiosInstance(originalRequest);
                    })
                    .catch(err => {
                        return Promise.reject(err);
                    });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const refreshToken = localStorage.getItem('refreshToken');

            if (!refreshToken) {
                // No refresh token available, clear storage and reject
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                window.location.href = '/signin';
                return Promise.reject(error);
            }

            try {
                // Call refresh token API
                const response = await axios.post(`${baseURL}/auth/refresh-token`, {
                    refreshToken: refreshToken
                });

                const { accessToken } = response.data.data;

                // Update access token in localStorage
                localStorage.setItem('accessToken', accessToken);

                // Update authorization header
                servicesAxiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;

                // Process queued requests
                processQueue(null, accessToken);

                // Retry original request
                return servicesAxiosInstance(originalRequest);
            } catch (refreshError) {
                // Refresh token failed, clear storage and redirect to login
                processQueue(refreshError, null);
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                window.location.href = '/signin';
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export {
    servicesAxiosInstance
};
