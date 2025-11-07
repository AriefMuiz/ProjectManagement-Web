import React, { useState, useEffect } from "react";

function ProjectMemoFilter({ onFilter }) {
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("all");

    // Debounce search input
    useEffect(() => {
        const handler = setTimeout(() => {
            onFilter({ search, status });
        }, 300);
        return () => clearTimeout(handler);
    }, [search, status, onFilter]);

    const handleChange = (type, value) => {
        if (type === "search") setSearch(value);
        if (type === "status") setStatus(value);
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 mb-6 flex flex-wrap gap-4">
            <input
                type="text"
                placeholder="Search by memo title or description"
                value={search}
                onChange={e => handleChange("search", e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 flex-1 min-w-[200px]"
            />
            <select
                value={status}
                onChange={e => handleChange("status", e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2"
            >
                <option value="all">All Statuses</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
            </select>
        </div>
    );
}

export default ProjectMemoFilter;