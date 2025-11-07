import React, { useState, useEffect } from "react";
import StatusDropdown from "../../button/StatusDropdown.jsx";


function ProjectFilters({ onFilter, initialFilters = {} }) {
    const [search, setSearch] = useState(initialFilters.search || "");
    const [statusFilter, setStatusFilter] = useState(initialFilters.status || "all");
    const [facultyFilter, setFacultyFilter] = useState(initialFilters.faculty || "All");

    // Update local state when initialFilters changes
    useEffect(() => {
        setSearch(initialFilters.search || "");
        setStatusFilter(initialFilters.status || "all");
        setFacultyFilter(initialFilters.faculty || "All");
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

    return (
        <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 mb-6 flex flex-wrap gap-4">
            <input
                type="text"
                placeholder="Search by title..."
                value={search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 flex-1 min-w-[200px]"
            />

            <StatusDropdown
                value={statusFilter}
                onChange={(value) => handleFilterChange('status', value)}
            />

            {/* Faculty filter commented out */}
        </div>
    );
}

export default ProjectFilters;