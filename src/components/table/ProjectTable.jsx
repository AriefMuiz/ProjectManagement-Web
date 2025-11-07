import React, { useState, useEffect,useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import TableCustom from './TableCustom.jsx';
import Pagination from '../../components/table/Pagination.jsx';
import StatusBadge from '../../components/widget/StatusBadge.jsx';
import LoadingSkeletonTable from './LoadingSkeletonTable.jsx';
import useFetchProject from '../../hooks/useFetchProject.js';
import ProjectFilters from './filter/ProjectFilters.jsx';

const ProjectTable = () => {
    const navigate = useNavigate();

    const {
        projects,
        loading,
        error,
        pagination,
        setPagination,
        filters,
        updateFilters
    } = useFetchProject();




    const columns = [
        { key: 'projectCode', header: 'Code', width: '70px' },
        { key: 'projectTitle', header: 'Title', width: '250px' },
        { key: 'leadProjectConsultant', header: 'Consultant Leader', width: '170px' },
        { key: 'status', header: 'Status', width: '100px' },
        { key: 'projectUnder', header: 'Project Under', width: '170px' },
        { key: 'timeline', header: 'TimeLine', width: '180px' },
        { key: 'month', header: 'Month Count', width: '120px' },
        { key: 'totalCost', header: 'Project Cost (RM)', width: '150px' },
    ];

    const handleFilter = (newFilters) => {
        updateFilters(newFilters);
    };

    const renderCell = useCallback((row, col) => {
        if (col.key === 'status') {
            return <StatusBadge status={row.status} />;
        }
        if (col.key === 'timeline') {
            const from = row.startDate ? new Date(row.startDate).toLocaleDateString() : '';
            const to = row.endDate ? new Date(row.endDate).toLocaleDateString() : '';
            return <span>{from} - {to}</span>;
        }
        if (col.key === 'month') {
            if (row.startDate && row.endDate) {
                const start = new Date(row.startDate);
                const end = new Date(row.endDate);
                const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
                return <span>{months} months</span>;
            }
            return <span>N/A</span>;
        }
        if (col.key === 'totalCost') {
            const formattedCost = new Intl.NumberFormat('en-MY', {
                style: 'currency',
                currency: 'MYR',
            }).format(row.totalCost || 0);
            return <span>{formattedCost}</span>;
        }
        return row[col.key];
    }, []);

    const renderActions = useCallback((project) => (
        <div className="flex items-center space-x-2">
            <button
                className="btn btn-xs btn-outline btn-primary"
                onClick={() => navigate(`/admin/project/detail/${project.projectId}`)}
            >
                Detail
            </button>
            <div className="dropdown dropdown-end">
                <label tabIndex={0} className="btn btn-xs btn-ghost p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                        <path d="M10 3a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM10 8.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM11.5 15.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0Z" />
                    </svg>
                </label>
                <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-40">
                    <li><button>List Memo</button></li>
                    <li><button>List Invoice</button></li>
                </ul>
            </div>
        </div>
    ), [navigate]);



    if (error) {
        return <div className="p-4 text-center text-error">{error}</div>;
    }


return (
    <div className="space-y-6">
        <ProjectFilters onFilter={handleFilter} initialFilters={filters} />

        {loading ? (
            <LoadingSkeletonTable columns={columns} />
        ) : error ? (
            <div className="p-4 text-center text-error">{error}</div>
        ) : (
            <>
                <TableCustom
                    columns={columns}
                    data={projects}
                    renderCell={renderCell}
                    renderActions={renderActions}
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
                        onPageChange={(page) => setPagination((prev) => ({ ...prev, current: page }))}
                    />
                )}
            </>
        )}
    </div>
);
};

export default ProjectTable;