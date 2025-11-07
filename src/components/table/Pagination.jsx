// src/components/widget/Pagination.jsx
import React from 'react';

const Pagination = ({ currentPage, pageCount, onPageChange }) => (
    <div className="join mt-4 flex justify-center pb-4">
        <button
            className="join-item btn"
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
        >
            Prev
        </button>
        {[...Array(pageCount)].map((_, i) => (
            <button
                key={i}
                className={`join-item btn${currentPage === i + 1 ? ' btn-active' : ''}`}
                onClick={() => onPageChange(i + 1)}
            >
                {i + 1}
            </button>
        ))}
        <button
            className="join-item btn"
            disabled={currentPage === pageCount}
            onClick={() => onPageChange(currentPage + 1)}
        >
            Next
        </button>
    </div>
);

export default Pagination;