// src/components/ProjectTable.js
import React from "react";
import { useNavigate } from "react-router-dom";
import StatusBadge from "./StatusBadge";

function ProjectTable({ projects }) {
    const navigate = useNavigate();

    const handleViewProject = (projectId) => {
        navigate(`/admin/project/detail/${projectId}`);
    };

    const handleEditProject = (projectId) => {
        navigate(`/admin/project/edit/${projectId}`);
    }

    const handleDeleteProject = (projectId) => {
        // Implement delete logic here
        console.log(`Delete project ${projectId}`);
    }

    return (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-x-auto">
            <table className="min-w-full table-fixed text-sm text-left">
                <thead className="bg-gray-100 text-gray-700">
                <tr>
                    <th className="px-4 py-2 w-[6%]">Code</th>
                    <th className="px-4 py-2 w-[18%]">Project Title</th>
                    <th className="px-4 py-2 w-[15%]">Faculty</th>
                    <th className="px-4 py-2 w-[15%]">Lead Consultant</th>
                    <th className="px-4 py-2 w-[10%]">Status</th>
                    <th className="px-4 py-2 w-[10%]">Funder</th>
                    <th className="px-4 py-2 w-[10%]">Start Date</th>
                    <th className="px-4 py-2 w-[10%]">End Date</th>
                    <th className="px-4 py-2 w-[10%]">Funding (RM)</th>
                    <th className="px-4 py-2 w-[12%]">Management</th>
                </tr>
                </thead>
                <tbody>
                {projects.length > 0 ? (
                    projects.map((p) => (
                        <tr key={p.id} className="border-t">
                            <td className="px-4 py-2 truncate">{p.code}</td>
                            <td className="px-4 py-2 break-words">{p.title}</td>
                            <td className="px-4 py-2 truncate">{p.faculty}</td>
                            <td className="px-4 py-2 truncate">{p.staff}</td>
                            <td className="px-4 py-2 truncate">
                                <StatusBadge status={p.status}/>
                            </td>
                            <td className="px-4 py-2 truncate">{p.funder}</td>
                            <td className="px-4 py-2 truncate">{p.startDate}</td>
                            <td className="px-4 py-2 truncate">{p.endDate}</td>
                            <td className="px-4 py-2 truncate">{p.amount.toLocaleString()}</td>
                            <td className="px-4 py-2">
                                <button
                                    onClick={() => handleViewProject(p.id)}
                                    className="px-3 py-1 text-xs bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                                >
                                    View
                                </button>
                                <button
                                    onClick={() =>handleEditProject(p.id)}
                                    className="px-3 py-1 text-xs bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDeleteProject(p.id)}
                                    className="px-3 py-1 text-xs bg-red-100 text-red-800 rounded hover:bg-red-200"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td
                            colSpan="10"
                            className="px-4 py-4 text-center text-gray-500"
                        >
                            No projects found.
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
}

export default ProjectTable;
