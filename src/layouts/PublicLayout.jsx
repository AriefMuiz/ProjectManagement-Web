// src/layouts/PublicLayout.jsx
import React from "react";
import Navbar from "../components/common/navbar/Navbar";
import Footer from "../components/common/footer/Footer";
import { Outlet } from "react-router-dom";

const PublicLayout = () => {
  const role = "user"; // Retrieve this dynamically based on authenticated user data

  return (
    <div className=" base-100">
      <Navbar role={role} />
      <main className=" min-h-[calc(100vh-60px)]">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;
