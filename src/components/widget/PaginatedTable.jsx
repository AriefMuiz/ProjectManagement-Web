import { useState } from "react";

const PaginatedTable = ({ headers, data, rowsPerPage = 10 }) => {
    const [page, setPage] = useState(1);
    const [sortConfig, setSortConfig] = useState({ key: "timeCaptured", direction: "desc" });

    // Calculate total pages
    const totalPages = Math.ceil(data.length / rowsPerPage);

    // Sorting logic based on sortConfig
    const sortedData = [...data].sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        if (sortConfig.key === "timeCaptured") {
            // Convert timeCaptured to Date objects for proper comparison
            aValue = new Date(a[sortConfig.key]);
            bValue = new Date(b[sortConfig.key]);
        }

        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
    });

    // Paginate the sorted data
    const paginatedData = sortedData.slice(
        (page - 1) * rowsPerPage,
        page * rowsPerPage
    );

    // Handle sorting when a column is clicked
    const handleSort = (column) => {
        let direction = "asc";
        if (sortConfig.key === column && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key: column, direction });
    };

    return (
        <>
            <div className="overflow-x-auto bg-white rounded-2xl">
                <table className="table bg-white w-full">
                    <thead>
                    <tr>
                        <th>#</th>
                        {/* Render headers with sorting functionality */}
                        {headers.map((header, idx) => (
                            <th
                                key={idx}
                                className="capitalize cursor-pointer"
                                onClick={() => handleSort(header)}
                            >
                                {header}
                                {sortConfig.key === header && (
                                    <span>{sortConfig.direction === "asc" ? " ↑" : " ↓"}</span>
                                )}
                            </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {paginatedData.map((row, index) => (
                        <tr key={index} className="hover">
                            <th>{(page - 1) * rowsPerPage + index + 1}</th>
                            {headers.map((header, idx) => (
                                <td key={idx}>
                                    {header === "timeCaptured"
                                        ? new Date(row[header]).toLocaleString()
                                        : row[header]}
                                </td>
                            ))}
                        </tr>
                    ))}
                    </tbody>
                </table>

                {/* Pagination controls */}
                <div className="flex justify-between mt-4">
                    <div className="join">
                        <button
                            className="join-item btn"
                            disabled={page === 1}
                            onClick={() => setPage((p) => Math.max(p - 1, 1))}
                        >
                            Prev
                        </button>
                        <button className="join-item btn no-animation cursor-default">
                            Page {page} of {totalPages}
                        </button>
                        <button
                            className="join-item btn"
                            disabled={page === totalPages}
                            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                        >
                            Next
                        </button>
                    </div>
                    <div className="text-sm text-gray-600 mt-2 text-center mr-4">
                        Total records: {data.length}
                    </div>
                </div>
            </div>
        </>
    );
};

export default PaginatedTable;
