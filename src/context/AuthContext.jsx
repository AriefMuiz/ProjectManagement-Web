// src/context/AuthContext.jsx
import React, { createContext, useContext, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import authApi from '../fetch/common/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);

    // Decode user information from access token
    const decodeToken = (token) => {
        try {
            const decoded = jwtDecode(token);
            return {
                userId: decoded.sub,
                email: decoded.email,
                role: decoded.role,
            };
        } catch (error) {
            console.error("Token decode error:", error);
            return null;
        }
    };

    // Refresh token function
    const refreshToken = async () => {
        setLoading(true);
        try {
            const response = await authApi.refreshToken();
            const newAccessToken = response.accessToken;

            window.sessionStorage.setItem('accessToken', newAccessToken);

            const userData = decodeToken(newAccessToken);
            setUser(userData);
            setIsAuthenticated(true);

            return true;
        } catch (error) {
            window.sessionStorage.removeItem('accessToken');
            setUser(null);
            setIsAuthenticated(false);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Login function with proper error handling
    const login = async (email, password) => {
        setLoading(true);
        try {
            const response = await authApi.login(email, password);
            const newAccessToken = response.data.accessToken;

            window.sessionStorage.setItem('accessToken', newAccessToken);

            const userData = decodeToken(newAccessToken);
            setUser(userData);
            setIsAuthenticated(true);

            return { success: true };
        } catch (error) {
            console.error("Login error:", error);

            // Handle different types of errors
            let errorMessage = 'Login failed';

            if (error.response) {
                // Server responded with error status
                const status = error.response.status;
                const data = error.response.data;

                if (status === 401) {
                    errorMessage = data?.message || 'Invalid email or password';
                } else if (status === 403) {
                    errorMessage = data?.message || 'Account not authorized';
                } else if (status === 404) {
                    errorMessage = data?.message || 'User not found';
                } else if (status === 422) {
                    errorMessage = data?.message || 'Invalid input data';
                } else if (status >= 500) {
                    errorMessage = 'Server error. Please try again later.';
                } else {
                    errorMessage = data?.message || `Login failed (${status})`;
                }
            } else if (error.request) {
                // Request was made but no response received
                errorMessage = 'Network error. Please check your connection.';
            } else if (error.message) {
                // Something else happened
                errorMessage = error.message;
            }

            return {
                success: false,
                message: errorMessage,
            };
        } finally {
            setLoading(false);
        }
    };

    // Logout function
    const logout = async () => {
        try {
            await authApi.logout();
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            window.sessionStorage.removeItem('accessToken');
            setUser(null);
            setIsAuthenticated(false);
            // Clear any existing timeouts
            if (typeof window !== 'undefined') {
                const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
                events.forEach(event => {
                    document.removeEventListener(event, () => {});
                });
            }
        }
    };

    const updateUser = (userData) => {
        setUser(prev => ({ ...prev, ...userData }));
    };

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                user,
                loading,
                login,
                logout,
                updateUser,
                refreshToken,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);