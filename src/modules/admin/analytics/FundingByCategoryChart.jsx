// src/components/FundingByCategoryChart.js
import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function FundingByCategoryChart() {
    const data = {
        labels: ['University', 'National', 'Private', 'International'],
        datasets: [
            {
                label: 'Funding (RM)',
                data: [4000000, 5500000, 2000000, 1000000],
                backgroundColor: '#2563eb'
            }
        ]
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-5 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Funding by Category</h3>
            <Bar data={data} />
        </div>
    );
}

export default FundingByCategoryChart;
