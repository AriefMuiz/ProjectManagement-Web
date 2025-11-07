// src/components/widget/StatusBadge.jsx
    import React from "react";

    function StatusBadge({ status }) {
        // Convert status to lowercase for consistent color mapping
        const statusLower = status?.toLowerCase();

        const colors = {
            // Active/ongoing statuses - blue
            active: "bg-blue-100 text-blue-800",
            on_going: "bg-blue-100 text-blue-800",
            in_progress: "bg-blue-100 text-blue-800",
            on: "bg-blue-100 text-blue-800",

            // Complete statuses - green
            completed: "bg-green-100 text-green-800",
            complete: "bg-green-100 text-green-800",

            // Extension statuses - yellow
            extended: "bg-yellow-100 text-yellow-800",

            // Pending statuses - orange
            pending: "bg-orange-100 text-orange-800",

            // Negative statuses - red
            cancelled: "bg-red-100 text-red-800",
            failed: "bg-red-100 text-red-800",
            deleted: "bg-red-100 text-red-800",
            suspended: "bg-red-100 text-red-800",

            // Archived - gray
            archived: "bg-gray-200 text-gray-800"
        };

        // Format display status: replace underscores with spaces and capitalize each word
        const displayStatus = status
            ? status.split('_')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                .join(' ')
            : "Unknown";

        return (
            <span
                className={`inline-flex justify-center items-center h-6 w-24 rounded text-xs font-medium ${
                    colors[statusLower] || "bg-gray-100 text-gray-800"
                }`}
            >
                {displayStatus}
            </span>
        );
    }

    export default StatusBadge;