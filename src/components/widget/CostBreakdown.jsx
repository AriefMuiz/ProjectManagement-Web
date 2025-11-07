import React, { useEffect } from "react";

const sectionStyle = "bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden mb-6";
const sectionHeader = "bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center";
const sectionTitle = "text-lg font-medium text-gray-700";
const sectionTotal = "bg-blue-50 text-blue-700 px-3 py-1 rounded-md text-sm font-medium";

function handleItemChange(items, idx, field, value, setFormData, key) {
    const updated = items.map((item, i) =>
        i === idx ? { ...item, [field]: field === "paymentAmount" ? parseFloat(value) || 0 : value } : item
    );
    setFormData(prev => ({ ...prev, [key]: updated }));
}


function handleRemoveItem(items, idx, setFormData, key) {
    setFormData(prev => ({ ...prev, [key]: items.filter((_, i) => i !== idx) }));
}

const CostBreakdown = ({ formData, setFormData }) => {
    // Get arrays from formData with default empty arrays
    const directCost = formData.directCost || [];
    const finderReward = formData.finderReward || [];
    const managementFee = formData.managementFee || [];
    const projectConsultant = formData.projectConsultant || [];

    // Calculate section totals
    const consultantPaymentsTotal = Object.values(formData.consultantPayments || {}).reduce((sum, p) => sum + (parseFloat(p) || 0), 0);
    const directCostTotal = directCost.reduce((sum, item) => sum + (parseFloat(item.paymentAmount) || 0), 0);
    const finderRewardTotal = finderReward.reduce((sum, item) => sum + (parseFloat(item.paymentAmount) || 0), 0);

    // Management fee is 15% of consultant payments + direct cost
    const managementFeeBaseAmount = 0.15 * (consultantPaymentsTotal + directCostTotal);
    const managementFeeTotal = managementFee.length > 0 ? managementFeeBaseAmount : 0;

    const totalProjectCostBeforeSST = consultantPaymentsTotal + directCostTotal + finderRewardTotal + managementFeeTotal;

    // SST logic
    const sstEnabled = formData.sstEnabled ?? false;
    useEffect(() => {
        setFormData(prev => ({ ...prev, sstPercentage: sstEnabled ? 6 : 0 }));
    }, [sstEnabled, setFormData]);
    const sstAmount = sstEnabled ? 0.06 * totalProjectCostBeforeSST : 0;
    const totalCost = totalProjectCostBeforeSST + sstAmount;

    // Sync totals to formData
    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            consultantPaymentsTotal,
            directCostTotal,
            finderRewardTotal,
            managementFeeTotal,
            sstAmount,
            totalCost,
        }));
    }, [
        consultantPaymentsTotal,
        directCostTotal,
        finderRewardTotal,
        managementFeeTotal,
        sstAmount,
        totalCost,
        setFormData
    ]);

    // In CostBreakdown.jsx
    // Add this useEffect to update the percentCharged and paymentAmount whenever relevant values change
    useEffect(() => {
        if (managementFee.length > 0) {
            // If there's 1 organization, they get 100% of the fee
            // If there are 2, each gets 50%, etc.
            const percentPerOrg = 100 / managementFee.length;

            // The total fee amount is still 15% of base amounts
            const amountPerOrg = managementFeeBaseAmount / managementFee.length;

            // Update both managedBy and calculated values
            const updatedFees = managementFee.map(item => ({
                ...item,
                percent: percentPerOrg,
                paymentAmount: amountPerOrg
            }));

            setFormData(prev => ({
                ...prev,
                managementFee: updatedFees
            }));
        }
    }, [managementFee.length, managementFeeBaseAmount, setFormData]);

