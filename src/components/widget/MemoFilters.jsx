// src/components/widget/MemoFilters.jsx
import React, { useState } from "react";

function MemoFilters({ onFilter }) {
    const [search, setSearch] = useState("");

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearch(value);
        onFilter({ search: value });
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 mb-6 flex flex-wrap gap-4">
            <input
                type="text"
                placeholder="Search by Project ID or Title"
                value={search}
                onChange={handleSearchChange}
                className="border border-gray-300 rounded-md px-3 py-2 flex-1 min-w-[200px]"
            />
        </div>
    );
}

export default MemoFilters;