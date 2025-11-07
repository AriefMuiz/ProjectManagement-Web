import React from "react";
import { useNavigate } from "react-router-dom";

function MemoTable({ memos }) {
    const navigate = useNavigate();

    const handleViewMemo = (projectId) => {
        navigate(`/admin/memo/list/${projectId}`);
    }

    return (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-x-auto">
            <table className="min-w-full table-fixed text-sm text-left">
                <thead className="bg-gray-100 text-gray-700">
                    <tr>
                        <th className="px-4 py-2 w-[5%]">No</th>
                        <th className="px-4 py-2 w-[15%]">Project ID</th>
                        <th className="px-4 py-2 w-[25%]">Title</th>
                        <th className="px-4 py-2 w-[10%]">Memo Count</th>
                        <th className="px-4 py-2 w-[15%]">Paid Memo Count</th>
                        <th className="px-4 py-2 w-[15%]">Pending Memo Count</th>
                        <th className="px-4 py-2 w-[15%]">View</th>
                    </tr>
                </thead>
                <tbody>
                    {memos.length > 0 ? (
                        memos.map((memo, idx) => (
                            <tr key={memo.projectId} className="border-t hover:bg-gray-50 transition">
                                <td className="px-4 py-2">{idx + 1}</td>
                                <td className="px-4 py-2">{memo.projectId}</td>
                                <td className="px-4 py-2">{memo.title}</td>
                                <td className="px-4 py-2">{memo.memoCount}</td>
                                <td className="px-4 py-2">{memo.paidMemoCount}</td>
                                <td className="px-4 py-2">{memo.pendingMemoCount}</td>
                                <td className="px-4 py-2">
                                    <button
                                        onClick={() => handleViewMemo(memo.projectId)}
                                        className="px-3 py-1 text-xs bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                                    >
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={7} className="px-4 py-4 text-center text-gray-500">
                                No memos found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default MemoTable;