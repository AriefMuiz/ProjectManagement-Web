import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import ProjectMemoTable from "../../../../components/widget/ProjectMemoTable.jsx";
import ProjectMemoFilter from "../../../../components/widget/ProjectMemoFilter.jsx";
import memoAPI from "../../../../fetch/admin/memo.js";


function ProjectMemoList() {
    const { setBreadcrumbItems, defaultBreadcrumb } = useOutletContext();
    const { projectId } = useParams();
    const navigate = useNavigate();
    const [projectTitle, setProjectTitle] = useState("");
    const [memos, setMemos] = useState([]);
    const [filteredMemos, setFilteredMemos] = useState([]);

    useEffect(() => {
        if (setBreadcrumbItems) {
            setBreadcrumbItems([
                ...defaultBreadcrumb,
                { label: projectId, href: `/admin/memo/list/${projectId}` }
            ]);
        }
        return () => {
            if (setBreadcrumbItems) {
                setBreadcrumbItems(defaultBreadcrumb);
            }
        };
    }, [projectId, setBreadcrumbItems, defaultBreadcrumb]);

    useEffect(() => {
        // Fetch memos for this project from API
        const fetchMemos = async () => {
            try {
                const res = await memoAPI.getMemosByProject(projectId);
                console.log("Fetched memos:", res);
                setMemos(res);
                setFilteredMemos(res);
            } catch (err) {
                setMemos([]);
                setFilteredMemos([]);
                // Optionally handle error
            }
        };
        fetchMemos();
    }, [projectId]);

    const handleFilter = (filters) => {
        const search = filters.search?.toLowerCase() || "";
        const status = filters.status || "all";
        setFilteredMemos(
            memos.filter(
                m =>
                    (status === "all" || m.status === status) &&
                    (
                        m.subject?.toLowerCase().includes(search) ||
                        m.referenceNo?.toLowerCase().includes(search)
                    )
            )
        );
    };

    const fetchMemos = async () => {
        try {
            const res = await memoAPI.getMemosByProject(projectId);
            setMemos(res);
            setFilteredMemos(res);
        } catch (err) {
            setMemos([]);
            setFilteredMemos([]);
        }
    };

    return (
        <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
            {/* Alert/info box */}
            <div className="mb-4 p-4 rounded-lg bg-blue-50 border border-blue-200 flex items-center gap-3">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" />
                </svg>
                <div>
                    <span className="text-blue-800 font-semibold">Project:</span>
                    <span className="ml-2 text-xl font-bold text-blue-900">{projectTitle || projectId}</span>
                    <div className="text-blue-700 text-sm mt-1">
                        This page shows all memos for the selected project.
                    </div>
                </div>
            </div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Project Memos</h1>
                </div>
                <button
                    className="px-4 py-2 bg-primary text-white rounded-lg shadow hover:bg-primary/90"
                    onClick={() => navigate(`/admin/memo/${projectId}/create`)}
                >
                    + Create Memo
                </button>
            </div>
            <ProjectMemoFilter onFilter={handleFilter} />
            <ProjectMemoTable memos={filteredMemos} onMemosUpdate={fetchMemos} />
        </div>
    );
}

export default ProjectMemoList;