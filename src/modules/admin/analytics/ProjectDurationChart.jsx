// src/components/ProjectDurationChart.js
import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function ProjectDurationChart() {
    const data = {
        labels: ['Faculty A', 'Faculty B', 'Faculty C', 'Faculty D'],
        datasets: [
            {
                label: 'Avg. Duration (Months)',
                data: [12, 8, 15, 10],
                backgroundColor: '#f59e0b'
            }
        ]
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-5 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Average Project Duration by Faculty</h3>
            <Bar data={data} options={{ indexAxis: 'y' }} />
        </div>
    );
}

export default ProjectDurationChart;
