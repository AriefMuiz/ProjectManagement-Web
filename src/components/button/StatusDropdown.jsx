import React, { useState } from "react";
import StatusBadge from "../widget/StatusBadge.jsx";

const StatusDropdown = ({ value, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);

    const statuses = [
        { value: "all", label: "All Statuses" },
        { value: "active", label: "Active" },
        { value: "on_going", label: "On Going" },
        { value: "in_progress", label: "In Progress" },
        { value: "completed", label: "Completed" },
        { value: "extended", label: "Extended" },
        { value: "pending", label: "Pending" },
    ];

    const handleSelect = (status) => {
        onChange(status.value);
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="border border-gray-300 rounded-md px-3 py-2 w-24 text-left"
            >
                {statuses.find((status) => status.value === value)?.label || "Select Status"}
            </button>
            {isOpen && (
                <ul className="absolute z-10 bg-white border border-gray-300 rounded-md mt-1 w-24 shadow-md">
                    {statuses.map((status) => (
                        <li
                            key={status.value}
                            onClick={() => handleSelect(status)}
                            className="px-3 py-2 cursor-pointer hover:bg-gray-100 flex items-center"
                        >
                            <StatusBadge status={status.value} />
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default StatusDropdown;