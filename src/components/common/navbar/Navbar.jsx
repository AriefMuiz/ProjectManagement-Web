import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
    ArrowRightOnRectangleIcon,
    GlobeAltIcon,
    MoonIcon,
    SunIcon,
    UserCircleIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../../context/AuthContext.jsx';
import Roles from '../../../constants/roles.js';
import Logo from "../../../lib/img/png/utemholding_logo.png";

function Navbar() {
    const { i18n } = useTranslation();
    const [currentLanguage, setCurrentLanguage] = useState('English');
    const [darkMode, setDarkMode] = useState(false);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const navigate = useNavigate();
    const { logout, isAuthenticated, user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [profilePicture, setProfilePicture] = useState(null);
    const [profilePictureLoading, setProfilePictureLoading] = useState(false);
    const location = useLocation();

    // Menu items based on user role
    const menuItems = [
        { path: "/admin/dashboard", label: "Analytics Dashboard", roles: ["admin", "role_superadmin"] },
        { path: "/admin/overview", label: "Project Overview", roles: ["admin", "role_superadmin"] },
        { path: "/admin/project", label: "Project Management", roles: ["admin", "role_superadmin"] },
        { path: "/admin/memo", label: "Payment Memo", roles: ["admin", "role_superadmin"] },
    ];

    // useEffect(() => {
    //     const fetchProfile = async () => {
    //         try {
    //             const data = await userAgencyAPI.getMeProfile();
    //             setProfile(data);
    //             if (data?.profileMediaId) {
    //                 fetchProfilePicture(data.profileMediaId);
    //             }
    //         } catch (error) {
    //             console.error('Failed to fetch profile', error);
    //         }
    //     };
    //     if (isAuthenticated) {
    //         fetchProfile();
    //     }
    // }, [isAuthenticated]);

    // const fetchProfilePicture = async (mediaId) => {
    //     try {
    //         setProfilePictureLoading(true);
    //         const blob = await mediaFileAPI.getMediaFile(mediaId);
    //         const imageUrl = URL.createObjectURL(blob);
    //         setProfilePicture(imageUrl);
    //     } catch (error) {
    //         console.error('Failed to fetch profile picture', error);
    //         setProfilePicture(null);
    //     } finally {
    //         setProfilePictureLoading(false);
    //     }
    // };

    useEffect(() => {
        return () => {
            if (profilePicture) {
                URL.revokeObjectURL(profilePicture);
            }
        };
    }, [profilePicture]);

    const togglePopup = () => setIsPopupOpen((v) => !v);

    const changeLanguage = (lang) => {
        i18n.changeLanguage(lang);
        setCurrentLanguage(lang === 'en' ? 'English' : 'Malay');
    };

    const handleLogin = () => navigate('/login');

    const handleLogout = () => {
        if (profilePicture) {
            URL.revokeObjectURL(profilePicture);
            setProfilePicture(null);
        }
        logout();
        navigate('/login');
    };

    const toggleDarkMode = () => {
        setDarkMode((v) => !v);
        document.documentElement.classList.toggle('dark');
    };

    const getRoleBadge = (role) => {
        const roleConfig = {
            ROLE_SUPERADMIN: {
                bg: 'bg-gradient-to-r from-purple-500 to-purple-600',
                text: 'text-white',
                label: 'SuperAdmin'
            },
            ROLE_ADMIN: {
                bg: 'bg-gradient-to-r from-blue-500 to-blue-600',
                text: 'text-white',
                label: 'Admin'
            },
            ROLE_USER: {
                bg: 'bg-gradient-to-r from-gray-500 to-gray-600',
                text: 'text-white',
                label: 'Survey Creator'
            }
        };
        const config = roleConfig[role] || {
            bg: 'bg-gray-100',
            text: 'text-gray-700',
            label: role || 'User'
        };
        return (
            <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text} shadow-sm`}
            >
                {config.label}
            </span>
        );
    };

    const getDisplayName = () => {
        const name = profile?.name || (user?.email ? user.email.split('@')[0] : 'User');
        return name.charAt(0).toUpperCase() + name.slice(1);
    };
    const getDisplayEmail = () => profile?.email || user?.email || '';
    const getUserInitials = () => getDisplayName().charAt(0).toUpperCase();

    const ProfilePicture = ({ className = 'w-8 h-8' }) => {
        if (profilePictureLoading) {
            return (
                <div
                    className={`${className} bg-gray-200 rounded-full flex items-center justify-center animate-pulse`}
                >
                    <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                </div>
            );
        }
        if (profilePicture) {
            return (
                <img
                    src={profilePicture}
                    alt="Profile"
                    className={`${className} rounded-full object-cover border-2 border-white shadow-sm`}
                    onError={(e) => {
                        e.target.style.display = 'none';
                    }}
                />
            );
        }
        return (
            <div
                className={`${className} bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold shadow-sm`}
            >
                {getUserInitials()}
            </div>
        );
    };

    // Filter menu items based on user role
    const filteredMenuItems = menuItems.filter((item) =>
        user?.role && item.roles.includes(user.role.toLowerCase())
    );

    return (
        <div className="navbar bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
            {/* Left - Logo & Mobile Menu */}
            <div className="navbar-start">
                <label htmlFor="my-drawer-2" className="btn btn-ghost btn-circle lg:hidden">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>
                </label>

                {/* Logo */}
                <NavLink to="/" className="flex items-center space-x-3">
                    <img src={Logo} alt="UTeM Holdings Logo" className="w-8 h-8 rounded-lg object-cover" />
                    <div>
                        <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            UTEM HOLDING
                        </span>
                        <span className="block text-sm text-gray-500">Project Management System</span>
                    </div>
                </NavLink>
            </div>

            {/* Center - Desktop Menu Items */}
            {isAuthenticated && filteredMenuItems.length > 0 && (
                <div className="navbar-center hidden lg:flex">
                    <ul className="menu menu-horizontal gap-2">
                        {filteredMenuItems.map((item) => (
                            <li key={item.path}>
                                <NavLink
                                    to={item.path}
                                    className={({ isActive }) =>
                                        `py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                                            isActive
                                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                        }`
                                    }
                                >
                                    {item.label}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Right - Language, Theme & Auth */}
            <div className="navbar-end gap-4">
                {isAuthenticated && (location.pathname === '/' || location.pathname === '') ? (
                    <button
                        onClick={() => navigate('/admin/dashboard')}
                        className="flex items-center justify-between text-sm py-2 px-4 hover:bg-gray-50 rounded-lg border border-gray-200"
                    >
                        Dashboard
                    </button>
                ) : null}

                {/* Language Selector */}
                <div className="dropdown dropdown-end">
                    <label tabIndex={0} className="btn btn-ghost btn-sm rounded-xl border border-gray-200">
                        <GlobeAltIcon className="h-4 w-4 mr-2" />
                        <span className="text-sm">{currentLanguage}</span>
                        <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </label>
                    <ul
                        tabIndex={0}
                        className="dropdown-content menu rounded-box w-40 bg-white shadow-lg border border-gray-200 mt-2 z-50"
                    >
                        <li>
                            <button
                                onClick={() => changeLanguage('en')}
                                className="flex items-center justify-between text-sm py-2 px-4 hover:bg-gray-50"
                            >
                                English
                                {currentLanguage === 'English' && <div className="w-2 h-2 bg-blue-600 rounded-full"></div>}
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => changeLanguage('ms')}
                                className="flex items-center justify-between text-sm py-2 px-4 hover:bg-gray-50"
                            >
                                Malay
                                {currentLanguage === 'Malay' && <div className="w-2 h-2 bg-blue-600 rounded-full"></div>}
                            </button>
                        </li>
                    </ul>
                </div>

                {isAuthenticated ? (
                    <>
                        {/* Dark Mode Toggle */}
                        <button
                            onClick={toggleDarkMode}
                            className="btn btn-ghost btn-sm btn-circle hover:bg-gray-100"
                            title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                        >
                            {darkMode ? <SunIcon className="h-5 w-5 text-gray-600" /> : <MoonIcon className="h-5 w-5 text-gray-600" />}
                        </button>

                        {/* User Profile Dropdown */}
                        <div className="dropdown dropdown-end">
                            <div
                                tabIndex={0}
                                className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 rounded-xl p-2"
                            >
                                <div className="flex items-center space-x-3">
                                    <ProfilePicture />
                                    <div className="hidden sm:block text-left">
                                        <p className="text-sm font-medium text-gray-900">{getDisplayName()}</p>
                                        <div className="flex items-center gap-2 mt-1">{getRoleBadge(user?.role)}</div>
                                    </div>
                                </div>
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>

                            <ul
                                tabIndex={0}
                                className="dropdown-content menu rounded-box w-64 bg-white shadow-xl border border-gray-200 mt-2 z-50 p-2"
                            >
                                <li className="p-3 border-b border-gray-100">
                                    <div className="flex items-center space-x-3">
                                        <ProfilePicture className="w-12 h-12" />
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-gray-900 truncate">{getDisplayName()}</h3>
                                            <p className="text-sm text-gray-500 truncate">{getDisplayEmail()}</p>
                                            <div className="mt-1">{getRoleBadge(user?.role)}</div>
                                        </div>
                                    </div>
                                </li>


                                <li>
                                    <NavLink
                                        to="/admin/dashboard"
                                        className="flex items-center space-x-3 py-3 px-4 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-700 transition-colors"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={1.5}
                                            stroke="currentColor"
                                            className="w-5 h-5 text-gray-400"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5m.75-9 3-3 2.148 2.148A12.061 12.061 0 0 1 16.5 7.605"
                                            />
                                        </svg>
                                        <span>Dashboard</span>
                                    </NavLink>
                                </li>

                                {(user?.role === Roles.ADMIN || user?.role === Roles.SUPERADMIN) && (
                                    <li>
                                        <NavLink
                                            to="/admin/user-management"
                                            className="flex items-center space-x-3 py-3 px-4 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-700 transition-colors"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth={1.5}
                                                stroke="currentColor"
                                                className="w-5 h-5 text-gray-400"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
                                                />
                                            </svg>
                                            <span>User Management</span>
                                        </NavLink>
                                    </li>
                                )}

                                {/*{user?.role === Roles.SUPERADMIN && (*/}
                                {/*    // <li>*/}
                                {/*    //     <NavLink*/}
                                {/*    //         to="/admin/agency-management"*/}
                                {/*    //         className="flex items-center space-x-3 py-3 px-4 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-700 transition-colors"*/}
                                {/*    //     >*/}
                                {/*    //         <svg*/}
                                {/*    //             xmlns="http://www.w3.org/2000/svg"*/}
                                {/*    //             fill="none"*/}
                                {/*    //             viewBox="0 0 24 24"*/}
                                {/*    //             strokeWidth={1.5}*/}
                                {/*    //             stroke="currentColor"*/}
                                {/*    //             className="w-5 h-5 text-gray-400"*/}
                                {/*    //         >*/}
                                {/*    //             <path*/}
                                {/*    //                 strokeLinecap="round"*/}
                                {/*    //                 strokeLinejoin="round"*/}
                                {/*    //                 d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"*/}
                                {/*    //             />*/}
                                {/*    //         </svg>*/}
                                {/*    //         <span>Agency Management</span>*/}
                                {/*    //     </NavLink>*/}
                                {/*    // </li>*/}
                                {/*)}*/}

                                <div className="border-t border-gray-100 my-2"></div>

                                <li>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center space-x-3 py-3 px-4 rounded-lg hover:bg-red-50 text-sm font-medium text-red-600 transition-colors"
                                    >
                                        <ArrowRightOnRectangleIcon className="h-5 w-5" />
                                        <span>Sign Out</span>
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </>
                ) : (
                    <button
                        onClick={handleLogin}
                        className="btn btn-primary bg-gradient-to-r from-blue-600 to-purple-600 border-none hover:from-blue-700 hover:to-purple-700 text-white rounded-xl px-6 shadow-sm"
                    >
                        Login
                    </button>
                )}
            </div>
        </div>
    );
}

export default Navbar;