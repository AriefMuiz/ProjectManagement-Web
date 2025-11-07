// src/components/ProjectStatusChart.js
import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

function ProjectStatusChart() {
    const data = {
        labels: ['Ongoing', 'Completed', 'Extended'],
        datasets: [
            {
                data: [25, 15, 8],
                backgroundColor: ['#2563eb', '#16a34a', '#f59e0b']
            }
        ]
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-5 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Project Status Overview</h3>
            <Pie data={data} />
        </div>
    );
}

export default ProjectStatusChart;
