import React, {useState} from 'react';
import {useNavigate} from "react-router-dom";
import Toast from "../ui/Toast.jsx";
import memoAPI from "../../fetch/admin/memo.js";

const ProjectMemoTable = ({memos = [], onMemosUpdate}) => {
    const navigate = useNavigate();
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");

    const handleAddMemo = (projectId) => {
        navigate(`/admin/memo/create/${projectId}`);
    };

    const handleViewMemo = (projectId, memoId) => {
        navigate(`/admin/memo/detail/${projectId}/${memoId}`);
    };

    const handleDownloadPdf = (memoId) => {
        alert(`Download PDF for Memo ${memoId}`);
    };

    const handleMarkAsPaid = async (projectId, memoId) => {
        try {
            await memoAPI.markAsPaid(memoId);
            setToastMessage("Marked as paid!");
            setShowToast(true);
            setTimeout(() => setShowToast(false), 2000);
            if (onMemosUpdate) onMemosUpdate(); // Refresh memos
        } catch (err) {
            setToastMessage("Failed to mark as paid");
            setShowToast(true);
            setTimeout(() => setShowToast(false), 2000);
        }
    };

    return (
        <div className="mb-8">
            <div className="overflow-x-auto rounded-lg shadow border border-gray-200 bg-white">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700">Reference No</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700">Subject</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700">Description</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700">Date Created</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700">Status</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700">Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {memos.length > 0 ? memos.map(memo => (
                        <tr key={memo.memoId} className="border-t border-gray-100 hover:bg-gray-50 transition">
                            <td className="px-4 py-3">{memo.referenceNo}</td>
                            <td className="px-4 py-3">{memo.subject}</td>
                            <td className="px-4 py-3">{memo.description}</td>
                            <td className="px-4 py-3">{memo.date}</td>
                            <td className="px-4 py-3">
                                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                                    memo.status === 'Open' || memo.status === 'paid'
                                        ? 'bg-green-100 text-green-700'
                                        : memo.status === 'pending'
                                            ? 'bg-yellow-100 text-yellow-700'
                                            : memo.status === 'rejected'
                                                ? 'bg-red-100 text-red-700'
                                                : 'bg-gray-100 text-gray-600'
                                }`}>
                                    {memo.status?.toUpperCase()}
                                </span>
                            </td>
                            <td className="px-4 py-3 flex gap-2">
                                <button
                                    className="bg-gray-200 text-gray-800 px-3 py-1 rounded-lg shadow-sm hover:bg-gray-300 transition"
                                    onClick={() => handleViewMemo(memo.projectId, memo.memoId)}
                                >
                                    View
                                </button>
                                <button
                                    className="bg-blue-500 text-white px-3 py-1 rounded-lg shadow-sm hover:bg-blue-600 transition flex items-center gap-1"
                                    onClick={() => handleDownloadPdf(memo.memoId)}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none"
                                         viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d="M12 4v16m8-8H4"/>
                                    </svg>
                                    Download PDF
                                </button>
                                {memo.status === "pending" && (
                                    <button
                                        className="px-3 py-1 bg-green-600 text-white rounded"
                                        onClick={() => handleMarkAsPaid(memo.projectId, memo.memoId)}
                                    >
                                        Mark as Paid
                                    </button>
                                )}
                            </td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan={4} className="px-4 py-3 text-center text-gray-500 italic">
                                No memos for this project
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
                {showToast && (
                    <Toast
                        message={toastMessage}
                        type="success"
                        onClose={() => setShowToast(false)}
                    />
                )}
            </div>
        </div>
    );
};

export default ProjectMemoTable;