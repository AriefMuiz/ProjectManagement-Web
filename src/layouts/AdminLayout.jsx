// src/layouts/AdminLayout.jsx
import React from "react";
import Navbar from "../components/common/navbar/Navbar";
import { Outlet } from "react-router-dom";
import {useAuth} from "../context/AuthContext.jsx";

const AdminLayout = () => {
    const { isAuthenticated } = useAuth();

  return (
    <div>
        <Navbar isAuthenticated={isAuthenticated} />
      <main className="min-h-screen bg-base-300 p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
