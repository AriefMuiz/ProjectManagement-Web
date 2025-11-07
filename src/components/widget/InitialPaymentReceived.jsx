import React, { useState, useEffect } from "react";

const sectionStyle = "bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden mb-6";
const sectionHeader = "bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center";
const sectionTitle = "text-lg font-medium text-gray-700";
const sectionTotal = "bg-blue-50 text-blue-700 px-3 py-1 rounded-md text-sm font-medium";

// List of Malaysian banks for dropdown
const BANKS = [
    "Maybank",
    "CIMB Bank",
    "Public Bank",
    "RHB Bank",
    "Hong Leong Bank",
    "AmBank",
    "Bank Islam",
    "Bank Rakyat",
    "OCBC Bank",
    "HSBC Bank",
    "Standard Chartered",
    "Other"
];

const InitialPaymentReceived = ({ formData, setFormData }) => {
    const [totalPaymentReceived, setTotalPaymentReceived] = useState(0);
    const [allocatedAmount, setAllocatedAmount] = useState(0);
    const [errors, setErrors] = useState({});

    const totalProjectCost = formData.totalCost || 0;
    const remainingToAllocate = totalPaymentReceived - allocatedAmount;

    const handleAllocationChange = (items, idx, field, value, key) => {
        // Clear previous errors for this specific field
        if (errors[`${key}-${idx}-${field}`]) {
            setErrors(prev => {
                const newErrors = {...prev};
                delete newErrors[`${key}-${idx}-${field}`];
                return newErrors;
            });
        }

        // Handle validation for allocation amount
        if (field === "allocatedAmount") {
            const numVal = parseFloat(value) || 0;
            const maxAmount = items[idx].paymentAmount || 0;

            if (numVal > maxAmount) {
                setErrors(prev => ({
                    ...prev,
                    [`${key}-${idx}-${field}`]: `Amount exceeds maximum (RM ${maxAmount.toFixed(2)})`
                }));
            }
        }

        const updated = items.map((item, i) =>
            i === idx ? {
                ...item,
                [field]: field === "allocatedAmount" ? parseFloat(value) || 0 : value
            } : item
        );

        setFormData(prev => ({ ...prev, [key]: updated }));
        calculateAllocatedAmount();
    };

    const calculateAllocatedAmount = () => {
        const totalConsultantAllocation = (formData.projectConsultant || [])
            .reduce((sum, item) => sum + (parseFloat(item.allocatedAmount) || 0), 0);

        const totalOtherAllocations = [
            ...(formData.directCost || []),
            ...(formData.finderReward || []),
            ...(formData.managementFee || []),
        ].reduce((sum, item) => sum + (parseFloat(item.allocatedAmount) || 0), 0);

        setAllocatedAmount(totalConsultantAllocation + totalOtherAllocations);
    };

    useEffect(() => {
        calculateAllocatedAmount();
    }, [formData]);

    return (
        <div className="p-6 max-w-5xl mx-auto">
            {/* Total Payment Received - Header Card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="col-span-2 bg-white rounded-lg border border-gray-200 shadow-sm p-5">
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">Payment Allocation</h3>
                    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                        <div className="flex-grow">
                            <label className="block text-sm font-medium text-gray-600 mb-1">
                                Total Payment Received
                            </label>
                            <input
                                type="number"
                                className="input input-bordered w-full bg-white"
                                placeholder="Enter total payment received"
                                value={totalPaymentReceived}
                                onChange={e => setTotalPaymentReceived(parseFloat(e.target.value) || 0)}
                            />
                        </div>
                        <div className="text-gray-600 text-sm mt-4 md:mt-0">
                            <div className="mb-1">
                                Total Project Cost: <span className="font-semibold">RM {totalProjectCost.toFixed(2)}</span>
                            </div>
                            <div>
                                Amount to Be Allocated: <span className={`font-semibold ${remainingToAllocate < 0 ? 'text-red-600' : remainingToAllocate === 0 ? 'text-green-600' : 'text-blue-600'}`}>
                                    RM {remainingToAllocate.toFixed(2)}
                                </span>
                                {remainingToAllocate < 0 && <span className="ml-2 text-xs text-red-600">Exceeded payment amount</span>}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200 shadow-sm p-5">
                    <h3 className="text-lg font-medium text-blue-800 mb-3">Allocation Summary</h3>
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span>Total Payment:</span>
                            <span className="font-medium">RM {totalPaymentReceived.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span>Total Allocated:</span>
                            <span className="font-medium">RM {allocatedAmount.toFixed(2)}</span>
                        </div>
                        <div className={`flex justify-between font-medium pt-2 border-t ${remainingToAllocate < 0 ? 'text-red-600' : remainingToAllocate > 0 ? 'text-yellow-600' : 'text-green-600'}`}>
                            <span>Remaining:</span>
                            <span>RM {remainingToAllocate.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Allocation Sections */}
            {["directCost", "finderReward", "managementFee"].map(key => {
                // Calculate section totals
                const sectionTotal = (formData[key] || []).reduce((sum, item) =>
                    sum + (parseFloat(item.allocatedAmount) || 0), 0);
                const sectionMaxTotal = (formData[key] || []).reduce((sum, item) =>
                    sum + (parseFloat(item.paymentAmount) || 0), 0);

                return (
                    <div key={key} className={sectionStyle}>
                        <div className={sectionHeader}>
                            <h3 className={sectionTitle}>
                                {key === "directCost"
                                    ? "Direct Cost Allocation"
                                    : key === "finderReward"
                                        ? "Finder Reward Allocation"
                                        : "Management Fee Allocation"}
                            </h3>
                            <div className="sectionTotal">
                                {sectionTotal.toFixed(2)} / {sectionMaxTotal.toFixed(2)} RM
                            </div>
                        </div>
                        <div className="p-4">
                            {(formData[key] || []).map((item, idx) => (
                                <div key={idx} className="mb-5 border-b border-gray-100 pb-6">
                                    <div className="flex flex-col sm:flex-row gap-4 mb-3">
                                        <div className="bg-gray-50 p-3 rounded-md flex-grow">
                                            <div className="font-medium text-gray-800">
                                                {key === "directCost" && item.item}
                                                {key === "finderReward" && `Finder: ${item.finderName}`}
                                                {key === "managementFee" && `Management: ${item.managedBy}`}
                                            </div>
                                            <div className="text-sm text-gray-500 mt-1">
                                                Cost amount: RM {item.paymentAmount.toFixed(2)}
                                            </div>
                                        </div>

                                        <div className="w-full sm:w-48">
                                            <label className="block text-sm font-medium text-gray-600 mb-1">
                                                Allocated Amount
                                            </label>
                                            <input
                                                type="number"
                                                className={`input input-bordered w-full text-right ${errors[`${key}-${idx}-allocatedAmount`] ? 'border-red-500 focus:ring-red-500' : ''}`}
                                                placeholder="0.00"
                                                value={item.allocatedAmount || ""}
                                                onChange={e =>
                                                    handleAllocationChange(
                                                        formData[key],
                                                        idx,
                                                        "allocatedAmount",
                                                        e.target.value,
                                                        key
                                                    )
                                                }
                                                min="0"
                                                max={item.paymentAmount}
                                            />
                                            {errors[`${key}-${idx}-allocatedAmount`] && (
                                                <p className="text-red-500 text-xs mt-1">{errors[`${key}-${idx}-allocatedAmount`]}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 bg-white p-3 rounded-md">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-1">Bank</label>
                                            <select
                                                className="select select-bordered w-full bg-white"
                                                value={item.bankName || ""}
                                                onChange={e =>
                                                    handleAllocationChange(
                                                        formData[key],
                                                        idx,
                                                        "bankName",
                                                        e.target.value,
                                                        key
                                                    )
                                                }
                                            >
                                                <option value="">Select Bank</option>
                                                {BANKS.map(bank => (
                                                    <option key={bank} value={bank}>{bank}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-1">
                                                Account Holder
                                            </label>
                                            <input
                                                type="text"
                                                className="input input-bordered w-full bg-white"
                                                placeholder="Account Holder Name"
                                                value={item.accountHolderName || ""}
                                                onChange={e =>
                                                    handleAllocationChange(
                                                        formData[key],
                                                        idx,
                                                        "accountHolderName",
                                                        e.target.value,
                                                        key
                                                    )
                                                }
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-1">
                                                Account Number
                                            </label>
                                            <input
                                                type="text"
                                                className="input input-bordered w-full bg-white"
                                                placeholder="Account Number"
                                                value={item.accountNumber || ""}
                                                onChange={e =>
                                                    handleAllocationChange(
                                                        formData[key],
                                                        idx,
                                                        "accountNumber",
                                                        e.target.value,
                                                        key
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {(formData[key] || []).length === 0 && (
                                <div className="text-gray-500 text-sm italic">No items to allocate</div>
                            )}
                        </div>
                    </div>
                );
            })}

            {/* Consultant Allocation */}
            <div className={sectionStyle}>
                <div className={sectionHeader}>
                    <h3 className={sectionTitle}>Consultant Allocation</h3>
                    <div className="sectionTotal">
                        {(formData.projectConsultant || []).reduce((sum, item) =>
                            sum + (parseFloat(item.allocatedAmount) || 0), 0).toFixed(2)} RM
                    </div>
                </div>
                <div className="p-4">
                    {(formData.projectConsultant || []).map((consultant, idx) => (
                        <div key={idx} className="mb-5 border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                            <div className="flex flex-col sm:flex-row gap-4 items-start">
                                <div className="bg-gray-50 p-3 rounded-md flex-grow">
                                    <div className="font-medium text-gray-800">
                                        {consultant.name}
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:gap-4">
                                        <div className="text-sm text-gray-600">
                                            <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                                {consultant.projectRole}
                                            </span>
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1">
                                            {consultant.bank.name ? `${consultant.bank.name}: ${consultant.bank.accNo || 'No account number'}` : 'No bank details'}
                                        </div>
                                    </div>
                                </div>

                                <div className="w-full sm:w-48">
                                    <label className="block text-sm font-medium text-gray-600 mb-1">
                                        Allocated Amount
                                    </label>
                                    <input
                                        type="number"
                                        className={`input input-bordered w-full text-right ${errors[`projectConsultant-${idx}-allocatedAmount`] ? 'border-red-500' : ''}`}
                                        placeholder="0.00"
                                        value={consultant.allocatedAmount || ""}
                                        onChange={e =>
                                            handleAllocationChange(
                                                formData.projectConsultant,
                                                idx,
                                                "allocatedAmount",
                                                e.target.value,
                                                "projectConsultant"
                                            )
                                        }
                                        min="0"
                                        max={consultant.paymentAmount}
                                    />
                                    {errors[`projectConsultant-${idx}-allocatedAmount`] && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors[`projectConsultant-${idx}-allocatedAmount`]}
                                        </p>
                                    )}
                                    <div className="text-sm text-gray-500 mt-1">
                                        Max: RM {consultant.paymentAmount.toFixed(2)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    {(formData.projectConsultant || []).length === 0 && (
                        <div className="text-gray-500 text-sm italic">No consultants to allocate payments to</div>
                    )}
                </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Payment Allocation Progress</span>
                    <span className="text-sm font-medium text-gray-700">
                        {Math.min(100, Math.round((allocatedAmount / totalPaymentReceived) * 100) || 0)}%
                    </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                        className={`h-2.5 rounded-full ${
                            allocatedAmount > totalPaymentReceived
                                ? 'bg-red-600'
                                : allocatedAmount === totalPaymentReceived && totalPaymentReceived > 0
                                    ? 'bg-green-600'
                                    : 'bg-blue-600'
                        }`}
                        style={{ width: `${Math.min(100, Math.round((allocatedAmount / totalPaymentReceived) * 100) || 0)}%` }}
                    ></div>
                </div>

                <div className="flex justify-between items-center mt-6">
                    <div className="text-sm text-gray-600">
                        <div className="font-semibold">Total Project Cost:</div>
                        <div>RM {totalProjectCost.toFixed(2)}</div>
                    </div>
                    <div className="text-sm text-gray-600">
                        <div className="font-semibold">Total Payment Received:</div>
                        <div>RM {totalPaymentReceived.toFixed(2)}</div>
                    </div>
                    <div className="text-sm text-gray-600">
                        <div className="font-semibold">Total Allocated:</div>
                        <div>RM {allocatedAmount.toFixed(2)}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InitialPaymentReceived;