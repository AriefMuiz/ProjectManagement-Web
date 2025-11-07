import React, { useState } from "react";
import StatusBadge from "../widget/StatusBadge.jsx";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

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

    const selectedStatus = statuses.find((status) => status.value === value);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between input input-bordered input-sm h-9 px-3 text-left hover:bg-base-200 transition-colors w-full"
            >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                    {value !== "all" ? (
                        <StatusBadge status={value} />
                    ) : (
                        <span className="text-sm text-gray-600">All Statuses</span>
                    )}
                </div>
                <ChevronDownIcon
                    className={`h-4 w-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            {isOpen && (
                <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-white border border-base-300 rounded-lg shadow-lg max-h-60 overflow-y-auto min-w-[140px]">
                    {statuses.map((status) => (
                        <button
                            key={status.value}
                            onClick={() => handleSelect(status)}
                            className={`flex items-center w-full px-3 py-2 text-sm hover:bg-base-200 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                                value === status.value ? 'bg-primary/10' : ''
                            }`}
                        >
                            {status.value === "all" ? (
                                <span className="text-sm text-gray-700">{status.label}</span>
                            ) : (
                                <StatusBadge status={status.value} />
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default StatusDropdown;