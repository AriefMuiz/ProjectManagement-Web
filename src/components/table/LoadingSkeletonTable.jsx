// src/components/widget/LoadingSkeletonTable.jsx
import React from 'react';

const LoadingSkeletonTable = ({ columns }) => (
    <div className="card bg-base-100 shadow-md">
        <div className="overflow-x-auto rounded-lg">
            <table className="table table-compact w-full rounded-lg" style={{tableLayout: 'fixed'}}>
                <thead>
                <tr>
                    {columns.map((col) => (
                        <th
                            key={col.key}
                            className="bg-primary text-white text-sm overflow-hidden text-ellipsis whitespace-nowrap"
                            style={{width: col.width}}
                        >
                            {col.header}
                        </th>
                    ))}
                    <th className="bg-primary text-white text-sm overflow-hidden text-ellipsis whitespace-nowrap" style={{width: '120px'}}>Actions</th>
                </tr>
                </thead>
                <tbody>
                {[...Array(5)].map((_, idx) => (
                    <tr key={idx}>
                        {columns.map((col, colIdx) => (
                            <td key={colIdx} style={{width: col.width || 'auto'}}>
                                <div className="h-4 bg-gray-200 rounded animate-pulse w-full max-w-[100px]"></div>
                            </td>
                        ))}
                        <td style={{width: '120px'}}>
                            <div className="flex gap-1">
                                <div className="h-8 bg-gray-200 rounded animate-pulse w-24"></div>
                                <div className="h-8 bg-gray-200 rounded animate-pulse w-16"></div>
                            </div>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    </div>
);

export default LoadingSkeletonTable;