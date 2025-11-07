import {useEffect, useState} from "react";
import projectsAPI from "../fetch/common/projects.js";

const useFetchProject = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({search: "", status: "all"});
    const [pagination, setPagination] = useState({current: 1, pageSize: 5, total: 0});

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                setLoading(true);
                const response = await projectsAPI.getAllProjects({
                    page: pagination.current,
                    pageSize: pagination.pageSize,
                    ...filters
                });
                const result = await response;
                if (result.success) {
                    setProjects(result.data);
                    setPagination((prev) => ({
                        ...prev,
                        total: result.meta.total,
                    }));
                } else {
                    throw new Error(result.message || "Failed to fetch projects");
                }
            } catch (error) {
                setError(error.message);
                console.error("Failed to fetch projects:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, [pagination.current, pagination.pageSize, filters]);

    // Reset to first page when filters change
    const updateFilters = (newFilters) => {
        setPagination(prev => ({...prev, current: 1}));
        setFilters(newFilters);
    };

    return {
        projects,
        loading,
        error,
        pagination,
        setPagination,
        filters,
        updateFilters
    };
};

export default useFetchProject;