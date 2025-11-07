import React, {useState, useEffect} from 'react';
import {useNavigate, useOutletContext, useParams} from "react-router-dom";
import projectsAPI from "../../../../fetch/admin/projects.js";
import memoAPI from "../../../../fetch/admin/memo.js";
import Toast from "../../../../components/ui/Toast.jsx";

const MemoCreate = ({projectCode}) => {
    const {setBreadcrumbItems, defaultBreadcrumb} = useOutletContext();
    const {projectId} = useParams();
    const [members, setMembers] = useState([]);
    const [referenceNo, setReferenceNo] = useState('');
    const today = new Date().toISOString().split('T')[0];
    const [items, setItems] = useState([{
        category: "",
        item: "",
        name: "",
        bank: "",
        acc: "",
        amount: "",
        justification: ""
    }]);
    const [form, setForm] = useState({
        from: '', to: '', projectCode: projectCode || '', date: today, subject: '', description: ''
    });
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const navigate = useNavigate();
    const [cost, setCost] = useState(null);

    useEffect(() => {
        setReferenceNo(generateReferenceNo(projectId));
    }, [projectId]);

    useEffect(() => {
        if (setBreadcrumbItems) {
            setBreadcrumbItems([...defaultBreadcrumb, {
                label: projectId,
                href: `/admin/memo/list/${projectId}`
            }, {label: "Create", href: ``}]);
        }
        return () => {
            if (setBreadcrumbItems) {
                setBreadcrumbItems(defaultBreadcrumb);
            }
        };
    }, [projectId, setBreadcrumbItems, defaultBreadcrumb]);

    useEffect(() => {
        if (!projectId) {
            setCost(null);
            setMembers([]);
            return;
        }

        const fetchData = async () => {
            try {
                const [membersRes, costRes] = await Promise.all([projectsAPI.getConsultantsWithBank(projectId), projectsAPI.getCostDetail(projectId)]);
                setMembers(membersRes); // Use real API response
                setCost(costRes);
            } catch (err) {
                setCost(null);
                setMembers([]);
                console.error("Failed to fetch cost or members:", err);
            }
        };

        fetchData();
    }, [projectId]);

    const handleFormChange = (e) => {
        setForm({...form, [e.target.name]: e.target.value});
    };

    const handleItemChange = (idx, field, value) => {
        const updated = [...items];
        updated[idx][field] = value;
        setItems(updated);
    };

    const addItem = () => {
        setItems([...items, {name: '', bank: '', acc: '', amount: '', justification: ''}]);
    };

    const removeItem = (idx) => {
        setItems(items.filter((_, i) => i !== idx));
    };

    const handleGenerateMemo = async () => {
        const reqBody = {
            referenceNo,
            from: form.from,
            to: form.to,
            projectCode: projectId,
            date: form.date,
            subject: form.subject,
            description: form.description,
            items: items.map(item => ({
                category: item.category,
                item: item.item,
                name: item.name,
                bank: item.bank,
                acc: item.acc,
                amount: Number(item.amount),
                justification: item.justification
            }))
        };

        try {
            const res = await memoAPI.createMemo(reqBody);
            console.log("Memo created successfully:", res);
            setToastMessage("Memo created successfully!");
            setShowToast(true);

            setTimeout(() => {
                navigate(`/admin/memo/list/${projectId}`);
            }, 1500);
        } catch (err) {
            console.error(err);
            setToastMessage("Error: " + (err.message || "Failed to create memo"));
            setShowToast(true);
        }
    };

    return (<div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="max-w-12xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Payment Memo Form */}
                <div className="bg-white shadow-lg rounded-xl p-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Create Payment Memo</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Reference No.</label>
                            <input
                                type="text"
                                value={referenceNo}
                                readOnly
                                className="w-full border rounded-lg px-3 py-2 bg-gray-100 text-gray-700"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">From</label>
                            <input
                                type="text"
                                name="from"
                                value={form.from}
                                onChange={handleFormChange}
                                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g. Ahmad (Project Manager)"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">To</label>
                            <input
                                type="text"
                                name="to"
                                value={form.to}
                                onChange={handleFormChange}
                                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g. Maisarah (Finance Department)"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Project Code</label>
                            <input
                                type="text"
                                name="projectCode"
                                value={projectId}
                                readOnly
                                className="w-full border rounded-lg px-3 py-2 bg-gray-100 text-gray-700"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Date</label>
                            <input
                                type="date"
                                name="date"
                                value={form.date}
                                onChange={handleFormChange}
                                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-600 mb-1">Subject</label>
                            <input
                                type="text"
                                name="subject"
                                value={form.subject}
                                onChange={handleFormChange}
                                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Subject"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-600 mb-1">Description</label>
                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleFormChange}
                                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows={3}
                                placeholder="Description"
                            />
                        </div>
                    </div>

                    <h3 className="text-lg font-medium text-gray-700 mb-2">Payment Items</h3>
                    <div className="space-y-4 mb-4">
                        {items.map((item, idx) => (<div key={idx}
                                                        className="bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm relative">
                                {items.length > 1 && (<button
                                        type="button"
                                        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                                        onClick={() => removeItem(idx)}
                                    >
                                        &times;
                                    </button>)}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Category */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-1">Category</label>
                                        <select
                                            className="w-full border rounded-lg px-3 py-2"
                                            value={item.category}
                                            onChange={e => handleCategoryChange(idx, e.target.value)}
                                        >
                                            <option value="">Select Category</option>
                                            {CATEGORY_OPTIONS.map(opt => (
                                                <option key={opt.value} value={opt.value}>{opt.label}</option>))}
                                        </select>
                                    </div>
                                    {/* Item */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-1">Item</label>
                                        {getItemOptions(item.category).length > 0 ? (<select
                                                className="w-full border rounded-lg px-3 py-2"
                                                value={item.item}
                                                onChange={e => handleItemChangeDropdown(idx, e.target.value)}
                                            >
                                                <option value="">Select Item</option>
                                                {getItemOptions(item.category).map(opt => (
                                                    <option key={opt.value} value={opt.value}>{opt.label}</option>))}
                                            </select>) : (<input
                                                type="text"
                                                className="w-full border rounded-lg px-3 py-2"
                                                value={item.name}
                                                onChange={e => handleItemChange(idx, "name", e.target.value)}
                                                placeholder="Enter item name"
                                            />)}
                                    </div>
                                    {/* Name */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-1">Name</label>
                                        <input
                                            type="text"
                                            className="w-full border rounded-lg px-3 py-2"
                                            value={item.name}
                                            onChange={e => handleItemChange(idx, "name", e.target.value)}
                                            readOnly={item.category === "consultant"}
                                            placeholder="Name"
                                        />
                                    </div>
                                    {/* Bank */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-1">Bank</label>
                                        <input
                                            type="text"
                                            className="w-full border rounded-lg px-3 py-2"
                                            value={item.bank}
                                            onChange={e => handleItemChange(idx, "bank", e.target.value)}
                                            readOnly={item.category === "consultant"}
                                            placeholder="Bank"
                                        />
                                    </div>
                                    {/* Account No */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-1">Account
                                            No.</label>
                                        <input
                                            type="text"
                                            className="w-full border rounded-lg px-3 py-2"
                                            value={item.acc}
                                            onChange={e => handleItemChange(idx, "acc", e.target.value)}
                                            readOnly={item.category === "consultant"}
                                            placeholder="Account Number"
                                        />
                                    </div>
                                    {/* Amount */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-1">Amount
                                            (RM)</label>
                                        <input
                                            type="number"
                                            name="amount"
                                            value={item.amount}
                                            min={0}
                                            max={getBalanceUnpaid(item, item.category)}
                                            onChange={e => {
                                                const val = parseFloat(e.target.value) || 0;
                                                const max = getBalanceUnpaid(item, item.category);
                                                if (val > max) {
                                                    alert("Amount cannot exceed balance unpaid (RM " + max.toFixed(2) + ")");
                                                    return;
                                                }
                                                handleItemChange(idx, "amount", val);
                                            }}
                                            className="w-full border rounded-lg px-3 py-2"
                                        />
                                        <span className="text-xs text-gray-500">
    Max: RM {getBalanceUnpaid(item, item.category).toFixed(2)}
</span>
                                    </div>
                                    {/* Justification */}
                                    <div className="md:col-span-2">
                                        <label
                                            className="block text-sm font-medium text-gray-600 mb-1">Justification</label>
                                        <input
                                            type="text"
                                            className="w-full border rounded-lg px-3 py-2"
                                            value={item.justification}
                                            onChange={e => handleItemChange(idx, "justification", e.target.value)}
                                            placeholder="Justification"
                                        />
                                    </div>
                                </div>
                            </div>))}
                    </div>
                    <button
                        type="button"
                        className="mb-6 bg-gray-100 text-blue-700 px-4 py-2 rounded-lg shadow-sm hover:bg-blue-50 transition font-medium"
                        onClick={addItem}
                    >
                        + Add Item
                    </button>
                    <div className="flex justify-end">
                        <button
                            type="button"
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition font-semibold"
                            onClick={handleGenerateMemo}
                        >
                            Generate Memo
                        </button>
                    </div>
                </div>

                {/* Cost Breakdown Section */}
                <div className="bg-white shadow-lg rounded-xl p-8">
                    <h3 className="text-xl font-semibold text-blue-800 mb-6">Cost Breakdown</h3>
                    {!cost ? (<div className="text-gray-400">Loading...</div>) : (<div className="space-y-6">
                            {/* Initial, Paid, Unpaid */}
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <div className="text-xs text-gray-500">Initial Cost</div>
                                    <div className="text-lg font-bold text-blue-700">
                                        RM {cost.totalCost.toFixed(2)}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-xs text-gray-500">Paid</div>
                                    <div className="text-lg font-bold text-green-600">
                                        RM {cost.paid.toFixed(2)}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-xs text-gray-500">Pending</div>
                                    <div className="text-lg font-bold text-orange-500">
                                        RM {(cost.pending ?? 0).toFixed(2)}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-xs text-gray-500">Unpaid</div>
                                    <div className="text-lg font-bold text-red-500">
                                        RM {cost.unpaid.toFixed(2)}
                                    </div>
                                </div>
                            </div>
                            {/* Section A: Consultants */}
                            <div>
                                <h4 className="text-md font-medium mb-2 text-gray-700">Section A: Payment to
                                    Consultants</h4>
                                <table className="w-full text-sm mb-2">
                                    <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-4 py-2 text-left font-semibold text-gray-700">Consultant</th>
                                        <th className="px-4 py-2 text-right font-semibold text-gray-700">Payment (RM)
                                        </th>
                                        <th className="px-4 py-2 text-right font-semibold text-green-700">Paid (RM)</th>
                                        <th className="px-4 py-2 text-right font-semibold text-orange-600">Pending
                                            (RM)
                                        </th>
                                        <th className="px-4 py-2 text-right font-semibold text-red-700">Balance Unpaid
                                            (RM)
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {cost.sectionA.map((member, idx) => (
                                        <tr key={idx} className="border-t border-gray-200 hover:bg-gray-50 transition">
                                            <td className="px-4 py-2">{member.name}</td>
                                            <td className="px-4 py-2 text-right">{member.payment.toFixed(2)}</td>
                                            <td className="px-4 py-2 text-right text-green-700 font-semibold">
                                                {(member.paid ?? 0).toFixed(2)}
                                            </td>
                                            <td className="px-4 py-2 text-right text-orange-600 font-semibold">
                                                {(member.pending ?? 0).toFixed(2)}
                                            </td>
                                            <td className="px-4 py-2 text-right text-red-600 font-semibold">
                                                {(member.payment - (member.paid ?? 0) - (member.pending ?? 0)).toFixed(2)}
                                            </td>
                                        </tr>))}
                                    <tr className="bg-blue-50 font-medium">
                                        <td className="px-4 py-2">Total Section A</td>
                                        <td className="px-4 py-2 text-right">{cost.sectionATotal.toFixed(2)}</td>
                                        <td className="px-4 py-2 text-right text-green-700">
                                            {(cost.sectionAPaid ?? 0).toFixed(2)}
                                        </td>
                                        <td className="px-4 py-2 text-right text-orange-600">
                                            {(cost.sectionAPending ?? 0).toFixed(2)}
                                        </td>
                                        <td className="px-4 py-2 text-right text-red-600">
                                            {(cost.sectionATotal - (cost.sectionAPaid ?? 0) - (cost.sectionAPending ?? 0)).toFixed(2)}
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>

                            {/* Section B: Direct Cost */}
                            <div>
                                <h4 className="text-md font-medium mb-2 text-gray-700">Section B: Direct Cost</h4>
                                <table className="w-full text-sm mb-2">
                                    <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-4 py-2 text-left font-semibold text-gray-700">Description</th>
                                        <th className="px-4 py-2 text-right font-semibold text-gray-700">Amount (RM)
                                        </th>
                                        <th className="px-4 py-2 text-right font-semibold text-green-700">Paid (RM)</th>
                                        <th className="px-4 py-2 text-right font-semibold text-orange-600">Pending
                                            (RM)
                                        </th>
                                        <th className="px-4 py-2 text-right font-semibold text-red-700">Balance Unpaid
                                            (RM)
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {cost.sectionB.map((item, idx) => (
                                        <tr key={idx} className="border-t border-gray-200 hover:bg-gray-50 transition">
                                            <td className="px-4 py-2">{item.desc}</td>
                                            <td className="px-4 py-2 text-right">{item.amount.toFixed(2)}</td>
                                            <td className="px-4 py-2 text-right text-green-700 font-semibold">
                                                {(item.paid ?? 0).toFixed(2)}
                                            </td>
                                            <td className="px-4 py-2 text-right text-orange-600 font-semibold">
                                                {(item.pending ?? 0).toFixed(2)}
                                            </td>
                                            <td className="px-4 py-2 text-right text-red-600 font-semibold">
                                                {(item.amount - (item.paid ?? 0) - (item.pending ?? 0)).toFixed(2)}
                                            </td>
                                        </tr>))}
                                    <tr className="bg-blue-50 font-medium">
                                        <td className="px-4 py-2">Total Section B</td>
                                        <td className="px-4 py-2 text-right">{cost.sectionBTotal.toFixed(2)}</td>
                                        <td className="px-4 py-2 text-right text-green-700">
                                            {(cost.sectionBPaid ?? 0).toFixed(2)}
                                        </td>
                                        <td className="px-4 py-2 text-right text-orange-600">
                                            {(cost.sectionBPending ?? 0).toFixed(2)}
                                        </td>
                                        <td className="px-4 py-2 text-right text-red-600">
                                            {(cost.sectionBTotal - (cost.sectionBPaid ?? 0) - (cost.sectionBPending ?? 0)).toFixed(2)}
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>

                            {/* Section C: Finders Reward */}
                            <div>
                                <h4 className="text-md font-medium mb-2 text-gray-700">Section C: Finders Reward</h4>
                                <table className="w-full text-sm mb-2">
                                    <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-4 py-2 text-left font-semibold text-gray-700">Description</th>
                                        <th className="px-4 py-2 text-right font-semibold text-gray-700">Amount (RM)
                                        </th>
                                        <th className="px-4 py-2 text-right font-semibold text-green-700">Paid (RM)</th>
                                        <th className="px-4 py-2 text-right font-semibold text-orange-600">Pending
                                            (RM)
                                        </th>
                                        <th className="px-4 py-2 text-right font-semibold text-red-700">Balance Unpaid
                                            (RM)
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {cost.sectionC.map((item, idx) => (
                                        <tr key={idx} className="border-t border-gray-200 hover:bg-gray-50 transition">
                                            <td className="px-4 py-2">{item.desc}</td>
                                            <td className="px-4 py-2 text-right">{item.amount.toFixed(2)}</td>
                                            <td className="px-4 py-2 text-right text-green-700 font-semibold">
                                                {(item.paid ?? 0).toFixed(2)}
                                            </td>
                                            <td className="px-4 py-2 text-right text-orange-600 font-semibold">
                                                {(item.pending ?? 0).toFixed(2)}
                                            </td>
                                            <td className="px-4 py-2 text-right text-red-600 font-semibold">
                                                {(item.amount - (item.paid ?? 0) - (item.pending ?? 0)).toFixed(2)}
                                            </td>
                                        </tr>))}
                                    <tr className="bg-blue-50 font-medium">
                                        <td className="px-4 py-2">Total Section C</td>
                                        <td className="px-4 py-2 text-right">{cost.sectionCTotal.toFixed(2)}</td>
                                        <td className="px-4 py-2 text-right text-green-700">
                                            {(cost.sectionCPaid ?? 0).toFixed(2)}
                                        </td>
                                        <td className="px-4 py-2 text-right text-orange-600">
                                            {(cost.sectionCPending ?? 0).toFixed(2)}
                                        </td>
                                        <td className="px-4 py-2 text-right text-red-600">
                                            {(cost.sectionCTotal - (cost.sectionCPaid ?? 0) - (cost.sectionCPending ?? 0)).toFixed(2)}
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>

                            {/* Section D: Management Fee */}
                            <div>
                                <h4 className="text-md font-medium mb-2 text-gray-700">Section D: Management Fee</h4>
                                <table className="w-full text-sm mb-2">
                                    <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-4 py-2 text-left font-semibold text-gray-700">Description</th>
                                        <th className="px-4 py-2 text-right font-semibold text-gray-700">Amount (RM)
                                        </th>
                                        <th className="px-4 py-2 text-right font-semibold text-green-700">Paid (RM)</th>
                                        <th className="px-4 py-2 text-right font-semibold text-orange-600">Pending
                                            (RM)
                                        </th>
                                        <th className="px-4 py-2 text-right font-semibold text-red-700">Balance Unpaid
                                            (RM)
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {cost.sectionD.map((item, idx) => (
                                        <tr key={idx} className="border-t border-gray-200 hover:bg-gray-50 transition">
                                            <td className="px-4 py-2">{item.desc}</td>
                                            <td className="px-4 py-2 text-right">{item.amount.toFixed(2)}</td>
                                            <td className="px-4 py-2 text-right text-green-700 font-semibold">
                                                {(item.paid ?? 0).toFixed(2)}
                                            </td>
                                            <td className="px-4 py-2 text-right text-orange-600 font-semibold">
                                                {(item.pending ?? 0).toFixed(2)}
                                            </td>
                                            <td className="px-4 py-2 text-right text-red-600 font-semibold">
                                                {(item.amount - (item.paid ?? 0) - (item.pending ?? 0)).toFixed(2)}
                                            </td>
                                        </tr>))}
                                    <tr className="bg-blue-50 font-medium">
                                        <td className="px-4 py-2">Total Section D</td>
                                        <td className="px-4 py-2 text-right">{cost.sectionDTotal.toFixed(2)}</td>
                                        <td className="px-4 py-2 text-right text-green-700">
                                            {(cost.sectionDPaid ?? 0).toFixed(2)}
                                        </td>
                                        <td className="px-4 py-2 text-right text-orange-600">
                                            {(cost.sectionDPending ?? 0).toFixed(2)}
                                        </td>
                                        <td className="px-4 py-2 text-right text-red-600">
                                            {(cost.sectionDTotal - (cost.sectionDPaid ?? 0) - (cost.sectionDPending ?? 0)).toFixed(2)}
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                            {/* Section E: SST */}
                            {cost.sstEnabled && (<div>
                                    <h4 className="text-md font-medium mb-2 text-gray-700">Section E: SST (6%)</h4>
                                    <div className="flex justify-between px-4 py-3 border rounded bg-gray-50">
                                        <span>SST Amount</span>
                                        <span>RM {cost.sstAmount.toFixed(2)}</span>
                                    </div>
                                </div>)}
                        </div>)}
                </div>

                {/* Toast notification */}
                {showToast && (<Toast
                        message={toastMessage}
                        type="success"
                        onClose={() => setShowToast(false)}
                    />)}
            </div>
        </div>);
};

export default MemoCreate;