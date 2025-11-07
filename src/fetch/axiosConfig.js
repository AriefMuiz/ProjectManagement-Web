// src/fetch/axiosConfig.js
import axios from 'axios';
import authApi from './common/auth';

// Create axios instance with default config
const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_WEB_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Important for cookies
});

const isPublicPath = (url) => {
    try {
        const fullUrl = new URL(url, import.meta.env.VITE_WEB_API_URL);
        return fullUrl.pathname.startsWith('/public/');
    } catch {
        return url && url.startsWith('/public/');
    }
};

// Store for the refresh token promise to prevent multiple refresh calls
let refreshTokenPromise = null;

// Request interceptor - adds auth token to requests
axiosInstance.interceptors.request.use(
    (config) => {
        if (isPublicPath(config.url)) {
            return config;
        }

        // Get token from sessionStorage
        const accessToken = window.sessionStorage.getItem('accessToken');

        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor - handles token refresh on 401 errors
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Skip token refresh for public endpoints or if no config
        if (!originalRequest || isPublicPath(originalRequest.url)) {
            return Promise.reject(error);
        }

        // If error is 401 and we haven't tried refreshing yet
        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            originalRequest.url !== '/auth/refresh' &&
            originalRequest.url !== '/auth/login'
        ) {
            originalRequest._retry = true;

            try {
                // Only create a new refresh token promise if one isn't already pending
                if (!refreshTokenPromise) {
                    refreshTokenPromise = authApi.refreshToken()
                        .finally(() => {
                            refreshTokenPromise = null; // Clear the promise
                        });
                }

                // Wait for the refresh token response
                const tokenResponse = await refreshTokenPromise;

                // Store new access token
                const newAccessToken = tokenResponse.accessToken;
                window.sessionStorage.setItem('accessToken', newAccessToken);

                // Update authorization header and retry the original request
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                // If refresh token fails, log out the user
                console.error('Token refresh failed:', refreshError);

                // Clear tokens and redirect to login
                window.sessionStorage.removeItem('accessToken');
                window.location.href = '/login';

                return Promise.reject(refreshError);
            }
        }

        // For all other errors, just reject the promise
        return Promise.reject(error);
    }
);

export default axiosInstance;

export const handleApiResponse = async (apiCall) => {
    try {
        const response = await apiCall();
        return response.data;
    } catch (error) {
        // Token refresh is already handled by interceptors
        // This handles other status codes and errors
        if (error.response) {
            const { status, data } = error.response;

            // Skip 401 handling as it's managed by interceptors
            if (status !== 401) {
                switch (status) {
                    case 403:
                        console.error("Forbidden. You don't have permission for this action.");
                        break;
                    case 404:
                        console.error("Resource not found.");
                        break;
                    case 422:
                        console.error("Validation error:", data.errors || data.message);
                        break;
                    case 500:
                        console.error("Server error occurred.", data.message);
                        break;
                    default:
                        console.error(`Error with status ${status}: ${data.message || 'Unknown error'}`);
                }
            }

            throw { status, message: data.message || "Request failed", data };
        } else if (error.request) {
            console.error("No response received from server");
            throw { status: 0, message: "No response received" };
        } else {
            console.error("Request error:", error.message);
            throw { status: -1, message: error.message };
        }
    }
};