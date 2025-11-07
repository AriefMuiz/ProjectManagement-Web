// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import authApi from '../fetch/common/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // Start with loading true

    // Check initial auth state on mount
    useEffect(() => {
        checkAuthState();
    }, []);

    const checkAuthState = async () => {
        const token = window.sessionStorage.getItem('accessToken');

        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const userData = decodeToken(token);
            if (userData && !isTokenExpired(token)) {
                setUser(userData);
                setIsAuthenticated(true);
            } else {
                // Token is expired, try to refresh
                await refreshToken();
            }
        } catch (error) {
            console.error("Auth check failed:", error);
            // Clear invalid token
            window.sessionStorage.removeItem('accessToken');
        } finally {
            setLoading(false);
        }
    };

    const isTokenExpired = (token) => {
        try {
            const decoded = jwtDecode(token);
            return decoded.exp * 1000 < Date.now();
        } catch {
            return true;
        }
    };

    const decodeToken = (token) => {
        try {
            const decoded = jwtDecode(token);
            return {
                userId: decoded.sub,
                email: decoded.email,
                role: decoded.role,
                exp: decoded.exp,
            };
        } catch (error) {
            console.error("Token decode error:", error);
            return null;
        }
    };

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
            console.error("Token refresh failed:", error);
            window.sessionStorage.removeItem('accessToken');
            setUser(null);
            setIsAuthenticated(false);
            throw error;
        } finally {
            setLoading(false);
        }
    };

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

            let errorMessage = 'Login failed';
            if (error.status === 401) {
                errorMessage = 'Invalid email or password';
            } else if (error.status === 0) {
                errorMessage = 'Network error. Please check your connection.';
            } else if (error.message) {
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

    const logout = async () => {
        try {
            await authApi.logout();
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            window.sessionStorage.removeItem('accessToken');
            setUser(null);
            setIsAuthenticated(false);
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

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};