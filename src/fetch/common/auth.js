// src/fetch/common/auth.js
import axiosInstance, {handleApiResponse} from "../axiosConfig.js";

/**
 * Authentication API client
 * - Handles login, logout, and token refresh
 * - Works with in-memory access tokens and HTTP-only cookie refresh tokens
 */
const API_BASE_URL = import.meta.env.VITE_WEB_API_URL;

const authApi = {
    /**
     * Login with email and password
     * @param {string} email - User email
     * @param {string} password - User password
     * @returns {Promise} - Response with access token
     */
    async login(email, password) {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: "POST",
            headers: {
                "accept": "*/*",
                "Content-Type": "application/json",
            },
            credentials: "include", // Important: needed for cookies
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Login failed. Please check your credentials.");
        }

        return response.json(); // Returns { accessToken }
    },

    /**
     * Request password reset
     * @param {string} email - User email
     * @returns {Promise} - Response message
     */
    async forgotPassword(email) {
        const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
            method: "POST",
            headers: {
                "accept": "*/*",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Failed to send reset email. Please try again.");
        }

        return response.json();
    },

    /**
     * Reset password with token
     * @param {string} token - Reset token from email
     * @param {string} newPassword - New password
     * @returns {Promise} - Response message
     */
    async resetPassword(token, newPassword) {
        const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
            method: "POST",
            headers: {
                "accept": "*/*",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ token, newPassword }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Failed to reset password. Please try again.");
        }

        return response.json();
    },

    /**
     * Validate reset token
     * @param {string} token - Reset token to validate
     * @returns {Promise} - Response indicating if token is valid
     */
    async validateResetToken(token) {
        const response = await fetch(`${API_BASE_URL}/auth/validate-reset-token?token=${encodeURIComponent(token)}`, {
            method: "GET",
            headers: {
                "accept": "*/*",
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Invalid or expired reset token.");
        }

        return response.json();
    },

    /**
     * Refresh the access token using the HTTP-only refresh token cookie
     * @returns {Promise} - Response with new access token
     */
    async refreshToken() {
        // Note: No Authorization header needed - refresh token is in HTTP-only cookie
        return handleApiResponse(() =>
            axiosInstance.post('/auth/refresh')
        );
    },

    /**
     * Logout - clears the refresh token cookie
     * @returns {Promise} - Response from logout endpoint
     */
    async logout() {
        const response = await fetch(`${API_BASE_URL}/auth/logout`, {
            method: "POST",
            credentials: "include", // Important: needed for cookies
        });

        if (!response.ok) {
            console.error("Logout failed on server");
        }

        return response;
    }
};

export default authApi;