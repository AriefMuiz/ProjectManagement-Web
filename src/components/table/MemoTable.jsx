import React, {useCallback} from 'react';
import {useNavigate} from 'react-router-dom';
import TableCustom from './TableCustom.jsx';
import Pagination from '../../components/table/Pagination.jsx';
import LoadingSkeletonTable from './LoadingSkeletonTable.jsx';
import useFetchMemo from '../../hooks/useFetchMemo.js';
import MemoFilters from './filter/MemoFilters.jsx';
import StatusBadge from "../widget/StatusBadge.jsx";

const MemoTable = () => {
    const navigate = useNavigate();

    const {
        memos,
        loading,
        error,
        pagination,
        setPagination,
        filters,
        updateFilters
    } = useFetchMemo();

    console.log(memos)
    const columns = [
        {key: 'projectCode', header: 'Project Code', width: '100px'},
        {key: 'projectTitle', header: 'Project Title', width: '250px'},
        {key: 'memoCount', header: 'Total Memo', width: '100px'},
        {key: 'approvedMemoCount', header: 'Approved', width: '100px'},
        {key: 'pendingMemoCount', header: 'Pending', width: '100px'},
        {key: 'rejectedMemoCount', header: 'Rejected', width: '100px'},
    ];

    const handleFilter = (newFilters) => {
        updateFilters(newFilters);
    };

    const renderCell = useCallback((row, col) => {

        return row[col.key];
    }, []);

    const renderActions = useCallback((project) => (
        <div className="flex items-center space-x-2">
            <button
                className="btn btn-xs btn-outline btn-primary"
                onClick={() => navigate(`/admin/project-memo/list/${project.projectId}`)}
            >
                Detail
            </button>
            <div className="dropdown dropdown-end">
                <label tabIndex={0} className="btn btn-xs btn-ghost p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                        <path
                            d="M10 3a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM10 8.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM11.5 15.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0Z"/>
                    </svg>
                </label>
                <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-40">
                    <li>
                        <button>List Memo</button>
                    </li>
                    <li>
                        <button>List Invoice</button>
                    </li>
                </ul>
            </div>
        </div>
    ), [navigate]);


    if (error) {
        return <div className="p-4 text-center text-error">{error}</div>;
    }


    return (
        <div className="space-y-6">
            <MemoFilters onFilter={handleFilter} initialFilters={filters}/>

            {loading ? (
                <LoadingSkeletonTable columns={columns}/>
            ) : error ? (
                <div className="p-4 text-center text-error">{error}</div>
            ) : (
                <>
                    <TableCustom
                        columns={columns}
                        data={memos}
                        renderActions={renderActions}
                        renderCell={renderCell}
                        noDataPlaceholder={
                            <tr>
                                <td colSpan={columns.length} className="text-center py-4">
                                    No projects found
                                </td>
                            </tr>
                        }
                    />
                    {pagination.total > pagination.pageSize && (
                        <Pagination
                            currentPage={pagination.current}
                            pageCount={Math.ceil(pagination.total / pagination.pageSize)}
                            onPageChange={(page) => setPagination((prev) => ({...prev, current: page}))}
                        />
                    )}
                </>
            )}
        </div>
    );
};

export default MemoTable;