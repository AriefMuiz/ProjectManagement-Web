import {useEffect, useState} from "react";
import memosAPI from "../fetch/common/memos.js";

const useFetchMemo = () => {
    const [memos, setMemos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({search: ""});
    const [pagination, setPagination] = useState({current: 1, pageSize: 5, total: 0});

    useEffect(() => {
        const fetchMemos = async () => {
            try {
                setLoading(true);
                const response = await memosAPI.getAllMemos({
                    page: pagination.current,
                    pageSize: pagination.pageSize,
                    ...filters
                });
                const result = await response;
                if (result.success) {
                    setMemos(result.data);
                    setPagination((prev) => ({
                        ...prev,
                        total: result.meta.total,
                    }));
                } else {
                    throw new Error(result.message || "Failed to fetch memos");
                }
            } catch (error) {
                setError(error.message);
                console.error("Failed to fetch memos:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMemos();
    }, [pagination.current, pagination.pageSize, filters]);

    // Reset to first page when filters change
    const updateFilters = (newFilters) => {
        setPagination(prev => ({...prev, current: 1}));
        setFilters(newFilters);
    };

    return {
        memos,
        loading,
        error,
        pagination,
        setPagination,
        filters,
        updateFilters
    };
};

export default useFetchMemo;