import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import { GlobeAltIcon } from "@heroicons/react/24/outline";
import logo from "../../../lib/img/png/utemholding_logo.png";

function Navbar({ role }) {
    const { i18n } = useTranslation();
    const [currentLanguage, setCurrentLanguage] = useState("English");

    const menuItems = [
        { path: "/admin/dashboard", label: "Analytics Dashboard", roles: ["admin"] },
        { path: "/admin/overview", label: "Project Overview", roles: ["admin"] },
        { path: "/admin/project", label: "Project Management", roles: ["admin"] },
        { path: "/admin/memo", label: "Payment Memo", roles: ["admin"] },
    ];

    const changeLanguage = (lang) => {
        i18n.changeLanguage(lang);
        setCurrentLanguage(lang === "en" ? "English" : "Malay");
    };

    return (
        <div
            className="navbar bg-base-300 text-base-content h-[70px] shadow-md px-4"
            data-theme="cupcake"
        >
            {/* Left - Logo & Mobile Menu */}
            <div className="navbar-start">
                {/* Mobile Menu */}
                <div className="dropdown">
                    <div tabIndex="0" role="button" className="btn btn-ghost lg:hidden">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
                        </svg>
                    </div>
                    <ul
                        tabIndex="0"
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
                    >
                        {menuItems
                            .filter((item) => item.roles.includes(role))
                            .map((item) => (
                                <li key={item.path}>
                                    <NavLink
                                        to={item.path}
                                        className={({ isActive }) =>
                                            isActive
                                                ? "font-semibold text-primary border-b-2 border-primary"
                                                : "hover:text-primary"
                                        }
                                    >
                                        {item.label}
                                    </NavLink>
                                </li>
                            ))}
                    </ul>
                </div>

                {/* Logo */}
                <NavLink to="/" className="flex items-center gap-2">
                    <img
                        src={logo}
                        alt="UTeM Holdings Logo"
                        className="h-12 w-auto"
                        draggable="false"
                    />
                </NavLink>
            </div>

            {/* Center - Desktop Menu */}
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1 gap-6">
                    {menuItems
                        .filter((item) => item.roles.includes(role))
                        .map((item) => (
                            <li key={item.path}>
                                <NavLink
                                    to={item.path}
                                    className={({ isActive }) =>
                                        isActive
                                            ? "relative font-semibold text-primary after:content-[''] after:absolute after:w-full after:h-[2px] after:bg-primary after:left-0 after:bottom-0"
                                            : "relative hover:text-primary after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-primary after:left-0 after:bottom-0 hover:after:w-full after:transition-all after:duration-300"
                                    }
                                >
                                    {item.label}
                                </NavLink>
                            </li>
                        ))}
                </ul>
            </div>

            {/* Right - Language & Auth */}
            <div className="navbar-end flex items-center gap-4">
                {/* Language Selector */}
                <div className="dropdown dropdown-hover">
                    <label tabIndex="0" className="flex items-center gap-1 cursor-pointer hover:text-primary">
                        <GlobeAltIcon className="h-5 w-5" />
                        {currentLanguage}
                    </label>
                    <ul tabIndex="0" className="dropdown-content menu rounded-box w-32 bg-base-100 shadow mt-3 z-10">
                        <li>
                            <button onClick={() => changeLanguage("en")}>English</button>
                        </li>
                        <li>
                            <button onClick={() => changeLanguage("ms")}>Malay</button>
                        </li>
                    </ul>
                </div>

                {/* Login / Logout */}
                {role === "admin" ? (
                    <button
                        className="btn btn-primary btn-sm"
                        onClick={() => (window.location.href = "/login")}
                    >
                        Log Out
                    </button>
                ) : (
                    <NavLink to="/login" className="btn btn-primary btn-sm">
                        Log In
                    </NavLink>
                )}
            </div>
        </div>
    );
}

export default Navbar;
