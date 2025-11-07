// src/layouts/AdminLayout.jsx
import React from "react";
import Navbar from "../components/common/navbar/Navbar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  const role = "admin"; // Retrieve this dynamically based on authenticated user data

  return (
    <div>
      <Navbar role={role} />
      <main className="min-h-screen bg-base-300 p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
