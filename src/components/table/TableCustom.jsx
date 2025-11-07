import React, { memo } from 'react';

// Modify the TableHeader component to use fixed widths
const TableHeader = memo(({ columns, hasActions }) => {
    return (
        <thead>
        <tr>
            {columns.map((col) => (
                <th
                    key={col.key}
                    className="bg-primary text-white text-sm overflow-hidden text-ellipsis whitespace-nowrap "
                    style={{ width: col.width || 'auto' }}
                >
                    {col.header}
                </th>
            ))}
            {hasActions && <th className="bg-primary text-white text-sm overflow-hidden text-ellipsis whitespace-nowrap" style={{ width: '120px' }}>Actions</th>}
        </tr>
        </thead>
    );
});

// Also update the TableRow component to maintain fixed widths
const TableRow = memo(({ row, columns, renderCell, renderActions }) => {
    return (
        <tr className="hover">
            {columns.map((col) => (
                <td key={col.key} className="text-sm" style={{ width: col.width || 'auto' }}>
                    {renderCell ? renderCell(row, col) : row[col.key]}
                </td>
            ))}
            {renderActions && <td style={{ width: '120px' }}>{renderActions(row)}</td>}
        </tr>
    );
}, (prevProps, nextProps) => {
    return JSON.stringify(prevProps.row) === JSON.stringify(nextProps.row);
});

// Body component that will re-render with data changes
const TableBody = ({ columns, data, renderCell, renderActions, noDataPlaceholder }) => {
    const rowsToRender = data.length > 5 ? data : [...data, ...Array(5 - data.length).fill(null)];

    return (
        <tbody>
        {data.length === 0 ? (
            [...Array(5)].map((_, index) => (
                <tr key={`empty-${index}`}>
                    {index === 2 ? (
                        // Use the noDataPlaceholder content in the middle row
                        noDataPlaceholder ? (
                            <td
                                colSpan={columns.length + (renderActions ? 1 : 0)}
                                className="text-center py-4"
                            >
                                No Rows found
                            </td>
                        ) : (
                            <td
                                colSpan={columns.length + (renderActions ? 1 : 0)}
                                className="text-center py-4"
                            >
                                <div className="flex flex-col items-center">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="w-12 h-12 text-gray-400"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M9.75 9.75h.008v.008h-.008v-.008zm4.5 0h.008v.008h-.008v-.008zm-4.5 4.5h.008v.008h-.008v-.008zm4.5 0h.008v.008h-.008v-.008z"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M3 8.25v9.75a2.25 2.25 0 002.25 2.25h13.5A2.25 2.25 0 0021 18V8.25M3 8.25A2.25 2.25 0 015.25 6h13.5A2.25 2.25 0 0121 8.25M3 8.25h18M9.75 9.75h.008v.008h-.008v-.008zm4.5 0h.008v.008h-.008v-.008zm-4.5 4.5h.008v.008h-.008v-.008zm4.5 0h.008v.008h-.008v-.008z"
                                        />
                                    </svg>
                                    <span className="text-gray-500 mt-2">No Data Available</span>
                                </div>
                            </td>
                        )
                    ) : (
                        columns.map((col, colIndex) => (
                            <td key={`empty-col-${colIndex}`} style={{ width: col.width || 'auto' }}>&nbsp;</td>
                        ))
                    )}
                    {renderActions && index !== 2 && <td style={{ width: '120px' }}>&nbsp;</td>}
                </tr>
            ))
        ) : (
            rowsToRender.map((row, index) =>
                row ? (
                    <TableRow
                        key={row.id || `row-${index}`}
                        row={row}
                        columns={columns}
                        renderCell={renderCell}
                        renderActions={renderActions}
                    />
                ) : (
                    <tr key={`empty-${index}`}>
                        {columns.map((col, colIndex) => (
                            <td key={`empty-col-${colIndex}`} style={{ width: col.width || 'auto' }}>&nbsp;</td>
                        ))}
                        {renderActions && <td style={{ width: '120px' }}>&nbsp;</td>}
                    </tr>
                )
            )
        )}
        </tbody>
    );
};

const TableCustom = memo(({ columns, data, renderActions, renderCell = () => null }) => {
    // Memoize columns to ensure header stability
    const memoizedColumns = React.useMemo(() => columns, [columns]);

    return (
        <div className="card bg-base-100 shadow-md">
            <div className="overflow-x-auto rounded-lg">
                <table className="table table-compact rounded-lg w-full" style={{tableLayout: 'fixed'}}>
                    <TableHeader columns={memoizedColumns} hasActions={!!renderActions}/>
                    <TableBody
                        columns={memoizedColumns}
                        data={data}
                        renderCell={renderCell}
                        renderActions={renderActions}
                        noDataPlaceholder={data.length === 0}
                    />
                </table>
            </div>
        </div>
    );
});

export default TableCustom;