// Update handleAddItem function for management fee
    function handleAddManagementFee(items, setFormData) {
        // Calculate percentage of the total 15% fee this organization will get
        const percentPerOrg = 100 / (items.length + 1);

        // The base fee amount (15% of consultant payments + direct cost)
        const baseAmount = 0.15 * (
            Object.values(formData.consultantPayments || {}).reduce((sum, p) => sum + (parseFloat(p) || 0), 0) +
            (formData.directCost || []).reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0)
        );

        // Each org's share of the management fee
        const amountPerOrg = baseAmount / (items.length + 1);

        // Create new management fee entry
        const newItem = {
            managedBy: "",
            percent: percentPerOrg,
            paymentAmount: amountPerOrg
        };

        setFormData(prev => ({
            ...prev,
            managementFee: [...items, newItem]
        }));
    }

    function handleAddItem(items, setFormData, key, defaultItem = { finderName: "", paymentAmount: 0 }) {
        if (key === "finderReward") {
            const baseAmount = consultantPaymentsTotal + directCostTotal;
            const paymentAmount = baseAmount * 0.05;
            setFormData(prev => ({
                ...prev,
                [key]: [...items, { finderName: "", percent: 5, paymentAmount: paymentAmount }]
            }));
        } else {
            setFormData(prev => ({ ...prev, [key]: [...items, defaultItem] }));
        }
    }

    return (
        <div className="p-6">
            {/* Section A: Payment to Consultants */}
            <div className={sectionStyle}>
                <div className={sectionHeader}>
                    <h3 className={sectionTitle}>Section A: Payment to Consultants</h3>
                    <div className={sectionTotal}>Total: RM {consultantPaymentsTotal.toFixed(2)}</div>
                </div>
                <div className="p-4">
                    {projectConsultant.length > 0 ? (
                        <table className="w-full text-sm">
                            <thead>
                            <tr className="bg-gray-50">
                                <th className="px-4 py-2 text-left font-medium text-gray-700 border-b">Staff ID</th>
                                <th className="px-4 py-2 text-left font-medium text-gray-700 border-b">Consultant Name</th>
                                <th className="px-4 py-2 text-left font-medium text-gray-700 border-b">Project Role</th>
                                <th className="px-4 py-2 text-right font-medium text-gray-700 border-b">Payment Amount
                                    (RM)
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                           {projectConsultant.map((member) => (
                                <tr key={member.staffId} className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="px-4 py-3">
                                        <div className="font-medium">{member.staffId}</div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="font-medium">{member.name}</div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span
                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${
                                                member.projectRole === "Leader"
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-gray-100 text-gray-800"
                                            }`}
                                        >
                                            {member.projectRole === "Leader" ? "Project Leader" : "Consultant"}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <input
                                            type="number"
                                            value={formData.consultantPayments?.[member.staffId] || ""}
                                            onChange={(e) => {
                                                const paymentAmount = parseFloat(e.target.value) || 0;

                                                // Update consultantPayments object for calculations
                                                const updatedPayments = {...(formData.consultantPayments || {})};
                                                updatedPayments[member.staffId] = paymentAmount;

                                                // Also update the paymentAmount in the projectConsultant array
                                                const updatedConsultants = (formData.projectConsultant || []).map(consultant =>
                                                    consultant.staffId === member.staffId
                                                        ? {...consultant, paymentAmount}
                                                        : consultant
                                                );

                                                setFormData((prev) => ({
                                                    ...prev,
                                                    consultantPayments: updatedPayments,
                                                    projectConsultant: updatedConsultants
                                                }));
                                            }}
                                            className="input input-bordered w-full max-w-xs text-right"
                                            placeholder="0.00"
                                            min="0"
                                            step="100"
                                        />
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md text-yellow-700">
                            No project members added yet. Please add consultants in the previous step before allocating payments.
                        </div>
                    )}
                </div>
            </div>

            {/* Section B: Direct Cost */}
            <div className={sectionStyle}>
                <div className={sectionHeader}>
                    <h3 className={sectionTitle}>Section B: Direct Cost</h3>
                    <div className={sectionTotal}>Total: RM {directCostTotal.toFixed(2)}</div>
                </div>
                <div className="p-4">
                    {directCost.map((item, idx) => (
                        <div key={idx} className="flex gap-4 mb-3 items-center">
                            <input
                                type="text"
                                className="input input-bordered flex-1"
                                placeholder="Item"
                                value={item.item || ""} // Ensure a default value of an empty string
                                onChange={e => handleItemChange(directCost, idx, "item", e.target.value, setFormData, "directCost")}
                            />
                            <input
                                type="number"
                                className="input input-bordered w-32 text-right"
                                placeholder="0.00"
                                min="0"
                                step="100"
                                value={item.paymentAmount || 0} // Ensure a default value of 0
                                onChange={e => handleItemChange(directCost, idx, "paymentAmount", e.target.value, setFormData, "directCost")}
                            />
                            <button
                                type="button"
                                className="btn btn-sm btn-outline btn-error"
                                onClick={() => handleRemoveItem(directCost, idx, setFormData, "directCost")}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none"
                                     viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                </svg>
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        className="btn btn-outline btn-primary mt-2"
                        onClick={() => handleAddItem(directCost, setFormData, "directCost")}
                    >Add Direct Cost
                    </button>
                </div>
            </div>

            {/* Section C: Finders Reward */}
            <div className={sectionStyle}>
                <div className={sectionHeader}>
                    <h3 className={sectionTitle}>Section C: Finders Reward</h3>
                    <div className={sectionTotal}>Total: RM {finderRewardTotal.toFixed(2)}</div>
                </div>
                <div className="p-4">
                            {finderReward.map((item, idx) => {
                                // Calculate payment amount as 5% of total consultant cost + direct cost
                                const baseAmount = consultantPaymentsTotal + directCostTotal;
                                const paymentAmount = baseAmount * 0.05;

                                // Update the item with calculated amount if needed
                                if (item.paymentAmount !== paymentAmount) {
                                    setTimeout(() => {
                                        handleItemChange(finderReward, idx, "paymentAmount", paymentAmount, setFormData, "finderReward");
                                        handleItemChange(finderReward, idx, "percent", 5, setFormData, "finderReward");
                                    }, 0);
                                }

                                return (
                                    <div key={idx} className="flex gap-4 mb-3 items-center">
                                        <input
                                            type="text"
                                            className="input input-bordered flex-1"
                                            placeholder="Finder Name"
                                            value={item.finderName}
                                            onChange={e => handleItemChange(finderReward, idx, "finderName", e.target.value, setFormData, "finderReward")}
                                        />
                                        <input
                                            type="text"
                                            className="input input-bordered w-20 text-right"
                                            value="5%"
                                            readOnly
                                        />
                                        <input
                                            type="number"
                                            className="input input-bordered w-32 text-right"
                                            value={paymentAmount.toFixed(2)}
                                            readOnly
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-outline btn-error"
                                            onClick={() => handleRemoveItem(finderReward, idx, setFormData, "finderReward")}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none"
                                                 viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                            </svg>
                                        </button>
                                    </div>
                                );
                            })}
                    <button
                        type="button"
                        className="btn btn-outline btn-primary mt-2"
                        onClick={() => handleAddItem(finderReward, setFormData, "finderReward")}
                    >Add Finders Reward
                    </button>
                </div>
            </div>

            {/* Section D: Management Fee */}
            <div className={sectionStyle}>
                <div className={sectionHeader}>
                    <h3 className={sectionTitle}>Section D: Management Fee</h3>
                    <div className={sectionTotal}>
                        Total: RM {managementFeeTotal.toFixed(2)}
                    </div>
                </div>
                <div className="p-4">
                    {managementFee.map((item, idx) => (
                        <div key={idx} className="flex gap-4 mb-3 items-center">
                            <select
                                className="select select-bordered flex-1"
                                value={item.managedBy}
                                onChange={e => handleItemChange(managementFee, idx, "managedBy", e.target.value, setFormData, "managementFee")}
                            >
                                <option value="">Select Organization</option>
                                <option
                                    value="UTeM"
                                    disabled={managementFee.some((i, index) => i.managedBy === "UTeM" && index !== idx)}
                                >
                                    UTeM
                                </option>
                                <option
                                    value="UHSB"
                                    disabled={managementFee.some((i, index) => i.managedBy === "UHSB" && index !== idx)}
                                >
                                    UHSB
                                </option>
                            </select>
                            <input
                                type="number"
                                className="input input-bordered w-32 text-right"
                                value={managementFee.length > 0 ? (managementFeeBaseAmount / managementFee.length).toFixed(2) : "0.00"}
                                readOnly
                            />
                            <button
                                type="button"
                                className="btn btn-sm btn-outline btn-error"
                                onClick={() => handleRemoveItem(managementFee, idx, setFormData, "managementFee")}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none"
                                     viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                </svg>
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        className="btn btn-outline btn-primary mt-2"
                        onClick={() => handleAddManagementFee(managementFee, setFormData)}
                        disabled={managementFee.length >= 2 ||
                            (managementFee.some(item => item.managedBy === "UTeM") &&
                                managementFee.some(item => item.managedBy === "UHSB"))}
                    >
                        Add Management Fee
                    </button>
                </div>
            </div>

            {/* Section E: SST */}
            <div className={sectionStyle}>
                <div className={sectionHeader}>
                    <h3 className={sectionTitle}>Section E: SST (6%)</h3>
                    <div className={sectionTotal}>RM {sstAmount.toFixed(2)}</div>
                </div>
                <div className="p-4 text-gray-600 flex items-center gap-4">
                    <input
                        type="checkbox"
                        checked={sstEnabled}
                        onChange={e => setFormData(prev => ({ ...prev, sstEnabled: e.target.checked }))}
                        id="sst-checkbox"
                        className="checkbox"
                    />
                    <label htmlFor="sst-checkbox" className="cursor-pointer">
                        Apply SST (6%) to this project
                    </label>
                </div>
            </div>

            {/* Grand Total */}
            <div className="mt-8 p-4 bg-gray-100 rounded-lg border border-gray-200">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-800">
                        Total Project Cost
                    </h3>
                    <div className="text-xl font-bold text-blue-700">
                        RM {totalCost.toFixed(2)}
                    </div>
                </div>
                <div className="mt-4 space-y-2">
                    <div className="flex justify-between">
                        <span className="text-gray-600">Section A: Payment to Consultants</span>
                        <span className="text-gray-800 font-medium">
                            RM {consultantPaymentsTotal.toFixed(2)}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Section B: Direct Cost</span>
                        <span className="text-gray-800 font-medium">
                            RM {directCostTotal.toFixed(2)}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Section C: Finders Reward</span>
                        <span className="text-gray-800 font-medium">
                            RM {finderRewardTotal.toFixed(2)}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Section D: Management Fee</span>
                        <span className="text-gray-800 font-medium">
                            RM {managementFeeTotal.toFixed(2)}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Section E: SST Amount</span>
                        <span className="text-gray-800 font-medium">
                            RM {sstAmount.toFixed(2)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CostBreakdown;