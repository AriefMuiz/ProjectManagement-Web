// src/components/Dashboard.js
import React from 'react';
import KPICards from '../analytics/KPICards';
import ProjectStatusChart from '../analytics/ProjectStatusChart';
import FundingByCategoryChart from '../analytics/FundingByCategoryChart';
import ProjectDurationChart from '../analytics/ProjectDurationChart';
import UpcomingDeadlinesTable from '../analytics/UpcomingDeadlinesTable';

function Dashboard() {
    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <h1 className="text-3xl font-semibold text-gray-800 mb-6">Analytics Dashboard</h1>

            {/* KPI Cards */}
            <KPICards />

            {/* Charts Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <ProjectStatusChart />
                <FundingByCategoryChart />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <ProjectDurationChart />
                <UpcomingDeadlinesTable />
            </div>
        </div>
    );
}

export default Dashboard;
