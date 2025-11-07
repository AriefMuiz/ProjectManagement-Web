// src/components/PrivateRoute.jsx
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const PrivateRoute = ({ children }) => {
    const { isAuthenticated, refreshToken, loading } = useAuth();
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        const verify = async () => {
            try {
                await refreshToken();
            } catch (err) {
                console.error("Auth refresh failed in PrivateRoute:", err);
            } finally {
                setChecked(true);
            }
        };

        verify();
    }, []);

    if (loading || !checked) return <div>Loading...</div>;
    return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
