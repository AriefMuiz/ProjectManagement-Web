// src/context/AuthContext.jsx
import React, { createContext, useContext, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import authApi from '../fetch/common/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false); // default false now


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

    // Login function
    const login = async (email, password) => {
        try {
            const response = await authApi.login(email, password);
            const newAccessToken = response.accessToken;

            window.sessionStorage.setItem('accessToken', newAccessToken);

            const userData = decodeToken(newAccessToken);
            setUser(userData);
            setIsAuthenticated(true);

            return { success: true };
        } catch (error) {
            console.error("Login error:", error);
            return {
                success: false,
                message: error.message || 'Login failed',
            };
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
        }
    };

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                user,
                loading,
                login,
                logout,
                refreshToken,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
