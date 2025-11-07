// src/components/KPICards.js
import React from 'react';

function KPICards() {
    const kpis = [
        { title: "Total Funding (RM)", value: "12.5M" },
        { title: "Active Projects", value: 48 },
        { title: "On-time Completion Rate", value: "82%" },
        { title: "Projects with Extensions", value: "12%" }
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {kpis.map((kpi, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-5 border border-gray-200">
                    <h3 className="text-sm font-medium text-gray-500">{kpi.title}</h3>
                    <p className="mt-2 text-2xl font-bold text-gray-800">{kpi.value}</p>
                </div>
            ))}
        </div>
    );
}

export default KPICards;
