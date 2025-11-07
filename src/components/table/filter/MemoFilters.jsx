import React, { useState, useEffect } from "react";
import StatusDropdown from "../../button/StatusDropdown.jsx";


function MemoFilters({ onFilter, initialFilters = {} }) {
    const [search, setSearch] = useState(initialFilters.search || "");

    // Update local state when initialFilters changes
    useEffect(() => {
        setSearch(initialFilters.search || "");
    }, [initialFilters]);

    const handleFilterChange = (type, value) => {
        const newValues = {
            search
        };

        newValues[type] = value;

        if (type === 'search') setSearch(value);

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

        </div>
    );
}

export default MemoFilters;