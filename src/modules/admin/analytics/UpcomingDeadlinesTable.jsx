// src/components/UpcomingDeadlinesTable.js
import React from 'react';

function UpcomingDeadlinesTable() {
    const deadlines = [
        { project: 'AI Research Grant', endDate: '15-Sep-25', status: 'Ongoing' },
        { project: 'Smart Campus Project', endDate: '01-Oct-25', status: 'Ongoing' },
        { project: 'Energy Efficiency Study', endDate: '10-Nov-25', status: 'Extended' }
    ];

    return (
        <div className="bg-white rounded-lg shadow-md p-5 border border-gray-200 overflow-x-auto">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Upcoming Deadlines</h3>
            <table className="min-w-full text-sm text-left">
                <thead className="bg-gray-100 text-gray-700">
                <tr>
                    <th className="px-4 py-2">Project</th>
                    <th className="px-4 py-2">End Date</th>
                    <th className="px-4 py-2">Status</th>
                </tr>
                </thead>
                <tbody>
                {deadlines.map((item, idx) => (
                    <tr key={idx} className="border-t">
                        <td className="px-4 py-2">{item.project}</td>
                        <td className="px-4 py-2">{item.endDate}</td>
                        <td className="px-4 py-2">{item.status}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default UpcomingDeadlinesTable;
