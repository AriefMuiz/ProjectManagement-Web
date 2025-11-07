import React, { useEffect, useState } from "react";
import { useOutletContext, useParams, useNavigate } from "react-router-dom";
import memoAPI from "../../../../fetch/admin/memo.js";

export default function ProjectMemoDetail() {
    const { setBreadcrumbItems, defaultBreadcrumb } = useOutletContext();
    const { projectId, memoId } = useParams();
    const [memo, setMemo] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (setBreadcrumbItems) {
            setBreadcrumbItems([
                ...defaultBreadcrumb,
                { label: projectId, href: `/admin/memo/list/${projectId}` },
                { label: `Memo ${memoId}`, href: "" }
            ]);
        }
        return () => {
            if (setBreadcrumbItems) setBreadcrumbItems(defaultBreadcrumb);
        };
    }, [projectId, memoId, setBreadcrumbItems, defaultBreadcrumb]);

    useEffect(() => {
        const fetchMemo = async () => {
            try {
                const res = await memoAPI.getMemoById(memoId);
                setMemo(res.data || res); // handle both axios and direct object
            } catch (err) {
                setMemo(null);
                // Optionally handle error
                console.error("Failed to fetch memo details:", err);
            }
        };
        fetchMemo();
    }, [memoId]);

    if (!memo) {
        return <div className="p-6">Loading memo details...</div>;
    }

    // Use items instead of payments
    const payments = memo.payments || memo.items || [];

    return (
        <div className="max-w-5xl min-w-[600px] mx-auto p-6 border rounded-lg shadow-md bg-white">
            {/* Header */}
            <div className="text-center mb-6">
                <h2 className="font-bold text-lg">MEMO</h2>
                <p>Reference No.: {memo.referenceNo}</p>
            </div>

            {/* From/To Section */}
            <div className="mb-4 text-sm">
                <p><strong>From:</strong> {memo.from}</p>
                <p><strong>To:</strong> {memo.to}</p>
                <p><strong>Project Code:</strong> {memo.projectCode}</p>
                <p><strong>Date:</strong> {memo.date}</p>
                <p><strong>Subject:</strong> {memo.subject}</p>
                <p className="mt-2"><strong>Description:</strong> {memo.description}</p>
            </div>

            {/* Payment Table */}
            <div className="space-y-4 mb-6 text-sm">
                {payments.map((item, idx) => (
                    <div key={idx} className="border p-3 rounded-lg">
                        <p><strong>NAME:</strong> {item.name}</p>
                        <p><strong>BANK:</strong> {item.bank}</p>
                        <p><strong>ACCOUNT NO.:</strong> {item.acc}</p>
                        <p><strong>AMOUNT (RM):</strong> {item.amount}</p>
                        <p><strong>JUSTIFICATION:</strong> {item.justification}</p>
                    </div>
                ))}
            </div>

            {/* Approval Section */}
            <div className="grid grid-cols-3 border text-sm divide-x">
                {["Prepared by:", "Supported by:", "Approved by:"].map((title, idx) => (
                    <div key={idx} className="p-3 text-center">
                        <p className="font-semibold">{title}</p>
                        <div className="mt-6 mb-2">
                            <p>Signature:</p>
                            <p className="h-8 border-b border-gray-400 w-32 mx-auto"></p>
                        </div>
                        <p>Date: __________</p>
                        <p>Name: __________</p>
                        <p>Position: __________</p>
                    </div>
                ))}
            </div>

            {/* Buttons */}
            <div className="flex justify-center gap-4 mt-6">
                <button
                    className="px-4 py-2 bg-gray-300 rounded-lg shadow"
                    onClick={() => navigate(-1)}
                >
                    BACK
                </button>
                <button className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow">PRINT MEMO</button>
                <button className="px-4 py-2 bg-green-500 text-white rounded-lg shadow">DOWNLOAD PDF</button>
            </div>
        </div>
    );
}