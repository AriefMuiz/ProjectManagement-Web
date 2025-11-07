import React, { useState, useEffect } from "react";
import StatusDropdown from "../../button/StatusDropdown.jsx";
import {
    MagnifyingGlassIcon,
    FunnelIcon,
    XMarkIcon
} from "@heroicons/react/24/outline";

function ProjectFilters({ onFilter, initialFilters = {} }) {
    const [search, setSearch] = useState(initialFilters.search || "");
    const [statusFilter, setStatusFilter] = useState(initialFilters.status || "all");
    const [facultyFilter, setFacultyFilter] = useState(initialFilters.faculty || "all");

    // Update local state when initialFilters changes
    useEffect(() => {
        setSearch(initialFilters.search || "");
        setStatusFilter(initialFilters.status || "all");
        setFacultyFilter(initialFilters.faculty || "all");
    }, [initialFilters]);

    const handleFilterChange = (type, value) => {
        const newValues = {
            search,
            status: statusFilter,
            faculty: facultyFilter
        };

        newValues[type] = value;

        if (type === 'search') setSearch(value);
        if (type === 'status') setStatusFilter(value);
        if (type === 'faculty') setFacultyFilter(value);

        onFilter(newValues);
    };

    const clearFilters = () => {
        setSearch("");
        setStatusFilter("all");
        setFacultyFilter("all");
        onFilter({});
    };

    const hasActiveFilters = search || statusFilter !== "all" || facultyFilter !== "all";

    return (
        <div className="space-y-4">
            {/* Filter Card */}
            <div className="card bg-base-100 border border-base-300 shadow-sm">
                <div className="card-body p-6">
                    <div className="flex flex-col lg:flex-row lg:items-end gap-4">
                        {/* Search Input */}
                        <div className="flex-1">
                            <label className="label pb-2">
                                <span className="label-text font-semibold text-sm flex items-center gap-2">
                                    <MagnifyingGlassIcon className="h-4 w-4" />
                                    Search Projects
                                </span>
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search by project title, code, or consultant..."
                                    value={search}
                                    onChange={(e) => handleFilterChange('search', e.target.value)}
                                    className="input input-bordered input-sm w-full pl-9 focus:input-primary"
                                />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
                                </div>
                            </div>
                        </div>

                        {/* Status Dropdown */}
                        <div className="w-full lg:w-48">
                            <label className="label pb-2">
                                <span className="label-text font-semibold text-sm flex items-center gap-2">
                                    <FunnelIcon className="h-4 w-4" />
                                    Status
                                </span>
                            </label>
                            <StatusDropdown
                                value={statusFilter}
                                onChange={(value) => handleFilterChange('status', value)}
                            />
                        </div>

                        {/* Faculty Dropdown */}
                        <div className="w-full lg:w-48">
                            <label className="label pb-2">
                                <span className="label-text font-semibold text-sm flex items-center gap-2">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                                    </svg>
                                    Faculty
                                </span>
                            </label>
                            <select
                                value={facultyFilter}
                                onChange={(e) => handleFilterChange('faculty', e.target.value)}
                                className="select select-bordered select-sm w-full focus:select-primary"
                            >
                                <option value="all">All Faculties</option>
                                <option value="fke">Faculty of Electrical Engineering</option>
                                <option value="fkm">Faculty of Mechanical Engineering</option>
                                <option value="ftmk">Faculty of Information Technology</option>
                                <option value="fkp">Faculty of Manufacturing Engineering</option>
                                <option value="fkee">Faculty of Electronics & Computer Engineering</option>
                            </select>
                        </div>

                        {/* Clear Filters Button */}
                        <div className="w-full lg:w-auto">
                            <label className="label pb-2 lg:invisible">
                                <span className="label-text font-semibold text-sm">Actions</span>
                            </label>
                            <button
                                onClick={clearFilters}
                                className="btn btn-outline btn-sm w-full lg:w-auto gap-2"
                                disabled={!hasActiveFilters}
                            >
                                <XMarkIcon className="h-4 w-4" />
                                Clear
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Active Filters Badges */}
            {hasActiveFilters && (
                <div className="card bg-base-100 border border-base-300 shadow-sm">
                    <div className="card-body py-4">
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="flex items-center gap-2 text-sm font-medium text-base-content">
                                <FunnelIcon className="h-4 w-4 text-info" />
                                Active Filters:
                            </div>
                            {search && (
                                <div className="badge badge-primary badge-lg gap-1 pl-3 pr-1 py-3">
                                    <span className="text-xs">Search: "{search}"</span>
                                    <button
                                        onClick={() => handleFilterChange('search', '')}
                                        className="btn btn-xs btn-circle btn-ghost hover:bg-primary hover:text-primary-content"
                                    >
                                        ✕
                                    </button>
                                </div>
                            )}
                            {statusFilter !== "all" && (
                                <div className="badge badge-secondary badge-lg gap-1 pl-3 pr-1 py-3">
                                    <span className="text-xs">Status: {statusFilter}</span>
                                    <button
                                        onClick={() => handleFilterChange('status', 'all')}
                                        className="btn btn-xs btn-circle btn-ghost hover:bg-secondary hover:text-secondary-content"
                                    >
                                        ✕
                                    </button>
                                </div>
                            )}
                            {facultyFilter !== "all" && (
                                <div className="badge badge-accent badge-lg gap-1 pl-3 pr-1 py-3">
                                    <span className="text-xs">Faculty: {facultyFilter}</span>
                                    <button
                                        onClick={() => handleFilterChange('faculty', 'all')}
                                        className="btn btn-xs btn-circle btn-ghost hover:bg-accent hover:text-accent-content"
                                    >
                                        ✕
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProjectFilters;