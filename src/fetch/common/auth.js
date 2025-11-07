// src/fetch/common/auth.js

/**
 * Authentication API client
 * - Handles login, logout, and token refresh
 * - Works with in-memory access tokens and HTTP-only cookie refresh tokens
 */
const authApi = {
    /**
     * Login with email and password
     * @param {string} email - User email
     * @param {string} password - User password
     * @returns {Promise} - Response with access token
     */
    async login(email, password) {
        const response = await fetch("http://localhost:8080/api/v1/auth/login", {
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
     * Refresh the access token using the HTTP-only refresh token cookie
     * @returns {Promise} - Response with new access token
     */
    async refreshToken() {
        const response = await fetch("http://localhost:8080/api/v1/auth/refresh", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include", // Important: needed for cookies
        });

        if (!response.ok) {
            throw new Error("Failed to refresh token");
        }

        return response.json(); // Returns { accessToken }
    },

    /**
     * Logout - clears the refresh token cookie
     * @returns {Promise} - Response from logout endpoint
     */
    async logout() {
        const response = await fetch("http://localhost:8080/api/v1/auth/logout", {
            method: "POST",
            credentials: "include", // Important: needed for cookies
        });

        if (!response.ok) {
            console.error("Logout failed on server");
        }

        return response;
    },

    /**
     * Make an authenticated API request
     * @param {string} url - API endpoint
     * @param {object} options - Fetch options
     * @param {string} accessToken - Current access token
     * @returns {Promise} - API response
     */
    async authenticatedRequest(url, options = {}, accessToken) {
        const headers = {
            ...options.headers,
            "Content-Type": "application/json",
        };

        if (accessToken) {
            headers["Authorization"] = `Bearer ${accessToken}`;
        }

        return fetch(url, {
            ...options,
            headers,
            credentials: "include", // Include cookies for refresh token
        });
    }
};

export default authApi;