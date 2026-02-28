import { servicesAxiosInstance } from "./config";


export const refreshAccessToken = async (refreshToken) => {
    const response = await servicesAxiosInstance.post('/v1/auth/refresh-token', {
        refreshToken: refreshToken
    });
    return response.data;
};

export const getUserProfile = async () => {
    const response = await servicesAxiosInstance.get('/v1/auth/profile');
    return response.data;
};

export const logoutUser = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    const response = await servicesAxiosInstance.post('/v1/auth/logout', { refreshToken });
    return response.data;
};
